import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const ViewMedicalRecords = () => {
  const navigate = useNavigate();
  const { catId } = useParams();
  const [token] = useState(sessionStorage.getItem("token"));
  const [userType] = useState(sessionStorage.getItem("userType"));
  const [records, setRecords] = useState([]);

  useEffect(() => {
    if (!token || userType !== "doctor") {
      alert("Access denied! Only doctors can access this page.");
      navigate("/");
    }
  }, [token, userType, navigate]);

  const fetchRecords = () => {
    if (!catId) return;
    axios
      .get(`http://localhost:4000/medicalRecords/${catId}`, {
        headers: { token, "Content-Type": "application/json" },
      })
      .then((res) => {
        if (res.data.Status === "Success") {
          setRecords(res.data.data);
        } else if (res.data.Status === "NotFound") {
          alert("No Completed Records Found for this Cat!");
        } else if (res.data.Status === "Invalid Authentication") {
          alert("Invalid Authentication!");
          navigate("/");
        } else {
          alert("Error Fetching Medical Records!");
        }
      })
      .catch((err) => console.error("Error fetching records:", err));
  };

  useEffect(() => {
    fetchRecords();
  }, [catId]);

  return (
    <div className="container mt-4">
      <button
        onClick={() => navigate(-1)}
        className="btn btn-link mb-3 fw-semibold text-dark text-decoration-none"
      >
        <i className="bi bi-arrow-left-circle-fill fs-5"></i> Back
      </button>

      <h3 className="text-center flex-grow-1 mt-3 mb-4 fs-5">
        <span className="px-1 fw-semi-bold fs-4 py-4">
          <i className="fa-solid fa-file-medical me-2 text-secondary"></i>
          Medical Records
        </span>
      </h3>

      <div className="card shadow-sm my-color10 p-4">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-sm table-striped align-middle text-center mb-0 compact-table">
              <thead className="table-light">
                <tr>
                  <th className="compact-th py-3">Sl.No</th>
                  <th className="compact-th py-3">Date</th> 
                  <th className="compact-th py-3">Type</th>
                  <th className="compact-th py-3">Cat Name</th>
                  <th className="compact-th py-3">Breed</th>
                  <th className="compact-th py-3">Owner</th>
                  <th className="compact-th py-3">Phone</th>
                  <th className="compact-th py-3">Status</th>
                  <th className="compact-th py-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {records.length === 0 ? (
                  <tr>
                    <td colSpan="9" className="text-center py-4">
                      <i className="fa-solid fa-folder-open text-muted me-2"></i>
                      No Records Found!
                    </td>
                  </tr>
                ) : (
                  records.map((rec, idx) => (
                    <tr key={rec.appointmentId}>
                      <td className="compact-td">{idx + 1}</td>
                      <td className="compact-td py-3">
                        {rec.date
                          ? new Date(rec.date).toLocaleDateString()
                          : "N/A"}
                      </td>
                      <td className="compact-td">
                        <span className={`badge ${rec.bookingType === 'VACCINATION' ? 'bg-success' : 'bg-info'} text-white badge-small`}>
                          {rec.bookingType}
                        </span>
                      </td>
                      <td className="compact-td">{rec.catName}</td>
                      <td className="compact-td">{rec.breed}</td>
                      <td className="compact-td">{rec.ownerName}</td>
                      <td className="compact-td">{rec.phone}</td>
                      <td className="compact-td">
                        <span className="badge bg-success text-white badge-small">
                          {rec.status}
                        </span>
                      </td>
                      <td className="compact-td">
                        {rec.recordAction.type === "prescription" ? (
                          <button
                            className="btn btn-primary btn-sm shadow-sm btn-small"
                            onClick={() =>
                              navigate(`/viewPrescription/${rec.appointmentId}`)
                            }
                          >
                            <i className="bi bi-eye-fill me-1 fs-7"></i>
                            View Prescription
                          </button>
                        ) : (
                          <div className="p-1 m-2 border border-success rounded bg-light shadow-sm vaccination-card">
                            <div className="d-flex align-items-center justify-content-center mb-1">
                              <i className="fa-solid fa-syringe text-success me-1 icon-small"></i>
                              <strong className="text-success">{rec.recordAction.vaccineName}</strong>
                            </div>
                            <div className="text-center">
                              <span className="text-muted  fs-7">
                                <i className="fa-solid fa-user-doctor me-1 text-danger"></i>
                                {rec.recordAction.attender}
                              </span>
                            </div>
                          </div>
                        )}
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

export default ViewMedicalRecords;