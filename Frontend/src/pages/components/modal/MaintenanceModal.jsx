import React, { useState, useEffect } from "react";
import {
  Modal,
  Button,
  Form,
  Row,
  Col,
  ListGroup,
  Badge,
} from "react-bootstrap";
import axios from "axios";
import Cookies from "js-cookie";
import BASE_URL from "../../../config/Config";

const maintenanceOptions = [
  "Water Wash", "Oil Service", "Change Front Tyre", "Change Back Tyre",
  "Brake Pad", "Seat Cover", "Integrator", "Brake Cable",
  "Clutch Cable", "Chain Sprocket", "Engine Works"
];

const MaintenanceModal = ({ show, onHide, bikeId }) => {
  const [selectedItems, setSelectedItems] = useState([]);
  const [amounts, setAmounts] = useState({});
  const [otherName, setOtherName] = useState("");
  const [otherAmount, setOtherAmount] = useState("");
  const [customList, setCustomList] = useState([]);
  const [errors, setErrors] = useState({});

  const handleCheck = (label) => {
    setSelectedItems((prev) =>
      prev.includes(label)
        ? prev.filter((item) => item !== label)
        : [...prev, label]
    );
  };

  const handleAmountChange = (label, value) => {
    setAmounts((prev) => ({ ...prev, [label]: value }));
    setErrors((prev) => ({ ...prev, [label]: "" })); // Clear error
  };

  const handleAddCustom = () => {
    if (otherName.trim() && otherAmount.trim()) {
      setCustomList((prev) => [
        ...prev,
        {
          name: otherName.trim(),
          amount: parseFloat(otherAmount),
        },
      ]);
      setOtherName("");
      setOtherAmount("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = Cookies.get("token");

    let hasError = false;
    const newErrors = {};

    const standardParts = selectedItems.map((name) => {
      const amount = parseFloat(amounts[name]);
      if (!amount || amount <= 0) {
        newErrors[name] = "Amount required";
        hasError = true;
      }
      return { name, amount };
    });

    if (hasError) {
      setErrors(newErrors);
      return;
    }

    const allParts = [...standardParts, ...customList];

    if (allParts.length === 0) {
      alert("Please add at least one maintenance item.");
      return;
    }

    try {
      const res = await axios.post(
        `${BASE_URL}/maintenance/${bikeId}`,
        { parts: allParts },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      onHide();
    } catch (err) {
      console.error("❌ Error adding maintenance:", err);
      alert(err.response?.data?.message || "Error adding maintenance");
    }
  };

  useEffect(() => {
    if (!show) {
      setSelectedItems([]);
      setAmounts({});
      setOtherName("");
      setOtherAmount("");
      setCustomList([]);
      setErrors({});
    }
  }, [show]);

  const totalAmount =
    selectedItems.reduce(
      (sum, label) => sum + (parseFloat(amounts[label]) || 0),
      0
    ) +
    customList.reduce((sum, item) => sum + item.amount, 0);

  return (
    <Modal show={show} onHide={onHide} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Add Maintenance</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
    <Row>
  {maintenanceOptions.map((label, index) => {
    const isChecked = selectedItems.includes(label);
    return (
      <Col md={6} key={index} className="mb-3">
 <div
  className={`rounded p-3 border ${
    isChecked ? "border-primary bg-light shadow-sm" : "border-secondary"
  }`}
  style={{
    cursor: "default",
    borderWidth: "2px",
    transition: "all 0.3s ease",
  }}
>
  <Form.Check
    type="checkbox"
    id={`check-${index}`}
    label={label}
    checked={isChecked}
    onChange={() => handleCheck(label)}
  />

  {isChecked && (
    <Form.Control
      type="number"
      placeholder="Enter amount"
      className="mt-2"
      value={amounts[label] || ""}
      onChange={(e) => handleAmountChange(label, e.target.value)}
    />
  )}
</div>

      </Col>
    );
  })}
</Row>


          <hr />

          <h5>Add Custom Maintenance</h5>
          <Row className="align-items-end">
            <Col md={5}>
              <Form.Label>Label</Form.Label>
              <Form.Control
                type="text"
                placeholder="e.g. Air Filter"
                value={otherName}
                onChange={(e) => setOtherName(e.target.value)}
              />
            </Col>
            <Col md={5}>
              <Form.Label>Amount</Form.Label>
              <Form.Control
                type="number"
                placeholder="e.g. 300"
                value={otherAmount}
                onChange={(e) => setOtherAmount(e.target.value)}
              />
            </Col>
            <Col md={2}>
              <Button
                variant="outline-primary"
                className="w-100 mt-2"
                onClick={handleAddCustom}
              >
                Add
              </Button>
            </Col>
          </Row>

          {customList.length > 0 && (
            <>
              <hr />
              <h6>Custom Items:</h6>
              <ListGroup className="mb-3">
                {customList.map((item, idx) => (
                  <ListGroup.Item
                    key={idx}
                    className="d-flex justify-content-between"
                  >
                    <span>{item.name}</span>
                    <Badge bg="info">₹{item.amount}</Badge>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </>
          )}

          <div className="d-flex justify-content-between align-items-center mt-4">
            <h5>Total: ₹{totalAmount}</h5>
            <Button
              type="submit"
              variant="success"
              disabled={totalAmount === 0}
            >
              Submit Maintenance
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default MaintenanceModal;
