import express from 'express'
import { ProductModel } from '../models/productModel'
import { ReviewModel } from '../models/reviewModel'
import asyncHandler from 'express-async-handler'
import { isAuth } from '../utils'

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

// /api/products/:id/reviews
productRouter.post(
  '/:id/reviews',
  isAuth,
  asyncHandler(async (req, res) => {
    const { rating, comment } = req.body
    const productId = req.params.id

    const product = await ProductModel.findById(productId)

    if (!product) {
      return res.status(404).json({ message: 'Product not found' })
    }

    const existingReview = await ReviewModel.findOne({
      product: productId,
      name: req.user.name,
    })

    if (existingReview) {
      return res
        .status(400)
        .json({ message: 'You already reviewed this product' })
    }

    const review = new ReviewModel({
      product: productId,
      name: req.user.name,
      rating: Number(rating),
      comment,
    })

    try {
      await review.save()

      const reviews = await ReviewModel.find({ product: productId })

      const totalReviews = reviews.length
      const totalRating = reviews.reduce(
        (acc, review) => acc + review.rating,
        0
      )

      product.numReviews = totalReviews
      product.rating = totalRating / totalReviews

      await product.save()

      res.status(201).json({ message: 'Review added successfully' })
    } catch (error) {
      res.status(500).json({ message: 'Failed to add review' })
    }
  })
)

// Get reviews for a product
productRouter.get(
  '/:id/reviews',
  asyncHandler(async (req, res) => {
    const productId = req.params.id

    const reviews = await ReviewModel.find({ product: productId })

    // Send reviews directly as an array (not inside an object)
    res.json(reviews)
  })
)

// /api/products/updateStock
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

// /api/products/:id/update-stock
productRouter.put(
  '/:id/update-stock',
  asyncHandler(async (req, res) => {
    const { stockQuantity } = req.body

    if (stockQuantity <= 0 || isNaN(stockQuantity)) {
      return res.status(400).json({ message: 'Invalid stock quantity' })
    }

    const product = await ProductModel.findById(req.params.id)

    if (!product) {
      return res.status(404).json({ message: 'Product not found' })
    }

    product.countInStock += stockQuantity

    await product.save()

    res.status(200).json({
      message: `Successfully added ${stockQuantity} items to the stock`,
      product,
    })
  })
)
