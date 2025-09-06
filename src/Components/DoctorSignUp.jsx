import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const DoctorSignUp = () => {
  const navigate = useNavigate();

  const [token, changeToken] = useState(sessionStorage.getItem("token"));

  const [userType, changeUserType] = useState(
    sessionStorage.getItem("userType")
  );

  useEffect(() => {
    if (!token || userType !== "admin") {
      alert("Access denied! Only admins can access this page.");
      navigate("/");
    }
  }, [token, userType, navigate]);

  console.log("Token:", token);

  const [input, changeInput] = useState({
    fname: "",
    mname: "",
    lname: "",
    email: "",
    phone: "",
    qualification: "",
    specialization: "",
    dob: "",
    gender: "",
    experience: "",
    password: "",
    cnf_password: "",
  });

  const [errors, setErrors] = useState({});
  const validate = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\d{10}$/;

    if (!input.fname.trim()) newErrors.fname = "First name is Required";
    if (!input.lname.trim()) newErrors.lname = " Middle Name is Required";
    if (!input.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(input.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!input.phone.trim()) {
      newErrors.phone = "Phone No is Required";
    } else if (!phoneRegex.test(input.phone)) {
      newErrors.phone = "Please enter a valid 10-digit phone number";
    }
    if (!input.dob) newErrors.dob = "Date of birth is required";
    if (!input.gender) newErrors.gender = "Gender is required";
    if (!input.qualification)
      newErrors.qualification = "Qualification is required";
    if (!input.specialization)
      newErrors.specialization = "Specialization is required";
    if (!input.experience.trim())
      newErrors.experience = "Experience is required";

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
        fname: input.fname,
        mname: input.mname,
        lname: input.lname,
        email: input.email,
        phone: input.phone,
        qualification: input.qualification,
        specialization: input.specialization,
        dob: input.dob,
        gender: input.gender,
        experience: input.experience,
        password: input.password,
      };

      axios
        .post("http://localhost:4000/doctorSignUp", newInput, {
          headers: { token: token, "Content-Type": "application/json" },
        })
        .then((response) => {
          if (response.data.Status === "Success") {
            alert("Doctor Added Successfully")
            navigate("/adminPanel/doctors");
          } else if (response.data.Status === "EmailExists") {
            alert("Email address already registered!");
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
        className="container  p-5 pt-1 bg-light border rounded shadow mt-5 mb-5"
        style={{ maxWidth: "950px" }}
      >
        <h4 className="m-4 mt-5 my-formheading text-center">Add Doctor</h4>
        <hr className="mb-5 mt-4 my-hr" />
        <div className="row">
          <div className="col col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 col-xxl-12">
            <div className="row g-3">
              <div className="col col-12 col-sm-12 col-md-6 col-lg-4 col-xl-4 col-xxl-4">
                <label htmlFor="" className="form-label">
                  First Name:
                </label>
                <input
                  type="text"
                  className={`form-control ${errors.fname ? "is-invalid" : ""}`}
                  placeholder="Enter First Name"
                  name="fname"
                  value={input.fname}
                  onChange={inputHandler}
                />
                {errors.fname && (
                  <div className="invalid-feedback">{errors.fname}</div>
                )}
              </div>

              <div className="col col-12 col-sm-12 col-md-6 col-lg-4 col-xl-4 col-xxl-4">
                <label htmlFor="" className="form-label">
                  Middle Name:
                </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter Middle Name"
                  name="mname"
                  value={input.mname}
                  onChange={inputHandler}
                />
              </div>
              <div className="col col-12 col-sm-12 col-md-6 col-lg-4 col-xl-4 col-xxl-4">
                <label htmlFor="" className="form-label">
                  Last Name
                </label>
                <input
                  type="text"
                  className={`form-control ${errors.lname ? "is-invalid" : ""}`}
                  placeholder="Enter Last Name"
                  name="lname"
                  value={input.lname}
                  onChange={inputHandler}
                />
                {errors.lname && (
                  <div className="invalid-feedback">{errors.lname}</div>
                )}
              </div>

              <div className="col col-12 col-sm-12 col-md-6 col-lg-4 col-xl-4 col-xxl-4">
                <label htmlFor="" className="form-label">
                  Email Id:
                </label>
                <input
                  type="email"
                  id=""
                  className={`form-control ${errors.email ? "is-invalid" : ""}`}
                  placeholder="Enter Email id"
                  name="email"
                  value={input.email}
                  onChange={inputHandler}
                />
                {errors.email && (
                  <div className="invalid-feedback">{errors.email}</div>
                )}
              </div>

              <div className="col col-12 col-sm-12 col-md-6 col-lg-4 col-xl-4 col-xxl-4">
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

              <div className="col col-12 col-sm-12 col-md-6 col-lg-4 col-xl-4 col-xxl-4">
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

              <div className="col col-sm-12 col-md-6 col-lg-4 col-xl-4 col-xxl-4">
                <label htmlFor="" className="form-label">
                  Dob
                </label>
                <input
                  type="date"
                  id=""
                  className={`form-control ${errors.dob ? "is-invalid" : ""}`}
                  placeholder="Enter Dob"
                  name="dob"
                  value={input.dob}
                  onChange={inputHandler}
                  max={new Date().toISOString().split("T")[0]}
                />
                {errors.dob && (
                  <div className="invalid-feedback">{errors.dob}</div>
                )}
              </div>

              <div className="col col-12 col-sm-12 col-md-6 col-lg-4 col-xl-4 col-xxl-4">
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
                  <option value="" disabled selected>
                    Select Qualification
                  </option>
                  <option value="BVSc_AH">
                    B.V.Sc & A.H (Bachelor of Veterinary Science & Animal
                    Husbandry)
                  </option>
                  <option value="MVSc">
                    M.V.Sc (Master of Veterinary Science)
                  </option>
                  <option value="MVSc_Dermatology">
                    M.V.Sc in Veterinary Dermatology
                  </option>
                  <option value="MVSc_Surgery">
                    M.V.Sc in Veterinary Surgery
                  </option>
                  <option value="DVM">
                    DVM (Doctor of Veterinary Medicine)
                  </option>
                  <option value="PhD_Dermatology">
                    PhD in Veterinary Dermatology
                  </option>
                  <option value="Diploma_Dermatology">
                    Diploma in Veterinary Dermatology
                  </option>
                  <option value="Diploma_Surgery">
                    Diploma in Veterinary Surgery
                  </option>
                </select>
                {errors.qualification && (
                  <div className="invalid-feedback">{errors.qualification}</div>
                )}
              </div>

              <div className="col col-12 col-sm-12 col-md-6 col-lg-4 col-xl-4 col-xxl-4">
                <label htmlFor="" className="form-label">
                  Specialization:
                </label>
                <select
                  id=""
                  className={`form-select ${
                    errors.specialization ? "is-invalid" : ""
                  }`}
                  name="specialization"
                  value={input.specialization}
                  onChange={inputHandler}
                >
                  <option value="" disabled selected>
                    Select Specialization
                  </option>
                  <option value="General Veterinarian">
                    General Veterinarian
                  </option>
                  <option value="Dermatologist">Dermatologist</option>
                  <option value="Veterinary Surgeon">Veterinary Surgeon</option>
                  <option value="Feline Specialist">Feline Specialist</option>
                  <option value="Pathologist">Pathologist</option>
                  <option value="Veterinary Microbiologist">
                    Microbiologist
                  </option>
                  <option value="Internal Medicine Specialist">
                    Internal Medicine Specialist
                  </option>
                  <option value="Veterinary Parasitologist">
                    Parasitologist
                  </option>
                </select>
                {errors.specialization && (
                  <div className="invalid-feedback">
                    {errors.specialization}
                  </div>
                )}
              </div>

              <div className="col col-12 col-sm-12 col-md-6 col-lg-4 col-xl-4 col-xxl-4">
                <label htmlFor="" className="form-label">
                  Current Experience:
                </label>
                <input
                  type="text"
                  className={`form-control ${
                    errors.experience ? "is-invalid" : ""
                  }`}
                  placeholder="Enter Current Experience"
                  name="experience"
                  value={input.experience}
                  onChange={inputHandler}
                />
                {errors.experience && (
                  <div className="invalid-feedback">{errors.experience}</div>
                )}
              </div>

              <div className="col col-12 col-sm-12 col-md-6 col-lg-4 col-xl-4 col-xxl-4">
                <label htmlFor="" className="form-label">
                  Password:
                </label>
                <input
                  type="password"
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

              <div className="col col-12 col-sm-12 col-md-6 col-lg-4 col-xl-4 col-xxl-4">
                <label htmlFor="" className="form-label">
                  Confirm Password:
                </label>
                <input
                  type="password"
                  className={`form-control ${
                    errors.cnf_password ? "is-invalid" : ""
                  }`}
                  placeholder="Confirm Password"
                  name="cnf_password"
                  value={input.cnf_password}
                  onChange={inputHandler}
                />
                {errors.cnf_password && (
                  <div className="invalid-feedback">{errors.cnf_password}</div>
                )}
              </div>

              <div className="col col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 col-xxl-12">
                <div className="col-12 text-end">
                  <button
                    className="btn btn-success w-45 px-4 border-overline mt-4 mb-3 p-2 my-btn"
                    onClick={readValues}
                  >
                    <i className="bi bi-person-plus me-2"></i> Add Doctor
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

export default DoctorSignUp;
