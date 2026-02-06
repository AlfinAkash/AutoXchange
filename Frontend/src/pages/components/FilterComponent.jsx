
// src/components/filter/FilterComponent.jsx
import React, { useEffect, useRef } from "react";
import { Spinner } from "react-bootstrap";

const filterOptions = [
  { label: "Select Filter Field", value: "", disabled: true },
  { label: "Sale Status", value: "serviceStatus" },
  { label: "Model", value: "model" },
  { label: "Vehicle Number", value: "vehicleNumber" },
  { label: "Brand", value: "brand" },
  { label: "Month", value: "month" },
  { label: "Year", value: "year" },
  { label: "Date", value: "purchaseDate" },
];

const readableField = (field) => {
  switch (field) {
    case "serviceStatus":
      return "Sale Status";
    case "model":
      return "Model";
    case "vehicleNumber":
      return "Vehicle Number";
    case "brand":
      return "Brand";
    case "month":
      return "Month";
    case "year":
      return "Year";
    case "purchaseDate":
      return "Date";
    default:
      return "";
  }
};

const FilterComponent = ({
  selectedField,
  setSelectedField,
  searchValue,
  setSearchValue,
  onSearch,
  loading = false,
}) => {
  const inputRef = useRef(null);

  useEffect(() => {
    const delay = setTimeout(() => {
      onSearch();
    }, 300);
    return () => clearTimeout(delay);
  }, [searchValue, selectedField]);

  useEffect(() => {
    if (
      inputRef.current &&
      !["serviceStatus", "month", "year", "purchaseDate"].includes(
        selectedField
      )
    ) {
      inputRef.current.focus();
    }
  }, [selectedField]);

  const handleReset = () => {
    setSelectedField("");
    setSearchValue("");
  };

  return (
    <div className="row g-3 align-items-end mb-4">
      <div className="col-md-3">
        <label className="form-label fw-semibold">
          <i className="bi bi-funnel-fill me-2"></i>Filter Field
        </label>
        <select
          className="form-select"
          value={selectedField}
          onChange={(e) => {
            setSelectedField(e.target.value);
            setSearchValue("");
          }}
        >
          {filterOptions.map((opt) => (
            <option
              key={opt.value}
              value={opt.value}
              disabled={opt.disabled || false}
            >
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <div className="col-md-4">
        <label className="form-label fw-semibold">
          <i className="bi bi-search me-2"></i>
          {readableField(selectedField) || "Search Value"}
        </label>
        {selectedField === "serviceStatus" ? (
          <select
            className="form-select"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          >
            <option value="">-- Select Sale Status --</option>
            <option value="sold">Sold</option>
            <option value="unsold">Unsold</option>
          </select>
        ) : selectedField === "month" ? (
          <select
            className="form-select"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          >
            <option value="">-- Select Month --</option>
            {Array.from({ length: 12 }, (_, i) => {
              const month = (i + 1).toString().padStart(2, "0");
              return (
                <option key={month} value={month}>
                  {month}
                </option>
              );
            })}
          </select>
        ) : selectedField === "year" ? (
          <select
            className="form-select"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          >
            <option value="">-- Select Year --</option>
            {[2023, 2024, 2025, 2026].map((yr) => (
              <option key={yr} value={yr}>
                {yr}
              </option>
            ))}
          </select>
        ) : selectedField === "purchaseDate" ? (
          <input
            type="date"
            className="form-control"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
        ) : (
          <input
            type="text"
            ref={inputRef}
            className="form-control"
            placeholder={`Enter ${readableField(selectedField)}...`}
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
        )}
      </div>

      <div className="col-md-2 d-flex gap-2">
        <button
          className="btn btn-secondary w-100"
          onClick={handleReset}
          disabled={!selectedField && !searchValue}
        >
          Reset
        </button>
      </div>

      {loading && (
        <div className="col-md-2">
          <Spinner animation="border" size="sm" /> <span>Searching...</span>
        </div>
      )}
    </div>
  );
};

export default FilterComponent;
