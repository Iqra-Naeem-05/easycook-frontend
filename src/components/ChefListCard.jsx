import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, Button, Badge } from "react-bootstrap";
import Rating from "./chefDishesUsabilities/Rating";

const ChefListCard = ({ chef }) => {
  const navigate = useNavigate();

  return (
    <div className="col my-3" >
      <Card className="border-0 rounded-4 h-100 shadow bg-peac ">
        <div className="position-relative">
          <Card.Img
            src={chef.chefprofile.profile_picture || "https://via.placeholder.com/150"}
            alt={chef.username || "Not specified"}
            className="card-img-top rounded-top-4"
            style={{ height: "180px", objectFit: "cover", objectPosition: "top", }}
          />
          <Badge
            className="position-absolute top-0 start-50 translate-middle py-2 px-3 rounded-pill bg-navyBlue"
            variant="dark"
            style={{ fontSize: "0.8rem" }}
          >
            {chef.chefprofile.specialties || "Chef"}
          </Badge>
        </div>

        <Card.Body className="text-center bg-peach text-navyBlue rounded-bottom-4">
          <Card.Title className="fw-bold">{chef.username || "Not specified"}</Card.Title>
          <Card.Text className="text-muted my-1">{chef.chefprofile?.location || "Not specified"}
          </Card.Text>
          <Card.Text className="small my-1">
            <strong>Experience:</strong>{" "}
            {chef.chefprofile?.experience ? `${chef.chefprofile.experience} years` : "Not specified"}
          </Card.Text>
          <Rating chefId={chef.id} averageRating={chef.chefprofile.average_rating} interactive={false} />
          <Button
            variant="primary"
            className=" border-0 rounded-pill px-4 mt-2 bg-navyBlue"
            onClick={() => navigate(`/chef-dishes/${chef.id}`)}
          >
            View Profile
          </Button>
        </Card.Body>
      </Card>
    </div>
  );
};

export default ChefListCard;
