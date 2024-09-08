const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const prisma = new PrismaClient();
const { validateEmailAndPassword } = require("../validation/auth");
const JWT_SECRET = process.env.JWT_SECRET || "sucretky";

function sanitizeUser(user) {
  const { password, students, ...userWithoutPassword } = user;
  return userWithoutPassword;
}

async function loginUser(req, res) {
  const { email, password } = req.body;
  const { error } = validateEmailAndPassword({ email, password });
  if (error) {
    return res.status(400).json(error);
  }
  try {
    const user = await prisma.users.findUnique({
      where: { email },
      include: {
        centre: {
          select: {
            name: true,
          },
        },
        students: {
          select: {
            sex: true,
          },
        },
      },
    });
    const countSex = user.students.reduce(
      (acc, student) => {
        acc[student.sex] = (acc[student.sex] || 0) + 1;
        return acc;
      },
      { HOMME: 0, FEMME: 0 }
    );

    console.log(countSex);
    if (!user) {
      return res.status(400).json({
        email: ["Identifiants incorrects"],
        password: ["Identifiants incorrects"],
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({
        email: ["Identifiants incorrects"],
        password: ["Identifiants incorrects"],
      });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, isOwner: user.isOwner },
      JWT_SECRET
      // ,
      // {
      //   expiresIn: "1h",
      // }
    );

    if (user.isOwner) {
      const students = await prisma.students.findMany({
        select: {
          sex: true,
        },
      });
      const countSex = students.reduce(
        (acc, student) => {
          acc[student.sex] = (acc[student.sex] || 0) + 1;
          return acc;
        },
        { HOMME: 0, FEMME: 0 }
      );
      const sanitizedUser = sanitizeUser(user);
    return   res.status(200).json({
        message: "Connexion réussie",
        token,
        user: { ...sanitizedUser, countSex },
      });
    } else {
      const sanitizedUser = sanitizeUser(user);
     return  res.status(200).json({
        message: "Connexion réussie",
        token,
        user: { ...sanitizedUser, countSex },
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la connexion de l'utilisateur: " + error.message,
    });
  }
}

module.exports = {
  loginUser,
};
