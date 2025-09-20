import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const EditCat = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [token] = useState(sessionStorage.getItem("token"));  
  const [userType] = useState(sessionStorage.getItem("userType"));
  const [userId] = useState(sessionStorage.getItem("userId"));

  const [errors, setErrors] = useState({});
  const [input, changeInput] = useState({
    name: "",
    gender: "",
    dob: "",
    breed: "",
    color: "",
    catOwner_id: userId,
    image: null,
  });

  // Fetch cat data from server
  const fetchData = async () => {
    if (!id || !token) return;

    try {
      const response = await axios.get(`http://localhost:4000/getCat/${id}`, {
        headers: { token },
      });

      if (response.data.Status === "Success") {
        const cat = response.data.cat;

        // Normalize API values to match <option> values
        const gender = cat.gender
          ? cat.gender.toLowerCase() === "male" ? "Male" 
            : cat.gender.toLowerCase() === "female" ? "Female" 
            : ""
          : "";

        const breed = ["Persian", "Siamese", "Maine Coon", "Ragdoll", "Bengal"].includes(cat.breed)
          ? cat.breed
          : "Local";

        const color = ["White","Black","Gray","Brown","Cream","Orange","Calico","Tabby"].includes(cat.color)
          ? cat.color
          : "";

        changeInput({
          name: cat.name || "",
          gender,
          dob: cat.dob ? cat.dob.split("T")[0] : "",
          breed,
          color,
          catOwner_id: cat.catOwner_id || userId,
          image: null
        });
      } else {
        alert(response.data.Status);
      }
    } catch (err) {
      console.error("Error fetching cat:", err);
      alert("Error fetching cat data!");
    }
  };

  useEffect(() => {
    if (!token || userType !== "cat_owner") {
      alert("Access denied! Only cat_owner can access this page.");
      navigate("/");
      return;
    }
    fetchData();
  }, [token, userType, navigate, id]);

  const validate = () => {
    const newErrors = {};
    if (!input.name || !input.name.trim()) newErrors.name = "Cat name is required";
    if (!input.dob) newErrors.dob = "Date of birth is required";
    if (!input.gender) newErrors.gender = "Gender is required";
    if (!input.breed) newErrors.breed = "Breed is required";
    if (!input.color) newErrors.color = "Color is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const inputHandler = (e) => {
    changeInput({ ...input, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: "" });
  };

  const fileHandler = (e) => {
    const file = e.target.files[0];
    if (file) changeInput({ ...input, image: file });
  };

  const readValues = () => {
    if (!validate()) return;

    const formData = new FormData();
    formData.append("name", input.name);
    formData.append("gender", input.gender);
    formData.append("dob", input.dob);
    formData.append("breed", input.breed);
    formData.append("color", input.color);
    formData.append("catOwner_id", userId);
    if (input.image) formData.append("image", input.image);

    axios.put(`http://localhost:4000/updateCat/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data", token }
    })
    .then((res) => {
      const status = res.data.Status;
      if (status === "Invalid Authentication") alert("Invalid Authentication!");
      else if (status === "CatNotFound") alert("Cat not found!");
      else if (status === "Success") {
        alert("Cat updated successfully!");
        navigate("/home/viewMyCats");
      } else if (status === "Error") alert("Something went wrong on server!");
    })
    .catch((err) => {
      console.error(err);
      alert("Network error!");
    });
  };

  return (
    <div className="container p-5 pt-1 bg-light border rounded shadow mt-5 mb-5" style={{ maxWidth: "950px" }}>
      <h4 className="m-4 mt-5 my-formheading text-center">Edit Cat</h4>
      <hr className="mb-5 mt-4 my-hr" />
      <div className="row g-3">

        <div className="col-md-6">
          <label className="form-label">Cat Name:</label>
          <input
            type="text"
            className={`form-control ${errors.name ? "is-invalid" : ""}`}
            name="name"
            value={input.name}
            onChange={inputHandler}
            placeholder="Enter Cat Name"
          />
          {errors.name && <div className="invalid-feedback">{errors.name}</div>}
        </div>

        <div className="col-md-6">
          <label className="form-label">Gender:</label>
          <select
            className={`form-select ${errors.gender ? "is-invalid" : ""}`}
            name="gender"
            value={input.gender}
            onChange={inputHandler}
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
          {errors.gender && <div className="invalid-feedback">{errors.gender}</div>}
        </div>

        <div className="col-md-6">
          <label className="form-label">Date of Birth:</label>
          <input
            type="date"
            className={`form-control ${errors.dob ? "is-invalid" : ""}`}
            name="dob"
            value={input.dob}
            onChange={inputHandler}
            max={new Date().toISOString().split("T")[0]}
          />
          {errors.dob && <div className="invalid-feedback">{errors.dob}</div>}
        </div>

        <div className="col-md-6">
          <label className="form-label">Breed:</label>
          <select
            className={`form-select ${errors.breed ? "is-invalid" : ""}`}
            name="breed"
            value={input.breed}
            onChange={inputHandler}
          >
            <option value="">Select Breed</option>
            <option value="Persian">Persian</option>
            <option value="Siamese">Siamese</option>
            <option value="Maine Coon">Maine Coon</option>
            <option value="Ragdoll">Ragdoll</option>
            <option value="Bengal">Bengal</option>
            <option value="Local">Local/native</option>
          </select>
          {errors.breed && <div className="invalid-feedback">{errors.breed}</div>}
        </div>

        <div className="col-md-6">
          <label className="form-label">Color:</label>
          <select
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
          {errors.color && <div className="invalid-feedback">{errors.color}</div>}
        </div>

        <div className="col-md-6">
          <label className="form-label">Image:</label>
          <input
            type="file"
            className="form-control"
            name="image"
            onChange={fileHandler}
          />
        </div>

        <div className="col-12 d-flex justify-content-end">
          <button
            className="btn btn-success w-45 px-4 mt-4 mb-3 my-btn"
            onClick={readValues}
          >
            <i className="fa-solid fa-cat me-2"></i> Update Cat
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditCat;
