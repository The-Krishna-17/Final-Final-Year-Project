import React from "react";
import Layout from "../Layout/Layout";
import { RESEARCH_STATS } from "@/constant/data";

const ResearchSection = () => {
  return (
    <Layout>
      <section id="research" className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <div className="space-y-4">
            <div className="space-y-3">
              <p className="text-sm uppercase tracking-widest text-muted-foreground">
                Research Backed
              </p>

              <h2 className="text-3xl font-bold leading-tight">
                Evidence based design, not assumptions
              </h2>

              <p className="text-muted-foreground leading-relaxed">
                SkillXchange was designed through structured primary research
                with 37 survey respondents and 3 in-depth interviews across
                students, freelancers, and career changers.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl border bg-background hover:shadow-md transition">
                <p className="text-sm">
                  <span className="font-semibold text-primary">
                    Intelligent matching is #1 priority:
                  </span>{" "}
                  4.51/5 rating with 54.1% marking it very important.
                </p>
              </div>

              <div className="p-4 rounded-xl border bg-background hover:shadow-md transition">
                <p className="text-sm">
                  <span className="font-semibold text-primary">
                    Programming & AI dominate demand:
                  </span>{" "}
                  37.8% Software Dev, 21.6% AI/Data Science.
                </p>
              </div>

              <div className="p-4 rounded-xl border bg-background hover:shadow-md transition">
                <p className="text-sm">
                  <span className="font-semibold text-primary">
                    Mobile-first behavior:
                  </span>{" "}
                  51.4% primarily use smartphones for learning.
                </p>
              </div>

              <div className="p-4 rounded-xl border bg-background hover:shadow-md transition">
                <p className="text-sm">
                  <span className="font-semibold text-primary">
                    Trust depends on verification:
                  </span>{" "}
                  40.5% prioritize verified profiles over ratings.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {RESEARCH_STATS.map((item, i) => (
              <div
                key={i}
                className="rounded-2xl border bg-background/70 backdrop-blur-sm p-6 hover:shadow-lg transition"
              >
                <h3 className="text-3xl font-bold text-primary">
                  {item.value}
                </h3>

                <p className="text-sm text-muted-foreground mt-2">
                  {item.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ResearchSection;
