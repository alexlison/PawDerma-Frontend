import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';

const SkinPrediction = () => {
  const navigate = useNavigate();
  const [token] = useState(sessionStorage.getItem("token"));
  const [userType] = useState(sessionStorage.getItem("userType"));
  const [userId] = useState(sessionStorage.getItem("userId"));

  console.log("token --->", token);

  useEffect(() => {
    if (!token || userType !== "cat_owner") {
      alert("Access denied! Only cat_owner can access this page.");
      navigate("/");
    }
  }, [token, userType, userId, navigate]);

  return (
    <div>
        <div className="container  p-5 pt-1 bg-light border rounded shadow mt-5 mb-5"
        style={{ maxWidth: "550px" }}>
            <h4 className="m-4 text-center">Skin Disease Booking</h4>
            <div className="row">
                <div className="col col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 col-xxl-12">
                    <div className="row g-3">
                        <div className="col col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 col-xxl-12">
                            <label htmlFor="" className="form-label">Cat:</label>
                            <select name="" id="" className="form-select">
                                <option value=""></option>
                                <option value=""></option>
                            </select>
                        </div>
                        <div className="col col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 col-xxl-12">
                            <label htmlFor="" className="form-label">Image:</label>
                            <input type="file" name="" id="" className="form-control" />
                        </div>
                        <div className="col col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 col-xxl-12">
                            <button className="btn btn my-btn">Submit</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default SkinPrediction;