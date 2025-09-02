import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const ViewDoctors = () => {
  const navigate = useNavigate();

  const [token] = useState(sessionStorage.getItem("token"));
  const [userType] = useState(sessionStorage.getItem("userType"));
  const [DoctorsData, changeDoctorsData] = useState([]);

  useEffect(() => {
    if (!token || userType !== "admin") {
      alert("Access denied! Only admins can access this page.");
      navigate("/");
    }
  }, [token, userType, navigate]);

  const handleToggleStatus = (id) => {
    axios
      .post(
        "http://localhost:4000/doctorStatusUpdate",
        { _id: id },
        { headers: { token: token, "Content-Type": "application/json" } }
      )
      .then((response) => {
        if (response.data.Status === "IdNotFound") {
          console.log("Error getting the Id !");
        } else if (response.data.Status === "UserNotFound") {
          console.log("User Not Found !");
        } else {
          fetchData();
        }
      })
      .catch((err) => console.log("Error --> ", err));
  };

  const fetchData = () => {
    axios
      .post(
        "http://localhost:4000/viewDoctors",
        {},
        { headers: { token: token, "Content-Type": "application/json" } }
      )
      .then((response) => {
        if (response.data.Status === "Invalid Authentication") {
          alert("Invalid Authentication !");
          navigate("/");
        } else if (response.data.Status === "Error") {
          alert("Error in Fetching Doctors Data !");
        } else {
          changeDoctorsData(response.data);
        }
      })
      .catch((error) => {
        console.log("Error --> ", error);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  //  Calculate real experience
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

    // Format Year & Month properly
    const yearText = `${totalYears} Year${totalYears !== 1 ? "s" : ""}`;
    const monthText =
      months > 0 ? ` & ${months} Month${months !== 1 ? "s" : ""}` : "";

    return yearText + monthText;
  };

  //  Format date properly (DD-MM-YYYY)
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12">
      <div className="d-flex justify-content-between align-items-center mb-3">
            <h3 className="bi bi-heart-pulse m-0 fs-5 text-center flex-grow-1">
              <span className="px-1 fw-semi-bold fs-4">Doctors List</span>
            </h3>


            <Link to = "/doctorSignup" className="my-add-btn">
              <i className="bi bi-plus-circle me-1 icon"></i> 
            </Link>
          </div>

          
          <div className="table-responsive" style={{ fontSize: "0.85rem" }}>
            <table className="table my-table small-table table-sm table-striped align-middle text-center">
              <thead className="table-light">
                <tr>
                  <th scope="col">Sl.No</th>
                  <th scope="col">Name</th>
                  <th scope="col">Email</th>
                  <th scope="col">Phone</th>
                  <th scope="col">Gender</th>
                  <th scope="col">Qualification</th>
                  <th scope="col">Specialization</th>
                  <th scope="col">Experience</th>
                  <th scope="col">Join Date</th>
                  <th scope="col">Status</th>
                  <th scope="col">Action</th>
                </tr>
              </thead>
              <tbody>
                {DoctorsData.map((value, index) => (
                  <tr key={value._id}>
                    <td>{index + 1}</td>
                    <td>
                      {value.fname} {value.mname && value.mname + " "}
                      {value.lname}
                    </td>
                    <td>{value.email}</td>
                    <td>{value.phone}</td>
                    <td>{value.gender}</td>
                    <td>{value.qualification}</td>
                    <td>{value.specialization}</td>
                    <td>
                      {calculateExperience(
                        parseInt(value.experience) || 0,
                        value.join_date
                      )}
                    </td>
                    <td>{formatDate(value.join_date)}</td>
                    <td>{value.status ? "Active" : "Inactive"}</td>
                    <td
                      className="text-center"
                      onClick={() => handleToggleStatus(value._id)}
                      style={{ cursor: "pointer" }}
                    >
                      <i
                        className={`bi ${
                          value.status
                            ? "bi-toggle-on text-success"
                            : "bi-toggle-off text-danger"
                        } fs-5`}
                      ></i>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewDoctors;
