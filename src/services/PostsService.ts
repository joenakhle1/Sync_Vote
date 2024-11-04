import { Post } from '../types/entities/Post';
import { Comment } from '../types/entities/Comment';
import { FirestoreCollections } from '../types/firestore';
import { IResBody } from '../types/api';
import { firestoreTimestamp } from '../utils/firestore-helpers';
import { Timestamp } from 'firebase/firestore';
import { categories } from '../constants/categories';

export class PostsService {
  private db: FirestoreCollections;

  constructor(db: FirestoreCollections) {
    this.db = db;
  }

  ///// POSTS LOGIC HERE /////
  async createPost(postData: Post): Promise<IResBody> {
    const postRef = this.db.posts.doc();
    await postRef.set({
      ...postData,
      voteCount: 0,
      createdAt: firestoreTimestamp.now(),
      updatedAt: firestoreTimestamp.now(),
    });

    return {
      status: 201,
      message: 'Post created successfully!',
    };
  }

  async getPosts(): Promise<IResBody> {
    const posts: Post[] = [];
    const postsQuerySnapshot = await this.db.posts.get();

    for (const doc of postsQuerySnapshot.docs) {
      posts.push({
        id: doc.id,
        ...doc.data(),
        createdAt: (doc.data()?.createdAt as Timestamp)?.toDate(),
        updatedAt: (doc.data()?.updatedAt as Timestamp)?.toDate(),
      });
    }

    return {
      status: 200,
      message: 'Posts retrieved successfully!',
      data: posts
    };
  }

  async getPostsByCat(Category: any): Promise<IResBody> {
    const posts: Post[] = [];
    const postsQuerySnapshot = await this.db.posts.where('createdBy', '==', Category).get();

    for (const doc of postsQuerySnapshot.docs) {
      posts.push({
        id: doc.id,
        ...doc.data(),
        createdAt: (doc.data()?.createdAt as Timestamp)?.toDate(),
        updatedAt: (doc.data()?.updatedAt as Timestamp)?.toDate(),
      });
    }

    return {
      status: 200,
      message: 'Posts retrieved successfully!',
      data: posts
    };
  }

  async getPostById(postId: string): Promise<IResBody> {

    const postDoc = await this.db.posts.doc(postId).get();

    return {
      status: 200,
      message: 'Post fetched successfully!',
      data: {
        id: postId,
        ...postDoc.data(),
      }
    };
  }

  async getPostsByUser(creatorId: string): Promise<IResBody> {

    const userPostDoc = await this.db.posts.where('createdBy', '==', creatorId).get();

    // Extract data from each document in the snapshot and put it in an array
    const posts = userPostDoc.docs.map(doc => ({
      id: doc.id,  // Include the document ID if needed
      ...doc.data()
    }));

    return {
      status: 200,
      message: 'User successfully!',
      data: {
        id: creatorId,
        posts: posts,
      }
    };
  }

  async getCategories(): Promise<IResBody> {
    return {
      status: 200,
      message: 'Categories retrieved successfully!',
      data: categories
    };
  }

  async updatePost(postId: any, updateData: Partial<Post>): Promise<IResBody> {
    try {
      const postRef = this.db.posts.doc(postId);
      const postDoc = await postRef.get();

      if (!postDoc.exists) {
        return {
          status: 404,
          message: 'postDoc not found',
        };
      }

      await postRef.update({
        ...updateData,
        updatedAt: firestoreTimestamp.now(),
      });

      const updatedPost =  postDoc.data();

      return {
        status: 200,
        message: 'Post updated successfully!',
        data: {
          id: postId,
          ...updatedPost,
        },
      };
    } catch (error) {
      return {
        status: 500,
        message: 'Internal server error',
        data: error,
      };
    }
  }

  async deletePost(postId: string): Promise<IResBody> {
    try {
      // Reference to the post document
      const postRef = this.db.posts.doc(postId);
      const postDoc = await postRef.get();

      // Check if the post exists
      if (!postDoc.exists) {
        return {
          status: 404,
          message: 'Post not found',
        };
      }

      // Delete the user document
      await postRef.delete();

      return {
        status: 200,
        message: 'Post deleted successfully!',
      };
    } catch (error) {
      return {
        status: 500,
        message: 'Internal server error',
        data: error,
      };
    }
  }
  async addVotePost(postId: any, updateData: Partial<Post>): Promise<IResBody> {
    try {
        const postRef = this.db.posts.doc(postId);
        const postDoc = await postRef.get();

        if (!postDoc.exists) {
            return {
                status: 404,
                message: 'post not found',
            };
        }

        // Get the current data of the post and handle the possible undefined case
        const currentPostData = postDoc.data();
        if (!currentPostData) {
            return {
                status: 404,
                message: 'Post data is undefined',
            };
        }

        // Check if updateData contains the voteCount property
        if ('voteCount' in updateData && updateData.voteCount !== undefined) {
            const currentVoteCount = currentPostData.voteCount || 0; // Default to 0 if not present

            // Update the vote count based on the value in updateData
            if (updateData.voteCount === 1) {
                await postRef.update({
                    voteCount: currentVoteCount + 1,
                    updatedAt: firestoreTimestamp.now(),
                });
            } else if (updateData.voteCount === -1) {
                await postRef.update({
                    voteCount: currentVoteCount - 1,
                    updatedAt: firestoreTimestamp.now(),
                });
            }
        }

        // Get the updated post data after modification
        const updatedPost = await postRef.get();

        return {
            status: 200,
            message: 'post updated successfully!',
            data: {
                id: postId,
                ...updatedPost.data(),
            },
        };
    } catch (error) {
        return {
            status: 500,
            message: 'Internal server error',
            data: error,
        };
    }
}

