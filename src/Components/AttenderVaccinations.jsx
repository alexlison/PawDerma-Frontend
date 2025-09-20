import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AttenderVaccinations = () => {
  const navigate = useNavigate();

  const [token] = useState(sessionStorage.getItem("token"));
  const [userType] = useState(sessionStorage.getItem("userType"));
  const [userId] = useState(sessionStorage.getItem("userId"));

  const [appointments, setAppointments] = useState({});

  useEffect(() => {
    if (!token || userType !== "attender") {
      alert("Access denied! Only attender can access this page.");
      navigate("/");
    }
  }, [token, userType, navigate]);

  const fetchData = () => {
    axios
      .post(
        "http://localhost:4000/VaccinationsView",
        { attenderId: userId },
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

  const markAsCompleted = async (appointmentId, dateKey) => {
    try {
      const res = await axios.post(
        `http://localhost:4000/vaccinationStatusUpdate/${appointmentId}`,
        {},
        { headers: { token: token, "Content-Type": "application/json" } }
      );

      if (res.data.Status === "Success") {
        setAppointments((prev) => {
          const updated = { ...prev };
          updated[dateKey] = updated[dateKey].map((item) =>
            item._id === appointmentId ? { ...item, status: "COMPLETED" } : item
          );
          return updated;
        });
      } else {
        alert("Failed to update vaccination status!");
      }
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

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
        <i className="bi bi-calendar3 fs-5 me-1"></i> My  Appointments
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
                        <th>Status</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.map((value, index) => {
                        const isCompleted = value.status === "COMPLETED";
                        const isNotCome = value.status === "NOTCOME";
                        const isConfirmed = value.status === "CONFIRMED";

                        const [startTimeStr, endTimeStr] = value.time.split(" - ");
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
                                  disabled
                                >
                                  <i className="bi bi-check-circle-fill"> Completed</i>
                                </button>
                              ) : isNotCome ? (
                                <button
                                  className="btn btn-outline-secondary btn-sm"
                                  disabled
                                >
                                  <i className="bi bi-dash-circle"> N/A</i>
                                </button>
                              ) : isConfirmed ? (
                                nowMs < startTimeMs ? (
                                  <button
                                    className="btn btn-outline-warning btn-sm"
                                    disabled
                                  >
                                    <i className="bi bi-clock text-secondary"> Wait</i>
                                  </button>
                                ) : nowMs > endTimeMs ? (
                                  <button
                                    className="btn btn-outline-secondary btn-sm"
                                    disabled
                                  >
                                    <i className="bi bi-x-circle"> Ended</i>
                                  </button>
                                ) : (
                                  <button
                                    className="btn btn-outline-info btn-sm"
                                    onClick={() => markAsCompleted(value._id, date)}
                                  >
                                    <i className="bi bi-check-circle text-dark"> Mark as Completed</i>
                                  </button>
                                )
                              ) : (
                                <button
                                  className="btn btn-outline-secondary btn-sm"
                                  disabled
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

export default AttenderVaccinations;
