import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const UpdateDoctor = () => {
  const navigate = useNavigate();

  const [token] = useState(sessionStorage.getItem("token"));
  const [userType] = useState(sessionStorage.getItem("userType"));
  const [userId] = useState(sessionStorage.getItem("userId"));

  useEffect(() => {
    if (!token || userType !== "doctor") {
      alert("Access denied! Only doctor can access this page.");
      navigate("/");
    }
  }, [token, userType, navigate]);

  const [input, changeInput] = useState({
    fname: "",
    mname: "",
    lname: "",
    qualification: "",
    specialization: "",
    dob: "",
    oldPassword: "",
    newPassword: "",
    phone: "",
    gender: "",
    email: "",
    experience: "",
  });

  const fetchData = () => {
    axios
      .get(`http://localhost:4000/getDoctor/${userId}`, {
        headers: { token: token, "Content-Type": "application/json" },
      })
      .then((response) => {
        if (response.data.Status === "DoctorNotFound") {
          alert("Doctor Details not Found");
        } else if (response.data.Status === "Error") {
          alert("Error Fetching Doctor Details");
        } else {
          const doctorData = response.data.data || response.data;
          changeInput({
            fname: doctorData.fname || "",
            mname: doctorData.mname || "",
            lname: doctorData.lname || "",
            qualification: doctorData.qualification || "",
            specialization: doctorData.specialization || "",
            dob: doctorData.dob || "",
            oldPassword: "",
            newPassword: "",
            phone: doctorData.phone || "",
            gender: doctorData.gender || "",
            email: doctorData.email || "",
            experience: doctorData.experience || "",
          });
        }
      })
      .catch((error) => {
        console.error("Error fetching doctor:", error);
      });
  };

  useEffect(() => {
    fetchData();
  }, [token, userType, userId]);

  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    const phoneRegex = /^\d{10}$/;

    if (!input.fname.trim()) newErrors.fname = "First name is Required";
    if (!input.lname.trim()) newErrors.lname = "Last name is Required";

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

    if (input.oldPassword && !input.newPassword) {
      newErrors.newPassword = "New Password is required if old password is given";
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
        .put(`http://localhost:4000/updateDoctor/${userId}`, input, {
          headers: { token: token, "Content-Type": "application/json" },
        })
        .then((response) => {
          if (response.data.Status === "Success") {
            alert("Profile Updated Successfully")
            navigate("/doctorPanel/doctorProfile");
          } else if (response.data.Status === "InvalidOldPassword") {
            alert("Invalid Old Password !");
          } else if (response.data.Status === "PhoneAlreadyExists") {
            alert("Phone number already registered!");
          } else {
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
            <label className="form-label">First Name:</label>
            <input
              type="text"
              className={`form-control ${errors.fname ? "is-invalid" : ""}`}
              name="fname"
              value={input.fname}
              onChange={inputHandler}
            />
            {errors.fname && <div className="invalid-feedback">{errors.fname}</div>}
          </div>

          <div className="col-md-4">
            <label className="form-label">Middle Name:</label>
            <input
              type="text"
              className="form-control"
              name="mname"
              value={input.mname}
              onChange={inputHandler}
            />
          </div>

          <div className="col-md-4">
            <label className="form-label">Last Name:</label>
            <input
              type="text"
              className={`form-control ${errors.lname ? "is-invalid" : ""}`}
              name="lname"
              value={input.lname}
              onChange={inputHandler}
            />
            {errors.lname && <div className="invalid-feedback">{errors.lname}</div>}
          </div>

          <div className="col-md-6">
            <label className="form-label">Email:</label>
            <input type="email" className="form-control" value={input.email} readOnly />
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
            {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
          </div>

                   <div className="col-md-6">
            <label className="form-label">Qualification:</label>
            <select
              className={`form-select ${errors.qualification ? "is-invalid" : ""}`}
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

          <div className="col-md-6">
            <label className="form-label">Specialization:</label>
            <select
              className={`form-select ${errors.specialization ? "is-invalid" : ""}`}
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
              <div className="invalid-feedback">{errors.specialization}</div>
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
            {errors.gender && <div className="invalid-feedback">{errors.gender}</div>}
          </div>

          {/* DOB */}
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
            {errors.dob && <div className="invalid-feedback">{errors.dob}</div>}
          </div>

          <div className="col-md-4">
            <label className="form-label">Experience:</label>
            <input type="text" className="form-control" value={input.experience} readOnly />
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
              className={`form-control ${errors.newPassword ? "is-invalid" : ""}`}
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
              <i className="fa fa-stethoscope px-1"></i> Update Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateDoctor;
