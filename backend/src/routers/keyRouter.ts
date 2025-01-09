// keyRouter.ts
// Maksātāja id iegūšana
// Autors: Kristofers Semjonovs

import express from 'express'

//Iegūt paypal klienta id priekš maksājuma

export const keyRouter = express.Router()
// /api/keys/paypal
keyRouter.get('/paypal', (req, res) => {
  res.json({
    clientId: process.env.PAYPAL_CLIENT_ID || 'sb',
  })
})
