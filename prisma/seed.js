import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const resumes = [
    {
      title: 'Frontend Developer',
      description: 'Опытный разработчик с акцентом на React и TypeScript.',
      skills: ['JavaScript', 'React', 'TypeScript', 'CSS'],
    },
    {
      title: 'Backend Developer',
      description: 'Специалист по созданию масштабируемых API на Node.js.',
      skills: ['Node.js', 'Express', 'MongoDB', 'TypeScript'],
    },
    {
      title: 'DevOps Engineer',
      description: 'Эксперт по настройке CI/CD и контейнеризации.',
      skills: ['Docker', 'Kubernetes', 'AWS', 'Jenkins'],
    },
    {
      title: 'Data Scientist',
      description: 'Опыт анализа данных и построения ML-моделей.',
      skills: ['Python', 'TensorFlow', 'Pandas', 'NumPy'],
    },
    {
      title: 'UI/UX Designer',
      description:
        'Разработка удобных интерфейсов с акцентом на пользовательский опыт.',
      skills: ['Figma', 'Adobe XD', 'Sketch', 'User Research'],
    },
    {
      title: 'Product Manager',
      description: 'Управление продуктами и координация команд.',
      skills: ['Agile', 'Scrum', 'JIRA', 'Confluence'],
    },
    {
      title: 'QA Engineer',
      description: 'Тестирование ПО и обеспечение качества.',
      skills: ['Selenium', 'Cypress', 'Jest', 'TestRail'],
    },
    {
      title: 'Mobile Developer',
      description: 'Разработка мобильных приложений для iOS и Android.',
      skills: ['Swift', 'Kotlin', 'Flutter', 'React Native'],
    },
    {
      title: 'Blockchain Developer',
      description: 'Разработка dApps и смарт-контрактов.',
      skills: ['Solidity', 'Web3.js', 'Ethereum', 'Hardhat'],
    },
    {
      title: 'Game Developer',
      description: 'Создание игр с использованием современных технологий.',
      skills: ['Unity', 'C#', 'Unreal Engine', 'Blender'],
    },
  ];

  for (const resume of resumes) {
    await prisma.resume.create({
      data: {
        title: resume.title,
        description: resume.description,
        skills: resume.skills,
        userId: 11,
      },
    });
  }

  console.log('10 resumes have been created for userId 11.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
