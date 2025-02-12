// userRouter.ts
// Ar lietotāja darbībām saistītas funkcijas
// Autors: Kristofers Semjonovs

import express, { Request, Response } from 'express'
import asyncHandler from 'express-async-handler'
import bcrypt from 'bcryptjs'
import { UserModel } from '../models/userModel'
import { generateToken } from '../utils'

export const userRouter = express.Router()

// Lietotāja pieteikšanās sistēmā
// POST /api/users/signin
userRouter.post(
  '/signin',
  asyncHandler(async (req: Request, res: Response) => {
    const user = await UserModel.findOne({ email: req.body.email })
    if (user && bcrypt.compareSync(req.body.password, user.password)) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        token: generateToken(user),
      })
    } else {
      res.status(401).json({ message: 'Invalid email or password' })
    }
  })
)

// Lietotāja reģistrēšanās sistēmā
// POST /api/users/signup
userRouter.post(
  '/signup',
  asyncHandler(async (req: Request, res: Response) => {
    const { name, email, password } = req.body;

    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: 'User already exists' });
      return;
    }
    
    const user = await UserModel.create({
      name,
      email,
      password: bcrypt.hashSync(password),
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user),
    });
  })
);


// Lietotāja paroles nomaiņa
// POST /api/users/forgotpassword
userRouter.post(
  '/forgotpassword',
  asyncHandler(async (req: Request, res: Response) => {
    const { email, newPassword } = req.body
    const user = await UserModel.findOne({ email })
    if (!user) {
      res.status(404).json({ message: 'User not found' })
      return
    }
    user.password = bcrypt.hashSync(newPassword, 10)
    await user.save()
    res.json({ message: 'Password reset successfully' })
  })
)
