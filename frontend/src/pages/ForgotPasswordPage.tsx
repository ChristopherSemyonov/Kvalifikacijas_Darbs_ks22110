// ForgotPasswordPage.tsx
// Lapas "Paroles maiņa" kods un dizains
// Autors: Kristofers Semjonovs

import { useState } from 'react'
import { Button, Container, Form } from 'react-bootstrap'
import { Helmet } from 'react-helmet-async'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useForgotPasswordMutation } from '../hooks/userHooks'

export default function ForgotPasswordPage() {
  const navigate = useNavigate()
  const { mutateAsync: forgotPassword, isLoading } = useForgotPasswordMutation()

  const [email, setEmail] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const submitHandler = async (e: React.SyntheticEvent) => {
    e.preventDefault()

    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match!')
      return
    }

    try {
      await forgotPassword({ email, newPassword })
      toast.success('Password reset successfully. Please sign in.')
      navigate('/signin')
    } catch (err) {
      toast.error('Failed to reset password. Please try again.')
    }
  }

  return (
    <Container className="small-container">
      <Helmet>
        <title>Forgot Password</title>
      </Helmet>
      <h1 className="my-3">Forgot Password</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group className="mb-3" controlId="email">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="newPassword">
          <Form.Label>New Password</Form.Label>
          <Form.Control
            type="password"
            required
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="confirmPassword">
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control
            type="password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </Form.Group>
        <div className="mb-3">
          <Button variant="success" type="submit" disabled={isLoading}>
            Reset Password
          </Button>
        </div>
      </Form>
    </Container>
  )
}
