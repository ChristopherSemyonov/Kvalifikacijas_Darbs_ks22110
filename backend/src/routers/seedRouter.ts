// seedRouter.ts
// Datu bāzes aizpildīšana ar noklusējuma vērtībām
// Autors: Kristofers Semjonovs

import express, { Request, Response } from 'express'
import asyncHandler from 'express-async-handler'
import { ProductModel } from '../models/productModel'
import { sampleProducts, sampleUsers } from '../data'
import { UserModel } from '../models/userModel'
import { OrderModel } from '../models/orderModel'
import { ReviewModel } from '../models/reviewModel'

export const seedRouter = express.Router()

// Izdzēst visus datubāzes datus un aizpildīt datubāzi ar jauniem sākuma datiem

seedRouter.get(
  '/',
  asyncHandler(async (req: Request, res: Response) => {
    await ProductModel.deleteMany({})
    const createdProducts = await ProductModel.insertMany(sampleProducts)

    await UserModel.deleteMany({})
    const createdUsers = await UserModel.insertMany(sampleUsers)

    await OrderModel.deleteMany({})

    await ReviewModel.deleteMany({})

    res.send({ createdProducts, createdUsers })
  })
)
