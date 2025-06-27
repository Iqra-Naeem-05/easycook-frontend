import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "../api/axiosConfig";
import { AuthContext } from "../context/AuthContext"; 
import { FaEye, FaEyeSlash } from "react-icons/fa";


const Login = () => {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const [showPassword, setShowPassword] = useState(false);

    const navigate = useNavigate();
    const { isLoggedIn, checkSession } = useContext(AuthContext); 

    if (isLoggedIn === null) {
        return null; // Prevent UI flicker by hiding navbar until session check is done
    }

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const response = await axios.post(
                "/login/",
                { username, password },
            );
            
            console.log("Login successful!", response.data);
            await checkSession()
            navigate("/");
        } catch (error) {
            console.error("Login failed:", error);

            if (error.response?.data?.detail) {
                setError(error.response.data.detail);
            } else {
                setError("Invalid credentials!");
            }
        }
    };

    const togglePassword = () => setShowPassword((prev) => !prev)

    return (
        <div className="container mt-6">
            <div className="card shadow p-4 border-0 bg-peach" style={{ maxWidth: '400px', margin: '0 auto', }}>
                <h2 className="text-center text-navyBlue fw-bold mb-4">
                    Login
                </h2>

                <form onSubmit={handleLogin}>
                    {/* UserName */}
                    <div className="mb-3">
                        <input
                            type="text"
                            name="name"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="form-control form-control-sm bg-peach"
                            placeholder="Username"
                            required
                        />
                    </div>

                    {/* Password */}
                    <div className="mb-3 position-relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="form-control form-control-sm bg-peach"
                            placeholder="Password"
                            required
                        />
                        <span
                            onClick={togglePassword}
                            className="position-absolute top-50 end-0 translate-middle-y me-3"
                            style={{ cursor: "pointer" }}
                        >
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </span>
                    </div>
                    {error && <p className="text-danger fw-light">{error}</p>}
                    {/* Submit Button */}
                    <button type="submit" className="btn btn-navyBlue w-100 fw-semibold "> Login </button>
                </form>
                <div className="pt-3">
                    <p>Do not have an account! <Link className="text-decoration-none ms-1" to="/register/">Register</Link></p>
                </div>
            </div>
        </div>
    );
};

export default Login;
