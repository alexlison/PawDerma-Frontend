import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AttenderView = () => {
  const navigate = useNavigate();

  const [token] = useState(sessionStorage.getItem("token"));
  const [userType] = useState(sessionStorage.getItem("userType"));
  const [userId] = useState(sessionStorage.getItem("userId"));

  const [attender, changeAttender] = useState(null);

  useEffect(() => {
    if (!token || userType !== "attender") {
      alert("Access denied! Only attender can access this page.");
      navigate("/");
    }
  }, [token, userType, navigate]);

  const fetchData = () => {
    axios
      .post(
        "http://localhost:4000/attenderView",
        { userId },
        { headers: { token: token, "Content-Type": "application/json" } }
      )
      .then((response) => {
        if (response.data.Status === "Invalid Authentication") {
          alert("Invalid Authentication !");
          navigate("/");
        } else if (response.data.Status === "Error") {
          alert("Error in Fetching Doctor Data !");
        } else if (response.data.Status === "attenderNotFound") {
          alert("Attender Not Found !");
        } else {
          changeAttender(response.data);
        }
      })
      .catch((error) => {
        console.log("Error --> ", error);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  if (!attender) {
    return <div className="text-center mt-4">Loading profile...</div>;
  }

  return (
    <div className="container mt-3">
      <div className="doctor-card shadow-lg p-5 rounded-5 position-relative">
        <button
          className="btn btn-success rounded-circle doctor-edit-btn position-absolute"
          onClick={() => navigate("/updateAttender")}
          title="Edit Profile"
        >
          <i className="fa fa-edit"></i>
        </button>

        <h3 className="text-center mb-5 fw-bold">
          Welcome <span className="text-my-primary">{attender.Name} 😊</span>
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
                  <i className="fa fa-id-badge me-2 text-secondary"></i>
                  {attender.Name}
                </p>

                <p>
                  <i
                    className={`fa ${
                      attender.gender === "Male"
                        ? "fa-mars"
                        : attender.gender === "Female"
                        ? "fa-venus"
                        : "fa-genderless"
                    } me-2 text-secondary`}
                  ></i>
                  {attender.gender}
                </p>

                <p>
                  <i className="far fa-calendar-days me-2 text-secondary"></i>

                  {attender.dob}
                </p>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card shadow-sm border-0 rounded-4 h-100 px-3 py-2 ">
              <div className="card-body">
                <h6 className="card-title text-my-primary fw-semibold mb-3">
                  <i className="fa fa-envelope  text-dark p-1 me-2"></i> Contact
                  Info
                </h6>
                <p>
                  <i className="fa fa-envelope me-2 text-secondary"></i>
                  {attender.email}
                </p>
                <p>
                  <i className="fa fa-phone me-2 text-secondary"></i>
                  {attender.phone}
                </p>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card shadow-sm border-0 rounded-4 h-100 px-3 py-2 ">
              <div className="card-body">
                <h6 className="card-title text-my-primary fw-semibold mb-3">
                  <i className="fa fa-briefcase text-dark p-1 me-2"></i> Job
                  Info
                </h6>
                <p>
                  <i className="fa fa-briefcase me-2 text-secondary"></i>
                  Job Role : Attender
                </p>

                <p>
                  <i className="fa fa-graduation-cap me-2 text-secondary"></i>
                  {attender.qualification}
                </p>

                <p>
                  <i className="fa fa-calendar-days me-2 text-secondary">
                    <span className="my-font fs-6 text-secondary p-1">
                      Join_on :
                    </span>
                  </i>
                  {formatDate(attender.join_date)}
                </p>
                <p>
                  <strong>Status: </strong>
                  {attender.status ? (
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

export default AttenderView;
