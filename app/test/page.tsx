"use client";

import { useState } from "react";

const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: "⊞" },
  { id: "skills", label: "My Skills", icon: "◈" },
  { id: "matches", label: "Matches", icon: "⇄" },
  { id: "sessions", label: "Sessions", icon: "◷" },
  { id: "messages", label: "Messages", icon: "◻" },
  { id: "profile", label: "Profile", icon: "◉" },
  { id: "wallet", label: "Wallet", icon: "◈" },
];

const mockMatches = [
  {
    id: 1,
    name: "Arjun Sharma",
    teaches: "React & Next.js",
    wants: "UI/UX Design",
    rating: 4.8,
    sessions: 12,
    avatar: "AS",
    matchScore: 94,
  },
  {
    id: 2,
    name: "Priya Thapa",
    teaches: "Python & ML",
    wants: "Web Development",
    rating: 4.6,
    sessions: 8,
    avatar: "PT",
    matchScore: 87,
  },
  {
    id: 3,
    name: "Rahul KC",
    teaches: "Graphic Design",
    wants: "Node.js Backend",
    rating: 4.9,
    sessions: 21,
    avatar: "RK",
    matchScore: 82,
  },
  {
    id: 4,
    name: "Sita Gurung",
    teaches: "Data Analysis",
    wants: "React Native",
    rating: 4.5,
    sessions: 5,
    avatar: "SG",
    matchScore: 79,
  },
];

const mockSessions = [
  {
    id: 1,
    partner: "Arjun Sharma",
    skill: "React Hooks Deep Dive",
    date: "Jun 8, 2026",
    time: "10:00 AM",
    status: "upcoming",
    type: "teaching",
  },
  {
    id: 2,
    partner: "Priya Thapa",
    skill: "Python Data Structures",
    date: "Jun 6, 2026",
    time: "3:00 PM",
    status: "upcoming",
    type: "learning",
  },
  {
    id: 3,
    partner: "Rahul KC",
    skill: "Figma Prototyping",
    date: "Jun 3, 2026",
    time: "2:00 PM",
    status: "completed",
    type: "learning",
  },
  {
    id: 4,
    partner: "Sita Gurung",
    skill: "Node.js REST APIs",
    date: "May 30, 2026",
    time: "11:00 AM",
    status: "completed",
    type: "teaching",
  },
];

const mockMessages = [
  {
    id: 1,
    name: "Arjun Sharma",
    avatar: "AS",
    preview: "Hey! Ready for tomorrow's session?",
    time: "2m ago",
    unread: 2,
    online: true,
  },
  {
    id: 2,
    name: "Priya Thapa",
    avatar: "PT",
    preview: "Thanks for the Python tips! Really helpful.",
    time: "1h ago",
    unread: 0,
    online: true,
  },
  {
    id: 3,
    name: "Rahul KC",
    avatar: "RK",
    preview: "Can we reschedule to Friday?",
    time: "3h ago",
    unread: 1,
    online: false,
  },
  {
    id: 4,
    name: "Sita Gurung",
    avatar: "SG",
    preview: "Session was amazing, learned so much!",
    time: "1d ago",
    unread: 0,
    online: false,
  },
];

const skillCategories = [
  "Web Dev",
  "Design",
  "Data Science",
  "Mobile",
  "DevOps",
  "AI/ML",
  "Marketing",
  "Languages",
];

