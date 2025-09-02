import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const ViewCatOwners = () => {
  const navigate = useNavigate();

  const [token, changeToken] = useState(sessionStorage.getItem("token"));
  const [userType, changeUserType] = useState(
    sessionStorage.getItem("userType")
  );

  useEffect(() => {
    if (!token || userType !== "admin") {
      alert("Access denied! Only admins can access this page.");
      navigate("/");
    }
  });



  const handleToggleStatus  = (id) => {

    axios.post("http://localhost:4000/catOwnerStatusUpdate",{ _id: id }, 
      { headers: { token: token, "Content-Type": "application/json" } }).then((response) => {

      if(response.data.Status === "IdNotFound")
      {
        console.log("Error getting the Id !")

      }else if(response.data.Status === "UserNotFound")
      {
        console.log("User Not Found !")
      }else {
             
        fetchData();

      }

    }).catch()

  }

  const [input, changeInput] = useState([]);

  const fetchData = () => {
    axios
      .post(
        "http://localhost:4000/viewCatOwners",
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
          changeInput(response.data);
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


    const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };


  return (
    <div>
      <div className="container">
        <div className="row">
          <div className="col col-12 col-md-12 col-lg-12 col-xl-12 col-xxl-12">
            <h3 className="text-center bi bi-people-fill mt-3 mb-3 pb-1 fs-3"> Catowners List</h3>
            <div className="table-responsive">
            <table className="table my-table table-striped">
              <thead>
                <tr>
                  <th scope="col">Sl.No</th>
                  <th scope="col">Name</th>
                  <th scope="col">Email</th>
                  <th scope="col">Phone</th>
                  <th scope="col">Gender</th>
                  <th scope="col">Address</th>
                  <th scope="col">Join Date</th>
                  <th scope="col">Status</th>
                  <th scope="col">Action</th>
                </tr>
              </thead>
              <tbody>
                {input.map((value, index) => {
                  return (
                    <tr>
                      <td>{index + 1}</td>
                      <td>
                        {value.fname} {value.mname && value.mname + " "}{" "}
                        {value.lname}
                      </td>
                      <td>{value.email}</td>
                      <td>{value.phone}</td>
                      <td>{value.gender}</td>
                      <td>
                        {value.address.street}, {value.address.city},{" "}
                        {value.address.state} - {value.address.pincode}
                      </td>
                      <td><td>{formatDate(value.join_date)}</td></td>
                      <td>{value.status ? "Active" : "Inactive"}</td>
                      <td
                        className="position-relative text-center toggle-cell"
                          onClick={() => handleToggleStatus(value._id)}
>
                        <i
                          className={`bi ${ value.status ? "bi-toggle-on text-success" : "bi-toggle-off text-danger" } toggle-icon`}
                        ></i>
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

export default ViewCatOwners;
