import {useState, useEffect } from 'react';
import axios from "../../api/axiosConfig";
import { Link } from "react-router-dom";
import { Card, Badge, Button, ProgressBar, Offcanvas, Alert } from 'react-bootstrap';

const statusColors = {
    pending: 'warning',
    confirmed: 'success',
    cancelled: 'danger',
    completed: 'primary',
    expired: 'dark',
    rejected: 'secondary',
};

const BookingCard = ({ booking, forChef = false }) => {
    const [error, setError] = useState("")
    const [timeLeft, setTimeLeft] = useState(null);
    const [percentageLeft, setPercentageLeft] = useState(100);
    const [progressBarVariant, setProgressBarVariant] = useState('info');
    const [showOffcanvas, setShowOffcanvas] = useState(false);

    // Handle offcanvas toggle
    const handleShowOffcanvas = () => setShowOffcanvas(true);
    const handleCloseOffcanvas = () => setShowOffcanvas(false);

    // Calculate Expiry Time for Pending Bookings
    useEffect(() => {
        if (forChef && booking.status === 'pending') {
            const now = new Date();
            const createdAt = new Date(booking.created_at);
            let expireTime;

            if (booking.booking_type === 'urgent') {
                expireTime = new Date(createdAt.getTime() + 15 * 60 * 1000); // 15 mins
            } else if (booking.booking_type === 'prebooking') {
                expireTime = new Date(createdAt.getTime() + 60 * 60 * 1000); // 1 hour
            }

            const interval = setInterval(() => {
                const now = new Date();
                const secondsLeft = Math.max(0, Math.floor((expireTime - now) / 1000));
                setTimeLeft(secondsLeft);

                const totalSeconds = booking.booking_type === 'urgent' ? 15 * 60 : 60 * 60;
                setPercentageLeft((secondsLeft / totalSeconds) * 100);

                if (booking.booking_type === 'urgent') {
                    if (secondsLeft <= 5 * 60) {
                        setProgressBarVariant('danger');
                    }
                } else if (booking.booking_type === 'prebooking') {
                    if (secondsLeft <= 30 * 60) {
                        setProgressBarVariant('danger');
                    }
                }

                if (secondsLeft <= 0) {
                    clearInterval(interval);
                }
            }, 1000);

            return () => clearInterval(interval);
        }
    }, [booking, forChef, progressBarVariant]);

    const handleStatusUpdate = async (newStatus) => {
        try {
            await axios.patch(`/update-booking-status/${booking.id}/`, {
                status: newStatus
            });
            window.location.reload();
        } catch (error) {
            console.error('Error updating status:', error.response.data.error);
            setError(error.response.data.error)
        }
    };

    // Utility to format seconds into mm:ss
    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
        const secs = (seconds % 60).toString().padStart(2, '0');
        return `${mins}:${secs}`;
    };

    const isCancellationAllowed = () => {
        const now = new Date();
        const confirmedAt = new Date(booking.status_updated_at);
        const bookingDate = new Date(booking.date);

        if (booking.booking_type === 'urgent') {
            const cancelDeadline = new Date(confirmedAt.getTime() + 15 * 60 * 1000);
            return now <= cancelDeadline;
        }

        if (booking.booking_type === 'prebooking') {
            const cancelDeadline = new Date(bookingDate);
            cancelDeadline.setDate(cancelDeadline.getDate() - 1);
            cancelDeadline.setHours(23, 59, 59, 999);
            return now <= cancelDeadline;
        }

        return false;
    };

    const handlePaymentStatusUpdate = async () => {
        const confirmation = window.confirm("Are you sure you want to change the payment status?");
        if (!confirmation) return;

        try {
            await axios.patch(`/mark-booking-paid/${booking.id}/`, {
                is_paid: true
            });
            window.location.reload();
        } catch (error) {
            console.error('Error updating payment status:', error);
        }
    };

    return (
        <>
            <Card className="mb-3" style={{ cursor: 'pointer' }} onClick={handleShowOffcanvas}>
                <Card.Body>
                    <div className="d-flex justify-content-between">
                        <div>
                            <h6 className='fw-bold text-capitalize' > {booking.booking_type}</h6>
                            <div className="d-flex gap-2 flex-wra ">
                            <Badge
                                className={`border border-${statusColors[booking.status]} text-${statusColors[booking.status]}`}
                                bg="light"
                            >
                                {booking.status.toUpperCase()}
                            </Badge>

                            {booking.status === 'confirmed' || booking.status === 'completed' ? (
                                <Badge className={`border border-${booking.is_paid ? 'success' : 'danger'} text-${booking.is_paid ? 'success' : 'danger'} `}
                                bg="light" 
                                >
                                    {booking.is_paid ? 'Paid' : 'Payment Due'}
                                </Badge>
                            ) : null}
                            </div>
                        </div>
                    </div>

                    <hr />
                    
                    <p><strong>Slot:</strong> {booking.slot_display}</p>
                    <p><strong>Date:</strong> {booking.date}</p>
                
                </Card.Body>
            </Card>

            {/* Offcanvas for more details */}
            <Offcanvas show={showOffcanvas} onHide={handleCloseOffcanvas} placement="end" className="text-navyBlue" >
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title>Booking Details</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    <p><strong>Booking Type:</strong> {booking.booking_type}</p>
                    <p><strong>Slot:</strong> {booking.slot_display} | {booking.date}</p>
                    <p><strong>Dishes:</strong> {booking.dishes_details.map(dish => dish.name).join(', ')}</p>
                    <p><strong>Amount:</strong> {booking.dishes_details.map(dish => dish.price).join(', ')}</p>
                    {forChef ? (
                        <>
                        <p><strong>Customer:</strong> {booking.customer_name}</p>
                        <p><strong>Address:</strong> {booking.address}</p>
                    <p><strong>Contact:</strong> {booking.contact_number}</p>
                    <p><strong>Special Instructions:</strong> {booking.special_instructions || 'None'}</p>
                        </>
                        
                    ) : (
                        <p><strong>Chef:</strong> <Link className="text-brown" to={`/chef-dishes/${booking.chef}`}>{booking.chef_name}</Link></p>
                    )}

                    {/* Action buttons for chef */}
                    {forChef && booking.status === 'pending' && timeLeft > 0 && (
                        <div className="mb-2">
                            <p className="text-muted mb-1">⏳ Time Left: {formatTime(timeLeft)}</p>
                            <ProgressBar now={percentageLeft} variant={progressBarVariant} />
                        </div>
                    )}

                    {forChef ? (
                        <>
                            {booking.status === 'pending' && timeLeft > 0 && (
                                <div className="d-flex gap-2 mt-2">
                                    <Button variant="success" size="sm" onClick={() => handleStatusUpdate('confirmed')}>
                                        Confirm
                                    </Button>
                                    <Button variant="danger" size="sm" onClick={() => handleStatusUpdate('rejected')}>
                                        Reject
                                    </Button>
                                </div>
                            )}
                            {booking.status === 'confirmed' && isCancellationAllowed() && (
                                <Button variant="danger" size="sm" onClick={() => handleStatusUpdate('cancelled')}>
                                    Cancel Booking
                                </Button>
                            )}
                            {booking.status === 'completed' && !booking.is_paid && (
                                <Button variant="primary" size="sm" onClick={() => handlePaymentStatusUpdate()}>
                                    Mark as Paid
                                </Button>
                            )}
                        </>
                    ) : (
                        booking.status === 'confirmed' && isCancellationAllowed() && (
                            <Button variant="danger" size="sm" onClick={() => handleStatusUpdate('cancelled')}>
                                Cancel Booking
                            </Button>
                        )
                    )}
                    {error && (
              <Alert variant="danger" className="d-flex align-items-center my-2">
                {error}
              </Alert>
            )}

                </Offcanvas.Body>
            </Offcanvas>
        </>
    );
};

export default BookingCard;
