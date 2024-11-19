import express from "express";
import { PrismaClient } from "@prisma/client";

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
 *     summary: Get all jobs
 *     tags: [Jobs]
 *     responses:
 *       200:
 *         description: A list of jobs
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
router.get("/", async (req, res) => {
  try {
    const vacancies = await prisma.vacancy.findMany({
      include: {
        company: true,
      },
    });
    res.json(vacancies);
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
});

/**
 * @swagger
 * /vacancies/search:
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
router.get("/search", async (req, res) => {
  const { query } = req.query;

  try {
    if (!query) {
      return res.status(400).json({ error: "Query parameter is required" });
    }

    const vacancies = await prisma.vacancy.findMany({
      where: {
        OR: [
          { title: { contains: query, mode: "insensitive" } },
          { description: { contains: query, mode: "insensitive" } },
        ],
      },
      include: {
        company: true,
      },
    });

    res.json(vacancies);
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
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
router.get("/:id", async (req, res) => {
  const vacancyId = parseInt(req.params.id, 10);

  try {
    const vacancy = await prisma.vacancy.findUnique({
      where: { id: vacancyId },
      include: {
        company: true,
      },
    });

    if (!vacancy) {
      return res.status(404).json({ error: "Vacancy not found" });
    }

    res.json(vacancy);
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
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
 *               salary:
 *                 type: number
 *               companyId:
 *                 type: number
 *               location:
 *                 type: string
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
 *                 salary:
 *                   type: number
 *       500:
 *         description: Something went wrong
 */
router.post("/", async (req, res) => {
  const { title, description, salary, location, companyId } = req.body;

  try {
    const newVacancy = await prisma.vacancy.create({
      data: {
        title,
        description,
        salary,
        location,
        companyId,
      },
    });

    res.status(201).json(newVacancy);
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
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
router.put("/:id", async (req, res) => {
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
    res.status(500).json({ error: "Something went wrong" });
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
router.delete("/:id", async (req, res) => {
  const vacancyId = parseInt(req.params.id, 10);

  try {
    const deletedVacancy = await prisma.vacancy.delete({
      where: { id: vacancyId },
    });

    res.json(deletedVacancy);
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
});

export default router;
