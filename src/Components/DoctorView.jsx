import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const DoctorView = () => {
  const navigate = useNavigate();

  const [token] = useState(sessionStorage.getItem("token"));
  const [userType] = useState(sessionStorage.getItem("userType"));
  const [userId] = useState(sessionStorage.getItem("userId"));

  const [doctor, setDoctor] = useState(null);

  useEffect(() => {
    if (!token || userType !== "doctor") {
      alert("Access denied! Only doctors can access this page.");
      navigate("/");
    }
  }, [token, userType, navigate]);

  const fetchData = () => {
    axios
      .post(
        "http://localhost:4000/doctorView",
        { userId },
        { headers: { token: token, "Content-Type": "application/json" } }
      )
      .then((response) => {
        if (response.data.Status === "Invalid Authentication") {
          alert("Invalid Authentication !");
          navigate("/");
        } else if (response.data.Status === "Error") {
          alert("Error in Fetching Doctor Data !");
        } else if (response.data.Status === "doctorNotFound") {
          alert("Doctor Not Found !");
        } else {
          setDoctor(response.data);
        }
      })
      .catch((error) => {
        console.log("Error --> ", error);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const calculateExperience = (baseExp, joinDate) => {
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

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  if (!doctor) {
    return <div className="text-center mt-4">Loading profile...</div>;
  }

  return (
    <div className="container mt-3">
      <div className="doctor-card shadow-lg p-5 rounded-5 position-relative">
        <button
          className="btn btn-success rounded-circle doctor-edit-btn position-absolute"
          onClick={() => navigate("/doctorPanel/editDoctor")}
          title="Edit Profile"
        >
          <i className="fa fa-edit"></i>
        </button>

        <h3 className="text-center mb-5 fw-bold">
          Welcome <span className="text-my-primary">{doctor.fname} 😊</span>
        </h3>

        <div className="row g-4">
          <div className="col-md-4">
            <div className="card shadow-sm border-0 rounded-4 px-3 py-2 h-100">
              <div className="card-body">
                <h6 className="card-title text-my-primary fw-semibold mb-3">
                  <i className="fa fa-user text-dark p-1 me-2"></i> Personal
                  Info
                </h6>
                <p>
                  {doctor.fname} {doctor.mname && doctor.mname + " "}{" "}
                  {doctor.lname}
                </p>
                <p>
                  <i className="fa fa-venus-mars me-2 text-secondary"></i>
                  {doctor.gender}
                </p>
                <p>
                  <i className="far fa-calendar-days me-2 text-secondary"></i>

                  {doctor.dob}
                </p>
                <p>
                  <i className="fa fa-graduation-cap me-2 text-secondary"></i>
                  {doctor.qualification}
                </p>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card shadow-sm border-0 rounded-4 h-100 px-3 py-2 ">
              <div className="card-body">
                <h6 className="card-title text-my-primary fw-semibold mb-3">
                  <i className="fa fa-envelope me-2"></i> Contact Info
                </h6>
                <p>
                  <i className="fa fa-envelope me-2 text-secondary"></i>
                  {doctor.email}
                </p>
                <p>
                  <i className="fa fa-phone me-2 text-secondary"></i>
                  {doctor.phone}
                </p>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card shadow-sm border-0 rounded-4 h-100 px-3 py-2 ">
              <div className="card-body">
                <h6 className="card-title text-my-primary fw-semibold mb-3">
                  <i className="fa fa-briefcase me-2"></i> Job Info
                </h6>
                <p>
                  <i className="fa fa-user-md me-2 text-secondary"></i>
                  {doctor.specialization}
                </p>
                <p>
                  <i className="fa fa-briefcase me-2 text-secondary"></i>
                  {calculateExperience(
                    parseInt(doctor.experience) || 0,
                    doctor.join_date
                  )}
                </p>
                <p>
                  <i className="fa fa-calendar-days me-2 text-secondary">
                    <span className="my-font fs-6 text-secondary p-1">
                      Join_on :
                    </span>
                  </i>
                  {formatDate(doctor.join_date)}
                </p>
                <p>
                  <strong>Status: </strong>
                  {doctor.status ? (
                    <span className="text-success px-1 py-2 fw-bold">
                      Active
                    </span>
                  ) : (
                    <span className="text-danger px-1 py-2 fw-bold">
                      Inactive
                    </span>
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorView;
