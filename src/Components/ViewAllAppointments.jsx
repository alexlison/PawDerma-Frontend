import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const ViewAllAppointments = () => {
  const navigate = useNavigate();
  const token = sessionStorage.getItem("token");
  const userType = sessionStorage.getItem("userType");

  const [appointments, setAppointments] = useState({});
  const [filteredAppointments, setFilteredAppointments] = useState({});
  const [doctors, setDoctors] = useState([]);
  const [attenders, setAttenders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    fromDate: "",
    toDate: "",
    doctorName: "",
    bookingType: "",
  });

  // Authentication check
  useEffect(() => {
    if (!token || userType !== "admin") {
      alert("Access denied! Only admin can access this page.");
      navigate("/");
    }
  }, [token, userType, navigate]);

  // Fetch appointments
  const fetchAppointments = () => {
    axios
      .post("http://localhost:4000/viewAllAppointments", {}, { 
        headers: { 
          token: token,
          "Content-Type": "application/json"
        } 
      })
      .then((res) => {
        if (res.data.Status === "Success") {
          setAppointments(res.data.data || {});
          setFilteredAppointments(res.data.data || {});
        } else {
          alert(res.data.Status || "Error fetching appointments");
        }
      })
      .catch((err) => {
        console.error("Error fetching appointments:", err);
      })
      .finally(() => setLoading(false));
  };

  // Fetch doctors for filter dropdown
  const fetchDoctors = () => {
    axios
      .post(
        "http://localhost:4000/viewDoctors",
        {},
        { 
          headers: { 
            token: token, 
            "Content-Type": "application/json" 
          } 
        }
      )
      .then((res) => {
        // Based on your backend code, the response is the array directly
        if (Array.isArray(res.data)) {
          setDoctors(res.data);
        } else {
          console.error("Unexpected response format from viewDoctors:", res.data);
        }
      })
      .catch((err) => {
        console.error("Error fetching doctors:", err);
      });
  };

  // Fetch attenders for filter dropdown
  const fetchAttenders = () => {
    axios
      .post(
        "http://localhost:4000/viewAttenders",
        {},
        { 
          headers: { 
            token: token, 
            "Content-Type": "application/json" 
          } 
        }
      )
      .then((res) => {
        // Based on your backend code, the response is the array directly
        if (Array.isArray(res.data)) {
          setAttenders(res.data);
        } else {
          console.error("Unexpected response format from viewAttenders:", res.data);
        }
      })
      .catch((err) => {
        console.error("Error fetching attenders:", err);
      });
  };

  useEffect(() => {
    fetchAppointments();
    fetchDoctors();
    fetchAttenders();
  }, []);

  const getStatusBadgeClass = (status) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return "bg-danger";
      case "pending":
        return "bg-warning text-dark";
      case "confirmed":
        return "bg-info text-white";
      case "notcome":
        return "bg-warning";
      default:
        return "bg-secondary";
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case "GENERAL":
        return "success";
      case "SKIN":
        return "info";
      case "VACCINATION":
        return "warning";
      default:
        return "secondary";
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case "GENERAL":
        return "fa-stethoscope";
      case "SKIN":
        return "fa-microscope";
      case "VACCINATION":
        return "fa-syringe";
      default:
        return "fa-calendar-check";
    }
  };

  const groupAppointmentsByType = (appointments) => {
    return appointments.reduce((acc, appt) => {
      if (!acc[appt.bookingType]) acc[appt.bookingType] = [];
      acc[appt.bookingType].push(appt);
      return acc;
    }, {});
  };

  // Filter handler
  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const applyFilters = () => {
    const filtered = {};
    Object.entries(appointments).forEach(([date, items]) => {
      let filteredItems = items;

      if (filters.fromDate) {
        filteredItems = filteredItems.filter((a) => new Date(a.appointmentDate) >= new Date(filters.fromDate));
      }
      if (filters.toDate) {
        filteredItems = filteredItems.filter((a) => new Date(a.appointmentDate) <= new Date(filters.toDate));
      }
      if (filters.doctorName) {
        filteredItems = filteredItems.filter(
          (a) =>
            (a.doctorName && a.doctorName.toLowerCase().includes(filters.doctorName.toLowerCase())) ||
            (a.attenderName && a.attenderName.toLowerCase().includes(filters.doctorName.toLowerCase()))
        );
      }
      if (filters.bookingType) {
        filteredItems = filteredItems.filter((a) => a.bookingType === filters.bookingType);
      }

      if (filteredItems.length > 0) filtered[date] = filteredItems;
    });

    setFilteredAppointments(filtered);
  };

  const clearFilters = () => {
    setFilters({
      fromDate: "",
      toDate: "",
      doctorName: "",
      bookingType: "",
    });
    setFilteredAppointments(appointments);
  };

  // Format doctor name based on your Doctors model structure
  const formatDoctorName = (doctor) => {
    if (doctor.fname && doctor.lname) {
      return `${doctor.fname} ${doctor.mname ? doctor.mname + ' ' : ''}${doctor.lname}`;
    }
    return doctor.Name || doctor.name || "Unknown Doctor";
  };

  // Format attender name based on your Attenders model structure
  const formatAttenderName = (attender) => {
    return attender.Name || attender.name || "Unknown Attender";
  };

  if (loading) {
    return (
      <div className="container-fluid px-4 py-4">
        <div className="d-flex justify-content-center align-items-center" style={{ height: "50vh" }}>
          <div className="text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3">Loading appointments...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid px-4 py-4">
      <h4 className="text-center mb-4">
        <i className="fa-solid fa-calendar-days me-2 text-secondary"></i>All Appointments
      </h4>

      {/* Filter Section */}
      <div className="card shadow-sm mb-4">
        <div className="card-header bg-light">
          <h5 className="mb-0">
            <i className="fa-solid fa-filter me-2 text-my-primary"></i>
            Filter Appointments
          </h5>
        </div>
        <div className="card-body">
          <div className="row g-3 align-items-end">
            <div className="col-md-2">
              <label className="form-label">From Date</label>
              <input 
                type="date" 
                name="fromDate" 
                className="form-control" 
                value={filters.fromDate} 
                onChange={handleFilterChange} 
              />
            </div>
            <div className="col-md-2">
              <label className="form-label">To Date</label>
              <input 
                type="date" 
                name="toDate" 
                className="form-control" 
                value={filters.toDate} 
                onChange={handleFilterChange} 
              />
            </div>
            <div className="col-md-3">
              <label className="form-label">Doctor / Attender</label>
              <select 
                name="doctorName" 
                className="form-select" 
                value={filters.doctorName} 
                onChange={handleFilterChange}
              >
                <option value="">All Medical Staff</option>
                {doctors.map((doctor) => (
                  <option key={doctor._id} value={formatDoctorName(doctor)}>
                    Dr. {formatDoctorName(doctor)}
                  </option>
                ))}
                {attenders.map((attender) => (
                  <option key={attender._id} value={formatAttenderName(attender)}>
                    {formatAttenderName(attender)} (Attender)
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-2">
              <label className="form-label">Booking Type</label>
              <select 
                name="bookingType" 
                className="form-select" 
                value={filters.bookingType} 
                onChange={handleFilterChange}
              >
                <option value="">All Types</option>
                <option value="GENERAL">GENERAL</option>
                <option value="SKIN">SKIN</option>
                <option value="VACCINATION">VACCINATION</option>
              </select>
            </div>
            <div className="col-md-3">
              <button className="btn my-btn me-2" onClick={applyFilters}>
                <i className="fa-solid fa-magnifying-glass me-1"></i> Search
              </button>
              <button className="btn btn-outline-success" onClick={clearFilters}>
                <i className="fa-solid fa-rotate me-1"></i> Clear
              </button>
            </div>
          </div>
        </div>
      </div>

      {Object.keys(filteredAppointments).length === 0 ? (
        <div className="text-center py-5">
          <i className="fa-solid fa-calendar-xmark display-1 text-muted mb-3"></i>
          <h4 className="text-muted">No Appointments Found!</h4>
          <p className="text-muted">Try adjusting your filters or check back later.</p>
        </div>
      ) : (
        Object.entries(filteredAppointments)
          .sort(([dateA], [dateB]) => new Date(dateB) - new Date(dateA))
          .map(([date, items]) => {
            const groupedByType = groupAppointmentsByType(items);

            return (
              <div key={date} className="mb-5">
                {/* Date Header */}
                <div className="mb-3">
                  <div className="bg-light p-3 rounded shadow my-4  border-start border-5 border-danger">
                    <h5 className="mb-0 fw-bold text-dark">
                      <i className="fa-solid fa-calendar me-2"></i>
                      {new Date(date).toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                      <span className="badge border border-2 text-dark ms-3">Total - {items.length}</span>
                    </h5>
                  </div>
                </div>

                {/* Appointment Cards */}
                <div className="row g-4">
                  {Object.entries(groupedByType).map(([type, typeAppointments]) => (
                    <div key={type} className="col-12">
                      <div className="card border-0 shadow-sm">
                        <div className={`card-header bg-${getTypeColor(type)} text-white`}>
                          <h6 className="mb-0 fw-bold">
                            <i className={`fa-solid ${getTypeIcon(type)} me-2`}></i>
                            {type} APPOINTMENTS
                            <span className="badge bg-light text-dark ms-3"> Total - {typeAppointments.length}</span>
                          </h6>
                        </div>
                        <div className="card-body p-0">
                          {typeAppointments.map((appt, index) => (
                            <div
                              key={appt.appointmentId || index}
                              className={`row align-items-center py-3 px-3 ${
                                index !== typeAppointments.length - 1 ? "border-bottom" : ""
                              }`}
                            >
                              {/* Time */}
                              <div className="col-md-2 mb-2 mb-md-0">
                                <div className="text-dark">
                                  <i className="fa-solid fa-clock me-2 text-secondary"></i>
                                  {appt.time}
                                </div>
                              </div>

                              {/* Pet Info */}
                              <div className="col-md-2 mb-2 mb-md-0">
                                <div className="d-flex align-items-center">
                                  <i className="fa-solid fa-paw text-secondary me-2"></i>
                                  <div>
                                    <div className="fw-semibold">{appt.catName}</div>
                                    <small className="text-muted">{appt.breed}</small>
                                  </div>
                                </div>
                              </div>

                              {/* Owner Info */}
                              <div className="col-md-2 mb-2 mb-md-0">
                                <div>
                                  <div className="fw-semibold">{appt.ownerName}</div>
                                  <small className="text-muted">
                                    <i className="fa-solid fa-phone me-1"></i>
                                    {appt.phone}
                                  </small>
                                </div>
                              </div>

                              {/* Professional Info */}
                              <div className="col-md-3 mb-2 mb-md-0">
                                {type === "VACCINATION" ? (
                                  <div className="d-flex align-items-center">
                                    <i className="fa-solid fa-user-nurse text-success me-2"></i>
                                    <div>
                                      <div className="fw-semibold text-dark fw-bold" style={{ fontSize: "0.9rem" }}> Att. {appt.attenderName}</div>
                                      <small className="text-muted">{appt.attenderQualification}</small>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="d-flex align-items-center">
                                    <i className="fa-solid fa-user-doctor text-info me-2"></i>
                                    <div>
                                      <div className="fw-semibold text-dark fw-bold" style={{ fontSize: "0.9rem" }}>Dr. {appt.doctorName}</div>
                                      <small className="text-muted">{appt.specialization}</small>
                                    </div>
                                  </div>
                                )}
                              </div>

                              {/* Status */}
                              <div className="col-md-1 mb-2 mb-md-0 text-center">
                                <span className={`badge ${getStatusBadgeClass(appt.status)} fs-7 px-2 py-2`} style={{ fontSize: "0.75rem"}}>
                                  {appt.status}
                                </span>
                              </div>

                              {/* Extra Info */}
                              <div className="col-md-2 text-center">
                                {type === "VACCINATION" && (
                                  <span className="badge my-color4 text-white fs-7 mx-3 px-3 py-2">
                                    <i className="fa-solid fa-syringe me-1"></i>
                                    {appt.vaccine}
                                  </span>
                                )}
                                {type === "SKIN" && appt.skinAnalysis && (
                                  <span className="badge bg-warning text-dark fs-7 px-3 py-2">
                                    <i className="fa-solid fa-percentage me-1"></i>
                                    {appt.skinAnalysis.confidenceScore ?? "N/A"}% Confidence
                                  </span>
                                )}
                                {type === "GENERAL" && (
                                  <span className="badge my-color6 text-white fs-7 px-3 py-2">
                                    <i className="fa-solid fa-stethoscope me-1"></i>
                                    General
                                  </span>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })
      )}
    </div>
  );
};

export default ViewAllAppointments;