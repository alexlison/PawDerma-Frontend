import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const MedicalRecords = () => {
  const navigate = useNavigate();

  const [token] = useState(sessionStorage.getItem("token"));
  const [userType] = useState(sessionStorage.getItem("userType"));
  const [userId] = useState(sessionStorage.getItem("userId"));

  const [cats, setCats] = useState([]);

  useEffect(() => {
    if (!token || userType !== "doctor") {
      alert("Access denied! Only doctors can access this page.");
      navigate("/");
    }
  }, [token, userType, navigate]);

  const fetchCompletedCats = () => {
    axios
      .post(
        "http://localhost:4000/doctorCompletedCats",
        { doctorId: userId },
        { headers: { token: token, "Content-Type": "application/json" } }
      )
      .then((response) => {
        if (response.data.Status === "Invalid Authentication") {
          alert("Invalid Authentication !");
          navigate("/");
        } else if (response.data.Status === "Error") {
          alert("Error in Fetching Completed Cats !");
        } else if (response.data.Status === "NotFound") {
          setCats([]);
        } else {
          setCats(response.data.data || []);
        }
      })
      .catch((error) => {
        console.log("Error --> ", error);
      });
  };

  useEffect(() => {
    fetchCompletedCats();
  }, []);

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12">
             <h3 className="text-center flex-grow-1 mt-3 mb-4 fs-5">
              <span className="px-1 fw-semi-bold fs-4 py-4">
                <i className="fa fa-paw me-2 text-secondary"></i>

                Consulted Cats
              </span>
            </h3>

          <div className="table-responsive" style={{ fontSize: "0.85rem" }}>
            <table className="table my-table small-table table-sm table-striped align-middle text-center">
              <thead className="table-light">
                <tr>
                  <th scope="col">Sl.No</th>
                  <th scope="col">Cat Name</th>
                  <th scope="col">Breed</th>
                  <th scope="col">Owner Name</th>
                  <th scope="col">Phone</th>
                  <th scope="col">Action</th>
                </tr>
              </thead>
              <tbody>
                {cats.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center">
                      No Completed Cats Found!
                    </td>
                  </tr>
                ) : (
                  cats.map((cat, index) => (
                    <tr key={cat.catId}>
                      <td>{index + 1}</td>
                      <td>{cat.catName}</td>
                      <td>{cat.breed}</td>
                      <td>{cat.ownerName}</td>
                      <td>{cat.phone}</td>
                      <td>
                        

                        <button
                          className="btn btn-primary btn-sm "
                          onClick={() =>
                            navigate(`/viewMedicalRecords/${cat.catId}`)
                          }
                        >
                         <i className="bi bi-file-medical me-2 me-2 my-color3 rounded"></i>
                          Medical Record 
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedicalRecords;
