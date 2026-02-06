import Cookies from 'js-cookie';
import { NavLink } from 'react-router-dom';
import LogoutButton from '../../login/Logout';

const Sidebar = () => {

  const role = Cookies.get("role")
  console.log(role)

  return (
    <div className="d-flex flex-column flex-shrink-0 p-3 text-white bg-dark position-sticky"
  style={{ width: '250px', height: '100vh', top: 0, left: 0, zIndex: 1000 }}>
      <h4 className="text-center mb-4">AutoXchange</h4>

      <ul className="nav nav-pills flex-column mb-auto">
        <li className="nav-item mb-2">
          <NavLink to="/dashboard" className={({ isActive }) => `nav-link ${isActive ? 'bg-primary text-white' : 'text-white'} px-3 py-3 rounded`}>
            <i className="bi bi-speedometer2 me-2"></i> Dashboard
          </NavLink>
        </li>
        <li className="nav-item mb-2">
          <NavLink to="/purchase-vehicle" className={({ isActive }) => `nav-link ${isActive ? 'bg-primary text-white' : 'text-white'} px-3 py-3 rounded`}>
            <i className="bi bi-cart-plus me-2"></i> Purchased Vehicles
          </NavLink>
        </li>
        <li className="nav-item mb-2">
          <NavLink to="/sold-vehicle" className={({ isActive }) => `nav-link ${isActive ? 'bg-primary text-white' : 'text-white'} px-3 py-3 rounded`}>
            <i className="bi bi-cash-coin me-2"></i> Sold Vehicles
          </NavLink>
        </li>
        <li className="nav-item mb-2">
          <NavLink to="/service-maintenance" className={({ isActive }) => `nav-link ${isActive ? 'bg-primary text-white' : 'text-white'} px-3 py-3 rounded`}>
            <i className="bi bi-tools me-2"></i> Service Maintenance
          </NavLink>
        </li>
           {role === "admin" && (
      <li className="nav-item mb-2">
        <NavLink
          to="/create-staff"
          className={({ isActive }) =>
            `nav-link ${isActive ? 'bg-primary text-white' : 'text-white'} px-3 py-3 rounded`
          }
        >
          <i className="bi bi-tools me-2"></i> Create Staff
        </NavLink>
      </li>
    )}
      </ul>


 <div className="flex-grow-1 d-flex align-items-start justify-content-center mt-4">
    <div className="border-top pt-3 w-100 text-center">
      <LogoutButton />
    </div>
  </div>

    </div>
  );
};

export default Sidebar;
