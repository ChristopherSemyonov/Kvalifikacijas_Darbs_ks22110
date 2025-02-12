// orderRouter.ts
// Ar pasūtījumiem saistītas funkcijas
// Autors: Kristofers Semjonovs

import express, { Request, Response } from 'express'
import asyncHandler from 'express-async-handler'
import { Order, OrderModel } from '../models/orderModel'
import { Product } from '../models/productModel'
import { isAuth, isAdmin } from '../utils'

export const orderRouter = express.Router()

// iegūt reģistrēta lietotāja produktus
orderRouter.get(
  '/mine',
  isAuth,
  asyncHandler(async (req: Request, res: Response) => {
    const orders = await OrderModel.find({ user: req.user._id })
    res.json(orders)
  })
)

// Iegūt visus pasūtījumus (administrators)
orderRouter.get(
  '/all',
  isAuth,
  isAdmin,
  asyncHandler(async (req: Request, res: Response) => {
    const orders = await OrderModel.find({})
    res.json(orders)
  })
)

// Iegūt specifisku pasūtījumu izmantojot id
orderRouter.get(
  '/:id',
  isAuth,
  asyncHandler(async (req: Request, res: Response) => {
    const order = await OrderModel.findById(req.params.id)
    if (order) {
      res.json(order)
    } else {
      res.status(404).json({ message: 'Order Not Found' })
    }
  })
)

// Jauna pasūtījuma izveide
orderRouter.post(
  '/',
  isAuth,
  asyncHandler(async (req: Request, res: Response) => {
    if (req.body.orderItems.length === 0) {
      res.status(400).json({ message: 'Cart is empty' })
    } else {
      const createdOrder = await OrderModel.create({
        orderItems: req.body.orderItems.map((x: Product) => ({
          ...x,
          product: x._id,
        })),
        shippingAddress: req.body.shippingAddress,
        paymentMethod: req.body.paymentMethod,
        itemsPrice: req.body.itemsPrice,
        shippingPrice: req.body.shippingPrice,
        taxPrice: req.body.taxPrice,
        totalPrice: req.body.totalPrice,
        user: req.user._id,
      } as Order)
      res.status(201).json({ message: 'Order Created', order: createdOrder })
    }
  })
)

// Atzīmēt pasūtījumu kā apmaksātu
orderRouter.put(
  '/:id/pay',
  isAuth,
  asyncHandler(async (req: Request, res: Response) => {
    const order = await OrderModel.findById(req.params.id)

    if (order) {
      order.isPaid = true
      order.paidAt = new Date(Date.now())
      order.paymentResult = {
        paymentId: req.body.id,
        status: req.body.status,
        update_time: req.body.update_time,
        email_address: req.body.email_address,
      }
      const updatedOrder = await order.save()
      res.send({ order: updatedOrder, message: 'Order Paid Successfully' })
    } else {
      res.status(404).json({ message: 'Order Not Found' })
    }
  })
)

// Piegādāt pasūtījumu (administrators)
orderRouter.patch(
  '/:id/deliver',
  isAuth,
  isAdmin,
  asyncHandler(async (req: Request, res: Response) => {
    const order = await OrderModel.findById(req.params.id)
    if (order) {
      order.isDelivered = true
      order.deliveredAt = new Date(Date.now())
      const updatedOrder = await order.save()
      res.json({ message: 'Order Delivered Successfully', order: updatedOrder })
    } else {
      res.status(404).json({ message: 'Order Not Found' })
    }
  })
)

// Izdzēst pasūtījumu (administrators)
orderRouter.delete(
  '/:id',
  isAuth,
  isAdmin,
  asyncHandler(async (req: Request, res: Response) => {
    const order = await OrderModel.findById(req.params.id)
    if (order) {
      await OrderModel.deleteOne({ _id: req.params.id }) // dzēst pasūtījumu
      res.json({ message: 'Order Deleted Successfully' })
    } else {
      res.status(404).json({ message: 'Order Not Found' })
    }
  })
)
