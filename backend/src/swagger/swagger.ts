import swaggerJSDoc from 'swagger-jsdoc';
import { config } from '../config';

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Expense Voucher Management System API',
      version: '1.0.0',
      description: 'Production-grade RESTful API for digitized expense voucher creation, approval, and reimbursement tracking.',
    },
    servers: [
      {
        url: `http://localhost:${config.PORT}/api/v1`,
        description: 'Local Development Server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./src/modules/**/*.routes.ts', './src/modules/**/*.schema.ts'],
};

export const swaggerSpec = swaggerJSDoc(options);
