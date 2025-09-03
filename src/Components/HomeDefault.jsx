import React from 'react'

const HomeDefault = () => {
  return (
    <div>
      
      <section className="hero-section py-5 my-home-bg">
        <div className="container py-5">
          <div className="row align-items-top">
            <div className="col-lg-6 mb-5 mb-lg-0">
              <h1 className="display-4 fw-bold mb-3 text-my-primary">Expert Care for Your Feline Friend</h1>
              <p className="lead mb-4 fs-5 text-light">Personalized health & wellness for happy cats</p>
              <button className="my-btn btn-lg px-4 py-2 fs-5">Book Appointment</button>
            </div>
            <div className="col-lg-6 text-center align-items-top">
             
           <img className="mycat" src="https://png.pngtree.com/png-clipart/20230511/ourmid/pngtree-isolated-front-view-cat-on-white-background-png-image_7094909.png" alt="My Cat" />
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default HomeDefault