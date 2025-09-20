import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const VaccinationBooking = () => {
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
  const [vaccine, setVaccine] = useState("");
  const [attenders, setAttenders] = useState([]);
  const [selectedSchedule, setSelectedSchedule] = useState("");
  const [showAttenders, setShowAttenders] = useState(false);
  const [errors, setErrors] = useState({});

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

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setAttenders([]);
    setSelectedSchedule("");
    setShowAttenders(false);

    const newErrors = {};
    if (!selectedCat) newErrors.cat = "Please select a cat.";
    if (!date) newErrors.date = "Please select a date.";
    if (!vaccine) newErrors.vaccine = "Please select a vaccine.";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const res = await axios.get(
        `http://localhost:4000/getAttenderDetails?date=${date}`,
        { headers: { token } }
      );

      if (
        res.data &&
        res.data.length > 0 &&
        res.data.Status !== "NoAttendersForTHisDate"
      ) {
        setAttenders(res.data);
      } else {
        setAttenders([]);
      }
      setShowAttenders(true);
    } catch (err) {
      console.error("Error fetching attenders:", err);
      setAttenders([]);
      setShowAttenders(true);
    }
  };

  const handleBooking = async () => {
    setErrors({});
    const newErrors = {};
    if (!selectedCat) newErrors.cat = "Please select a cat.";
    if (!date) newErrors.date = "Please select a date.";
    if (!vaccine) newErrors.vaccine = "Please select a vaccine.";
    if (!selectedSchedule) newErrors.attender = "Please select an attender.";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:4000/vaccinationBooking",
        {
          catId: selectedCat,
          vaccineScheduleId: selectedSchedule, // ✅ Only send schedule id
          date,
          vaccine,
        },
        { headers: { token } }
      );

      switch (res.data.Status) {
        case "Success":
          navigate(`/home/payment/${res.data.appointmentId}`);
          break;
        case "NoAvailableSlot":
          alert("No Available Slots for Selected Attender!");
          break;
        case "DuplicateBookingNotAllowed":
          alert("Duplicate Booking Not Allowed!");
          break;
        case "VaccineAlreadyTaken":
          alert("This vaccine has already been taken for this cat!");
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
        Vaccination Booking
      </h4>
      <div className="row">
        {/* Left Form */}
        <div className="col-md-6">
          <form
            onSubmit={handleFormSubmit}
            className="p-3 border rounded shadow-sm bg-light"
          >
            {/* Cat */}
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

            {/* Date */}
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

            {/* Vaccine */}
            <div className="mb-3">
              <label className="form-label fw-bold">Vaccine:</label>
              <select
                className={`form-select ${errors.vaccine ? "is-invalid" : ""}`}
                value={vaccine}
                onChange={(e) => setVaccine(e.target.value)}
              >
                <option value="" disabled>
                  -- Select Vaccine --
                </option>
                <option value="Rabies">Rabies</option>
                <option value="FVRCP">FVRCP</option>
                <option value="FeLV">FeLV</option>
                <option value="Chlamydia">Chlamydia</option>
                <option value="Feline Panleukopenia">
                  Feline Panleukopenia
                </option>
                <option value="Feline Calicivirus">Feline Calicivirus</option>
                <option value="Feline Herpesvirus">Feline Herpesvirus</option>
                <option value="Bordetella">Bordetella</option>
              </select>
              {errors.vaccine && (
                <div className="invalid-feedback">{errors.vaccine}</div>
              )}
            </div>

            <button
              type="submit"
              className="btn my-btnNew mb-3 text-light w-100"
            >
              Find Attenders
            </button>
          </form>
        </div>

        {/* Right Attender List */}
        <div className="col-md-6">
          {showAttenders && (
            <div className="p-3 px-4 mx-3 w-100 border rounded shadow-sm bg-white">
              <h5 className="m-2 mx-2 my-2 fw-semi-bold">Available Attenders</h5>
              {attenders.length > 0 ? (
                attenders.map((att) => (
                  <label
                    key={att._id}
                    htmlFor={`attender-${att._id}`}
                    className={`d-block p-2 px-3 border rounded mb-3 ${
                      selectedSchedule === att._id ? "border-warning bg-light" : ""
                    }`}
                    style={{ cursor: "pointer" }}
                  >
                    <input
                      type="radio"
                      id={`attender-${att._id}`}
                      name="attender"
                      value={att._id}
                      className="d-none"
                      checked={selectedSchedule === att._id}
                      onChange={(e) => setSelectedSchedule(e.target.value)}
                    />
                    <div>
                      <div className="fw-bold mb-1">{att.attenderId?.Name}</div>
                      <div className="text-muted mb-2">
                        Qualification: {att.attenderId?.qualification}
                      </div>
                      <div className="mb-2">
                        Vaccination: {att.vaccinationFrom} - {att.vaccinationTo}
                      </div>
                      <div>
                        <span className="badge bg-success me-2">
                          Total Slots: {att.slots}
                        </span>
                        <span className="badge bg-danger">
                          Remaining: {att.remaining_slots}
                        </span>
                      </div>
                    </div>
                  </label>
                ))
              ) : (
                <p className="text-center m-4 border border-danger p-3 text-danger">
                  No attenders available at this date!
                </p>
              )}

              {errors.attender && (
                <div className="text-danger small">{errors.attender}</div>
              )}

              <button
                className="btn my-book text-light border-light mb-3 mt-2 w-100"
                onClick={handleBooking}
                disabled={!attenders.length}
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

export default VaccinationBooking;
