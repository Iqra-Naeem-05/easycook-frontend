import { useState, useEffect } from "react";
import { Container, Row, Col, Button, Card } from "react-bootstrap";
import { FaHome, FaShieldAlt, FaMoneyBillWave, FaClock, FaCalendarCheck } from "react-icons/fa";
import axios from "../api/axiosConfig";
import { Link } from "react-router-dom";
import ChefListCard from "../components/ChefListCard";

const HomePage = () => {
  const [featuredChefs, setFeaturedChefs] = useState([]);

  useEffect(() => {
    axios.get("featured-Chef/")
      .then(res => {
        setFeaturedChefs(res.data)
        console.log(res.data)
      })
      .catch(err => console.error(err));
  }, []);

  const scrollToHowItWorks = () => {
    const section = document.getElementById("how-it-works");
    if (section) {
      section.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  };

  return (
    <>
      {/* Hero Section */}
      <section className="hero-section text-center text-brown d-flex align-items-center">
        <Container>
          <h1 className="display-5 ">Delicious Meals, Cooked At Your Home</h1>
          <p className="lead mt-3">Book a verified chef for breakfast, lunch, or dinner with ease.</p>
          <div className="mt-4">
            <Button variant="light " size="lg" className="text-maron" onClick={scrollToHowItWorks}>How It Works</Button>
            <Link to="/chefs">
              <Button variant="outline-light" size="lg" className="me-3 text-maron ">Explore Chefs</Button>
            </Link>
          </div>
        </Container>
      </section>

      <section id="how-it-works" className="position-relative py-5 text-white fw-bold">
        <div
          className="position-absolute top-0 start-0 w-100 h-100"
          style={{
            background: ' linear-gradient(rgba(3, 51, 99, 0.4)), url(../images/slider1.webp)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            zIndex: 0,

          }}
        ></div>

        <div className="position-relative" style={{ zIndex: 1 }}>
          <Container>
            <h2 className="text-center mb-4 fw-bold" >How It Works</h2>
            <Row className="text-center">
              <Col md={4}>
                <i className="bi bi-clock fs-1"></i>
                <h5 className="mt-3 fw-bold">1. Pick a Chef & Dish</h5>
                <p className="fs-5">Browse by specialty or reviews</p>
              </Col>
              <Col md={4}>
                <i className="bi bi-person-check fs-1"></i>
                <h5 className="mt-3 fw-bold">2. Choose a Slot</h5>
                <p className="fs-5">Select breakfast, lunch, or dinner</p>
              </Col>
              <Col md={4}>
                <i className="bi bi-calendar-check fs-1"></i>
                <h5 className="mt-3 fw-bold">3. Book & Relax</h5>
                <p className="fs-5">Book urgently or in advance</p>
              </Col>
            </Row>
          </Container>
        </div>
      </section>

      {/* When Can You Book? */}
      <section className="bg-light py-5 text-brown my-4">
        <Container>
          <h3 className="text-center mb-4 fw-bold">When Can You Book?</h3>
          <Row className="text-center">
            <Col md={6} className="mb-4">
              <div className="p-4 shadow rounded bg-white h-100">
                <FaClock className="fs-2 text-navyBlue mb-3" />
                <h5 className="fw-semibold">Need a Chef Soon?</h5>
                <p className="fs-6">
                  Urgent bookings are available, but make sure to book at least <strong>1 hour before your mealtime</strong> so our chefs can get ready.
                </p>
              </div>
            </Col>
            <Col md={6} className="mb-4">
              <div className="p-4 shadow rounded bg-white h-100">
                <FaCalendarCheck className="fs-2 text-navyBlue mb-3" />
                <h5 className="fw-semibold">Planning Ahead?</h5>
                <p className="fs-6">
                  Prefer to plan your meals? You can pre-book a chef up to <strong>7 days in advance</strong> and lock in your favorite dish early.
                </p>
              </div>
            </Col>
          </Row>
        </Container>
      </section>


      {/* Featured Chefs */}
      <section className="py-5 ">
        <Container>
          <h2 className="text-center mb-4 text-brown">Featured Chefs</h2>
          <Row>
            {featuredChefs.map((chef) => (
              <ChefListCard key={chef.id} chef={chef} />
            ))}
          </Row>
        </Container>
      </section>

      <section className="py-3 bg-beige text-maron">
        <Container>
          <h2 className="text-center mt-3 mb-5 ">Why EasyCook?</h2>
          <Row className="text-center">
            <Col md={3} className="mb-4">
              <FaHome className="fs-1 text-navyBlue mb-3" />
              <p className="fw-semibold">Home-cooked by Professionals</p>
            </Col>
            <Col md={3} className="mb-4">
              <FaShieldAlt className="fs-1 text-navyBlue mb-3" />
              <p className="fw-semibold">Trusted & Verified Chefs</p>
            </Col>
            <Col md={3} className="mb-4">
              <FaMoneyBillWave className="fs-1 text-navyBlue mb-3" />
              <p className="fw-semibold">Pay with Cash on Delivery</p>
            </Col>
            <Col md={3} className="mb-4">
              <FaClock className="fs-1 text-navyBlue mb-3" />
              <p className="fw-semibold">Flexible Booking Options</p>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Call to Action */}
      <section className="text-center py-5 bg-navyBlue text-white">
        <Container>
          <h2>Ready to Taste the Difference?</h2>
          <p className="lead">Book a home chef now and enjoy food made fresh just for you.</p>
          <Link to="/chefs">
            <Button size="lg" variant="light">Start Booking</Button>
          </Link>
        </Container>
      </section>
    </>
  );
};

export default HomePage;
