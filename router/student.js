const express = require("express");
const {
  createStudent,
  getAllStudents,
  getStudentById,
  updateStudent,
  deleteStudent,

  getStudentsWithPayments,
} = require("../controllers/student");

const studentRouter = express.Router();

// Create a new student
studentRouter.post("/", createStudent);

// Get all students
studentRouter.get("/", getAllStudents);

// Get a student by ID
studentRouter.get("/:id", getStudentById);

studentRouter.get("/payments/:school", getStudentsWithPayments);

// Update a student by ID
studentRouter.put("/:id", updateStudent);

// Delete a student by ID
studentRouter.delete("/:id", deleteStudent);

module.exports = studentRouter;
