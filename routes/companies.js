import express from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const router = express.Router();

// Создание новой компании
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

    res.status(201).json(newCompany);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

// Получение списка всех компаний
router.get("/", async (req, res) => {
  try {
    const companies = await prisma.company.findMany();
    res.json(companies);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

// Получение компании по ID
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

// Обновление информации о компании
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

// Удаление компании
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
