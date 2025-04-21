import {
  signupUser,
  loginUser,
  getAllUsers,
  getSingleUser
    } from'../controller/userControler.js';

import express from 'express'

const router = express.Router()

router.post('/login', loginUser)

router.post('/signup', signupUser)

router.get('/users', getAllUsers)

router.get('/getuser', getSingleUser)

router.get("/getallusers", getAllUsers)


export default router
