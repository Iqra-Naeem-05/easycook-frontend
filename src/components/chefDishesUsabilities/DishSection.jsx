import { useContext } from 'react';
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { FaEdit, FaTrash, FaCheck, FaTimes, FaUtensils } from 'react-icons/fa';
import BookingTypeButtons from "./BookingTypeButtons";
import { useChefAvailability } from '../../context/ChefAvailabilityContext';
import axios from "../../api/axiosConfig";

const DishSection = ({
    chef,
    mealType,
    dishes,
    setDishes,
    selectedDishes,
    setSelectedDishes,
    bookingOptions,
    setBookingOptions,
    pagination,
    loadMoreDishes
}) => {    
    const { user } = useContext(AuthContext);

    const isChefViewingOwnDishes = user?.id === chef?.id;
    const navigate = useNavigate();

    const { availability: chefAvailability } = useChefAvailability();
    const availability = isChefViewingOwnDishes ? chefAvailability : chef?.chefprofile;

    const selectedDish = selectedDishes[mealType];
    const mealDishes = dishes[mealType] || [];
    const firstDish = mealDishes[0];

    const slotAvailable = firstDish
        ? firstDish.available_time === "breakfast" ? availability?.breakfast_available
        : firstDish.available_time === "lunch" ? availability?.lunch_available
        : availability?.dinner_available
        : false;

    const isFaded = !availability?.is_available || !slotAvailable;

    const handleSelectDish = (dish) => {
        const currentBookingType = bookingOptions[dish.id]?.type;
        const currentBookingDate = bookingOptions[dish.id]?.date;

        if (!currentBookingType) {
            alert("Please select booking type (Urgent or Pre-booking) first.");
            return;
        }

        if (currentBookingType === "prebooking" && !currentBookingDate) {
            alert("Please select a date for pre-booking.");
            return;
        }

        const selectedBookingTypes = Object.values(selectedDishes)
            .filter(d => d !== null)
            .map(d => bookingOptions[d.id]?.type);

        const isTypeMismatch = selectedBookingTypes.length > 0 &&
            selectedBookingTypes.some((type) => type !== currentBookingType);

        if (isTypeMismatch) {
            alert("Please select dishes with the same booking type. Mixing urgent and pre-booking is not allowed.");
            return;
        }

        setSelectedDishes((prev) => ({
            ...prev,
            [mealType]: {
                ...dish,
                bookingType: currentBookingType,
                date: currentBookingDate,
            }
        }));
    };

    const handleRemoveDish = () => {
        setSelectedDishes(prev => ({ ...prev, [mealType]: null }));
    };

    const handleDelete = async (dishId) => {
        if (!window.confirm("Are you sure you want to delete this dish?")) return;

        try {
            await axios.delete(`/delete-dish/${dishId}/`);
            setDishes(prev => ({
                ...prev,
                [mealType]: prev[mealType].filter(d => d.id !== dishId),
            }));
        } catch (err) {
            console.log(err);
            alert("Failed to delete dish.");
        }
    };

    const handleLoadMore = () => {
        if (pagination[mealType]?.next) {
            loadMoreDishes(mealType);
        }
    };

    return (
        <div>
            {mealDishes.length === 0 ? (
                <div className="alert alert-light text-center py-4 my-4 border rounded" role="alert">
                    <FaUtensils className="me-2" />
                    No dishes available for {mealType.charAt(0).toUpperCase() + mealType.slice(1)}
                </div>
            ) : (
                <div className="row g-4">
                    {mealDishes.map(dish => {
                        const isSelected = selectedDish?.id === dish.id;
                        const isDisabled = selectedDish && selectedDish.id !== dish.id;
                        const booking = bookingOptions[dish.id] || { type: "", date: "" };

                        return (
                            <div key={dish.id} className="col-sm-6 col-md-4 col-lg-3">
                                <div className={`card h-100 border-0 shadow-sm overflow-hidden transition-all ${isFaded ? 'opacity-75' : ''} ${isSelected ? 'border-primary border-2 ' : ''}`}>
                                    <div className="position-relative" style={{ height: "200px", overflow: "hidden" }}>
                                        <img
                                            src={dish.picture || ''}
                                            alt={dish.name}
                                            className="img-fluid w-100 h-100 object-fit-cover"
                                        />
                                        {isSelected && (
                                            <div className="position-absolute top-0 end-0 bg-navyBlue text-white p-1 px-2 small rounded-bl fw-bold">
                                                Selected
                                            </div>
                                        )}
                                    </div>

                                    <div className="card-body d-flex flex-column">
                                        <div className="mb-3">
                                            <h5 className="card-title text-dark mb-2">{dish.name}</h5>
                                            <p className="card-text text-muted small mb-3">{dish.description}</p>

                                            <div className="d-flex justify-content-between small mb-2">
                                                <span className="text-muted">Serving:</span>
                                                <span className="fw-medium">{dish.serving_number} people</span>
                                            </div>
                                            <div className="d-flex justify-content-between small">
                                                <span className="text-muted">Price:</span>
                                                <span className="fw-bold text-dark">Rs. {dish.price}</span>
                                            </div>
                                        </div>

                                        <BookingTypeButtons
                                            chef={chef}
                                            dish={dish}
                                            booking={booking}
                                            isDisabled={isDisabled}
                                            setBookingOptions={setBookingOptions}
                                            className="mb-3"
                                        />

                                        <div className="mt-auto pt-2">
                                            {user?.id === chef?.id ? (
                                                <div className="d-flex gap-2">
                                                    <button
                                                        onClick={() => navigate(`/edit-dish/${dish.id}`)}
                                                        className="btn btn-outline-primary btn-sm flex-grow-1 d-flex align-items-center justify-content-center gap-1"
                                                    >
                                                        <FaEdit size={12} /> Edit
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(dish.id)}
                                                        className="btn btn-outline-danger btn-sm flex-grow-1 d-flex align-items-center justify-content-center gap-1"
                                                    >
                                                        <FaTrash size={12} /> Delete
                                                    </button>
                                                </div>
                                            ) : (
                                                isSelected ? (
                                                    <button
                                                        onClick={handleRemoveDish}
                                                        className="btn btn-danger btn-sm w-100 d-flex align-items-center justify-content-center gap-1"
                                                    >
                                                        <FaTimes size={12} /> Remove
                                                    </button>
                                                ) : (
                                                    <button
                                                        onClick={() => handleSelectDish(dish)}
                                                        className="btn btn-success btn-sm w-100 d-flex align-items-center justify-content-center gap-1"
                                                        disabled={isDisabled || isFaded || (!chef.chefprofile.urgent_booking_available && !chef.chefprofile.pre_booking_available)}
                                                    >
                                                        <FaCheck size={12} /> Select Dish
                                                    </button>
                                                )
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {pagination[mealType]?.next && (
                <div className="d-flex justify-content-center">
                    <button className="btn btn-outline-navyBlue mt-4" onClick={handleLoadMore}>
                        See More
                    </button>
                </div>
            )}
        </div>
    );
};

export default DishSection;
