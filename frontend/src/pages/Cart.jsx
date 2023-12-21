import React, { useEffect, useState } from 'react';
import { Card, Button, Container, Row, Col, Navbar, Nav, Image } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const CartPage = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCartData = async () => {
      try {
        const response = await fetch(`http://localhost:3000/cart`, {
          method: 'GET',
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error('Error fetching cart data');
        }

        const data = await response.json();
        setLoading(false);
        
        // Assuming data is in the format { data: [...cartItems] }
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
        const response = await fetch(`http://localhost:3000/checkout`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include', // Include cookies (which should include the authentication token)
            body: JSON.stringify({ cartId: item.cart_id, productName: item.product_name }),
        });
  
      if (!response.ok) {
        const errorData = await response.json(); // Try to parse the error response
        throw new Error(`Error initiating checkout: ${response.status} - ${errorData.message}`);
      }
  
      // Handle success, e.g., show a success message or update the UI
      console.log('Checkout successful');
      setTimeout(() => {
        window.location.reload();
      }, 100);
  
      // After successful checkout, you may want to update the cart in the frontend
      // For example, remove the item from the cartItems state
      setCartItems((prevItems) => prevItems.filter((cartItem) => cartItem.cart_id !== item.cart_id));
    } catch (error) {
      console.error('Error initiating checkout:', error.message);
    }
  };
  
  const handleLogout = () => {
    fetch(`http://localhost:3000/logout`, {
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
      <div>
        <Navbar bg="success" variant="dark" expand="lg" fixed="top" className="p-2">
          <Navbar.Brand href="/"><strong>ShoPay</strong></Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ml-auto d-flex align-items-center">
              <Nav.Link href="/profile" className="mr-3">Profile</Nav.Link>
              <Nav.Link href="/cart" className="mr-3">Cart</Nav.Link>
              <Button variant="light" onClick={handleLogout}>Logout</Button>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
      </div>

      <Container className='mt-5 m-5'>
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