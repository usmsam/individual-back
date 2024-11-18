import express from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const router = express.Router();

// Создание отклика на вакансию
router.post("/", async (req, res) => {
  const { userId, vacancyId, coverLetter } = req.body;

  try {
    const application = await prisma.application.create({
      data: {
        userId,	
        vacancyId,
        coverLetter,
        status: "PENDING", // Начальный статус отклика
      },
    });

    res.status(201).json(application);
  } catch (error) {
    console.error("Error creating application:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

// Изменение статуса отклика (например, принят или отклонен)
router.patch("/:id", async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const updatedApplication = await prisma.application.update({
      where: { id: parseInt(id) },
      data: { status },
    });

    res.json(updatedApplication);
  } catch (error) {
    console.error("Error updating application status:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

// Поиск откликов на вакансию для пользователя
router.get("/user/:userId", async (req, res) => {
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
    console.error("Error fetching applications:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

// Поиск откликов для вакансии
router.get("/vacancy/:vacancyId", async (req, res) => {
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
    console.error("Error fetching applications:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

export default router;
