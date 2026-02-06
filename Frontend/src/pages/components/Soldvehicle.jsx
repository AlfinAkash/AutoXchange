import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Badge from "react-bootstrap/Badge";
import Spinner from "react-bootstrap/Spinner";
import Alert from "react-bootstrap/Alert";
import SellVehicleModal from "./SellVehicleModal";
import BASE_URL from "../../config/Config";

const Soldvehicle = () => {
  const [purchases, setPurchases] = useState([]);
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    vehicleNumber: "",
    rcBookDetails: "",
    buyerName: "",
    aadharNumber: "",
    phone: "",
    addressProof: "",
    sellingAmount: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    const token = Cookies.get("token");
    try {
      const res = await fetch(`${BASE_URL}/sales`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      
 setPurchases(Array.isArray(data.sales) ? data.sales : []);
  } catch (err) {
      setError("Failed to load purchase data. Please try again.");
      setPurchases([]);
    } finally {
      setLoading(false);
    }
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  const token = Cookies.get("token");

  try {
    const res = await fetch(`${BASE_URL}/sales`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(formData),
    });

    const result = await res.json();

    if (res.ok) {
      await fetchData(); // Refresh list
      setShow(false); // Close modal
      setFormData({
        vehicleNumber: "",
        rcBookDetails: "",
        buyerName: "",
        aadharNumber: "",
        phone: "",
        addressProof: "",
        sellingAmount: "",
      });
    } else {
      // Handle known error cases
      if (result.message) {
        const msg = result.message.toLowerCase();

        if (msg.includes("already sold")) {
          alert("❌ This vehicle is already sold.");
        } else if (msg.includes("not found")) {
          alert("❌ Vehicle not found in purchase list.");
        } else {
          alert("❌ Failed to sell vehicle. Please try again.");
        }
      } else {
        alert("❌ Failed to sell vehicle. Please try again.");
      }

      console.error("Post Error:", result);
    }
  } catch (err) {
    alert("❌ Failed to sell vehicle. Please try again.");
    console.error("Submit Error:", err);
  }
};



  return (
   <div className="container-fluid px-0 m-0 py-4" style={{ 
           
            width: '95%',
           
          }}> 
      {/* Header Section */}
      <Card className="shadow-sm mb-4 border-0">
        <Card.Body className="py-3">
          <div className="d-flex flex-column flex-md-row justify-content-start align-items-center gap-5 ">
            <div className="d-flex align-items-center">
              <div className="bg-primary bg-opacity-10 rounded-circle p-2 me-3">
                <i className="bi bi-box-seam fs-4 text-primary"></i>
              </div>
              <div>
                <h2 className="h4 mb-1 fw-bold text-dark">Sold Management</h2>
                <p className="text-muted mb-0 small">
                  {purchases.length} {purchases.length === 1 ? 'record' : 'records'} found
                </p>
              </div>
            </div>
            <div className="m-auto d-flex justify-content-center ">
            <Button 
              variant="primary" 
              onClick={() => setShow(true)}
              className="d-flex align-items-center p-1 shadow-sm fs-6"
              style={{ minWidth: '140px' }}
            >
              <i className="bi bi-plus-circle p-2"></i>
              Add sold vehicle
            </Button>
            </div>
          </div>
        </Card.Body>
      </Card>

      {/* Error Alert */}
      {error && (
        <Alert variant="danger" dismissible onClose={() => setError(null)} className="mb-4">
          <Alert.Heading className="h6 mb-2">
            <i className="bi bi-exclamation-triangle me-2"></i>
            Error
          </Alert.Heading>
          {error}
        </Alert>
      )}

      {/* Table Card */}
      <Card className="shadow-sm border-0">
       <Card.Header className="bg-light border-0 py-3 ">
  <div className="d-flex justify-content-between align-items-center flex-wrap   ">
    <h5 className="mb-0 text-dark fw-semibold">Purchase Records</h5>

    <Button 
      variant="outline-secondary" 
      size="sm" 
      onClick={fetchData}
      disabled={loading}
      className="d-flex align-items-center gap-1 mx-3"
    >
      <i className={`bi bi-arrow-clockwise ${loading ? 'spin' : ''}`}></i>
      Refresh
    </Button>
  </div>
</Card.Header>
        
        <Card.Body className="p-0">
          {/* Responsive Table Container */}
          <div className="table-responsive p-0" style={{ 
            maxHeight: '70vh',
            width: '100%',
           
          }}>
            <table className="table table-hover table-striped align-middle mb-0">
              <thead className="table-dark sticky-top">
                <tr>
                  <th scope="col" className="text-nowrap px-3 py-3 fw-semibold">
                    <i className="bi bi-file-text me-1"></i>RC Book No
                  </th>
                  <th scope="col" className="text-nowrap px-3 py-3 fw-semibold">
                    <i className="bi bi-car-front me-1"></i>Vehicle No
                  </th>
                  <th scope="col" className="text-nowrap px-3 py-3 fw-semibold">Model</th>
                  <th scope="col" className="text-nowrap px-3 py-3 fw-semibold">Brand</th>
                  <th scope="col" className="text-nowrap px-3 py-3 fw-semibold">
                    <i className="bi bi-shield-check me-1"></i>Insurance
                  </th>
                 
                 
                  <th scope="col" className="text-nowrap px-3 py-3 fw-semibold">
                    <i className="bi bi-currency-rupee me-1"></i>selling Amount
                  </th>
                   <th scope="col" className="text-nowrap px-3 py-3 fw-semibold">
                    <i className="bi bi-calendar me-1"></i>Selling Date
                  </th>
                 
                  <th scope="col" className="text-nowrap px-3 py-3 fw-semibold">Buyer Name</th>

                 <th scope="col" className="text-nowrap px-3 py-3 fw-semibold">
                    <i className="bi bi-telephone me-1"></i>Phone
                  </th>
                  <th scope="col" className="text-nowrap px-3 py-3 fw-semibold">
                    <i className="bi bi-house me-1"></i>Address
                  </th>
                  
                 
                </tr>
              </thead>
              <tbody >
                {loading ? (
                  <tr>
                    <td colSpan="14" className="text-center py-5">
                      <div className="d-flex flex-column align-items-center gap-3">
                        <Spinner animation="border" variant="primary" />
                        <span className="text-muted">Loading purchase records...</span>
                      </div>
                    </td>
                  </tr>
                ) : purchases.length > 0 ? (purchases.map((item, index) => {
  const { sale, purchase } = item;

  return (
    <tr key={index}>
      <td className="px-3 py-3 fw-medium text-dark text-center">
        {sale.rcBookDetails || "-"}
      </td>

      <td className="px-3 py-3 text-center">
        <span className="badge bg-light text-dark border px-2 py-1 ">
          {sale.vehicleNumber || "-"}
        </span>
      </td>

      <td className="px-3 py-3 text-center">{purchase?.model || "-"}</td>
      <td className="px-3 py-3 text-center">
        <span className="fw-medium text-primary ">{purchase?.brand || "-"}</span>
      </td>

      <td className="px-3 py-3 text-center">
        <Badge bg={purchase?.insurance?.hasInsurance ? "success" : "danger"}>
          <i className={`bi bi-${purchase?.insurance?.hasInsurance ? "check" : "x"}-circle me-1`}></i>
          {purchase?.insurance?.hasInsurance ? "Yes" : "No"}
        </Badge>
      </td>

      <td className="px-3 py-3 text-center">
        <span className="fw-bold text-success">
          ₹ {sale.sellingAmount}
        </span>
      </td>

      <td className="px-3 py-3 text-muted text-center">
        {new Date(sale.createdAt).toLocaleDateString()}
      </td>

      <td className="px-3 py-3 text-center">
        <span className="fw-bold text-success">{sale.buyerName}</span>
      </td>

      <td className="px-3 py-3 text-center">
        {sale.phone ? (
          <a href={`tel:${sale.phone}`} className="text-decoration-none">
            {sale.phone}
          </a>
        ) : "-"}
      </td>

      <td className="px-3 py-3 text-center">
        <span className="text-truncate d-inline-block" style={{ maxWidth: '120px' }}>
          {sale.addressProof || "-"}
        </span>
      </td>
    </tr>
  );
})  
) : (
                  <tr>
                    <td colSpan="14" className="text-center py-5">
                      <div className="d-flex flex-column align-items-center gap-3 text-muted">
                        <i className="bi bi-inbox display-1 opacity-25"></i>
                        <div>
                          <h5 className="text-muted">No Purchase Records Found</h5>
                          <p className="mb-0">Start by adding your first purchase record.</p>
                        </div>
                        <Button 
                          variant="outline-primary" 
                          onClick={() => setShow(true)}
                          className="mt-2"
                        >
                          <i className="bi bi-plus-circle me-2"></i>
                          Add First Purchase
                        </Button>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card.Body>
        
        {purchases.length > 0 && !loading && (
          <Card.Footer className="bg-light text-muted text-center py-3 border-0">
            <small>
              <i className="bi bi-info-circle me-1"></i>
              Showing {purchases.length} purchase {purchases.length === 1 ? 'record' : 'records'}
            </small>
          </Card.Footer>
        )}
      </Card>

      {/* Modal */}
     <SellVehicleModal
        show={show}
        handleClose={() => setShow(false)}
        handleSubmit={handleSubmit}
        formData={formData}
        setFormData={setFormData}
      />

      {/* Custom Styles */}
      <style jsx>{`
        .spin {
          animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        .table-responsive {
          border-radius: 0.375rem;
           overflow-x:scroll;
        }
        
        .table th {
          border-top: none;
          font-size: 0.875rem;
          letter-spacing: 0.025em;
        }
        
        .table td {
          font-size: 0.875rem;
          vertical-align: middle;
        }
        
        .table-hover tbody tr:hover {
          background-color: rgba(var(--bs-primary-rgb), 0.05);
        }
        
        .sticky-top {
          z-index: 10;
        }
        
        /* Mobile responsiveness */
        @media (max-width: 768px) {
          .table th, .table td {
            font-size: 0.8rem;
            padding: 0.5rem 0.75rem;
          }
          
          .container-fluid {
            padding-left: 1rem;
            padding-right: 1rem;
          }
        }
        
        /* Custom scrollbar for webkit browsers */
        .table-responsive::-webkit-scrollbar {
          height: 8px;
          width: 8px;
        }
        
        .table-responsive::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 4px;
        }
        
        .table-responsive::-webkit-scrollbar-thumb {
          background: #c1c1c1;
          border-radius: 4px;
        }
        
        .table-responsive::-webkit-scrollbar-thumb:hover {
          background: #a8a8a8;
        }
      `}</style>
    </div>
  );
};

export default Soldvehicle;