import { Router } from 'express';
import { UserController } from '../controllers';
import { validateCreateUser, validateLoginUser, validateUpdateUser } from '../middlewares/dataValidator';
import authJwt from '../middlewares/authJwt';

/**
 * UsersRoute class for handling user-related routes.
 */
export class UsersRoute {
  private userController: UserController;

  /**
   * Creates an instance of UsersRoute.
   * @param {UserController} userController - The controller for user operations.
   */
  constructor(userController: UserController) {
    this.userController = userController;
  }

  /**
   * Creates the router for user-related routes.
   * @returns {Router} The configured router for user routes.
   */
  createRouter(): Router {
    const router = Router();

    /**
     * @swagger
     * /users:
     *   post:
     *     summary: Create a new user
     *     tags: [Users]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               name:
     *                 type: string
     *               email:
     *                 type: string
     *               password:
     *                 type: string
     *     responses:
     *       201:
     *         description: The created user object
     *       400:
     *         description: Invalid input
     */
    router.post('/users', validateCreateUser, this.userController.createUser.bind(this.userController));

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Retrieve all users
 *     tags: [Users]
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         required: true
 *         description: Bearer "token for authentication"
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: The list of users
 *       401:
 *         description: Unauthorized
 */
    router.get('/users', authJwt.verifyToken, this.userController.getUsers.bind(this.userController));

    /**
     * @swagger
     * /users/{id}:
     *   get:
     *     summary: Retrieve a user by ID
     *     tags: [Users]
     *     parameters:
     *       - name: id
     *         in: path
     *         required: true
     *         description: The user ID
     *         schema:
     *           type: string
     *       - in: header
     *         name: Authorization
     *         required: true
     *         description: Bearer "token for authentication"
     *         schema:
     *           type: string
     *     responses:
     *       200:
     *         description: The user object
     *       401:
     *         description: Unauthorized
     *       404:
     *         description: User not found
     */
    router.get('/users/:id', authJwt.verifyToken, this.userController.getUserById.bind(this.userController));

    /**
     * @swagger
     * /users/{id}:
     *   put:
     *     summary: Update a user by ID
     *     tags: [Users]
     *     parameters:
     *       - name: id
     *         in: path
     *         required: true
     *         description: The user ID
     *         schema:
     *           type: string
     *       - in: header
     *         name: Authorization
     *         required: true
     *         description: Bearer "admin token for authentication"
     *         schema:
     *           type: string
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               name:
     *                 type: string
     *               email:
     *                 type: string
     *               password:
     *                 type: string
     *     responses:
     *       200:
     *         description: The updated user object
     *       401:
     *         description: Unauthorized
     *       403:
     *         description: Forbidden
     *       404:
     *         description: User not found
     */
    router.put('/users/:id', authJwt.verifyAdminToken, validateUpdateUser, this.userController.updateUser.bind(this.userController));

    /**
     * @swagger
     * /user/me:
     *   put:
     *     summary: Update the logged-in user's information
     *     tags: [Users]
     *     parameters:
     *       - in: header
     *         name: Authorization
     *         required: true
     *         description: Bearer "Logged in token for authentication"
     *         schema:
     *           type: string
     *       - in: header
     *         name: session
     *         required: true
     *         description: Session ID got when logged in
     *         schema:
     *           type: string
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               name:
     *                 type: string
     *               email:
     *                 type: string
     *               password:
     *                 type: string
     *     responses:
     *       200:
     *         description: The updated user object
     *       401:
     *         description: Unauthorized
     */
    router.put('/user/me', authJwt.verifyLoggedToken, validateUpdateUser, this.userController.updateLoggedUser.bind(this.userController));

    /**
     * @swagger
     * /user/password:
     *   patch:
     *     summary: Update the logged-in user's password
     *     tags: [Users]
     *     parameters:
     *       - in: header
     *         name: Authorization
     *         required: true
     *         description: Bearer "Logged in token for authentication"
     *         schema:
     *           type: string
     *       - in: header
     *         name: session
     *         required: true
     *         description: Session ID got when logged in
     *         schema:
     *           type: string
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               password:
     *                 type: string
     *     responses:
     *       200:
     *         description: The updated user object
     *       401:
     *         description: Unauthorized
     */
    router.patch('/user/password', authJwt.verifyLoggedToken, validateUpdateUser, this.userController.updateLoggedPass.bind(this.userController));

    /**
     * @swagger
     * /auth/login:
     *   post:
     *     summary: Login a user
     *     tags: [Authentication]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               email:
     *                 type: string
     *               password:
     *                 type: string
     *     responses:
     *       200:
     *         description: The logged-in user object
     *       400:
     *         description: Invalid credentials
     */
    router.post('/auth/login', validateLoginUser, this.userController.login.bind(this.userController));

    /**
     * @swagger
     * /users/{id}:
     *   delete:
     *     summary: Delete a user by ID
     *     tags: [Users]
     *     parameters:
     *       - name: id
     *         in: path
     *         required: true
     *         description: The user ID
     *         schema:
     *           type: string
     *       - in: header
     *         name: Authorization
     *         required: true
     *         description: Bearer "admin token for authentication"
     *         schema:
     *           type: string
     *     responses:
     *       200:
     *         description: User deleted successfully
     *       401:
     *         description: Unauthorized
     *       403:
     *         description: Forbidden
     *       404:
     *         description: User not found
     */
    router.delete('/users/:id', authJwt.verifyAdminToken, this.userController.deleteUser.bind(this.userController));

    return router;
  }
}
