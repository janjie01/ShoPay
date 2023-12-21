import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { Card, Button, Container, Row, Col } from "react-bootstrap";
import CustomNavbar from "./NavigationBar";

function Dashboard() {
  const navigate = useNavigate();
  const [productData, setProductData] = useState([]);

  useEffect(() => {
    fetch(`https://shopay-t848.onrender.com/product`)
      .then((response) => response.json())
      .then((responseData) => {
        setProductData(responseData);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

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

  return (
    <>
      <div>
        <CustomNavbar />
      </div>

      <Container fluid className="mt-5 pt-5">
        <Row xs={2} md={3} lg={4} xl={5} xxl={6} className="g-4">
          {productData.map((product, index) => (
            <Col key={index}>
              <Card
                style={{
                  width: "13rem",
                  height: "20rem", // Set a fixed height for the card
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <div style={{ overflow: "hidden", height: "50%" }}>
                  <Card.Img
                    variant="top"
                    src={product.product_photo}
                    className="img-fluid"
                    style={{
                      objectFit: "cover",
                      width: "100%",
                      height: "100%",
                    }}
                  />
                </div>
                <Card.Body className="d-flex flex-column">
                  <Card.Title>{product.product_name}</Card.Title>
                  <Card.Text>{product.product_description}</Card.Text>
                  <div className="mt-auto d-sm-inline-block">
                    <Card.Text>
                      Available Quantity: {product.product_qty}
                    </Card.Text>
                    <Button
                      as={Link}
                      to={`/product/${product.product_id}`}
                      variant="success"
                    >
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
