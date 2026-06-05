"use client";

import React from "react";
import { FaBookOpen, FaBriefcase, FaChartLine } from "react-icons/fa6";
import { motion } from "framer-motion";
import Layout from "../Layout/Layout";

const MissionSection = () => {
  return (
    <Layout>
      <section
        id="mission"
        className="space-y-6 bg-muted/40 p-4 border border-border/50"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="space-y-4"
          >
            <p className="text-sm uppercase tracking-widest text-muted-foreground">
              Our Mission
            </p>

            <h2 className="text-3xl font-bold leading-tight">
              Democratising skill access for everyone
            </h2>

            <p className="text-muted-foreground leading-relaxed">
              SkillXchange isn't just a platform it's a commitment to breaking
              down financial barriers to education and enabling a culture of
              lifelong, reciprocal learning. Our work aligns with three United
              Nations Sustainable Development Goals.
            </p>

            <div className="p-5 rounded-xl border bg-background/60 backdrop-blur-sm">
              <p className="text-sm text-muted-foreground leading-relaxed">
                We believe knowledge should not be locked behind paywalls or
                privilege. Every learner should have equal access to skills that
                shape their future.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
            <div className="p-5 rounded-xl border bg-background hover:shadow-md transition">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-primary">SDG 4</span>
                <FaBookOpen className="text-xl text-primary" />
              </div>

              <h3 className="mt-3 text-lg font-semibold">Quality Education</h3>

              <p className="text-sm text-muted-foreground mt-2">
                Free, accessible, practical skill learning for all
              </p>
            </div>

            <div className="p-5 rounded-xl border bg-background hover:shadow-md transition">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-primary">SDG 8</span>
                <FaBriefcase className="text-xl text-primary" />
              </div>

              <h3 className="mt-3 text-lg font-semibold">
                Decent Work & Growth
              </h3>

              <p className="text-sm text-muted-foreground mt-2">
                Empowering learners to grow professional skills
              </p>
            </div>

            <div className="p-5 rounded-xl border bg-background hover:shadow-md transition sm:col-span-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-primary">SDG 10</span>
                <FaChartLine className="text-xl text-primary" />
              </div>

              <h3 className="mt-3 text-lg font-semibold">
                Reduced Inequalities
              </h3>

              <p className="text-sm text-muted-foreground mt-2">
                Removing financial barriers to skill development
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default MissionSection;
