const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function createStudent(req, res) {
  const {
    firstName,
    lastName,
    phoneParent,
    phone,
    sex,
    registrationDate,
    registredBy,
    levelId,
    centreId,
    subjectIds,
    school
  } = req.body;

  try {
    // Check if user exists
    const user = await prisma.users.findUnique({ where: { id: registredBy } });
    if (!user) return res.status(400).json({ message: "Utilisateur non trouvé" });

    // Check if level exists
    const level = await prisma.levels.findUnique({ where: { id: levelId } });
    if (!level) return res.status(400).json({ message: "Niveau non trouvé" });

    // Check if centre exists
    const centre = await prisma.centres.findUnique({ where: { id: centreId } });
    if (!centre) return res.status(400).json({ message: "Centre non trouvé" });

    // Create new student
    const newStudent = await prisma.students.create({
      data: {
        firstName,
        lastName,
        phoneParent,
        phone,
        sex,
        registrationDate: registrationDate ? new Date(registrationDate) : new Date(),
        registredBy,
        levelId,
        centreId,
        subjects: {
          connect: subjectIds.map((id) => ({ id })),
        },
        school
      },
      include: {
        user: true,
        level: true,
        centre: true,
        subjects: true,
        payments: true,
      },
    });

    // Retrieve subjects and calculate amounts
    const subjects = await prisma.subjects.findMany({
      where: { id: { in: subjectIds } },
      include: {
        level: true,
      },
    });

    const totalSubjects = subjects.length;
    const totalAmount = subjects.reduce(
      (sum, subject) => sum + subject.pricePerMonth,
      0
    );
    const discount = totalSubjects > 1 ? 50 * totalSubjects : 0;
    const finalAmount = totalAmount - discount;

    let currentDate = registrationDate ? new Date(registrationDate) : new Date();
    const dayOfMonth = currentDate.getDate();

    let startMonth = new Date(currentDate);
    startMonth.setDate(1);

    const endYear = startMonth.getMonth() > 5 ? startMonth.getFullYear() + 1 : startMonth.getFullYear();
    let isFirstPayment = true;

    while (startMonth.getFullYear() < endYear || (startMonth.getFullYear() === endYear && startMonth.getMonth() <= 5)) {
      const monthName = startMonth.toLocaleString("default", { month: "long" });

      const dueDate = new Date(startMonth);
      dueDate.setMonth(startMonth.getMonth() + 1);
      dueDate.setDate(dayOfMonth);

      if (dueDate.getDate() !== dayOfMonth) {
        dueDate.setDate(0); // Last day of the previous month
      }

      let have50 = 0;
      if (school === "COLLEGE") {
        have50 = 50;
      } else if (isFirstPayment) {
        have50 = 50;
        isFirstPayment = false;
      }

      await prisma.payments.create({
        data: {
          studentId: newStudent.id,
          month: monthName,
          totalAmount: finalAmount,
          amountPaid: 0,
          amountDue: finalAmount,
          discount: discount,
          dueDate: dueDate,
          have50: have50,
          subjects: JSON.stringify(
            subjects.map((s) => ({
              id: s.id,
              name: s.name,
              level: s.level.name,
              isPayed: false,
              pricePerMonth: s.pricePerMonth,
              discount: totalSubjects > 1 ? 50 : 0,
            }))
          ),
        },
      });

      startMonth.setMonth(startMonth.getMonth() + 1);
    }

    res.status(201).json({
      message: "Étudiant créé avec succès et paiements enregistrés",
      student: newStudent,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      message: "Erreur lors de la création de l'étudiant: " + error.message,
    });
  }
}



async function getAllStudents(req, res) {
  try {
    const students = await prisma.students.findMany({
      include: {
        user: true,
        level: true,
        centre: true,
        subjects: true,
        payments: true,
      },
      orderBy:{
        createdAt:"desc"
      }
    });

    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la récupération des étudiants: " + error.message,
    });
  }
}

async function getStudentById(req, res) {
  const { id } = req.params;
  try {
    const student = await prisma.students.findUnique({
      where: { id: parseInt(id) },
      include: {
        user: true,
        level: true,
        centre: true,
        subjects: true,
        payments: {
          orderBy:{
            createdAt:"asc"
          }
          }
        },
      },
    );

    if (!student) {
      return res.status(404).json({ message: "Étudiant non trouvé" });
    }

    res.status(200).json(student);
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la récupération de l'étudiant: " + error.message,
    });
  }
}

async function updateStudent(req, res) {
  const { id } = req.params;
  const {
    firstName,
    lastName,
    phoneParent,
    phone,
    sex,
    registrationDate,
    registredBy,
    levelId,
    centreId,
    subjectIds,
    currentMonth = false,
    school
  } = req.body;

  try {
    const user = await prisma.users.findUnique({ where: { id: registredBy } });
    if (!user) return res.status(400).json({ message: "Utilisateur non trouvé" });

    const level = await prisma.levels.findUnique({ where: { id: levelId } });
    if (!level) return res.status(400).json({ message: "Niveau non trouvé" });

    const centre = await prisma.centres.findUnique({ where: { id: centreId } });
    if (!centre) return res.status(400).json({ message: "Centre non trouvé" });

    const updatedStudent = await prisma.students.update({
      where: { id: parseInt(id) },
      data: {
        firstName,
        lastName,
        phoneParent,
        phone,
        sex,
        registrationDate,
        registredBy,
        levelId,
        centreId,
        school,
        subjects: {
          set: subjectIds.map((id) => ({ id })),
        },
      },
      include: {
        user: true,
        level: true,
        centre: true,
        subjects: true,
        payments: true,
      },
    });

    const subjects = await prisma.subjects.findMany({
      where: { id: { in: subjectIds } },
      include: {
        level: true,
      },
    });

    const totalSubjects = subjects.length;
    const totalAmount = subjects.reduce(
      (sum, subject) => sum + subject.pricePerMonth,
      0
    );
    const discount = totalSubjects > 1 ? 50 * totalSubjects : 0;
    const finalAmount = totalAmount - discount;

 
    const currentDate = new Date();

    let updateFromDate;
    if (currentMonth) {

      updateFromDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    } else {
  
      updateFromDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
    }

    const paymentsToUpdate = await prisma.payments.findMany({
      where: {
        studentId: updatedStudent.id,
        dueDate: {
          gte: updateFromDate,
        },
      },
    });

    for (const payment of paymentsToUpdate) {
      await prisma.payments.update({
        where: { id: payment.id },
        data: {
          totalAmount: finalAmount,
          discount: discount,
          amountDue: finalAmount - payment.amountPaid,
          subjects: JSON.stringify(
            subjects.map((s) => ({
              id: s.id,
              name: s.name,
              level: s.level.name,
              isPayed: false,
              pricePerMonth: s.pricePerMonth,
              discount: totalSubjects > 1 ? 50 : 0,
            }))
          ),
        },
      });
    }

    res.status(200).json({
      message: "Étudiant et paiements mis à jour avec succès",
      student: updatedStudent,
    });
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la mise à jour de l'étudiant: " + error.message,
    });
  }
}



async function deleteStudent(req, res) {
  const { id } = req.params;
  try {
    await prisma.students.delete({
      where: { id: parseInt(id) },
    });

    res.status(200).json({ message: "Étudiant supprimé avec succès" });
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la suppression de l'étudiant: " + error.message,
    });
  }
}

module.exports = {
  createStudent,
  getAllStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
};
