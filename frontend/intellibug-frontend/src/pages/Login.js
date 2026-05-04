import React, { useState } from "react";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    if (!email || !password) {
      alert("Please fill all fields!");
      return;
    }
    const response = await fetch("http://localhost:8000/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();
    if (data.success) {
      localStorage.setItem("intellibug_user", JSON.stringify({
        name: data.name,
        email: data.email
      }));
      window.location.href = "/dashboard";
    } else {
      alert(data.message);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>🐛 IntelliBug</h1>
        <h3 style={styles.subtitle}>Login to your account</h3>

        <input
          style={styles.input}
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          style={styles.input}
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button style={styles.button} onClick={handleLogin}>
          Login
        </button>
        <p style={styles.link}>Don't have an account? <a href="/register">Register</a></p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex", justifyContent: "center",
    alignItems: "center", height: "100vh", backgroundColor: "#0f172a",
  },
  card: {
    backgroundColor: "#1e293b", padding: "40px",
    borderRadius: "12px", width: "350px",
    display: "flex", flexDirection: "column", gap: "15px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
  },
  title: { color: "#38bdf8", textAlign: "center", margin: 0 },
  subtitle: { color: "#94a3b8", textAlign: "center", margin: 0 },
  input: {
    padding: "12px", borderRadius: "8px",
    border: "1px solid #334155", backgroundColor: "#0f172a",
    color: "white", fontSize: "14px",
  },
  button: {
    padding: "12px", backgroundColor: "#38bdf8",
    color: "#0f172a", border: "none", borderRadius: "8px",
    fontSize: "16px", fontWeight: "bold", cursor: "pointer",
  },
  link: { color: "#94a3b8", textAlign: "center", fontSize: "13px" },
};

export default Login;