import express from 'express'
import { ProductModel } from '../models/productModel'
import asyncHandler from 'express-async-handler'

export const productRouter = express.Router()
// /api/products
productRouter.get(
  '/',
  asyncHandler(async (req, res) => {
    const products = await ProductModel.find()
    res.json(products)
  })
)
// /api/slug/gpu
productRouter.get(
  '/slug/:slug',
  asyncHandler(async (req, res) => {
    const product = await ProductModel.findOne({ slug: req.params.slug })
    if (product) {
      res.json(product)
    } else {
      res.status(404).json({ messsage: 'Product Not Found' })
    }
  })
)
