import { useState } from "react";
import axios from "axios";
const API_URL = "https://spendifi-backend.onrender.com";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleLogin() {
   try{ 
    const response = await axios.post(`${API_URL}/api/auth/login`, { email,password });
    localStorage.setItem("token", response.data.token);
    alert("Login successful");
    } 
    catch (error) { alert(error.response?.data?.message || "Something went wrong"); }
   }

  return (
    <>
     <h2>Login</h2>
     <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
     <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
     <button onClick={handleLogin}>Login</button>
    </>
  );
}

export default Login;