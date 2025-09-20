import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const AddPrescription = () => {
  const navigate = useNavigate();
  const { appointmentId } = useParams();
  const [token] = useState(sessionStorage.getItem("token"));
  const [userType] = useState(sessionStorage.getItem("userType"));

  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [input, setInput] = useState({ medicine: "", notes: "", followUpDate: "" });
  const [errors, setErrors] = useState({});

  // Auth check
  useEffect(() => {
    if (!token || userType !== "doctor") {
      alert("Access denied! Only doctors can access this page.");
      navigate("/");
    }
  }, [token, userType, navigate]);

  // Fetch appointment details
  useEffect(() => {
    const fetchAppointment = async () => {
      try {
        const res = await axios.get(
          `http://localhost:4000/appointment-details/${appointmentId}`,
          { headers: { token } }
        );
        setAppointment(res.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        alert("Error fetching appointment details");
        navigate("/doctorPanel/doctorAppointments");
      }
    };
    fetchAppointment();
  }, [appointmentId, token, navigate]);

  const handleChange = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: "" });
  };

  const validate = () => {
    const newErrors = {};
    if (!input.medicine.trim()) newErrors.medicine = "Medicine is required";
    if (!input.notes.trim()) newErrors.notes = "Notes are required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      const res = await axios.post(
        `http://localhost:4000/add-prescription/${appointmentId}`,
        input,
        { headers: { token, "Content-Type": "application/json" } }
      );

      if (res.data.Status === "Success") {
        alert("Prescription added successfully!");
        navigate("/doctorPanel/doctorAppointments");
      } else if(res.data.Status === "AlreadyCompleted")
        {
            alert("Already Added Prescription")
            navigate("/doctorPanel/doctorAppointments");

      }else if(res.data.Status === "Invalid Authentication")
      {
        alert("Invalid Authentication")
        navigate("/")
      }
      else {

        alert("Failed to add prescription. Try again.");
      }
    } catch (err) {
      console.error(err);
      alert("Server error. Please try again.");
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

  // Calculate cat age from date of birth if available
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

  const catAge = calculateAge(appointment.cat.dob);

  return (
    <div className="container-fluid bg-light min-vh-100 py-4">
      <div className="row justify-content-center">
        <div className="col-12 col-lg-10 col-xl-8">
          
          <div className="d-flex justify-content-between align-items-center mb-4 px-3">
            <button
              onClick={() => navigate(-1)}
              className="btn btn-outline-primary btn-sm d-flex  gap-2"
            >
              <i className="bi bi-arrow-left-circle"></i>
              <span className="d-none d-sm-inline">Back to Appointments</span>
              <span className="d-sm-none">Back</span>
            </button>
            
            <div className="text-center">
              <h3 className="text-my-primary mt-5 mb-0">Medical Prescription</h3>
            </div>
            
            <div style={{width: '100px'}}></div> 
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
                      [ {appointment.doctor?.specialization && `${appointment.doctor.specialization}`} ]
                  </p>
                
                </div>
                <div className="col-md-4 text-md-end">
                  <div className="my-color4 text-dark rounded p-2 d-inline-block">
                  
                    <div className="fw-bold fs-7 py-1">TNO: {appointment.App_token}</div>
                    
                  </div>
                    <p className="mb-0 mx-2 mt-2 opacity-75">
                    <i className="bi bi-calendar3 me-1"></i>
                    {new Date(appointment.appointmentDate).toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'numeric', 
                      day: 'numeric' 
                    })}
                    <p><i className="bi bi-clock me-1"></i> {appointment.consultationFrom } - {appointment.consultationTo } </p> 
                 
                  </p>
                </div>
              </div>
            </div>

            <div className="card-body p-0">
              
              <div className="px-4 py-3 pb-5 border-bottom">
                <h6 className="text-my-primary mb-3">
                  <i className="bi bi-heart-pulse me-2"></i>
                  Patient Details
                </h6>
                
                <div className="row align-items-center">
                  <div className="col-md-2 text-center">
                    <div className="d-flex justify-content-center">
                      <img
                        src={appointment.cat.image ? `http://localhost:4000${appointment.cat.image}` : "https://placekitten.com/200/200"}
                        className="img-fluid rounded cat-frame"
                        alt={appointment.cat.name}
                        style={{ maxHeight: '80px', width: 'auto', maxWidth: '80px', objectFit: 'cover' }}
                        onError={(e) => {
                          e.target.src = "https://placekitten.com/200/200";
                        }}
                      />
                    </div>
                  </div>
                  
                  <div className="col-md-4">
                    <div className="row g-1">
                      <div className="col-12">
                        <small className="text-muted">CAT NAME</small>
                        <h6 className="fw-bold text-dark mb-0">{appointment.cat.name}</h6>
                      </div>
                      <div className="col-6">
                        <small className="text-muted">BREED</small>
                        <p className="fw-medium mb-0">{appointment.cat.breed}</p>
                      </div>
                      <div className="col-6">
                        <small className="text-muted">AGE</small>
                        <p className="fw-medium mb-0">{catAge}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="col-md-6">
                    <div className="bg-light rounded px-4 py-4">
                      <small className="text-muted">
                        <i className="bi bi-person me-1"></i>
                        OWNER INFORMATION
                      </small>
                      <p className="fw-bold mb-0">{appointment.owner.fname} {appointment.owner.lname}</p>
                      <p className="mb-0 small">
                        <i className="bi bi-telephone me-1"></i>
                        {appointment.owner.phone}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="px-4 py-3 border-bottom bg-light">
                <div className="d-flex align-items-center">
                  <span className="text-muted me-2">Appointment Type:</span>
                  <span className={`badge status-badge ${isGeneral ? 'my-color6' : 'my-color1'}`}>
                    {appointment.bookingType}
                  </span>
                </div>
              </div>

              {isGeneral && (
                <div className="px-4 py-3 border-bottom">
                  <h6 className="text-my-primary mb-2">
                    <i className="bi bi-clipboard-pulse me-2"></i>
                    Symptoms Presented
                  </h6>
                  <div className="row g-1">
                    {Object.entries(appointment.symptoms).map(([key, val]) => (
                      <div key={key} className="col-2-4" style={{flex: '0 0 auto', width: '20%', maxWidth: '20%'}}>
                        <div className={`p-1 rounded text-center border ${
                          val.toLowerCase() === 'yes' 
                            ? 'border-danger bg-light-danger' 
                            : 'border-success bg-light-success'
                        }`} style={{fontSize: '0.75rem'}}>
                          <div className="text-truncate text-muted mb-1" title={key.replace(/_/g, ' ')}>
                            {key.replace(/_/g, ' ').length > 12 
                              ? key.replace(/_/g, ' ').substring(0, 10) + '...' 
                              : key.replace(/_/g, ' ')
                            }
                          </div>
                          <div className={`fw-bold ${val.toLowerCase() === 'yes' ? 'text-danger' : 'text-success'}`}>
                            {val}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {isSkin && appointment.diseaseImage && (
                <div className="px-4 py-3 border-bottom">
                  <h6 className="text-my-primary mb-2">
                    <i className="bi bi-image-alt me-2"></i>
                    Skin Analysis
                  </h6>
                  <div className="row align-items-center">
                    <div className="col-md-6 mb-2 mb-md-0">
                      <div className="border rounded p-1">
                        <img
                          src={appointment.diseaseImage}
                          alt="Skin condition"
                          className="img-fluid rounded"
                          style={{maxHeight: '150px', width: '100%', objectFit: 'cover'}}
                          onError={(e) => {
                            e.target.src = "https://via.placeholder.com/300x150?text=Image+Not+Found";
                          }}
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="bg-light rounded p-2">
                        <div className="mb-2">
                          <small className="text-muted">PREDICTED CONDITION</small>
                          <div className="fw-bold text-danger">{appointment.predictedDisease}</div>
                        </div>
                        <div>
                          <small className="text-muted">CONFIDENCE: {appointment.confidenceScore}%</small>
                          <div className="progress mt-1" style={{height: '6px'}}>
                            <div 
                              className="progress-bar bg-success" 
                              style={{width: `${appointment.confidenceScore}%`}}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="px-4 py-3 border-top">
                <h6 className="text-my-primary mb-2">
                  <i className="bi bi-prescription2 me-2"></i>
                  Treatment Plan
                </h6>
                
                <div className="row g-2">
                  <div className="col-md-8">
                    <label className="form-label fw-medium small">
                      Medication & Dosage *
                    </label>
                    <input
                      type="text"
                      className={`form-control form-control-sm ${errors.medicine ? "is-invalid" : ""}`}
                      name="medicine"
                      value={input.medicine}
                      onChange={handleChange}
                      placeholder="e.g., Amoxicillin 250mg - 1 tablet twice daily"
                    />
                    {errors.medicine && (
                      <div className="invalid-feedback small">{errors.medicine}</div>
                    )}
                  </div>
                  
                  <div className="col-md-4">
                    <label className="form-label fw-medium small">
                      Follow-up Date
                    </label>
                    <input
                      type="date"
                      className="form-control form-control-sm"
                      name="followUpDate"
                      value={input.followUpDate}
                      onChange={handleChange}
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                  
                  <div className="col-12">
                    <label className="form-label fw-medium small">
                      Treatment Instructions *
                    </label>
                    <textarea
                      className={`form-control form-control-sm ${errors.notes ? "is-invalid" : ""}`}
                      name="notes"
                      value={input.notes}
                      onChange={handleChange}
                      rows="3"
                      placeholder="Enter detailed instructions for the pet owner..."
                    />
                    {errors.notes && (
                      <div className="invalid-feedback small">{errors.notes}</div>
                    )}
                  </div>
                </div>
              </div>

              <div className="px-4 pb-3">
                <div className="d-flex gap-2 justify-content-end">
                  <button 
                    className="my-btn-outline my-btn my-btn-sm"
                    onClick={() => navigate(-1)}
                  >
                    <i className="bi bi-x-circle me-1"></i>
                    Cancel
                  </button>
                  <button 
                    className="my-btn my-btn-sm"
                    onClick={handleSubmit}
                  >
                    <i className="bi bi-check-circle me-1"></i>
                    Submit
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddPrescription;