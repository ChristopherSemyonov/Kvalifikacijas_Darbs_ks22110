// User.ts
// Lietotāja definēšana, kādus datus satur lietotājs
// Autors: Kristofers Semjonovs

export type User = {
  _id: string
  name: string
  email: string
  token: string
  isAdmin: boolean
}
