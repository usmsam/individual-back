import express from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const router = express.Router();

// Получение всех вакансий
router.get("/", async (req, res) => {
  try {
    const vacancies = await prisma.vacancy.findMany({
      include: {
        company: true, // Включаем информацию о компании
      },
    });
    res.json(vacancies);
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
});

// Поиск вакансий
router.get("/search", async (req, res) => {
  const { query } = req.query;

  try {
    // Проверяем, что параметр query был передан
    if (!query) {
      return res.status(400).json({ error: "Query parameter is required" });
    }

    const vacancies = await prisma.vacancy.findMany({
      where: {
        OR: [
          { title: { contains: query, mode: "insensitive" } },      // Поиск по названию вакансии
          { description: { contains: query, mode: "insensitive" } } // Поиск по описанию вакансии
        ],
      },
      include: {
        company: true, // Включаем информацию о компании
      },
    });

    res.json(vacancies);
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
});

// Получение вакансии по ID
router.get("/:id", async (req, res) => {
  const vacancyId = parseInt(req.params.id, 10);

  try {
    const vacancy = await prisma.vacancy.findUnique({
      where: { id: vacancyId },
      include: {
        company: true, // Включаем информацию о компании
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

// Создание новой вакансии
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

// Обновление вакансии
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

// Удаление вакансии
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
