import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AttenderDashboard = () => {
  const [attenderName, setAttenderName] = useState("Attender");

  const navigate = useNavigate();

  const [token] = useState(sessionStorage.getItem("token"));
  const [userId] = useState(sessionStorage.getItem("userId"));
  const [userType] = useState(sessionStorage.getItem("userType"));
  

  console.log("Token -->",token)

  useEffect(() => {
    if (!token || userType !== "attender") {
      alert("Access denied! Only Attenders can access this page.");
      navigate("/");
    }
  }, [token, userType, navigate]);

  useEffect(() => {
    if (userId) {
      axios.post("http://localhost:4000/getAttenderById", { id: userId }, {
        headers: { token }
      })
      .then((res) => {
        if (res.data.Status === "Success") {
          const user = res.data.data;
          setAttenderName(user.Name);
        }
      })
      .catch(err => console.error("Error fetching attender:", err));
    }
  }, [userId, token]);

  return (
    <div className="text-center mt-5">
      <h2>
        Welcome <span className="text-my-primary">{attenderName}</span> 😊
      </h2>
    </div>
  );
};

export default AttenderDashboard;
