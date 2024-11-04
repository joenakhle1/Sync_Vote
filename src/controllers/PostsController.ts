import { Request, Response } from 'express';
import { PostsService } from '../services';
import { validationResult } from 'express-validator';

export class PostsController {
  private postsService: PostsService;

  constructor(postsService: PostsService) {
    this.postsService = postsService;
  }

  ///// POSTS LOGIC HERE /////

  async createPost(request: Request, response: Response): Promise<void> {
    const errors = validationResult(request);

    if (!errors.isEmpty()) {
      response.status(400).json({
        status: 400,
        message: 'Bad request.',
        data: errors.array(),
      });
    } else {
      try {
        const { title, description, categories } = request.body;

        const postData = {
          title,
          description,
          categories,
          createdBy: request.userId,
        };

        const postResponse = await this.postsService.createPost(postData);

        response.status(postResponse.status).send({
          ...postResponse,
        });
      } catch (error) {
        response.status(500).json({
          status: 500,
          message: 'Internal server error',
          data: error
        });
      }
    }
  }

  async getPosts(request: Request, response: Response): Promise<void> {
    try {
      let postsResponse;
      const category = request.query.category;
      console.log('Category name');
      console.log(category);
      if (category !== undefined){
        postsResponse = await this.postsService.getPostsByCat(category);
      }else{
        postsResponse = await this.postsService.getPosts();
      }

      response.status(postsResponse.status).send({
        ...postsResponse,
      });
    } catch (error) {
      response.status(500).json({
        status: 500,
        message: 'Internal server error',
        data: error
      });
    }
  }

  async getCategories(request: Request, response: Response): Promise<void> {
    try {
      const categoriesResponse = await this.postsService.getCategories();

      response.status(categoriesResponse.status).send({
        ...categoriesResponse,
      });
    } catch (error) {
      response.status(500).json({
        status: 500,
        message: 'Internal server error',
        data: error
      });
    }
  }

  async getPostById(request: Request, response: Response): Promise<void> {
    try {
      if (request.params.id) {
        const postsResponse = await this.postsService.getPostById(request.params.id);

        response.status(postsResponse.status).send({
          ...postsResponse,
        });
      } else {
        response.status(404).json({
          status: 404,
          message: 'Post not found',
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

  async getPostByUser(request: Request, response: Response): Promise<void> {
    try {
      if (request.params.id) {
        const userPostsResponse = await this.postsService.getPostsByUser(request.params.id);

        response.status(userPostsResponse.status).send({
          ...userPostsResponse,
        });
      } else {
        response.status(404).json({
          status: 404,
          message: 'No Post by this user',
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


  async updatePost(request: Request, response: Response): Promise<void> {
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
          const postsResponse = await this.postsService.updatePost(request.params.id, updateData);

          response.status(postsResponse.status).send({
            ...postsResponse,
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

  async deletePost(request: Request, response: Response): Promise<void> {
    try {
      if (request.params.id) {
        const postsResponse = await this.postsService.deletePost(request.params.id);

        response.status(postsResponse.status).send({
          ...postsResponse,
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

  async addVotePost(request: Request, response: Response): Promise<void> {
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
          const postVoteResponse = await this.postsService.addVotePost(request.params.id, updateData);

          response.status(postVoteResponse.status).send({
            ...postVoteResponse,
          });
        } else {
          response.status(404).json({
            status: 404,
            message: 'Post not found',
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

  ///// COMMENTS LOGIC HERE /////

  async addCommentToPost(request: Request, response: Response): Promise<void> {
    const errors = validationResult(request);

    if (!errors.isEmpty()) {
      response.status(400).json({
        status: 400,
        message: 'Bad request.',
        data: errors.array(),
      });
    } else {
      try {
        const { description } = request.body;

        const commentData = {
          description,
          createdBy: request.userId
        };

        const commentIResponse = await this.postsService.addCommentToPost(commentData, request.params.postId);

        response.status(commentIResponse.status).send({
          ...commentIResponse,
        });
      } catch (error) {
        response.status(500).json({
          status: 500,
          message: 'Internal server error',
          data: error
        });
      }
    }
  }

  async getCommentById(request: Request, response: Response): Promise<void> {
    try {
      if (request.params.id) {
        const commentsResponse = await this.postsService.getCommentById(request.params.id);

        response.status(commentsResponse.status).send({
          ...commentsResponse,
        });
      } else {
        response.status(404).json({
          status: 404,
          message: 'Comment not found',
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

  async getCommentsOfPost(request: Request, response: Response): Promise<void> {
    try {
      if (request.params.id) {
        const postCommentsResponse = await this.postsService.getCommentsOfPost(request.params.id);

        response.status(postCommentsResponse.status).send({
          ...postCommentsResponse,
        });
      } else {
        response.status(404).json({
          status: 404,
          message: 'No Post by this user',
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

  async updateComment(request: Request, response: Response): Promise<void> {
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
          const commentResponse = await this.postsService.updateComment(request.params.id, updateData);

          response.status(commentResponse.status).send({
            ...commentResponse,
          });
        } else {
          response.status(404).json({
            status: 404,
            message: 'Comment not found',
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

  async addVoteComment(request: Request, response: Response): Promise<void> {
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
          const commentVoteResponse = await this.postsService.addVoteComment(request.params.id, updateData);

          response.status(commentVoteResponse.status).send({
            ...commentVoteResponse,
          });
        } else {
          response.status(404).json({
            status: 404,
            message: 'Comment not found',
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

  async deleteComment(request: Request, response: Response): Promise<void> {
    try {
      if (request.params.id) {
        const commentsResponse = await this.postsService.deleteComment(request.params.id);

        response.status(commentsResponse.status).send({
          ...commentsResponse,
        });
      } else {
        response.status(404).json({
          status: 404,
          message: 'Comment not found',
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
