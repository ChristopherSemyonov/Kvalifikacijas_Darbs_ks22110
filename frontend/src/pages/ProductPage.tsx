// ProductPage.tsx
// Lapas "Produkta lapa" kods un dizains
// Autors: Kristofers Semjonovs

import { useState, useContext } from 'react'
import {
  useGetProductDetailsBySlugQuery,
  useGetProductReviewsQuery,
  useSubmitReviewMutation,
} from '../hooks/productHooks'
import { Store } from '../Store'
import LoadingBox from '../components/LoadingBox'
import MessageBox from '../components/MessageBox'
import { toast } from 'react-toastify'
import {
  Button,
  InputGroup,
  FormControl,
  Row,
  Col,
  Card,
  ListGroup,
  Badge,
  Form,
} from 'react-bootstrap'
import { useNavigate, useParams } from 'react-router-dom'
import { useUpdateProductStockMutation } from '../hooks/productHooks'
import { convertProductToCartItem } from '../utils' // Assuming this utility exists
import Rating from '../components/Rating'

export default function ProductPage() {
  const { slug } = useParams()
  const { state, dispatch } = useContext(Store)
  const { cart, userInfo } = state
  const [stockQuantity, setStockQuantity] = useState(1)
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')

  // Fetch product details by slug
  const {
    data: product,
    isLoading,
    error,
  } = useGetProductDetailsBySlugQuery(slug!)

  // Fetch product reviews
  const {
    data: reviews,
    isLoading: isReviewsLoading,
    error: reviewsError,
  } = useGetProductReviewsQuery(product?._id || '')

  const { mutateAsync: submitReview } = useSubmitReviewMutation()

  const { mutateAsync: updateStock } = useUpdateProductStockMutation()

  const navigate = useNavigate()

  const addToCartHandler = () => {
    const existItem = cart.cartItems.find((x) => x._id === product!._id)
    const quantity = existItem ? existItem.quantity + 1 : 1
    if (product!.countInStock < quantity) {
      toast.warn('Sorry. Product is out of stock')
      return
    }

    dispatch({
      type: 'CART_ADD_ITEM',
      payload: { ...convertProductToCartItem(product!), quantity },
    })

    toast.success('Product added to the cart')
    navigate('/cart')
  }

  const handleIncrease = () => {
    setStockQuantity(stockQuantity + 1)
  }

  const handleDecrease = () => {
    if (stockQuantity > 1) {
      setStockQuantity(stockQuantity - 1)
    }
  }

  const handleQuantityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(event.target.value)
    if (!isNaN(value) && value > 0) {
      setStockQuantity(value)
    }
  }

  const handleAddToStock = async () => {
    if (stockQuantity <= 0) {
      toast.warn('Please enter a valid quantity')
      return
    }

    try {
      if (product) {
        await updateStock({
          productId: product._id,
          stockQuantity,
        })
        toast.success(`Added ${stockQuantity} item(s) to stock!`)
      }
    } catch (error) {
      toast.error('Error adding to stock. Please try again later.')
    }
  }

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!comment) {
      toast.warn('Please provide comment!')
      return
    }

    try {
      if (product) {
        await submitReview({
          productId: product._id,
          rating,
          comment,
        })
        toast.success('Review submitted successfully!')
        setRating(0)
        setComment('')
      }
    } catch (error) {
      toast.error('One review per user allowed!')
    }
  }

  return isLoading ? (
    <LoadingBox />
  ) : error ? (
    <MessageBox variant="danger">{getError(error)}</MessageBox>
  ) : !product ? (
    <MessageBox variant="danger">Product Not Found</MessageBox>
  ) : (
    <div>
      <Row>
        <Col md={6}>
          <img className="large" src={product.image} alt={product.name}></img>
        </Col>
        <Col md={3}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h1>{product.name}</h1>
              <Rating rating={product.rating} numReviews={product.numReviews} />
            </ListGroup.Item>
            <ListGroup.Item>Price without tax: ${product.price}</ListGroup.Item>
            <ListGroup.Item>
              Count in stock: {product.countInStock}
            </ListGroup.Item>
            <ListGroup.Item>Brand: {product.brand}</ListGroup.Item>
            <ListGroup.Item>
              Description: <p>{product.description}</p>
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={3}>
          <Card>
            <Card.Body>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <Row>
                    <Col>Price with tax:</Col>
                    <Col>${(product.price * 1.2).toFixed(2)}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Status:</Col>
                    <Col>
                      {product.countInStock > 0 ? (
                        <Badge bg="success">In Stock</Badge>
                      ) : (
                        <Badge bg="danger">Out Of Stock</Badge>
                      )}
                    </Col>
                  </Row>
                </ListGroup.Item>
                {product.countInStock > 0 && (
                  <ListGroup.Item>
                    <div className="d-grid">
                      <Button onClick={addToCartHandler} variant="success">
                        Add to cart
                      </Button>
                    </div>
                  </ListGroup.Item>
                )}
                {userInfo && userInfo.isAdmin && (
                  <ListGroup.Item>
                    <InputGroup className="mb-3">
                      <Button
                        variant="outline-secondary"
                        onClick={handleDecrease}
                      >
                        -
                      </Button>
                      <FormControl
                        type="number"
                        value={stockQuantity}
                        onChange={handleQuantityChange}
                        min="1"
                        className="text-center"
                      />
                      <Button
                        variant="outline-secondary"
                        onClick={handleIncrease}
                      >
                        +
                      </Button>
                    </InputGroup>
                    <Button onClick={handleAddToStock} variant="primary">
                      Add to Stock
                    </Button>
                  </ListGroup.Item>
                )}
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {userInfo && (
        <Row className="mt-4">
          <Col md={12}>
            <h3>Leave a Review</h3>
            <Form onSubmit={handleSubmitReview}>
              <Form.Group controlId="rating">
                <Form.Label>Rating from 0 to 5:</Form.Label>
                <div className="rating">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <i
                      key={star}
                      className={rating >= star ? 'fas fa-star' : 'far fa-star'}
                      onClick={() => setRating(star)}
                      style={{
                        cursor: 'pointer',
                        color: '#FFD700',
                        fontSize: '24px',
                        marginRight: '5px',
                      }}
                    ></i>
                  ))}
                </div>
              </Form.Group>

              <Form.Group controlId="comment">
                <Form.Label>Comment:</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
              </Form.Group>

              <Button type="submit" variant="success" className="mt-3">
                Submit Review
              </Button>
            </Form>
          </Col>
        </Row>
      )}

      <Row className="mt-4">
        <Col md={12}>
          <h2>Reviews</h2>
          {isReviewsLoading ? (
            <LoadingBox />
          ) : reviewsError ? (
            <MessageBox variant="danger">error</MessageBox>
          ) : reviews && reviews.length === 0 ? (
            <MessageBox>No Reviews</MessageBox>
          ) : (
            <ListGroup variant="flush">
              {reviews.map((review) => (
                <ListGroup.Item key={review._id}>
                  <strong>{review.name}</strong>
                  <div className="rating">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <i
                        key={star}
                        className={
                          review.rating >= star ? 'fas fa-star' : 'far fa-star'
                        }
                        style={{
                          color: '#FFD700',
                          fontSize: '20px',
                          marginRight: '5px',
                        }}
                      ></i>
                    ))}
                  </div>
                  <p>{review.comment}</p>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </Col>
      </Row>
    </div>
  )
}
