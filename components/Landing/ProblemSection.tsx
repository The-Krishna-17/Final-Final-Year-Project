import Layout from "../Layout/Layout";
import { Card } from "../ui/card";
import { THE_PROBLEM_CONTENT } from "@/constant/data";

const ProblemSection = () => {
  return (
    <Layout>
      <section id="problem" className="space-y-6">
        <div className="flex flex-col gap-10">
          <div className="grid md:grid-cols-2 gap-8 items-start">
            <div className="space-y-3">
              <p className="text-sm uppercase tracking-widest text-muted-foreground">
                The Problem
              </p>

              <h2 className="text-3xl font-bold leading-tight">
                Online learning is broken for most people.
              </h2>
            </div>

            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                Platforms like Udemy, Coursera, and Skillshare rely on
                subscription or pay-per-course models locking out students,
                freelancers, and learners from low income communities who have
                real skills to share.
              </p>

              <div className="border-l-4 border-primary pl-4 italic text-foreground/80 space-y-1">
                <p>
                  “35.1% of survey respondents had previously used a paid
                  platform but discontinued due to cost. Another 16.2% said they
                  never used one because of financial barriers alone.”
                </p>
                <span className="text-xs text-muted-foreground not-italic">
                  — SkillXchange User Research, 2025
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {THE_PROBLEM_CONTENT.map((c) => {
              const Icon = c.icon;

              return (
                <Card
                  key={c.title}
                  className="group bg-card p-4 shadow-sm transition-all hover:-translate-y-1"
                >
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition">
                    <Icon className="text-xl" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{c.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {c.content}
                  </p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ProblemSection;
