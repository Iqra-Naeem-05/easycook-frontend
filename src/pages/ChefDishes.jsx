import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import axios from "../api/axiosConfig";
import { AuthContext } from "../context/AuthContext";
import ChefProfileDisplay from "../components/chefDishesUsabilities/ChefProfileDisplay";
import ChefAvailabilityToggle from "../components/ChefAvailabilityToggle";
import DishSection from "../components/chefDishesUsabilities/DishSection";
import BookingSummary from "../components/chefDishesUsabilities/BookingSummary";
import { FaUtensils, FaSpinner, FaExclamationTriangle } from "react-icons/fa";

const ChefDishes = () => {
    const { chefId } = useParams();
    const [chef, setChef] = useState(null);
    const [dishes, setDishes] = useState({ breakfast: [], lunch: [], dinner: [] });
    const [pagination, setPagination] = useState({
        breakfast: { next: null, previous: null },
        lunch: { next: null, previous: null },
        dinner: { next: null, previous: null },
    });
    const [selectedSlot, setSelectedSlot] = useState({ breakfast: true, lunch: false, dinner: false });
    const [error, setError] = useState(null);
    const { user } = useContext(AuthContext);
    const [selectedDishes, setSelectedDishes] = useState({ breakfast: null, lunch: null, dinner: null });
    const [bookingOptions, setBookingOptions] = useState({});
    const [isLoading, setIsLoading] = useState(true);

    const getSelectedMealType = () => {
        return Object.keys(selectedSlot).find(key => selectedSlot[key]);
    };
    
    useEffect(() => {
        const fetchChefAndDishes = async () => {
            try {
                setIsLoading(true);
                const selectedMealType = getSelectedMealType();
                const response = await axios.get(`/chef-dishes/${chefId}/${selectedMealType}/`);
                setChef(response.data.chef);
                setDishes(prev => ({
                    ...prev,
                    [selectedMealType]: response.data.dishes
                }));
                setPagination(prev => ({
                    ...prev,
                    [selectedMealType]: response.data.pagination
                }));
                
                setError(null);
            } catch (err) {
                setError(err.response?.data?.detail || "Failed to fetch chef details and dishes.");
            } finally {
                setIsLoading(false);
            }
        };
    
        fetchChefAndDishes();
    }, [chefId, selectedSlot]);
    
    // console.log("dishes", dishes)

    const handleSlotChange = (slot) => {
        setSelectedSlot({
            breakfast: slot === "breakfast",
            lunch: slot === "lunch",
            dinner: slot === "dinner",
        });
    };

    const loadMoreDishes = async (slot) => {
        const nextUrl = pagination[slot]?.next;
        
        if (!nextUrl) return;

        try {
            const response = await axios.get(nextUrl);
            setDishes((prev) => ({
                ...prev,
                [slot]: [...prev[slot], ...response.data.dishes],
            }));
            setPagination((prev) => ({
                ...prev,
                [slot]: {
                    next: response.data.pagination.next,
                    previous: response.data.pagination.previous,
                },
            }));
        } catch (err) {
            console.error("Failed to load more dishes:", err);
        }
    };


    if (error) {
        return (
            <div className="alert alert-danger mt-4">
                <FaExclamationTriangle className="me-2" />
                {error}
            </div>
        );
    }

    if (!chef) {
        return (
            <div className="text-center mt-5">
                <FaUtensils className="fs-1 text-muted mb-3" />
                <p className="fs-4">Chef not found</p>
            </div>
        );
    }

    return (
        <div className="container py-4">

            {chef && <ChefProfileDisplay chef={chef} user={user} />}
    
            {/* Meal Slot Navigation */}
            <div className="mt-4">
                <div className="d-flex flex-wrap gap-2 mb-4">
                    {['breakfast', 'lunch', 'dinner'].map((slot) => (
                        <button
                            key={slot}
                            onClick={() => handleSlotChange(slot)}
                            className={`btn btn-pill ${selectedSlot[slot] ? 'btn-navyBlue' : 'btn-outline-navyBlue'}`}
                        >
                            {slot.charAt(0).toUpperCase() + slot.slice(1)}
                        </button>
                    ))}
                </div>
    
                {isLoading ? (
                    <div className="d-flex justify-content-center align-items-center" style={{ height: '200px' }}>
                        <FaSpinner className="spinner-icon fs-1 text-navyBlue" />
                    </div>
                ) : (
                    Object.entries(selectedSlot).map(([slot, isSelected]) =>
                        isSelected && (
                            <div key={slot} className="mb-5">
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <h2 className="h4 text-dark mb-0 text-navyBlue d-flex flex-wrap align-items-center">
                                        <FaUtensils className="me-2 text-navyBlue" />
                                        {slot.charAt(0).toUpperCase() + slot.slice(1)}
                                        {slot === "breakfast" && (<span className="fs-5 text-secondary">&nbsp; (8:00am - 10:00am)</span> )}
                                        {slot === "lunch" && (<span className="fs-5 text-secondary">&nbsp; (12:00pm - 2:00pm)</span> )}
                                        {slot === "dinner" && (<span className="fs-5 text-secondary">&nbsp; (6:00pm - 8:00pm)</span> )}
                                    </h2>
    
                                    {user?.id === chef?.id && (
                                        <div>
                                            {slot === "breakfast" && <ChefAvailabilityToggle field="breakfast_available" label="Breakfast Available" />}
                                            {slot === "lunch" && <ChefAvailabilityToggle field="lunch_available" label="Lunch Available" />}
                                            {slot === "dinner" && <ChefAvailabilityToggle field="dinner_available" label="Dinner Available" />}
                                        </div>
                                    )}
                                </div>
    
                                <DishSection
                                    chef={chef}
                                    mealType={slot}
                                    dishes={dishes}
                                    setDishes={setDishes}
                                    selectedDishes={selectedDishes}
                                    setSelectedDishes={setSelectedDishes}
                                    bookingOptions={bookingOptions}
                                    setBookingOptions={setBookingOptions}
                                    pagination={pagination}
                                    loadMoreDishes={loadMoreDishes}
                                />
                            </div>
                        )
                    )
                )}
            </div>
    
            {/* Booking Summary */}
            {user?.id !== chef.id && (
                <div className="mt-5 pt-4 border-top">
                    <BookingSummary
                        selectedDishes={selectedDishes}
                        chef={chef}
                        bookingOptions={bookingOptions}
                    />
                </div>
            )}
        </div>
    );
    

};

export default ChefDishes;
