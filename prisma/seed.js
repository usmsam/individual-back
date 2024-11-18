import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function createSeedData() {
  // Очищаем все таблицы перед созданием новых данных
  await prisma.application.deleteMany();
  await prisma.vacancy.deleteMany();
  await prisma.company.deleteMany();
  await prisma.user.deleteMany();

  // 1. Создание 10 пользователей
  const users = [
    { name: "Alice", email: "alice@example.com", password: "password123" },
    { name: "Bob", email: "bob@example.com", password: "password123" },
    { name: "Charlie", email: "charlie@example.com", password: "password123" },
    { name: "David", email: "david@example.com", password: "password123" },
    { name: "Eve", email: "eve@example.com", password: "password123" },
    { name: "Frank", email: "frank@example.com", password: "password123" },
    { name: "Grace", email: "grace@example.com", password: "password123" },
    { name: "Hannah", email: "hannah@example.com", password: "password123" },
    { name: "Ivy", email: "ivy@example.com", password: "password123" },
    { name: "Jack", email: "jack@example.com", password: "password123" },
  ];

  const createdUsers = await Promise.all(
    users.map((user) =>
      prisma.user.create({
        data: {
          name: user.name,
          email: user.email,
          password: user.password,
        },
      })
    )
  );

  // 2. Создание 5 компаний и 5 вакансий
  const companies = [
    {
      name: "TechCorp",
      description: "A leading tech company",
      location: "New York",
    },
    {
      name: "InnovateX",
      description: "Innovative solutions for the future",
      location: "San Francisco",
    },
    {
      name: "WebWorks",
      description: "Web development and design agency",
      location: "Los Angeles",
    },
    {
      name: "DataPro",
      description: "Big data solutions for businesses",
      location: "Chicago",
    },
    {
      name: "SoftWareHouse",
      description: "Custom software development",
      location: "Austin",
    },
  ];

  const createdCompanies = await Promise.all(
    companies.map((company, index) =>
      prisma.company.create({
        data: {
          name: company.name,
          description: company.description,
          location: company.location,
          employerId: createdUsers[index].id, // Связываем компанию с пользователем (работодателем)
        },
      })
    )
  );

  const vacancies = [
    {
      title: "Frontend Developer",
      description: "Join our dynamic frontend team",
      salary: 70000,
      location: "New York",
    },
    {
      title: "Backend Developer",
      description: "Looking for a skilled backend developer",
      salary: 80000,
      location: "San Francisco",
    },
    {
      title: "UI/UX Designer",
      description: "Design beautiful user interfaces",
      salary: 75000,
      location: "Los Angeles",
    },
    {
      title: "Data Scientist",
      description: "Analyze data to drive business decisions",
      salary: 90000,
      location: "Chicago",
    },
    {
      title: "Software Engineer",
      description: "Develop high-quality software applications",
      salary: 85000,
      location: "Austin",
    },
  ];

  await Promise.all(
    createdCompanies.map((company, index) =>
      prisma.vacancy.create({
        data: {
          title: vacancies[index].title,
          description: vacancies[index].description,
          salary: vacancies[index].salary,
          location: vacancies[index].location,
          companyId: company.id,
        },
      })
    )
  );

  // 3. Создание откликов на вакансии для 5 пользователей
  const applications = [
    { userId: createdUsers[0].id, vacancyId: 1 },
    { userId: createdUsers[1].id, vacancyId: 2 },
    { userId: createdUsers[2].id, vacancyId: 3 },
    { userId: createdUsers[3].id, vacancyId: 4 },
    { userId: createdUsers[4].id, vacancyId: 5 },
  ];

  await Promise.all(
    applications.map((application) =>
      prisma.application.create({
        data: {
          userId: application.userId,
          vacancyId: application.vacancyId,
        },
      })
    )
  );

  console.log("Seed data created successfully!");
}

createSeedData()
  .catch((e) => {
    console.error("Error creating seed data:", e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
