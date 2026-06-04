import {
  FaMoneyBillWave,
  FaRandom,
  FaShieldAlt,
  FaHourglassStart,
  FaUserPlus,
  FaRobot,
  FaComments,
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
