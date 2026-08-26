"use client";

import Layout from "../Layout/Layout";
import { motion } from "framer-motion";
import { Card } from "../ui/card";
import { FaBlog, FaBriefcase, FaBell, FaPaperclip } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { FaArrowRightLong } from "react-icons/fa6";

const platformFeatures = [
  {
    title: "Blogs & Insights",
    description:
      "Read and write articles on peer-to-peer learning, AI-powered matching, and skill exchange tips. Share your knowledge with the community.",
    icon: FaBlog,
    link: "/blogs",
    tag: "Live Now",
  },
  {
    title: "Internships & Jobs",
    description:
      "Explore internship opportunities and job openings. Find roles that match your skills and career goals, all in one place.",
    icon: FaBriefcase,
    link: "/jobs",
    tag: "Live Now",
  },
  {
    title: "Live Notifications",
    description:
      "Stay updated with instant notifications for swap requests, meeting invitations, messages, and platform updates — all in real time.",
    icon: FaBell,
    link: "/notifications",
    tag: "Live Now",
  },
  {
    title: "File Sharing in Chat",
    description:
      "Share images, documents, presentations, and more directly in your conversations. Securely stored and accessible anytime.",
    icon: FaPaperclip,
    link: "/messages",
    tag: "Live Now",
  },
];

const PlatformFeaturesSection = () => {
  const router = useRouter();

  return (
    <Layout>
      <section id="platform" className="space-y-6">
        <div className="text-center space-y-3 mb-8">
          <p className="text-sm uppercase tracking-widest text-muted-foreground">
            Platform Features
          </p>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl font-bold leading-tight"
          >
            Everything you need to learn and grow
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-muted-foreground max-w-2xl mx-auto"
          >
            Beyond skill matching and video sessions, SkillXchange gives you a
            complete ecosystem to share knowledge, find opportunities, and stay
            connected.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {platformFeatures.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: 0.1 * idx }}
              >
                <Card className="group h-full p-6 transition-all hover:shadow-lg">
                  <div className="flex items-start justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                      <Icon className="text-xl" />
                    </div>
                    <span className="text-xs font-medium text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950 px-2 py-1 rounded-full">
                      {feature.tag}
                    </span>
                  </div>

                  <h3 className="text-xl font-semibold mt-4">{feature.title}</h3>

                  <p className="text-sm text-muted-foreground mt-2">
                    {feature.description}
                  </p>

                  <Button
                    variant="ghost"
                    size="sm"
                    className="mt-4 gap-1 group/btn"
                    onClick={() => router.push(feature.link)}
                  >
                    Explore
                    <FaArrowRightLong className="transition-transform group-hover/btn:translate-x-1" />
                  </Button>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </section>
    </Layout>
  );
};

export default PlatformFeaturesSection;
