const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const jwt = require('jsonwebtoken')
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: [
      'https://client-dashboard-alwarda.vercel.app',
      'https://client-dashboard-alwa-git-ccae60-abdellah-ait-bachikhs-projects.vercel.app',
      'https://client-dashboard-alwarda-nsi8li84g.vercel.app',
      "https://client-dashboard-alwarda.vercel.app/",
      "http://localhost:3000"
    ],
    methods: ["GET", "POST"],
  },
});

require("dotenv").config();

const userRouter = require("./router/user");
const studentRouter = require("./router/student");
const centreRouter = require("./router/centre");
const levelRouter = require("./router/level");
const subjectRouter = require("./router/subject");
const paymentsRouter = require("./router/payment");
const authRouterRouter = require("./router/auth");
const authenticateJWT = require("./middleware/authenticateJWT");

// Middleware
app.use(cors({
  origin: [
    'https://client-dashboard-alwarda.vercel.app',
    'https://client-dashboard-alwa-git-ccae60-abdellah-ait-bachikhs-projects.vercel.app',
    'https://client-dashboard-alwarda-nsi8li84g.vercel.app',
    "https://client-dashboard-alwarda.vercel.app/",
    "http://localhost:3000"
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use((req, res, next) => {
  const excludedRoutes = ["/api/auth/login"];
  if (excludedRoutes.includes(req.path)) {
    return next(); 
  }
  authenticateJWT(req, res, next);
});
app.use(express.json());

// Routes
app.use("/api/students", studentRouter);
app.use("/api/centres", centreRouter);
app.use("/api/levels", levelRouter);
app.use("/api/subjects", subjectRouter);
app.use("/api/users", userRouter);
app.use("/api/payments", paymentsRouter);
app.use("/api/auth", authRouterRouter);



const connectedClients = []; 
const socketToUserMap = {}; 

io.on('connection', (socket) => {

  socket.on('conectCLintId', (token) => {
    try {

      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secretkey');
      const userId = decoded.id;


      if (!connectedClients.includes(userId)) {
        connectedClients.push(userId);
      }

      socketToUserMap[socket.id] = userId;

      console.log(`User connected: ${userId}`);
      
  
      io.emit('connectedClients', connectedClients);

    } catch (err) {
      console.error('Token verification failed:', err);
    }
  });

  socket.on('disconnect', () => {

    const userId = socketToUserMap[socket.id];

    if (userId) {

      const index = connectedClients.indexOf(userId);
      if (index !== -1) {
        connectedClients.splice(index, 1);
        console.log(`User disconnected: ${userId}`);
      }
     
      delete socketToUserMap[socket.id];
    }

   
    io.emit('connectedClients', connectedClients);
  });
});


// require('./jobs/createMonthlyFees')
// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT,'0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
});
