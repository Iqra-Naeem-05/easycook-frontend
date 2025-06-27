import React from 'react';

const BookingFilterBar = ({ filters, onFilterChange }) => {
    const handleChange = (e) => {
        const { name, value } = e.target;
        onFilterChange({ ...filters, [name]: value }); 
    };

    return (
        <div className="container">
            <div className="row mb-4 d-flex justify-content-end g-2">
            <div className="col-md-2 col-sm-3">
                <select className="form-select form-select-sm bg-peach border border-brown rounded-top" name="status" value={filters.status} onChange={handleChange}>
                    <option value="">Statuses</option>
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="rejected">Rejected</option>
                    <option value="completed">Completed</option>
                    <option value="expired">Expired</option>
                </select>
            </div>
            <div className="col-md-2 col-sm-3">
                <select className="form-select form-select-sm bg-peach border border-brown rounded-top" name="type" value={filters.type} onChange={handleChange}>
                    <option value="">Booking Types</option>
                    <option value="urgent">Urgent</option>
                    <option value="prebooking">Pre-booking</option>
                </select>
            </div>
            <div className="col-md-2 col-sm-3">
                <select className="form-select form-select-sm bg-peach border border-brown rounded-top" name="slot" value={filters.slot} onChange={handleChange}>
                    <option value="">Slots</option>
                    <option value="breakfast">Breakfast</option>
                    <option value="lunch">Lunch</option>
                    <option value="dinner">Dinner</option>
                </select>
            </div>
            <div className="col-md-2 col-sm-3">
                <select
                    className="form-select form-select-sm bg-peach border border-brown rounded-top" name="is_paid" value={filters.is_paid}onChange={handleChange}
                >
                    <option value="">Payment</option>
                    <option value="True">Paid</option>
                    <option value="False">Payment Awaited</option>
                </select>

            </div>
        </div>
        </div>
    );
};

export default BookingFilterBar;
