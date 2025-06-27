import { createContext, useState, useEffect } from "react";
import axios from "../api/axiosConfig";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [isLoggedIn, setIsLoggedIn] = useState(null);


  const checkSession = async () => {

    try {
      const response = await axios.get("/user-info/");
      if (response.data.isAuthenticated) {
        setUser(response.data);
        setIsLoggedIn(true);
      }
      else {
        setUser(null);
        setIsLoggedIn(false);
      }
    } catch (error) {
      console.error("Error checking session:", error);
      setUser(null);
      setIsLoggedIn(false);
    } finally {
    }
  };

  useEffect(() => {
    checkSession();
  }, []);


  // Login function now stores user data and triggers re-check
  const login = async (userData) => { 
    setUser(userData);
    setIsLoggedIn(true);
  };

  const logout = async () => {
    setUser(null);
    setIsLoggedIn(false);
  };

  useEffect(() => {
    console.log(`User state updated:`, user);
    console.log(`isLoggedIn state updated:`, isLoggedIn);
  }, [user, isLoggedIn]); // Logs only when these values change


  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, logout, checkSession }}>
      {children}
    </AuthContext.Provider>
  ); 
};

export default AuthProvider;
