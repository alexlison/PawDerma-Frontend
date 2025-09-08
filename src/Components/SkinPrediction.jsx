import React from 'react'

const SkinPrediction = () => {
  return (
    <div>
        <div className="container  p-5 pt-1 bg-light border rounded shadow mt-5 mb-5"
        style={{ maxWidth: "550px" }}>
            <h4 className="m-4 text-center">Skin Disease Booking</h4>
            <div className="row">
                <div className="col col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 col-xxl-12">
                    <div className="row g-3">
                        <div className="col col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 col-xxl-12">
                            <label htmlFor="" className="form-label">Cat:</label>
                            <select name="" id="" className="form-select">
                                <option value=""></option>
                                <option value=""></option>
                            </select>
                        </div>
                        <div className="col col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 col-xxl-12">
                            <label htmlFor="" className="form-label">Image:</label>
                            <input type="file" name="" id="" className="form-control" />
                        </div>
                        <div className="col col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 col-xxl-12">
                            <button className="btn btn my-btn">Submit</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default SkinPrediction;