import { useState } from "react";
import api from "../api/axios";
import { saveTokens, saveUser } from "../utils/auth";
import toast from "react-hot-toast";
import { FiMail, FiLock, FiLogIn } from "react-icons/fi";
import { Link } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Email and password are required");
      return;
    }

    setLoading(true);
    try {
      const res = await api.post("/login/", {
        email,
        password,
      });

      saveTokens(res.data.access, res.data.refresh);
      saveUser(res.data.user);
      toast.success("Login successful");
      window.location.href = "/dashboard";
    } catch (err) {
      toast.error("Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h2>Welcome Back</h2>
        <p className="auth-subtitle">Login to your wallet</p>

        <div className="input-group">
          <FiMail />
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="input-group">
          <FiLock />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button type="submit" disabled={loading}>
          <FiLogIn />
          {loading ? "Logging in..." : "Login"}
        </button>
        <p className="auth-switch">
  Don&apos;t have an account?{" "}
  <Link to="/signup">Sign up</Link>
</p>

      </form>
    </div>
  );
}

export default Login;
