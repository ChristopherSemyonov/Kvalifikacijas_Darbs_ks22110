// App.tsx
// Lapas nemainīgo dizaina elementu kods, šie elementi uzrādīsies neatkarīgi no tā, kurā lapā atrodaties
// Autors: Kristofers Semjonovs

import { useContext, useEffect } from 'react'
import {
  Badge,
  Button,
  Container,
  Nav,
  Navbar,
  NavDropdown,
} from 'react-bootstrap'
import { Link, Outlet } from 'react-router-dom'
import { LinkContainer } from 'react-router-bootstrap'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { Store } from './Store'
import '@fortawesome/fontawesome-free/css/all.min.css'

function App() {
  const {
    state: { mode, cart, userInfo },
    dispatch,
  } = useContext(Store)

  useEffect(() => {
    document.body.setAttribute('data-bs-theme', mode)
  }, [mode])

  const SwitchModeHandler = () => {
    dispatch({ type: 'SWITCH_MODE' })
  }

  const signoutHandler = () => {
    dispatch({ type: 'USER_SIGNOUT' })
    localStorage.removeItem('userInfo')
    localStorage.removeItem('cartItems')
    localStorage.removeItem('shippingAddress')
    localStorage.removeItem('paymentMethod')
    window.location.href = '/signin'
  }

  return (
    <div className="d-flex flex-column vh-100">
      <ToastContainer position="bottom-center" limit={1} />
      <header>
        <Navbar expand="lg">
          <Container className="brand-container">
            <LinkContainer to="/">
              <Navbar.Brand>
                <img src="/custom-icon.svg" alt="Logo" className="logo" />
                <span className="brand-text">PCWorld</span>
                {userInfo?.isAdmin && (
                  <span className="ms-2 text-danger">Admin</span>
                )}
              </Navbar.Brand>
            </LinkContainer>
          </Container>
          <Nav className="nav-buttons">
            <Button variant={mode} onClick={SwitchModeHandler}>
              <i
                className={
                  mode === 'light'
                    ? 'fa-solid fa-lightbulb'
                    : 'fa-regular fa-lightbulb'
                }
              ></i>
            </Button>
            <Link to="/category" className="nav-link">
              Products
            </Link>
            <Link to="/cart" className="nav-link">
              Cart
              {cart.cartItems.length > 0 && (
                <Badge pill bg="success" className="cart-item-count">
                  {cart.cartItems.reduce((a, c) => a + c.quantity, 0)}
                </Badge>
              )}
            </Link>
            {userInfo ? (
              <NavDropdown title={userInfo.name} id="basic-nav-dropdown">
                <LinkContainer to="/orderhistory">
                  <NavDropdown.Item>Order History</NavDropdown.Item>
                </LinkContainer>
                {userInfo.isAdmin && (
                  <LinkContainer to="/deliverymanagement">
                    <NavDropdown.Item>Delivery Management</NavDropdown.Item>
                  </LinkContainer>
                )}
                <Link
                  className="dropdown-item"
                  to="#signout"
                  onClick={signoutHandler}
                >
                  Sign Out
                </Link>
              </NavDropdown>
            ) : (
              <Link className="nav-link" to="/signin">
                Sign In
              </Link>
            )}
          </Nav>
        </Navbar>
      </header>
      <main className="flex-grow-1">
        <Container className="mt-3">
          <Outlet />
        </Container>
      </main>
      <footer>
        <div className="text-center">Kristofers Semjonovs, ks22110</div>
      </footer>
    </div>
  )
}

export default App
