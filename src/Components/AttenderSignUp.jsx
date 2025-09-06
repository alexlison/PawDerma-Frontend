import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AttenderSignUp = () => {

  const navigate = useNavigate();

  const [token,changeToken] = useState(sessionStorage.getItem("token"))

  const[userType,changeUserType] = useState(sessionStorage.getItem("userType"))

  useEffect(() => {

    if(!token || userType !== 'admin')
    {
      alert("Access denied! Only admins can access this page.");
      navigate("/"); 
    }
  },[token,userType,navigate]); 

  const [input, changeInput] = useState({
    Name: "",
    email: "",
    phone: "",
    password: "",
    qualification: "",
    dob: "",
    gender: "",
    cnf_password: "",
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\d{10}$/;

    if (!input.Name.trim()) newErrors.Name = "Full Name is Required";
    if (!input.email.trim()) {
      newErrors.email = "Email id is Required";
    } else if (!emailRegex.test(input.email)) {
      newErrors.email = "Please enter a valid email";
    }
    if (!input.phone.trim()) {
      newErrors.phone = "First Name is Required";
    } else if (!phoneRegex.test(input.phone)) {
      newErrors.phone = "Please enter a valid 10-digit phone number";
    }
    if (!input.dob) newErrors.dob = "Date of birth is required";
    if (!input.gender) newErrors.gender = "Gender is required";

    if (!input.qualification)
      newErrors.qualification = "Qualification is required";
    if (!input.password) {
      newErrors.password = "Password is required";
    } else if (input.password.length < 4) {
      newErrors.password = "Password must be at least 4 characters";
    }
    if (!input.cnf_password) {
      newErrors.cnf_password = "Confirm Password is required";
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

      if (input.password !== input.cnf_password) {
        alert("Password and Confirm Password do not match!");
        return;
      }
     
      let newInput = {
        "Name": input.Name,
        "email": input.email,
        "phone": input.phone,
        "password": input.password,
        "qualification": input.qualification,
        "dob": input.dob,
        "gender": input.gender
        
      }

      axios
        .post("http://localhost:4000/attenderSignup", newInput,{ headers : { token:token,"Content-Type":"application/json" } })
        .then((response) => {
          if (response.data.Status === "Success") {
            alert("Attender Added Successfully")
               navigate("/adminPanel/attenders");
          } else if (response.data.Status === "EmailExists") {
            alert("Email Id Already Exists !");
          } else if (response.data.Status === "PhoneExists") {
            alert("Phone number already registered!");
          } else {
            alert("Registration failed. Please try again.");
          }
        })
        .catch((error) => {
          console.error("Registration error:", error);
          alert("An error occurred during registration. Please try again.");
        });
    } else {
      return;
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
        className="container p-5 pt-1 pb-4 bg-light border rounded shadow mt-5 mb-5"
        style={{ maxWidth: "770px" }}
      >
        <h4 className="m-4 mt-5 my-formheading text-center">Add Attender</h4>
        <hr className="mb-5 mt-4 my-hr" />
        <div className="row">
          <div className="col col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 col-xxl-12">
            <div className="row g-3">
              <div className="col col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6 col-xxl-6">
                <label htmlFor="" className="form-label">
                  Full Name:
                </label>
                <input
                  type="text"
                  className={`form-control ${errors.Name ? "is-invalid" : ""}`}
                  placeholder="Enter Full Name"
                  name="Name"
                  value={input.Name}
                  onChange={inputHandler}
                />

                {errors.Name && (
                  <div className="invalid-feedback">{errors.Name}</div>
                )}
              </div>
              <div className="col col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6 col-xxl-6">
                <label htmlFor="" className="form-label">
                  Email Id:
                </label>
                <input
                  type="text"
                  className={`form-control ${errors.email ? "is-invalid" : ""}`}
                  placeholder="Enter Email Id"
                  name="email"
                  value={input.email}
                  onChange={inputHandler}
                />

                {errors.email && (
                  <div className="invalid-feedback">{errors.email}</div>
                )}
              </div>
              <div className="col col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6 col-xxl-6">
                <label htmlFor="" className="form-label">
                  Phone:
                </label>
                <input
                  type="text"
                  className={`form-control ${errors.phone ? "is-invalid" : ""}`}
                  placeholder="Enter Phone No"
                  name="phone"
                  value={input.phone}
                  onChange={inputHandler}
                />
                {errors.phone && (
                  <div className="invalid-feedback">{errors.phone}</div>
                )}
              </div>
              <div className="col col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6 col-xxl-6">
                <label htmlFor="" className="form-label">
                  Dob:
                </label>
                <input
                  type="date"
                  id=""
                  className={`form-control ${errors.dob ? "is-invalid" : ""}`}
                  max={new Date().toISOString().split("T")[0]}
                  placeholder="Select the Dob"
                  name="dob"
                  value={input.dob}
                  onChange={inputHandler}
                />

                {errors.dob && (
                  <div className="invalid-feedback">{errors.dob}</div>
                )}
              </div>

              <div className="col col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6 col-xxl-6">
                <label htmlFor="" className="form-label">
                  Gender
                </label>
                <select
                  id=""
                  className={`form-select ${errors.gender ? "is-invalid" : ""}`}
                  name="gender"
                  value={input.gender}
                  onChange={inputHandler}
                >
                  <option value="" disabled>
                    {" "}
                    Select Gender{" "}
                  </option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Others">Others</option>
                </select>
                {errors.gender && (
                  <div className="invalid-feedback">{errors.gender}</div>
                )}
              </div>

              <div className="col col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6 col-xxl-6">
                <label htmlFor="" className="form-label">
                  Qualification:
                </label>
                <select
                  id=""
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
              <div className="col col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6 col-xxl-6">
                <label htmlFor="" className="form-label">
                  Password:
                </label>
                <input
                  type="password"
                  id=""
                  className={`form-control ${
                    errors.password ? "is-invalid" : ""
                  }`}
                  placeholder="Enter password (min 4 characters)"
                  name="password"
                  value={input.password}
                  onChange={inputHandler}
                />

                {errors.password && (
                  <div className="invalid-feedback">{errors.password}</div>
                )}
              </div>

              <div className="col col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6 col-xxl-6">
                <label htmlFor="" className="form-label">
                  Confirm Password:
                </label>
                <input
                  type="password"
                  id=""
                  className={`form-control ${
                    errors.cnf_password ? "is-invalid" : ""
                  }`}
                  placeholder="Enter the Confirm Password"
                  name="cnf_password"
                  value={input.cnf_password}
                  onChange={inputHandler}
                />

                {errors.cnf_password && (
                  <div className="invalid-feedback">{errors.cnf_password}</div>
                )}
              </div>
              <div className="col col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 col-xxl-12">
                <div className="col-12 d-flex justify-content-end">
                  <button
                    className="btn btn-success px-4 border-overline mt-4 mb-3 p-2 my-btn2"
                    onClick={readValues}
                  >
                    <i className="bi bi-person-plus me-2"></i> Add Attender
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttenderSignUp;
