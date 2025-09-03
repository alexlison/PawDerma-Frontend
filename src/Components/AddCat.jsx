import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AddCat = () => {
  const navigate = useNavigate();

  const [token, changeToken] = useState(sessionStorage.getItem("token"));
  const [userType, changeUserType] = useState(
    sessionStorage.getItem("userType")
  );
  const [userId, changeUserId] = useState(sessionStorage.getItem("userId"));

  useEffect(() => {
    if (!token || userType !== "cat_owner") {
      alert("Access denied! Only cat_owner can access this page.");
      navigate("/");
    }
  }, [token, userType, userId, navigate]);

 const [errors, setErrors] = useState({});
  const validate = () => {
    const newErrors = {};

    if (!input.name.trim()) newErrors.name = "Cat name is Required";
    if (!input.dob) newErrors.dob = "Date of birth is required";
    if (!input.gender) newErrors.gender = "Gender is required";
    if (!input.breed) newErrors.breed = "breed is required";
    if (!input.color) newErrors.color = "color is required";
    if (!input.image) newErrors.image = "image is required";


    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };


  const [input, changeInput] = useState({
    name: "",
    gender: "",
    dob: "",
    breed: "",
    color: "",
    catOwner_id: userId,
    imageFormat: "",
    image: "",
  });

  const inputHandler = (event) => {
    changeInput({ ...input, [event.target.name]: event.target.value });

    if (errors[event.target.name]) {
      setErrors({ ...errors, [event.target.name]: "" });
    }
  };

const readValues = () => {
  if (validate()) {
    axios.post("http://localhost:4000/addCat", input)
      .then((response) => {
        if (response.data.Status === "InvalidImageFormat") {
          alert("Invalid Image Format!");
        } else if (response.data.Status === "Error") {
          alert("Error in Inserting Data");
        } else {
         navigate("/home/viewMyCats");

        }
      })
      .catch((error) => {
        console.error(error);
        alert("Something went wrong!");
      });
  }
};

  return (
    <div>
      <div
        className="container  p-5 pt-1 bg-light border rounded shadow mt-5 mb-5"
        style={{ maxWidth: "950px" }}
      >
        <h4 className="m-4 mt-5 my-formheading text-center">Add Cat</h4>
        <hr className="mb-5 mt-4 my-hr" />
        <div className="row">
          <div className="col col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 col-xxl-12">
            <div className="row g-3">
              <div className="col col-12 col-md-6 col-lg-6 col-xl-6 col-xxl-6">
                <label htmlFor="" className="form-label">
                  Cat Name:
                </label>
                <input
                  type="text"
                  className={`form-control ${errors.name ? "is-invalid" : ""}`}
                  placeholder="Enter Cat Name"
                  name="name"
                  value={input.name}
                  onChange={inputHandler}
                />
                   {errors.name && (
                  <div className="invalid-feedback">{errors.name}</div>
                )}
              </div>
              <div className="col col-12 col-md-6 col-lg-6 col-xl-6 col-xxl-6">
                <label htmlFor="" className="form-label">
                  Gender:
                </label>
                <select
                  id=""
                   className={`form-select ${errors.gender ? "is-invalid" : ""}`}
                  name="gender"
                  value={input.gender}
                  onChange={inputHandler}
                >
                  <option value="" disabled>
                    Select Gender
                  </option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
                     {errors.gender && (
                  <div className="invalid-feedback">{errors.gender}</div>
                )}
              </div>
              <div className="col col-12 col-md-6 col-lg-6 col-xl-6 col-xxl-6">
                <label htmlFor="" className="form-label">
                  Dob:
                </label>
                <input
                  type="date"
                  id=""
                   className={`form-control ${errors.dob ? "is-invalid" : ""}`}
                  placeholder="Enter Dob"
                  name="dob"
                  value={input.dob}
                  onChange={inputHandler}
                  max={new Date().toISOString().split("T")[0]}
                />
                     {errors.dob && (
                  <div className="invalid-feedback">{errors.dob}</div>
                )}
              </div>
              <div className="col col-12 col-md-6 col-lg-6 col-xl-6 col-xxl-6">
                <label htmlFor="breed" className="form-label">
                  Breed:
                </label>
                <select
                  id="breed"
                   className={`form-select ${errors.breed ? "is-invalid" : ""}`}
                  name="breed"
                  value={input.breed}
                  onChange={inputHandler}
                >
                  <option value="" disabled>
                    Select Breed
                  </option>
                  <option value="Persian">Persian</option>
                  <option value="Siamese">Siamese</option>
                  <option value="Maine Coon">Maine Coon</option>
                  <option value="Ragdoll">Ragdoll</option>
                  <option value="Bengal">Bengal</option>
                  <option value="Local">Local/native</option>
                </select>
                    {errors.breed && (
                  <div className="invalid-feedback">{errors.breed}</div>
                )}
              </div>
              <div className="col col-12 col-md-6 col-lg-6 col-xl-6 col-xxl-6">
                <label htmlFor="color" className="form-label">
                  Color:
                </label>
                <select
                  id="color"
                   className={`form-select ${errors.color ? "is-invalid" : ""}`}
                  name="color"
                  value={input.color}
                  onChange={inputHandler}
                >
                  <option value="">Select Color</option>
                  <option value="White">White</option>
                  <option value="Black">Black</option>
                  <option value="Gray">Gray</option>
                  <option value="Brown">Brown</option>
                  <option value="Cream">Cream</option>
                  <option value="Orange">Orange</option>
                  <option value="Calico">Calico</option>
                  <option value="Tabby">Tabby</option>
                </select>
                    {errors.color && (
                  <div className="invalid-feedback">{errors.color}</div>
                )}
              </div>
              <div className="col col-12 col-md-6 col-lg-6 col-xl-6 col-xxl-6">
                <label htmlFor="" className="form-label">
                  Image:
                </label>
                <input
                  type="file"
                    className={`form-control ${errors.image ? "is-invalid" : ""}`}
                  name="image"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      changeInput({
                        ...input,
                        image: file.name,
                        imageFormat: file.name.split(".").pop().toLowerCase(),
                      });
                    }
                  }}
                />
                <div className="invalid-feedback">{errors.image}</div>
              </div>
              <div className="col col-12 col-md-12 col-lg-12 col-xl-12 col-xxl-12">
                <div className="col-12 d-flex justify-content-end">
                  <button
                    className="btn btn-success w-45 px-4 border-overline mt-4 mb-3 p-2 my-btn"
                    onClick={readValues}
                  >
                    <i className="fa-solid fa-cat me-2"></i> Add Cat
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddCat;
