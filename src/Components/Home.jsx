import axios from 'axios';
import React, { useState, useRef, useEffect } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';

const Home = () => {
    const navigate = useNavigate();
    const [token] = useState(sessionStorage.getItem("token"));
    const [userType] = useState(sessionStorage.getItem("userType"));
    const [userId] = useState(sessionStorage.getItem("userId"));
  
    console.log("token --->", token);
  
     const [fullName, setFullName] = useState("User");

    useEffect(() => {
      if (!token || userType !== "cat_owner") {
        alert("Access denied! Only cat_owner can access this page.");
        navigate("/");
      }
    }, [token, userType, userId, navigate]);



      useEffect(() => {
    if (userId) {
      axios.post("http://localhost:4000/getCatOwnerById", { id: userId }, {
        headers: { token }
      })
      .then((res) => {
        if (res.data.Status === "Success") {
          const user = res.data.data;
          setFullName(user.fname + " " + user.lname);
        } else if (res.data.Status === "NotFound") {
          setFullName("User");
        }
      })
      .catch(err => console.error("Error fetching user:", err));
    }
  }, [userId, token]);


  const [userName] = useState(sessionStorage.getItem("userName") || "User");

  const [activePage, setActivePage] = useState("");

  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);



  const logout = () => {
    sessionStorage.clear();
    navigate("/");
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div>
      {/* Navigation Bar */}
      <nav
        className="navbar navbar-expand-lg my-navbar shadow-sm py-3"
        style={{ userSelect: "none" }}
        onCopy={(e) => e.preventDefault()}
        onCut={(e) => e.preventDefault()}
        onPaste={(e) => e.preventDefault()}
      >
        <div className="container">
          <a className="navbar-brand fw-bold text-my-primary fs-3" href="#">
            <i className="fa-solid fa-paw me-2 my-logo"></i> PawDerma
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto me-4">
              <li className="nav-item mx-2" onClick={() => setActivePage("homeDefault")}>
                <Link className="nav-link active fw-semibold" aria-current="page" to="homeDefault">
                  Home
                </Link>
              </li>
             <li className="nav-item mx-2" onClick={() => setActivePage("appointments")}>
                <Link className="nav-link fw-semibold" to="appointments">
                    Services
                </Link>
              </li>

              <li className="nav-item mx-2" onClick={() => setActivePage("viewMyCats")}>
                <Link className="nav-link fw-semibold" to="viewMyCats">
                  My Cats
                </Link>
              </li>
              <li className="nav-item mx-2" onClick={() => setActivePage("viewMyAppointments")}>
                <Link className="nav-link fw-semibold" to="viewMyAppointments">
                  My Appointments
                </Link>
              </li>
            </ul>

            {/* Profile Icon with Dropdown */}
            <div className="d-flex align-items-center position-relative" ref={dropdownRef}>
              <div
                className="rounded-circle bg-my-primary d-flex align-items-center justify-content-center"
                style={{ width: '45px', height: '45px', cursor: 'pointer' }}
                onClick={() => setShowDropdown(!showDropdown)}
              >
                <i className="fas fa-user text-white"></i>
              </div>

              {showDropdown && (
                <div
                  className="position-absolute bg-white shadow rounded p-3 my-profile"
                 
                >
                  
                  <p className="mb-2 fw-bold m-2 my-box  p-2"> Hi, <span className='my-primary'>{fullName}</span> </p>
                  <Link
                    to="/editProfile"
                    className="d-flex align-items-center mb-2 text-decoration-none text-dark"
                  >
                    <i className="bi bi-pencil-square m-2 text-success fw-bold me-2"></i> Edit Profile
                  </Link>
                  <button className="btn btn-danger w-100 mt-2" onClick={logout}>
                    <i className="bi bi-box-arrow-right me-1"></i> Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div>
        <Outlet />
      </div>

      {/* Footer */}
      <footer className="py-4 my-navbar mt-5">
        <div className="container text-center">
          <p className="mb-0">&copy; {new Date().getFullYear()} PawDerma. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
