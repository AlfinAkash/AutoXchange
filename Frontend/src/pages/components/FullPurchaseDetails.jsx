import React, { useState } from "react";
import Cookies from "js-cookie";
import styles from "../styles/FullPurchaseDetails.module.css";
import BASE_URL from "../../config/Config";

const FullPurchaseDetails = ({ purchase, onClose, onDeleteSuccess }) => {
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState(purchase);

  const [previewImage, setPreviewImage] = useState(null);

const token = Cookies.get("token");
const role = Cookies.get("role") || localStorage.getItem("role");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name.startsWith("insurance.")) {
      const key = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        insurance: {
          ...prev.insurance,
          [key]: type === "checkbox" ? checked : value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };
  

  const handleUpdate = async () => { 
    if (!token) {
      alert("Unauthorized: No token found.");
      return;
    }

    try {
     const payload = {
  brand: formData.brand,
  model: formData.model,
  vehicleNumber: formData.vehicleNumber,
  rcBookNumber: formData.rcBookNumber,
  purchaseDate: formData.purchaseDate,
  purchaseAmount: formData.purchaseAmount,
  fine: formData.fine,
  phone: formData.phone,
  email: formData.email,
  aadharCard: formData.aadharCard,
  addressProof: formData.addressProof,
  
  insurance: formData.insurance?.hasInsurance || false,
insuranceDetails: formData.insurance?.insuranceDetails || "",

  bikeImages: formData.bikeImages || [], // ✅ Add this
};


console.log("Update payload:", payload);

      const response = await fetch(
        `${BASE_URL}/purchase/${purchase.purchaseId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          credentials: 'include',
          body: JSON.stringify(payload),
        }
      );

      if (response.ok) {
        const updatedData = await response.json();

        if (updatedData.purchaseDate) {
          updatedData.purchaseDate = new Date(
            updatedData.purchaseDate
          ).toISOString();
        }

        const requiredFields = [
          "brand",
          "model",
          "vehicleNumber",
          "rcBookNumber",
          "purchaseDate",
          "purchaseAmount",
          "fine",
          "phone",
          "email",
          "aadharCard",
          "addressProof",
          "bikeImages",
          "serviceStatus",
          "updatedAt",
          "insurance",
        ];
        
        requiredFields.forEach((key) => {
          if (!updatedData[key]) updatedData[key] = formData[key] ?? "";
        });

        setFormData(updatedData);
        setEditMode(false);
        alert("Purchase updated successfully");
         onClose();
         onDeleteSuccess();
      } else {
        const errorText = await response.text();
        alert("Update failed: " + errorText);
      }
    } catch (error) {
      alert("An error occurred while updating");
    }
  };

const handleDelete = async () => {
  if (!window.confirm("Are you sure to delete this purchase?")) return;

  try {
    const response = await fetch(
      `${BASE_URL}/purchase/${purchase.purchaseId}`,
      {
        method: "DELETE",
        credentials: "include", // ✅ cookie sent
      }
    );

    if (response.ok) {
      alert("Purchase deleted successfully");
      onDeleteSuccess();
      onClose();
    } else {
      const errorText = await response.text();
      alert("Delete failed: " + errorText);
    }
  } catch (error) {
    alert("An error occurred while deleting");
  }
};


return (
  <div className={styles.backdrop}>
    <div className="container my-4">
      


      
        

    

        {editMode ? (<div className="card shadow-sm">
          <div className="bg-primary text-white rounded shadow-sm px-4 py-3 mb-4 d-flex justify-content-between align-items-center">
  <h3 className="fw-bold mb-0">
    <i className="bi bi-card-list me-2 fs-4"></i>Purchase Details
  </h3>
  <button className="btn btn-outline-light btn-sm d-flex align-items-center" onClick={onClose}>
    <i className="bi bi-x-lg me-1"></i> Close
  </button>
</div>
  <div className="card-body px-4 py-3">
    <div className="row g-3">

      {/* VEHICLE DETAILS */}
      <div className="col-12 mb-1">
        <h5 className="text-primary border-bottom pb-2">
          <i className="bi bi-truck me-2"></i>Vehicle Details
        </h5>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="mb-0">
            {formData.brand} - {formData.model}
          </h5>
        </div>
      </div>

      {[
        { label: "Brand", name: "brand" },
        { label: "Model", name: "model" },
        { label: "Vehicle Number", name: "vehicleNumber" },
        { label: "RC Book Number", name: "rcBookNumber" },
        {
          label: "Purchase Date",
          name: "purchaseDate",
          type: "date",
          value: formData.purchaseDate?.split("T")[0] || "",
        },
        { label: "Amount", name: "purchaseAmount" },
        { label: "Fine", name: "fine" },
      ].map(({ label, name, type = "text", value }) => (
        <div className="col-md-6" key={name}>
          <label className="form-label fw-semibold">{label}</label>
          <input
            type={type}
            name={name}
            value={value ?? formData[name]}
            onChange={handleChange}
            className="form-control"
          />
        </div>
      ))}

      {/* OWNER DETAILS */}
      <div className="col-12 mt-4 mb-1">
        <h5 className="text-primary border-bottom pb-2">
          <i className="bi bi-person-badge me-2"></i>Owner Details
        </h5>
      </div>

      {[
        { label: "Phone", name: "phone" },
        { label: "Email", name: "email" },
        { label: "Aadhar Card", name: "aadharCard" },
        { label: "Address Proof", name: "addressProof" },
      ].map(({ label, name }) => (
        <div className="col-md-6" key={name}>
          <label className="form-label fw-semibold">{label}</label>
          <input
            type="text"
            name={name}
            value={formData[name]}
            onChange={handleChange}
            className="form-control"
          />
        </div>
      ))}

      {/* INSURANCE */}
      <div className="col-12 mt-4 mb-1">
        <h5 className="text-primary border-bottom pb-2">
          <i className="bi bi-shield-check me-2"></i>Insurance
        </h5>
      </div>

      <div className="col-md-6">
        <div className="form-check">
          <input
            type="checkbox"
            name="insurance.hasInsurance"
            checked={formData.insurance?.hasInsurance || false}
            onChange={handleChange}
            className="form-check-input"
            id="hasInsurance"
          />
          <label className="form-check-label fw-semibold" htmlFor="hasInsurance">
            Has Insurance
          </label>
        </div>
      </div>

      {formData.insurance?.hasInsurance && (
        <div className="col-md-6">
          <label className="form-label fw-semibold">Insurance Validity</label>
          <input
            type="date"
            name="insurance.insuranceDetails"
            value={
              formData.insurance.insuranceDetails
                ? formData.insurance.insuranceDetails.split("T")[0]
                : ""
            }
            onChange={handleChange}
            className="form-control"
          />
        </div>
      )}

      {/* IMAGES */}
      {/* <div className="col-12 mt-4 mb-1">
        <h5 className="text-primary border-bottom pb-2">
          <i className="bi bi-images me-2"></i>Bike Images
        </h5>
      </div>

      <div className="col-12">
        <input
          type="file"
          name="bikeImages"
          accept="image/*"
          multiple
          className="form-control"
          onChange={(e) => {
            const files = Array.from(e.target.files).slice(0, 5);
            const tooBig = files.some((file) => file.size > 2 * 1024 * 1024);
            if (tooBig) {
              alert("Each image must be less than 2MB");
              return;
            }
            setFormData((prev) => ({
              ...prev,
              bikeImages: files,
            }));
          }}
        />
        <div className="d-flex flex-wrap gap-2 mt-3">
          {Array.isArray(formData.bikeImages) &&
            formData.bikeImages.map((img, i) => (
              <img
                key={i}
                src={img instanceof File ? URL.createObjectURL(img) : img}
                alt={`Bike ${i + 1}`}
                className="img-thumbnail shadow-sm"
                style={{ maxWidth: "140px", maxHeight: "100px", objectFit: "cover" }}
              />
            ))}
        </div>
      </div> */}

      {/* ACTION BUTTONS */}
      <div className="col-12 d-flex justify-content-end gap-3 mt-4">
        <button className="btn btn-success d-flex align-items-center px-4" onClick={handleUpdate}>
          <i className="bi bi-check-circle me-2"></i>Update
        </button>
        <button
          className="btn btn-outline-secondary d-flex align-items-center px-4"
          onClick={() => setEditMode(false)}
        >
          <i className="bi bi-x-circle me-2"></i>Cancel
        </button>
      </div>
    </div>
  </div>
</div>


        ) : 
         (
  <div className="modal fade show d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: "rgba(0,0,0,0.75)" }}>
    <div className="modal-dialog modal-xl modal-dialog-scrollable">
      <div className="modal-content rounded-4 shadow-lg border-0">
        {/* Header */}
        <div className="modal-header bg-primary text-white rounded-top-4 py-3">
          <h4 className="modal-title fw-bold">
            <i className="bi bi-card-checklist me-2 fs-4"></i> Purchase Summary
          </h4>
          <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
        </div>

        {/* Body */}
        <div className="modal-body p-4 fs-6">
          {/* Vehicle Info */}
          <h5 className="text-primary fw-bold border-bottom pb-2 mb-3">
            <i className="bi bi-truck-front-fill me-2 fs-5"></i>Vehicle Details
          </h5>
          <div className="row gy-2">
            <div className="col-md-6"><strong>Brand:</strong> {formData.brand}</div>
            <div className="col-md-6"><strong>Model:</strong> {formData.model}</div>
            <div className="col-md-6"><strong>Vehicle No:</strong> {formData.vehicleNumber}</div>
            <div className="col-md-6"><strong>RC Book No:</strong> {formData.rcBookNumber}</div>
            <div className="col-md-6"><strong>Purchase Date:</strong> {new Date(formData.purchaseDate).toLocaleDateString()}</div>
            <div className="col-md-6">
              <strong>Amount:</strong> ₹{formData.purchaseAmount} &nbsp;&nbsp;
              <strong>Fine:</strong> ₹{formData.fine}
            </div>
          </div>

          {/* Images */}
        {formData.bikeImages?.length > 0 && (
  <div className="mt-4">
    <h6 className="fw-bold text-warning">
      <i className="bi bi-images fs-5 me-2"></i>Bike Images
    </h6>
    <div className="d-flex flex-wrap gap-3 mt-3">
      {formData.bikeImages.map((img, idx) => (
        <img key={idx}
             src={img}
             className="img-thumbnail rounded"
             style={{ width: "150px", height: "auto", cursor: "pointer" }}
             alt={`bike-${idx}`}
             onClick={() => setPreviewImage(img)}
        />
      ))}
    </div>
  </div>
)}



{/* Image Preview Modal */}
{previewImage && (
  <div
    className="modal fade show d-block"
    tabIndex="-1"
    role="dialog"
    style={{
      backgroundColor: "rgba(0, 0, 0, 0.8)",
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      zIndex: 1050,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}
    onClick={() => setPreviewImage(null)} // click outside to close
  >
    <div
      className="modal-dialog modal-dialog-centered"
      role="document"
      onClick={(e) => e.stopPropagation()} // prevent close on image click
    >
      <div className="modal-content bg-transparent border-0 text-center">
        <button
          type="button"
          className="btn btn-close btn-close-white position-absolute top-0 end-0 m-3"
          aria-label="Close"
          onClick={() => setPreviewImage(null)}
        ></button>
        <img
          src={previewImage}
          alt="Full Bike"
          className="img-fluid rounded shadow"
          style={{ maxHeight: "90vh", maxWidth: "90vw" }}
        />
      </div>
    </div>
  </div>
)}


          {/* Owner Details */}
          <h5 className="text-success fw-bold border-bottom pb-2 mt-4 mb-3">
            <i className="bi bi-person-vcard-fill me-2 fs-5"></i>Owner Information
          </h5>
          <div className="row gy-2">
            <div className="col-md-6"><strong>Phone:</strong> {formData.phone}</div>
            <div className="col-md-6"><strong>Email:</strong> {formData.email}</div>
            <div className="col-md-6"><strong>Aadhar:</strong> {formData.aadharCard}</div>
            <div className="col-md-6"><strong>Address Proof:</strong> {formData.addressProof}</div>
          </div>

          {/* Insurance */}
          <h5 className="text-warning fw-bold border-bottom pb-2 mt-4 mb-3">
            <i className="bi bi-shield-fill-check me-2 fs-5"></i>Insurance Details
          </h5>
          <div className="row gy-2">
            <div className="col-md-6"><strong>Has Insurance:</strong> {formData.insurance?.hasInsurance ? "Yes ✅" : "No ❌"}</div>
            {formData.insurance?.hasInsurance && (
              <div className="col-md-6"><strong>Valid Till:</strong> {new Date(formData.insurance.insuranceDetails).toLocaleDateString()}</div>
            )}
          </div>

          {/* Maintenance */}
          {formData.maintenance && Array.isArray(formData.maintenanceRecords) && formData.maintenanceRecords.length > 0 && (
            <div className="mt-4">
              <h5 className="text-danger fw-bold mb-3">
                <i className="bi bi-tools me-2 fs-5"></i>Maintenance History
              </h5>
              {formData.maintenanceRecords.map((record, index) => (
                <div key={index} className="mb-4 border rounded p-3 bg-light shadow-sm">
                  <div className="fs-6 mb-2"><strong>Total Amount:</strong> ₹{record.totalAmount}</div>
                  <div className="fw-bold mb-2">Parts Used:</div>
                  <ul className="list-group">
                    {record.parts.map((part, idx) => (
                      <li key={idx} className="list-group-item d-flex justify-content-between align-items-center fs-6">
                        <span><i className="bi bi-cpu-fill text-muted me-2"></i>{part.name}</span>
                        <span className="fw-semibold text-success">₹ {part.amount}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
       <div className="modal-footer bg-light border-top py-3 px-4">
  <small className="text-muted fs-6">
    <i className="bi bi-clock-history me-2"></i>
    Last Updated: {formData.updatedAt ? new Date(formData.updatedAt).toLocaleString() : "N/A"}
  </small>
  <div>
    <button className="btn btn-outline-secondary btn-md me-2" onClick={() => setEditMode(true)}>
      <i className="bi bi-pencil-square me-1"></i>Edit
    </button>

    {role === "admin" && (
  <button className="btn btn-outline-danger btn-md" onClick={handleDelete}>
    <i className="bi bi-trash-fill me-1"></i>Delete
  </button>
)}
  </div>
</div>

      </div>
    </div>
  </div>

        )}

       

        
      </div>
    </div>
 
);






};

export default FullPurchaseDetails;