const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Create a new payment
async function createPayment(req, res) {
  const {
    studentId,
    month,
    totalAmount,
    amountPaid,
    amountDue,
    discount,
    dueDate,
  } = req.body;

  try {
    // Fetch subjects for the student
    const subjects = await prisma.subjects.findMany({
      where: {
        students: {
          some: {
            id: studentId,
          },
        },
      },
      include: {
        level: true,
      },
    });

    // Map the subjects for JSON storage
    const subjectData = subjects.map((subject) => ({
      name: subject.name,
      level: subject.level.name,
      isPayed: false,
      pricePerMonth: subject.pricePerMonth,
      discount: subjects.length > 1 ? 50 : 0,
    }));

    // Create the payment record
    const newPayment = await prisma.payments.create({
      data: {
        studentId,
        month,
        totalAmount,
        amountPaid,
        amountDue,
        discount,
        dueDate: new Date(dueDate),
        subjects: JSON.stringify(subjectData),
      },
    });

    res
      .status(201)
      .json({ message: "Payment created successfully", payment: newPayment });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating payment: " + error.message });
  }
}

// Get all payments
async function getAllPayments(req, res) {
  try {
    const payments = await prisma.payments.findMany({
      include: {
        student: {
          include: {
            user: true,
            level: true,
            centre: true,
            subjects: true,
          },
        },
      },
    });
    res.status(200).json(payments);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error fetching payments: " + error.message });
  }
}

// Get payment by ID
async function getPaymentById(req, res) {
  const { id } = req.params;

  try {
    const payment = await prisma.payments.findUnique({
      where: { id: parseInt(id, 10) },
      include: {
        student: {
          include: {
            user: true,
            level: true,
            centre: true,
            subjects: true,
          },
        },
      },
    });

    if (!payment) {
      return res.status(404).json({ error: "Payment not found" });
    }

    res.status(200).json(payment);
  } catch (error) {
    res.status(500).json({ error: "Error fetching payment: " + error.message });
  }
}

async function updatePayment(req, res) {
  const { id } = req.params;
  const { amountPaid, subjects, have50 } = req.body;

  try {
  
    const payment = await prisma.payments.findUnique({
      where: { id: parseInt(id) },
    });

    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    // Update payment
    const updatedPayment = await prisma.payments.update({
      where: { id: parseInt(id) },
      data: {
        amountPaid,
        amountDue: payment.totalAmount - amountPaid,
        subjects,
        have50,
      },
    });

    res.status(200).json({
      message: "Payment updated successfully",
      payment: updatedPayment,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating payment: " + error.message,
    });
  }
}
// Update a payment
// async function updatePayment(req, res) {
//   const { id } = req.params;
//   const {
//     month,
//     totalAmount,
//     amountPaid,
//     amountDue,
//     discount,
//     dueDate,
//     subjects,
//   } = req.body;

//   try {
//     const payment = await prisma.payments.findUnique({
//       where: { id: parseInt(id, 10) },
//     });
//     if (!payment) {
//       return res.status(404).json({ message: "Payment n'exist pas ." });
//     }
//     console.log(JSON.parse(subjects));
//     const updatedSubjectData = JSON.parse(subjects).map((subject) => ({
//       id:subject.id,
//       name: subject.name,
//       level: subject.level,
//       isPayed: subject.isPayed,
//       pricePerMonth: subject.pricePerMonth,
//       discount: subjects.length > 1 ? 50 : 0,
//     }));
//     // const paidSubjectsCount = updatedSubjectData.filter(subject => subject.isPayed === true).length;

//     const updatedPayment = await prisma.payments.update({
//       where: { id: parseInt(id, 10) },
//       data: {
//         // month:month ? month :payment.month,
//         amountPaid : amountPaid ? amountPaid : payment.amountPaid ,
//         amountDue: amountDue || payment.totalAmount - (amountPaid ? amountPaid : payment.amountPaid),
//         // discount,
//         // dueDate:dueDate ? new Date(dueDate) :undefined,
//         subjects:JSON.stringify(updatedSubjectData) ,
//       },
//     });
//     res.status(200).json(updatedPayment);
//   } catch (error) {
//     res.status(500).json({ error: "Error updating payment: " + error.message });
//   }
// }

async function deletePayment(req, res) {
  const { id } = req.params;

  try {
    await prisma.payments.delete({
      where: { id: parseInt(id, 10) },
    });
    res.status(200).json({ message: "Payment deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting payment: " + error.message });
  }
}

async function getFullyPaidPayments(req, res) {
  try {
    const fullyPaidPayments = await prisma.payments.findMany({
      where: {
        amountPaid: {
          equals: prisma.payments.fields.totalAmount,
        },
      },
      include: {
        student: true,
      },
    });
  //   const fullyPaidPayments = await prisma.$queryRaw`
  //   SELECT * FROM Payments WHERE amountPaid = totalAmount;
  // `;
    res.status(200).json(fullyPaidPayments);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching fully paid payments: " + error.message,
    });
  }
}

async function getUnderpaidPayments(req, res) {
  try {
    const underpaidPayments = await prisma.payments.findMany({
      where: {
        amountPaid: {
          lt: prisma.payments.fields.totalAmount,
        },
      },
      include: {
        student: true,
      },
    });

    res.status(200).json(underpaidPayments);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching underpaid payments: " + error.message });
  }
}

async function getPaymentsByMonth(req, res) {
  const { month } = req.params;

  try {
    const payments = await prisma.payments.findMany({
      where: {
        month: month,
      },
      include: {
        student: true,
      },
    });

    if (payments.length === 0) {
      return res
        .status(404)
        .json({ message: `No payments found for month ${month}` });
    }

    res.status(200).json(payments);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching payments by month: " + error.message });
  }
}
async function getPaymentsByStudentId(req, res) {
  const { studentId } = req.params;

  try {
    const payments = await prisma.payments.findMany({
      where: {
        studentId: parseInt(studentId, 10),
      },
      include: {
        student: true,
      },
    });

    if (payments.length === 0) {
      return res
        .status(404)
        .json({ message: `No payments found for student ID ${studentId}` });
    }

    res.status(200).json(payments);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching payments for student: " + error.message,
    });
  }
}
async function getPaidPaymentsByStudentId(req, res) {
  const { studentId } = req.params;

  try {
    const payments = await prisma.payments.findMany({
      where: {
        studentId: parseInt(studentId, 10),
        amountPaid: {
          equals:  prisma.payments.fields.totalAmount
        },
      },
      include: {
        student: true,
      },
    });

    if (payments.length === 0) {
      return res.status(404).json({
        message: `No paid payments found for student ID ${studentId}`,
      });
    }

    res.status(200).json(payments);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching paid payments for student: " + error.message,
    });
  }
}

async function getUnpaidPaymentsByStudentId(req, res) {
  const { studentId } = req.params;

  try {
    const payments = await prisma.payments.findMany({
      where: {
        studentId: parseInt(studentId, 10),
        amountPaid: {
          lt:  prisma.payments.fields.totalAmount,
        },
      },
      include: {
        student: true,
      },
    });

    if (payments.length === 0) {
      return res.status(404).json({
        message: `No unpaid payments found for student ID ${studentId}`,
      });
    }

    res.status(200).json(payments);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching unpaid payments for student: " + error.message,
    });
  }
}

module.exports = {
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
};
