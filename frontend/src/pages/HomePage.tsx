// HomePage.tsx
// Lapas "Produkti" kods un dizains
// Autors: Kristofers Semjonovs

import { Col, Row } from 'react-bootstrap'
import LoadingBox from '../components/LoadingBox'
import MessageBox from '../components/MessageBox'
import ProductItem from '../components/ProductItem'
import { Helmet } from 'react-helmet-async'
import { useGetProductsByCategoryQuery } from '../hooks/productHooks'
import { ApiError } from '../types/ApiError'
import { getError } from '../utils'
import { useParams } from 'react-router-dom'

export default function ProductsByCategoryPage() {
  const { category } = useParams()
  const {
    data: products,
    isLoading,
    error,
  } = useGetProductsByCategoryQuery(category!)

  return isLoading ? (
    <LoadingBox />
  ) : error ? (
    <MessageBox variant="danger">
      {getError(error as unknown as ApiError)}
    </MessageBox>
  ) : (
    <Row>
      <Helmet>
        <title>{category} Products</title>
      </Helmet>
      {products!.length === 0 ? (
        <MessageBox>No products found for this category</MessageBox>
      ) : (
        products!.map((product) => (
          <Col key={product.slug} sm={6} md={4} lg={3}>
            <ProductItem product={product} />
          </Col>
        ))
      )}
    </Row>
  )
}
