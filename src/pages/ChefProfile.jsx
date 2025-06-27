import { useEffect, useState, useContext, useRef } from 'react'
import axios from "../api/axiosConfig"
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";


const ChefProfile = () => {

    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const errorRef = useRef(null);
    const successRef = useRef(null);

    const [profile, setProfile] = useState({
        full_name: "",
        bio: "",
        profile_picture: null,
        experience: "",
        specialties: "",
        location: "",
        contact_number: "",
        age: "",
        gender: ""
    });

    const [error, setError] = useState("");
    const [fieldErrors, setFieldErrors] = useState({});

    const [success, setSuccess] = useState("");
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);


    const fetchProfile = () => {
        axios.get("/chef-profile/")
            .then(response => {
                const data = response.data;
                console.log('data', data)

                setProfile({
                    full_name: data.full_name || "",
                    bio: data.bio || "",
                    profile_picture: data.profile_picture || "",
                    experience: data.experience ?? "",
                    specialties: data.specialties || "",
                    location: data.location || "",
                    contact_number: data.contact_number || "",
                    age: data.age ?? "",
                    gender: data.gender || "",

                });
            })
            .catch((err) => {
                setError("Failed to load profile");
            });
    }
    useEffect(() => {

        fetchProfile();

    }, []);

    const handleChange = (e) => {
        setProfile({ ...profile, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {

        const file = e.target.files[0];
        if (file) {
            setProfile({ ...profile, profile_picture: file })
            setSelectedFile(file); // Save the actual file to submit later
            setPreviewUrl(URL.createObjectURL(file)); // Show preview
        }
    };


    const validateForm = () => {
        let errors = {};

        if (selectedFile) {
            const allowedTypes = ['image/jpeg',
                'image/png',
                'image/gif',
                'image/webp',
                'image/bmp',
                'image/tiff',
                'image/x-icon']; 
            if (!allowedTypes.includes(selectedFile.type)) {
                errors.profile_picture = "Invalid image format.";
            }
        }

        if (profile.full_name && !profile.full_name.trim()) {
            errors.full_name = "If provided, full name cannot be just spaces";
        }

        if (profile.contact_number && !/^03\d{9}$/.test(profile.contact_number)) {
            errors.contact_number = "Enter a valid Pakistani number (e.g. 03XXXXXXXXX)";
        }

        if (profile.bio && profile.bio.trim().length > 0 && profile.bio.trim().length < 5) {
            errors.bio = "Please provide more specific Bio or leave it blank.";
        }

        if (profile.age !== "" && profile.age !== null && profile.age !== undefined) {
            const ageValue = parseInt(profile.age, 10);
            if (isNaN(ageValue) || ageValue < 18 || ageValue > 70) {
                errors.age = "If entered, age must be between 18 and 70";
            }
        }

        if (profile.experience !== "" && profile.experience !== null && profile.experience !== undefined) {
            const exp = parseInt(profile.experience, 10);
            if (isNaN(exp) || exp < 0 || exp > 50) {
                errors.experience = "Experience must be between 0 and 50 years";
            }
        }

        setFieldErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (!validateForm()) return;

        const formData = new FormData();
        formData.append("full_name", profile.full_name);
        formData.append("bio", profile.bio);
        formData.append("experience", profile.experience ? parseInt(profile.experience, 10) : 0);
        formData.append("specialties", profile.specialties);
        formData.append("location", profile.location);
        formData.append("contact_number", profile.contact_number);
        formData.append("age", profile.age ? parseInt(profile.age, 10) : 0);
        formData.append("gender", profile.gender);


        if (selectedFile) {
            formData.append("profile_picture", selectedFile);
        }

        axios.put("/chef-profile/", formData, {})

            .then((response) => {
                setSuccess("Profile updated successfully!");
                setTimeout(() => {
                    navigate(`/chef-dishes/${user.id}`);
                }, 1000);
                setProfile(response.data);
            })
            .catch((err) => {
                console.error("Update Error:", err.response?.data);
                setError(err.response?.data || "Failed to update profile");
            });

        const errors = validateForm();
        if (Object.keys(errors).length > 0) {
            setError(errors);
            return;
        }
    };

    useEffect(() => {
        if (success) {
            successRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [success]);

    useEffect(() => {
        if (error) {
            errorRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [error]);


    const handleRemoveImage = async () => {
        const response = window.confirm("Are you sure you want to remove the profile picture?")
        try {

            if (response) {
                await axios.delete("/delete-profile-picture/");
                fetchProfile();
                setPreviewUrl(null);
                setSelectedFile(null);
                setSuccess("Profile picture removed successfully.");
            }
        } catch (err) {
            setError("Failed to remove profile picture.");
        }
    };

    return (
        <div className="container d-flex justify-content-center my-4">
            <div className="card shadow-sm p-4 border-0" style={{ maxWidth: '500px', width: '100%' }}>

                {/* Profile Picture on Top */}
                <div className="text-center mb-4">

                    {(previewUrl || profile.profile_picture) ? (
                        <div className='d-flex flex-column justify-content-center align-items-center'>
                            <img
                                src={previewUrl || profile.profile_picture}
                                alt="Profile"
                                className="rounded-circle shadow"
                                style={{ width: '120px', height: '120px', objectFit: 'cover' }}
                            />

                            {(profile.profile_picture && typeof profile.profile_picture === 'string' && !profile.profile_picture.includes("default_profile.png")) && (
                                <button
                                    className="btn btn-sm btn-outline-danger mt-2 w-50"
                                    type="button"
                                    onClick={handleRemoveImage}
                                >
                                    Remove Picture
                                </button>
                            )}
                        </div>
                    ) : (
                        <div
                            className="rounded-circle bg-secondary d-inline-block"
                            style={{ width: '120px', height: '120px' }}
                        ></div>
                    )}


                </div>

                {success && <div ref={successRef} className="alert alert-success my-3">{success}</div>}
                {error && <div ref={errorRef} className="alert alert-danger">{error}</div>}


                <h4 className="text-center text-navyBlue fw-bold mb-4">Chef Profile</h4>

                <form onSubmit={handleSubmit}>

                    {/* Profile Picture Upload */}
                    <div className="mb-4">
                        <label className="form-label">Update Profile Picture</label>
                        <input
                            type="file"
                            name="profile_picture"
                            onChange={handleFileChange}
                            className="form-control"
                        />
                        {fieldErrors.profile_picture && (
                            <div className="text-danger">{fieldErrors.profile_picture}</div>
                        )}
                    </div>

                    {/* Full Name */}
                    <div className="mb-3">
                        <label className="form-label">Full Name</label>
                        <input
                            type="text"
                            name="full_name"
                            value={profile.full_name}
                            onChange={handleChange}
                            className="form-control"
                        />
                        {fieldErrors.full_name && (
                            <div className="text-danger">{fieldErrors.full_name}</div>
                        )}
                    </div>

                    {/* Specialties */}
                    <div className="mb-3">
                        <label className="form-label">Specialties</label>
                        <input
                            type="text"
                            name="specialties"
                            value={profile.specialties}
                            onChange={handleChange}
                            className="form-control"
                            placeholder="e.g., Italian, BBQ"
                        />

                    </div>

                    {/* Experience */}
                    <div className="mb-3">
                        <label className="form-label">Experience (years)</label>
                        <input
                            type="number"
                            name="experience"
                            value={profile.experience}
                            onChange={handleChange}
                            min="0"
                            className="form-control"
                        />
                        {fieldErrors.experience && (
                            <div className="text-danger">{fieldErrors.experience}</div>
                        )}
                    </div>

                    {/* gender */}
                    <div className="mb-3">
                        <label className="form-label">Gender</label>
                        <select
                            name="gender"
                            value={profile.gender}
                            onChange={handleChange}
                            className="form-control"
                        // required
                        >
                            <option value="">Select</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                        </select>
                        {fieldErrors.gender && (
                            <div className="text-danger">{fieldErrors.gender}</div>
                        )}
                    </div>

                    {/* age */}
                    <div className="mb-3">
                        <label className="form-label">age</label>
                        <input
                            type="number"
                            name="age"
                            value={profile.age}
                            onChange={handleChange}
                            // min="0"
                            className="form-control"
                        />
                        {fieldErrors.age && (
                            <div className="text-danger">{fieldErrors.age}</div>
                        )}
                    </div>

                    {/* contact_number */}
                    <div className="mb-3">
                        <label className="form-label">Contact Number</label>
                        <input
                            type="number"
                            name="contact_number"
                            value={profile.contact_number || ""}
                            onChange={handleChange}
                            className="form-control"
                            placeholder="03xxxxxxxx"
                            maxLength="11"
                        />
                        {fieldErrors.contact_number && (
                            <div className="text-danger">{fieldErrors.contact_number}</div>
                        )}
                    </div>

                    {/* Location */}
                    <div className="mb-3">
                        <label className="form-label">Location</label>
                        <input
                            type="text"
                            name="location"
                            value={profile.location}
                            onChange={handleChange}
                            className="form-control"
                            placeholder="e.g., Lahore, Bahawalpure ...."
                        />
                    </div>

                    {/* Bio */}
                    <div className="mb-3">
                        <label className="form-label">Bio</label>
                        <textarea
                            name="bio"
                            value={profile.bio}
                            onChange={handleChange}
                            className="form-control"
                            rows="3"
                        />
                        {fieldErrors.bio && (
                            <div className="text-danger">{fieldErrors.bio}</div>
                        )}
                    </div>


                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="btn btn-navyBlue w-100 fw-semibold py-2"
                    >
                        Update Profile
                    </button>
                </form>
            </div>
        </div>
    );

};

export default ChefProfile
