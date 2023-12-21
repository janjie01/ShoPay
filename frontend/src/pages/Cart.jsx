import React, { useEffect, useState } from 'react';
import { Card, Button, Container, Navbar, Nav } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const CartPage = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCartData = async () => {
      try {
        const response = await fetch(`https://shopay-t848.onrender.com/cart`, {
          method: 'GET',
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error('Error fetching cart data');
        }

        const data = await response.json();
        setLoading(false);

        if (data && data.data) {
          setCartItems(data.data);
        }
      } catch (error) {
        console.error('Error fetching cart data:', error);
        setLoading(false);
      }
    };

    fetchCartData();
  }, []);

  const handleCheckout = async (item) => {
    try {
      const response = await fetch(`https://shopay-t848.onrender.com/checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ cartId: item.cart_id, productName: item.product_name }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Error initiating checkout: ${response.status} - ${errorData.message}`);
      }

      setCartItems((prevItems) => prevItems.filter((cartItem) => cartItem.cart_id !== item.cart_id));
    } catch (error) {
      console.error('Error initiating checkout:', error.message);
    }
  };

  const handleLogout = () => {
    fetch(`https://shopay-t848.onrender.com/logout`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(response => response.json())
      .then(data => {
        if (data.Status === 'Success') {
          console.log('Logout Successfully');
          navigate('/');
        } else {
          console.error('Logout failed');
        }
      })
      .catch(error => {
        console.error('Error during logout:', error);
      });
  };

  return (
    <>
      <Navbar bg="success" variant="dark" expand="lg" fixed="top">
        <Container>
          <Navbar.Brand href="/dashboard"><strong>ShoPay</strong></Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="mr-auto">
              <Nav.Link href="/profile" className="mr-3">Profile</Nav.Link>
            </Nav>
            <Nav>
              <Button variant="light" onClick={handleLogout}>Logout</Button>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container className='mt-5 m-2'>
        <h1>Your Cart</h1>
        {loading ? (
          <p>Loading...</p>
        ) : Array.isArray(cartItems) && cartItems.length > 0 ? (
          cartItems.map(item => (
            <Card key={item.product_name} style={{ marginBottom: '10px' }}>
              <Card.Body>
                <Card.Title>{item.product_name}</Card.Title>
                <Card.Text>{item.product_description}</Card.Text>
                <Card.Text>${item.product_price}</Card.Text>
                <Card.Text>Quantity: {item.quantity}</Card.Text>
                <Button variant='primary' onClick={() => handleCheckout(item)}>Checkout</Button>
              </Card.Body>
            </Card>
          ))
        ) : (
          <p>No items in the cart</p>
        )}
      </Container>
    </>
  );
};

export default CartPage;