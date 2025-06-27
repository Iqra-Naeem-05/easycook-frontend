import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../api/axiosConfig";
import { AuthContext } from "../context/AuthContext";
import ChefProfileDisplay from "../components/chefDishesUsabilities/ChefProfileDisplay";
import BookingSummary from "../components/chefDishesUsabilities/BookingSummary";
import PreBookingToggle from "../components/ChefAvailabilityToggles/PreBookingToggle";
import UrgentBookingToggle from "../components/ChefAvailabilityToggles/UrgentBookingToggle";
import LunchToggle from "../components/ChefAvailabilityToggles/LunchToggle";
import BreakfastToggle from "../components/ChefAvailabilityToggles/BreakfastToggle";
import DinnerToggle from "../components/ChefAvailabilityToggles/DinnerToggle";
import ChefAvailableToggle from "../components/ChefAvailabilityToggles/ChefAvailableToggle";

import BookingTypeButtons from "../components/chefDishesUsabilities/BookingTypeButtons";
import DishSection from "../components/chefDishesUsabilities/DishUpdateButton";

const ChefDishes = () => {
    

    const { chefId } = useParams();
    const [chef, setChef] = useState(null);
    const [dishes, setDishes] = useState({ breakfast: [], lunch: [], dinner: [] });
    const [selectedSlot, setSelectedSlot] = useState({ breakfast: null, lunch: null, dinner: null });
    const [error, setError] = useState({});
    const { user } = useContext(AuthContext);
    const [selectedDishes, setSelectedDishes] = useState({ breakfast: null, lunch: null, dinner: null });
    const [bookingOptions, setBookingOptions] = useState({});


    useEffect(() => {
        const fetchChefAndDishes = async () => {
            try {
                const response = await axios.get(`/chef-dishes/${chefId}/`);
                console.log("what i get", response.data);
                setChef(response.data.chef);
                setDishes(response.data.dishes);

                setSelectedSlot({
                    breakfast: true,
                    lunch: false,
                    dinner: false
                });
            } catch (err) {
                console.log(err)
                setError({ generalError: err.response?.data?.detail || "Failed to fetch chef details and dishes." });
                console.log('err.generalError', err.generalError)
            }
        };
        fetchChefAndDishes();
    }, [chefId]);

    // const handleDelete = async (dishId) => {
    //     if (!window.confirm("Are you sure you want to delete this dish?")) return;
    //     try {
    //         await axios.delete(`/delete-dish/${dishId}/`);
    //         const updatedDishes = {
    //             breakfast: dishes.breakfast.filter((dish) => dish.id !== dishId),
    //             lunch: dishes.lunch.filter((dish) => dish.id !== dishId),
    //             dinner: dishes.dinner.filter((dish) => dish.id !== dishId),
    //         };
    //         setDishes(updatedDishes);
    //     } catch (err) {
    //         alert("Failed to delete dish.");
    //     }
    // };

    const handleSlotChange = (slot) => {
        setSelectedSlot({
            breakfast: slot === "breakfast",
            lunch: slot === "lunch",
            dinner: slot === "dinner",
        });
    };

    // const handleSelectDish = (dish, mealType) => {
    //     const currentBookingType = bookingOptions[dish.id]?.type;
    //     const currentBookingDate = bookingOptions[dish.id]?.date;

    //     if (!currentBookingType) {
    //         alert("Please select booking type (Urgent or Pre-booking) first.");
    //         return;
    //     }

    //     if (currentBookingType === "prebooking" && !currentBookingDate) {
    //         alert("Please select a date for pre-booking.");
    //         return;
    //     }

    //     // Get existing selected booking types
    //     const selectedBookingTypes = Object.values(selectedDishes)
    //         .filter(item => item !== null && item !== undefined)
    //         .map(item => bookingOptions[item.id]?.type);

    //     const isTypeMismatch = selectedBookingTypes.length > 0 &&
    //         selectedBookingTypes.some((type) => type !== currentBookingType);

    //     if (isTypeMismatch) {
    //         alert("Please select dishes with the same booking type. Mixing urgent and pre-booking is not allowed.");
    //         return;
    //     }

    //     setSelectedDishes((prev) => ({
    //         ...prev,
    //         [mealType]: {
    //             ...dish,
    //             bookingType: currentBookingType,
    //             date: currentBookingDate,
    //         }
    //     }));
    // };


    // const handleRemoveDish = (slot) => {
    //     setSelectedDishes((prev) => ({
    //         ...prev,
    //         [slot]: null
    //     }));
    // };

    {
        error.generalError && (
            <div className="alert alert-danger" role="alert">
                {error.generalError}
            </div>
        )
    }


    if (!chef) {
        return <p>Loading chef details...</p>;
    }


    // const renderDishes = (mealType) => {
    //     const mealDishes = dishes[mealType] || [];
    //     const selectedDish = selectedDishes[mealType];

    //     if (mealDishes.length === 0) {
    //         return (
    //             <div className="alert text-center" role="alert">
    //                 No dishes available for {mealType}.
    //             </div>
    //         );
    //     }

    //     return (

    //         <div className="row">
    //             {mealDishes.map((dish) => {
    //                 const isSelected = selectedDish?.id === dish.id;
    //                 const isDisabled = selectedDish && selectedDish.id !== dish.id; // Disable based on time too
    //                 // const booking = bookingOptions[dish.id] || {};
    //                 const booking = bookingOptions[dish.id] || { type: "", date: "" };

    //                 console.log('bokingpagee', booking)
    //                 return (
    //                     <div key={dish.id} className={`col-sm-6 col-md-4 col-lg-3 mb-4 ${isDisabled ? "opacity-50" : ""}`}>

    //                         <div className="card shadow border-0 d-flex flex-column h-100">
    //                             <img
    //                                 src={dish.picture}
    //                                 alt={dish.name}
    //                                 className="card-img-top"
    //                                 style={{ height: "230px", objectFit: "cover" }}
    //                             />
    //                             <div className="card-body d-flex flex-column">
    //                                 <h5 className="card-title">{dish.name}</h5>
    //                                 <p className="card-text">{dish.description}</p>
    //                                 <p><strong>Serving:</strong> {dish.serving_number}</p>
    //                                 <p><strong>Price:</strong> Rs: {dish.price}</p>

    //                                 <BookingTypeButtons dish={dish} booking={booking} isDisabled={isDisabled} setBookingOptions={setBookingOptions} />
    //                                 {/* <DishUpdateButton chef={chef} isSelected={isSelected} isDisabled={isDisabled} dish={dish} mealType={mealType} bookingOptions={bookingOptions} selectedDishes={selectedDishes} setSelectedDishes={setSelectedDishes} dishes={dishes} setDishes={setDishes} /> */}
    //                                 {/* Select / Remove Buttons */}
    //                                 {user?.id === chef?.id ? (
    //                                     <div className="mt-auto">
    //                                         <button onClick={() => navigate(`/edit-dish/${dish.id}`)} className="btn btn-primary me-2 btn-sm rounded-pill">
    //                                             Edit
    //                                         </button>
    //                                         <button onClick={() => handleDelete(dish.id)} className="btn btn-danger btn-sm rounded-pill">
    //                                             Delete
    //                                         </button>
    //                                     </div>
    //                                 ) : (
    //                                     <div className="mt-auto">
    //                                         {isSelected ? (
    //                                             <button onClick={() => handleRemoveDish(mealType)} className="btn btn-danger btn-sm rounded-pill">
    //                                                 Remove
    //                                             </button>
    //                                         ) : (
    //                                             <button onClick={() => handleSelectDish(dish, mealType)} className="btn btn-success btn-sm rounded-pill" disabled={isDisabled}>
    //                                                 Select Dish
    //                                             </button>
    //                                         )}
    //                                     </div>
    //                                 )}
    //                             </div>
    //                         </div>
    //                     </div>
    //                 );
    //             })}
    //         </div>
    //     );
    // };
    // <DishUpdateButton chef={chef} isSelected={isSelected} isDisabled={isDisabled} dish={dish} mealType={mealType} bookingOptions={bookingOptions} selectedDishes={selectedDishes} setSelectedDishes={setSelectedDishes} dishes={dishes} setDishes={setDishes} />


    return (
        <div className="container pb-5">
            {error.generalError && (
                <div className="alert alert-danger">
                    {error.generalError}
                </div>
            )}

            {chef && <ChefProfileDisplay chef={chef} user={user} />}
            {user?.id === chef.id ? (
                <>
                    {/* <ChefAvailability/> */}
                    <PreBookingToggle />
                    <UrgentBookingToggle />
                    <LunchToggle />
                    <BreakfastToggle />
                    <DinnerToggle />
                    <ChefAvailableToggle />

                </>
            ) : null}

            {/* Slot Selection */}
            <div className="mt-2 text-cente">
                <div className="btn-group btn-group-sm" role="group" aria-label="Meal Slot Selection">
                    <button onClick={() => handleSlotChange("breakfast")} className={`btn ${selectedSlot.breakfast ? "btn-navyBlue" : "btn-outline-navyBlue"}`} >
                        Breakfast
                    </button>
                    <button onClick={() => handleSlotChange("lunch")} className={`btn ${selectedSlot.lunch ? "btn-navyBlue" : "btn-outline-navyBlue"}`} >
                        Lunch
                    </button>
                    <button onClick={() => handleSlotChange("dinner")} className={`btn ${selectedSlot.dinner ? "btn-navyBlue" : "btn-outline-navyBlue"}`} >
                        Dinner
                    </button>
                </div>

                {Object.keys(selectedSlot).map((slot) => (
                    selectedSlot[slot] && (
                        <div key={slot}>
                            <h2 className="mt-4 text-maron">{slot.charAt(0).toUpperCase() + slot.slice(1)}</h2>
                            {/* {renderDishes(slot)} */}
                            <DishSection
                        chef={chef}
                        mealType={slot}
                        dishes={dishes}
                        setDishes={setDishes}
                        selectedDishes={selectedDishes}
                        setSelectedDishes={setSelectedDishes}
                        bookingOptions={bookingOptions}
                        setBookingOptions={setBookingOptions}
                    />
                        </div>
                    )
                ))}

            </div>

            {user?.id === chef.id ?
                null :
                <BookingSummary selectedDishes={selectedDishes} chef={chef} bookingOptions={bookingOptions} />

            }

        </div>
    );
};

export default ChefDishes;

