import { Router } from 'express';
import { UserController } from '../controllers';
import { validateCreateUser, validateLoginUser, validateUpdateUser } from '../middlewares/dataValidator';
import authJwt from '../middlewares/authJwt';

export class UsersRoute {
  private userController: UserController;

  constructor(userController: UserController) {
    this.userController = userController;
  }

  createRouter(): Router {
    const router = Router();

    router.post('/users', validateCreateUser, this.userController.createUser.bind(this.userController));

    router.get('/users', authJwt.verifyToken, this.userController.getUsers.bind(this.userController));

    router.get('/users/:id', authJwt.verifyToken, this.userController.getUserById.bind(this.userController));

    router.put('/users/:id', authJwt.verifyAdminToken, validateUpdateUser, this.userController.updateUser.bind(this.userController));


    router.put('/user/me', authJwt.verifyLoggedToken, validateUpdateUser, this.userController.updateLoggedUser.bind(this.userController));

    router.patch('/user/password', authJwt.verifyLoggedToken, validateUpdateUser, this.userController.updateLoggedPass.bind(this.userController));

    router.post('/auth/login', validateLoginUser, this.userController.login.bind(this.userController));

    router.delete('/users/:id', authJwt.verifyAdminToken, this.userController.deleteUser.bind(this.userController));

    return router;
  }
}
