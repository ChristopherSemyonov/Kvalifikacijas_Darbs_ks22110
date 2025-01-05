import { Button, Container } from 'react-bootstrap'
import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { useContext } from 'react'
import { Store } from '../Store'

function MainPage() {
  const { state } = useContext(Store)
  const { userInfo } = state

  return (
    <Container className="welcome-container">
      <Helmet>
        <title>HomePage</title>
      </Helmet>
      <h1>Welcome to PCWorld!</h1>
      <p>Buy only the best computer components in our shop!</p>
      <div className="mb-3 d-flex align-items-center">
        {userInfo ? (
          <>
            <span className="me-3">Welcome back, {userInfo.name}!</span>
            <Link to={`/category`}>
              <Button variant="success">Go Shopping</Button>
            </Link>
          </>
        ) : (
          <>
            <Link to={`/category`}>
              <Button variant="success" className="me-3">
                Go Shopping
              </Button>
            </Link>
            <Link to={`/signin`}>
              <Button variant="success" className="me-2">
                Sign In
              </Button>
            </Link>
            <Link to={`/signup`}>
              <Button variant="success" className="me-2">
                Sign Up
              </Button>
            </Link>
          </>
        )}
      </div>
    </Container>
  )
}

export default MainPage
