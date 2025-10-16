import axios from "axios";

// Function to get CSRF token from cookies
const getCookie = (name) => {
    const cookieValue = document.cookie
        .split('; ')
        .find(row => row.startsWith(name + '='))
        ?.split('=')[1];
    return cookieValue;
};

// Axios default settings
// axios.defaults.baseURL = "http://127.0.0.1:8000/api"; 
axios.defaults.baseURL = "https://cf7b4e9f-1937-4147-a057-80f8f8327ae7-00-int2ogr1e2nw.kirk.replit.dev/api"; 
// axios.defaults.baseURL = `${import.meta.env.VITE_API_URL}/api`;
axios.defaults.withCredentials = true; 


// Attach CSRF token to all requests
axios.interceptors.request.use(config => {
    const csrfToken = getCookie("csrftoken");  // Get CSRF from cookie
    if (csrfToken) {
        config.headers["X-CSRFToken"] = csrfToken;
    }
    return config;
}, error => {
    return Promise.reject(error);
});


export default axios;
