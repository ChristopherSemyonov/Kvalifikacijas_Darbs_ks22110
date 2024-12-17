import { Button, Container } from 'react-bootstrap'
import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'

function MainPage() {
  return (
    <Container className="welcome-container">
      <Helmet>
        <title>HomePage</title>
      </Helmet>
      <h1>Welcome to PCWorld!</h1>
      <p>Buy only the best graphics cards in our shop.</p>
      <Link to={`/products`}>
        <Button variant="success">Go Shopping</Button>
      </Link>
    </Container>
  )
}

export default MainPage
