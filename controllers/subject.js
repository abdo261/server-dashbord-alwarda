const { PrismaClient } = require("@prisma/client");
const { ValidateCreateSubject } = require("../validation/sybject");
const prisma = new PrismaClient();

// Create a Subject
async function createSubject(req, res) {
  const { name, pricePerMonth, levelId } = req.body;

  const { error } = ValidateCreateSubject({ name, pricePerMonth, levelId });
  if (error) {
    return res.status(400).json(error);
  }
  try {
    const existingSubject = await prisma.subjects.findFirst({
      where: { name, levelId: parseInt(levelId) },
      include: {
        _count: {
          select: {
            students: true,
          },
        },
        level: true,
      },
    });

    if (existingSubject) {
      return res.status(400).json({ message: " matiére existe déjà" });
    }
    const level = await prisma.levels.findUnique({
      where: {
        id: parseInt(levelId),
      },
    });
    if (!level) {
      return res
        .status(400)
        .json({ message: " le Niveaux Selectioné  n'existe pas" });
    }
    const newSubject = await prisma.subjects.create({
      data: {
        name,
        pricePerMonth,
        school: level.type,
        levelId: parseInt(levelId),
      },
      include: {
        level: true,
        _count: {
          select: {
            students: true,
          },
        },
      },
    });

    res
      .status(201)
      .json({ message: "matiére créé avec succès", subject: newSubject });
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la création  matiére: " + error.message,
    });
  }
}

// Get All Subjects
async function getAllSubjects(req, res) {
  try {
    const subjects = await prisma.subjects.findMany({
      include: {
        _count: {
          select: {
            students: true,
          },
        },
        level: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.status(200).json(subjects);
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la récupération d matiéres: " + error.message,
    });
  }
}
async function getAllSubjectsByLevel(req, res) {
  try {
    const { levelId } = req.params;
    const subjects = await prisma.subjects.findMany({
      where: {
        levelId: parseInt(levelId),
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.status(200).json(subjects);
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la récupération d matiéres: " + error.message,
    });
  }
}

// Get Subject by ID
async function getSubjectById(req, res) {
  const { id } = req.params;
  try {
    const subject = await prisma.subjects.findUnique({
      where: { id: parseInt(id) },
      include: {
        _count: {
          select: {
            students: true,
          },
        },
        students: true,
        level: true,
      },
    });

    if (!subject) {
      return res.status(404).json({ message: "matiére non trouvé" });
    }

    res.status(200).json(subject);
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la récupération  matiére: " + error.message,
    });
  }
}

// Update Subject
async function updateSubject(req, res) {
  const { id } = req.params;
  const { name, pricePerMonth, levelId } = req.body;
  try {
    const existSbject = await prisma.subjects.findFirst({
      where: {
        name,
        levelId: parseInt(levelId),
      },
    });
    if (existSbject) {
      return res.status(400).json({ message: " matiére existe déjà" });
    }
    const level = await prisma.levels.findUnique({
      where: {
        id: parseInt(levelId),
      },
    });
    const updatedSubject = await prisma.subjects.update({
      where: { id: parseInt(id) },
      data: {
        name,
        pricePerMonth,
        levelId: parseInt(levelId),
        school: level.type,
      },
      include: {
        _count: {
          select: {
            students: true,
          },
        },
        level: true,
      },
    });

    res.status(200).json({
      message: "matiére mis à jour avec succès",
      subject: updatedSubject,
    });
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la mise à jour  matiére: " + error.message,
    });
  }
}

// Delete Subject
async function deleteSubject(req, res) {
  const { id } = req.params;
  try {
    await prisma.subjects.delete({
      where: { id: parseInt(id) },
    });

    res.status(200).json({ message: "matiére supprimé avec succès" });
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la suppression du matiére: " + error.message,
    });
  }
}

module.exports = {
  createSubject,
  getAllSubjects,
  getSubjectById,
  updateSubject,
  deleteSubject,
  getAllSubjectsByLevel,
};