  //***************************//
  ///////////////////////////////
  ///// COMMENTS LOGIC HERE /////
  ///////////////////////////////
  //***************************//

  async addCommentToPost(commentData: any, postId: string): Promise<IResBody> {
    // logic to add comment
    const commentRef = this.db.comments.doc();
    await commentRef.set({
      ...commentData,
      voteCount: 0,
      postId: postId,
      createdAt: firestoreTimestamp.now(),
      updatedAt: firestoreTimestamp.now(),
    });
    return {
      status: 200,
      message: 'Comment added successfully!',
      data: categories
    };
  }

  async getCommentById(commentId: string): Promise<IResBody> {

    const commentDoc = await this.db.comments.doc(commentId).get();

    return {
      status: 200,
      message: 'Comment fetched successfully!',
      data: {
        id: commentId,
        ...commentDoc.data(),
      }
    };
  }

  async getCommentsOfPost(PostId: string): Promise<IResBody> {

    const postCommentsDoc = await this.db.comments.where('postId', '==', PostId).get();

    // Extract data from each document in the snapshot and put it in an array
    const posts = postCommentsDoc.docs.map(doc => ({
      id: doc.id,  // Include the document ID if needed
      ...doc.data()
    }));

    return {
      status: 200,
      message: 'Comments fetched successfully successfully!',
      data: {
        id: PostId,
        posts: posts,
      }
    };
  }

  async updateComment(commentId: any, updateData: Partial<Comment>): Promise<IResBody> {
    try {
      const commentRef = this.db.comments.doc(commentId);
      const commentDoc = await commentRef.get();

      if (!commentDoc.exists) {
        return {
          status: 404,
          message: 'CommentDoc not found',
        };
      }

      await commentRef.update({
        ...updateData,
        updatedAt: firestoreTimestamp.now(),
      });

      const updatedComment =  commentDoc.data();

      return {
        status: 200,
        message: 'Comment updated successfully!',
        data: {
          id: commentId,
          ...updatedComment,
        },
      };
    } catch (error) {
      return {
        status: 500,
        message: 'Internal server error',
        data: error,
      };
    }
  }

  async addVoteComment(commentId: any, updateData: Partial<Comment>): Promise<IResBody> {
    try {
        const commentRef = this.db.comments.doc(commentId);
        const commentDoc = await commentRef.get();

        if (!commentDoc.exists) {
            return {
                status: 404,
                message: 'Comment not found',
            };
        }

        // Get the current data of the comment and handle the possible undefined case
        const currentCommentData = commentDoc.data();
        if (!currentCommentData) {
            return {
                status: 404,
                message: 'Comment data is undefined',
            };
        }

        // Check if updateData contains the voteCount property
        if ('voteCount' in updateData && updateData.voteCount !== undefined) {
            const currentVoteCount = currentCommentData.voteCount || 0; // Default to 0 if not present

            // Update the vote count based on the value in updateData
            if (updateData.voteCount === 1) {
                await commentRef.update({
                    voteCount: currentVoteCount + 1,
                    updatedAt: firestoreTimestamp.now(),
                });
            } else if (updateData.voteCount === -1) {
                await commentRef.update({
                    voteCount: currentVoteCount - 1,
                    updatedAt: firestoreTimestamp.now(),
                });
            }
        }

        // Get the updated comment data after modification
        const updatedComment = await commentRef.get();

        return {
            status: 200,
            message: 'Comment updated successfully!',
            data: {
                id: commentId,
                ...updatedComment.data(),
            },
        };
    } catch (error) {
        return {
            status: 500,
            message: 'Internal server error',
            data: error,
        };
    }
}



  async deleteComment(commentId: string): Promise<IResBody> {
    try {
      // Reference to the comment document
      const commentRef = this.db.comments.doc(commentId);
      const commentDoc = await commentRef.get();

      // Check if the post exists
      if (!commentDoc.exists) {
        return {
          status: 404,
          message: 'Comment not found',
        };
      }

      // Delete the user document
      await commentRef.delete();

      return {
        status: 200,
        message: 'Comment deleted successfully!',
      };
    } catch (error) {
      return {
        status: 500,
        message: 'Internal server error',
        data: error,
      };
    }
  }
}

