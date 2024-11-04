import jwt, { JwtPayload } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { getUserIdFromSession } from '../utils/getSessionId';

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
    ID = await getUserIdFromSession('d6caf33f-9c88-48dc-8917-23b8827a7d5d');
    console.log("heyz", ID);
    if (req.userId === ID) {
      console.log("heyz");

      return res.status(401).json({
        status: 401,
        message: 'Unauthorized',
      });
    }
    next();
  } catch (e) {
    return res.status(401).json({
      status: 401,
      message: 'Unauthorized',
    });
  }
};

const authJwt = {
  verifyToken,
};

export default authJwt;
