import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const SignUp = () => {

const navigate = useNavigate()

const [errors,setErrors] = useState({})  

const [input,changeInput] = useState(
    {
        fname: "",
        mname: "",
        lname: "",
        email: "",
        dob: "",
        gender: "",
        phone : "",
        state: "",
        city: "",
        street: "",
        pincode: "",
        password: "", 
        cnf_password:""

    }
)


const validate = () => {

  const newErrors = {}
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^\d{10}$/;
  
  if (!input.fname.trim()) newErrors.fname = "First Name is Required"
  if (!input.lname.trim()) newErrors.lname = "Last Name is Required"
  if (!input.email.trim()) {
      newErrors.email = "Email is required";
  } else if (!emailRegex.test(input.email)) {
      newErrors.email = "Please enter a valid email";
  }    
  if (!input.dob) newErrors.dob = "Date of birth is required";
  if (!input.gender) newErrors.gender = "Gender is required";
  
  if (!input.phone.trim()) {
    newErrors.phone = "Phone number is required";    
  } else if(!phoneRegex.test(input.phone)) 
  {
    newErrors.phone = "Please enter a valid 10-digit phone number";
    
  }
    if (!input.state.trim()) newErrors.state = "State is required";
    if (!input.city.trim()) newErrors.city = "City is required";
    if (!input.street.trim()) newErrors.street = "Street is required";
    if (!input.pincode.trim()) newErrors.pincode = "Pincode is required";
    if (!input.password) {
      newErrors.password = "Password is required";
    } else if (input.password.length < 4) {
      newErrors.password = "Password must be at least 4 characters";
    }
    if (!input.cnf_password) {
      newErrors.cnf_password = "Confirm Password is required";
    }

  setErrors(newErrors)

  return Object.keys(newErrors).length === 0

}

const inputHandler = (event) => {
    changeInput({...input,[event.target.name]: event.target.value })

    if(errors[event.target.name])
    {
      setErrors({...errors,[event.target.name]:"" })
    }
    
}
 
const readValues = () => {
  if (validate()) {
    if (input.password !== input.cnf_password) {
      alert("Password and Confirm Password do not match!");
      return; 
    }

   
    let newInput = { 
      "fname": input.fname,
      "mname": input.mname,
      "lname": input.lname,
      "email": input.email,
      "dob": input.dob,
      "gender": input.gender,
      "phone": input.phone,
      "state": input.state,
      "city": input.city,
      "street": input.street,
      "pincode": input.pincode,
      "password": input.password
    };
    
    axios.post("http://localhost:4000/signup", newInput)
      .then((response) => {
        if(response.data.Status === "Success") {
          alert("Registration Successful");
          navigate("/")
          
        
        } else if(response.data.Status === "EmailExists") {
          alert("Email address already registered!");
        } else if(response.data.Status === "PhoneExists") {
          alert("Phone number already registered!");
        } else {
          alert("Registration failed. Please try again.");
        }
      })
      .catch((error) => {
        console.error('Registration error:', error);
        alert("An error occurred during registration. Please try again.");
      });
  }
}




  return (
  <div>
    
      <div
        className="container p-5 pt-1 bg-light border rounded shadow mt-5 mb-5"
        style={{ maxWidth: "950px" }}
      >
        <h4 className="m-5 text-center">SignUp</h4>
        <div className="row">
          <div className="col col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 col-xxl-12">
            <div className="row g-4">
              <div className="col col-12 col-sm-12 col-md-4 col-lg-4 col-xl-4 col-xxl-4">
                <label htmlFor="" className="form-label">
                  First Name :
                </label>
                <input
                  type="text"
                  placeholder="Enter first name"
                  className={`form-control ${errors.fname ? "is-invalid" : ""}`}
                  name="fname"
                  value={input.fname}
                  onChange={inputHandler}
                />
                {errors.fname && <div className="invalid-feedback">{errors.fname}</div>}
              </div>

              <div className="col col-12 col-sm-12 col-md-4 col-lg-4 col-xl-4 col-xxl-4">
                <label htmlFor="" className="form-label">
                  Middle Name :
                </label>
                <input
                  type="text"
                  placeholder="Enter middle name"
                  className="form-control"
                  name="mname"
                  value={input.mname}
                  onChange={inputHandler}
                />
              </div>

              <div className="col col-12 col-sm-12 col-md-4 col-lg-4 col-xl-4 col-xxl-4">
                <label htmlFor="" className="form-label">
                  Last Name :
                </label>
                <input
                  type="text"
                  placeholder="Enter last name"
                  className={`form-control ${errors.lname ? "is-invalid" : ""}`}
                  name="lname"
                  value={input.lname}
                  onChange={inputHandler}
                />
                {errors.lname && <div className="invalid-feedback">{errors.lname}</div>}
              </div>

              <div className="col col-12 col-sm-12 col-md-4 col-lg-4 col-xl-4 col-xxl-4">
                <label htmlFor="" className="form-label">
                  Email Id :
                </label>
                <input
                  type="email"
                  placeholder="Enter email id"
                  className={`form-control ${errors.email ? "is-invalid" : ""}`}
                  name="email"
                  value={input.email}
                  onChange={inputHandler}
                />
                {errors.email && <div className="invalid-feedback">{errors.email}</div>}
              </div>

              <div className="col col-12 col-sm-12 col-md-4 col-lg-4 col-xl-4 col-xxl-4">
                <label htmlFor="" className="form-label">
                  Dob :
                </label>
                <input
                  type="date"
                  className={`form-control ${errors.dob ? "is-invalid" : ""}`}
                  name="dob"
                  value={input.dob}
                  onChange={inputHandler}
                />
                {errors.dob && <div className="invalid-feedback">{errors.dob}</div>}
              </div>

              <div className="col col-12 col-sm-12 col-md-4 col-lg-4 col-xl-4 col-xxl-4">
                <label htmlFor="" className="form-label">
                  Gender :
                </label>
                <select
                  className={`form-select ${errors.gender ? "is-invalid" : ""}`}
                  name="gender"
                  value={input.gender}
                  onChange={inputHandler}
                  max={new Date().toISOString().split("T")[0]} 
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

              <div className="col col-12 col-sm-12 col-md-4 col-lg-4 col-xl-4 col-xxl-4">
                <label htmlFor="" className="form-label">
                  Phone :
                </label>
                <input
                  type="text"
                  className={`form-control ${errors.phone ? "is-invalid" : ""}`}
                  placeholder="Enter phone number"
                  name="phone"
                  value={input.phone}
                  onChange={inputHandler}
                />
                {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
              </div>

              <div className="col col-12 col-sm-12 col-md-4 col-lg-4 col-xl-4 col-xxl-4">
                <label htmlFor="" className="form-label">
                  State :
                </label>
                <input
                  type="text"
                  className={`form-control ${errors.state ? "is-invalid" : ""}`}
                  placeholder="Enter State"
                  name="state"
                  value={input.state}
                  onChange={inputHandler}
                />
                {errors.state && <div className="invalid-feedback">{errors.state}</div>}
              </div>

              <div className="col col-12 col-sm-12 col-md-4 col-lg-4 col-xl-4 col-xxl-4">
                <label htmlFor="" className="form-label">
                  City :
                </label>
                <input
                  type="text"
                  className={`form-control ${errors.city ? "is-invalid" : ""}`}
                  placeholder="Enter City"
                  name="city"
                  value={input.city}
                  onChange={inputHandler}
                />
                {errors.city && <div className="invalid-feedback">{errors.city}</div>}
              </div>

              <div className="col col-12 col-sm-12 col-md-4 col-lg-4 col-xl-4 col-xxl-4">
                <label htmlFor="" className="form-label">
                  Street :
                </label>
                <input
                  type="text"
                  className={`form-control ${errors.street ? "is-invalid" : ""}`}
                  placeholder="Enter Street"
                  name="street"
                  value={input.street}
                  onChange={inputHandler}
                />
                {errors.street && <div className="invalid-feedback">{errors.street}</div>}
              </div>

              <div className="col col-12 col-sm-12 col-md-4 col-lg-4 col-xl-4 col-xxl-4">
                <label htmlFor="" className="form-label">
                  Pincode :
                </label>
                <input
                  type="text"
                  className={`form-control ${errors.pincode ? "is-invalid" : ""}`}
                  placeholder="Enter Pincode"
                  name="pincode"
                  value={input.pincode}
                  onChange={inputHandler}
                />
                {errors.pincode && <div className="invalid-feedback">{errors.pincode}</div>}
              </div>

              <div className="col col-12 col-sm-12 col-md-4 col-lg-4 col-xl-4 col-xxl-4">
                <label htmlFor="" className="form-label">
                  Password :
                </label>
                <input
                  type="password"
                  placeholder="Enter password (min 6 characters)"
                  className={`form-control ${errors.password ? "is-invalid" : ""}`}
                  name="password"
                  value={input.password}
                  onChange={inputHandler}
                />
                {errors.password && <div className="invalid-feedback">{errors.password}</div>}
              </div>

              <div className="col col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 col-xxl-12">
                <label htmlFor="" className="form-label">
                  Confirm Password :
                </label>
                <input
                  type="password"
                  placeholder="Confirm password"
                  className={`form-control ${errors.cnf_password ? "is-invalid" : ""}`}
                  name="cnf_password"
                  value={input.cnf_password}
                  onChange={inputHandler}
                />
                {errors.cnf_password && (
                  <div className="invalid-feedback">{errors.cnf_password}</div>
                )}
              </div>

              <div className="col col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 col-xxl-12">
                <div className="d-flex justify-content-center">
                  <button
                    className="btn btn-success px-4 w-100 border-overline mt-2 mb-3 p-2 my-btn"
                    onClick={readValues}
                  >
                    SignUp
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

export default SignUp;
