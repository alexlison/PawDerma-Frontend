import React from 'react'
import { Link } from 'react-router-dom'

const Appointments = () => {
  return (
    <div>
      <div className="container">
        <div className="row">
          <div className="col col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 col-xxl-12">
            <section className="py-3">
              <div className="container py-5">
                <h2 className="text-center mb-5 fw-bold display-5 text-my-primary fs-2">Our Services</h2>
                <div className="row g-4">
                  
                  <div className="col-md-4">
                    <div className="card h-100 shadow-sm service-card">
                      <div className="card-body text-center p-4">
                        <div className="bg-my-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" 
                             style={{width: '70px', height: '70px'}}>
                          <i className="fas fa-stethoscope fa-2x"></i>
                        </div>
                        <h5 className="card-title fw-bold mt-2">General Consultation</h5>
                        <p className="card-text">Comprehensive care for your feline friend</p>
                        <Link to="/home/generalBooking" className="btn my-btn px-4 mt-3">Book Now</Link>
                      </div>
                    </div>
                  </div>

                  <div className="col-md-4">
                    <div className="card h-100 shadow-sm service-card">
                      <div className="card-body text-center p-4">
                        <div className="bg-my-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" 
                             style={{width: '70px', height: '70px'}}>
                          <i className="fas fa-allergies fa-2x"></i>
                        </div>
                        <h5 className="card-title fw-bold mt-2">Skin Disease Consultation</h5>
                        <p className="card-text">Specialized treatment for Skin issues</p>
                        <Link to="/home/skinPrediction" className="btn my-btn px-4 mt-3">Book Now</Link>
                      </div>
                    </div>
                  </div>

                  <div className="col-md-4">
                    <div className="card h-100 shadow-sm service-card">
                      <div className="card-body text-center p-4">
                        <div className="bg-my-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" 
                             style={{width: '70px', height: '70px'}}>
                          <i className="fas fa-syringe fa-2x"></i>
                        </div>
                        <h5 className="card-title fw-bold mt-2">Vaccination</h5>
                        <p className="card-text">Protect your cat from common diseases</p>
                        <Link to="/home/vaccineBooking" className="btn my-btn px-4 mt-3">Book Now</Link>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Appointments
