import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const ViewSchedules = () => {
  const navigate = useNavigate();

  const [token] = useState(sessionStorage.getItem("token"));
  const [userType] = useState(sessionStorage.getItem("userType"));
  const [userId] = useState(sessionStorage.getItem("userId"));

  const [schedules, ChangeSchedules] = useState([]);

  useEffect(() => {
    if (!token || userType !== "doctor") {
      alert("Access denied! Only doctors can access this page.");
      navigate("/");
    }
  }, [token, userType, navigate]);

  const fetchData = () => {
    axios
      .post(
        "http://localhost:4000/viewDoctorSchedules",
        { doctorId: userId },
        { headers: { token: token, "Content-Type": "application/json" } }
      )
      .then((response) => {
        if (response.data.Status === "Invalid Authentication") {
          alert("Invalid Authentication !");
          navigate("/");
        } else if (response.data.Status === "Error") {
          alert("Error in Fetching Doctor Schedules !");
        } else if (response.data.Status === "SchedulesNotFound") {
          alert("No Schedules Found !");
        } else {
          const today = new Date();
          today.setHours(0, 0, 0, 0); 

          const upcomingSchedules = response.data.filter((sch) => {
            const scheduleDate = new Date(sch.date);
            return scheduleDate >= today;
          });

          ChangeSchedules(upcomingSchedules);
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
    <div className="container-fluid">
      <div className="row">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h3 className="text-center flex-grow-1 mt-3 mb-1 fs-5">
              <span className="px-1 fw-semi-bold fs-4 py-4">
                <i className="fa fa-calendar-days me-2 p-1 fs-4 text-secondary"></i>
                My Schedules
              </span>
            </h3>

            <Link
              to="/addSchedule"
              className="my-add-btn my-link-new mt-4 fs-7"
            >
              <i className="bi bi-plus-circle me-2 icon">
                <span className="fs-7"> Add Schedule</span>
              </i>
            </Link>
          </div>

          <div className="table-responsive" style={{ fontSize: "0.85rem" }}>
            <table className="table my-table small-table table-sm table-striped align-middle text-center">
              <thead className="table-light">
                <tr>
                  <th scope="col">Sl.No</th>
                  <th scope="col">Date</th>
                  <th scope="col">Day</th>
                  <th scope="col">Consultation From</th>
                  <th scope="col">Consultation To</th>
                  <th scope="col">Available Slots</th>
                  <th scope="col">Remaining Slots</th>
                  <th scope="col">Action</th>
                </tr>
              </thead>

              <tbody>
                {schedules.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="text-center">
                      No Upcoming Schedules!
                    </td>
                  </tr>
                ) : (
                  schedules.map((value, index) => (
                    <tr key={value._id}>
                      <td>{index + 1}</td>
                      <td>{value.date ? value.date.split("T")[0] : "-"}</td>
                      <td>
                        {value.date
                          ? new Date(value.date).toLocaleDateString("en-US", {
                              weekday: "long",
                            })
                          : "-"}
                      </td>
                      <td>{value.consultationFrom}</td>
                      <td>{value.consultationTo}</td>
                      <td>
                        <span className="badge bg-success status-badge px-4 py-2">
                          {value.slots}
                        </span>
                      </td>
                      <td>
                        <span className="badge bg-danger status-badge px-4 py-2">
                          {value.remaining_slots}
                        </span>
                      </td>
                      <td>
                        <button
                          className="btn btn-secondary rounded-circle py-1 px-2 my-editnew"
                          onClick={() =>
                            navigate(`/updateSchedule/${value._id}`)
                          }
                          title="Edit Schedule"
                        >
                          <i className="fa fa-edit"></i>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewSchedules;
