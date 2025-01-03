import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import mongoose from 'mongoose'
import { productRouter } from './routers/productRouter'
import { seedRouter } from './routers/seedRouter'
import { userRouter } from './routers/userRouter'
import { orderRouter } from './routers/orderRouter'
import { keyRouter } from './routers/keyRouter'

dotenv.config()

const MONGODB_URI =
  process.env.MONGODB_URI ||
  'mongodb+srv://kristofers:krist2011@cluster0.x6dxp.mongodb.net/userkristofers?retryWrites=true&w=majority&appName=Cluster0'
mongoose.set('strictQuery', true)

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('connected to mongodb')
  })
  .catch(() => {
    console.log('error with connection to mongodb')
  })

const app = express()

app.use(
  cors({
    credentials: true,
    origin: ['http://localhost:5173'],
  })
)

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/api/products', productRouter)
app.use('/api/users', userRouter)
app.use('/api/orders', orderRouter)
app.use('/api/seed', seedRouter)
app.use('/api/keys', keyRouter)

const PORT = 4000
app.listen(PORT, () => {
  console.log(`Server started at http://localhost:${PORT}`)
})
