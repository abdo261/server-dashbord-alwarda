const { PrismaClient } = require("@prisma/client");
const { faker } = require("@faker-js/faker");
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function seedCentres(count) {
  const usedColors = new Set();

  for (let i = 0; i < count; i++) {
    let uniqueColor;
    do {
      uniqueColor = faker.internet.color();
    } while (usedColors.has(uniqueColor));
    usedColors.add(uniqueColor);

    await prisma.centres.create({
      data: {
        name: `${faker.company.name()}_${i}`,
        location: faker.location.secondaryAddress(),
        color: uniqueColor,
      },
    });
  }
}

async function seedLevels(count) {
  const usedNames = new Set();

  for (let i = 0; i < count; i++) {
    let uniqueName;
    do {
      uniqueName = `${faker.lorem.word()}_${faker.string.alphanumeric(5)}`;
    } while (usedNames.has(uniqueName));
    usedNames.add(uniqueName);

    await prisma.levels.create({
      data: {
        name: uniqueName,
      },
    });
  }
}

async function seedUsers(count) {
  const centres = await prisma.centres.findMany();
  const usedEmails = new Set();
  const hashedPassword = await bcrypt.hash("123456789", 10);
  
  for (let i = 0; i < count; i++) {
    let uniqueEmail;
    do {
      uniqueEmail = faker.internet.email();
    } while (usedEmails.has(uniqueEmail));
    usedEmails.add(uniqueEmail);

    const centreId = centres[i % centres.length]?.id; 

    await prisma.users.create({
      data: {
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        email: uniqueEmail,
        password: hashedPassword,
        phone: faker.phone.number(),
        isOwner: false,
        centreId: centreId,
      },
    });
  }
}

async function seedSubjects(count) {
  const levels = await prisma.levels.findMany();

  for (let i = 0; i < count; i++) {
    const randomLevel = levels[Math.floor(Math.random() * levels.length)];

    await prisma.subjects.create({
      data: {
        name: `${faker.lorem.word()}_${randomLevel.id}`,
        pricePerMonth: parseFloat(faker.commerce.price()),
        levelId: randomLevel.id,
      },
    });
  }
}

async function seedStudents(count) {
  const users = await prisma.users.findMany();
  const levels = await prisma.levels.findMany();
  const subjects = await prisma.subjects.findMany({
    select: {
      id: true,
    },
  });

  const getRandomElements = (array, numElements) => {
    const shuffled = array.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, numElements);
  };

  for (let i = 0; i < count; i++) {
    const randomUser = users[Math.floor(Math.random() * users.length)];
    const randomLevel = levels[Math.floor(Math.random() * levels.length)];

    await prisma.students.create({
      data: {
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        phoneParent: faker.phone.number(),
        phone: faker.phone.number(),
        sex: faker.helpers.arrayElement(["HOMME", "FEMME"]),
        school: faker.helpers.arrayElement(["COLLEGE", "LYCEE", "ECOLE_PRIMAIRE"]), 
        registrationDate: new Date().toISOString(),
        registredBy: randomUser.id,
        levelId: randomLevel.id,
        centreId: randomUser.centreId, 
        subjects: {
          connect: getRandomElements(subjects, Math.floor(Math.random() * 5)).map((s) => ({ id: s.id })),
        },
      },
    });
  }
}

async function seed() {
  await seedCentres(3);
  await seedLevels(4);
  await seedUsers(3);
  await seedSubjects(10);
  await seedStudents(50);
}

seed()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
