import express from "express";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const router = express.Router();

// Получение всех пользователей
router.get("/", async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      include: {
        password: false,
      },
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
});
// Создание нового пользователя
router.post("/", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Хешируем пароль
    const hashedPassword = await bcrypt.hash(password, 10); // 10 - это количество "раундов" для хеширования

    // Создаем нового пользователя с хешированным паролем
    const newUser = await prisma.user.create({
      data: { name, email, password: hashedPassword },
    });

    res.json(newUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
});
// Авторизация пользователя
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Ищем пользователя по email
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    // Сравниваем введенный пароль с хешированным паролем из базы
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(400).json({ error: "Invalid password" });
    }

    res.json({ message: "Login successful", user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
});
// Обновление пользователя
router.put("/:id", async (req, res) => {
  const userId = parseInt(req.params.id, 10);
  const { name, email, password, role } = req.body;

  try {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(name && { name }),
        ...(email && { email }),
        ...(password && { password }),
        ...(role && { role }),
      },
    });
    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(400).json({ error: "Could not update user" });
  }
});

export default router;
