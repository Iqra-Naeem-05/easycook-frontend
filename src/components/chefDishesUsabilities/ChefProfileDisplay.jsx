import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import ChefAvailabilityToggle from "../ChefAvailabilityToggle";
import Rating from "./Rating";
import { FaBriefcase, FaMapMarkerAlt, FaPhone, FaVenusMars, FaBirthdayCake, FaThumbsUp } from 'react-icons/fa';


const ChefProfileDisplay = ({ chef, user }) => {
    const navigate = useNavigate();
    const { isLoggedIn } = useContext(AuthContext);

    return (
        <div className="container-fluid p-0 mb-4">
            <div className="card border-0 bg-peach shadow-sm">
                <div className="card-body p-3">
                    <div className="row align-items-start g-3 ">
                        {/* Profile Image Column */}
                        <div className="col-md-3 col-12 text-center">
                            <div>
                                <img
                                    src={chef.chefprofile.profile_picture || 'https://via.placeholder.com/300'}
                                    alt={chef.chefprofile.full_name}
                                    className="img-fluid rounded w-100 "
                                    style={{ maxWidth: '150px', height: 'auto', aspectRatio: '1/1', objectFit: 'cover', objectPosition: 'top' }}
                                />
                            </div>
                            <div className="mt-2 ">
                                {user?.id === chef.id && (
                                    <button
                                        onClick={() => navigate(`/chef-profile`)}
                                        className="btn btn-outline-navyBlue btn-sm rounded-pill px-3 mt-2 mt-md-0"
                                    >
                                        Edit Profile
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Info Column */}
                        <div className="col-md-9 col-12">

                            {/* Info */}
                            <div className="d-flex flex-column flex-md-row justify-content-between align-items-start mb-2">
                                <div className=" d-flex">
                                    <h4 className="mb-1 text-dark fw-semibold fs-1 fs-md-4 text-navyBlue">
                                        {chef.chefprofile.full_name}
                                    </h4>
                                    {/* {chef.chefprofile.average_rating && chef.chefprofile.total_ratings && ( */}
                                        <div className="d-flex align-items-center text-muted small ms-3 mt-2">
                                            <FaThumbsUp size={14} className="me-1 text-secondary" />
                                            <span>
                                                {chef.chefprofile.average_rating.toFixed(1)} • {chef.chefprofile.total_ratings} reviews
                                            </span>
                                        </div>
                                    {/* )} */}
                                </div>

                                {isLoggedIn && user.id !== chef.id && (

                                    <Rating chefId={chef.id} user={user} interactive={true} />
                                )}
                            </div>

                            {/* Details Grid */}
                            <div className="d-flex gap-4 flex-wrap">
                                <div className="d-flex align-items-center mb-1">
                                    <FaBriefcase className="me-2 text-secondary fs-6 text-navyBlue" />
                                    <small className="text-muted">
                                        <span className="fw-bold"></span> {chef.chefprofile.experience ? `${chef.chefprofile.experience} years` : 'Not provided'}
                                    </small>
                                </div>
                                <div className="d-flex align-items-center mb-1">
                                    <FaMapMarkerAlt className="me-2 text-secondary fs-6 text-navyBlue" />
                                    <small className="text-muted">
                                        <span className="fw-bold"></span> {chef.chefprofile.location || 'Not provided'}
                                    </small>
                                </div>
                                <div className="d-flex align-items-center mb-1">
                                    <FaVenusMars className="me-2 text-secondary fs-6 text-navyBlue" />
                                    <small className="text-muted">
                                        <span className="fw-bold"></span> {chef.chefprofile.gender || 'Not provided'}
                                    </small>
                                </div>
                                <div className="d-flex align-items-center mb-1">
                                    <FaBirthdayCake className="me-2 text-secondary fs-6 text-navyBlue" />
                                    <small className="text-muted">
                                        <span className="fw-bold"></span> {chef.chefprofile.age || 'Not provided'}
                                    </small>
                                </div>
                                <div className="d-flex align-items-center mb-1">
                                    <FaPhone className="me-2 text-secondary fs-6 text-navyBlue" />
                                    <small className="text-muted">
                                        <span className="fw-bold"></span> {chef.chefprofile.contact_number || 'Not provided'}
                                    </small>
                                </div>


                            </div>

                            {/* Bio Section */}
                            <div className="mt-3 pt-3 border-top">
                                <p className="small text-muted">
                                    {chef.chefprofile.bio
                                        ? chef.chefprofile.bio.length > 200
                                            ? `${chef.chefprofile.bio.substring(0, 200)}...`
                                            : chef.chefprofile.bio
                                        : "Not specified"}
                                </p>
                            </div>


                            {/* Toggles Section */}
                            {user?.id === chef.id && (
                                <div className="mt-2 pt-3 border-top d-flex gap-4 flex-wrap">
                                    {/* <ChefAvailableToggle /> */}
                                    <ChefAvailabilityToggle field="is_available" label="Chef booking Available" showErrorModal={true} />
                                    <ChefAvailabilityToggle field="urgent_booking_available" label="Urgent Booking Available" />
                                    <ChefAvailabilityToggle field="pre_booking_available" label="Pre Booking Available" />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChefProfileDisplay;