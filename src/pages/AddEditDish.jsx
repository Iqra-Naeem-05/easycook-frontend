import { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "../api/axiosConfig";
import { AuthContext } from "../context/AuthContext";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCamera } from '@fortawesome/free-solid-svg-icons';

const AddEditDish = () => {
  const { user } = useContext(AuthContext);
  const [errors, setErrors] = useState("");
  const navigate = useNavigate();
  const { dishId } = useParams();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    available_time: "",
    serving_number: "",
    price: "",
    picture: null,
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    if (dishId) {
      axios
        .get(`/get-dish/${dishId}/`)
        .then((response) => {
          const data = response.data;
          setFormData({
            name: data.name || "",
            description: data.description || "",
            available_time: data.available_time || "",
            serving_number: data.serving_number ?? "",
            price: data.price ?? "",
            picture: data.picture || null,
          });
        })
        .catch((err) => {
          setErrors("Failed to load dish");
        });
    }
  }, [dishId]);


  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, picture: file })
      setSelectedFile(file); // Save the actual file to submit later
      setPreviewUrl(URL.createObjectURL(file)); // Show preview
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("name", formData.name);
    data.append("description", formData.description);
    data.append("available_time", formData.available_time);
    data.append("serving_number", formData.serving_number);
    data.append("price", formData.price);

    if (selectedFile) {
      data.append("picture", selectedFile);
    }

    try {
      if (dishId) {
        await axios.put(`/edit-dish/${dishId}/`, data, {});
      } else {
        await axios.post("/add-dishes/", data, {});
      }

      navigate(`/chef-dishes/${user.id}`);
    } catch (err) {
      if (err.response?.status === 400) {
        setErrors(err.response.data);
        console.log(err.response.data)
      } else {
        console.error('Unexpected error:', err);
      }
    }
  };

  return (
    <div className="container my-3">
      <div className="card shadow p-4 border-0" style={{ maxWidth: '500px', margin: '0 auto', }}>
        <h3 className="text-center text-navyBlue fw-bold mb-4">
          {dishId ? "Edit Dish" : "Add New Dish"}
        </h3>
        <form onSubmit={handleSubmit}>
          {/* Dish Name */}
          <div className="mb-3">
            <label className="form-label">Dish Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="form-control form-control-sm  "
              placeholder="Dish Name"
              maxLength={35}
              required
            />
            {errors.name && <small className="text-danger">{errors.name[0]}</small>}
          </div>

          {/* Description */}
          <div className="mb-3">
            <label className="form-label">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="form-control form-control-sm  "
              rows="3"
              maxLength={170}
              placeholder="Brief description of the dish"
              required
            />
            {errors.description && <small className="text-danger">{errors.description[0]}</small>}
          </div>

          {/* Available Time */}
          <div className="mb-3">
            <label className="form-label">Available Time</label>
            <select
              name="available_time"
              value={formData.available_time}
              onChange={handleChange}
              className="form-select form-select-sm  "
              required
            >
              <option value="">Select Time Slot</option>
              <option value="breakfast">Breakfast (8:00am - 10:00am) </option>
              <option value="lunch">Lunch (12:00pm - 2:00pm) </option>
              <option value="dinner">Dinner (6:00pm - 8:00pm) </option>
            </select>
            {errors.available_time && <small className="text-danger">{errors.available_time[0]}</small>}
          </div>

          {/* Serving Number */}
          <div className="mb-3">
            <label className="form-label">No. of Serving</label>
            <input
              type="number"
              name="serving_number"
              value={formData.serving_number}
              onChange={handleChange}
              className="form-control form-control-sm  "
              min="1"
              placeholder="Serving Number"
              required
            />
            {errors.serving_number && <small className="text-danger">{errors.serving_number[0]}</small>}
          </div>

          {/* Price */}
          <div className="mb-3">
            <label className="form-label">Price ($)</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="form-control form-control-sm  "
              min="1"
              placeholder="Price (Rs)"
              required
            />
            {errors.price && <small className="text-danger">{errors.price[0]}</small>}
          </div>

          {/* Dish Picture Upload */}
          <div className="mb-3">
            <label className="form-label">Dish Image</label>
            <input
              type="file"
              name="picture"
              onChange={handleFileChange}
              className="form-control form-control-sm  "
              required={dishId ? false : true}
            />
            {errors.picture && <small className="text-danger">{errors.picture[0]}</small>}
          </div>

          <div className="text-center mb-4">

            {(previewUrl || formData.picture) ? (
              <img
                src={previewUrl || formData.picture}
                alt="Dish"
                className="rounded-circle shadow"
                style={{ width: '120px', height: '120px', objectFit: 'cover' }}
              />
            ) : (
              <div
                className="rounded-circle bg-light d-inline-flex justify-content-center align-items-center"
                style={{ width: '120px', height: '120px' }}
              >
                <FontAwesomeIcon icon={faCamera} style={{ fontSize: '40px', color: '#6c757d' }} />

              </div>
            )}


          </div>

          {/* Submit Button */}
          <button type="submit" className="btn btn-navyBlue w-100 fw-semibold py-2">
            {dishId ? "Update Dish" : "Add Dish"}
          </button>
        </form>
      </div>
    </div>
  );

};

export default AddEditDish;
