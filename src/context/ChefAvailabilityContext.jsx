import { createContext, useState, useEffect, useContext } from "react";
import axios from "../api/axiosConfig";
import { AuthContext } from "./AuthContext";

export const ChefAvailabilityContext = createContext();

export const ChefAvailabilityProvider = ({ children }) => {
  const {user} = useContext(AuthContext)

  const [availability, setAvailability] = useState({
    is_available: true,
    breakfast_available: true,
    lunch_available: true,
    dinner_available: true,
    urgent_booking_available: true,
    pre_booking_available: true,
  });

  const [error, setError] = useState(null);

  const handleToggleChange = async (field) => {
    const newValue = !availability[field];
    let updatedState = { [field]: newValue };
    
    try {
      const response = await axios.patch("/chef-availability/", updatedState);
      setAvailability(response.data);
      if (response.data.error_message) {
        setError(response.data.error_message);
      } else {
        setError(null);
      }
    } catch (err) {
      setError(err.response?.data || "Something went wrong");
    }
  };
  
  useEffect(() => {
    if (user && user.role === "chef") {
      const fetchAvailability = async () => {
        try {
          const response = await axios.get("/chef-availability/");
          setAvailability(response.data);
        } catch (err) {
          setError(err.response?.data || "Failed to fetch chef availability");
        }
      };
      fetchAvailability();
    }
  }, [user]);
  

  return (
    <ChefAvailabilityContext.Provider
      value={{ availability, handleToggleChange, error, setError }}
    >
      {children}
    </ChefAvailabilityContext.Provider>
  );
};

export const useChefAvailability = () => {
  return useContext(ChefAvailabilityContext);
};
