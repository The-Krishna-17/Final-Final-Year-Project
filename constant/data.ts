import {
  FaMoneyBillWave,
  FaRandom,
  FaShieldAlt,
  FaHourglassStart,
  FaUserPlus,
  FaRobot,
  FaComments,
  FaBrain,
  FaLightbulb,
  FaBolt,
  FaCalendarAlt,
  FaStar,
} from "react-icons/fa";

export const LANDING_PAGE_MARQUEE = [
  "Exchange Skills, Build Together",
  "Learn New Practical Skills",
  "Share Your Knowledge Freely",
  "Grow Together Every Day",
  "Teach And Learn Continuously",
  "Upgrade Your Skills Today",
];

export const THE_PROBLEM_CONTENT = [
  {
    title: "Financial Barriers",
    content:
      "High subscription costs prevent the majority of learners, especially in low-income communities, from accessing quality skill development resources.",
    icon: FaMoneyBillWave,
  },
  {
    title: "No Smart Matching",
    content:
      "Most P2P platforms lack intelligent algorithms to detect mutual exchange value, causing users to abandon the platform before finding a good match.",
    icon: FaRandom,
  },
  {
    title: "Trust Deficits",
    content:
      "Without structured rating systems, session logging, or verified skill profiles, users can't confidently assess the reliability of exchange partners.",
    icon: FaShieldAlt,
  },
  {
    title: "Cold Start Problem",
    content:
      "Existing platforms fail new users by not having enough interaction history to make meaningful recommendations from day one.",
    icon: FaHourglassStart,
  },
];

export const PROCESS_STEPS = [
  {
    title: "Create Your Profile",
    description:
      "Register securely with JWT authentication. List your skills offered, skills sought, proficiency level, and weekly availability slots.",
    icon: FaUserPlus,
  },
  {
    title: "Get Matched by AI",
    description:
      "Our hybrid recommendation engine uses content based and collaborative filtering to suggest the most compatible skill exchange partners with a plain language explanation of why.",
    icon: FaRobot,
  },
  {
    title: "Chat & Schedule",
    description:
      "Connect in real time via built in Socket.io messaging. Propose, accept, and schedule exchange sessions directly within the platform.",
    icon: FaComments,
  },
  {
    title: "Exchange & Review",
    description:
      "Conduct your skill session, then submit star ratings and qualitative feedback. Your trust score grows with every successful exchange.",
    icon: FaStar,
  },
];

export const FEATURES = [
  {
    id: "FR03",
    priority: "High Priority",
    icon: FaBrain,
    title: "Intelligent Hybrid Matching",
    description:
      "Content-based filtering for new users (cold start) and collaborative filtering for experienced users. Adapts to your interaction history over time.",
    rating: "4.51/5",
    metricLabel: "User Rating",
  },
  {
    id: "FR04",
    priority: "High Priority",
    icon: FaLightbulb,
    title: "Match Explanation Summaries",
    description:
      "Transparency is built in. Every recommended match comes with a clear, user-friendly explanation of why you were paired — reducing anxiety and building trust.",
    rating: "4.11/5",
    metricLabel: "User Rating",
  },
  {
    id: "FR05",
    priority: "High Priority",
    icon: FaBolt,
    title: "Real-Time Messaging",
    description:
      "Bidirectional Socket.io-powered chat between matched users. No external tools needed — WhatsApp, Zoom, and calendar apps all replaced with one place.",
    rating: "4.24/5",
    metricLabel: "User Rating",
  },
  {
    id: "FR07",
    priority: "Medium Priority",
    icon: FaCalendarAlt,
    title: "Session Scheduling Module",
    description:
      "Set your weekly availability, propose time slots, and confirm sessions in-platform. 70.2% of users preferred in-platform scheduling over external calendar links.",
    rating: "70.2%",
    metricLabel: "User Preference",
  },
  {
    id: "FR08",
    priority: "High Priority",
    icon: FaStar,
    title: "Post-Session Ratings & Reviews",
    description:
      "Star ratings and qualitative reviews after every session. Verified skill profiles with composite trust scores surface the best exchange partners automatically.",
    rating: "4.46/5",
    metricLabel: "User Rating",
  },
  {
    id: "FR09",
    priority: "High Priority",
    icon: FaShieldAlt,
    title: "Reporting & Moderation",
    description:
      "An admin moderation dashboard and community reporting mechanism. 86.5% of users said they'd stay on a platform after a negative experience if a resolution system existed.",
    rating: "86.5%",
    metricLabel: "User Confidence",
  },
];
