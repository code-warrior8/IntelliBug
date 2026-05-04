import React, { useState, useEffect } from "react";

function Profile() {
  const [profile, setProfile] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("intellibug_user");
    if (!savedUser) {
      window.location.href = "/login";
      return;
    }
    const parsedUser = JSON.parse(savedUser);
    setUser(parsedUser);

    fetch(`http://localhost:8000/profile/${parsedUser.email}`)
      .then((res) => res.json())
      .then((data) => setProfile(data));
  }, []);

  const getLevelColor = (level) => {
    if (level === "Beginner") return "#94a3b8";
    if (level === "Intermediate") return "#38bdf8";
    if (level === "Advanced") return "#a78bfa";
    if (level === "Expert") return "#fbbf24";
    return "#94a3b8";
  };

  return (
    <div style={styles.container}>
      {/* Navbar */}
      <div style={styles.navbar}>
        <h2 style={styles.logo}>🐛 IntelliBug</h2>
        <div style={styles.navLinks}>
          <a href="/dashboard" style={styles.navLink}>📊 Dashboard</a>
          <a href="/detect" style={styles.navLink}>🔍 Detect Bugs</a>
          <a href="/quiz" style={styles.navLink}>🧠 Quiz</a>
        </div>
      </div>

      <div style={styles.content}>
        <h1 style={styles.title}>🏅 My Profile</h1>
        <p style={styles.subtitle}>{user?.name} — {user?.email}</p>

        {profile && (
          <>
            {/* Level & XP */}
            <div style={styles.xpCard}>
              <div>
                <p style={styles.xpLabel}>Current Level</p>
                <h2 style={{ color: getLevelColor(profile.level), margin: 0 }}>
                  {profile.level}
                </h2>
              </div>
              <div>
                <p style={styles.xpLabel}>Total XP</p>
                <h2 style={{ color: "#fbbf24", margin: 0 }}>⭐ {profile.xp} XP</h2>
              </div>
              <div>
                <p style={styles.xpLabel}>Total Scans</p>
                <h2 style={{ color: "#38bdf8", margin: 0 }}>{profile.total_scans}</h2>
              </div>
              <div>
                <p style={styles.xpLabel}>Bugs Found</p>
                <h2 style={{ color: "#f87171", margin: 0 }}>{profile.total_bugs}</h2>
              </div>
            </div>

            {/* XP Progress Bar */}
            <div style={styles.progressSection}>
              <p style={styles.xpLabel}>XP Progress to next level</p>
              <div style={styles.progressBar}>
                <div style={{
                  ...styles.progressFill,
                  width: `${Math.min((profile.xp % 50) * 2, 100)}%`
                }} />
              </div>
              <p style={styles.xpLabel}>{profile.xp % 50} / 50 XP</p>
            </div>

            {/* Badges */}
            <h3 style={styles.badgeTitle}>🏆 My Badges</h3>
            {profile.badges.length === 0 ? (
              <p style={styles.noBadge}>No badges yet! Start scanning code to earn badges.</p>
            ) : (
              <div style={styles.badgeGrid}>
                {profile.badges.map((badge, index) => (
                  <div key={index} style={styles.badgeCard}>
                    <span style={styles.badgeText}>{badge}</span>
                  </div>
                ))}
              </div>
            )}

            {/* How to earn more */}
            <h3 style={styles.badgeTitle}>💡 How to Earn XP</h3>
            <div style={styles.tipsGrid}>
              <div style={styles.tipCard}>🔍 Scan code → +5 XP per scan</div>
              <div style={styles.tipCard}>🐛 Find bugs → +2 XP per bug</div>
              <div style={styles.tipCard}>🧠 Complete quiz → +10 XP per correct answer</div>
            </div>
          </>
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
  navLinks: { display: "flex", gap: "20px" },
  navLink: { color: "#94a3b8", textDecoration: "none", fontSize: "14px" },
  content: { padding: "40px" },
  title: { color: "#e2e8f0", margin: "0 0 5px 0" },
  subtitle: { color: "#64748b", marginTop: 0 },
  xpCard: {
    display: "flex", gap: "20px", marginBottom: "30px", flexWrap: "wrap",
  },
  xpLabel: { color: "#64748b", margin: "0 0 5px 0", fontSize: "13px" },
  progressSection: { marginBottom: "30px" },
  progressBar: {
    backgroundColor: "#334155", borderRadius: "10px",
    height: "12px", marginBottom: "8px",
  },
  progressFill: {
    backgroundColor: "#fbbf24", height: "12px",
    borderRadius: "10px", transition: "width 0.5s",
  },
  badgeTitle: { color: "#e2e8f0", marginBottom: "15px" },
  noBadge: { color: "#64748b" },
  badgeGrid: { display: "flex", gap: "15px", flexWrap: "wrap", marginBottom: "30px" },
  badgeCard: {
    backgroundColor: "#1e293b", padding: "15px 25px",
    borderRadius: "10px", border: "1px solid #334155",
  },
  badgeText: { color: "#e2e8f0", fontSize: "16px" },
  tipsGrid: { display: "flex", gap: "15px", flexWrap: "wrap" },
  tipCard: {
    backgroundColor: "#1e293b", padding: "15px 20px",
    borderRadius: "10px", color: "#94a3b8",
    border: "1px solid #334155", fontSize: "14px",
  },
};

export default Profile;