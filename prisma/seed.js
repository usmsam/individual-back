import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function createVacanciesForCompany(companyId) {
  try {
    console.log('Вакансии успешно созданы');
  } catch (error) {
    console.error('Ошибка при создании вакансий:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Вызов функции для компании с ID 7
createVacanciesForCompany(5);
