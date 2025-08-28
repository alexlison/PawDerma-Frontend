
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'


const SignIn = () => {

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
                  <input type="text" className="form-control pb-2" placeholder="Username" name='email'/>
                </div>
              </div>
              <div className="col col-12">
                <div className="input-group">
                  <span className="input-group-text">
                    <i className="bi bi-lock-fill"></i>
                  </span>
                  <input type="password" className="form-control pb-2" placeholder="Password" name='password'/>
                </div>
              </div>
              <div className="col col-12 text-center">
                <button className="btn w-100  mt-2 mb-1  my-btn">Login</button>
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
