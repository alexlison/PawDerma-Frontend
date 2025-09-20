import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const GeneralBooking = () => {
  const navigate = useNavigate();

  const [token] = useState(sessionStorage.getItem("token"));
  const [userType] = useState(sessionStorage.getItem("userType"));
  const [userId] = useState(sessionStorage.getItem("userId"));

  useEffect(() => {
    if (!token || userType !== "cat_owner") {
      alert("Access denied! Only cat_owner can access this page.");
      navigate("/");
    }
  }, [token, userType, navigate]);

  const [cats, setCats] = useState([]);
  const [selectedCat, setSelectedCat] = useState("");
  const [date, setDate] = useState("");
  const [symptoms, setSymptoms] = useState({
    fever: "no",
    vomiting: "no",
    cough: "no",
    loss_of_appetite: "no",
    diarrhea: "no",
  });
  const [doctors, setDoctors] = useState([]);
  const [selectedSchedule, setSelectedSchedule] = useState(""); // <-- store scheduleId
  const [showDoctors, setShowDoctors] = useState(false);
  const [errors, setErrors] = useState({}); 

  const calculateExperience = (baseExpStr, joinDate) => {
    let baseExp = parseInt(baseExpStr) || 0;
    if (!joinDate) return `${baseExp} Year${baseExp !== 1 ? "s" : ""}`;

    const join = new Date(joinDate);
    const now = new Date();

    let years = now.getFullYear() - join.getFullYear();
    let months = now.getMonth() - join.getMonth();

    if (months < 0) {
      years--;
      months += 12;
    }

    const totalYears = baseExp + years;
    const yearText = `${totalYears} Year${totalYears !== 1 ? "s" : ""}`;
    const monthText =
      months > 0 ? ` & ${months} Month${months !== 1 ? "s" : ""}` : "";

    return yearText + monthText;
  };

  useEffect(() => {
    if (token && userId) {
      axios
        .post(
          "http://localhost:4000/viewMyCats",
          { userId },
          { headers: { token, "Content-Type": "application/json" } }
        )
        .then((res) => setCats(res.data))
        .catch((err) => console.error("Error fetching cats:", err));
    }
  }, [token, userId]);

  const handleSymptomChange = (e) => {
    const { name, value } = e.target;
    setSymptoms((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setErrors({}); 
    setDoctors([]);
    setSelectedSchedule("");
    setShowDoctors(false);

    const newErrors = {};
    if (!selectedCat) newErrors.cat = "Please select a cat.";
    if (!date) newErrors.date = "Please select a date.";
    const yesCount = Object.values(symptoms).filter((s) => s === "yes").length;
    if (yesCount === 0)
      newErrors.symptoms = "Please enter at least one valid symptom.";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const res = await axios.get(
        `http://localhost:4000/getDoctorDetails?date=${date}`,
        { headers: { token } }
      );

      let doctorsList = [];
      if (
        res.data &&
        res.data.length > 0 &&
        res.data.Status !== "NoDoctorsForThisDate"
      ) {
        doctorsList = res.data.filter(
          (doc) =>
            !doc.doctorId.qualification.toLowerCase().includes("dermatology")
        );

        doctorsList.sort((a, b) =>
          yesCount >= 3
            ? parseInt(b.doctorId.experience) - parseInt(a.doctorId.experience)
            : parseInt(a.doctorId.experience) - parseInt(b.doctorId.experience)
        );
      }

      setDoctors(doctorsList);
      setShowDoctors(true);
    } catch (err) {
      console.error("Error fetching doctors:", err);
      setDoctors([]);
      setShowDoctors(true);
    }
  };

  const handleBooking = async () => {
    setErrors({});
    const newErrors = {};
    if (!selectedCat) newErrors.cat = "Please select a cat.";
    if (!date) newErrors.date = "Please select a date.";
    const yesCount = Object.values(symptoms).filter((s) => s === "yes").length;
    if (yesCount === 0)
      newErrors.symptoms = "Please enter at least one valid symptom.";
    if (!selectedSchedule) newErrors.doctor = "Please select a doctor.";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:4000/generalBooking",
        {
          catId: selectedCat,
          scheduleId: selectedSchedule, 
          date,
          symptoms,
        },
        { headers: { token } }
      );

      switch (res.data.Status) {
        case "Success":
          navigate(`/home/payment/${res.data.appointmentId}`);
          break;
        case "NoAvailableSlot":
          alert("No Available Slots for Selected Doctor!");
          break;
        case "DuplicateBookingNotAllowed":
          alert("Duplicate Booking Not Allowed!");
          break;
        case "Error":
          alert("Unexpected Error Occurred! Please Try Again...");
          break;
        default:
          alert("Invalid Authentication!");
          navigate("/");
      }
    } catch (err) {
      console.error("Error booking appointment:", err);
    }
  };

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split("T")[0];

  return (
    <div className="container mt-4">
      <h4 className="m-4 mt-5 mb-5 my-formheading text-center">
        General Appointment
      </h4>
      <div className="row">
        <div className="col-md-6">
          <form
            onSubmit={handleFormSubmit}
            className="p-3 border rounded shadow-sm bg-light"
          >
            <div className="mb-3">
              <label className="form-label fw-bold">Select Cat:</label>
              <select
                className={`form-select ${errors.cat ? "is-invalid" : ""}`}
                value={selectedCat}
                onChange={(e) => setSelectedCat(e.target.value)}
              >
                <option value="">-- Select Cat --</option>
                {cats.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              {errors.cat && (
                <div className="invalid-feedback">{errors.cat}</div>
              )}
            </div>

            <div className="mb-3">
              <label className="form-label fw-bold">Select Date:</label>
              <input
                type="date"
                className={`form-control ${errors.date ? "is-invalid" : ""}`}
                value={date}
                min={minDate}
                onChange={(e) => setDate(e.target.value)}
              />
              {errors.date && (
                <div className="invalid-feedback">{errors.date}</div>
              )}
            </div>

            <div className="mb-3">
              <label className="form-label fw-bold">Symptoms:</label>
              <div className="row">
                {Object.keys(symptoms).map((symptom) => (
                  <div key={symptom} className="col-12 col-md-6 mb-3">
                    <label className="form-label text-capitalize">
                      {symptom.replaceAll("_", " ")}:
                    </label>
                    <select
                      name={symptom}
                      value={symptoms[symptom]}
                      onChange={handleSymptomChange}
                      className="form-select"
                    >
                      <option value="no">No</option>
                      <option value="yes">Yes</option>
                    </select>
                  </div>
                ))}
              </div>
              {errors.symptoms && (
                <div className="text-danger small">{errors.symptoms}</div>
              )}
            </div>

            <button
              type="submit"
              className="btn my-btnNew mb-3 text-light w-100"
            >
              Find Doctors
            </button>
          </form>
        </div>

        <div className="col-md-6">
          {showDoctors && (
            <div className="p-3 border rounded shadow-sm bg-white">
              <h5 className="m-2 mx-4 fw-semi-bold">Available Doctors</h5>
              {doctors.length > 0 ? (
                doctors.map((doc) => (
                  <label
                    key={doc._id}
                    htmlFor={`doctor-${doc._id}`}
                    className={`d-block p-3 border rounded mb-3 cursor-pointer ${
                      selectedSchedule === doc._id
                        ? "border-warning bg-light"
                        : ""
                    }`}
                    style={{ cursor: "pointer" }}
                  >
                    <input
                      type="radio"
                      id={`doctor-${doc._id}`}
                      name="doctor"
                      value={doc._id} 
                      className="d-none"
                      checked={selectedSchedule === doc._id}
                      onChange={(e) => setSelectedSchedule(e.target.value)}
                    />

                    <div>
                      <strong>
                        Dr. {doc.doctorId.fname} {doc.doctorId.lname} (
                        {doc.doctorId.qualification})
                      </strong>
                      <br />
                      <small>
                        Experience:{" "}
                        {calculateExperience(
                          doc.doctorId.experience,
                          doc.doctorId.join_date
                        )}
                      </small>
                      <br />
                      <small>
                        Consultation: {doc.consultationFrom} - {doc.consultationTo}
                      </small>
                      <br />
                      <small>
                        <span className="mt-2 badge my-color6 status-badge">
                          Total Slots: {doc.slots}
                        </span>{" "}
                        <span className="badge my-color7 status-badge">
                          Remaining: {doc.remaining_slots}
                        </span>
                      </small>
                    </div>
                  </label>
                ))
              ) : (
                <p className="text-center m-4 border border-danger  p-3 text-danger">
                  No doctors available At this Date!
                </p>
              )}

              {errors.doctor && (
                <div className="text-danger small">{errors.doctor}</div>
              )}

              <button
                className="btn my-book text-light border-light mb-3 mt-4 w-100 mt-3"
                onClick={handleBooking}
                disabled={!doctors.length}
              >
                Book Appointment
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GeneralBooking;
