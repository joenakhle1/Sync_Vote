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
    /**
     * @swagger
     * /posts:
     *   post:
     *     summary: Create a new post
     *     tags: [Posts]
     *     parameters:
     *       - in: header
     *         name: Authorization
     *         required: true
     *         description: Bearer "token for authentication"
     *         schema:
     *           type: string
     *     responses:
     *       201:
     *         description: Post created successfully
     *       401:
     *         description: Unauthorized
     */
    router.post('/posts', authJwt.verifyToken, validateCreatePost, this.postsController.createPost.bind(this.postsController));

    /**
     * @swagger
     * /posts/{id}/Vote:
     *   put:
     *     summary: Add a vote to a post
     *     tags: [Posts]
     *     parameters:
     *       - in: header
     *         name: Authorization
     *         required: true
     *         description: Bearer "Logged In token for authentication"
     *         schema:
     *           type: string
     *       - in: header
     *         name: session
     *         required: true
     *         description: Session ID got when logged in
     *         schema:
     *           type: string
     *       - in: path
     *         name: id
     *         required: true
     *         description: ID of the post to vote on
     *         schema:
     *           type: string
     *     responses:
     *       200:
     *         description: Vote added successfully
     *       401:
     *         description: Unauthorized
     */
    router.put('/posts/:id/Vote', authJwt.verifyLoggedToken, this.postsController.addVotePost.bind(this.postsController));

    /**
     * @swagger
     * /posts:
     *   get:
     *     summary: Retrieve all posts
     *     tags: [Posts]
     *     responses:
     *       200:
     *         description: A list of posts
     */
    router.get('/posts', this.postsController.getPosts.bind(this.postsController));

    /**
     * @swagger
     * /posts/{id}:
     *   get:
     *     summary: Retrieve a post by ID
     *     tags: [Posts]
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         description: ID of the post to retrieve
     *         schema:
     *           type: string
     *     responses:
     *       200:
     *         description: A single post
     */
    router.get('/posts/:id', this.postsController.getPostById.bind(this.postsController));

    /**
     * @swagger
     * /PostUser/{id}/posts:
     *   get:
     *     summary: Retrieve posts by user ID
     *     tags: [Posts]
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         description: ID of the user
     *         schema:
     *           type: string
     *     responses:
     *       200:
     *         description: A list of posts by the user
     */
    router.get('/PostUser/:id/posts', this.postsController.getPostByUser.bind(this.postsController));

    /**
     * @swagger
     * /posts/{id}:
     *   put:
     *     summary: Update a post
     *     tags: [Posts]
     *     parameters:
     *       - in: header
     *         name: Authorization
     *         required: true
     *         description: Bearer "token of admin or owner for authentication"
     *         schema:
     *           type: string
     *       - in: path
     *         name: id
     *         required: true
     *         description: ID of the post to update
     *         schema:
     *           type: string
     *     responses:
     *       200:
     *         description: Post updated successfully
     *       401:
     *         description: Unauthorized
     */
    router.put('/posts/:id', authJwt.verifyAdmin_OwnerToken_Post(this.db), validateUpdatePost, this.postsController.updatePost.bind(this.postsController));

    /**
     * @swagger
     * /categories:
     *   get:
     *     summary: Retrieve all categories
     *     tags: [Categories]
     *     responses:
     *       200:
     *         description: A list of categories
     */
    router.get('/categories', this.postsController.getCategories.bind(this.postsController));

    /**
     * @swagger
     * /posts/{id}:
     *   delete:
     *     summary: Delete a post
     *     tags: [Posts]
     *     parameters:
     *       - in: header
     *         name: Authorization
     *         required: true
     *         description: Bearer "token of admin or owner for authentication"
     *         schema:
     *           type: string
     *       - in: path
     *         name: id
     *         required: true
     *         description: ID of the post to delete
     *         schema:
     *           type: string
     *     responses:
     *       200:
     *         description: Post deleted successfully
     *       401:
     *         description: Unauthorized
     */
    router.delete('/posts/:id', authJwt.verifyAdmin_OwnerToken_Post(this.db), this.postsController.deletePost.bind(this.postsController));

    /////COMMENTS HERE //////

    /**
     * @swagger
     * /posts/{postId}/comments:
     *   post:
     *     summary: Add a comment to a post
     *     tags: [Comments]
     *     parameters:
     *       - in: header
     *         name: Authorization
     *         required: true
     *         description: Bearer "Logged In token for authentication"
     *         schema:
     *           type: string
     *       - in: header
     *         name: session
     *         required: true
     *         description: Session ID got when logged in
     *         schema:
     *           type: string
     *       - in: path
     *         name: postId
     *         required: true
     *         description: ID of the post to comment on
     *         schema:
     *           type: string
     *     responses:
     *       201:
     *         description: Comment added successfully
     *       401:
     *         description: Unauthorized
     */
    router.post('/posts/:postId/comments', authJwt.verifyLoggedToken, this.postsController.addCommentToPost.bind(this.postsController));

    /**
     * @swagger
     * /comments/{id}/Vote:
     *   put:
     *     summary: Add a vote to a comment
     *     tags: [Comments]
     *     parameters:
     *       - in: header
     *         name: Authorization
     *         required: true
     *         description: Bearer "Logged In token for authentication"
     *         schema:
     *           type: string
     *       - in: header
     *         name: session
     *         required: true
     *         description: Session ID got when logged in
     *         schema:
     *           type: string
     *       - in: path
     *         name: id
     *         required: true
     *         description: ID of the comment to vote on
     *         schema:
     *           type: string
     *     responses:
     *       200:
     *         description: Vote added successfully
     *       401:
     *         description: Unauthorized
     */
    router.put('/comments/:id/Vote', authJwt.verifyLoggedToken, this.postsController.addVoteComment.bind(this.postsController));

    /**
     * @swagger
     * /comments/{id}:
     *   get:
     *     summary: Retrieve a comment by ID
     *     tags: [Comments]
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         description: ID of the comment to retrieve
     *         schema:
     *           type: string
     *     responses:
     *       200:
     *         description: A single comment
     */
    router.get('/comments/:id', this.postsController.getCommentById.bind(this.postsController));

    /**
     * @swagger
     * /PostComments/{postId}/comments:
     *   get:
     *     summary: Retrieve comments of a post
     *     tags: [Comments]
     *     parameters:
     *       - in: path
     *         name: postId
     *         required: true
     *         description: ID of the post
     *         schema:
     *           type: string
     *     responses:
     *       200:
     *         description: A list of comments for the post
     */
    router.get('/PostComments/:postId/comments', this.postsController.getCommentsOfPost.bind(this.postsController));

    /**
     * @swagger
     * /comments/{id}:
     *   put:
     *     summary: Update a comment
     *     tags: [Comments]
     *     parameters:
     *       - in: header
     *         name: Authorization
     *         required: true
     *         description: Bearer "token of admin or owner for authentication"
     *         schema:
     *           type: string
     *       - in: path
     *         name: id
     *         required: true
     *         description: ID of the comment to update
     *         schema:
     *           type: string
     *     responses:
     *       200:
     *         description: Comment updated successfully
     *       401:
     *         description: Unauthorized
     */
    router.put('/comments/:id', authJwt.verifyAdmin_OwnerToken_Comment(this.db), validateUpdateComment, this.postsController.updateComment.bind(this.postsController));

    /**
     * @swagger
     * /comments/{id}:
     *   delete:
     *     summary: Delete a comment
     *     tags: [Comments]
     *     parameters:
     *       - in: header
     *         name: Authorization
     *         required: true
     *         description: Bearer "token of admin or owner for authentication"
     *         schema:
     *           type: string
     *       - in: path
     *         name: id
     *         required: true
     *         description: ID of the comment to delete
     *         schema:
     *           type: string
     *     responses:
     *       200:
     *         description: Comment deleted successfully
     *       401:
     *         description: Unauthorized
     */
    router.delete('/comments/:id', authJwt.verifyAdmin_OwnerToken_Comment(this.db), this.postsController.deleteComment.bind(this.postsController));

    return router;
  }
}
