import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const ViewPrescription = () => {
  const navigate = useNavigate();
  const { appointmentId } = useParams();
  const [token] = useState(sessionStorage.getItem("token"));
  const [userType] = useState(sessionStorage.getItem("userType"));

  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token || userType !== "doctor") {
      alert("Access denied! Only doctors can access this page.");
      navigate("/");
    } else {
      fetchData();
    }
  }, [token, userType]);

  const fetchData = async () => {
    try {
      const res = await axios.post(
        `http://localhost:4000/viewPrescription`,
        { appointment_id: appointmentId },
        { headers: { token, "Content-Type": "application/json" } }
      );

      if (res.data.Status === "PrescriptionNotFound") {
        alert("Prescription Not Found");
        navigate("/doctorPanel/doctorAppointments");
        return;
      }

      if (res.data.Status === "Invalid Authentication") {
        alert("Invalid Authentication!");
        navigate("/");
        return;
      }

      if (res.data.Status === "Error") {
        alert("Error Fetching Prescription Info!");
        navigate("/doctorPanel/doctorAppointments");
        return;
      }

      setAppointment(res.data);
    } catch (err) {
      console.error(err);
      alert("Server error. Please try again.");
      navigate("/doctorPanel/doctorAppointments");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!appointment) return null;

  const isGeneral = appointment.bookingType === "GENERAL";
  const isSkin = appointment.bookingType === "SKIN";

  const calculateAge = (dob) => {
    if (!dob) return "N/A";
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age > 0 ? `${age} years` : "Less than 1 year";
  };
  const catAge = calculateAge(appointment.cat?.dob);

  return (
    <div className="container-fluid bg-light min-vh-100 py-4">
      <div className="row justify-content-center">
        <div className="col-12 col-lg-10 col-xl-8">

          <div className="d-flex justify-content-between align-items-center mb-4 px-3">
            <button
              onClick={() => navigate(-1)}
              className="btn btn-outline-danger btn-sm d-flex gap-2"
            >
              <i className="bi bi-arrow-left-circle"></i> Back
            </button>
            <h3 className="text-my-primary">Medical Prescription</h3>
            <div style={{ width: "100px" }}></div>
          </div>

          <div className="card border-0 shadow-lg prescription-card">
            <div className="card-header border-0 px-4 py-4 my-colorlight">
              <div className="row align-items-center text-white">
                <div className="col-md-8">
                  <h4 className="mb-1 fw-bold">
                    <i className="bi bi-person-badge me-2"></i>
                    Dr. {appointment.doctor?.fname} {appointment.doctor?.lname} ({appointment.doctor?.qualification})
                  </h4>
                  <p className="mb-0 mx-4 opacity-75">
                    [{appointment.doctor?.specialization}]
                  </p>
                </div>
                <div className="col-md-4 text-md-end">
                  <div className="my-color4 text-dark rounded p-2 d-inline-block mb-2">
                    <div className="fw-bold fs-7 py-1">TNO: {appointment.App_token}</div>
                  </div>
                  <div className="opacity-75">
                    <div>
                      <i className="bi bi-calendar3 me-1"></i>
                      {new Date(appointment.appointmentDate).toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "numeric",
                        day: "numeric",
                      })}
                    </div>
                    <div>
                      <i className="bi bi-clock me-1"></i> {appointment.consultationFrom} - {appointment.consultationTo}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="card-body p-0">
              <div className="px-4 py-3 pb-5 border-bottom">
                <h6 className="text-my-primary mb-3">
                  <i className="bi bi-heart-pulse me-2"></i> Patient Details
                </h6>
                <div className="row align-items-center">
                  <div className="col-md-2 text-center">
                    <img
                      src={appointment.cat?.image ? `http://localhost:4000${appointment.cat.image}` : "https://placekitten.com/200/200"}
                      className="img-fluid rounded cat-frame"
                      alt={appointment.cat?.name}
                      style={{ maxHeight: "80px", width: "auto", maxWidth: "80px", objectFit: "cover" }}
                    />
                  </div>
                  <div className="col-md-4">
                    <small className="text-muted">CAT NAME</small>
                    <h6 className="fw-bold text-dark mb-1">{appointment.cat?.name}</h6>
                    <small className="text-muted">BREED</small>
                    <p className="fw-medium mb-1">{appointment.cat?.breed}</p>
                    <small className="text-muted">AGE</small>
                    <p className="fw-medium mb-0">{catAge}</p>
                  </div>
                  <div className="col-md-6">
                    <div className="bg-light rounded px-4 py-4">
                      <small className="text-muted"><i className="bi bi-person me-1"></i> OWNER INFORMATION</small>
                      <p className="fw-bold mb-0">{appointment.owner?.fname} {appointment.owner?.lname}</p>
                      <p className="mb-0 small"><i className="bi bi-telephone me-1"></i> {appointment.owner?.phone}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="px-4 py-3 border-bottom bg-light">
                <span className="text-muted me-2">Appointment Type:</span>
                <span className={`badge status-badge ${isGeneral ? "my-color6" : "my-color1"}`}>
                  {appointment.bookingType}
                </span>
              </div>

              {isGeneral && appointment.symptoms && (
                <div className="px-4 py-3 border-bottom">
                  <h6 className="text-my-primary mb-2">
                    <i className="bi bi-clipboard-pulse me-2"></i> Symptoms Presented
                  </h6>
                  <div className="row g-1">
                    {Object.entries(appointment.symptoms).map(([key, val]) => (
                      <div key={key} className="col-6 col-md-2 mb-2">
                        <div className={`p-2 rounded text-center border ${val.toLowerCase() === "yes" ? "border-danger bg-light-danger" : "border-success bg-light-success"}`}>
                          <div className="fw-bold text-truncate">{key.replace(/_/g, " ")}</div>
                          <div className={`fw-bold ${val.toLowerCase() === "yes" ? "text-danger" : "text-success"}`}>{val}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {isSkin && appointment.skinAnalysis?.diseaseImage && (
                <div className="px-4 py-3 border-bottom">
                  <h6 className="text-my-primary mb-2"><i className="bi bi-image-alt me-2"></i> Skin Analysis</h6>
                  <div className="row align-items-center">
                    <div className="col-md-6 mb-2 mb-md-0">
                      <img
                        src={`http://localhost:4000${appointment.skinAnalysis.diseaseImage}`}
                        alt="Skin condition"
                        className="img-fluid rounded"
                        style={{ maxHeight: "150px", width: "100%", objectFit: "cover" }}
                      />
                    </div>
                    <div className="col-md-6">
                      <small className="text-muted">PREDICTED CONDITION</small>
                      <p className="fw-bold text-danger">{appointment.skinAnalysis.predictedDisease}</p>
                      <small className="text-muted">CONFIDENCE: {appointment.skinAnalysis.confidenceScore}%</small>
                      <div className="progress mt-1" style={{ height: "6px" }}>
                        <div className="progress-bar bg-success" style={{ width: `${appointment.skinAnalysis.confidenceScore}%` }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {appointment.prescription && (
                <div className="px-4 py-3 my-3 border-top">
                  <h6 className="text-my-primary mb-2 fs-4 py-3">
                    <i className="bi bi-prescription2 me-2 fs-4 "></i> Prescription
                  </h6>
                  <p><strong>Medicine & Dosage:</strong> {appointment.prescription.medicine}</p>
                  <p><strong>Notes:</strong> {appointment.prescription.notes}</p>
                  {appointment.prescription.followUpDate && (
                    <p><strong>Follow-up Date:</strong> {new Date(appointment.prescription.followUpDate).toLocaleDateString("en-GB")}</p>
                  )}
                </div>
              )}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewPrescription;
