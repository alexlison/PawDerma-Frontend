import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const ViewAllCats = () => {
  const navigate = useNavigate();

  const [token, changeToken] = useState(sessionStorage.getItem("token"));
  const [userType, changeUserType] = useState(sessionStorage.getItem("userType"));

  useEffect(() => {
    if (!token || userType !== "admin") {
      alert("Access denied! Only admins can access this page.");
      navigate("/");
    }
  });

  const [CatData, changeCatData] = useState([]);

  const fetchData = () => {
    axios
      .post(
        "http://localhost:4000/viewCats",
        {},
        { headers: { token: token, "Content-Type": "application/json" } }
      )
      .then((response) => {
        if (response.data.Status === "Invalid Authentication") {
          alert("Invalid Authentication !");
          navigate("/");
        } else if (response.data.Status === "Error") {
          alert("Error in Fetching CatOwners Data !");
        } else {
          changeCatData(response.data);
          console.log(response.data);
        }
      })
      .catch((error) => {
        console.log("Error --> ", error);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      <div className="container-fluid">
        <div className="row">
          <div className="col col-12 col-md-12 col-lg-12 col-xl-12 col-xxl-12">
        <div className="d-flex justify-content-between align-items-center mb-3">
             <h4 className="text-center flex-grow-1 fa fa-cat mt-3 mb-1 fs-4">
            <span className="px-3 fw-semi-bold fs-4 py-4 my-font text-dark">
              My Cats
            </span>
          </h4>
          </div>
            <div className="table-responsive">
            <table className="table my-table small-table table-sm table-striped align-middle text-center">
              <thead className="table-light">
                <tr>
                  <th scope="col" className="text-center">Sl.No</th>
                  <th scope="col" className="text-center">Image</th>
                  <th scope="col">Cat Name</th>
                  <th scope="col">CatOwner Name</th>
                 
                  <th scope="col" className="text-center">Dob</th>
                  <th scope="col">Breed</th>
                  <th scope="col">Color</th>
                   <th scope="col" className="text-center">Gender</th>
                </tr>
              </thead>
              <tbody>
                {CatData.map((value, index) => {
                  return (
                    <tr key={index}>
                      <td className="text-center fw-bold">{index + 1}</td>
                      <td className="text-center p-2">      
                        <div className="d-flex justify-content-center">
                          <img
                            src={`http://localhost:4000${value.image}`}
                            className="img-fluid rounded"
                            alt={value.name}
                            style={{ maxHeight: '80px', width: 'auto', maxWidth: '80px' }}
                          />
                        </div>
                      </td>
                      <td className="fw-semibold">{value.name}</td>
                      <td>{value.catOwner_id.fname} {value.catOwner_id.lname}</td>
                  
                      <td className="text-center">{value.dob ? value.dob.split("T")[0] : "-"}</td>
                      <td>
                        <span className="td-badge my-color4">
                          {value.breed}
                        </span>
                      </td>
                  
                      <td>
                        <span className="td-badge my-color3 border">
                          {value.color}
                        </span>
                      </td>
                        <td className="text-center">
                        <span className={`td-badge ${value.gender === 'Male' ? 'my-color1' : 'my-color2'}`}>
                          {value.gender}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewAllCats;