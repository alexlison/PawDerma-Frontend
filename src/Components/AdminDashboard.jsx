import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {

  const navigate = useNavigate();

  const [token] = useState(sessionStorage.getItem("token"));
  const [userType] = useState(sessionStorage.getItem("userType"));
  

 console.log("Token --> ",token)

  useEffect(() => {
    if (!token || userType !== "admin") {
      alert("Access denied! Only admin can access this page.");
      navigate("/");
    }
  }, [token, userType, navigate]);
  return (
    <div>

        <div className="container">
            <div className="row">
                <div className="col col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 col-xxl-12">
                    <h4 className='text-center mt-5'>Welcome Admin 😊</h4>
                </div>
            </div>
        </div>
    </div>
  )
}

export default AdminDashboard