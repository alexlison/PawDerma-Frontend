import React, { useEffect, useState } from "react";
import { Link, useNavigate, Outlet } from "react-router-dom";

const DoctorPanel = () => {
  const navigate = useNavigate();

  const [token] = useState(sessionStorage.getItem("token"));
  const [userType] = useState(sessionStorage.getItem("userType"));
  const [activePage, setActivePage] = useState("");

  console.log("Token -->",token)
  useEffect(() => {
    if (!token || userType !== "doctor") {
      alert("Access denied! Only Doctors can access this page.");
      navigate("/");
    }
  }, [token, userType, navigate]);

  const logout = () => {
    sessionStorage.clear();
    navigate("/");
  };

  return (
    <div
      className="container-fluid p-0"
      style={{
        height: "100vh",
        overflow: "hidden",
      }}
    >
      <div className="row g-0 h-100">
        {/* Sidebar - visible on desktop, offcanvas on mobile */}
        <div
          className="col-lg-2 d-none d-lg-block p-0 my-sidebar-bg"
          style={{
            height: "100vh",
            position: "fixed",
            top: 0,
            left: 0,
            overflowY: "auto",
          }}
        >
          <Sidebar activePage={activePage} setActivePage={setActivePage} />
        </div>

        {/* Offcanvas for mobile sidebar */}
        <div
          className="offcanvas offcanvas-start my-sidebar-bg"
          tabIndex="-1"
          id="sidebarMenu"
        >
          <div className="offcanvas-body p-0">
            <Sidebar activePage={activePage} setActivePage={setActivePage} />
          </div>
        </div>

        {/* Main Content */}
        <div className="col offset-lg-2 d-flex flex-column" style={{ height: "100vh" }}>
          <nav
            className="navbar px-3 py-3 shadow-sm my-navbar"
            style={{ flexShrink: 0 }}
          >
            <div className="container-fluid d-flex justify-content-between align-items-center">
              <button
                className="btn d-lg-none"
                type="button"
                data-bs-toggle="offcanvas"
                data-bs-target="#sidebarMenu"
              >
                <i className="bi bi-list fs-3"></i>
              </button>

              <h5 className="m-0 fw-bold text-dark">
                <i className="fa-solid fa-paw me-2"></i> PawDerma
              </h5>
              <button className="my-btn" onClick={logout}>
                <i className="bi bi-box-arrow-right me-1"></i> Logout
              </button>
            </div>
          </nav>

          <div
            className="flex-grow-1 overflow-auto p-4"
            style={{ backgroundColor: "#f8f9fa" }}
          >
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

const Sidebar = ({ activePage, setActivePage }) => (
  <div className="d-flex flex-column p-3">
    <div className="text-center mb-3">
      <span className="badge admin-box fs-6 px-4 py-3 rounded">
        <i className="fa fa-stethoscope px-1"></i> Doctor Panel
      </span>
    </div>

    <ul className="nav nav-pills flex-column mt-2 mb-auto gap-2">
      <li
        className={`my-sidebarhr ${activePage === "doctorDashboard" ? "selected" : ""}`}
        onClick={() => setActivePage("doctorDashboard")}
      >
        <Link to="doctorDashboard" className="btn nav-link text-dark text-start">
          <i className="bi bi-speedometer2 me-2"></i> Dashboard
        </Link>
      </li>
      <li
        className={`my-sidebarhr ${activePage === "doctorProfile" ? "selected" : ""}`}
        onClick={() => setActivePage("doctorProfile")}
      >
        <Link to="doctorProfile" className="btn nav-link text-dark text-start">
          <i className="fa-solid fa-user me-2 text-secondary"></i> My Profile
        </Link>
      </li>
      <li
        className={`my-sidebarhr ${activePage === "viewSchedules" ? "selected" : ""}`}
        onClick={() => setActivePage("viewSchedules")}
      >
        <Link to="viewSchedules" className="btn nav-link text-dark text-start">
          <i className="fa fa-calendar-days me-2 text-secondary"></i> Schedule Slots
        </Link>
      </li>
      <li
        className={`my-sidebarhr ${activePage === "doctorAppointments" ? "selected" : ""}`}
        onClick={() => setActivePage("doctorAppointments")}
      >
        <Link to="doctorAppointments" className="btn nav-link text-dark text-start">
          <i className="bi bi-calendar3 me-2"></i> Appointments
        </Link>
      </li>
      <li
        className={`my-sidebarhr ${activePage === "medicalRecords" ? "selected" : ""}`}
        onClick={() => setActivePage("medicalRecords")}
      >
        <Link to="medicalRecords" className="btn nav-link text-dark text-start">
          <i className="bi bi-file-medical me-2"></i> Patient Records
        </Link>
      </li>
    </ul>
  </div>
);

export default DoctorPanel;
