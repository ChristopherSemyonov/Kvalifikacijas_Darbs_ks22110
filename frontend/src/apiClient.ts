// ApiClient.ts
// Lietotāja informācijas iegūšana no backend
// Autors: Kristofers Semjonovs

import axios from 'axios'


// Pārbaude vai darbība notiek izstrādes vidē, iespējama nākotnē izveidot vietnes domēnu
const apiClient = axios.create({
  baseURL:
    process.env.NODE_ENV === 'development' ? 'http://localhost:4000/' : '/',
  headers: {
    'Content-type': 'application/json',
  },
})

apiClient.interceptors.request.use(
  async (config) => {
    if (localStorage.getItem('userInfo'))
      config.headers.authorization = `Bearer ${
        JSON.parse(localStorage.getItem('userInfo')!).token
      }`
    return config
  },
  (error) => {
    Promise.reject(error)
  }
)

export default apiClient
