import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async () => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        form
      );

      // 🔥 TOKEN SAVE
      localStorage.setItem("token", res.data.token);

      alert("Login success");
      navigate("/dashboard");

    } catch (err) {
  console.error(err);
  alert(err.response?.data?.message || "Something went wrong");
}
  };

  return (
    <div>
      <h2>Login</h2>

      <input name="email" placeholder="Email" onChange={handleChange} />
      <br /><br />

      <input name="password" type="password" placeholder="Password" onChange={handleChange} />
      <br /><br />

      <button onClick={handleLogin}>Login</button>

      <p>
        Don't have account? <a href="/register">Register</a>
      </p>
    </div>
  );
};

export default Login;