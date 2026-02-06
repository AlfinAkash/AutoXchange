import React, { useEffect, useState } from "react";
import {
  Table,
  Spinner,
  Alert,
  Badge,
  Card,
  Button,
  Modal,
  Form,
} from "react-bootstrap";
import Cookies from "js-cookie";
import BASE_URL from "../../../config/Config";

const MaintenanceList = () => {
  const [maintenanceData, setMaintenanceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editRecord, setEditRecord] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [formParts, setFormParts] = useState([]);

  const token = Cookies.get("token");

  const fetchMaintenance = async () => {
    try {
      const response = await fetch(`${BASE_URL}/maintenance`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setMaintenanceData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMaintenance();
  }, [token]);

  const handleEdit = (record) => {
    setEditRecord(record);
    setFormParts(record.parts);
    setShowEditModal(true);
  };

  const handlePartChange = (index, field, value) => {
    const updatedParts = [...formParts];
    updatedParts[index][field] = field === "amount" ? parseInt(value || 0) : value;
    setFormParts(updatedParts);
  };

  const handleUpdateSubmit = async () => {
    try {
      const response = await fetch(`${BASE_URL}/maintenance/${editRecord._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ parts: formParts }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update maintenance");
      }

      await fetchMaintenance();
      setShowEditModal(false);
    } catch (err) {
      alert("Update failed: " + err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this maintenance record?")) return;

    try {
      const response = await fetch(`${BASE_URL}/maintenance/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to delete");

      await fetchMaintenance();
    } catch (err) {
      alert("Delete failed: " + err.message);
    }
  };

  if (loading) {
    return (
      <Card className="text-center p-4 shadow-sm my-4">
        <Spinner animation="border" variant="primary" />
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="text-center p-4 shadow-sm my-4">
        <Alert variant="danger" className="mb-0">{error}</Alert>
      </Card>
    );
  }

  if (maintenanceData.length === 0) {
    return (
      <Card className="text-center p-4 shadow-sm my-4">
        <Alert variant="info" className="mb-0">No maintenance records found.</Alert>
      </Card>
    );
  }

  return (
    <>
      <Card className="p-3 shadow-sm mb-5">
        <h4 className="mb-3 text-center text-secondary">🛠 Maintenance Records</h4>
        <div className="table-responsive rounded border">
          <Table bordered hover striped responsive className="align-middle text-center mb-0">
            <thead className="table-dark">
              <tr>
                <th>No</th>
                <th>Vehicle No</th>
                <th>Model</th>
                <th>Service Date</th>
                <th>Parts</th>
                <th>Total</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {maintenanceData.map((record, idx) => (
                <tr key={record._id}>
                  <td>{idx + 1}</td>
                  <td>{record.bikeId?.vehicleNumber || "-"}</td>
                  <td>{record.bikeId?.model || "-"}</td>
                  <td>{new Date(record.createdAt).toLocaleDateString()}</td>
                  <td className="text-start">
                    <ul className="list-unstyled mb-0">
                      {record.parts.map((part) => (
                        <li key={part._id}>
                          <Badge bg="info" className="me-2 mb-1">{part.name}</Badge>
                          <span className="text-muted">₹{part.amount}</span>
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td><strong className="text-success">₹{record.totalAmount}</strong></td>
                  <td>
                    <Button variant="outline-primary" size="sm" className="me-2" onClick={() => handleEdit(record)}>
                      <i className="bi bi-pencil-square"></i>
                    </Button>
                    <Button variant="outline-danger" size="sm" onClick={() => handleDelete(record._id)}>
                      <i className="bi bi-trash"></i>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </Card>

      {/* Edit Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Maintenance</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {formParts.map((part, index) => (
            <Form.Group key={index} className="mb-3">
              <Form.Label>{part.name}</Form.Label>
              <Form.Control
                type="number"
                value={part.amount}
                onChange={(e) => handlePartChange(index, "amount", e.target.value)}
                min={0}
              />
            </Form.Group>
          ))}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>Cancel</Button>
          <Button variant="success" onClick={handleUpdateSubmit}>Save Changes</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default MaintenanceList;
