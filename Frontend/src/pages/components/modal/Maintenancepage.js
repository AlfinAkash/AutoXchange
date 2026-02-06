import React, { useEffect, useState } from "react";
import { Table, Button, Card, Row, Col, Spinner} from "react-bootstrap";
import MaintenanceModal from "./MaintenanceModal";
import Cookies from "js-cookie";
import BASE_URL from "../../../config/Config";

const MaintenancePage = () => {
  const [unsoldBikes, setUnsoldBikes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedBikeId, setSelectedBikeId] = useState(null);

  useEffect(() => {
    fetchPurchases();
  }, []);

 const fetchPurchases = async () => {
  const token = Cookies.get("token");
  setLoading(true);
  try {
    const res = await fetch(`${BASE_URL}/purchase`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) throw new Error("Failed to fetch purchase data");

    const data = await res.json();

    let purchases = [];
    if (Array.isArray(data)) {
      purchases = data;
    } else if (Array.isArray(data.purchases)) {
      purchases = data.purchases;
    } else if (Array.isArray(data.data)) {
      purchases = data.data;
    }

    const unsold = purchases.filter((bike) => bike.serviceStatus === "unsold" && bike.maintenance === false
);
    setUnsoldBikes(unsold);
  } catch (error) {
    console.error("❌ Error fetching purchase data:", error);
    setUnsoldBikes([]);
  } finally {
    setLoading(false);
  }
};

  const openModal = (id) => {
    setSelectedBikeId(id);
    setShowModal(true);
  };

  return (
    <div className="container-fluid p-4" style={{ minHeight: "100vh", backgroundColor: "#f8f9fa" }}>
      <Row>
        <Col lg={12}>
          <h3 className="mb-4 text-primary fw-bold">
            🛠 Service Maintenance Management
          </h3>

          <Card className="shadow-sm border-0 mb-5">
            <Card.Header className="bg-dark text-white fw-semibold">
              List of Purchased Vehicles for Maintenance
            </Card.Header>
            <Card.Body className="p-0">
              {loading ? (
                <div className="d-flex justify-content-center align-items-center py-5">
                  <Spinner animation="border" variant="primary" />
                  <span className="ms-3 text-muted">Loading unsold vehicle data...</span>
                </div>
              ) : unsoldBikes.length > 0 ? (
                <div className="table-responsive">
                  <Table hover className="align-middle mb-0">
                    <thead className="table-light">
                      <tr>
                        <th>No</th>
                        <th>Vehicle No</th>
                        <th>Vehicle brand</th>
                        <th>Model</th>
                        
                        <th className="text-center">Add Maintenance</th>
                      </tr>
                    </thead>
                    <tbody>
                      
                      {unsoldBikes.map((bike, index) => (
                        
                        <tr key={bike._id}>
                          <td>{index + 1}</td>
                          <td>{bike.vehicleNumber}</td>
                          <td className="fw-semibold">{bike.model}</td>
                          <td className="fw-semibold">{bike.brand}</td>
                          
                          <td className="text-center">
                            <Button
                              variant="outline-success"
                              size="sm"
                              onClick={() => openModal(bike.purchaseId || bike._id)}
                            >
                              <i className="bi bi-tools me-1"></i> Add
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-5">
                  <i className="bi bi-inbox display-4 text-secondary mb-3"></i>
                  <p className="text-muted mb-0">Currently All Vehicles are under Maintenance.</p>
                </div>
              )}
            </Card.Body>
          </Card>

          {/* Maintenance Modal */}
          <MaintenanceModal
            show={showModal}
            onHide={() => setShowModal(false)}
            bikeId={selectedBikeId}
          />
        </Col>
      </Row>
    </div>
  );
};

export default MaintenancePage;
