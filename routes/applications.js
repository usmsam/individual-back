import express from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const router = express.Router();

import { authenticateToken } from './authenticateToken.js';

/**
 * @swagger
 * tags:
 *   name: Applications
 *   description: Applications management API
 */

/**
 * @swagger
 * /applications:
 *   post:
 *     summary: Create a new application for a vacancy
 *     tags: [Applications]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               vacancyId:
 *                 type: integer
 *                 description: The ID of the vacancy the user is applying for
 *                 example: 2
 *               coverLetter:
 *                 type: string
 *                 description: The cover letter submitted by the user
 *                 example: "I am very interested in this position because..."
 *     responses:
 *       201:
 *         description: Application created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: The ID of the created application
 *                   example: 1
 *                 userId:
 *                   type: integer
 *                   description: The ID of the user who applied
 *                   example: 1
 *                 vacancyId:
 *                   type: integer
 *                   description: The ID of the applied vacancy
 *                   example: 2
 *                 coverLetter:
 *                   type: string
 *                   description: The cover letter of the application
 *                   example: "I am very interested in this position because..."
 *                 status:
 *                   type: string
 *                   description: The status of the application (initially "PENDING")
 *                   example: "PENDING"
 *       500:
 *         description: Something went wrong
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Something went wrong"
 */
router.post('/', authenticateToken, async (req, res) => {
  const { vacancyId, coverLetter } = req.body; // Получаем только `vacancyId` и `coverLetter`
  const userId = req.user.id; // `userId` из middleware

  try {
    const application = await prisma.application.create({
      data: {
        userId,
        vacancyId,
        coverLetter,
        status: 'PENDING', // Начальный статус отклика
      },
    });

    res.status(201).json(application);
  } catch (error) {
    console.error('Error creating application:', error);
    console.log(userId);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

/**
 * @swagger
 * /applications/{id}:
 *   patch:
 *     summary: Update the status of an application
 *     tags: [Applications]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the application to update
 *         schema:
 *           type: integer
 *           example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 description: The new status of the application
 *                 example: "APPROVED"
 *     responses:
 *       200:
 *         description: Application status updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: The ID of the updated application
 *                   example: 1
 *                 userId:
 *                   type: integer
 *                   description: The ID of the user who applied
 *                   example: 1
 *                 vacancyId:
 *                   type: integer
 *                   description: The ID of the vacancy the user applied for
 *                   example: 2
 *                 coverLetter:
 *                   type: string
 *                   description: The cover letter of the application
 *                   example: "I am very interested in this position because..."
 *                 status:
 *                   type: string
 *                   description: The updated status of the application
 *                   example: "APPROVED"
 *       400:
 *         description: Application not found or invalid status
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Application not found"
 *       500:
 *         description: Something went wrong
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Something went wrong"
 */
router.patch('/:id', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const updatedApplication = await prisma.application.update({
      where: { id: parseInt(id) },
      data: { status },
    });

    res.json(updatedApplication);
  } catch (error) {
    console.error('Error updating application status:', error);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

/**
 * @swagger
 * /applications/user/{userId}:
 *   get:
 *     summary: Get all applications made by a user
 *     tags: [Applications]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         description: The ID of the user whose applications are being retrieved
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: A list of applications made by the user
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     description: The ID of the application
 *                     example: 1
 *                   userId:
 *                     type: integer
 *                     description: The ID of the user who applied
 *                     example: 1
 *                   vacancyId:
 *                     type: integer
 *                     description: The ID of the vacancy the user applied for
 *                     example: 2
 *                   coverLetter:
 *                     type: string
 *                     description: The cover letter of the application
 *                     example: "I am very interested in this position because..."
 *                   status:
 *                     type: string
 *                     description: The current status of the application
 *                     example: "PENDING"
 *                   vacancy:
 *                     type: object
 *                     description: The vacancy related to the application
 *                     properties:
 *                       id:
 *                         type: integer
 *                         description: The ID of the vacancy
 *                         example: 2
 *                       title:
 *                         type: string
 *                         description: The title of the vacancy
 *                         example: "Software Engineer"
 *                       location:
 *                         type: string
 *                         description: The location of the vacancy
 *                         example: "New York"
 *       404:
 *         description: User not found or no applications found for the user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "User not found"
 *       500:
 *         description: Something went wrong
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Something went wrong"
 */
router.get('/user/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const applications = await prisma.application.findMany({
      where: { userId: parseInt(userId) },
      include: {
        vacancy: true, // Включаем информацию о вакансии
      },
    });

    res.json(applications);
  } catch (error) {
    console.error('Error fetching applications:', error);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

/**
 * @swagger
 * /applications/vacancy/{vacancyId}:
 *   get:
 *     summary: Get all applications for a specific vacancy
 *     tags: [Applications]
 *     parameters:
 *       - in: path
 *         name: vacancyId
 *         required: true
 *         description: The ID of the vacancy whose applications are being retrieved
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: A list of applications for the specified vacancy
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     description: The ID of the application
 *                     example: 1
 *                   userId:
 *                     type: integer
 *                     description: The ID of the user who applied
 *                     example: 2
 *                   vacancyId:
 *                     type: integer
 *                     description: The ID of the vacancy the user applied for
 *                     example: 3
 *                   coverLetter:
 *                     type: string
 *                     description: The cover letter of the application
 *                     example: "I am very interested in this position because..."
 *                   status:
 *                     type: string
 *                     description: The current status of the application
 *                     example: "PENDING"
 *                   user:
 *                     type: object
 *                     description: The user who applied for the vacancy
 *                     properties:
 *                       id:
 *                         type: integer
 *                         description: The ID of the user
 *                         example: 2
 *                       name:
 *                         type: string
 *                         description: The name of the user
 *                         example: "John Doe"
 *                       email:
 *                         type: string
 *                         description: The email of the user
 *                         example: "johndoe@example.com"
 *       404:
 *         description: Vacancy not found or no applications found for the vacancy
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Vacancy not found"
 *       500:
 *         description: Something went wrong
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Something went wrong"
 */
router.get('/vacancy/:vacancyId', async (req, res) => {
  const { vacancyId } = req.params;

  try {
    const applications = await prisma.application.findMany({
      where: { vacancyId: parseInt(vacancyId) },
      include: {
        user: true, // Включаем информацию о пользователе
      },
    });

    res.json(applications);
  } catch (error) {
    console.error('Error fetching applications:', error);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

export default router;
