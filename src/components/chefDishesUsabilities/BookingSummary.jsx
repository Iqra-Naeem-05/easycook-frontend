import { useState, useContext, useMemo, useEffect, useRef } from 'react';
import { Modal, Button, Form, Alert, Card, Badge } from "react-bootstrap";
import { FaUtensils, FaMapMarkerAlt, FaPhone, FaStickyNote, FaMoneyBillWave, FaCalendarAlt } from "react-icons/fa";
import { FiX } from "react-icons/fi";
import axios from "../../api/axiosConfig";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const BookingSummary = ({ selectedDishes, chef, bookingOptions }) => {
  const navigate = useNavigate();
  const { user, isLoggedIn } = useContext(AuthContext);

  const modalTopRef = useRef(null);

  const [showModal, setShowModal] = useState(false);
  const [address, setAddress] = useState("");
  const [contact, setContact] = useState("");
  const [instructions, setInstructions] = useState("");
  const [error, setError] = useState({});

  const selectedDishesArray = useMemo(
    () => Object.values(selectedDishes).filter(dish => dish !== null),
    [selectedDishes]
  );

  const renderedDishes = useMemo(() => {
    return Object.entries(selectedDishes).map(([slot, dish]) => {
      if (!dish) return null;
      const slotName = slot.charAt(0).toUpperCase() + slot.slice(1);
      const bookingLabel = dish.bookingType === "urgent" ? "Urgent" : "Pre-booking";
      return (
        <div key={dish.id} className="d-flex align-items-center mb-2">
          <FaUtensils className="text-muted me-2" />
          <small className="d-flex align-items-center flex-wrap">
            <span className="fw-semibold me-1">{slotName}:</span>
            <span className="me-2">{dish.name}</span>
            <Badge
              bg={dish.bookingType === "urgent" ? "danger" : "info"}
              className="me-2"
              pill
            >
              {bookingLabel}
            </Badge>
            <span className="text-brown d-flex align-items-center">
              <FaMoneyBillWave className="me-1" /> Rs: {dish.price}
            </span>
          </small>
        </div>
      );
    });
  }, [selectedDishes]);

  const totalPrice = useMemo(
    () => selectedDishesArray.reduce((sum, dish) => sum + dish.price, 0),
    [selectedDishesArray]
  );

  const validateForm = () => {
    const errors = {};
    // if (!address.trim() || address.trim().length < 10) {
    //   errors.address = "Please provide a complete address (minimum 10 characters)";
    // }

    if (!address.trim() || address.trim().length < 10) {
      errors.address = "Please provide a complete address";
    } else if (/^\d+$/.test(address)) {
      errors.address = "Address cannot be only numbers.";
    } else if (!/^[a-zA-Z0-9\s,.-]+$/.test(address)) {
      errors.address = "Address contains invalid characters.";
    } else if (/^(.)\1+$/.test(address)) {
      errors.address = "Please provide a valid address.";
    } else if (/(.)\1{4,}/.test(address)) {
      errors.address = "Please provide a valid address without excessive repetition.";
    }


    const phoneRegex = /^03\d{9}$/;
    if (!phoneRegex.test(contact)) {
      errors.contact = "Please enter a valid Pakistani number (format: 03XXXXXXXXX)";
    }

    if (instructions.trim() && instructions.trim().length < 5) {
      errors.instructions = "Instructions should be at least 5 characters long";
    }
    return errors;
  };

  const handleBookingConfirm = async () => {
    if (!isLoggedIn) {
      setError({ authError: "Please log in to complete your booking." });
      if (modalTopRef.current) {
        modalTopRef.current.scrollIntoView({ behavior: "smooth" });
      }
      return;
    }

    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setError(errors);
      return;
    }

    try {
      const firstDish = selectedDishesArray[0];
      const bookingInfo = bookingOptions[firstDish.id];


      const bookingData = {
        chef: chef?.id,
        customer: user?.id,
        address,
        contact_number: contact,
        special_instructions: instructions,
        dishes: selectedDishesArray.map(dish => dish.id),
        booking_type: bookingInfo.type,
        date: bookingInfo.type === "urgent" ? new Date().toISOString().split('T')[0] : bookingInfo.date,
        slot: selectedDishesArray.map(dish => {
          return Object.keys(selectedDishes).find(slot => selectedDishes[slot]?.id === dish.id);
        }),
      };

      await axios.post("/book-chef/", bookingData);
      setShowModal(false);
      navigate('/my-bookings', {
        state: {
          successMessage: "🎉 Your booking was successful!",
          bookingDetails: selectedDishesArray
        },
      });
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setError(error.response.data);
        console.log(error.response.data)
      } else {
        setError({ bookingFailed: "An unexpected error occurred. Please try again." });
      }
    }
  };

  useEffect(() => {
    if (error?.bookingFailed) {
      alert(error.bookingFailed);
    }
  }, [error]);

  useEffect(() => {
    if (!showModal) {
      setAddress("");
      setContact("");
      setInstructions("");
      setError({});
    }
  }, [showModal]);

  return (
    <>
      {/* Sticky Footer */}
      <div className="fixed-bottom bg-white shadow-lg border-top p-3">
        <div className="container">
          <div className="d-flex justify-content-between align-items-center">
            <div className="d-flex flex-column">
              {selectedDishesArray.length === 0 ? (
                <div className="d-flex align-items-center text-muted">
                  <FaUtensils className="me-2" />
                  <span>No dishes selected</span>
                </div>
              ) : (
                <div className="d-flex flex-column">
                  <div className="mb-1">
                    {renderedDishes}
                  </div>
                  <div className="d-flex align-items-center mt-1">
                    <strong className="text-navyBlue d-flex align-items-center ">
                      <FaMoneyBillWave className="me-2" />
                      Total: Rs {totalPrice}
                    </strong>
                  </div>
                </div>
              )}
            </div>

            <Button
              variant="navyBlue"
              size="sm"
              className="rounded-pill px-3 shadow-sm"
              disabled={selectedDishesArray.length === 0 || user?.id === chef?.id}
              onClick={() => setShowModal(true)}
            >
              <FaCalendarAlt className="me-2" />
              {selectedDishesArray.length > 0 ? "Book Now" : "Select Dishes"}
            </Button>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        centered
        size="md"
        backdrop="static"
      >
        <div ref={modalTopRef}>
          <Modal.Header closeButton className="border-0 pb-0">
            <Modal.Title className="fw-bold text-navyBlue">
              Complete Your Booking
            </Modal.Title>
          </Modal.Header>

          <Modal.Body className="pt-0">
            {error.authError && (
              <Alert variant="danger" className="d-flex align-items-center mb-3">
                <FiX className="me-2" />
                {error.authError}
                <Link className="alert-link ms-2 fw-bold" to={"/login"}>Login here</Link>
              </Alert>
            )}

            {error.non_field_errors && (
              <Alert variant="danger" className="d-flex align-items-center mb-3">
                {error.non_field_errors}
              </Alert>
            )}

            {/* {error.date && (
              <Alert variant="warning" className="d-flex align-items-center mb-3">
                <FiX className="me-2" />
                {error.date[0]} for pre-booking.
              </Alert>
            )} */}

            <Card className="mb-3 border-0 shadow-sm">
              <Card.Body>
                <h6 className="fw-bold mb-3 d-flex align-items-center">
                  <FaUtensils className="me-2 text-navyBlue" />
                  Order Summary
                </h6>
                <div className="mb-2">
                  {renderedDishes}
                </div>
                <div className="d-flex justify-content-between pt-2 mt-2 border-top">
                  <span className="fw-bold">Total Amount:</span>
                  <span className="fw-bold text-success">Rs {totalPrice}</span>
                </div>
              </Card.Body>
            </Card>

            <Form>
              <Form.Group className="mb-3">
                <Form.Label className="fw-bold d-flex align-items-center">
                  <FaMapMarkerAlt className="me-2 text-navyBlue" />
                  Delivery Address
                </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter your complete address with landmarks"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  isInvalid={!!error.address}
                  className="py-2"
                />
                {error.address && (
                  <Form.Text className="text-danger small">
                    {error.address}
                  </Form.Text>
                )}
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label className="fw-bold d-flex align-items-center">
                  <FaPhone className="me-2 text-navyBlue" />
                  Contact Number
                </Form.Label>
                <Form.Control
                  type="tel"
                  placeholder="03XXXXXXXXX"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  isInvalid={!!error.contact}
                  className="py-2"
                />
                {error.contact && (
                  <Form.Text className="text-danger small">
                    {error.contact}
                  </Form.Text>
                )}
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label className="fw-bold d-flex align-items-center">
                  <FaStickyNote className="me-2 text-navyBlue" />
                  Special Instructions
                </Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="Any dietary restrictions, allergies, or special requests..."
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  isInvalid={!!error.instructions}
                  className="py-2"
                />
                {error.instructions && (
                  <Form.Text className="text-danger small">
                    {error.instructions}
                  </Form.Text>
                )}
              </Form.Group>

              <Button
                variant="navyBlue"
                size="lg"
                className="w-100 rounded-pill py-2 fw-bold shadow-sm"
                onClick={handleBookingConfirm}
              >
                Confirm Booking
              </Button>
            </Form>
          </Modal.Body>
        </div>
      </Modal>
    </>
  );
};

export default BookingSummary;