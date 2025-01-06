import { useQuery, useMutation } from '@tanstack/react-query'
import apiClient from '../apiClient'
import { Product } from '../types/Product'
import { Review } from '../types/Review'

export const useGetProductsQuery = () =>
  useQuery({
    queryKey: ['products'],
    queryFn: async () => (await apiClient.get<Product[]>('api/products')).data,
  })

export const useGetProductDetailsBySlugQuery = (slug: string) =>
  useQuery({
    queryKey: ['products', slug],
    queryFn: async () =>
      (await apiClient.get<Product>(`api/products/slug/${slug}`)).data,
  })

export const useGetProductsByCategoryQuery = (category: string) =>
  useQuery({
    queryKey: ['products', category],
    queryFn: async () =>
      (await apiClient.get<Product[]>(`api/products?category=${category}`))
        .data,
  })

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

export const useGetProductReviewsQuery = (productId: string) =>
  useQuery({
    queryKey: ['reviews', productId],
    queryFn: async () =>
      (await apiClient.get<Review[]>(`/api/products/${productId}/reviews`))
        .data,
  })

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
