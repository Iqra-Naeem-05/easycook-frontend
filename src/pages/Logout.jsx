import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axiosConfig";
import { AuthContext } from "../context/AuthContext";  

const Logout = () => {
  const { isLoggedIn, logout } = useContext(AuthContext);  
  const navigate = useNavigate();

  useEffect(() => {
    const handleLogout = async () => {
      if (!isLoggedIn) {
        console.warn("User is already logged out. Redirecting...");
        navigate("/"); 
        return;
      }

      try {
        await axios.post("/logout/", {},
          );
        logout(); 
        // console.log("Logout successful");
      } catch (error) {
        console.error("Logout failed:", error.response?.data || error.message);
      }

      navigate("/"); 
    };

    handleLogout();  
  }, []);  

  return null; 
};

export default Logout;
