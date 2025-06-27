import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import axios from "../api/axiosConfig";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Register = () => {

  const { isLoggedIn, checkSession } = useContext(AuthContext);
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);


  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirm_password: "",
    role: "",
  });

  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  if (isLoggedIn === null) {
    return null;
  }

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setError(null);

    try {
      const response = await axios.post(
        "/register/",
        formData,
      );
      setMessage(response.data.message);
      await checkSession();
      console.log("register successful");
      navigate("/");

    } catch (error) {
      if (error.response) {
        console.error("Backend validation error:", error.response.data);
        setError(error.response.data);
      } else {
        setError({ detail: "Something went wrong. Try again!" });
        console.error("Unexpected error:", error);
      }
    }
    if (formData.password !== formData.confirm_password) {
      setError({ confirm_password: ["Passwords do not match."] });
      return;
    }

    if (formData.password.length < 8 || !/\d/.test(formData.password)) {
      setError({
        password: ["Password must be at least 8 characters and contain a number."],
      });
      return;
    }

  };

  const togglePassword = () => setShowPassword((prev) => !prev);
  const toggleConfirmPassword = () => setShowConfirmPassword((prev) => !prev);



  return (
    <div className="container mt-5">
      <div className="card shadow p-4 border-0 bg-peach" style={{ maxWidth: '500px', margin: '0 auto', }}>
        <h2 className="text-center text-navyBlue fw-bold mb-4"> Register </h2>
        {message && <p style={{ color: "green" }}>{message}</p>}
        <form onSubmit={handleSubmit}>

          {/* UserName */}
          <div className="mb-3">
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="form-control form-control-sm bg-peach"
              placeholder="Username"
              required
            />
            {error?.username && <p className="ms-1 text-danger fw-light">{error.username[0]}</p>}
          </div>

          {/* Email */}
          <div className="mb-3">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="form-control form-control-sm bg-peach"
              placeholder="Email"
              required
            />
            {error?.email && <p className="ms-1 text-danger fw-light">{error.email[0]}</p>}
          </div>

          {/* Password */}
          <div className="mb-3 position-relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
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
            {error?.password && <p className="ms-1 text-danger fs-6 fw-light">{error.password[0]}</p>}

          {/* Confirm Password */}
          <div className="mb-3 position-relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirm_password"
              value={formData.confirm_password}
              onChange={handleChange}
              className="form-control form-control-sm bg-peach"
              placeholder="Confirm Password"
              required
            />
            <span
              onClick={toggleConfirmPassword}
              className="position-absolute top-50 end-0 translate-middle-y me-3"
              style={{ cursor: "pointer" }}
            >
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
            {error?.confirm_password && <p className="ms-1 text-danger fw-light">{error.confirm_password[0]}</p>}


          {/* Role */}
          <div className="mb-3">
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="form-select form-select-sm bg-peach"
              required
            >
              <option value="">Select</option>
              <option value="customer">Customer</option>
              <option value="chef">Chef</option>
            </select>
          </div>

          {/* Submit Button */}
          <button type="submit" className="btn btn-navyBlue w-100 fw-semibold py-"> Register </button>
        </form>
        <div className="pt-3">
          <p>Already have an account! <Link className="text-decoration-none ms-1" to="/login/">Login</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Register;
