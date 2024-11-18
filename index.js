import express from "express";
import { PrismaClient } from "@prisma/client";
import cors from "cors"; // Импорт CORS
import userRoutes from "./routes/user.js";
import companyRoutes from "./routes/companies.js";
import vacancyRoutes from "./routes/vacancies.js";
import applicationsRoutes from "./routes/applications.js";

const prisma = new PrismaClient();
const app = express();

app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());
app.use("/users", userRoutes);
app.use("/company", companyRoutes);
app.use("/vacancies", vacancyRoutes);
app.use("/applications", applicationsRoutes);

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
