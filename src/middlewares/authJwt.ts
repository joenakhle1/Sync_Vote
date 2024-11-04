import jwt, { JwtPayload } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { getUserIdFromSession } from '../utils/getSessionId';
import { FirestoreCollections } from '../types/firestore';


interface DecodeToken extends JwtPayload {
  id: string;
  role: string;
}



let ID: any;
const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
  try {

    const token = req.headers.authorization;

    if (!token) {
      return res.status(401).json({
        status: 401,
        message: 'Unauthorized',
      });
    }

    const tokenParts = token.split(' ');

    if (tokenParts.length !== 2 || tokenParts[0] !== 'Bearer') {
      return res.status(401).json({
        status: 401,
        message: 'Unauthorized',
      });
    }

    const decode = jwt.verify(tokenParts[1], process.env.SECRET_KEY || '') as DecodeToken;

    req.userId = decode.id;
    req.userRole = decode.role;
    ID = await getUserIdFromSession('21e25a9c-2e10-4128-9d13-95a587316f79');
    next();
  } catch (e) {
    return res.status(401).json({
      status: 401,
      message: 'Unauthorized',
    });
  }
};

// Function to validate admin role
const verifyAdminToken = (req: Request, res: Response, next: NextFunction) => {
  verifyToken(req, res, () => {
    if (req.userRole !== 'admin') {
      return res.status(403).json({
        status: 403,
        message: 'Forbidden: Admins only',
      });
    }
    next();
  });
};

// Function to validate admin role
const verifyLoggedToken = (req: Request, res: Response, next: NextFunction) => {
  verifyToken(req, res, () => {

    if (req.userId !== ID) {
      return res.status(403).json({
        status: 403,
        message: 'Forbidden: this is not your profile',
      });
    }
    next();
  });

};

const verifyAdmin_OwnerToken_Post = (db: FirestoreCollections) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await verifyToken(req, res, async () => {
        // Fetch data from the database using the post ID
        const postSnapshot = await db.posts.doc(req.params.id).get();

        if (!postSnapshot.exists) {
          return res.status(404).json({
            status: 404,
            message: 'Post not found',
          });
        }

        const postData = postSnapshot.data();
        if (req.userRole !== 'admin' && req.userId !== postData?.createdBy) {
          return res.status(403).json({
            status: 403,
            message: 'Forbidden: Admins or owners only',
          });
        }
        next();
      });
    } catch (error) {
      res.status(500).json({
        status: 500,
        message: 'Internal server error',
        data: error,
      });
    }
  };
};

const verifyAdmin_OwnerToken_Comment = (db: FirestoreCollections) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await verifyToken(req, res, async () => {
        // Fetch data from the database using the comment ID
        const commentSnapshot = await db.comments.doc(req.params.id).get();

        if (!commentSnapshot.exists) {
          return res.status(404).json({
            status: 404,
            message: 'Comment not found',
          });
        }

        const commentData = commentSnapshot.data();
        if (req.userRole !== 'admin' && req.userId !== commentData?.createdBy) {
          return res.status(403).json({
            status: 403,
            message: 'Forbidden: Admins or owners only',
          });
        }
        next();
      });
    } catch (error) {
      res.status(500).json({
        status: 500,
        message: 'Internal server error',
        data: error,
      });
    }
  };
};


const authJwt = {
  verifyToken,
  verifyAdminToken,
  verifyLoggedToken,
  verifyAdmin_OwnerToken_Post,
  verifyAdmin_OwnerToken_Comment,
};

export default authJwt;
