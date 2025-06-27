import { BrowserRouter as Router } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import AuthProvider from "./context/AuthContext"; // Import AuthProvider
import "./styles/style.css"
// import { ToastContainer } from 'react-toastify';
import { ChefAvailabilityProvider } from './context/ChefAvailabilityContext';

function App() {
  return (
    <div>
      <AuthProvider>
        <ChefAvailabilityProvider>
          <Router>
            <AppRoutes />
          </Router>
        </ChefAvailabilityProvider>
      </AuthProvider>
    </div>
  );
}

export default App;
