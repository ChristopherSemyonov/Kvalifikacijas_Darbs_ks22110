import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'

export const useGetReviewsByProductId = (productId: string) => {
  const [reviews, setReviews] = useState<unknown[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true)
      setError(null)

      try {
        const response = await fetch(`/api/products/${productId}/reviews`)
        if (!response.ok) {
          throw new Error('Error fetching reviews')
        }

        const data = await response.json()
        setReviews(data)
      } catch (err) {
        setError('Error fetching reviews')
        toast.error('Error fetching reviews')
      } finally {
        setLoading(false)
      }
    }

    if (productId) {
      fetchReviews()
    }
  }, [productId])

  return { reviews, loading, error }
}

export const useAddReview = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const addReview = async (
    productId: string,
    rating: number,
    comment: string
  ) => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/products/${productId}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ rating, comment }),
      })

      if (!response.ok) {
        throw new Error('Error adding review')
      }

      toast.success('Review added successfully')
    } catch (err) {
      setError('Error adding review')
      toast.error('Error adding review')
    } finally {
      setLoading(false)
    }
  }

  return { addReview, loading, error }
}
