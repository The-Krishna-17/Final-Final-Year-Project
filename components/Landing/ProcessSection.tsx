import { PROCESS_STEPS } from "@/constant/data";
import Layout from "../Layout/Layout";
import Image from "next/image";
import { FaUsers } from "react-icons/fa6";
import { FaExchangeAlt } from "react-icons/fa";
import processImage from "@/public/process.jpg";

const ProcessSection = () => {
  return (
    <Layout>
      <section
        id="process"
        className="space-y-6 bg-muted/40 p-4 border border-border/50"
      >
        <div className="space-y-3 text-center max-w-2xl mx-auto">
          <p className="text-sm uppercase tracking-widest text-muted-foreground">
            The Process
          </p>
          <h2 className="text-3xl font-bold leading-tight">
            From sign-up to skill swap in minutes
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            SkillXchange makes peer learning frictionless with a clear four step
            journey powered by AI matching and real-time communication.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex-1 p-4 flex flex-col gap-6">
            {PROCESS_STEPS.map((c) => {
              const Icon = c.icon;

              return (
                <div key={c.title} className="group flex items-start gap-4">
                  <div className="mb-4 flex min-h-12 min-w-12 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition">
                    <Icon className="text-xl" />
                  </div>
                  <div className="flex flex-col">
                    <h3 className="text-lg font-semibold mb-2">{c.title}</h3>

                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {c.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="flex-1 p-4 relative">
            <Image
              src={processImage}
              alt="Process"
              className="w-full rounded-2xl object-cover shadow-xl"
            />

            <div className="absolute left-1/2 -translate-x-1/2 -bottom-10 w-[92%] max-w-lg rounded-lg bg-primary text-primary-foreground backdrop-blur-sm shadow-2xl p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-background">
                      <FaUsers className="text-lg text-primary" />
                    </div>

                    <h3 className="text-3xl font-semibold">100+</h3>
                  </div>

                  <p className="mt-1 text-sm text-muted-foreground">
                    Members Joined
                  </p>
                </div>

                <div className="h-16 w-px bg-border mx-6 shrink-0" />

                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-background">
                      <FaExchangeAlt className="text-lg text-primary" />
                    </div>

                    <h3 className="text-3xl font-semibold">50+</h3>
                  </div>

                  <p className="mt-1 text-sm text-muted-foreground">
                    Skill Exchanges
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ProcessSection;
