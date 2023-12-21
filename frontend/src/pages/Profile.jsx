import React, { useState, useEffect } from 'react';
import { Card, Button, Container, Row, Col, Navbar, Nav, Image } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function Profile() {
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState({
    profilePicture: '',
    name: '',
    username: '',
    address: '',
    email: '',
    profile_pic: '',
    purchasedItems: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`https://shopay-t848.onrender.com/profile`, {
          method: 'GET',
          credentials: 'include',
        });
  
        if (response.ok) {
          const data = await response.json();

          const formattedPurchasedItems = data.purchasedItems.map(item => ({
            ...item,
            purchased_date: new Date(item.purchased_date).toLocaleString('en-US', {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
              hour: '2-digit',
              minute: '2-digit',
            }),
          }));

          setProfileData({
            userId: data.userId,
            name: data.name,
            username: data.username,
            address: data.address,
            email: data.email,
            profile_pic: data.profile_pic,
            purchasedItems: formattedPurchasedItems,
          });
        } else {
          console.error('Failed to fetch profile data');
        }
      } catch (error) {
        console.error('Error fetching profile data:', error.message);
      }
    };
  
    fetchData();
  }, []);

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
      <Container className='mt-3 pt-5'>
        
        <Row className="justify-content-center">
          <Col md={6}>
          <h1>Profile</h1>
            <Card>
              <Image src={profileData.profile_pic} alt="Profile" fluid />
              <Card.Body>
                <Card.Title>Name: {profileData.name}</Card.Title>
                <Card.Subtitle className="mb-2">Username: {profileData.username}</Card.Subtitle>
                <Card.Subtitle className="mb-2">Address: {profileData.address}</Card.Subtitle>
                <Card.Subtitle className="mb-2">Email: {profileData.email}</Card.Subtitle>
              </Card.Body>
            </Card>
          </Col>
        </Row><br />
      </Container>
      <Container fluid>
        <Row className="justify-content-center">
          <Col md={6}>
          <h1>Purchase History</h1>
            {profileData.purchasedItems.map((item, index) => (
                <Card key={index}>
                  <Card.Body>
                    <Card.Subtitle className="mb-2">Product Name: {item.product_name}</Card.Subtitle>
                    <Card.Subtitle className="mb-2">Quantity: {item.quantity}</Card.Subtitle>
                    <Card.Subtitle className="mb-2">Purchased Date: {item.purchased_date}</Card.Subtitle>
                  </Card.Body>
                </Card>
              ))}
              {profileData.purchasedItems.length === 0 && <p>No purchase history</p>}
          </Col>
        </Row><br />
      </Container>
    </>
  );
}

export default Profile;