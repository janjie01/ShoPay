import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Card, Button, Container, Row, Col, Navbar, Nav, Form } from 'react-bootstrap';

function Dashboard() {
  const navigate = useNavigate();
  const [productData, setProductData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetch(`https://shopay-t848.onrender.com/product`)
      .then((response) => response.json())
      .then((responseData) => {
        setProductData(responseData);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);

  const handleLogout = () => {
    fetch(`https://shopay-t848.onrender.com/logout`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.Status === 'Success') {
          console.log('Logout Successfully');
          navigate('/');
        } else {
          console.error('Logout failed');
        }
      })
      .catch((error) => {
        console.error('Error during logout:', error);
      });
  };

  // Filter products based on search query
  const filteredProducts = productData.filter(
    (product) =>
      product.product_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.product_description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <Navbar bg="success" variant="dark" expand="lg" fixed="top" className="p-2 justify-content-between">
        <Navbar.Brand href="/"><strong>ShoPay</strong></Navbar.Brand>
        <Form inline className="mx-auto">
          <Form.Control
            type="text"
            placeholder="Search Products"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </Form>
        <Nav>
          <Button variant="light" href="/login">
            Login
          </Button>
        </Nav>
      </Navbar>

      <Container fluid className="mt-5 pt-5">
        <Row xs={2} md={3} lg={4} xl={5} xxl={6} className="g-4">
          {filteredProducts.map((product, index) => (
            <Col key={index}>
              <Card style={{ width: '12rem', height: '100%', display: 'flex', flexDirection: 'column' }}>
                <Card.Img variant="top" src={product.product_photo} style={{ height: '50%', objectFit: 'cover' }} />
                <Card.Body className="d-flex flex-column">
                  <Card.Title>{product.product_name}</Card.Title>
                  <Card.Text>{product.product_description}</Card.Text>
                  <div className="mt-auto d-sm-inline-block">
                    <Card.Text>Price: {product.product_price}</Card.Text>
                    <Card.Text>Available Quantity: {product.product_qty}</Card.Text>
                    <Button as={Link} to={`/product/${product.product_id}`} variant="success">
                      View Details
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </>
  );
}

export default Dashboard;