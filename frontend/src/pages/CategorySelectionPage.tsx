import { Container, Row, Col, Image, Card } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'

const CategorySelectionPage = () => {
  const navigate = useNavigate()

  const handleCategorySelect = (category: string) => {
    navigate(`/category/${category}`)
  }

  return (
    <Container className="text-center mt-5">
      <h1>Select a Product Category</h1>
      <Row className="mt-4">
        <Col md={4} className="mb-4">
          <Card
            className="category-card"
            onClick={() => handleCategorySelect('GPU')}
            style={{ cursor: 'pointer', width: '100%' }}
          >
            <Image
              src="/images/gpu.png"
              alt="Graphics Cards"
              className="category-image"
            />
            <p className="category-text">Graphics Cards</p>
          </Card>
        </Col>
        <Col md={4} className="mb-4">
          <Card
            className="category-card"
            onClick={() => handleCategorySelect('CPU')}
            style={{ cursor: 'pointer', width: '100%' }}
          >
            <Image
              src="/images/cpu.png"
              alt="Processors"
              className="category-image"
            />
            <p className="category-text">Processors</p>
          </Card>
        </Col>
        <Col md={4} className="mb-4">
          <Card
            className="category-card"
            onClick={() => handleCategorySelect('MOBO')}
            style={{ cursor: 'pointer', width: '100%' }}
          >
            <Image
              src="/images/mobo.png"
              alt="Motherboards"
              className="category-image"
            />
            <p className="category-text">Motherboards</p>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}

export default CategorySelectionPage
