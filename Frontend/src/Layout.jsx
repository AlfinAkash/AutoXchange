import React from "react";
import Sidebar from "./pages/navbar/Navbar"; // make sure this path is correct
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <div className="d-flex">
      <Sidebar />
      <div className="p-4" style={{ flex: 1 }}>
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;