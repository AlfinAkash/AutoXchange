import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import BASE_URL from "../../../config/Config"
import Cookies from "js-cookie";
const MAX_SIZE = 2 * 1024 * 1024; // 2MB

const ImageUploader = ({ onUpload }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!["image/jpeg", "image/png", "image/jpg"].includes(file.type)) {
      alert("Only JPG, JPEG, PNG files are allowed.");
      return;
    }

    if (file.size > MAX_SIZE) {
      alert("File size must be less than 2MB.");
      return;
    }

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const uploadImage = async () => {
    if (!selectedFile) {
      alert("Please select a file first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);
    const token = Cookies.get("token");

    try {
      setUploading(true);

      const res = await fetch(`${BASE_URL}/api/v1/upload/profile`, {
        method: "POST",
        body: formData,
        credentials: "include", // ✅ for cookie-based auth
      });
const token = Cookies.get("token");
      if (!res.ok) throw new Error("Upload failed");

      const data = await res.json();
      onUpload(data.url); // Pass URL to parent
      setSelectedFile(null);
      setPreviewUrl(null);
    } catch (err) {
      console.error("Image upload error:", err);
      alert("Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  return (
    <Form.Group>
      <Form.Label>Upload Image</Form.Label>
      <div className="d-flex gap-2 align-items-center">
        <Form.Control
          type="file"
          accept="image/png,image/jpeg,image/jpg"
          onChange={handleFileChange}
        />
        <Button
          variant="outline-primary"
          size="sm"
          onClick={uploadImage}
          disabled={!selectedFile || uploading}
        >
          {uploading ? "Uploading..." : "Upload"}
        </Button>
      </div>

      {previewUrl && (
        <div className="mt-2">
          <img
            src={previewUrl}
            alt="Preview"
            className="img-thumbnail"
            style={{ width: "100px", height: "100px", objectFit: "cover" }}
          />
        </div>
      )}
    </Form.Group>
  );
};

export default ImageUploader;
