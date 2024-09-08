const { PrismaClient } = require("@prisma/client");
const { ValidateCreateCentre } = require("../validation/centre");

const prisma = new PrismaClient();

// Get All Centers with deep relations
async function getAllCenters(req, res) {
  try {
    const centres = await prisma.centres.findMany({
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            id: true,
          },
        },
        students: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.status(200).json(centres);
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la récupération des centres: " + error.message,
    });
  }
}

// Get Center by ID with deep relations
async function getCenterById(req, res) {
  const { id } = req.params;
  try {
    const centre = await prisma.centres.findUnique({
      where: { id: parseInt(id) },
      include: {
        students: {
          include: {
            level: true,
            subjects: true,
            payments: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        },
        user: true,
      },
    });
    if (!centre) {
      return res.status(404).json({ message: "Centre non trouvé" });
    }
    res.status(200).json(centre);
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la récupération du centre: " + error.message,
    });
  }
}

// Create a New Center
async function createCenter(req, res) {
  const { name, location, color } = req.body;
  const { error } = ValidateCreateCentre({ name, location, color });
  if (error) {
    return res.status(400).json(error);
  }
  try {
    const existingCentre = await prisma.centres.findUnique({
      where: { name },
    });
    if (existingCentre) {
      return res
        .status(400)
        .json({ name: ["Un centre avec ce nom existe déjà"] });
    }
    const existingCentreByColor = await prisma.centres.findUnique({
      where: { color },
    });

    if (existingCentreByColor) {
      return res
        .status(400)
        .json({ color: ["Un centre avec cette couleur existe déjà"] });
    }
    const centre = await prisma.centres.create({
      data: {
        name,
        location,
        color,
      },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
          },
          where: {
            isOwner: false,
          },
        },
        students: true,
      },
    });
    res.status(201).json({
      message: `Centre ${centre.name}  créé avec succès`,
      centre,
    });
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la création du centre: " + error.message,
    });
  }
}

// Update a Center by ID
async function updateCenter(req, res) {
  const { id } = req.params;
  const { name, location, color } = req.body;
  try {
    const { error } = ValidateCreateCentre({ name, location, color });
    if (error) {
      return res.status(400).json(error);
    }
    const existingCentre = await prisma.centres.findUnique({
      where: { id: parseInt(id) },
    });
    if (!existingCentre) {
      return res.status(404).json({ message: "Centre non trouvé" });
    }

    if (name && name !== existingCentre.name) {
      const nameExists = await prisma.centres.findUnique({
        where: {
          name,
        },
      });
      if (nameExists) {
        return res
          .status(400)
          .json({
            name: [`Un autre centre avec le nome ${name}  existe déjà`],
          });
      }
    }
    if (color && color !== existingCentre.color) {
      const colorExists = await prisma.centres.findUnique({
        where: {
          color,
        },
      });
      if (colorExists) {
        return res
          .status(400)
          .json({ color: [`Un autre centre avec cette coleur existe déjà`] });
      }
    }

    const centre = await prisma.centres.update({
      where: { id: parseInt(id) },
      data: {
        name,
        location,
        color,
      },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
          },
          where: {
            isOwner: false,
          },
        },
        students: true,
      },
    });
    res.status(200).json({ message: "Centre mis à jour avec succès", centre });
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la mise à jour du centre: " + error.message,
    });
  }
}

// Delete a Center by ID
async function deleteCenter(req, res) {
  const { id } = req.params;
  try {
    const existingcentre = await prisma.centres.findUnique({
      where: { id: parseInt(id) },
    });
    if (!existingcentre) {
      return res.status(404).json({ message: "Centre non trouvé" });
    }

    await prisma.centres.delete({
      where: { id: parseInt(id) },
    });
    res.status(200).json({ message: "Centre supprimé avec succès" });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Erreur lors de la suppression du centre: " + error.message,
    });
  }
}

module.exports = {
  getAllCenters,
  getCenterById,
  createCenter,
  updateCenter,
  deleteCenter,
};
