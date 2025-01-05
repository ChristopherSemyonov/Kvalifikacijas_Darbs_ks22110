import { useState, useContext } from 'react'
import { useGetProductDetailsBySlugQuery } from '../hooks/productHooks'
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
} from 'react-bootstrap'
import Rating from '../components/Rating'
import { useNavigate, useParams } from 'react-router-dom'
import { useUpdateProductStockMutation } from '../hooks/productHooks'
import { convertProductToCartItem } from '../utils' // Assuming this utility exists

export default function ProductPage() {
  const { slug } = useParams()
  const { state, dispatch } = useContext(Store) // Ensure dispatch is from Store context
  const { cart, userInfo } = state
  const [stockQuantity, setStockQuantity] = useState(1)

  // Fetch product details by slug
  const {
    data: product,
    isLoading,
    error,
  } = useGetProductDetailsBySlugQuery(slug!)

  // Use the mutation for updating the stock
  const { mutateAsync: updateStock } = useUpdateProductStockMutation()

  const navigate = useNavigate()

  // Handle add to cart
  const addToCartHandler = () => {
    const existItem = cart.cartItems.find((x) => x._id === product!._id)
    const quantity = existItem ? existItem.quantity + 1 : 1
    if (product!.countInStock < quantity) {
      toast.warn('Sorry. Product is out of stock')
      return
    }

    // Dispatch the action to add item to cart
    dispatch({
      type: 'CART_ADD_ITEM',
      payload: { ...convertProductToCartItem(product!), quantity },
    })

    toast.success('Product added to the cart')
    navigate('/cart')
  }

  // Handle increase in stock quantity
  const handleIncrease = () => {
    setStockQuantity(stockQuantity + 1)
  }

  // Handle decrease in stock quantity
  const handleDecrease = () => {
    if (stockQuantity > 1) {
      setStockQuantity(stockQuantity - 1)
    }
  }

  // Handle stock quantity input change
  const handleQuantityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(event.target.value)
    if (!isNaN(value) && value > 0) {
      setStockQuantity(value)
    }
  }

  // Handle adding stock to the product
  const handleAddToStock = async () => {
    if (stockQuantity <= 0) {
      toast.warn('Please enter a valid quantity')
      return
    }

    try {
      if (product) {
        await updateStock({
          productId: product._id, // Use the product ID
          stockQuantity,
        })
        toast.success(`Added ${stockQuantity} item(s) to stock!`)
      }
    } catch (error) {
      toast.error('Error adding to stock. Please try again later.')
    }
  }

  // Loading, error, or product display
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
            <ListGroup.Item>Price: ${product.price}</ListGroup.Item>
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
                    <Col>Price</Col>
                    <Col>${product.price}</Col>
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
    </div>
  )
}
