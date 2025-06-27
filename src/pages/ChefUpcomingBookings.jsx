import { useEffect, useState } from 'react';
import axios from "../api/axiosConfig";
import BookingCard from '../components/UserBookings/BookingCard';
import BookingFilterBar from '../components/UserBookings/BookingFilterBar';
import { FaSpinner } from "react-icons/fa";

const ChefUpcomingBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);

  const [filters, setFilters] = useState({ status: '', type: '', slot: '', is_paid: '' });

  const filteredBookings = bookings.filter((booking) => {
    const matchesStatus = filters.status ? booking.status === filters.status : true;
    const matchesType = filters.type ? booking.booking_type === filters.type : true;
    const matchesSlot = filters.slot ? booking.slot_display.toLowerCase() === filters.slot : true;
    let matchesPayment = true;
    
    if (filters.is_paid === "True") {
      matchesPayment = booking.is_paid === true && booking.status === "completed";
    } else if (filters.is_paid === "False") {
      matchesPayment = booking.is_paid === false && (booking.status === "confirmed" || booking.status === "completed");
    }
    return matchesStatus && matchesType && matchesSlot && matchesPayment;
  });

  useEffect(() => {
    const fetchChefBookings = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`/chef-upcoming-bookings/?page=${page}`);
        if (Array.isArray(response.data.results)) {
          setBookings(response.data.results);
          setCount(response.data.count);
        } else {
          console.error('Unexpected bookings response:', response.data);
          setBookings([]);
          setCount(0);
        }
      } catch (error) {
        console.error('Failed to fetch bookings:', error);
        setBookings([]);
        setCount(0);
      } finally {
        setLoading(false);
      }
    };

    fetchChefBookings();
  }, [page]);

  const totalPages = Math.ceil(count / 8);

  const handlePrev = () => {
    if (page > 1) setPage((prev) => prev - 1);
  };

  const handleNext = () => {
    if (page < totalPages) setPage((prev) => prev + 1);
  };

  return (
    <>
      {loading ? (
        <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
          <FaSpinner className="spinner-icon fs-1 text-navyBlue" />
        </div>
      ) : (
        <>
          <div className='mt-4'>
            <BookingFilterBar filters={filters} onFilterChange={setFilters} />
          </div>

          <div className="container row g-3 mx-auto text-brown">
            <h2>Upcoming Bookings</h2>

            {filteredBookings.length === 0 ? (
              <div className="text-center">No bookings match the selected filters.</div>
            ) : (
              filteredBookings.map((booking) => (
                <div className="col-xs-6 col-sm-6 col-md-4 col-lg-3" key={booking.id}>
                  <BookingCard booking={booking} forChef={true} />
                </div>
              ))
            )}
          </div>

          {/* Prev/Next Pagination */}
          {totalPages > 1 && (
            <div className="d-flex justify-content-center mt-4">
              <nav>
                <ul className="pagination ">
                  <li className={`page-item ${page === 1 ? 'disabled' : ''} `}>
                    <button className="page-link  text-navyBlue" onClick={handlePrev}>
                      Previous
                    </button>
                  </li>
                  <li className="page-item disabled">
                    <span className="page-link">
                      Page {page} of {totalPages}
                    </span>
                  </li>
                  <li className={`page-item ${page === totalPages ? 'disabled' : ''}`}>
                    <button className="page-link text-navyBlue" onClick={handleNext}>
                      Next
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
          )}
        </>
      )}
    </>
  );
};

export default ChefUpcomingBookings;
