
import axios from 'axios'
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'


const SignIn = () => {

  const navigate = useNavigate()

  const [errors,setErrors] = useState({})  

const [input,changeInput] = useState(
  { 
    email: "",
    password: "" 
}
)


const validate = () => {

  const newErrors = {}
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
   if (!input.email.trim()) {
      newErrors.email = "Email is required";
  } else if (!emailRegex.test(input.email)) {
      newErrors.email = "Please enter a valid email";
  }   
  if(!input.password.trim()) newErrors.password = "password  is Required"

  setErrors(newErrors)

  return Object.keys(newErrors).length === 0
}

const inputHandler = (event) => {

  changeInput({...input,[event.target.name]:event.target.value})

  if(errors[event.target.name])

    setErrors({...errors,[event.target.name]:""})
}


const readValues = () =>{

  if(validate())
  {
     axios.post("http://localhost:4000/signin",input).then(
    (response) => {

      if (response.data.Status === "InvalidEmail") {

        alert("Invalid Email Id")
        
      } else if(response.data.Status === "Incorrectpassword"){

        alert("Incorrect Password")
        
      }
      else{

        let token = response.data.token
        let userId = response.data.userId
        let userType = response.data.userType

        sessionStorage.setItem("userId",userId)
        sessionStorage.setItem("token",token)
        sessionStorage.setItem("userType",userType)

           if (userType === "cat_owner") {
            navigate("/home");
          } else if (userType === "doctor") {
            navigate("/doctorhome");
          } else if (userType === "attender") {
            navigate("/attenderhome");
          } else if (userType === "admin") {
            navigate("/adminhome");
          } else {
            navigate("/home");
          }

        

      }

    }
  ).catch(
      (error) => {
            console.log(error)
        }
  )
    
  }

 
}

  return (
    <div>

          <div className="signin-page">
      <div className="signin-container mt-5 p-4 px-5  bg-light border rounded shadow" style={{ maxWidth: '400px' }}>
        
     <div className="text-center mb-3">
  <i className="bi bi-person-circle fs-1 my-icon"></i>
  <h4 className="mt-2 fw-bold text-dark">Login</h4>
</div>

        <div className="row">
          <div className="col col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 col-xxl-12">
            <div className="row g-3">
              <div className="col col-12">
                <div className="input-group">
                  <span className="input-group-text">
                    <i className="bi bi-person-fill"></i>
                  </span>
                  <input type="text" className={`form-control ${errors.email ? "is-invalid" : ""}`} placeholder="Username" name='email' value={input.email} onChange={inputHandler} />
                </div>
                 {errors.email && <div className="invalid-feedback d-block">{errors.email}</div>}

              </div>
              <div className="col col-12">
                <div className="input-group">
                  <span className="input-group-text">
                    <i className="bi bi-lock-fill"></i>
                  </span>
                  <input type="password"  className={`form-control ${errors.password ? "is-invalid" : ""}`} placeholder="Password" name='password' value={input.password} onChange={inputHandler}/>
                </div>
                {errors.password && <div className="invalid-feedback d-block">{errors.password}</div>}
              </div>
              <div className="col col-12 text-center">
                <button className="btn w-100  mt-2 mb-1  my-btn" onClick={readValues}>Login</button>
              </div>
              <div className="col col-12 text-center">
                <small>
                  Don't have an account? <Link to="/SignUp" className="text-decoration-none m-1 fw-bold my-link"> Sign Up</Link>
                </small>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  )
}

export default SignIn;
