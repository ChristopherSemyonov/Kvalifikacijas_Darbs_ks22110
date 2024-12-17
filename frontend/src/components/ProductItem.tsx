import { Button, Card } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { Product } from '../types/Product'
import Rating from './Rating'
import { useContext } from 'react'
import { Store } from '../Store'
import { CartItem } from '../types/Cart'
import { convertProductToCartItem } from '../utils'
import { toast } from 'react-toastify'

function ProductItem({ product }: { product: Product }) {
  const { state, dispatch } = useContext(Store)
  const {
    cart: { cartItems },
  } = state

  const addToCartHandler = (item: CartItem) => {
    const existItem = cartItems.find((x) => x._id === product._id)
    const quantity = existItem ? existItem.quantity + 1 : 1

    if (product.countInStock < quantity) {
      toast.dismiss('cartAdd')
      if (!toast.isActive('stockOut')) {
        toast.error('Sorry. Product is out of stock', {
          toastId: 'stockOut',
          autoClose: 2000, // Toast duration in milliseconds
        })
      }
      return
    }

    dispatch({
      type: 'CART_ADD_ITEM',
      payload: { ...item, quantity },
    })

    toast.dismiss('stockOut')
    if (!toast.isActive('cartAdd')) {
      toast.success('Product added to the cart', {
        toastId: 'cartAdd',
        autoClose: 2000, // Toast duration in milliseconds
      })
    }
  }

  return (
    <Link to={`/product/${product.slug}`} className="product-container">
      <Card className="product-body">
        <img src={product.image} alt={product.name} />
        <Card.Body>
          <Card.Title className="product-title">{product.name}</Card.Title>
          <Rating rating={product.rating} numReviews={product.numReviews} />
          <Card.Text>${product.price}</Card.Text>
          {product.countInStock === 0 ? (
            <Button className="out-of-stock-btn" variant="light" disabled>
              Out of stock
            </Button>
          ) : (
            <Button
              className="add-to-cart-btn"
              variant="success"
              onClick={(e) => {
                e.preventDefault()
                addToCartHandler(convertProductToCartItem(product))
              }}
            >
              Add to cart
            </Button>
          )}
        </Card.Body>
      </Card>
    </Link>
  )
}

export default ProductItem
