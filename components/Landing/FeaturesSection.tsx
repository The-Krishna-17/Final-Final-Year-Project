"use client";

import React, { useEffect, useState } from "react";
import Layout from "../Layout/Layout";
import { motion } from "framer-motion";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { FaArrowLeftLong, FaArrowRightLong } from "react-icons/fa6";
import { FEATURES } from "@/constant/data";

const FeaturesSection = () => {
  const [index, setIndex] = useState(0);
  const totalPages = Math.ceil(FEATURES.length / 3);

  const next = () => setIndex((prev) => (prev + 1) % totalPages);
  const prev = () => setIndex((prev) => (prev - 1 + totalPages) % totalPages);

  const chunked = [];

  for (let i = 0; i < FEATURES.length; i += 3) {
    chunked.push(FEATURES.slice(i, i + 3));
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % totalPages);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Layout>
      {" "}
      <section id="features" className="space-y-6">
        <div className="flex items-start justify-between">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
            className="space-y-3 max-w-2xl"
          >
            <p className="text-sm uppercase tracking-widest text-muted-foreground">
              Core Features
            </p>
            <h2 className="text-3xl font-bold leading-tight">
              Built around what users actually need{" "}
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Every feature was prioritised from real survey data and user
              interviews not assumptions. High scores validate every design
              decision.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex items-center gap-4"
          >
            <Button variant="outline" onClick={prev}>
              <FaArrowLeftLong />
            </Button>

            <Button variant="outline" onClick={next}>
              <FaArrowRightLong />
            </Button>
          </motion.div>
        </div>
        <motion.div
          className="overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div
            className="flex transition-transform duration-700 ease-in-out"
            style={{ transform: `translateX(-${index * 100}%)` }}
          >
            {chunked.map((group, i) => (
              <div key={i} className="w-full flex gap-4 shrink-0 px-2 py-4">
                {group.map((feature) => {
                  const Icon = feature.icon;

                  return (
                    <div key={feature.id} className="flex-1">
                      <Card className="group h-full p-6 transition-all hover:-translate-y-1 hover:shadow-lg">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                          <Icon className="text-xl" />
                        </div>

                        <span className="text-xs text-primary font-medium block mt-4">
                          {feature.id} · {feature.priority}
                        </span>

                        <h3 className="text-xl font-semibold mt-2">
                          {feature.title}
                        </h3>

                        <p className="text-sm text-muted-foreground mt-2">
                          {feature.description}
                        </p>

                        <div className="pt-4 border-t mt-4">
                          <h4 className="text-2xl font-bold text-primary">
                            {feature.rating}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            {feature.metricLabel}
                          </p>
                        </div>
                      </Card>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </motion.div>
      </section>
    </Layout>
  );
};

export default FeaturesSection;
