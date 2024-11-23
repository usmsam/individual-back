import express from 'express';
import { PrismaClient } from '@prisma/client';
import cors from 'cors'; // Импорт CORS
import userRoutes from './routes/user.js';
import companyRoutes from './routes/companies.js';
import vacancyRoutes from './routes/vacancies.js';
import applicationsRoutes from './routes/applications.js';
import resumeRoutes from './routes/resume.js';

import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';
import path from 'path';

import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'My API',
      version: '1.0.0',
      description: 'API documentation for my Express app',
    },
    servers: [
      {
        url: 'http://localhost:5000',
      },
    ],
  },
  apis: ['./routes/*.js'], // Путь к файлам с аннотациями
};

// Генерация документации
const swaggerSpec = swaggerJSDoc(swaggerOptions);

// Роут для Swagger UI
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(cors());
app.use(express.json());
app.use('/users', userRoutes);
app.use('/companies', companyRoutes);
app.use('/vacancies', vacancyRoutes);
app.use('/applications', applicationsRoutes);
app.use('/resumes', resumeRoutes);

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Swagger docs available at http://localhost:${PORT}/docs`);
});
