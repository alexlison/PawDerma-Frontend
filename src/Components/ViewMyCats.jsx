import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const ViewMyCats = () => {
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

  const [catData, changeCatData] = useState([]);

  const fetchData = () => {
    axios
      .post(
        "http://localhost:4000/viewMyCats",
        { userId },
        { headers: { token: token, "Content-Type": "application/json" } }
      )
      .then((response) => {
        if (response.data.Status === "Invalid Authentication") {
          alert("Invalid Authentication");
          navigate("/");
        } else if (response.data.Status === "Error") {
          alert("Error in Fetching Cat Data !");
        } else {
          changeCatData(response.data);
        }
      })
      .catch((err) => {
        console.log("Error --> ", err);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      <div className="container p-5 pt-1 bg-light border rounded shadow mt-5 mb-5">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h4 className="text-center flex-grow-1 fa fa-cat mt-3 mb-1 fs-4">
            <span className="px-3 fw-semi-bold fs-4 py-4 my-font text-dark">
              My Cats
            </span>
          </h4>

          <Link
            to="/home/addcat"
            className="my-add-btn text-decoration-none mt-5"
          >
            <i className="bi bi-plus-circle me-1 icon"> Add Cat</i>
          </Link>
        </div>

        <div className="row my-card">
          <div className="col-12">
            {catData.length === 0 ? (
              <p className="text-center text-muted">No cats found.</p>
            ) : (
              catData.map((value, index) => (
                <div key={index} className="card mb-3 shadow-sm">
                  <div className="row g-0 align-items-center">
                    <div className="col-md-4 d-flex justify-content-center p-3">
                      <div className="cat-frame">
                        <img
                          src={`http://localhost:4000${value.image}`}
                          className="cat-image"
                          alt={value.name}
                        />
                      </div>
                    </div>

                    <div className="col-md-8">
                      <div className="card-body cat-details-card position-relative">
                        <Link
                          to={`/home/editcat/${value._id}`}
                          className="edit-icon"
                        >
                          <i className="bi bi-pencil-square"></i>
                        </Link>

                        <h5 className="card-title">{value.name}</h5>
                        <p className="card-text mb-1">
                          <strong>Breed:</strong> {value.breed}
                        </p>
                        <p className="card-text mb-1">
                          <strong>Color:</strong> {value.color}
                        </p>
                        <p className="card-text mb-1">
                          <strong>Gender:</strong> {value.gender}
                        </p>
                        <p className="card-text mb-1">
                            <strong>DOB:</strong> {value.dob ? value.dob.split("T")[0] : "-"}
                        </p>

                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewMyCats;
