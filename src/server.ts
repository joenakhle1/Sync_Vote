import express, { Request, Response } from 'express';
import session from 'express-session';
import * as _dotenv from 'dotenv';
import cors from 'cors';
import http from 'http';
import morgan from 'morgan';
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');


_dotenv.config();

import { initializeRoutes } from './initializeRoutes';
import { db } from './utils/firestore-helpers';
import { client as redisClient } from './utils/redis-client';

if (!process.env.PORT) {
  console.log('No port value specified, default port will be chosen...');
}

const PORT = parseInt(process.env.PORT as string, 10) || 8080;
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || 'http://localhost:3000';

const app = express();

app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(session({
  secret: 'Harrypotteristhebestmovie', // Change this to a strong secret for your app
  resave: false, // Prevents saving session if it hasn't been modified
  saveUninitialized: true, // Saves uninitialized sessions to the store
  cookie: {
    maxAge: 3600000, // Sets session expiration time in milliseconds (e.g., 1 hour)
    httpOnly: true, // Helps protect against XSS attacks
  },
}));

// Swagger definition
const swaggerOptions = {
  swaggerDefinition: {
      openapi: '3.0.0',
      info: {
          title: 'SyncVote API',
          version: '1.0.0',
          description: 'API for the SyncVote discussion platform',
      },
      servers: [
          {
              url: 'http://localhost:8080', // Change to your server's URL
          },
      ],
  },
  apis: ['./src/routes/**/*.ts', './src/controllers/**/*.ts', './src/middlewares/**/*.ts', './src/constants/**/*.ts', './src/scripts/**/*.ts', './src/services/**/*.ts', './src/types/**/*.ts', './src/utils/**/*.ts',], // Include all routes and controllers
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));


app.use(
  cors({
    origin: ALLOWED_ORIGIN,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

const startRedis = async () => {
  try {
    await redisClient.connect();

    const pong = await redisClient.ping();
    console.log('Redis server:', pong);

  } catch (error) {
    console.error('Error with redis:', error);
  }
};

startRedis();

const {
  usersRoute,
  postsRoute
} = initializeRoutes(db, redisClient);

app.use(usersRoute.createRouter());
app.use(postsRoute.createRouter());

app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

app.use((err: Error, req: Request, res: Response) => {
  console.error('Error:', err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

const server = http.createServer(app);
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}/`);
});
