const express = require("express");
const {
  createLevel,
  getAllLevels,
  getLevelById,
  updateLevel,
  deleteLevel,
  getLevelBySchool
} = require("../controllers/level");

const levelRouter = express.Router();

// Create a new level
levelRouter.post("/", createLevel);

// Get all levels
levelRouter.get("/", getAllLevels);

// Get a level by ID
levelRouter.get("/:id", getLevelById);
levelRouter.get("/school/:school", getLevelBySchool);

// Update a level by ID
levelRouter.put("/:id", updateLevel);

// Delete a level by ID
levelRouter.delete("/:id", deleteLevel);

module.exports = levelRouter;
