import { useState } from "react";
import api from "../api/axios";
import { saveTokens, saveUser } from "../utils/auth";
import toast from "react-hot-toast";
import { FiUser, FiMail, FiLock, FiUserPlus } from "react-icons/fi";
import { Link } from "react-router-dom";

function Signup() {
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.full_name || !form.email || !form.password) {
      toast.error("All fields are required");
      return;
    }

    setLoading(true);
    try {
      const res = await api.post("/signup/", form);

      saveTokens(res.data.access, res.data.refresh);
      saveUser(res.data.user);
      toast.success("Signup successful");
      window.location.href = "/dashboard";
    } catch (err) {
      toast.error(
        err.response?.data?.email ||
        err.response?.data?.full_name ||
        "Signup failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h2>Create Account</h2>
        <p className="auth-subtitle">Start using your wallet</p>

        <div className="input-group">
          <FiUser />
          <input
            name="full_name"
            placeholder="Full name"
            value={form.full_name}
            onChange={handleChange}
          />
        </div>

        <div className="input-group">
          <FiMail />
          <input
            type="email"
            name="email"
            placeholder="Email address"
            value={form.email}
            onChange={handleChange}
          />
        </div>

        <div className="input-group">
          <FiLock />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
          />
        </div>

        <button type="submit" disabled={loading}>
          <FiUserPlus />
          {loading ? "Creating account..." : "Signup"}
        </button>

        <p className="auth-switch">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </form>
    </div>
  );
}

export default Signup;
