import { Request, Response } from 'express';
import { UsersService } from '../services';
import { validationResult } from 'express-validator';
import { getUserIdFromSession } from '../utils/getSessionId';


/**
 * Controller for managing user-related operations.
 */
export class UserController {
  private usersService: UsersService;

  /**
   * Creates an instance of UserController.
   * @param {UsersService} usersService - The service for user operations.
   */
  constructor(usersService: UsersService) {
    this.usersService = usersService;
  }

  /**
   * Creates a new user.
   *
   * @async
   * @param {Request} request - The request object containing user data.
   * @param {Response} response - The response object for sending results.
   * @returns {Promise<void>}
   */
  async createUser(request: Request, response: Response): Promise<void> {
    const errors = validationResult(request);

    if (!errors.isEmpty()) {
      response.status(400).json({
        status: 400,
        message: 'Bad request.',
        data: errors.array(),
      });
    } else {
      try {
        const { email, password, username } = request.body;

        const userData = { email, password, username };

        const userResponse = await this.usersService.createUser(userData);

        response.status(userResponse.status).send({
          ...userResponse,
        });
      } catch (error) {
        response.status(500).json({
          status: 500,
          message: 'Internal server error',
          data: error,
        });
      }
    }
  }

  /**
   * Retrieves all users.
   *
   * @async
   * @param {Request} request - The request object.
   * @param {Response} response - The response object for sending results.
   * @returns {Promise<void>}
   */
  async getUsers(request: Request, response: Response): Promise<void> {
    try {
      const usersResponse = await this.usersService.getUsers();

      response.status(usersResponse.status).send({
        ...usersResponse,
      });
    } catch (error) {
      response.status(500).json({
        status: 500,
        message: 'Internal server error',
        data: error,
      });
    }
  }

  /**
   * Retrieves a user by their ID.
   *
   * @async
   * @param {Request} request - The request object containing the user ID.
   * @param {Response} response - The response object for sending results.
   * @returns {Promise<void>}
   */
  async getUserById(request: Request, response: Response): Promise<void> {
    try {
      if (request.params.id) {
        const usersResponse = await this.usersService.getUserById(request.params.id);

        response.status(usersResponse.status).send({
          ...usersResponse,
        });
      } else {
        response.status(404).json({
          status: 404,
          message: 'User not found',
        });
      }
    } catch (error) {
      response.status(500).json({
        status: 500,
        message: 'Internal server error',
        data: error,
      });
    }
  }

  async deleteUser(request: Request, response: Response): Promise<void> {
    try {
      if (request.params.id) {
        const usersResponse = await this.usersService.deleteUser(request.params.id);

        response.status(usersResponse.status).send({
          ...usersResponse,
        });
      } else {
        response.status(404).json({
          status: 404,
          message: 'User not found',
        });
      }
    } catch (error) {
      response.status(500).json({
        status: 500,
        message: 'Internal server error',
        data: error,
      });
    }
  }

  /**
   * Updates a user by their ID.
   *
   * @async
   * @param {Request} request - The request object containing the user ID and update data.
   * @param {Response} response - The response object for sending results.
   * @returns {Promise<void>}
   */
  async updateUser(request: Request, response: Response): Promise<void> {
    const errors = validationResult(request);

    if (!errors.isEmpty()) {
      response.status(400).json({
        status: 400,
        message: 'Bad request.',
        data: errors.array(),
      });
    } else {
      try {
        if (request.params.id) {
          const updateData = request.body;
          const usersResponse = await this.usersService.updateUser(request.params.id, updateData);

          response.status(usersResponse.status).send({
            ...usersResponse,
          });
        } else {
          response.status(404).json({
            status: 404,
            message: 'chakib not found',
          });
        }
      } catch (error) {
        response.status(500).json({
          status: 500,
          message: 'Internal server error',
          data: error,
        });
      }
    }
  }

  /**
   * Updates a Logged in user.
   *
   * @async
   * @param {Request} request - The request object containing the user ID and update data.
   * @param {Response} response - The response object for sending results.
   * @returns {Promise<void>}
   */
  async updateLoggedUser(request: Request, response: Response): Promise<void> {
    const errors = validationResult(request);

    if (!errors.isEmpty()) {
      response.status(400).json({
        status: 400,
        message: 'Bad request.',
        data: errors.array(),
      });
    } else {
      try {
        if (await getUserIdFromSession('be1a291a-437c-4fa6-9b69-62eabc117dfd')) {
          const updateData = request.body;
          const usersResponse = await this.usersService.updateUser(await getUserIdFromSession('be1a291a-437c-4fa6-9b69-62eabc117dfd'), updateData);

          response.status(usersResponse.status).send({
            ...usersResponse,
          });
        } else {
          response.status(404).json({
            status: 404,
            message: 'Userwill not found',
          });
        }
      } catch (error) {
        response.status(500).json({
          status: 500,
          message: 'Internal server error',
          data: error,
        });
      }
    }
  }

  /**
   * Updates a Logged in user's password.
   *
   * @async
   * @param {Request} request - The request object containing the user ID and update data.
   * @param {Response} response - The response object for sending results.
   * @returns {Promise<void>}
   */
  async updateLoggedPass(request: Request, response: Response): Promise<void> {
    const errors = validationResult(request);

    if (!errors.isEmpty()) {
      response.status(400).json({
        status: 400,
        message: 'Bad request.',
        data: errors.array(),
      });
    } else {
      try {
        if (await getUserIdFromSession('21e25a9c-2e10-4128-9d13-95a587316f79')) {
          const updateData = request.body;
          const usersResponse = await this.usersService.updateUserPass(await getUserIdFromSession('21e25a9c-2e10-4128-9d13-95a587316f79'), updateData);

          response.status(usersResponse.status).send({
            ...usersResponse,
          });
        } else {
          response.status(404).json({
            status: 404,
            message: 'User found',
          });
        }
      } catch (error) {
        response.status(500).json({
          status: 500,
          message: 'Internal server error',
          data: error,
        });
      }
    }
  }

  /**
   * Logs in a user.
   *
   * @async
   * @param {Request} request - The request object containing user credentials.
   * @param {Response} response - The response object for sending results.
   * @returns {Promise<void>}
   */
  async login(request: Request, response: Response): Promise<void> {
    const errors = validationResult(request);

    if (!errors.isEmpty()) {
      response.status(400).json({
        status: 400,
        message: 'Bad request.',
        data: errors.array(),
      });
    } else {
      try {
        const { email, password } = request.body;
        const userData = { email, password };

        const userResponse = await this.usersService.login(userData);

        response.status(userResponse.status).json({
          ...userResponse,
        });
      } catch (error) {
        response.status(500).json({
          status: 500,
          message: 'Internal server error',
          data: error,
        });
      }
    }
  }
}
