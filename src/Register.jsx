import { useState } from "react";
import axios from "axios";

const API_URL = "https://spendifi-backend.onrender.com";

function Register({ onShowLogin, onRegistered }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  async function handleRegister() {
    if (name === "" || email === "" || password === "") {
      setMessage("Please fill all fields.");
      return;
    }

    try {
      await axios.post(`${API_URL}/api/auth/register`, { name, email, password });
      onRegistered("Account created successfully. Please log in.");
    } catch (error) {
      setMessage(error.response?.data?.message || "Registration failed. Please try again.");
    }
  }

  return (
    <main className="auth-shell">
      <section className="auth-card">
        <p className="eyebrow">Get started</p>
        <h1>SPENDIFI</h1>
        <p className="auth-copy">Create your account to start tracking expenses.</p>
        {message && <p className="notice error">{message}</p>}
        <div className="auth-form">
          <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <button className="primary-button" onClick={handleRegister}>Register</button>
        </div>
        <p className="auth-switch">
          Already have an account?
          <button className="link-button" onClick={onShowLogin}>Log in</button>
        </p>
      </section>
    </main>
  );
}

export default Register;
