import React, { useState, useEffect } from "react";

function Dashboard() {
  const [user, setUser] = useState(null);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const savedUser = localStorage.getItem("intellibug_user");
    if (!savedUser) {
      window.location.href = "/login";
      return;
    }
    const parsedUser = JSON.parse(savedUser);
    setUser(parsedUser);

    // Fetch bug history
    fetch(`http://localhost:8000/history/${parsedUser.email}`)
      .then((res) => res.json())
      .then((data) => setHistory(data.history));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("intellibug_user");
    window.location.href = "/login";
  };

  return (
    <div style={styles.container}>
      {/* Navbar */}
      <div style={styles.navbar}>
        <h2 style={styles.logo}>🐛 IntelliBug</h2>
        <div style={styles.navLinks}>
          <a href="/detect" style={styles.navLink}>🔍 Detect Bugs</a>
          <a href="/quiz" style={styles.navLink}>🧠 Quiz</a>
          <a href="/profile" style={styles.navLink}>🏅 Profile</a>
          <button style={styles.logoutBtn} onClick={handleLogout}>Logout</button>
        </div>
      </div>

      {/* Welcome */}
      <div style={styles.content}>
        <h1 style={styles.welcome}>
          Welcome back, {user?.name}! 👋
        </h1>
        <p style={styles.subtitle}>Here's your activity summary</p>

        {/* Stats */}
        <div style={styles.statsRow}>
          <div style={styles.statCard}>
            <h2 style={styles.statNumber}>{history.length}</h2>
            <p style={styles.statLabel}>Total Scans</p>
          </div>
          <div style={styles.statCard}>
            <h2 style={styles.statNumber}>
              {history.filter((h) => h.bugs_found > 0).length}
            </h2>
            <p style={styles.statLabel}>Bugs Found</p>
          </div>
          <div style={styles.statCard}>
            <h2 style={styles.statNumber}>
              {history.filter((h) => h.bugs_found === 0).length}
            </h2>
            <p style={styles.statLabel}>Clean Code</p>
          </div>
        </div>

        {/* History */}
        <h3 style={styles.historyTitle}>Recent Scans</h3>
        {history.length === 0 ? (
          <p style={styles.noHistory}>No scans yet! Go to Bug Detector to start.</p>
        ) : (
          history.slice().reverse().map((item, index) => (
            <div key={index} style={styles.historyCard}>
              <div style={styles.historyHeader}>
                <span style={{ color: item.bugs_found > 0 ? "#f87171" : "#4ade80" }}>
                  {item.bugs_found > 0 ? `⚠️ ${item.bugs_found} bug(s) found` : "✅ Clean code"}
                </span>
                <span style={styles.historyDate}>{item.created_at?.slice(0, 19)}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

const styles = {
  container: { minHeight: "100vh", backgroundColor: "#0f172a" },
  navbar: {
    display: "flex", justifyContent: "space-between",
    alignItems: "center", padding: "15px 40px",
    backgroundColor: "#1e293b", borderBottom: "1px solid #334155",
  },
  logo: { color: "#38bdf8", margin: 0 },
  navLinks: { display: "flex", gap: "20px", alignItems: "center" },
  navLink: { color: "#94a3b8", textDecoration: "none", fontSize: "14px" },
  logoutBtn: {
    padding: "8px 16px", backgroundColor: "#f87171",
    color: "white", border: "none", borderRadius: "8px",
    cursor: "pointer", fontSize: "14px",
  },
  content: { padding: "40px" },
  welcome: { color: "#e2e8f0", marginBottom: "5px" },
  subtitle: { color: "#94a3b8", marginTop: 0 },
  statsRow: { display: "flex", gap: "20px", marginBottom: "40px" },
  statCard: {
    backgroundColor: "#1e293b", padding: "25px 40px",
    borderRadius: "12px", textAlign: "center",
    border: "1px solid #334155",
  },
  statNumber: { color: "#38bdf8", margin: 0, fontSize: "36px" },
  statLabel: { color: "#94a3b8", margin: "5px 0 0 0" },
  historyTitle: { color: "#e2e8f0" },
  noHistory: { color: "#94a3b8" },
  historyCard: {
    backgroundColor: "#1e293b", padding: "15px 20px",
    borderRadius: "8px", marginBottom: "10px",
    border: "1px solid #334155",
  },
  historyHeader: { display: "flex", justifyContent: "space-between" },
  historyDate: { color: "#64748b", fontSize: "13px" },
};

export default Dashboard;