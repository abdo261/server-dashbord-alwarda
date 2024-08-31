const { loginUser } = require('../controllers/auth')

const authRouter = require('express').Router()

authRouter.post('/login',loginUser)
module.exports = authRouter