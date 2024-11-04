import { Router } from 'express';
import { PostsController } from '../controllers';
import { validateCreatePost, validateUpdatePost, validateUpdateComment } from '../middlewares/dataValidator';
import authJwt from '../middlewares/authJwt';
import { FirestoreCollections } from '../types/firestore'; // Import the Firestore type

export class PostsRoute {
  private postsController: PostsController;
  private db: FirestoreCollections; // Add db as a property

  constructor(postsController: PostsController, db: FirestoreCollections) {
    this.postsController = postsController;
    this.db = db; // Initialize db
  }

  createRouter(): Router {
    const router = Router();

    ///// POSTS HERE //////
    router.post('/posts', authJwt.verifyToken, validateCreatePost, this.postsController.createPost.bind(this.postsController));

    router.put('/posts/:id/Vote', authJwt.verifyLoggedToken, this.postsController.addVotePost.bind(this.postsController));

    router.get('/posts', this.postsController.getPosts.bind(this.postsController));

    router.get('/posts/:id', this.postsController.getPostById.bind(this.postsController));

    router.get('/PostUser/:id/posts', this.postsController.getPostByUser.bind(this.postsController));

    router.put('/posts/:id', authJwt.verifyAdmin_OwnerToken_Post(this.db), validateUpdatePost, this.postsController.updatePost.bind(this.postsController));

    router.get('/categories', this.postsController.getCategories.bind(this.postsController));

    router.delete('/posts/:id', authJwt.verifyAdmin_OwnerToken_Post(this.db), this.postsController.deletePost.bind(this.postsController));

    /////COMMENTS HERE //////

    router.post('/posts/:postId/comments', authJwt.verifyLoggedToken, this.postsController.addCommentToPost.bind(this.postsController));

    router.put('/comments/:id/Vote', authJwt.verifyLoggedToken, this.postsController.addVoteComment.bind(this.postsController));

    router.get('/comments/:id', this.postsController.getCommentById.bind(this.postsController));

    router.get('/PostComments/:postId/comments', this.postsController.getCommentsOfPost.bind(this.postsController));

    router.put('/comments/:id', authJwt.verifyAdmin_OwnerToken_Comment(this.db), validateUpdateComment, this.postsController.updateComment.bind(this.postsController));

    router.delete('/comments/:id', authJwt.verifyAdmin_OwnerToken_Comment(this.db), this.postsController.deleteComment.bind(this.postsController));

    return router;
  }
}
