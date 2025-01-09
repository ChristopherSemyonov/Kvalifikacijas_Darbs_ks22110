// orderHooks.ts
// Frontend mijiedarbība ar backend, datu iegūšana vai nosūtīšana
// Autors: Kristofers Semjonovs

import { useMutation, useQuery } from '@tanstack/react-query'
import apiClient from '../apiClient'
import { CartItem, ShippingAddress } from '../types/Cart'
import { Order } from '../types/Order'

// Pasūtījumu detaļu iegūšana
export const useGetOrderDetailsQuery = (id: string) =>
  useQuery({
    queryKey: ['orders', id],
    queryFn: async () => (await apiClient.get<Order>(`api/orders/${id}`)).data,
  })

// Maksātāja detaļu iegūšana
export const useGetPaypalClientIdQuery = () =>
  useQuery({
    queryKey: ['paypal-clientId'],
    queryFn: async () =>
      (await apiClient.get<{ clientId: string }>(`/api/keys/paypal`)).data,
  })

// Pasūtījuma apmaksas datu nosūtīšana
export const usePayOrderMutation = () =>
  useMutation({
    mutationFn: async (details: { orderId: string }) =>
      (
        await apiClient.put<{ message: string; order: Order }>(
          `api/orders/${details.orderId}/pay`,
          details
        )
      ).data,
  })

// Pasūtījuma izveides datu nosūtīšana
export const useCreateOrderMutation = () =>
  useMutation({
    mutationFn: async (order: {
      orderItems: CartItem[]
      shippingAddress: ShippingAddress
      paymentMethod: string
      itemsPrice: number
      shippingPrice: number
      taxPrice: number
      totalPrice: number
    }) =>
      (
        await apiClient.post<{ message: string; order: Order }>(
          `api/orders`,
          order
        )
      ).data,
  })

// Klienta veikto pasūtījumu iegūšana no datubāzes
export const useGetOrderHistoryQuery = () =>
  useQuery({
    queryKey: ['order-history'],
    queryFn: async () =>
      (await apiClient.get<Order[]>(`/api/orders/mine`)).data,
  })

// Visu veikto pasūtījumu iegūšana no datubāzes (administrators)
export const useGetAllOrderHistoryQuery = () =>
  useQuery({
    queryKey: ['order-history'],
    queryFn: async () => (await apiClient.get<Order[]>(`/api/orders/all`)).data,
  })

// Produkta krājumu izmaiņas veikšana
export const useUpdateStockMutation = () =>
  useMutation({
    mutationFn: async (orderItems: { productId: string; quantity: number }[]) =>
      (
        await apiClient.post<{ message: string }>(`api/products/updateStock`, {
          orderItems,
        })
      ).data,
  })

// Datu par pasūtījuma piegādi nosūtīšana
export const useDeliverOrderMutation = () =>
  useMutation({
    mutationFn: async (orderId: string) =>
      (
        await apiClient.patch<{ message: string }>(
          `/api/orders/${orderId}/deliver`
        )
      ).data,
  })

// Pieprasījums dzēst noteiktu pasūtījumu no datubāzes 
export const useDeleteOrderMutation = () =>
  useMutation({
    mutationFn: async (orderId: string) =>
      (await apiClient.delete<{ message: string }>(`/api/orders/${orderId}`))
        .data,
  })
