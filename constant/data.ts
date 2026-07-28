import {
  CurrentWork,
  DateField,
  UserData,
  WorkExperience,
} from "@/store/features/auth/type";
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
  FaChartLine,
  FaQuestionCircle,
} from "react-icons/fa";
import {
  SiNextdotjs,
  SiNodedotjs,
  SiExpress,
  SiMongodb,
  SiSocketdotio,
  SiVercel,
  SiTypescript,
} from "react-icons/si";
import {
  FaLinkedin,
  FaGithub,
  FaTwitter,
  FaInstagram,
  FaFacebook,
  FaGlobe,
} from "react-icons/fa";
import { RiShareBoxLine } from "react-icons/ri";

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

export const RESEARCH_STATS = [
  { value: "4.51", label: "Avg importance of intelligent matching" },
  { value: "91.9%", label: "Willing to teach a skill" },
  { value: "78.4%", label: "Unaware of similar platforms" },
  { value: "86.5%", label: "Would stay after bad experience" },
  { value: "4.11 / 5", label: "Interest in joining platform" },
];

export const TECH_STACK = [
  {
    id: 1,
    name: "Next.js 14",
    role: "Frontend · TypeScript",
    icon: SiNextdotjs,
    color: "#000000",
  },
  {
    id: 2,
    name: "Node.js",
    role: "Backend Runtime",
    icon: SiNodedotjs,
    color: "#3C873A",
  },
  {
    id: 3,
    name: "Express.js",
    role: "REST API Layer",
    icon: SiExpress,
    color: "#444444",
  },
  {
    id: 4,
    name: "MongoDB Atlas",
    role: "Cloud NoSQL Database",
    icon: SiMongodb,
    color: "#47A248",
  },
  {
    id: 5,
    name: "Socket.io",
    role: "Real-time Messaging",
    icon: SiSocketdotio,
    color: "#010101",
  },
];

export const ARCHITECTURE = [
  {
    id: "frontend",
    title: "Frontend",
    icon: SiNextdotjs,
    points: [
      "Next.js 14 with TypeScript",
      "Server-side rendering (SSR)",
      "JWT-secured auth flows",
      "Fully mobile-responsive UI",
      "Deployed on Vercel",
    ],
  },

  {
    id: "backend",
    title: "Backend",
    icon: SiNodedotjs,
    points: [
      "Node.js + Express.js REST API",
      "MongoDB Atlas + Mongoose ODM",
      "Socket.io WebSocket server",
      "JWT token auth & refresh",
      "Deployed on Render / AWS",
    ],
  },

  {
    id: "intelligence",
    title: "Intelligence",
    icon: FaBrain,
    points: [
      "Content-based filtering (cold start)",
      "Collaborative filtering (active users)",
      "Match explanation generator",
      "Precision, Recall, F1, MAP metrics",
      "Onboarding quiz for preferences",
    ],
  },
];

export const FAQS = [
  {
    question: "What is SkillXchange?",
    answer:
      "SkillXchange is a peer-to-peer platform where users can exchange skills without paying money. You teach what you know and learn what you need.",
  },
  {
    question: "Is SkillXchange free to use?",
    answer:
      "Yes. The platform is completely free. It is designed to democratize access to learning through skill exchange.",
  },
  {
    question: "How does matching work?",
    answer:
      "We use a hybrid recommendation system combining content-based filtering (for new users) and collaborative filtering (for active users) to suggest the best skill partners.",
  },
  {
    question: "Can I trust other users?",
    answer:
      "Yes. Every user has verified profiles, ratings, and trust scores based on post-session reviews and platform activity.",
  },
  {
    question: "Do I need to be an expert to teach?",
    answer:
      "No. You only need to be one step ahead of someone else. Teaching reinforces your own understanding while helping others grow.",
  },
];

export const CONTACT_BENEFITS = [
  "Research-driven peer-to-peer learning platform",
  "AI-powered skill matching and recommendations",
  "Secure messaging and session scheduling",
  "Completely free skill exchange ecosystem",
  "Built around lifelong learning and accessibility",
  "Aligned with UN Sustainable Development Goals",
];

export const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export const NOW_YEAR = new Date().getFullYear();
export const NOW_MONTH = new Date().getMonth() + 1;

export const EMPTY_DATE: DateField = {
  year: NOW_YEAR,
  month: NOW_MONTH,
  day: null,
};
export const EMPTY_EXP: WorkExperience = {
  company: "",
  role: "",
  startDate: { ...EMPTY_DATE },
  endDate: null,
  description: "",
};
export const EMPTY_CW: CurrentWork = {
  company: "",
  role: "",
  startDate: { ...EMPTY_DATE },
  endDate: null,
  description: "",
};

export const SOCIAL_LINKS = [
  {
    key: "linkedin",
    label: "LinkedIn",
    icon: FaLinkedin,
    hoverClass: "hover:border-info hover:bg-info-muted hover:text-info-muted-foreground",
  },
  {
    key: "github",
    label: "GitHub",
    icon: FaGithub,
    hoverClass:
      "hover:border-foreground/60 hover:bg-muted hover:text-foreground",
  },
  {
    key: "twitter",
    label: "Twitter",
    icon: FaTwitter,
    hoverClass: "hover:border-info/70 hover:bg-info-muted hover:text-info-muted-foreground",
  },
  {
    key: "instagram",
    label: "Instagram",
    icon: FaInstagram,
    hoverClass: "hover:border-primary hover:bg-primary/10 hover:text-primary",
  },
  {
    key: "facebook",
    label: "Facebook",
    icon: FaFacebook,
    hoverClass: "hover:border-info hover:bg-info-muted hover:text-info-muted-foreground",
  },
  {
    key: "website",
    label: "Website",
    icon: FaGlobe,
    hoverClass:
      "hover:border-success hover:bg-success-muted hover:text-success-muted-foreground",
  },
] as const;
