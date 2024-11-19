import express from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Companies
 *   description: Company management API
 */

/**
 * @swagger
 * /companies:
 *   post:
 *     summary: Create a new company
 *     tags: [Companies]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - description
 *               - location
 *               - employerId
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the company
 *               description:
 *                 type: string
 *                 description: A brief description of the company
 *               location:
 *                 type: string
 *                 description: The location of the company
 *               employerId:
 *                 type: integer
 *                 description: The ID of the employer creating the company
 *     responses:
 *       201:
 *         description: Company created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 name:
 *                   type: string
 *                 description:
 *                   type: string
 *                 location:
 *                   type: string
 *                 employerId:
 *                   type: integer
 *       400:
 *         description: Employer not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Employer not found
 *       500:
 *         description: Something went wrong
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Something went wrong
 */
router.post("/", async (req, res) => {
  const { name, description, location, employerId } = req.body;

  try {
    const employer = await prisma.user.findUnique({
      where: { id: employerId },
    });

    if (!employer) {
      return res.status(400).json({ error: "Employer not found" });
    }

    const newCompany = await prisma.company.create({
      data: {
        name,
        description,
        location,
        employerId,
      },
    });
    
    if (newCompany) {
      prisma.user.update({
        where: { id: employerId },
        data: { role: "EMPLOYER" },
      });
    }

    res.status(201).json(newCompany);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

/**
 * @swagger
 * /companies:
 *   get:
 *     summary: Retrieve a list of all companies
 *     tags: [Companies]
 *     responses:
 *       200:
 *         description: List of companies retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     description: The unique identifier of the company
 *                   name:
 *                     type: string
 *                     description: The name of the company
 *                   description:
 *                     type: string
 *                     description: A brief description of the company
 *                   location:
 *                     type: string
 *                     description: The location of the company
 *                   employerId:
 *                     type: integer
 *                     description: The ID of the employer who created the company
 *       500:
 *         description: Something went wrong
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Something went wrong
 */
router.get("/", async (req, res) => {
  try {
    const companies = await prisma.company.findMany();
    res.json(companies);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

/**
 * @swagger
 * /companies/{id}:
 *   get:
 *     summary: Retrieve a company by its ID
 *     tags: [Companies]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the company to retrieve
 *     responses:
 *       200:
 *         description: Company details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: The unique identifier of the company
 *                 name:
 *                   type: string
 *                   description: The name of the company
 *                 description:
 *                   type: string
 *                   description: A brief description of the company
 *                 location:
 *                   type: string
 *                   description: The location of the company
 *                 employer:
 *                   type: object
 *                   description: Details of the employer who created the company
 *                   properties:
 *                     id:
 *                       type: integer
 *                     name:
 *                       type: string
 *                     email:
 *                       type: string
 *                 vacancies:
 *                   type: array
 *                   description: List of vacancies related to the company
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       title:
 *                         type: string
 *                       description:
 *                         type: string
 *                       companyId:
 *                         type: integer
 *       404:
 *         description: Company not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Company not found
 *       500:
 *         description: Something went wrong
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Something went wrong
 */
router.get("/:id", async (req, res) => {
  const companyId = parseInt(req.params.id, 10);

  try {
    const company = await prisma.company.findUnique({
      where: { id: companyId },
      include: {
        employer: true, // Получение данных о работодателе
        vacancies: true, // Получение всех вакансий, связанных с компанией
      },
    });

    if (!company) {
      return res.status(404).json({ error: "Company not found" });
    }

    res.json(company);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

/**
 * @swagger
 * /companies/{id}:
 *   put:
 *     summary: Update a company's information
 *     tags: [Companies]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the company to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The updated name of the company
 *               description:
 *                 type: string
 *                 description: The updated description of the company
 *               location:
 *                 type: string
 *                 description: The updated location of the company
 *               employerId:
 *                 type: integer
 *                 description: The ID of the new employer, if being updated
 *             example:
 *               name: Updated Company Name
 *               description: Updated company description
 *               location: Updated location
 *               employerId: 5
 *     responses:
 *       200:
 *         description: Company updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 name:
 *                   type: string
 *                 description:
 *                   type: string
 *                 location:
 *                   type: string
 *                 employerId:
 *                   type: integer
 *       400:
 *         description: Employer not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Employer not found
 *       500:
 *         description: Could not update company
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Could not update company
 */
router.put("/:id", async (req, res) => {
  const companyId = parseInt(req.params.id, 10);
  const { name, description, location, employerId } = req.body;

  try {
    // Проверка на наличие работодателя
    if (employerId) {
      const employer = await prisma.user.findUnique({
        where: { id: employerId },
      });

      if (!employer) {
        return res.status(400).json({ error: "Employer not found" });
      }
    }

    const updatedCompany = await prisma.company.update({
      where: { id: companyId },
      data: {
        name,
        description,
        location,
        employerId,
      },
    });

    res.json(updatedCompany);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Could not update company" });
  }
});

/**
 * @swagger
 * /companies/{id}:
 *   delete:
 *     summary: Delete a company by its ID
 *     tags: [Companies]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the company to delete
 *     responses:
 *       200:
 *         description: Company deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Company deleted successfully
 *       404:
 *         description: Company not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Company not found
 *       500:
 *         description: Something went wrong
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Something went wrong
 */
router.delete("/:id", async (req, res) => {
  const companyId = parseInt(req.params.id, 10);

  try {
    // Проверка на существование компании
    const company = await prisma.company.findUnique({
      where: { id: companyId },
    });

    if (!company) {
      return res.status(404).json({ error: "Company not found" });
    }

    // Удаление компании
    await prisma.company.delete({
      where: { id: companyId },
    });

    res.status(200).json({ message: "Company deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

export default router;
