import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

const AddPurchaseModal = ({
  show,
  handleClose,
  handleSubmit,
  formData,
  handleChange,
  handleFileChange,
}) => {
  const [errors, setErrors] = useState({});
  const [selectedFiles, setSelectedFiles] = useState([]);
  

  const fields = [
    ["rcBookNumber", "RC Book No"],
    ["vehicleNumber", "Vehicle Number"],
    ["model", "Model"],
    ["brand", "Brand"],
    ["purchaseAmount", "Purchase Amount", "number"],
    ["purchaseDate", "Purchase Date", "date"],
    ["aadharCard", "Aadhar Card", "text"],
    ["addressProof", "Address Proof"],
    ["phone", "Phone", "text"],
    ["email", "Email", "email"],
  ];

  const validate = () => {
    const newErrors = {};
    for (let [name] of fields) {
      if (!formData[name]) newErrors[name] = "This field is required";
    }

    if (formData.fineAvailable && !formData.fine) {
      newErrors.fine = "Fine amount is required";
    }

    if (formData.insurance?.hasInsurance && !formData.insurance?.insuranceDetails) {
      newErrors.insuranceDetails = "Insurance validity date is required";
    }

    if (formData.aadharCard && formData.aadharCard.length !== 12) {
      newErrors.aadharCard = "Aadhar must be 12 digits";
    }

    if (formData.phone && formData.phone.length !== 10) {
      newErrors.phone = "Phone number must be 10 digits";
    }

    if (!selectedFiles.length) {
      newErrors.images = "At least 1 image is required";
    } else if (selectedFiles.length > 5) {
      newErrors.images = "Max 5 images allowed";
    } else if (selectedFiles.some((f) => f.size > 2 * 1024 * 1024)) {
      newErrors.images = "Each image must be < 2MB";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
    
      handleSubmit(e);
      setErrors({});
      setSelectedFiles([]);
    }
  };

  const handleNumberInput = (e) => {
    const { name, value } = e.target;
    if (/^\d*$/.test(value)) {
      handleChange(e);
    }
  };

 const onFilesSelected = (e) => {
  const files = Array.from(e.target.files);
  setSelectedFiles(files);
  handleFileChange(files); // ✅ This is critical
};


  return (
    <Modal show={show} onHide={handleClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Add New Purchase</Modal.Title>
      </Modal.Header>
      <Form onSubmit={onSubmit}>
        <Modal.Body>
          <div className="row g-3">
            {fields.map(([name, label, type = "text"]) => (
              <div className="col-md-6" key={name}>
                <Form.Group>
                  <Form.Label>{label}</Form.Label>
                  <Form.Control
                    type={type}
                    name={name}
                    value={formData[name]}
                    onChange={
                      name === "aadharCard" || name === "phone"
                        ? handleNumberInput
                        : handleChange
                    }
                    isInvalid={!!errors[name]}
                    maxLength={name === "aadharCard" ? 12 : name === "phone" ? 10 : undefined}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors[name]}
                  </Form.Control.Feedback>
                </Form.Group>
              </div>
            ))}

            {/* Fine checkbox */}
            <div className="col-md-6">
              <Form.Group>
                <Form.Label>Fine Available</Form.Label>
                <Form.Check
                  type="checkbox"
                  label="Yes"
                  checked={formData.fineAvailable || false}
                  onChange={(e) =>
                    handleChange({
                      target: {
                        name: "fineAvailable",
                        value: e.target.checked,
                      },
                    })
                  }
                />
              </Form.Group>
            </div>

            {/* Fine input (if fineAvailable) */}
            {formData.fineAvailable && (
              <div className="col-md-6">
                <Form.Group>
                  <Form.Label>Fine</Form.Label>
                  <Form.Control
                    type="number"
                    name="fine"
                    value={formData.fine || ""}
                    onChange={handleChange}
                    isInvalid={!!errors.fine}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.fine}
                  </Form.Control.Feedback>
                </Form.Group>
              </div>
            )}

            {/* Insurance checkbox */}
            <div className="col-md-6">
              <Form.Group>
                <Form.Label>Insurance Available</Form.Label>
                <Form.Check
                  type="checkbox"
                  label="Yes"
                  checked={formData.insurance?.hasInsurance || false}
                  onChange={(e) =>
                    handleChange({
                      target: {
                        name: "insurance",
                        value: {
                          ...formData.insurance,
                          hasInsurance: e.target.checked,
                        },
                      },
                    })
                  }
                />
              </Form.Group>
            </div>

            {/* Insurance validity date (if hasInsurance) */}
            {formData.insurance?.hasInsurance && (
              <div className="col-md-6">
                <Form.Group>
                  <Form.Label>Insurance Validity Date</Form.Label>
                  <Form.Control
                    type="date"
                    name="insurance.insuranceDetails"
                    value={formData.insurance.insuranceDetails || ""}
                    onChange={(e) =>
                      handleChange({
                        target: {
                          name: "insurance",
                          value: {
                            ...formData.insurance,
                            insuranceDetails: e.target.value,
                          },
                        },
                      })
                    }
                    isInvalid={!!errors.insuranceDetails}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.insuranceDetails}
                  </Form.Control.Feedback>
                </Form.Group>
              </div>
            )}

            {/* Image upload */}
            <div className="col-md-12">
              <Form.Group>
                <Form.Label>Upload Images (1–5, Max 2MB each)</Form.Label>
                <Form.Control
  name="bikeImages" // ✅ important
  type="file"
  accept="image/*"
  multiple
  onChange={onFilesSelected}
  isInvalid={!!errors.images}
/>

                <Form.Control.Feedback type="invalid">
                  {errors.images}
                </Form.Control.Feedback>
              </Form.Group>
              <small className="text-muted">{selectedFiles.length} file(s) selected.</small>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="success" type="submit">
            Save Purchase
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default React.memo(AddPurchaseModal);
