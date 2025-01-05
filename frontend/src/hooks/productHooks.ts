import { useQuery, useMutation } from '@tanstack/react-query'
import apiClient from '../apiClient'
import { Product } from '../types/Product'

// Fetch all products
export const useGetProductsQuery = () =>
  useQuery({
    queryKey: ['products'],
    queryFn: async () => (await apiClient.get<Product[]>(`api/products`)).data,
  })

// Fetch product details by slug
export const useGetProductDetailsBySlugQuery = (slug: string) =>
  useQuery({
    queryKey: ['products', slug],
    queryFn: async () =>
      (await apiClient.get<Product>(`api/products/slug/${slug}`)).data,
  })

// Fetch products by category
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
