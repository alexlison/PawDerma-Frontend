import React, { useEffect, useState } from "react";
import { Link, useNavigate, Outlet } from "react-router-dom";

const AdminPanel = () => {
  const navigate = useNavigate();

  const [token, changeToken] = useState(sessionStorage.getItem("token"));
  const [userType, changeUserType] = useState(sessionStorage.getItem("userType"));

console.log("token -->",token)

  useEffect(() => {
    if (!token || userType !== "admin") {
      alert("Access denied! Only admins can access this page.");
      navigate("/");
    }
  }, [token, userType, navigate]);

  const logout = () => {
    sessionStorage.clear();
    navigate("/");
  };

  const [activePage, setActivePage] = useState("");

  return (
    <div
      className="container-fluid"
      style={{ userSelect: "none" }}
      onCopy={(e) => e.preventDefault()}
      onCut={(e) => e.preventDefault()}
      onPaste={(e) => e.preventDefault()}
    >
      <div className="row">
        <div className="col-12 col-lg-2 p-0">
          <div
            className="collapse d-lg-flex flex-column p-3 min-vh-100 my-sidebar-bg"
            id="sidebarMenu"
          >
            <div className="text-center mb-4">
              <span className="badge admin-box fs-6 px-4 py-3 rounded">
                <i className="fa fa-cogs"></i> Admin Panel
              </span>
            </div>

            <ul className="nav nav-pills flex-column mt-3 mb-auto gap-2">
              <li
                className={`my-sidebarhr ${
                  activePage === "dashboard" ? "selected" : ""
                }`}
                onClick={() => setActivePage("dashboard")}
              >
                <Link to="dashboard" className="btn nav-link text-dark text-start">
                  <i className="bi bi-speedometer2 me-2"></i> Dashboard
                </Link>
              </li>
              <li
                className={`my-sidebarhr ${
                  activePage === "cats" ? "selected" : ""
                }`}
                onClick={() => setActivePage("cats")}
              >
                <Link to="cats" className="btn nav-link text-dark text-start">
                  <i className="fa-solid fa-cat me-2"></i> Cats
                </Link>
              </li>
              <li
                className={`my-sidebarhr ${
                  activePage === "catowners" ? "selected" : ""
                }`}
                onClick={() => setActivePage("catowners")}
              >
                <Link to="catowners" className="btn nav-link text-dark text-start">
                  <i className="bi bi-people me-2"></i> Catowners
                </Link>
              </li>
              <li
                className={`my-sidebarhr ${
                  activePage === "doctors" ? "selected" : ""
                }`}
                onClick={() => setActivePage("doctors")}
              >
                <Link to="doctors" className="btn nav-link text-dark text-start">
                  <i className="bi bi-heart-pulse me-2"></i> Doctors
                </Link>
              </li>
              <li
                className={`my-sidebarhr ${
                  activePage === "attenders" ? "selected" : ""
                }`}
                onClick={() => setActivePage("attenders")}
              >
                <Link to="attenders" className="btn nav-link text-dark text-start">
                  <i className="bi bi-person-badge me-2"></i> Attenders
                </Link>
              </li>
              <li
                className={`my-sidebarhr ${
                  activePage === "appointments" ? "selected" : ""
                }`}
                onClick={() => setActivePage("appointments")}
              >
                <Link to="appointments" className="btn nav-link text-dark text-start">
                  <i className="bi bi-calendar-check me-2"></i> Appointments
                </Link>
              </li>
              <li
                className={`my-sidebarhr ${
                  activePage === "sales" ? "selected" : ""
                }`}
                onClick={() => setActivePage("sales")}
              >
                <Link to="sales" className="btn nav-link text-dark text-start">
                  <i className="bi bi-bar-chart-line me-2"></i> Sales Report
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="col p-0">
          <nav className="navbar px-3 py-3 shadow-sm my-navbar">
            <div className="container-fluid d-flex justify-content-between align-items-center">
              <button
                className="btn d-lg-none"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#sidebarMenu"
              >
                <i className="bi bi-list fs-3"></i>
              </button>

              <h5 className="m-0 fw-bold text-dark">
                <i className="fa-solid fa-paw me-2"></i> PawDerma
              </h5>
              <button to="/logout" className="my-btn" onClick={logout}>
                <i className="bi bi-box-arrow-right me-1"></i> Logout
              </button>
            </div>
          </nav>

          <div className="p-4 pl-5">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
