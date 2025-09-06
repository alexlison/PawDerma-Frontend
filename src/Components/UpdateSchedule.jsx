import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const UpdateSchedule = () => {
  const navigate = useNavigate();
  const { id: scheduleId } = useParams();

  const [token] = useState(sessionStorage.getItem("token"));
  const [userType] = useState(sessionStorage.getItem("userType"));

  useEffect(() => {
    if (!token || userType !== "doctor") {
      alert("Access denied! Only doctor can access this page.");
      navigate("/");
    }
  }, [token, userType, navigate]);

  const [input, changeInput] = useState({
    date: "",
    consultationFrom: "",
    consultationTo: "",
    slots: "",
  });

  const [errors, setErrors] = useState({});

  const fetchData = () => {
    axios
      .get(`http://localhost:4000/getSchedule/${scheduleId}`, {
        headers: { token, "Content-Type": "application/json" },
      })
      .then((response) => {
        console.log("Fetched schedule -->", response.data);

        if (response.data.Status === "Error") {
          alert("Error fetching schedule");
        } else {
          // Handle possible response shapes
          const schedule =
            response.data.data || response.data[0] || response.data;

          changeInput({
            date: schedule.date ? schedule.date.split("T")[0] : "",
            consultationFrom: schedule.consultationFrom || "",
            consultationTo: schedule.consultationTo || "",
            slots: schedule.slots || "",
          });
        }
      })
      .catch((error) => {
        console.error("Error fetching schedule:", error);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const validate = () => {
    const newErrors = {};
    if (!input.date) newErrors.date = "Date is required";
    if (!input.consultationFrom.trim())
      newErrors.consultationFrom = "Consultation From is required";
    if (!input.consultationTo.trim())
      newErrors.consultationTo = "Consultation To is required";
    if (!input.slots) newErrors.slots = "Slots are required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const inputHandler = (event) => {
    changeInput({ ...input, [event.target.name]: event.target.value });
    if (errors[event.target.name]) {
      setErrors({ ...errors, [event.target.name]: "" });
    }
  };

  const readValues = () => {
    if (validate()) {
      axios
        .put(`http://localhost:4000/updateSchedule/${scheduleId}`, input, {
          headers: { token, "Content-Type": "application/json" },
        })
        .then((response) => {
          if (response.data.Status === "Success") {
            alert("Schedule Updated Successfully");
            navigate("/doctorPanel/viewSchedules");
          } else if (response.data.Status === "ScheduleIdNotFound") {
            alert("Schedule Id NotFound!");
          } else if (response.data.Status === "ScheduleAlreadyExists") {
            alert("Schedule Already Exists!");
          } else if (response.data.Status === "Invalid Authentication") {
            alert("Invalid Authentication");
            navigate("/");
          } else {
            alert("Error in Updating Schedule. Try Again");
          }
        })
        .catch((error) => {
          console.error("Update error:", error);
          alert("An error occurred during Updation. Please try again.");
        });
    }
  };

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split("T")[0];

  const generateTimeOptions = () => {
    const times = [];
    let current = new Date("1970-01-01T10:00:00");
    const endTime = new Date("1970-01-01T16:00:00");

    while (current <= endTime) {
      const label = current.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
      times.push(label);
      current.setMinutes(current.getMinutes() + 30);
    }
    return times;
  };

  const timeOptions = generateTimeOptions();

  return (
    <div>
      <button
        onClick={() => navigate(-1)}
        className="btn btn-link position-absolute top-0 start-0 m-5 fw-semibold text-dark text-decoration-none"
      >
        <i className="bi bi-arrow-left-circle-fill fs-5"></i> Back
      </button>

      <div
        className="container p-5 pb-3 pt-1 bg-light border rounded shadow mt-5 mb-5"
        style={{ maxWidth: "810px" }}
      >
        <h4 className="m-4 mt-5 my-formheading text-center">
          Update Schedule
        </h4>
        <hr className="mb-5 mt-4 my-hr" />

        <div className="row">
          <div className="col-12">
            <div className="row g-3">
              <div className="col-12 col-md-6">
                <label className="form-label">Date:</label>
                <input
                  type="date"
                  className={`form-control ${errors.date ? "is-invalid" : ""}`}
                  name="date"
                  value={input.date}
                  onChange={inputHandler}
                  min={minDate}
                />
                {errors.date && (
                  <div className="invalid-feedback">{errors.date}</div>
                )}
              </div>

              <div className="col-12 col-md-6">
                <label className="form-label">Consultation From:</label>
                <select
                  className={`form-control ${
                    errors.consultationFrom ? "is-invalid" : ""
                  }`}
                  name="consultationFrom"
                  value={input.consultationFrom}
                  onChange={inputHandler}
                >
                  <option value="">Select time</option>
                  {timeOptions.map((time) => (
                    <option key={time} value={time}>
                      {time}
                    </option>
                  ))}
                </select>
                {errors.consultationFrom && (
                  <div className="invalid-feedback">
                    {errors.consultationFrom}
                  </div>
                )}
              </div>

              <div className="col-12 col-md-6">
                <label className="form-label">Consultation To:</label>
                <select
                  className={`form-control ${
                    errors.consultationTo ? "is-invalid" : ""
                  }`}
                  name="consultationTo"
                  value={input.consultationTo}
                  onChange={inputHandler}
                >
                  <option value="">Select time</option>
                  {timeOptions.map((time) => (
                    <option key={time} value={time}>
                      {time}
                    </option>
                  ))}
                </select>
                {errors.consultationTo && (
                  <div className="invalid-feedback">
                    {errors.consultationTo}
                  </div>
                )}
              </div>

              <div className="col-12 col-md-6">
                <label className="form-label">Slots:</label>
                <input
                  type="text"
                  className={`form-control ${errors.slots ? "is-invalid" : ""}`}
                  placeholder="Enter number of slots"
                  name="slots"
                  value={input.slots}
                  onChange={inputHandler}
                />
                {errors.slots && (
                  <div className="invalid-feedback">{errors.slots}</div>
                )}
              </div>

              <div className="col-12 text-end">
                <button
                  className="btn btn-success w-45 px-4 border-overline mt-4 mb-3 p-2 my-btn"
                  onClick={readValues}
                >
                  <i className="bi bi-person-plus me-2"></i> Update Schedule
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateSchedule;
