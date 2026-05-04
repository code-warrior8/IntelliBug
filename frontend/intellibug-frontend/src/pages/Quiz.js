 import React, { useState } from "react";

const questions = [
  {
    question: "Which keyword is used to define a function in Python?",
    options: ["func", "def", "function", "define"],
    answer: "def",
  },
  {
    question: "What does HTML stand for?",
    options: ["Hyper Text Markup Language", "High Text Machine Language", "Hyper Transfer Markup Language", "None"],
    answer: "Hyper Text Markup Language",
  },
  {
    question: "Which of these is NOT a JavaScript data type?",
    options: ["String", "Boolean", "Integer", "Undefined"],
    answer: "Integer",
  },
  {
    question: "What is the output of: print(2 ** 3) in Python?",
    options: ["6", "8", "9", "23"],
    answer: "8",
  },
  {
    question: "Which symbol is used for single line comments in Python?",
    options: ["//", "#", "/*", "--"],
    answer: "#",
  },
  {
    question: "What does SQL stand for?",
    options: ["Structured Query Language", "Simple Query Language", "Strong Query Logic", "None"],
    answer: "Structured Query Language",
  },
  {
    question: "Which HTTP method is used to send data to a server?",
    options: ["GET", "POST", "DELETE", "FETCH"],
    answer: "POST",
  },
  {
    question: "What is a bug in programming?",
    options: ["A feature", "An error in code", "A library", "A framework"],
    answer: "An error in code",
  },
];

function Quiz() {
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState(null);
  const [finished, setFinished] = useState(false);
  const [answered, setAnswered] = useState(false);

  const handleAnswer = (option) => {
    if (answered) return;
    setSelected(option);
    setAnswered(true);
    if (option === questions[current].answer) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    if (current + 1 < questions.length) {
      setCurrent(current + 1);
      setSelected(null);
      setAnswered(false);
    } else {
      setFinished(true);
    }
  };

  const handleRestart = () => {
    setCurrent(0);
    setScore(0);
    setSelected(null);
    setFinished(false);
    setAnswered(false);
  };

  const getOptionStyle = (option) => {
    if (!answered) return styles.option;
    if (option === questions[current].answer) return { ...styles.option, backgroundColor: "#166534", borderColor: "#4ade80" };
    if (option === selected) return { ...styles.option, backgroundColor: "#7f1d1d", borderColor: "#f87171" };
    return styles.option;
  };

  return (
    <div style={styles.container}>
      {/* Navbar */}
      <div style={styles.navbar}>
        <h2 style={styles.logo}>🐛 IntelliBug</h2>
        <div style={styles.navLinks}>
          <a href="/dashboard" style={styles.navLink}>📊 Dashboard</a>
          <a href="/detect" style={styles.navLink}>🔍 Detect Bugs</a>
        </div>
      </div>

      <div style={styles.content}>
        {!finished ? (
          <div style={styles.card}>
            <div style={styles.progressBar}>
              <div style={{ ...styles.progressFill, width: `${((current + 1) / questions.length) * 100}%` }} />
            </div>
            <p style={styles.questionCount}>Question {current + 1} of {questions.length}</p>
            <h2 style={styles.question}>{questions[current].question}</h2>

            <div style={styles.options}>
              {questions[current].options.map((option, index) => (
                <button key={index} style={getOptionStyle(option)} onClick={() => handleAnswer(option)}>
                  {option}
                </button>
              ))}
            </div>

            {answered && (
              <div style={styles.feedback}>
                {selected === questions[current].answer
                  ? "✅ Correct! Well done!"
                  : `❌ Wrong! Correct answer: ${questions[current].answer}`}
              </div>
            )}

            {answered && (
              <button style={styles.nextBtn} onClick={handleNext}>
                {current + 1 < questions.length ? "Next Question →" : "See Results"}
              </button>
            )}
          </div>
        ) : (
          <div style={styles.card}>
            <h1 style={styles.resultTitle}>🏆 Quiz Complete!</h1>
            <p style={styles.scoreText}>Your Score:</p>
            <h2 style={styles.score}>{score} / {questions.length}</h2>
            <p style={styles.resultMsg}>
              {score >= 7 ? "🌟 Excellent! You're a coding genius!" :
               score >= 5 ? "👍 Good job! Keep practicing!" :
               "💪 Keep learning! You'll do better next time!"}
            </p>
            <button style={styles.nextBtn} onClick={handleRestart}>🔄 Restart Quiz</button>
            <a href="/dashboard" style={styles.dashLink}>← Back to Dashboard</a>
          </div>
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
  content: { display: "flex", justifyContent: "center", padding: "40px" },
  card: {
    backgroundColor: "#1e293b", padding: "40px",
    borderRadius: "12px", width: "600px",
    display: "flex", flexDirection: "column", gap: "15px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
  },
  progressBar: { backgroundColor: "#334155", borderRadius: "10px", height: "8px" },
  progressFill: { backgroundColor: "#38bdf8", height: "8px", borderRadius: "10px", transition: "width 0.3s" },
  questionCount: { color: "#64748b", margin: 0, fontSize: "13px" },
  question: { color: "#e2e8f0", margin: 0 },
  options: { display: "flex", flexDirection: "column", gap: "10px" },
  option: {
    padding: "14px", backgroundColor: "#0f172a",
    color: "#e2e8f0", border: "1px solid #334155",
    borderRadius: "8px", cursor: "pointer",
    textAlign: "left", fontSize: "15px",
  },
  feedback: {
    padding: "12px", backgroundColor: "#0f172a",
    borderRadius: "8px", color: "#e2e8f0", fontSize: "14px",
  },
  nextBtn: {
    padding: "12px", backgroundColor: "#38bdf8",
    color: "#0f172a", border: "none", borderRadius: "8px",
    fontSize: "16px", fontWeight: "bold", cursor: "pointer",
  },
  resultTitle: { color: "#38bdf8", textAlign: "center" },
  scoreText: { color: "#94a3b8", textAlign: "center", margin: 0 },
  score: { color: "#4ade80", textAlign: "center", fontSize: "48px", margin: 0 },
  resultMsg: { color: "#e2e8f0", textAlign: "center" },
  dashLink: { color: "#94a3b8", textAlign: "center", fontSize: "14px" },
};

export default Quiz;