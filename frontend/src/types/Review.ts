// Review.ts
// Atsauksmes definēšana, kādus datus satur atsauksme
// Autors: Kristofers Semjonovs

export interface Review {
  _id: string
  productId: string
  user: string
  rating: number
  comment: string
  createdAt: string
  updatedAt: string
}
