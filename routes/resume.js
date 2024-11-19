import express from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Resumes
 *   description: API для работы с резюме
 */

/**
 * @swagger
 * /resumes:
 *   get:
 *     summary: Получить все резюме
 *     tags: [Resumes]
 *     responses:
 *       200:
 *         description: Список резюме
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
 *                   skills:
 *                     type: array
 *                     items:
 *                       type: string
 *                   userId:
 *                     type: integer
 */
router.get("/", async (req, res) => {
  try {
    const resumes = await prisma.resume.findMany();
    res.json(resumes);
  } catch (error) {
    console.error("Error fetching resumes:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

/**
 * @swagger
 * /resumes/{id}:
 *   get:
 *     summary: Получить резюме по ID
 *     tags: [Resumes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID резюме
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Резюме найдено
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
 *                 skills:
 *                   type: array
 *                   items:
 *                     type: string
 *                 userId:
 *                   type: integer
 *       404:
 *         description: Резюме не найдено
 */
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const resume = await prisma.resume.findUnique({
      where: { id: parseInt(id) },
    });

    if (!resume) {
      return res.status(404).json({ error: "Resume not found" });
    }

    res.json(resume);
  } catch (error) {
    console.error("Error fetching resume:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

/**
 * @swagger
 * /resumes:
 *   post:
 *     summary: Создать новое резюме
 *     tags: [Resumes]
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
 *               skills:
 *                 type: array
 *                 items:
 *                   type: string
 *               userId:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Резюме создано
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
 *                 skills:
 *                   type: array
 *                   items:
 *                     type: string
 *                 userId:
 *                   type: integer
 */
router.post("/", async (req, res) => {
  const { title, description, skills, userId } = req.body;

  try {
    const newResume = await prisma.resume.create({
      data: {
        title,
        description,
        skills,
        userId,
      },
    });

    res.status(201).json(newResume);
  } catch (error) {
    console.error("Error creating resume:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

/**
 * @swagger
 * /resumes/{id}:
 *   put:
 *     summary: Обновить резюме по ID
 *     tags: [Resumes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID резюме
 *         schema:
 *           type: integer
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
 *               skills:
 *                 type: array
 *                 items:
 *                   type: string
 *               userId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Резюме обновлено
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
 *                 skills:
 *                   type: array
 *                   items:
 *                     type: string
 *                 userId:
 *                   type: integer
 *       404:
 *         description: Резюме не найдено
 */
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { title, description, skills } = req.body;

  try {
    const updatedResume = await prisma.resume.update({
      where: { id: parseInt(id) },
      data: {
        title,
        description,
        skills,
      },
    });

    res.json(updatedResume);
  } catch (error) {
    console.error("Error updating resume:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

/**
 * @swagger
 * /resumes/{id}:
 *   delete:
 *     summary: Удалить резюме по ID
 *     tags: [Resumes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID резюме
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Резюме удалено
 *       404:
 *         description: Резюме не найдено
 */
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const resume = await prisma.resume.findUnique({
      where: { id: parseInt(id) },
    });

    if (!resume) {
      return res.status(404).json({ error: "Resume not found" });
    }

    await prisma.resume.delete({
      where: { id: parseInt(id) },
    });

    res.status(200).json({ message: "Resume deleted successfully" });
  } catch (error) {
    console.error("Error deleting resume:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

export default router;
