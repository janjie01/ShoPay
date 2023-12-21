// ProductDetails.js
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Card,
  Button,
  Container,
  Row,
  Col,
  Navbar,
  Nav,
  Image,
} from "react-bootstrap";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";

function ProductDetails() {
  const navigate = useNavigate();
  const [cookies, , removeCookie] = useCookies(["token"]);
  const isTokenPresent = !!cookies.token;
  // Extract the product ID from the URL params
  const { id } = useParams();
  const [productDetails, setProductDetails] = useState(null);
  const [status, setStatus] = useState("");

  useEffect(() => {
    // Fetch product details based on the product_id
    fetch(`https://shopay-t848.onrender.com/product/${id}`)
      .then((response) => response.json())
      .then((responseData) => {
        setProductDetails(responseData);
      })
      .catch((error) => {
        console.error("Error fetching product details:", error);
      });
  }, [id]);

  const addToCart = async () => {
    try {
      const response = await fetch(
        `https://shopay-t848.onrender.com/add-to-cart`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ productId: parseInt(id, 10) }),
        }
      );

      const data = await response.json();

      if (response.status === 401) {
        // Handle 405 (Method Not Allowed) - Show an alert
        alert("You must log in first.");
      } else {
        // Handle other response statuses
        setStatus(data.status);
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      setStatus("Error adding to cart");
    }
  };

  const handleLogout = () => {
    fetch(`https://shopay-t848.onrender.com/logout`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.Status === "Success") {
          console.log("Logout Successfully");
          navigate("/");
        } else {
          console.error("Logout failed");
        }
      })
      .catch((error) => {
        console.error("Error during logout:", error);
      });
  };

  if (!productDetails) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div>
        <Navbar
          bg="success"
          variant="dark"
          expand="lg"
          fixed="top"
          className="p-2"
        >
          <Navbar.Brand href="/">
            <strong>ShoPay</strong>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ml-auto d-flex align-items-center">
              {isTokenPresent ? (
                <>
                  <Nav.Link href="/profile" className="mr-3">
                    Profile
                  </Nav.Link>
                  <Nav.Link href="/cart" className="mr-3">
                    Cart
                  </Nav.Link>
                  <Button variant="light" onClick={handleLogout}>
                    Logout
                  </Button>
                </>
              ) : (
                <Button variant="light" href="/login">
                  Login
                </Button>
              )}
            </Nav>
          </Navbar.Collapse>
        </Navbar>
      </div>

      <Container className="mt-3 pt-5">
        <Row className="justify-content-center">
          <Col md={6}>
            <Card>
              <Image src={productDetails.product_photo} alt="Profile" fluid />
              <Card.Body>
                <Card.Title>{productDetails.product_name}</Card.Title>
                <Card.Subtitle className="mb-2">
                  {productDetails.product_description}
                </Card.Subtitle>
                <Card.Subtitle className="mb-2">
                  Available Quantity: {productDetails.product_qty}
                </Card.Subtitle>
                <Button variant="secondary" onClick={addToCart}>
                  Add To Cart
                </Button>
                <p>{status}</p>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <br />
      </Container>
    </>
  );
}

export default ProductDetails;
