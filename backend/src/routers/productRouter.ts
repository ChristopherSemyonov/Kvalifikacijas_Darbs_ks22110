import express from 'express'
import { ProductModel } from '../models/productModel'
import asyncHandler from 'express-async-handler'

export const productRouter = express.Router()

const validCategories = ['CPU', 'GPU', 'MOBO']

// /api/products
productRouter.get(
  '/',
  asyncHandler(async (req, res) => {
    const { category } = req.query

    if (category && !validCategories.includes(category)) {
      return res.status(400).json({ message: 'Invalid category' })
    }

    let products

    if (category) {
      products = await ProductModel.find({ category })
    } else {
      products = await ProductModel.find()
    }

    res.json(products)
  })
)

// /api/slug/:slug
productRouter.get(
  '/slug/:slug',
  asyncHandler(async (req, res) => {
    const product = await ProductModel.findOne({ slug: req.params.slug })
    if (product) {
      res.json(product)
    } else {
      res.status(404).json({ message: 'Product Not Found' })
    }
  })
)

productRouter.post(
  '/updateStock',
  asyncHandler(async (req, res) => {
    const { orderItems } = req.body

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ message: 'No order items provided' })
    }

    try {
      for (const item of orderItems) {
        const { productId, quantity } = item
        const product = await ProductModel.findById(productId)

        if (!product) {
          return res
            .status(404)
            .json({ message: `Product with ID ${productId} not found` })
        }

        product.countInStock -= quantity

        if (product.countInStock < 0) {
          return res
            .status(400)
            .json({ message: `Not enough stock for product ${product.name}` })
        }

        await product.save()
      }

      res.status(200).json({ message: 'Stock updated successfully' })
    } catch (error) {
      res
        .status(500)
        .json({ message: 'Error updating stock', error: error.message })
    }
  })
)
