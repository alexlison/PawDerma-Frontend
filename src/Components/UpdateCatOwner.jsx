import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const UpdateCatOwner = () => {
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [input, setInput] = useState({
    id: "",
    fname: "",
    mname: "",
    lname: "",
    email: "",
    dob: "",
    gender: "",
    phone: "",
    state: "",
    city: "",
    street: "",
    pincode: "",
    oldPassword: "",
    newPassword: "",
  });

  const token = sessionStorage.getItem("token");
  const userId = sessionStorage.getItem("userId");

  // Fetch user details
  useEffect(() => {
    if (!userId) {
      alert("No userId found, please login again.");
      navigate("/");
      return;
    }

    axios
      .post("http://localhost:4000/getCatOwnerById", { id: userId })
      .then((res) => {
        if (res.data.Status === "Success") {
          const data = res.data.data;
          const address = data.address || {};
          setInput({
            id: data._id || "",
            fname: data.fname || "",
            mname: data.mname || "",
            lname: data.lname || "",
            email: data.email || "",
            dob: data.dob ? data.dob.split("T")[0] : "",
            gender: data.gender || "",
            phone: data.phone || "",
            state: address.state || "",
            city: address.city || "",
            street: address.street || "",
            pincode: address.pincode || "",
            oldPassword: "",
            newPassword: "",
          });
        } else {
          alert("Failed to fetch details");
        }
      })
      .catch((err) => console.error(err));
  }, [userId, navigate]);

  const inputHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: "" });
  };

  const validate = () => {
    const newErrors = {};
    const phoneRegex = /^\d{10}$/;

    if (!input.fname.trim()) newErrors.fname = "First Name is required";
    if (!input.lname.trim()) newErrors.lname = "Last Name is required";
    if (!input.dob) newErrors.dob = "Date of birth is required";
    if (!input.gender) newErrors.gender = "Gender is required";
    if (!input.phone.trim()) newErrors.phone = "Phone number is required";
    else if (!phoneRegex.test(input.phone))
      newErrors.phone = "Phone must be 10 digits";
    if (!input.state.trim()) newErrors.state = "State is required";
    if (!input.city.trim()) newErrors.city = "City is required";
    if (!input.street.trim()) newErrors.street = "Street is required";
    if (!input.pincode.trim()) newErrors.pincode = "Pincode is required";

    if (input.oldPassword || input.newPassword) {
      if (!input.oldPassword) newErrors.oldPassword = "Old password required";
      if (!input.newPassword) newErrors.newPassword = "New password required";
      else if (input.newPassword.length < 6)
        newErrors.newPassword = "New password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const submitUpdate = () => {
    if (!validate()) return;

    axios
      .put(
        "http://localhost:4000/updateCatOwner",
        {
          ...input,
          address: {
            state: input.state,
            city: input.city,
            street: input.street,
            pincode: input.pincode,
          },
        },
        { headers: { token: token } }
      )
      .then((res) => {
        if (res.data.Status === "Success") {
          alert("Profile updated successfully!");
          navigate("/home");
        } else if (res.data.Status === "InvalidOldPassword") {
          alert("Old password is incorrect");
        } else if (res.data.Status === "PhoneAlreadyExists") {
          alert("Phone number already exists");
        } else {
          alert("Update failed: " + res.data.Status);
        }
      })
      .catch((err) => console.error(err));
  };

  return (
    <div>
      <div
        className="container p-5 pt-1 bg-light border rounded shadow mt-5 mb-5"
        style={{ maxWidth: "950px" }}
      >
        <h4 className="m-4 mt-5 my-formheading text-center">Update Profile</h4>
        <hr className="mb-5 mt-4 my-hr" />

        <div className="row g-4">
          <div className="col col-12 col-md-4">
            <label className="form-label">First Name :</label>
            <input
              type="text"
              className={`form-control ${errors.fname ? "is-invalid" : ""}`}
              name="fname"
              value={input.fname}
              onChange={inputHandler}
            />
            {errors.fname && (
              <div className="invalid-feedback">{errors.fname}</div>
            )}
          </div>

          <div className="col col-12 col-md-4">
            <label className="form-label">Middle Name :</label>
            <input
              type="text"
              className="form-control"
              name="mname"
              value={input.mname}
              onChange={inputHandler}
            />
          </div>

          <div className="col col-12 col-md-4">
            <label className="form-label">Last Name :</label>
            <input
              type="text"
              className={`form-control ${errors.lname ? "is-invalid" : ""}`}
              name="lname"
              value={input.lname}
              onChange={inputHandler}
            />
            {errors.lname && (
              <div className="invalid-feedback">{errors.lname}</div>
            )}
          </div>

          <div className="col col-12 col-md-4">
            <label className="form-label">Email :</label>
            <input
              type="text"
              className="form-control"
              value={input.email}
              disabled
            />
          </div>

          <div className="col col-12 col-md-4">
            <label className="form-label">DOB :</label>
            <input
              type="date"
              className={`form-control ${errors.dob ? "is-invalid" : ""}`}
              name="dob"
              value={input.dob}
              onChange={inputHandler}
            />
            {errors.dob && <div className="invalid-feedback">{errors.dob}</div>}
          </div>

          <div className="col col-12 col-md-4">
            <label className="form-label">Gender :</label>
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

          <div className="col col-12 col-md-4">
            <label className="form-label">Phone :</label>
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

          <div className="col col-12 col-md-4">
            <label className="form-label">State :</label>
            <input
              type="text"
              className={`form-control ${errors.state ? "is-invalid" : ""}`}
              name="state"
              value={input.state}
              onChange={inputHandler}
            />
            {errors.state && (
              <div className="invalid-feedback">{errors.state}</div>
            )}
          </div>

          <div className="col col-12 col-md-4">
            <label className="form-label">City :</label>
            <input
              type="text"
              className={`form-control ${errors.city ? "is-invalid" : ""}`}
              name="city"
              value={input.city}
              onChange={inputHandler}
            />
            {errors.city && (
              <div className="invalid-feedback">{errors.city}</div>
            )}
          </div>

          <div className="col col-12 col-md-4">
            <label className="form-label">Street :</label>
            <input
              type="text"
              className={`form-control ${errors.street ? "is-invalid" : ""}`}
              name="street"
              value={input.street}
              onChange={inputHandler}
            />
            {errors.street && (
              <div className="invalid-feedback">{errors.street}</div>
            )}
          </div>

          <div className="col col-12 col-md-4">
            <label className="form-label">Pincode :</label>
            <input
              type="text"
              className={`form-control ${errors.pincode ? "is-invalid" : ""}`}
              name="pincode"
              value={input.pincode}
              onChange={inputHandler}
            />
            {errors.pincode && (
              <div className="invalid-feedback">{errors.pincode}</div>
            )}
          </div>

          <div className="col col-12 col-md-4">
            <label className="form-label">Old Password :</label>
            <input
              type="password"
              className={`form-control ${
                errors.oldPassword ? "is-invalid" : ""
              }`}
              name="oldPassword"
              value={input.oldPassword}
              onChange={inputHandler}
            />
            {errors.oldPassword && (
              <div className="invalid-feedback">{errors.oldPassword}</div>
            )}
          </div>

          <div className="col col-12 col-md-4">
            <label className="form-label">New Password :</label>
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

          <div
            className="col-12 d-flex justify-content-end mt-5"
            style={{ gap: "10px" }}
          >
            <button
              className="btn btn-outline-warning text-my-color1 px-4"
              onClick={() => navigate(-1)}
            >
              Cancel
            </button>
            <button
              className="btn btn-success px-4 border-overline my-btn2"
              onClick={submitUpdate}
            >
              <i className="bi bi-person-plus me-2"></i> Update Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateCatOwner;
