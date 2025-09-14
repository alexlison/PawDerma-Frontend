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

  const getConsultationTimeStatus = (timeSlot, appointmentDate) => {
    try {
      const now = new Date();
      const today = now.toDateString();
      const appointmentDay = new Date(appointmentDate).toDateString();
      
      if (today !== appointmentDay) {
        return "not-today";
      }
      
      const [startTimeStr, endTimeStr] = timeSlot.split(' - ');
      
      const timeToMinutes = (timeStr) => {
        const [time, modifier] = timeStr.split(' ');
        let [hours, minutes] = time.split(':').map(Number);
        
        if (modifier === 'PM' && hours !== 12) hours += 12;
        if (modifier === 'AM' && hours === 12) hours = 0;
        
        return hours * 60 + minutes;
      };
      
      const startMinutes = timeToMinutes(startTimeStr);
      const endMinutes = timeToMinutes(endTimeStr);
      
      const currentMinutes = now.getHours() * 60 + now.getMinutes();
      
      
      const buffer = 15;
      
      if (currentMinutes < (startMinutes - buffer)) {
        return "before"; 
      } else if (currentMinutes > (endMinutes + buffer)) {
        return "after"; 
      } else {
        return "during"; 
      }
      
    } catch (error) {
      console.error("Error parsing consultation time:", error);
      return "error";
    }
  };

  return (
    <div
      style={{
        height: "calc(100vh - 70px)",
        overflowY: "auto",
        padding: "1.5rem",
      }}
    >
      <h3 className="mb-4 fs-4 text-center mt-3">
        <i className="bi bi-calendar3 me-1"></i> My Appointments
      </h3>

      {Object.keys(appointments).length === 0 ? (
        <p className="text-center">No Appointments Found!</p>
      ) : (
        Object.entries(appointments)
          .sort(([dateA], [dateB]) => new Date(dateB) - new Date(dateA))
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
                      {items.map((value, index) => {
                        const timeStatus = getConsultationTimeStatus(value.time, date);
                        
                        const isCompleted = value.status === "COMPLETED";
                        const isNotCome = value.status === "NOTCOME";
                        const isConfirmed = value.status === "CONFIRMED";
                        
                        return (
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
                                    : value.status === "COMPLETED"
                                    ? "bg-danger"
                                    : value.status === "NOTCOME"
                                    ? "bg-warning text-dark"
                                    : "bg-secondary"
                                }`}
                              >
                                {value.status}
                              </span>
                            </td>
                            <td>
                              {isCompleted ? (
                                //  COMPLETED → only View Prescription button.
                                <button
                                  className="btn btn-outline-success btn-sm"
                                  onClick={() =>
                                    navigate(`/viewPrescription/${value._id}`)
                                  }
                                  title="View Prescription"
                                >
                                  <i className="bi bi-eye-fill"> View</i>
                                </button>
                              ) : isNotCome ? (
                                // NOTCOME → disabled N/A button.
                                <button
                                  className="btn btn-outline-secondary btn-sm"
                                  disabled
                                  title="Not applicable - Patient did not come"
                                >
                                  <i className="bi bi-dash-circle"> N/A</i>
                                </button>
                              ) : isConfirmed && timeStatus === "during" ? (
                                //  CONFIRMED + during consultation → enabled Add Prescription button.
                                <button
                                  className="btn btn-outline-success btn-sm"
                                  onClick={() =>
                                    navigate(`/addPrescription/${value._id}`)
                                  }
                                  title="Add Prescription Now"
                                >
                                  <i className="bi bi-prescription2"> Add</i>
                                </button>
                              ) : isConfirmed && (timeStatus === "before" || timeStatus === "not-today") ? (
                                //  CONFIRMED + before consultation → disabled Wait button.
                                
                                <button
                                  className="btn btn-outline-warning btn-sm"
                                  disabled
                                  title="Consultation not started yet"
                                >
                                  <i className="bi bi-clock"> Wait</i>
                                </button>
                              ) : isConfirmed && timeStatus === "after" ? (
                                //  CONFIRMED + after consultation (but not completed) → disabled N/A button.
                                <button
                                  className="btn btn-outline-secondary btn-sm"
                                  disabled
                                  title="Consultation time has ended"
                                >
                                  <i className="bi bi-x-circle"> Ended</i>
                                </button>
                              ) : (
                                // Default for other statuses
                                <button
                                  className="btn btn-outline-secondary btn-sm"
                                  disabled
                                  title="No action available"
                                >
                                  <i className="bi bi-dash-circle"> N/A</i>
                                </button>
                              )}
                            </td>
                          </tr>
                        );
                      })}
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