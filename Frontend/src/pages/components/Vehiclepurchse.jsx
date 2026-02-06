import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import Button from "react-bootstrap/Button";
import AddPurchaseModal from "./AddPurchaseModal";
import BASE_URL from "../../config/Config";

import FilterComponent from "./FilterComponent";
import FullPurchaseDetails from "./FullPurchaseDetails";

const PurchaseList = () => {
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [show, setShow] = useState(false);
  const [selectedField, setSelectedField] = useState("serviceStatus");
  const [searchValue, setSearchValue] = useState("");
  const [selectedPurchase, setSelectedPurchase] = useState(null);

  const [successMessage, setSuccessMessage] = useState("");
const [errorMessage, setErrorMessage] = useState("");

  const [formData, setFormData] = useState({
    dlpNumber: "",
    vehicleNumber: "",
    model: "",
    brand: "",
    insurance: { hasInsurance: false, insuranceDetails: "" }, // <-- Fix here
    fineAmount: "",
    purchaseAmount: "",
    purchaseDate: "",
    aadharCard: "",
    addressProof: "",
    phone: "",
    email: "",
    serviceStatus: "",
  });
  

  const [images, setImages] = useState([]);

  const handleFileChange = (filesOrEvent) => {
    const files = Array.isArray(filesOrEvent)
      ? filesOrEvent
      : Array.from(filesOrEvent.target.files);

    const validFiles = files.filter((file) => file.size <= 2 * 1024 * 1024);
    setImages(validFiles.slice(0, 5));
  };
  

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const token = Cookies.get("token");

    try {
      const res = await fetch(`${BASE_URL}/purchase`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      
      if (Array.isArray(data)) {

        
        setPurchases(data);
      } else if (Array.isArray(data.data)) {
        setPurchases(data.data);
      } else if (Array.isArray(data.purchases)) {
        setPurchases(data.purchases);
      } else {
        setPurchases([]);
      }
    } catch (error) {
      console.error("Fetch error:", error);
      setPurchases([]);
    } finally {
      setLoading(false);
    }

    
  };

const handleChange = (e) => {
  const { name, value } = e.target;

  if (name.startsWith("insurance.")) {
    const key = name.split(".")[1];
    setFormData((prev) => ({
      ...prev,
      insurance: {
        ...prev.insurance,
        [key]: value,
      },
    }));
  } else {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }
};
 

const handleSubmit = async (e) => {
  e.preventDefault();
  const token = Cookies.get("token");

  try {
    const form = new FormData();

    for (let key in formData) {
      if (key === "insurance") {
        form.append("insurance", formData.insurance.hasInsurance);
        form.append(
          "insuranceDetails",
          formData.insurance.hasInsurance ? formData.insurance.insuranceDetails : ""
        );
      } else {
        form.append(key, formData[key]);
      }
    }

    images.forEach((img) => form.append("bikeImages", img));

    const res = await fetch(`${BASE_URL}/purchase`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: form,
    });

    if (res.ok) {
      fetchData();
      setShow(false);
      setSuccessMessage("✅ Purchase added successfully!");
      setErrorMessage(""); // clear error

      // Reset form
      setFormData({
        dlpNumber: "",
        vehicleNumber: "",
        model: "",
        brand: "",
        insurance: { hasInsurance: false, insuranceDetails: "" },
        fine: "",
        purchaseAmount: "",
        purchaseDate: "",
        aadharCard: "",
        addressProof: "",
        phone: "",
        email: "",
        maintanance: "",
      });
      setImages([]);

      // Auto-hide success message
      setTimeout(() => setSuccessMessage(""), 4000);
    } else {
      const errorText = await res.text();
      setErrorMessage("❌ Failed to add purchase: " + errorText);
      setSuccessMessage(""); // clear success
    }
  } catch (err) {
    setErrorMessage("❌ Error submitting purchase: " + err.message);
    setSuccessMessage(""); // clear success
  }
};


  const getFieldValue = (item, field) => {
    return (item[field] || "").toString().toLowerCase();
  };

  const filteredPurchases = purchases.filter((item) => {
    const search = searchValue.toLowerCase().trim();
    const dateStr = item.purchaseDate ? item.purchaseDate.substring(0, 10) : "";

    if (!search) return true;

    const purchaseDateObj = new Date(dateStr);

    if (selectedField === "serviceStatus") {
      return getFieldValue(item, selectedField) === search;
    }

    if (
      selectedField === "model" ||
      selectedField === "vehicleNumber" ||
      selectedField === "brand"
    ) {
      return getFieldValue(item, selectedField).includes(search);
    }

    if (selectedField === "month") {
      const itemMonth = (purchaseDateObj.getMonth() + 1)
        .toString()
        .padStart(2, "0");
      return itemMonth === search;
    }

    if (selectedField === "year") {
      const itemYear = purchaseDateObj.getFullYear().toString();
      return itemYear === search;
    }

    if (selectedField === "purchaseDate") {
      return dateStr === search;
    }

    return true;
  });

  

  return (
  <div className="container mb-5" style={{ maxWidth: "1200px" }}>
    {/* Header */}
    <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-3 ">
      <h2 className="fw-bold text-primary">
        <i className="bi bi-box-seam me-2 fs-3"></i> Purchase List
      </h2>
      <div className="d-flex gap-3">
        <Button variant="outline-dark" className="d-flex align-items-center" onClick={fetchData}>
          <i className="bi bi-arrow-clockwise me-2"></i> Refresh
        </Button>
        <Button variant="primary" className="d-flex align-items-center" onClick={() => setShow(true)}>
          <i className="bi bi-plus-circle me-2"></i> Add Product
        </Button>
      </div>
    </div>

    {/* Filter Section */}
    <div className="mb-4">
      <FilterComponent
        selectedField={selectedField}
        setSelectedField={setSelectedField}
        searchValue={searchValue}
        setSearchValue={setSearchValue}
        onSearch={() => {}}
      />
    </div>

    {/* Alerts */}
{successMessage && (
  <div className="alert alert-success alert-dismissible fade show" role="alert">
    {successMessage}
    <button
      type="button"
      className="btn-close"
      onClick={() => setSuccessMessage("")}
    ></button>
  </div>
)}

{errorMessage && (
  <div className="alert alert-danger alert-dismissible fade show" role="alert">
    {errorMessage}
    <button
      type="button"
      className="btn-close"
      onClick={() => setErrorMessage("")}
    ></button>
  </div>
)}


   {/* Table Section */}
<div className="table-responsive" style={{ maxHeight: "500px", overflowY: "auto", border: "1px solid #dee2e6", borderRadius: "0.5rem" }}>
  <table className="table table-bordered align-middle text-center mb-0">
    <thead className="sticky-top " >
      <tr className="fw-semibold  ">
        <th className="bg-dark text-white"><i className="bi bi-journal-text me-1 "></i>RC Book No</th>
        <th className="bg-dark text-white"><i className="bi bi-car-front me-1"></i>Vehicle No</th>
        <th className="bg-dark text-white">Model</th>
        <th className="bg-dark text-white">Brand</th>
        <th  className="bg-dark text-white"><i className="bi bi-shield-check me-1"></i>Insurance</th>
        <th className="bg-dark text-white"><i className="bi bi-exclamation-circle me-1"></i>Fine</th>
        <th className="bg-dark text-white"><i className="bi bi-currency-rupee me-1"></i>Purchase</th>
        <th className="bg-dark text-white"><i className="bi bi-calendar-event me-1"></i>Date</th>
         <th className="bg-dark text-white">Maintanace status</th>
        <th className="bg-dark text-white"><i className="bi bi-gear me-1"></i>Action</th>
      </tr>
    </thead>
    <tbody className="text-nowrap">
      {loading ? (
        <tr>
          <td colSpan="11" className="py-5 text-center">
            <div className="d-flex flex-column align-items-center gap-2">
              <div className="spinner-border text-primary" role="status" />
              <span className="text-muted">Loading purchase records...</span>
            </div>
          </td>
        </tr>
      ) : filteredPurchases.length > 0 ? (
        filteredPurchases.map((item, index) => (

          <tr
            key={index}
            style={{
              backgroundColor: index % 2 === 0 ? "#f9f9f9" : "#fff"
            }}
          >
            <td>{item.dlpNumber}</td>
            <td>
              <span className="badge bg-light border text-dark px-2 py-1">
                {item.vehicleNumber}
              </span>
            </td>
            <td>{item.model}</td>
            <td><span className="fw-semibold text-primary">{item.brand}</span></td>
            <td>
              <span className={`badge ${item.insurance?.hasInsurance ? "bg-success" : "bg-danger"} px-2`}>
                <i className={`bi bi-${item.insurance?.hasInsurance ? "check" : "x"}-circle me-1`}></i>
                {item.insurance?.hasInsurance ? "Yes" : "No"}
              </span>
            </td>
            
            <td className={item.fine || item.fineAmount ? "text-danger" : "text-muted"}>
              {item.fine || item.fineAmount ? `₹ ${item.fine || item.fineAmount}` : "No Fine"}
            </td>
            <td className="fw-bold text-success">{`₹ ${item.purchaseAmount}`}</td>
            <td className="text-muted">{item.purchaseDate?.substring(0, 10)}</td>
          <td>
  <span className={`badge ${item.maintenance ? "bg-success" : "bg-danger"} px-2`}>
    <i className={`bi bi-${item.maintenance ? "check" : "x"}-circle me-1`}></i>
    {item.maintenance ? "Yes" : "No"}
  </span>
</td>

           
            <td>
              <Button
                variant="outline-info"
                size="sm"
                onClick={() => setSelectedPurchase(item)}
                className="d-flex align-items-center justify-content-center gap-1"
              >
                <i className="bi bi-eye-fill"></i> View
              </Button>
            </td>
          </tr>
        ))
      ) : (
        <tr>
          <td colSpan="11" className="text-center py-5 text-muted">
            <i className="bi bi-inbox display-4 d-block mb-2 opacity-25"></i>
            <div>No matching records found.</div>
          </td>
        </tr>
      )}
    </tbody>
  </table>
</div>




    {/* Modals */}
    <AddPurchaseModal
      show={show}
      handleClose={() => setShow(false)}
      handleSubmit={handleSubmit}
      handleChange={handleChange}
      formData={formData}
      handleFileChange={handleFileChange}
    />

    {selectedPurchase && (
      <div className="fullscreen-overlay">
        <FullPurchaseDetails
          purchase={selectedPurchase}
          onClose={() => {
            setSelectedPurchase(null);
          }}
          onDeleteSuccess={() => {
            setSelectedPurchase(null);
            fetchData();
          }}
        />
      </div>
    )}
  </div>
);

};

export default PurchaseList;