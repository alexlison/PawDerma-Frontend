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

  // Helper to convert date + time to milliseconds
  const getTimeMs = (dateStr, timeStr) => {
    const [time, modifier] = timeStr.split(" ");
    let [hours, minutes] = time.split(":").map(Number);
    if (modifier === "PM" && hours !== 12) hours += 12;
    if (modifier === "AM" && hours === 12) hours = 0;
    const dt = new Date(dateStr);
    dt.setHours(hours, minutes, 0, 0);
    return dt.getTime();
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
          .map(([date, items]) => {
            const filteredItems = items.filter(
              (value) => value.bookingType !== "VACCINATION"
            );

            if (filteredItems.length === 0) return null;

            return (
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
                        {filteredItems.map((value, index) => {
                          const isCompleted = value.status === "COMPLETED";
                          const isNotCome = value.status === "NOTCOME";
                          const isConfirmed = value.status === "CONFIRMED";

                          const [startTimeStr, endTimeStr] = value.time.split(
                            " - "
                          );
                          const startTimeMs = getTimeMs(date, startTimeStr);
                          const endTimeMs = getTimeMs(date, endTimeStr);
                          const nowMs = new Date().getTime();

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
                                  <button
                                    className="btn btn-outline-secondary btn-sm"
                                    disabled
                                    title="Not applicable - Patient did not come"
                                  >
                                    <i className="bi bi-dash-circle"> N/A</i>
                                  </button>
                                ) : isConfirmed ? (
                                  nowMs < startTimeMs ? (
                                    <button
                                      className="btn btn-outline-warning btn-sm"
                                      disabled
                                      title="Consultation not started yet"
                                    >
                                      <i className="bi bi-clock"> Wait</i>
                                    </button>
                                  ) : nowMs > endTimeMs ? (
                                    <button
                                      className="btn btn-outline-secondary btn-sm"
                                      disabled
                                      title="Consultation time has ended"
                                    >
                                      <i className="bi bi-x-circle"> Ended</i>
                                    </button>
                                  ) : (
                                    <button
                                      className="btn btn-outline-success btn-sm"
                                      onClick={() =>
                                        navigate(`/addPrescription/${value._id}`)
                                      }
                                      title="Add Prescription Now"
                                    >
                                      <i className="bi bi-prescription2"> Add</i>
                                    </button>
                                  )
                                ) : (
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
            );
          })
      )}
    </div>
  );
};

export default DoctorAppointments;
