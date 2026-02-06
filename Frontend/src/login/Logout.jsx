import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";
import { AuthContext } from "../context/Authcontext"; // ✅ Import context

const LogoutButton = () => {
  const { logout } = useContext(AuthContext); // ✅ Get logout function
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(); // ✅ Clears token and updates context
    navigate("/login"); // ✅ Redirect to login
  };

  return (
    <Button variant="danger" onClick={handleLogout}>
      <i className="bi bi-box-arrow-right me-2"></i> Logout
    </Button>
  );
};

export default LogoutButton;