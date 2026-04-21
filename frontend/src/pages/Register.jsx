import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api";

const Register = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async () => {
    try {
      await API.post("/api/auth/register", form);
      alert("Registered successfully");
      navigate("/");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      
      {/* Card */}
      <div className="bg-gray-800 p-8 rounded-xl shadow-lg w-full max-w-md">
        
        {/* Title */}
        <h2 className="text-2xl font-bold text-center mb-6">
          Create Account
        </h2>

        {/* Name */}
        <div className="mb-4">
          <label className="block text-sm mb-1">Name</label>
          <input
            name="name"
            placeholder="Enter your name"
            onChange={handleChange}
            className="w-full p-3 rounded bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Email */}
        <div className="mb-4">
          <label className="block text-sm mb-1">Email</label>
          <input
            name="email"
            type="email"
            placeholder="Enter your email"
            onChange={handleChange}
            className="w-full p-3 rounded bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Password */}
        <div className="mb-6">
          <label className="block text-sm mb-1">Password</label>
          <input
            name="password"
            type="password"
            placeholder="Enter your password"
            onChange={handleChange}
            className="w-full p-3 rounded bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Button */}
        <button
          onClick={handleRegister}
          className="w-full bg-green-500 py-3 rounded font-semibold hover:bg-green-600 transition"
        >
          Register
        </button>

        {/* Divider */}
        <div className="text-center text-gray-400 my-4">or</div>

        {/* Login Redirect */}
        <p className="text-center text-sm text-gray-400">
          Already have an account?{" "}
          <Link
            to="/"
            className="text-blue-400 hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;