import React, { useState } from 'react';
import { Link, Outlet } from 'react-router-dom';

const Home = () => {


  
    const [activePage, setActivePage] = useState("");


  return (
    <div>
      {/* Navigation Bar */}
      <nav className="navbar navbar-expand-lg my-navbar shadow-sm py-3" style={{ userSelect: "none" }}
      onCopy={(e) => e.preventDefault()}
      onCut={(e) => e.preventDefault()}
      onPaste={(e) => e.preventDefault()}>
        <div className="container">
          <a className="navbar-brand fw-bold text-my-primary fs-3" href="#">
          <i className='fa-solid fa-paw me-2 my-logo'></i> PawDerma
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
              <li className="nav-item mx-2"   onClick={() => setActivePage("homeDefault")}>
                <Link className="nav-link active fw-semibold" aria-current="page" to="homeDefault">
                  Home
                </Link>
              </li>
                <li className="nav-item mx-2"   onClick={() => setActivePage("appointments")}>
                <a className="nav-link fw-semibold" href="appointments">
                  Services
                </a>
              </li>
              <li className="nav-item mx-2" onClick={() => setActivePage("viewMyCats")}>
                <Link className="nav-link fw-semibold" to="viewMyCats">
                  My Cats
                </Link>
              </li>
              <li className="nav-item mx-2" onClick={() => setActivePage("myappointments")}>
                <Link className="nav-link fw-semibold" to="myappointments">
                  My Appointments
                </Link>
              </li>
            </ul>
            {/* Profile Icon */}
            <div className="d-flex align-items-center">
              <div className="rounded-circle bg-my-primary d-flex align-items-center justify-content-center" 
                   style={{width: '45px', height: '45px', cursor: 'pointer'}}>
                <i className="fas fa-user text-white"></i>
              </div>
            </div>
          </div>
        </div>
      </nav>

     {/* main content */}
     <div>
      
      <Outlet />

     </div>


      
     

      {/* Footer */}
      <footer className="py-4 my-navbar">
        <div className="container text-center">
          <p className="mb-0">&copy; {new Date().getFullYear()} PawDerma. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;