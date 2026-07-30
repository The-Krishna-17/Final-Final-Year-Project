"use client";

import Layout from "../Layout/Layout";
import { motion } from "framer-motion";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { FaRocket, FaClock, FaBlog, FaBriefcase } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { FaArrowRightLong } from "react-icons/fa6";

const comingFeatures = [
  {
    title: "Blogs & Insights",
    description:
      "Articles on peer-to-peer learning, AI-powered matching, and skill exchange tips from the SkillXchange team.",
    icon: FaBlog,
  },
  {
    title: "Internships & Jobs",
    description:
      "Explore internship opportunities and job openings. Find roles that match your skills and career goals.",
    icon: FaBriefcase,
  },
];

const ComingSoonSection = () => {
  const router = useRouter();

  return (
    <Layout>
      <section id="coming-soon" className="space-y-6">
        <div className="text-center space-y-3 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium"
          >
            <FaRocket className="text-xs" />
            Coming Soon
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl font-bold leading-tight"
          >
            Exciting new features are on the way
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-muted-foreground max-w-2xl mx-auto"
          >
            We are building features to help you learn, grow, and advance your
            career. Here is a preview of what is coming next.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {comingFeatures.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: 0.1 * idx }}
              >
                <Card className="group h-full p-6 transition-all hover:-translate-y-1 hover:shadow-lg border-dashed">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300 mb-4">
                    <Icon className="text-xl" />
                  </div>

                  <h3 className="text-xl font-semibold">{feature.title}</h3>

                  <p className="text-sm text-muted-foreground mt-2">
                    {feature.description}
                  </p>

                  <div className="mt-4 flex items-center gap-1 text-xs text-primary font-medium">
                    <FaClock />
                    <span>Launching Soon</span>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center mt-8"
        >
          <Button
            size="lg"
            className="rounded-full px-8 py-6"
            onClick={() => router.push("/signup")}
          >
            Get Notified <FaArrowRightLong />
          </Button>
        </motion.div>
      </section>
    </Layout>
  );
};

export default ComingSoonSection;
