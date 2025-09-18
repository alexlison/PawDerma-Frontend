import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const UpdateAttender = () => {
  const navigate = useNavigate();

  const [token] = useState(sessionStorage.getItem("token"));
  const [userType] = useState(sessionStorage.getItem("userType"));
  const [userId] = useState(sessionStorage.getItem("userId"));

  useEffect(() => {
    if (!token || userType !== "attender") {
      alert("Access denied! Only attender can access this page.");
      navigate("/");
    }
  }, [token, userType, navigate]);

  const [input, changeInput] = useState({
    Name: "",
    qualification: "",
    dob: "",
    oldPassword: "",
    newPassword: "",
    phone: "",
    gender: "",
    email: "",
  });

  const fetchData = () => {
    axios
      .post("http://localhost:4000/getAttenderById", { id: userId }, {
        headers: { token }
      })
      .then((response) => {
        if (response.data.Status === "Success") {
          const AttenderData = response.data.data || response.data;
          changeInput({
            Name: AttenderData.Name || "",
            qualification: AttenderData.qualification || "",
            dob: AttenderData.dob || "",
            oldPassword: "",
            newPassword: "",
            phone: AttenderData.phone || "",
            gender: AttenderData.gender || "",
            email: AttenderData.email || "",
          });
        }
      })
      .catch((error) => {
        console.error("Error fetching Attender:", error);
      });
  };

  useEffect(() => {
    fetchData();
  }, [token, userType, userId]);

  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    const phoneRegex = /^\d{10}$/;

    if (!input.Name.trim()) newErrors.Name = "Name is Required";

    if (!input.phone.trim()) {
      newErrors.phone = "Phone No is Required";
    } else if (!phoneRegex.test(input.phone)) {
      newErrors.phone = "Please enter a valid 10-digit phone number";
    }

    if (!input.dob) newErrors.dob = "Date of birth is required";
    if (!input.gender) newErrors.gender = "Gender is required";
    if (!input.qualification)
      newErrors.qualification = "Qualification is required";

    if (input.oldPassword && !input.newPassword) {
      newErrors.newPassword =
        "New Password is required if old password is given";
    } else if (input.newPassword && input.newPassword.length < 4) {
      newErrors.newPassword = "Password must be at least 4 characters";
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
      axios
        .put(`http://localhost:4000/updateAttender/${userId}`, input, {
          headers: { token: token, "Content-Type": "application/json" },
        })
        .then((response) => {
          if (response.data.Status === "Success") {
            alert("Profile Updated Successfully");
            navigate("/attenderPanel/attenderProfile");
          } else if (response.data.Status === "AttenderNotFound") {
            alert("Attender Not Found");
          } else if (response.data.Status === "InvalidOldPassword") {
            alert("Invalid Old Password !");
          } else if (response.data.Status === "PhoneAlreadyExists") {
            alert("Phone number already registered!");
          }else {
            alert("Updation failed. Please try again.");
          }
        })
        .catch((error) => {
          console.error("Update error:", error);
          alert("An error occurred during Updation. Please try again.");
        });
    }
  };

  return (
    <div>
      <button
        onClick={() => navigate(-1)}
        className="btn btn-link position-absolute top-0 start-0 m-5 fw-semibold text-dark text-decoration-none"
      >
        <i className="bi bi-arrow-left-circle-fill fs-5"></i> Back
      </button>

      <div
        className="container p-5 pt-1 bg-light border rounded shadow mt-5 mb-5"
        style={{ maxWidth: "950px" }}
      >
        <h4 className="m-4 mt-5 my-formheading text-center">Update Profile</h4>
        <hr className="mb-5 mt-4 my-hr" />
        <div className="row g-3">
          <div className="col-md-4">
            <label className="form-label">Full Name:</label>
            <input
              type="text"
              className={`form-control ${errors.Name ? "is-invalid" : ""}`}
              name="Name"
              value={input.Name}
              onChange={inputHandler}
            />
            {errors.Name && (
              <div className="invalid-feedback">{errors.Name}</div>
            )}
          </div>

          <div className="col-md-6">
            <label className="form-label">Email:</label>
            <input
              type="email"
              className="form-control"
              value={input.email}
              readOnly
            />
          </div>

          <div className="col-md-6">
            <label className="form-label">Phone:</label>
            <input
              type="text"
              className={`form-control ${errors.phone ? "is-invalid" : ""}`}
              name="phone"
              value={input.phone}
              onChange={inputHandler}
            />
            {errors.phone && (
              <div className="invalid-feedback">{errors.phone}</div>
            )}
          </div>

          <div className="col-md-6">
            <label className="form-label">Qualification:</label>
            <select
              className={`form-select ${
                errors.qualification ? "is-invalid" : ""
              }`}
              name="qualification"
              value={input.qualification}
              onChange={inputHandler}
            >
              <option value="" disabled>
                Select Qualification
              </option>
              <option value="Certificate in Animal Care & Management">
                Certificate in Animal Care & Management
              </option>
              <option value="Diploma in Veterinary Assistant">
                Diploma in Veterinary Assistant
              </option>
              <option value="Diploma in Animal Husbandry">
                Diploma in Animal Husbandry
              </option>
              <option value="Certificate in Zoo & Pet Care">
                Certificate in Zoo & Pet Care
              </option>
              <option value="Basic Animal First Aid Certification">
                Basic Animal First Aid Certification
              </option>
            </select>
            {errors.qualification && (
              <div className="invalid-feedback">{errors.qualification}</div>
            )}
          </div>

          <div className="col-md-4">
            <label className="form-label">Gender:</label>
            <select
              className={`form-select ${errors.gender ? "is-invalid" : ""}`}
              name="gender"
              value={input.gender}
              onChange={inputHandler}
            >
              <option value="" disabled>
                Select Gender
              </option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Others">Others</option>
            </select>
            {errors.gender && (
              <div className="invalid-feedback">{errors.gender}</div>
            )}
          </div>

          <div className="col-md-4">
            <label className="form-label">Date of Birth:</label>
            <input
              type="date"
              className={`form-control ${errors.dob ? "is-invalid" : ""}`}
              name="dob"
              value={input.dob}
              onChange={inputHandler}
              max={new Date().toISOString().split("T")[0]}
            />
            {errors.dob && (
              <div className="invalid-feedback">{errors.dob}</div>
            )}
          </div>

          <div className="col-md-6">
            <label className="form-label">Old Password:</label>
            <input
              type="password"
              className="form-control"
              name="oldPassword"
              value={input.oldPassword}
              onChange={inputHandler}
            />
          </div>

          <div className="col-md-6">
            <label className="form-label">New Password:</label>
            <input
              type="password"
              className={`form-control ${
                errors.newPassword ? "is-invalid" : ""
              }`}
              name="newPassword"
              value={input.newPassword}
              onChange={inputHandler}
            />
            {errors.newPassword && (
              <div className="invalid-feedback">{errors.newPassword}</div>
            )}
          </div>

          <div className="col-12 text-end">
            <button
              className="btn btn-success px-4 mt-4 mb-3 my-btn"
              onClick={readValues}
            >
              <i className="fa fa-id-badge me-1 px-1"></i> Update Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateAttender;
