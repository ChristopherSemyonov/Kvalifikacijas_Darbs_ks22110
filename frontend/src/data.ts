// UserInfo.ts
// Cieti kodēti produktu dati, tika izmantoti testēšanai bez backend
// Autors: Kristofers Semjonovs

import { Product } from './types/Product'

export const sampleProducts: Product[] = [
  {
    name: 'Gigabyte RTX 4090',
    slug: 'gigabyte-rtx-4090',
    category: 'GPU',
    image: '../images/p1.jpg',
    price: 1200,
    countInStock: 5,
    brand: 'Gigabyte',
    rating: 4.5,
    numReviews: 10,
    description: 'powerful graphics card',
  },
  {
    name: 'Gigabyte Aorus RTX 4090',
    slug: 'gigabyte-aorus-rtx-4090',
    category: 'GPU',
    image: '../images/p2.jpg',
    price: 1400,
    countInStock: 7,
    brand: 'Gigabyte',
    rating: 4.7,
    numReviews: 12,
    description: 'very powerful graphics card',
  },
  {
    name: 'Asus ROG Strix RTX 4090',
    slug: 'asus-rog-strix-rtx-4090',
    category: 'GPU',
    image: '../images/p3.jpg',
    price: 1800,
    countInStock: 3,
    brand: 'Gigabyte',
    rating: 5.0,
    numReviews: 8,
    description: 'premium quality graphics card',
  },
  {
    name: ' MSI RTX 4090',
    slug: 'msi-rtx-4090',
    category: 'GPU',
    image: '../images/p4.jpg',
    price: 1300,
    countInStock: 12,
    brand: 'Gigabyte',
    rating: 4.3,
    numReviews: 15,
    description: 'powerful graphics card',
  },
]