export default function SkillXchangeDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [activeMessage, setActiveMessage] = useState(mockMessages[0]);
  const [msgInput, setMsgInput] = useState("");
  const [chatHistory, setChatHistory] = useState([
    {
      from: "them",
      text: "Hey! Ready for tomorrow's session on React Hooks?",
      time: "10:02 AM",
    },
    {
      from: "me",
      text: "Absolutely! I've been reviewing the docs. Should we start with useState and useEffect?",
      time: "10:05 AM",
    },
    {
      from: "them",
      text: "Perfect. I'll also show you some custom hook patterns I use in production.",
      time: "10:07 AM",
    },
  ]);
  const [notifications, setNotifications] = useState(3);

  const sendMsg = () => {
    if (!msgInput.trim()) return;
    setChatHistory((prev) => [
      ...prev,
      {
        from: "me",
        text: msgInput,
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
    ]);
    setMsgInput("");
  };

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        background: "#0a0a0f",
        fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
        color: "#e8e8f0",
        overflow: "hidden",
      }}
    >
      {/* Sidebar */}
      <div
        style={{
          width: 240,
          background: "#0e0e16",
          borderRight: "1px solid #1e1e2e",
          display: "flex",
          flexDirection: "column",
          flexShrink: 0,
          boxShadow: "4px 0 24px rgba(0,0,0,0.4)",
        }}
      >
        {/* Logo */}
        <div
          style={{
            padding: "28px 24px 20px",
            borderBottom: "1px solid #1e1e2e",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: "linear-gradient(135deg, #6c63ff, #a78bfa)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 16,
                fontWeight: 700,
                color: "#fff",
                flexShrink: 0,
              }}
            >
              SX
            </div>
            <div>
              <div
                style={{
                  fontSize: 15,
                  fontWeight: 700,
                  letterSpacing: 0.5,
                  color: "#fff",
                }}
              >
                SkillXchange
              </div>
              <div
                style={{
                  fontSize: 10,
                  color: "#6b7280",
                  letterSpacing: 1.5,
                  textTransform: "uppercase",
                  marginTop: 1,
                }}
              >
                Exchange · Grow
              </div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ padding: "16px 12px", flex: 1 }}>
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "11px 14px",
                borderRadius: 10,
                border: "none",
                cursor: "pointer",
                marginBottom: 4,
                transition: "all 0.2s",
                background:
                  activeTab === item.id
                    ? "linear-gradient(135deg, rgba(108,99,255,0.2), rgba(167,139,250,0.1))"
                    : "transparent",
                color: activeTab === item.id ? "#a78bfa" : "#9ca3af",
                fontSize: 14,
                fontWeight: activeTab === item.id ? 600 : 400,
                borderLeft:
                  activeTab === item.id
                    ? "2px solid #6c63ff"
                    : "2px solid transparent",
              }}
            >
              <span style={{ fontSize: 16, opacity: 0.9 }}>{item.icon}</span>
              {item.label}
              {item.id === "messages" && notifications > 0 && (
                <span
                  style={{
                    marginLeft: "auto",
                    background: "#6c63ff",
                    color: "#fff",
                    borderRadius: 10,
                    fontSize: 10,
                    fontWeight: 700,
                    padding: "2px 7px",
                    minWidth: 18,
                    textAlign: "center",
                  }}
                >
                  {notifications}
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* User card */}
        <div style={{ padding: "16px", borderTop: "1px solid #1e1e2e" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "10px 12px",
              borderRadius: 12,
              background: "#13131f",
            }}
          >
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: "50%",
                background: "linear-gradient(135deg, #6c63ff, #a78bfa)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 13,
                fontWeight: 700,
                color: "#fff",
                flexShrink: 0,
              }}
            >
              KD
            </div>
            <div style={{ overflow: "hidden" }}>
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: "#e8e8f0",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                Krishna Dhami
              </div>
              <div style={{ fontSize: 11, color: "#6c63ff", marginTop: 1 }}>
                ● Online
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* Top bar */}
        <div
          style={{
            height: 64,
            background: "#0e0e16",
            borderBottom: "1px solid #1e1e2e",
            display: "flex",
            alignItems: "center",
            padding: "0 28px",
            gap: 16,
            flexShrink: 0,
          }}
        >
          <div
            style={{
              flex: 1,
              maxWidth: 480,
              background: "#13131f",
              borderRadius: 10,
              border: "1px solid #1e1e2e",
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "0 16px",
              height: 38,
            }}
          >
            <span style={{ color: "#4b5563", fontSize: 14 }}>🔍</span>
            <input
              placeholder="Search skills, people, sessions..."
              style={{
                background: "none",
                border: "none",
                outline: "none",
                color: "#e8e8f0",
                fontSize: 13,
                flex: 1,
                fontFamily: "inherit",
              }}
            />
          </div>
          <div
            style={{
              marginLeft: "auto",
              display: "flex",
              alignItems: "center",
              gap: 16,
            }}
          >
            <div
              style={{
                background: "rgba(108,99,255,0.12)",
                border: "1px solid rgba(108,99,255,0.3)",
                borderRadius: 20,
                padding: "6px 14px",
                fontSize: 13,
                fontWeight: 600,
                color: "#a78bfa",
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              <span>⚡</span> 340 XP
            </div>
            <div
              style={{ position: "relative", cursor: "pointer" }}
              onClick={() => setNotifications(0)}
            >
              <div
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 10,
                  background: "#13131f",
                  border: "1px solid #1e1e2e",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 16,
                }}
              >
                🔔
              </div>
              {notifications > 0 && (
                <div
                  style={{
                    position: "absolute",
                    top: -4,
                    right: -4,
                    width: 16,
                    height: 16,
                    background: "#ef4444",
                    borderRadius: "50%",
                    fontSize: 9,
                    fontWeight: 700,
                    color: "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {notifications}
                </div>
              )}
            </div>
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: "50%",
                background: "linear-gradient(135deg, #6c63ff, #a78bfa)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 13,
                fontWeight: 700,
                color: "#fff",
                cursor: "pointer",
              }}
            >
              KD
            </div>
          </div>
        </div>

        {/* Page content */}
        <div
          style={{
            flex: 1,
            overflow: "auto",
            padding: activeTab === "messages" ? 0 : 28,
          }}
        >
          {/* DASHBOARD */}
          {activeTab === "dashboard" && <DashboardTab />}
          {/* MY SKILLS */}
          {activeTab === "skills" && <SkillsTab />}
          {/* MATCHES */}
          {activeTab === "matches" && <MatchesTab matches={mockMatches} />}
          {/* SESSIONS */}
          {activeTab === "sessions" && <SessionsTab sessions={mockSessions} />}
          {/* MESSAGES */}
          {activeTab === "messages" && (
            <MessagesTab
              messages={mockMessages}
              active={activeMessage}
              setActive={setActiveMessage}
              chatHistory={chatHistory}
              msgInput={msgInput}
              setMsgInput={setMsgInput}
              sendMsg={sendMsg}
            />
          )}
          {/* PROFILE */}
          {activeTab === "profile" && <ProfileTab />}
          {/* WALLET */}
          {activeTab === "wallet" && <WalletTab />}
        </div>
      </div>
    </div>
  );
}

