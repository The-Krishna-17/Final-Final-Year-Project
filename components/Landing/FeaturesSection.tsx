import React, { useEffect, useState } from "react";
import Layout from "../Layout/Layout";
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
          <div className="space-y-3 max-w-2xl">
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
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={prev}>
              <FaArrowLeftLong />
            </Button>

            <Button variant="outline" onClick={next}>
              <FaArrowRightLong />
            </Button>
          </div>
        </div>
        <div className="overflow-hidden">
          <div
            className="flex transition-transform duration-700 ease-in-out"
            style={{ transform: `translateX(-${index * 100}%)` }}
          >
            {chunked.map((group, i) => (
              <div key={i} className="w-full flex gap-4 shrink-0 px-2 py-4">
                {group.map((feature) => {
                  const Icon = feature.icon;

                  return (
                    <Card
                      key={feature.id}
                      className="group flex-1 p-6 transition-all hover:-translate-y-1 hover:shadow-lg"
                    >
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground">
                        <Icon className="text-xl" />
                      </div>

                      <span className="text-xs text-primary font-medium">
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
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default FeaturesSection;
