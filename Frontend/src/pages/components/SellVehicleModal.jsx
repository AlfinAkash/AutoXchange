import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

const SellVehicleModal = ({ show, handleClose, handleSubmit, formData, setFormData }) => {
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNumberInput = (e) => {
    const { name, value } = e.target;
    if (/^\d*$/.test(value)) {
      handleChange(e);
    }
  };

  const validate = () => {
    const newErrors = {};
    const requiredFields = [
      "vehicleNumber",
      "rcBookDetails",
      "buyerName",
      "aadharNumber",
      "phone",
      "addressProof",
      "sellingAmount",
    ];
    requiredFields.forEach((field) => {
      if (!formData[field]) {
        newErrors[field] = "This field is required";
      }
    });
    if (formData.aadharNumber && formData.aadharNumber.length !== 12) {
      newErrors.aadharNumber = "Aadhar must be exactly 12 digits";
    }
    if (formData.phone && formData.phone.length !== 10) {
      newErrors.phone = "Phone number must be exactly 10 digits";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      handleSubmit(e);
      setErrors({});
    }
  };

  return (
    <Modal show={show} onHide={handleClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Sell Vehicle</Modal.Title>
      </Modal.Header>
      <Form onSubmit={onSubmit}>
        <Modal.Body>
          <div className="row g-3">
            <div className="col-md-6">
              <Form.Group>
                <Form.Label>Vehicle Number</Form.Label>
                <Form.Control name="vehicleNumber" value={formData.vehicleNumber} onChange={handleChange} isInvalid={!!errors.vehicleNumber} />
                <Form.Control.Feedback type="invalid">{errors.vehicleNumber}</Form.Control.Feedback>
              </Form.Group>
            </div>
            <div className="col-md-6">
              <Form.Group>
                <Form.Label>RC Book Details</Form.Label>
                <Form.Control name="rcBookDetails" value={formData.rcBookDetails} onChange={handleChange} isInvalid={!!errors.rcBookDetails} />
                <Form.Control.Feedback type="invalid">{errors.rcBookDetails}</Form.Control.Feedback>
              </Form.Group>
            </div>
            <h4>Buyer Details</h4>
            <div className="col-md-6">
              <Form.Group>
                <Form.Label>Buyer Name</Form.Label>
                <Form.Control name="buyerName" value={formData.buyerName} onChange={handleChange} isInvalid={!!errors.buyerName} />
                <Form.Control.Feedback type="invalid">{errors.buyerName}</Form.Control.Feedback>
              </Form.Group>
            </div>
            <div className="col-md-6">
              <Form.Group>
                <Form.Label>Aadhar Number</Form.Label>
                <Form.Control name="aadharNumber" value={formData.aadharNumber} onChange={handleNumberInput} isInvalid={!!errors.aadharNumber} maxLength={12} />
                <Form.Control.Feedback type="invalid">{errors.aadharNumber}</Form.Control.Feedback>
              </Form.Group>
            </div>
            <div className="col-md-6">
              <Form.Group>
                <Form.Label>Phone</Form.Label>
                <Form.Control name="phone" value={formData.phone} onChange={handleNumberInput} isInvalid={!!errors.phone} maxLength={10} />
                <Form.Control.Feedback type="invalid">{errors.phone}</Form.Control.Feedback>
              </Form.Group>
            </div>
            <div className="col-md-12">
              <Form.Group>
                <Form.Label>Address</Form.Label>
                <Form.Control as="textarea" rows={2} name="addressProof" value={formData.addressProof} onChange={handleChange} isInvalid={!!errors.addressProof} />
                <Form.Control.Feedback type="invalid">{errors.addressProof}</Form.Control.Feedback>
              </Form.Group>
            </div>
            <div className="col-md-6">
              <Form.Group>
                <Form.Label>Sale Amount</Form.Label>
                <Form.Control name="sellingAmount" type="number" value={formData.sellingAmount} onChange={handleChange} isInvalid={!!errors.sellingAmount} />
                <Form.Control.Feedback type="invalid">{errors.sellingAmount}</Form.Control.Feedback>
              </Form.Group>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>Close</Button>
          <Button variant="primary" type="submit">Sell Vehicle</Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default React.memo(SellVehicleModal);