/* ─── DASHBOARD TAB ─── */
function DashboardTab() {
  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 26, fontWeight: 700, color: "#fff", margin: 0 }}>
          Welcome back, Krishna 👋
        </h1>
        <p style={{ color: "#6b7280", marginTop: 6, fontSize: 14 }}>
          Here's what's happening with your skill exchanges today.
        </p>
      </div>

      {/* Stats row */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 16,
          marginBottom: 28,
        }}
      >
        {[
          {
            label: "Skills Offered",
            value: "6",
            sub: "Active listings",
            color: "#6c63ff",
            icon: "◈",
          },
          {
            label: "Completed Sessions",
            value: "14",
            sub: "This month",
            color: "#10b981",
            icon: "✓",
          },
          {
            label: "Active Matches",
            value: "3",
            sub: "Awaiting response",
            color: "#f59e0b",
            icon: "⇄",
          },
          {
            label: "Trust Score",
            value: "4.8★",
            sub: "Based on 9 reviews",
            color: "#ec4899",
            icon: "◉",
          },
        ].map((s) => (
          <div
            key={s.label}
            style={{
              background: "#0e0e16",
              borderRadius: 16,
              padding: "20px 22px",
              border: "1px solid #1e1e2e",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: 16,
                right: 16,
                width: 36,
                height: 36,
                borderRadius: 10,
                background: `${s.color}20`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 16,
                color: s.color,
              }}
            >
              {s.icon}
            </div>
            <div
              style={{
                fontSize: 28,
                fontWeight: 800,
                color: "#fff",
                marginBottom: 4,
              }}
            >
              {s.value}
            </div>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#e8e8f0" }}>
              {s.label}
            </div>
            <div style={{ fontSize: 11, color: "#6b7280", marginTop: 3 }}>
              {s.sub}
            </div>
            <div
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                height: 2,
                background: `linear-gradient(90deg, ${s.color}, transparent)`,
              }}
            />
          </div>
        ))}
      </div>

      <div
        style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: 20 }}
      >
        {/* Recommended matches */}
        <div
          style={{
            background: "#0e0e16",
            borderRadius: 16,
            padding: 22,
            border: "1px solid #1e1e2e",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 18,
            }}
          >
            <h3
              style={{
                margin: 0,
                fontSize: 15,
                fontWeight: 700,
                color: "#fff",
              }}
            >
              🤝 Recommended Matches
            </h3>
            <span
              style={{
                fontSize: 12,
                color: "#6c63ff",
                cursor: "pointer",
                fontWeight: 500,
              }}
            >
              View all →
            </span>
          </div>
          {mockMatches.slice(0, 3).map((m) => (
            <div
              key={m.id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                padding: "12px 0",
                borderBottom: "1px solid #13131f",
              }}
            >
              <div
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #6c63ff, #a78bfa)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 13,
                  fontWeight: 700,
                  color: "#fff",
                  flexShrink: 0,
                }}
              >
                {m.avatar}
              </div>
              <div style={{ flex: 1 }}>
                <div
                  style={{ fontSize: 14, fontWeight: 600, color: "#e8e8f0" }}
                >
                  {m.name}
                </div>
                <div style={{ fontSize: 12, color: "#6b7280", marginTop: 2 }}>
                  Teaches <span style={{ color: "#a78bfa" }}>{m.teaches}</span>{" "}
                  · Wants <span style={{ color: "#10b981" }}>{m.wants}</span>
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div
                  style={{
                    background: "rgba(108,99,255,0.15)",
                    color: "#a78bfa",
                    borderRadius: 8,
                    padding: "3px 10px",
                    fontSize: 12,
                    fontWeight: 700,
                    marginBottom: 4,
                  }}
                >
                  {m.matchScore}%
                </div>
                <button
                  style={{
                    background: "linear-gradient(135deg, #6c63ff, #a78bfa)",
                    color: "#fff",
                    border: "none",
                    borderRadius: 8,
                    padding: "5px 12px",
                    fontSize: 11,
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  Connect
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Upcoming Sessions */}
        <div
          style={{
            background: "#0e0e16",
            borderRadius: 16,
            padding: 22,
            border: "1px solid #1e1e2e",
          }}
        >
          <h3
            style={{
              margin: "0 0 18px",
              fontSize: 15,
              fontWeight: 700,
              color: "#fff",
            }}
          >
            📅 Upcoming Sessions
          </h3>
          {mockSessions
            .filter((s) => s.status === "upcoming")
            .map((s) => (
              <div
                key={s.id}
                style={{
                  background: "#13131f",
                  borderRadius: 12,
                  padding: "14px 16px",
                  marginBottom: 12,
                  borderLeft: `3px solid ${s.type === "teaching" ? "#6c63ff" : "#10b981"}`,
                }}
              >
                <div
                  style={{ fontSize: 13, fontWeight: 600, color: "#e8e8f0" }}
                >
                  {s.skill}
                </div>
                <div style={{ fontSize: 12, color: "#6b7280", marginTop: 4 }}>
                  with {s.partner}
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginTop: 8,
                    alignItems: "center",
                  }}
                >
                  <span style={{ fontSize: 11, color: "#9ca3af" }}>
                    {s.date} · {s.time}
                  </span>
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                      borderRadius: 6,
                      padding: "3px 8px",
                      background:
                        s.type === "teaching"
                          ? "rgba(108,99,255,0.15)"
                          : "rgba(16,185,129,0.15)",
                      color: s.type === "teaching" ? "#a78bfa" : "#10b981",
                    }}
                  >
                    {s.type === "teaching" ? "TEACHING" : "LEARNING"}
                  </span>
                </div>
              </div>
            ))}
          <button
            style={{
              width: "100%",
              padding: "10px",
              background: "rgba(108,99,255,0.1)",
              border: "1px dashed #6c63ff",
              borderRadius: 10,
              color: "#6c63ff",
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
              marginTop: 4,
            }}
          >
            + Schedule New Session
          </button>
        </div>
      </div>

      {/* Skill categories */}
      <div
        style={{
          background: "#0e0e16",
          borderRadius: 16,
          padding: 22,
          border: "1px solid #1e1e2e",
          marginTop: 20,
        }}
      >
        <h3
          style={{
            margin: "0 0 16px",
            fontSize: 15,
            fontWeight: 700,
            color: "#fff",
          }}
        >
          🔥 Trending Skill Categories
        </h3>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          {skillCategories.map((cat, i) => (
            <div
              key={cat}
              style={{
                padding: "8px 18px",
                borderRadius: 20,
                fontSize: 13,
                fontWeight: 500,
                cursor: "pointer",
                background:
                  i === 0
                    ? "linear-gradient(135deg, #6c63ff, #a78bfa)"
                    : "#13131f",
                color: i === 0 ? "#fff" : "#9ca3af",
                border: i === 0 ? "none" : "1px solid #1e1e2e",
                transition: "all 0.2s",
              }}
            >
              {cat}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── MY SKILLS TAB ─── */
function SkillsTab() {
  const [view, setView] = useState("offering");
  const offered = [
    { name: "React & Next.js", level: "Advanced", sessions: 6, rating: 4.9 },
    {
      name: "Node.js & Express",
      level: "Intermediate",
      sessions: 3,
      rating: 4.7,
    },
    { name: "TypeScript", level: "Advanced", sessions: 5, rating: 4.8 },
  ];
  const seeking = [
    { name: "UI/UX Design", level: "Beginner", priority: "High" },
    { name: "Python & ML", level: "Beginner", priority: "Medium" },
  ];

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: 28,
        }}
      >
        <div>
          <h1
            style={{ fontSize: 24, fontWeight: 700, color: "#fff", margin: 0 }}
          >
            My Skills
          </h1>
          <p style={{ color: "#6b7280", marginTop: 6, fontSize: 14 }}>
            Manage what you teach and what you want to learn.
          </p>
        </div>
        <button
          style={{
            background: "linear-gradient(135deg, #6c63ff, #a78bfa)",
            color: "#fff",
            border: "none",
            borderRadius: 10,
            padding: "10px 20px",
            fontSize: 13,
            fontWeight: 600,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          + Add Skill
        </button>
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
        {["offering", "seeking"].map((v) => (
          <button
            key={v}
            onClick={() => setView(v)}
            style={{
              padding: "8px 22px",
              borderRadius: 10,
              border: "none",
              cursor: "pointer",
              background:
                view === v
                  ? "linear-gradient(135deg, #6c63ff, #a78bfa)"
                  : "#13131f",
              color: view === v ? "#fff" : "#9ca3af",
              fontSize: 13,
              fontWeight: 600,
              textTransform: "capitalize",
            }}
          >
            {v === "offering" ? "Skills I Offer" : "Skills I Seek"}
          </button>
        ))}
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 16,
        }}
      >
        {(view === "offering" ? offered : seeking).map((s) => (
          <div
            key={s.name}
            style={{
              background: "#0e0e16",
              borderRadius: 16,
              padding: 22,
              border: "1px solid #1e1e2e",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: 3,
                background: "linear-gradient(90deg, #6c63ff, #a78bfa)",
              }}
            />
            <div
              style={{
                fontSize: 16,
                fontWeight: 700,
                color: "#fff",
                marginBottom: 8,
              }}
            >
              {s.name}
            </div>
            <div
              style={{
                display: "inline-block",
                padding: "3px 10px",
                borderRadius: 6,
                fontSize: 11,
                fontWeight: 600,
                background: "rgba(108,99,255,0.15)",
                color: "#a78bfa",
                marginBottom: 16,
              }}
            >
              {s.level}
            </div>
            {view === "offering" ? (
              <>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: 13,
                    color: "#9ca3af",
                    marginBottom: 8,
                  }}
                >
                  <span>{s.sessions} sessions taught</span>
                  <span style={{ color: "#f59e0b" }}>★ {s.rating}</span>
                </div>
                <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
                  <button
                    style={{
                      flex: 1,
                      padding: "8px",
                      background: "#13131f",
                      border: "1px solid #1e1e2e",
                      borderRadius: 8,
                      color: "#9ca3af",
                      fontSize: 12,
                      cursor: "pointer",
                    }}
                  >
                    Edit
                  </button>
                  <button
                    style={{
                      flex: 1,
                      padding: "8px",
                      background: "rgba(108,99,255,0.1)",
                      border: "1px solid #6c63ff",
                      borderRadius: 8,
                      color: "#a78bfa",
                      fontSize: 12,
                      cursor: "pointer",
                    }}
                  >
                    Boost
                  </button>
                </div>
              </>
            ) : (
              <>
                <div
                  style={{ fontSize: 13, color: "#9ca3af", marginBottom: 8 }}
                >
                  Priority:{" "}
                  <span
                    style={{
                      color: s.priority === "High" ? "#ef4444" : "#f59e0b",
                    }}
                  >
                    {s.priority}
                  </span>
                </div>
                <button
                  style={{
                    width: "100%",
                    padding: "8px",
                    background: "linear-gradient(135deg, #6c63ff, #a78bfa)",
                    border: "none",
                    borderRadius: 8,
                    color: "#fff",
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: "pointer",
                    marginTop: 14,
                  }}
                >
                  Find Matches
                </button>
              </>
            )}
          </div>
        ))}
        <div
          style={{
            background: "#0e0e16",
            borderRadius: 16,
            padding: 22,
            border: "1px dashed #1e1e2e",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
            cursor: "pointer",
            minHeight: 160,
          }}
        >
          <div style={{ fontSize: 28, color: "#6c63ff" }}>+</div>
          <div style={{ fontSize: 13, color: "#6b7280", fontWeight: 500 }}>
            Add New Skill
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── MATCHES TAB ─── */
function MatchesTab({ matches }) {
  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: "#fff", margin: 0 }}>
          Skill Matches
        </h1>
        <p style={{ color: "#6b7280", marginTop: 6, fontSize: 14 }}>
          AI-powered matches based on your skills and learning goals.
        </p>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: 18,
        }}
      >
        {matches.map((m) => (
          <div
            key={m.id}
            style={{
              background: "#0e0e16",
              borderRadius: 18,
              padding: 24,
              border: "1px solid #1e1e2e",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: 18,
                right: 18,
                background:
                  m.matchScore >= 90
                    ? "rgba(16,185,129,0.15)"
                    : "rgba(108,99,255,0.15)",
                color: m.matchScore >= 90 ? "#10b981" : "#a78bfa",
                borderRadius: 10,
                padding: "4px 12px",
                fontSize: 13,
                fontWeight: 800,
              }}
            >
              {m.matchScore}% match
            </div>
            <div
              style={{
                display: "flex",
                gap: 14,
                alignItems: "center",
                marginBottom: 16,
              }}
            >
              <div
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #6c63ff, #a78bfa)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 16,
                  fontWeight: 700,
                  color: "#fff",
                  flexShrink: 0,
                }}
              >
                {m.avatar}
              </div>
              <div>
                <div style={{ fontSize: 16, fontWeight: 700, color: "#fff" }}>
                  {m.name}
                </div>
                <div style={{ fontSize: 12, color: "#f59e0b", marginTop: 3 }}>
                  ★ {m.rating} · {m.sessions} sessions
                </div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 10, marginBottom: 18 }}>
              <div
                style={{
                  flex: 1,
                  background: "#13131f",
                  borderRadius: 10,
                  padding: "10px 14px",
                }}
              >
                <div
                  style={{
                    fontSize: 10,
                    color: "#6b7280",
                    marginBottom: 4,
                    letterSpacing: 1,
                    textTransform: "uppercase",
                  }}
                >
                  Teaches
                </div>
                <div
                  style={{ fontSize: 13, fontWeight: 600, color: "#a78bfa" }}
                >
                  {m.teaches}
                </div>
              </div>
              <div
                style={{
                  flex: 1,
                  background: "#13131f",
                  borderRadius: 10,
                  padding: "10px 14px",
                }}
              >
                <div
                  style={{
                    fontSize: 10,
                    color: "#6b7280",
                    marginBottom: 4,
                    letterSpacing: 1,
                    textTransform: "uppercase",
                  }}
                >
                  Wants to Learn
                </div>
                <div
                  style={{ fontSize: 13, fontWeight: 600, color: "#10b981" }}
                >
                  {m.wants}
                </div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button
                style={{
                  flex: 1,
                  padding: "10px",
                  background: "linear-gradient(135deg, #6c63ff, #a78bfa)",
                  border: "none",
                  borderRadius: 10,
                  color: "#fff",
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Request Exchange
              </button>
              <button
                style={{
                  padding: "10px 14px",
                  background: "#13131f",
                  border: "1px solid #1e1e2e",
                  borderRadius: 10,
                  color: "#9ca3af",
                  fontSize: 13,
                  cursor: "pointer",
                }}
              >
                View Profile
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── SESSIONS TAB ─── */
function SessionsTab({ sessions }) {
  const [filter, setFilter] = useState("all");
  const filtered =
    filter === "all" ? sessions : sessions.filter((s) => s.status === filter);
  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: 28,
        }}
      >
        <div>
          <h1
            style={{ fontSize: 24, fontWeight: 700, color: "#fff", margin: 0 }}
          >
            Sessions
          </h1>
          <p style={{ color: "#6b7280", marginTop: 6, fontSize: 14 }}>
            Track all your skill exchange sessions.
          </p>
        </div>
        <button
          style={{
            background: "linear-gradient(135deg, #6c63ff, #a78bfa)",
            color: "#fff",
            border: "none",
            borderRadius: 10,
            padding: "10px 20px",
            fontSize: 13,
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          + Schedule Session
        </button>
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
        {["all", "upcoming", "completed"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              padding: "7px 18px",
              borderRadius: 8,
              border: "none",
              cursor: "pointer",
              textTransform: "capitalize",
              background: filter === f ? "rgba(108,99,255,0.2)" : "#13131f",
              color: filter === f ? "#a78bfa" : "#9ca3af",
              fontSize: 13,
              fontWeight: 500,
              outline: filter === f ? "1px solid #6c63ff" : "none",
            }}
          >
            {f}
          </button>
        ))}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {filtered.map((s) => (
          <div
            key={s.id}
            style={{
              background: "#0e0e16",
              borderRadius: 14,
              padding: "18px 22px",
              border: "1px solid #1e1e2e",
              display: "flex",
              alignItems: "center",
              gap: 18,
            }}
          >
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                background:
                  s.type === "teaching"
                    ? "rgba(108,99,255,0.15)"
                    : "rgba(16,185,129,0.15)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 18,
                flexShrink: 0,
                color: s.type === "teaching" ? "#6c63ff" : "#10b981",
              }}
            >
              {s.type === "teaching" ? "◈" : "◎"}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 15, fontWeight: 600, color: "#fff" }}>
                {s.skill}
              </div>
              <div style={{ fontSize: 13, color: "#6b7280", marginTop: 3 }}>
                with {s.partner}
              </div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 13, color: "#9ca3af" }}>{s.date}</div>
              <div style={{ fontSize: 12, color: "#6b7280", marginTop: 2 }}>
                {s.time}
              </div>
            </div>
            <div
              style={{
                padding: "5px 14px",
                borderRadius: 8,
                fontSize: 11,
                fontWeight: 700,
                background:
                  s.status === "upcoming"
                    ? "rgba(245,158,11,0.15)"
                    : "rgba(16,185,129,0.15)",
                color: s.status === "upcoming" ? "#f59e0b" : "#10b981",
                textTransform: "uppercase",
                letterSpacing: 0.5,
              }}
            >
              {s.status}
            </div>
            {s.status === "upcoming" && (
              <button
                style={{
                  padding: "8px 18px",
                  background: "linear-gradient(135deg, #6c63ff, #a78bfa)",
                  border: "none",
                  borderRadius: 8,
                  color: "#fff",
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Join
              </button>
            )}
            {s.status === "completed" && (
              <button
                style={{
                  padding: "8px 18px",
                  background: "#13131f",
                  border: "1px solid #1e1e2e",
                  borderRadius: 8,
                  color: "#9ca3af",
                  fontSize: 12,
                  cursor: "pointer",
                }}
              >
                Review
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── MESSAGES TAB ─── */
function MessagesTab({
  messages,
  active,
  setActive,
  chatHistory,
  msgInput,
  setMsgInput,
  sendMsg,
}) {
  return (
    <div style={{ display: "flex", height: "100%", overflow: "hidden" }}>
      {/* Thread list */}
      <div
        style={{
          width: 300,
          borderRight: "1px solid #1e1e2e",
          background: "#0e0e16",
          flexShrink: 0,
          overflow: "auto",
        }}
      >
        <div style={{ padding: "20px 18px 14px" }}>
          <h2
            style={{ margin: 0, fontSize: 18, fontWeight: 700, color: "#fff" }}
          >
            Messages
          </h2>
        </div>
        {messages.map((m) => (
          <div
            key={m.id}
            onClick={() => setActive(m)}
            style={{
              display: "flex",
              gap: 12,
              padding: "14px 18px",
              cursor: "pointer",
              background:
                active?.id === m.id ? "rgba(108,99,255,0.1)" : "transparent",
              borderLeft:
                active?.id === m.id
                  ? "2px solid #6c63ff"
                  : "2px solid transparent",
              transition: "all 0.15s",
            }}
          >
            <div style={{ position: "relative", flexShrink: 0 }}>
              <div
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #6c63ff, #a78bfa)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 13,
                  fontWeight: 700,
                  color: "#fff",
                }}
              >
                {m.avatar}
              </div>
              {m.online && (
                <div
                  style={{
                    position: "absolute",
                    bottom: 1,
                    right: 1,
                    width: 10,
                    height: 10,
                    background: "#10b981",
                    borderRadius: "50%",
                    border: "2px solid #0e0e16",
                  }}
                />
              )}
            </div>
            <div style={{ flex: 1, overflow: "hidden" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span
                  style={{ fontSize: 14, fontWeight: 600, color: "#e8e8f0" }}
                >
                  {m.name}
                </span>
                <span style={{ fontSize: 11, color: "#4b5563" }}>{m.time}</span>
              </div>
              <div
                style={{
                  fontSize: 12,
                  color: "#6b7280",
                  marginTop: 2,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {m.preview}
              </div>
            </div>
            {m.unread > 0 && (
              <div
                style={{
                  width: 18,
                  height: 18,
                  background: "#6c63ff",
                  borderRadius: "50%",
                  fontSize: 10,
                  fontWeight: 700,
                  color: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                {m.unread}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Chat area */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          background: "#0a0a0f",
        }}
      >
        <div
          style={{
            padding: "16px 22px",
            borderBottom: "1px solid #1e1e2e",
            display: "flex",
            alignItems: "center",
            gap: 14,
            background: "#0e0e16",
          }}
        >
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #6c63ff, #a78bfa)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 13,
              fontWeight: 700,
              color: "#fff",
            }}
          >
            {active?.avatar}
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>
              {active?.name}
            </div>
            <div style={{ fontSize: 12, color: "#10b981" }}>● Online</div>
          </div>
          <button
            style={{
              marginLeft: "auto",
              padding: "7px 16px",
              background: "linear-gradient(135deg, #6c63ff, #a78bfa)",
              border: "none",
              borderRadius: 8,
              color: "#fff",
              fontSize: 12,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Schedule Session
          </button>
        </div>

        <div
          style={{
            flex: 1,
            overflow: "auto",
            padding: "22px",
            display: "flex",
            flexDirection: "column",
            gap: 14,
          }}
        >
          {chatHistory.map((c, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                justifyContent: c.from === "me" ? "flex-end" : "flex-start",
              }}
            >
              <div
                style={{
                  maxWidth: "65%",
                  padding: "12px 16px",
                  borderRadius:
                    c.from === "me"
                      ? "18px 18px 4px 18px"
                      : "18px 18px 18px 4px",
                  background:
                    c.from === "me"
                      ? "linear-gradient(135deg, #6c63ff, #7c6ff7)"
                      : "#13131f",
                  color: "#fff",
                  fontSize: 14,
                  lineHeight: 1.5,
                }}
              >
                {c.text}
                <div
                  style={{
                    fontSize: 10,
                    color: "rgba(255,255,255,0.5)",
                    marginTop: 4,
                    textAlign: c.from === "me" ? "right" : "left",
                  }}
                >
                  {c.time}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div
          style={{
            padding: "16px 22px",
            borderTop: "1px solid #1e1e2e",
            display: "flex",
            gap: 12,
          }}
        >
          <input
            value={msgInput}
            onChange={(e) => setMsgInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMsg()}
            placeholder="Type a message..."
            style={{
              flex: 1,
              background: "#13131f",
              border: "1px solid #1e1e2e",
              borderRadius: 12,
              padding: "12px 18px",
              color: "#e8e8f0",
              fontSize: 14,
              outline: "none",
              fontFamily: "inherit",
            }}
          />
          <button
            onClick={sendMsg}
            style={{
              padding: "12px 22px",
              background: "linear-gradient(135deg, #6c63ff, #a78bfa)",
              border: "none",
              borderRadius: 12,
              color: "#fff",
              fontSize: 14,
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── PROFILE TAB ─── */
function ProfileTab() {
  return (
    <div style={{ maxWidth: 800 }}>
      <h1
        style={{
          fontSize: 24,
          fontWeight: 700,
          color: "#fff",
          margin: "0 0 28px",
        }}
      >
        My Profile
      </h1>

      <div
        style={{
          background: "#0e0e16",
          borderRadius: 18,
          padding: 28,
          border: "1px solid #1e1e2e",
          marginBottom: 20,
          display: "flex",
          gap: 24,
          alignItems: "flex-start",
        }}
      >
        <div
          style={{
            width: 80,
            height: 80,
            borderRadius: "50%",
            background: "linear-gradient(135deg, #6c63ff, #a78bfa)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 28,
            fontWeight: 700,
            color: "#fff",
            flexShrink: 0,
          }}
        >
          KD
        </div>
        <div style={{ flex: 1 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
            }}
          >
            <div>
              <div style={{ fontSize: 22, fontWeight: 800, color: "#fff" }}>
                Krishna Dhami
              </div>
              <div style={{ fontSize: 14, color: "#6b7280", marginTop: 4 }}>
                Full-Stack Developer · Kathmandu, Nepal
              </div>
              <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
                <span
                  style={{
                    background: "rgba(108,99,255,0.15)",
                    color: "#a78bfa",
                    borderRadius: 8,
                    padding: "4px 12px",
                    fontSize: 12,
                    fontWeight: 600,
                  }}
                >
                  ★ 4.8 Rating
                </span>
                <span
                  style={{
                    background: "rgba(16,185,129,0.15)",
                    color: "#10b981",
                    borderRadius: 8,
                    padding: "4px 12px",
                    fontSize: 12,
                    fontWeight: 600,
                  }}
                >
                  14 Sessions
                </span>
                <span
                  style={{
                    background: "rgba(245,158,11,0.15)",
                    color: "#f59e0b",
                    borderRadius: 8,
                    padding: "4px 12px",
                    fontSize: 12,
                    fontWeight: 600,
                  }}
                >
                  340 XP
                </span>
              </div>
            </div>
            <button
              style={{
                padding: "9px 20px",
                background: "linear-gradient(135deg, #6c63ff, #a78bfa)",
                border: "none",
                borderRadius: 10,
                color: "#fff",
                fontSize: 13,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Edit Profile
            </button>
          </div>
          <p
            style={{
              color: "#9ca3af",
              fontSize: 14,
              marginTop: 14,
              lineHeight: 1.6,
            }}
          >
            Passionate full-stack developer with expertise in MERN stack. I love
            teaching what I know and learning from others. Currently seeking to
            improve my UI/UX design skills through skill exchange.
          </p>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div
          style={{
            background: "#0e0e16",
            borderRadius: 16,
            padding: 22,
            border: "1px solid #1e1e2e",
          }}
        >
          <h3
            style={{
              margin: "0 0 16px",
              fontSize: 15,
              fontWeight: 700,
              color: "#fff",
            }}
          >
            Skills I Offer
          </h3>
          {["React & Next.js", "Node.js & Express", "TypeScript"].map((s) => (
            <div
              key={s}
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "10px 0",
                borderBottom: "1px solid #13131f",
                fontSize: 14,
                color: "#9ca3af",
              }}
            >
              <span>{s}</span>
              <span style={{ color: "#a78bfa", fontWeight: 600 }}>
                Advanced
              </span>
            </div>
          ))}
        </div>
        <div
          style={{
            background: "#0e0e16",
            borderRadius: 16,
            padding: 22,
            border: "1px solid #1e1e2e",
          }}
        >
          <h3
            style={{
              margin: "0 0 16px",
              fontSize: 15,
              fontWeight: 700,
              color: "#fff",
            }}
          >
            Skills I Seek
          </h3>
          {["UI/UX Design", "Python & ML"].map((s) => (
            <div
              key={s}
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "10px 0",
                borderBottom: "1px solid #13131f",
                fontSize: 14,
                color: "#9ca3af",
              }}
            >
              <span>{s}</span>
              <span style={{ color: "#10b981", fontWeight: 600 }}>
                Beginner
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── WALLET TAB ─── */
function WalletTab() {
  const txns = [
    {
      type: "earned",
      desc: "Taught React to Arjun Sharma",
      xp: +50,
      date: "Jun 3",
    },
    {
      type: "earned",
      desc: "Completed session with Priya Thapa",
      xp: +30,
      date: "May 30",
    },
    {
      type: "spent",
      desc: "Requested priority match boost",
      xp: -20,
      date: "May 28",
    },
    { type: "earned", desc: "5-star review received", xp: +15, date: "May 25" },
  ];
  return (
    <div style={{ maxWidth: 700 }}>
      <h1
        style={{
          fontSize: 24,
          fontWeight: 700,
          color: "#fff",
          margin: "0 0 28px",
        }}
      >
        XP Wallet
      </h1>
      <div
        style={{
          background: "linear-gradient(135deg, #6c63ff, #a78bfa)",
          borderRadius: 20,
          padding: "32px 30px",
          marginBottom: 24,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -30,
            right: -30,
            width: 180,
            height: 180,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.06)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -50,
            left: -20,
            width: 150,
            height: 150,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.04)",
          }}
        />
        <div
          style={{
            fontSize: 13,
            color: "rgba(255,255,255,0.7)",
            letterSpacing: 1,
            textTransform: "uppercase",
          }}
        >
          Total XP Balance
        </div>
        <div
          style={{
            fontSize: 52,
            fontWeight: 800,
            color: "#fff",
            margin: "8px 0",
          }}
        >
          340 XP
        </div>
        <div style={{ fontSize: 13, color: "rgba(255,255,255,0.7)" }}>
          ⚡ Active since March 2026 · Level 3 Exchanger
        </div>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 14,
          marginBottom: 24,
        }}
      >
        {[
          { label: "Earned", value: "415 XP", color: "#10b981" },
          { label: "Spent", value: "75 XP", color: "#ef4444" },
          { label: "This Month", value: "80 XP", color: "#f59e0b" },
        ].map((s) => (
          <div
            key={s.label}
            style={{
              background: "#0e0e16",
              borderRadius: 14,
              padding: "18px 20px",
              border: "1px solid #1e1e2e",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: 22, fontWeight: 800, color: s.color }}>
              {s.value}
            </div>
            <div style={{ fontSize: 12, color: "#6b7280", marginTop: 4 }}>
              {s.label}
            </div>
          </div>
        ))}
      </div>
      <div
        style={{
          background: "#0e0e16",
          borderRadius: 16,
          padding: 22,
          border: "1px solid #1e1e2e",
        }}
      >
        <h3
          style={{
            margin: "0 0 18px",
            fontSize: 15,
            fontWeight: 700,
            color: "#fff",
          }}
        >
          Transaction History
        </h3>
        {txns.map((t, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "14px 0",
              borderBottom: i < txns.length - 1 ? "1px solid #13131f" : "none",
            }}
          >
            <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  background:
                    t.type === "earned"
                      ? "rgba(16,185,129,0.15)"
                      : "rgba(239,68,68,0.15)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 16,
                  color: t.type === "earned" ? "#10b981" : "#ef4444",
                }}
              >
                {t.type === "earned" ? "↑" : "↓"}
              </div>
              <div>
                <div
                  style={{ fontSize: 13, fontWeight: 500, color: "#e8e8f0" }}
                >
                  {t.desc}
                </div>
                <div style={{ fontSize: 11, color: "#6b7280", marginTop: 2 }}>
                  {t.date}
                </div>
              </div>
            </div>
            <div
              style={{
                fontSize: 15,
                fontWeight: 700,
                color: t.type === "earned" ? "#10b981" : "#ef4444",
              }}
            >
              {t.type === "earned" ? "+" : ""}
              {t.xp} XP
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
