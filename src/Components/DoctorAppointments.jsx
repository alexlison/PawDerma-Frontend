import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const DoctorAppointments = () => {
  const navigate = useNavigate();

  const [token] = useState(sessionStorage.getItem("token"));
  const [userType] = useState(sessionStorage.getItem("userType"));
  const [userId] = useState(sessionStorage.getItem("userId"));

  const [appointments, setAppointments] = useState({});

  useEffect(() => {
    if (!token || userType !== "doctor") {
      alert("Access denied! Only doctors can access this page.");
      navigate("/");
    }
  }, [token, userType, navigate]);

  const fetchData = () => {
    axios
      .post(
        "http://localhost:4000/doctorAppointments",
        { doctorId: userId },
        { headers: { token: token, "Content-Type": "application/json" } }
      )
      .then((response) => {
        if (response.data.Status === "Invalid Authentication") {
          alert("Invalid Authentication !");
          navigate("/");
        } else if (response.data.Status === "Error") {
          alert("Error in Fetching Appointment Details !");
        } else {
          setAppointments(response.data.data || {});
        }
      })
      .catch((error) => {
        console.log("Error --> ", error);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div style={{ maxHeight: "calc(100vh - 100px)", overflowY: "auto" }}>
      <h3 className="mb-4 fs-4 text-center mt-3">
        <i className="bi bi-calendar3 me-1"></i> My Appointments
      </h3>

      {Object.keys(appointments).length === 0 ? (
        <p className="text-center">No Appointments Found!</p>
      ) : (
        Object.entries(appointments)
          .sort(([dateA], [dateB]) => new Date(dateB) - new Date(dateA)) // sort descending
          .map(([date, items]) => (
            <div key={date} className="mb-4">
              <div className="card shadow-sm border-0">
                <div className="card-header my-color8 fw-bold">
                  <i className="bi bi-calendar3 me-2"></i> {date}
                </div>

                <div className="table-responsive">
                  <table className="table my-table table-borderless table-striped align-middle text-center mb-0">
                    <thead className="table-light">
                      <tr>
                        <th>Sl.No</th>
                        <th>Cat Name</th>
                        <th>Breed</th>
                        <th>Owner Name</th>
                        <th>Phone</th>
                        <th>Time</th>
                        <th>Token</th>
                        <th>Booking Type</th>
                        <th>Status</th>
                        <th>Prescription</th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.map((value, index) => (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>{value.catName}</td>
                          <td>{value.breed}</td>
                          <td>{value.catOwnerName}</td>
                          <td>{value.phone}</td>
                          <td>{value.time}</td>
                          <td>
                            <span className="badge my-color4">
                              TN: {value.token}
                            </span>
                          </td>
                          <td>
                            <span
                              className={`badge ${
                                value.bookingType === "GENERAL"
                                  ? "my-color2"
                                  : value.bookingType === "SKIN"
                                  ? "bg-warning text-dark"
                                  : value.bookingType === "VACCINATION"
                                  ? "bg-info text-dark"
                                  : "bg-secondary"
                              }`}
                            >
                              {value.bookingType}
                            </span>
                          </td>
                          <td>
                            <span
                              className={`badge ${
                                value.status === "CONFIRMED"
                                  ? "bg-success"
                                  : "bg-secondary"
                              }`}
                            >
                              {value.status}
                            </span>
                          </td>
                          <td>
                            <button
                              className="btn btn-outline-secondary btn-sm"
                              onClick={() =>
                                navigate(`/addPrescription/${value._id}`)
                              }
                              title="Add Prescription"
                            >
                              <i className="bi bi-prescription2 fs-7"> Add</i>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ))
      )}
    </div>
  );
};

export default DoctorAppointments;
