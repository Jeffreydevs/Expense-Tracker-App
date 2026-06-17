import { useState } from "react";
import axios from "axios";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleRegister() {
    const response = await axios.post("http://localhost:3000/api/auth/register", {name,email,password});
    console.log(response.data);
    alert("Registered successfully");
  }

  return (
    <>
     <h2>Register</h2>
     <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
     <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
     <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
     <button onClick={handleRegister}>Register</button>
    </>
  );
}

export default Register;