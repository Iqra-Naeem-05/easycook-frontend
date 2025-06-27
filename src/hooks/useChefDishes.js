import { useState, useEffect } from "react";
import axios from "../api/axiosConfig";

const useChefDishes = (chefId) => {
  const [chef, setChef] = useState(null);
  const [dishes, setDishes] = useState({ breakfast: [], lunch: [], dinner: [] });
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchChef = async () => {
      try {
        const response = await axios.get(`/chef-dishes/${chefId}/`);
        setChef(response.data.chef);
        setDishes(response.data.dishes);
      } catch (err) {
        setError(err.response?.data?.detail || "Failed to load data");
      }
    };
    fetchChef();
  }, [chefId]);

  return { chef, dishes, setDishes, error };
};

export default useChefDishes;
