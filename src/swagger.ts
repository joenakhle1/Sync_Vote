import swaggerJSDoc from 'swagger-jsdoc';

const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0', // Specify the version of OpenAPI
    info: {
      title: 'My API', // Title of the API
      version: '1.0.0', // Version of the API
      description: 'API documentation for my project', // Description of the API
    },
    servers: [
      {
        url: 'http://localhost:8080', // Base URL of the API
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT', // Format for the token
        },
        CustomHeader: {
          type: 'apiKey',
          in: 'header',
          name: 'X_Custom-Header', // Name of the custom header
          description: 'Custom header for client-specific data',
        },
      },
    },
    security: [
      {
        BearerAuth: [], // Apply BearerAuth globally
        CustomHeader: [], // Apply CustomHeader globally
      },
    ],
  },
  apis: ['./src/routes/*.ts'], // Path to the API docs
};

const swaggerDocs = swaggerJSDoc(swaggerOptions);
export default swaggerDocs;
