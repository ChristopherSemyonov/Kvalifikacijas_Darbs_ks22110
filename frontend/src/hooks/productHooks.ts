// productHooks.ts
// Ar produktiem saistītu darbību sasaiste ar backend
// Autors: Kristofers Semjonovs

import { useQuery, useMutation } from '@tanstack/react-query'
import apiClient from '../apiClient'
import { Product } from '../types/Product'
import { Review } from '../types/Review'

// Produktu iegūšana no datubāzes
export const useGetProductsQuery = () =>
  useQuery({
    queryKey: ['products'],
    queryFn: async () => (await apiClient.get<Product[]>('api/products')).data,
  })

// Produktu detaļu iegūšana, atbilstoši slug
export const useGetProductDetailsBySlugQuery = (slug: string) =>
  useQuery({
    queryKey: ['products', slug],
    queryFn: async () =>
      (await apiClient.get<Product>(`api/products/slug/${slug}`)).data,
  })

// Produktu iegūšana atbilstoši kategorijai
export const useGetProductsByCategoryQuery = (category: string) =>
  useQuery({
    queryKey: ['products', category],
    queryFn: async () =>
      (await apiClient.get<Product[]>(`api/products?category=${category}`))
        .data,
  })

// Produkta krājuma papildināšana
export const useUpdateProductStockMutation = () =>
  useMutation({
    mutationFn: async ({
      productId,
      stockQuantity,
    }: {
      productId: string
      stockQuantity: number
    }) => {
      const response = await apiClient.put<Product>(
        `/api/products/${productId}/update-stock`,
        { stockQuantity }
      )
      return response.data
    },
    onSuccess: (data) => {
      console.log('Stock updated successfully:', data)
    },
    onError: (error) => {
      console.error('Error updating stock:', error)
    },
  })

// Produktu atsauksmju iegūšana
export const useGetProductReviewsQuery = (productId: string) =>
  useQuery({
    queryKey: ['reviews', productId],
    queryFn: async () =>
      (await apiClient.get<Review[]>(`/api/products/${productId}/reviews`))
        .data,
  })

// Produkta atsauksmes iesniegšana
export const useSubmitReviewMutation = () =>
  useMutation({
    mutationFn: async ({
      productId,
      rating,
      comment,
    }: {
      productId: string
      rating: number
      comment: string
    }) => {
      const response = await apiClient.post<Review>(
        `/api/products/${productId}/reviews`,
        {
          rating,
          comment,
        }
      )
      return response.data
    },
    onSuccess: (data) => {
      console.log('Review submitted successfully:', data)
    },
    onError: (error) => {
      console.error('Error submitting review:', error)
    },
  })
