import { ARCHITECTURE, TECH_STACK } from "@/constant/data";
import Layout from "../Layout/Layout";

const TechnologySection = () => {
  return (
    <Layout>
      <section id="technology" className="space-y-6">
        <div className="space-y-3 max-w-2xl mx-auto text-center">
          <p className="text-sm uppercase tracking-widest text-muted-foreground">
            Technology
          </p>
          <h2 className="text-3xl font-bold leading-tight">
            Built on a modern, scalable MERN stack{" "}
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            Every technology choice was validated against research requirements
            from server side rendering for SEO to type safety across the
            codebase.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {TECH_STACK.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.id}
                className="rounded-xl border bg-background p-5 hover:shadow-md transition"
              >
                <div className="flex items-center gap-3">
                  <Icon className="text-2xl text-primary" />
                  <h3 className="font-semibold">{item.name}</h3>
                </div>

                <p className="text-sm text-muted-foreground mt-2">
                  {item.role}
                </p>
              </div>
            );
          })}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {ARCHITECTURE.map((section) => {
            const Icon = section.icon;

            return (
              <div
                key={section.id}
                className="rounded-xl border bg-background p-6 hover:shadow-lg transition"
              >
                {/* Header */}
                <div className="flex items-center gap-3 mb-4">
                  <Icon className="text-2xl text-primary" />
                  <h3 className="text-xl font-semibold">{section.title}</h3>
                </div>

                {/* Points */}
                <ul className="space-y-3 text-sm text-muted-foreground">
                  {section.points.map((point, i) => (
                    <li key={i} className="flex gap-2">
                      <span className="text-primary">•</span>
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </section>
    </Layout>
  );
};

export default TechnologySection;
