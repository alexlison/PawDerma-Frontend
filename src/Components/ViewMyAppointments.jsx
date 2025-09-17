import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ViewMyAppointments = () => {
  const [token] = useState(sessionStorage.getItem("token"));
  const [userType] = useState(sessionStorage.getItem("userType"));
  const [userId] = useState(sessionStorage.getItem("userId"));
  const navigate = useNavigate();

  const [appointmentData, setAppointmentData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token || userType !== "cat_owner") {
      navigate("/");
    } else {
      fetchData();
    }
  }, [token, userType]);

  const fetchData = async () => {
    try {
      const res = await axios.post(
        "http://localhost:4000/viewMyAppointments",
        { catOwner_id: userId },
        { headers: { token, "Content-Type": "application/json" } }
      );

      if (res.data.Status === "NoAppointments") {
        alert("No appointments found.");
      } else if (res.data.Status === "Invalid Authentication") {
        alert("Invalid Authentication");
        navigate("/");
      } else if (res.data.Status === "Error") {
        alert("Error fetching appointments");
      } else {
        setAppointmentData(res.data);
      }
    } catch (err) {
      console.error(err);
      alert("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

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

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <h3 className="text-center mb-4 pb-2 pt-2 fs-4">My Appointments</h3>

      {appointmentData.length === 0 && (
        <p className="text-center">No appointments found.</p>
      )}

      {appointmentData.map((appt) => {
        const catAge = calculateAge(appt.cat?.dob);

        return (
          <div key={appt.appointmentId} className="card border-2 border-opacity-50 shadow-sm p-4 mb-4"  style={{ borderStyle: "dashed" }} >
            <div className="row g-3">
              <div className="col-12 col-md-6 col-lg-3">
                <div className="card h-100 p-2 border border-info">
                  <div className="d-flex align-items-center">
                    <img
                      src={
                        appt.cat?.image
                          ? `http://localhost:4000${appt.cat.image}`
                          : "https://placekitten.com/200/200"
                      }
                      alt={appt.cat?.name}
                      className="rounded me-3 m-3 "
                      style={{ width: "80px", height: "70px", objectFit: "cover" }}
                    />
                    <div>
                      <h6 className="mb-1">{appt.cat?.name}</h6>
                      <p className="mb-0 small">Breed: {appt.cat?.breed}</p>
                      <p className="mb-0 small">Age: {catAge}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-12 col-md-6 col-lg-3">
                <div className="card h-100 p-3 border border-warning">
                  <p className="mb-1 small">
                    <strong>Doctor:</strong> Dr. {appt.doctor?.fname} {appt.doctor?.lname}
                  </p>
                  <p className="mb-1 small">
                    <strong>Qualification:</strong> {appt.doctor?.qualification}
                  </p>
                  <p className="mb-0 small">
                    <strong>Specialization:</strong> {appt.doctor?.specialization}
                  </p>
                </div>
              </div>

              <div className="col-12 col-md-6 col-lg-3">
                <div className="card h-100 p-3 border border-info">
                  <p className="mb-1 small">
                    <strong>Date:</strong>{" "}
                    {new Date(appt.appointmentDate).toLocaleDateString()}
                  </p>
                  <p className="mb-0 small">
                    <strong>Time:</strong> {appt.consultationFrom} - {appt.consultationTo}
                  </p>
                </div>
              </div>

              <div className="col-12 col-md-6 col-lg-3">
                <div className="card h-100 p-2 border border-warning d-flex justify-content-center align-items-center">
                  {appt.status === "CONFIRMED" && (
                    <span className="badge my-color6 bi bi-check-circle text-light"> <span className="mx-1" >Confirmed</span> </span>
                  )}
                  {appt.status === "COMPLETED" && (
                    <button className="btn btn-success btn-sm">
                      <i className="fa fa-download me-1"></i> Receipt
                    </button>
                  )}
                  {appt.status === "NOTCOME" && (
                    <span className="badge bg-danger">Not Come</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ViewMyAppointments;
