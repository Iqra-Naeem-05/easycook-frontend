import React from "react";
import { Form, Modal } from "react-bootstrap";
import { useChefAvailability } from "../context/ChefAvailabilityContext";

const ChefAvailabilityToggle = ({ field, label, showErrorModal = false }) => {
  const { availability, handleToggleChange, error, setError } = useChefAvailability();

  const handleClose = () => setError(null);

  return (
    <>
      <Form.Check
        type="switch"
        id={`${field}-toggle`}
        label={label}
        className="custom-switch-color text-brown"
        checked={availability[field]}
        onChange={() => handleToggleChange(field)}
      />

      {showErrorModal && error && Object.keys(error).length > 0 && (
        <Modal show={true} onHide={handleClose} centered>
          <Modal.Header closeButton>
            <Modal.Title>Error</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {Object.entries(error).map(([field, message]) => (
              <div key={field}>
                <p className="text-danger">{message}</p>
              </div>
            ))}
          </Modal.Body>
        </Modal>
      )}
    </>
  );
};

export default ChefAvailabilityToggle;
