// userHooks.ts
// Ar lietotājiem saistītu datu apstrāde
// Autors: Kristofers Semjonovs

import { useMutation } from '@tanstack/react-query'
import apiClient from '../apiClient'
import { UserInfo } from '../types/UserInfo'

// Lietotāja pieteikšanās informācijas nosūtīšana
export const useSigninMutation = () =>
  useMutation({
    mutationFn: async ({
      email,
      password,
    }: {
      email: string
      password: string
    }) =>
      (
        await apiClient.post<UserInfo>(`api/users/signin`, {
          email,
          password,
        })
      ).data,
  })

// Lietotāja reģistrācijas datu nosūtīšana
export const useSignupMutation = () =>
  useMutation({
    mutationFn: async ({
      name,
      email,
      password,
    }: {
      name: string
      email: string
      password: string
    }) =>
      (
        await apiClient.post<UserInfo>(`api/users/signup`, {
          name,
          email,
          password,
        })
      ).data,
  })

// Dati par izmaiņām lietotāja informācijā
export const useUpdateProfileMutation = () =>
  useMutation({
    mutationFn: async ({
      name,
      email,
      password,
    }: {
      name: string
      email: string
      password: string
    }) =>
      (
        await apiClient.put<UserInfo>(`api/users/profile`, {
          name,
          email,
          password,
        })
      ).data,
  })

// Jaunās paroles ievietošana
export const useForgotPasswordMutation = () =>
  useMutation({
    mutationFn: async ({
      email,
      newPassword,
    }: {
      email: string
      newPassword: string
    }) =>
      (
        await apiClient.post<{ message: string }>(`api/users/forgotpassword`, {
          email,
          newPassword,
        })
      ).data,
  })
