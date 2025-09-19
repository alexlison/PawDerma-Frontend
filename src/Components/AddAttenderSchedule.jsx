import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const AddAttenderSchedule = () => {
  const navigate = useNavigate();

  const [token] = useState(sessionStorage.getItem("token"));
  const [userType] = useState(sessionStorage.getItem("userType"));
  const [userId] = useState(sessionStorage.getItem("userId"));

  useEffect(() => {
    if (!token || userType !== "attender") {
      alert("Access denied! Only attenders can access this page.");
      navigate("/");
    }
  }, [token, userType, navigate]);

  const [input, changeInput] = useState({
    attenderId: userId,
    date: "",
    vaccinationFrom: "",
    vaccinationTo: "",
    slots: "",
    remaining_slots:""
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};

    if (!input.date) newErrors.date = "Date is required";
    if (!input.vaccinationFrom.trim())
      newErrors.vaccinationFrom = "Consultation From is required";
    if (!input.vaccinationTo.trim())
      newErrors.vaccinationTo = "Consultation To is required";
    if (!input.slots) newErrors.slots = "Slots are required";

       if (
      input.vaccinationFrom.trim() &&
      input.vaccinationTo.trim() &&
      input.vaccinationFrom === input.vaccinationTo
    ) {
      newErrors.vaccinationTo = "From and To time cannot be the same";
    }

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

        const newInput = { ...input, remaining_slots: input.slots };


      axios
        .post("http://localhost:4000/attenderSchedules", newInput, {
          headers: { token: token, "Content-Type": "application/json" },
        })
        .then((response) => {
          if (response.data.Status === "Success") {
            navigate("/attenderPanel/viewAttenderSchedules");
          } else if (response.data.Status === "ScheduleAlreadyExists") {
            alert("This Schedule Already Exists!");
          } else if (response.data.Status === "Invalid Authentication") {
            alert("Invalid Authentication!");
            navigate("/");
          } else {
            alert("Registration failed. Please try again.");
          }
        })
        .catch((error) => {
          console.error("error:", error);
          alert("An error occurred during Add schedule. Please try again.");
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
        <h4 className="m-4 mt-5 my-formheading text-center">Add Schedule</h4>
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
                <label className="form-label">Vaccination From:</label>
                <select
                  className={`form-control ${
                    errors.vaccinationFrom ? "is-invalid" : ""
                  }`}
                  name="vaccinationFrom"
                  value={input.vaccinationFrom}
                  onChange={inputHandler}
                >
                  <option value="">Select time</option>
                  {timeOptions.map((time) => (
                    <option key={time} value={time}>
                      {time}
                    </option>
                  ))}
                </select>
                {errors.vaccinationFrom && (
                  <div className="invalid-feedback">
                    {errors.vaccinationFrom}
                  </div>
                )}
              </div>

              <div className="col-12 col-md-6">
                <label className="form-label">Vaccination To:</label>
                <select
                  className={`form-control ${
                    errors.vaccinationTo ? "is-invalid" : ""
                  }`}
                  name="vaccinationTo"
                  value={input.vaccinationTo}
                  onChange={inputHandler}
                >
                  <option value="">Select time</option>
                  {timeOptions.map((time) => (
                    <option key={time} value={time}>
                      {time}
                    </option>
                  ))}
                </select>
                {errors.vaccinationTo && (
                  <div className="invalid-feedback">
                    {errors.vaccinationTo}
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
                  <i className="fa fa-calendar-days me-2"></i> Add Schedule
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddAttenderSchedule;
