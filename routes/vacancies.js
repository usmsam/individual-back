import express from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Jobs
 *   description: Job management API
 */

/**
 * @swagger
 * /vacancies:
 *   get:
 *     summary: Search for jobs
 *     tags: [Jobs]
 *     parameters:
 *       - in: query
 *         name: query
 *         schema:
 *           type: string
 *         description: Search query
 *     responses:
 *       200:
 *         description: A list of matching jobs
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   title:
 *                     type: string
 *                   description:
 *                     type: string
 *                   salary:
 *                     type: number
 *       500:
 *         description: Something went wrong
 */
router.get('/', async (req, res) => {
  const { query } = req.query;

  try {
    if (!query) {
      const vacancies = await prisma.vacancy.findMany({
        include: {
          company: true,
        },
      });
      res.json(vacancies);
      return;
    }

    const vacancies = await prisma.vacancy.findMany({
      where: {
        OR: [
          { title: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } },
        ],
      },
      include: {
        company: true,
      },
    });

    res.json(vacancies);
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' });
  }
});

/**
 * @swagger
 * /vacancies/{id}:
 *   get:
 *     summary: Get a job by ID
 *     tags: [Jobs]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the job
 *     responses:
 *       200:
 *         description: A job object
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 title:
 *                  type: string
 *                 description:
 *                   type: string
 *                 salaryFrom:
 *                   type: number
 *                 salaryTo:
 *                   type: number
 *                 companyId:
 *                   type: number
 *                 location:
 *                   type: string
 *                 skills:
 *                   type: array
 *                   items:
 *                     type: string
 *                 fulltime:
 *                   type: boolean
 *                 parttime:
 *                   type: boolean
 *                 remote:
 *                   type: boolean
 *       404:
 *         description: Job not found
 *       500:
 *         description: Something went wrong
 */
router.get('/:id', async (req, res) => {
  const vacancyId = parseInt(req.params.id, 10);

  try {
    const vacancy = await prisma.vacancy.findUnique({
      where: { id: vacancyId },
      include: {
        company: true,
        applications: true,
      },
    });

    if (!vacancy) {
      return res.status(404).json({ error: 'Vacancy not found' });
    }

    res.json(vacancy);
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' });
  }
});

/**
 * @swagger
 * /vacancies:
 *   post:
 *     summary: Create a new job
 *     tags: [Jobs]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               salaryFrom:
 *                 type: number
 *               salaryTo:
 *                 type: number
 *               companyId:
 *                 type: number
 *               location:
 *                 type: string
 *               skills:
 *                 type: array
 *                 items:
 *                   type: string
 *               fulltime:
 *                 type: boolean
 *               parttime:
 *                 type: boolean
 *               remote:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Job created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 title:
 *                   type: string
 *                 description:
 *                   type: string
 *                 salaryFrom:
 *                   type: number
 *                 salaryTo:
 *                   type: number
 *                 companyId:
 *                   type: number
 *                 location:
 *                   type: string
 *                 skills:
 *                   type: array
 *                   items:
 *                     type: string
 *                 fulltime:
 *                   type: boolean
 *                 parttime:
 *                   type: boolean
 *                 remote:
 *                   type: boolean
 *       500:
 *         description: Something went wrong
 */
router.post('/', async (req, res) => {
  try {
    // Retrieve user ID from the request body or from session, etc.
    const userId = req.body.userId; // Assuming `userId` is part of the request body.

    // Find the company associated with the user
    const company = await prisma.company.findFirst({
      where: { userId }, // Assuming the company is linked to the user by `userId`
    });

    // If the company doesn't exist, return an error
    if (!company) {
      return res
        .status(404)
        .json({ error: 'Company not found for this user.' });
    }

    // Create the new vacancy and associate it with the found company
    const newVacancy = await prisma.vacancy.create({
      data: {
        title: req.body.title,
        description: req.body.description,
        skills: req.body.skills,
        salaryFrom: req.body.salaryFrom,
        salaryTo: req.body.salaryTo,
        location: req.body.location,
        fulltime: req.body.fulltime,
        parttime: req.body.parttime,
        remote: req.body.remote,
        companyId: company.id, // Associate the vacancy with the found company's ID
      },
    });

    // Return the newly created vacancy
    res.status(201).json(newVacancy);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

/**
 * @swagger
 * /vacancies/{id}:
 *   put:
 *     summary: Update a job
 *     tags: [Jobs]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the job
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               salary:
 *                 type: number
 *     responses:
 *       200:
 *         description: Job updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 title:
 *                   type: string
 *                 description:
 *                   type: string
 *                 salary:
 *                   type: number
 *       404:
 *         description: Job not found
 *       500:
 *         description: Something went wrong
 */
router.put('/:id', async (req, res) => {
  const vacancyId = parseInt(req.params.id, 10);
  const { title, description, salary, location } = req.body;

  try {
    const updatedVacancy = await prisma.vacancy.update({
      where: { id: vacancyId },
      data: {
        ...(title && { title }),
        ...(description && { description }),
        ...(salary && { salary }),
        ...(location && { location }),
      },
    });

    res.json(updatedVacancy);
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' });
  }
});

/**
 * @swagger
 * /vacancies/{id}:
 *   delete:
 *     summary: Delete a job
 *     tags: [Jobs]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the job
 *     responses:
 *       204:
 *         description: Job deleted successfully
 *       404:
 *         description: Job not found
 *       500:
 *         description: Something went wrong
 */
router.delete('/:id', async (req, res) => {
  const vacancyId = parseInt(req.params.id, 10);

  try {
    const deletedVacancy = await prisma.vacancy.delete({
      where: { id: vacancyId },
    });

    res.json(deletedVacancy);
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' });
  }
});

router.get('/user/:id', async (req, res) => {
  const userId = parseInt(req.params.id); // Get userId from URL params

  try {
    // Find the company associated with the user (assuming employerId is the userId)
    const companies = await prisma.company.findMany({
      where: {
        employerId: userId, // Filter companies by employerId
      },
    });

    if (companies.length === 0) {
      return res
        .status(404)
        .json({ error: 'No companies found for this user.' });
    }

    // Assuming you want to fetch vacancies for each company found
    const vacanciesPromises = companies.map((company) =>
      prisma.vacancy.findMany({
        where: {
          companyId: company.id, // Filter vacancies by companyId
        },
      }),
    );

    // Wait for all promises to resolve
    const vacanciesResults = await Promise.all(vacanciesPromises);

    // Flatten the result array (in case there are multiple companies)
    const vacancies = vacanciesResults.flat();

    if (vacancies.length === 0) {
      return res
        .status(404)
        .json({ error: 'No vacancies found for this user.' });
    }

    // Return the vacancies
    res.status(200).json(vacancies);
  } catch (error) {
    console.error('Error fetching vacancies:', error);
    res
      .status(500)
      .json({ error: 'An error occurred while fetching vacancies.' });
  }
});

export default router;
