const express = require("express");
const {
  createPayment,
  getAllPayments,
  getPaymentById,
  updatePayment,
  deletePayment,
  getFullyPaidPayments,
  getUnderpaidPayments,
  getPaymentsByMonth,
  getPaymentsByStudentId,
  getPaidPaymentsByStudentId,
  getUnpaidPaymentsByStudentId,
} = require("../controllers/payment");

const paymentsRouter = express.Router();

// Create a new payment
paymentsRouter.post("/", createPayment);

// Get all payments
paymentsRouter.get("/", getAllPayments);
paymentsRouter.get("/fully-paid", getFullyPaidPayments);
paymentsRouter.get("/fully-under-paid", getUnderpaidPayments);
paymentsRouter.get("/month/:month", getPaymentsByMonth);
paymentsRouter.get("/students/:studentId", getPaymentsByStudentId);
paymentsRouter.get("/students/paid/:studentId", getPaidPaymentsByStudentId);
paymentsRouter.get(
  "/students/under-paid/:studentId",
  getUnpaidPaymentsByStudentId
);

// Get a payment by ID
paymentsRouter.get("/:id", getPaymentById);

// Update a payment by ID
paymentsRouter.put("/:id", updatePayment);

// Delete a payment by ID
paymentsRouter.delete("/:id", deletePayment);

module.exports = paymentsRouter;
