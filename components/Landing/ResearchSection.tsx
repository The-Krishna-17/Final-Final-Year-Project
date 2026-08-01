"use client";

import React from "react";
import Layout from "../Layout/Layout";
import { motion } from "framer-motion";
import { RESEARCH_STATS } from "@/constant/data";

const ResearchSection = () => {
  return (
    <Layout>
      <section id="research" className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="space-y-4"
          >
            <div className="space-y-3">
              <p className="text-sm uppercase tracking-widest text-muted-foreground">
                Architecture
              </p>

              <h2 className="text-3xl font-bold leading-tight">
                Built for real-time collaboration
              </h2>

              <p className="text-muted-foreground leading-relaxed">
                SkillXchange is powered by a modern, high-performance tech stack. 
                From the instant you send a message to the moment you join a video call, 
                everything is optimized for speed and reliability.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl border bg-background hover:shadow-md transition">
                <p className="text-sm">
                  <span className="font-semibold text-primary">
                    AI-Driven Matching:
                  </span>{" "}
                  Groq SDK evaluates your skills to find the perfect learning partner instantly.
                </p>
              </div>

              <div className="p-4 rounded-xl border bg-background hover:shadow-md transition">
                <p className="text-sm">
                  <span className="font-semibold text-primary">
                    Zero-Install Video:
                  </span>{" "}
                  Jitsi WebRTC integration means no Zoom links or app downloads required.
                </p>
              </div>

              <div className="p-4 rounded-xl border bg-background hover:shadow-md transition">
                <p className="text-sm">
                  <span className="font-semibold text-primary">
                    Persistent Messaging:
                  </span>{" "}
                  Socket.IO ensures messages are delivered instantly, even if the other person is offline.
                </p>
              </div>

              <div className="p-4 rounded-xl border bg-background hover:shadow-md transition">
                <p className="text-sm">
                  <span className="font-semibold text-primary">
                    Enterprise Security:
                  </span>{" "}
                  JWT refresh token rotation and httpOnly cookies keep your account safe.
                </p>
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {RESEARCH_STATS.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: 0.1 * i }}
                className="rounded-2xl border bg-background/70 backdrop-blur-sm p-6 hover:shadow-lg transition"
              >
                <h3 className="text-3xl font-bold text-primary">
                  {item.value}
                </h3>

                <p className="text-sm text-muted-foreground mt-2">
                  {item.label}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ResearchSection;
