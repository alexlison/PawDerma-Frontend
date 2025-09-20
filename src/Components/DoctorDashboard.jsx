import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const DoctorDashboard = () => {
  const navigate = useNavigate();

  const [token] = useState(sessionStorage.getItem("token"));
  const [userType] = useState(sessionStorage.getItem("userType"));
  const [userId] = useState(sessionStorage.getItem("userId"));

  const [doctorName, setDoctorName] = useState("Doctor");

  useEffect(() => {
    if (!token || userType !== "doctor") {
      alert("Access denied! Only doctor can access this page.");
      navigate("/");
    }
  }, [token, userType, navigate]);

  useEffect(() => {
    if (userId) {
      axios.post("http://localhost:4000/getDoctorById", { id: userId }, {
        headers: { token }
      })
      .then((res) => {
        if (res.data.Status === "Success") {
          const user = res.data.data;
          setDoctorName(user.fname);
        }
      })
      .catch(err => console.error("Error fetching doctor:", err));
    }
  }, [userId, token]);

  return (
    <div>
      <h4 className="text-center mb-5 mt-4 fw-bold">
        Welcome <span className="text-my-primary">{doctorName} 😊</span>
      </h4>
    </div>
  );
};

export default DoctorDashboard;
