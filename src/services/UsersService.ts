import { User } from '../types/entities/User';
import { FirestoreCollections } from '../types/firestore';
import { IResBody } from '../types/api';
import { firestoreTimestamp } from '../utils/firestore-helpers';
import {comparePasswords, encryptPassword} from '../utils/password';
import { formatUserData } from '../utils/formatData';
import { generateToken } from '../utils/jwt';
import { RedisClientType } from 'redis';
import { v4 as uuidv4 } from 'uuid'; // If you want to generate a unique session ID
import { getUserIdFromSession } from '../utils/getSessionId';


export class UsersService {
  private db: FirestoreCollections;
  private redisClient: RedisClientType;

  constructor(db: FirestoreCollections, redisClient: RedisClientType) {
    this.db = db;
    this.redisClient = redisClient;
  }

  async createUser(userData: User): Promise<IResBody> {
    const usersQuerySnapshot = await this.db
      .users.where('email', '==', userData.email).get();

    if (usersQuerySnapshot.empty) {
      const userRef = this.db.users.doc();
      await userRef.set({
        ...userData,
        password: encryptPassword(userData.password as string),
        role: 'member',
        createdAt: firestoreTimestamp.now(),
        updatedAt: firestoreTimestamp.now(),
      });

      return {
        status: 201,
        message: 'User created successfully!',
      };
    } else {
      return {
        status: 409,
        message: 'User already exists',
      }
    }
  }

  async getUsers(): Promise<IResBody> {
    const cacheKey = 'users';
    let users: User[] = [];

    const cachedUsers = await this.redisClient.get(cacheKey);

    if(cachedUsers) {
      users = JSON.parse(cachedUsers);
    } else {
      const usersQuerySnapshot = await this.db.users.get();

      for (const doc of usersQuerySnapshot.docs) {
        const formattedUser = formatUserData(doc.data());

        users.push({
          id: doc.id,
          ...formattedUser,
        });
      }

      await this.redisClient.set(cacheKey, JSON.stringify(users), {
        EX: 3600
      });
    }

    return {
      status: 200,
      message: 'Users retrieved successfully!',
      data: users
    };
  }


  async login(userData: { email: string; password: string }): Promise<IResBody> {
    const { email, password } = userData;

    const usersQuerySnapshot = await this.db.users.where('email', '==', email).get();

    if (usersQuerySnapshot.empty) {
        return {
            status: 401,
            message: 'Unauthorized',
        };
    } else {
        const isPasswordValid = comparePasswords(
            password,
            usersQuerySnapshot.docs[0].data().password as string,
        );

        if (isPasswordValid) {
            const formattedUser = formatUserData(usersQuerySnapshot.docs[0].data());
            const userId = usersQuerySnapshot.docs[0].id;

            // Generate a session token (you can use JWT or any random string)
            const sessionId = uuidv4(); // Generate a unique session ID

            // Store the user ID in Redis with an expiration time (e.g., 1 hour)
            await this.redisClient.setEx(sessionId, 3600, userId);

            return {
                status: 200,
                message: 'User logged in successfully!',
                data: {
                    user: {
                        ...formattedUser,
                    },
                    token: generateToken(userId, formattedUser.role), // Your existing token generation
                    sessionId, // Include the session ID in the response
                },
            };
        } else {
            return {
                status: 401,
                message: 'Unauthorized!',
            };
        }
    }
  }


  async getUserById(userId: string): Promise<IResBody> {

    const userDoc = await this.db.users.doc(userId).get();
    const formattedUser = formatUserData(userDoc.data());

    return {
      status: 200,
      message: 'User successfully!',
      data: {
        id: userId,
        ...formattedUser
      }
    };
  }

  async updateUser(userId: any, updateData: Partial<User>): Promise<IResBody> {
    try {
      const userRef = this.db.users.doc(userId);
      const userDoc = await userRef.get();

      if (!userDoc.exists) {
        return {
          status: 404,
          message: 'UserDoc not found',
        };
      }

      await userRef.update({
        ...updateData,
        updatedAt: firestoreTimestamp.now(),
      });

      const updatedUser = formatUserData((await userRef.get()).data());

      return {
        status: 200,
        message: 'User updated successfully!',
        data: {
          id: userId,
          ...updatedUser,
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


  async updateUserPass(userId: any, updateData: Partial<User>): Promise<IResBody> {
    try {
      const userRef = this.db.users.doc(userId);
      const userDoc = await userRef.get();

      if (!userDoc.exists) {
        return {
          status: 404,
          message: 'User not found',
        };
      }

      updateData.password = encryptPassword(updateData.password as string)
      await userRef.update({
        ...updateData,
        updatedAt: firestoreTimestamp.now(),
      });

      const updatedUser = formatUserData((await userRef.get()).data());

      return {
        status: 200,
        message: 'User updated successfully!',
        data: {
          id: userId,
          ...updatedUser,
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


  async deleteUser(userId: string): Promise<IResBody> {
    try {
      // Reference to the user document
      const userRef = this.db.users.doc(userId);
      const userDoc = await userRef.get();

      // Check if the user exists
      if (!userDoc.exists) {
        return {
          status: 404,
          message: 'User not found',
        };
      }

      // Delete the user document
      await userRef.delete();

      // Optionally, remove any related data from Redis
      await this.redisClient.del(userId);

      return {
        status: 200,
        message: 'User deleted successfully!',
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
