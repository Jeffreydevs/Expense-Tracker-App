import { useState } from "react";
import axios from "axios";
const API_URL = "https://spendifi-backend.onrender.com";

function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  async function handleLogin() {
   try{ 
    const response = await axios.post(`${API_URL}/api/auth/login`, { email,password });
    localStorage.setItem("token", response.data.token);
    onLogin(response.data.token);
    setMessage("Login successful");
    } 
    catch (error) {
      setMessage(error.response?.data?.message || "Login failed. Please check your email and password.");
    }
   }

  return (
    <main className="auth-shell">
      <section className="auth-card">
        <p className="eyebrow">Welcome back</p>
        <h1>SPENDIFI</h1>
        <p className="auth-copy">Sign in to manage your expenses and spending insights.</p>
        {message && <p className="notice error">{message}</p>}
        <div className="auth-form">
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <button className="primary-button" onClick={handleLogin}>Login</button>
        </div>
      </section>
    </main>
  );
}

export default Login;
