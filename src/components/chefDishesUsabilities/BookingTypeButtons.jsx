import React, { useContext } from 'react';
import { Form, Card, Badge } from 'react-bootstrap';
import { FaClock, FaCalendarAlt, FaExclamationTriangle } from 'react-icons/fa';
import { AuthContext } from "../../context/AuthContext";

const BookingTypeButtons = ({ chef, dish, booking, isDisabled, setBookingOptions }) => {
    const { user } = useContext(AuthContext);

    const handleBookingOptionChange = (dishId, type) => {
        setBookingOptions((prev) => ({
            ...prev,
            [dishId]: { type, date: "" }
        }));
    };

    const isurgentBookingAvailable = (slotTimeStr) => {
        const currentTime = new Date();
        const today = new Date();
        const [hours, minutes, seconds] = slotTimeStr?.split(":").map(Number) || [0, 0, 0];

        const slotStartTime = new Date(today);
        slotStartTime.setHours(hours, minutes, seconds || 0, 0);

        const bookingStartTime = new Date(today);
        bookingStartTime.setHours(5, 0, 0, 0);

        const bookingCloseTime = new Date(slotStartTime);
        bookingCloseTime.setHours(slotStartTime.getHours() - 1);

        return currentTime >= bookingStartTime && currentTime < bookingCloseTime;
    };

    const handleDateChange = (dishId, date) => {
        setBookingOptions((prev) => ({
            ...prev,
            [dishId]: { ...prev[dishId], date }
        }));
    };

    const getPreBookingDateRange = () => {
        const currentDate = new Date();
        const tomorrow = new Date(currentDate);
        tomorrow.setDate(currentDate.getDate() + 1);

        const sevenDaysLater = new Date(tomorrow);
        sevenDaysLater.setDate(tomorrow.getDate() + 7);

        return {
            tomorrow: tomorrow.toISOString().split("T")[0],
            sevenDaysLater: sevenDaysLater.toISOString().split("T")[0]
        };
    };

    const { tomorrow, sevenDaysLater } = getPreBookingDateRange();

    // Availability checks
    const isChefAvailable = chef.chefprofile.is_available;
    const isSlotAvailable = chef.chefprofile[`${dish.available_time}_available`];
    const isUrgentAvailable = chef.chefprofile.urgent_booking_available &&
        isurgentBookingAvailable(dish.time_range_start);
    const isPrebookAvailable = chef.chefprofile.pre_booking_available;

    if (user?.id === chef?.id) return null;

    return (
    <div>
        <div className={`booking-option ${!isUrgentAvailable ? 'opacity-75' : ''}`}>
            <Form.Check
                type="radio"
                id={`urgent-${dish.id}`}
                label={
                    <div className="d-flex align-items-center">
                        <span>Urgent Booking</span>
                    </div>
                }
                name={`booking-${dish.id}`}
                checked={booking.type === "urgent"}
                onChange={() => handleBookingOptionChange(dish.id, "urgent")}
                disabled={isDisabled || !isChefAvailable || !isSlotAvailable || !isUrgentAvailable}
                className="mb-2"
            />
            {!isUrgentAvailable && (
                <div className="text-danger small d-flex align-items-center">
                    <FaExclamationTriangle className="me-1" />
                    {(!chef.chefprofile.urgent_booking_available || !isSlotAvailable)
                        ? "Urgent bookings not enabled"
                        : "Not available for current time"}
                </div>
            )}

        </div>

        {/* Pre-Booking Option */}
        <div className={`booking-option ${!isPrebookAvailable ? 'opacity-75' : ''}`}>
            <Form.Check
                type="radio"
                id={`prebook-${dish.id}`}
                label={
                    <div className="d-flex align-items-center">
                        <span>Pre-Booking</span>
                    </div>
                }
                name={`booking-${dish.id}`}
                checked={booking.type === "prebooking"}
                onChange={() => handleBookingOptionChange(dish.id, "prebooking")}
                disabled={isDisabled || !isChefAvailable || !isSlotAvailable || !isPrebookAvailable}
                className="my-2"
            />
            {/* {!isPrebookAvailable && ( */}
            {(!isPrebookAvailable || !isSlotAvailable) && (
                <div className="text-danger small d-flex align-items-center">
                    <FaExclamationTriangle className="me-1" />
                    Pre-booking not enabled
                </div>
            )}
        </div>

        {/* Date Picker */}
        {booking.type === "prebooking" && isPrebookAvailable && (
            <div className="mt-2">
                <div className="d-flex align-items-center mb-2 text-muted small">
                    <FaCalendarAlt className="me-2" />
                    Select preferred date
                </div>
                <Form.Control
                    type="date"
                    value={booking.date}
                    onChange={(e) => handleDateChange(dish.id, e.target.value)}
                    min={tomorrow}
                    max={sevenDaysLater}
                    disabled={isDisabled || !isChefAvailable || !isSlotAvailable}
                    className="border-primary"
                />
                <div className="text-muted small mt-1">
                    Available between {tomorrow} and {sevenDaysLater}
                </div>
            </div>
        )}
    </div>
    );
};

export default BookingTypeButtons;