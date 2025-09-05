import React, { useEffect, useState } from "react";
import { Link, useNavigate, Outlet } from "react-router-dom";

const DoctorPanel = () => {
  const navigate = useNavigate();

  const [token, changeToken] = useState(sessionStorage.getItem("token"));
  const [userType, changeUserType] = useState(sessionStorage.getItem("userType"));

  console.log("token -->", token);

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
            <div className="text-center mb-3">
              <span className="badge admin-box fs-6 px-4 py-3 rounded">
                <i className="fa fa-stethoscope px-1"> </i>  Doctor Panel
              </span>
            </div>

            <ul className="nav nav-pills flex-column mt-2 mb-auto gap-2">
              <li
                className={`my-sidebarhr ${
                  activePage === "doctorDashboard" ? "selected" : ""
                }`}
                onClick={() => setActivePage("doctorDashboard")}
              >
                <Link to="doctorDashboard" className="btn nav-link text-dark text-start">
                  <i className="bi bi-speedometer2 me-2"></i> Dashboard
                </Link>
              </li>
              <li
                className={`my-sidebarhr ${
                  activePage === "doctorProfile" ? "selected" : ""
                }`}
                onClick={() => setActivePage("doctorProfile")}
              >
                <Link to="doctorProfile" className="btn nav-link text-dark text-start">
                  <i className="fa-solid fa-user me-2 text-secondary"></i> My Profile
                </Link>
              </li>
              <li
                className={`my-sidebarhr ${
                  activePage === "scheduleSlots" ? "selected" : ""
                }`}
                onClick={() => setActivePage("scheduleSlots")}
              >
                <Link to="scheduleSlots" className="btn nav-link text-dark text-start">
                  <i className="fa fa-calendar-days me-2 text-secondary"></i> Schedule Slots
                </Link>
              </li>
              <li
                className={`my-sidebarhr ${
                  activePage === "doctorAppointments" ? "selected" : ""
                }`}
                onClick={() => setActivePage("doctorAppointments")}
              >
                <Link to="doctorAppointments" className="btn nav-link text-dark text-start">
                  <i className="bi bi-heart-pulse me-2"></i> Appointments
                </Link>
              </li>
              <li
                className={`my-sidebarhr ${
                  activePage === "patientRecords" ? "selected" : ""
                }`}
                onClick={() => setActivePage("patientRecords")}
              >
                <Link to="patientRecords" className="btn nav-link text-dark text-start">
                  <i className="bi bi-file-medical me-2"></i> Patient Records
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

export default DoctorPanel;