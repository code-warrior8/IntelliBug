import React, { useState } from "react";

function BugDetector() {
  const [code, setCode] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleDetect = async () => {
    if (!code.trim()) {
      alert("Please paste some code first!");
      return;
    }
    setLoading(true);
    const response = await fetch("http://localhost:8000/detect-bugs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code }),
    });
    const data = await response.json();
    setResult(data);
    setLoading(false);
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>🐛 Bug Detector</h1>
        <p style={styles.subtitle}>Paste your code below and detect bugs instantly!</p>

        <textarea
          style={styles.textarea}
          placeholder="Paste your Python/JavaScript code here..."
          value={code}
          onChange={(e) => setCode(e.target.value)}
          rows={12}
        />

        <button style={styles.button} onClick={handleDetect} disabled={loading}>
          {loading ? "Analyzing..." : "🔍 Detect Bugs"}
        </button>

        {result && (
          <div style={styles.resultBox}>
            <h3 style={styles.resultTitle}>Analysis Result:</h3>
            <p style={{ color: result.bugs_found ? "#f87171" : "#4ade80" }}>
              {result.bugs_found ? "⚠️ Bugs Found!" : "✅ No Bugs Found!"}
            </p>
            {result.issues && result.issues.length > 0 && (
              <ul style={styles.issueList}>
                {result.issues.map((issue, index) => (
                  <li key={index} style={styles.issueItem}>🔴 {issue}</li>
                ))}
              </ul>
            )}
            {result.suggestion && (
              <p style={styles.suggestion}>💡 {result.suggestion}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex", justifyContent: "center",
    alignItems: "flex-start", minHeight: "100vh",
    backgroundColor: "#0f172a", padding: "40px 20px",
  },
  card: {
    backgroundColor: "#1e293b", padding: "40px",
    borderRadius: "12px", width: "700px",
    display: "flex", flexDirection: "column", gap: "15px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
  },
  title: { color: "#38bdf8", textAlign: "center", margin: 0 },
  subtitle: { color: "#94a3b8", textAlign: "center", margin: 0 },
  textarea: {
    padding: "12px", borderRadius: "8px",
    border: "1px solid #334155", backgroundColor: "#0f172a",
    color: "#e2e8f0", fontSize: "14px", fontFamily: "monospace",
    resize: "vertical",
  },
  button: {
    padding: "12px", backgroundColor: "#38bdf8",
    color: "#0f172a", border: "none", borderRadius: "8px",
    fontSize: "16px", fontWeight: "bold", cursor: "pointer",
  },
  resultBox: {
    backgroundColor: "#0f172a", padding: "20px",
    borderRadius: "8px", border: "1px solid #334155",
  },
  resultTitle: { color: "#38bdf8", margin: "0 0 10px 0" },
  issueList: { color: "#e2e8f0", paddingLeft: "20px" },
  issueItem: { marginBottom: "8px" },
  suggestion: { color: "#fbbf24", marginTop: "10px" },
};

export default BugDetector;