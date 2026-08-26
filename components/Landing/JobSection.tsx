"use client";

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchJobs } from "@/store/features/jobs/jobSlice";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Briefcase, Building, MapPin, DollarSign, ArrowRight, ExternalLink, Sparkles } from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

const TYPE_COLORS: Record<string, string> = {
  "Full-time": "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-800",
  "Part-time": "bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950/30 dark:text-sky-400 dark:border-sky-800",
  "Internship": "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-800",
  "Contract": "bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-950/30 dark:text-violet-400 dark:border-violet-800",
  "Placement": "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/30 dark:text-rose-400 dark:border-rose-800",
};

export default function JobSection() {
  const dispatch = useAppDispatch();
  const { jobs, loadingJobs } = useAppSelector((s) => s.jobs);

  useEffect(() => {
    dispatch(fetchJobs());
  }, [dispatch]);

  const featuredJobs = jobs.slice(0, 3);

  const handleApplyClick = (applyLink: string) => {
    let url = applyLink;
    if (url.includes("@") && !url.startsWith("mailto:")) {
      url = `mailto:${url}`;
    } else if (!url.startsWith("http://") && !url.startsWith("https://") && !url.includes("@")) {
      url = `https://${url}`;
    }
    window.open(url, "_blank");
  };

  return (
    <section className="py-16 border-t border-border/50 bg-background relative overflow-hidden" id="jobs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Career Opportunities</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Explore <span className="text-primary">Jobs & Internships</span>
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base max-w-xl">
              Verified placements, internships, and full-time opportunities hand-curated by admins for our community members.
            </p>
          </div>
          <Link href="/public-jobs">
            <Button variant="outline" className="gap-2 rounded-full cursor-pointer hover:bg-primary hover:text-primary-foreground transition-all">
              Explore All Openings <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>

        {/* Content Grid */}
        {loadingJobs ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-56 rounded-xl border border-border bg-muted/20 animate-pulse" />
            ))}
          </div>
        ) : featuredJobs.length === 0 ? (
          <div className="text-center py-12 border border-dashed rounded-xl bg-card">
            <p className="text-muted-foreground text-sm">No job openings listed right now. Check back soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredJobs.map((job) => {
              const companyInit = job.company?.[0]?.toUpperCase() || "J";

              return (
                <div
                  key={job._id}
                  className="group overflow-hidden rounded-xl border border-border bg-card text-card-foreground p-5 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between hover:-translate-y-1"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center font-bold text-base text-foreground border border-border">
                        {companyInit}
                      </div>
                      <Badge
                        variant="outline"
                        className={`text-[10px] font-medium border ${
                          TYPE_COLORS[job.type] || "bg-muted text-muted-foreground border-border"
                        }`}
                      >
                        {job.type}
                      </Badge>
                    </div>

                    <div>
                      <h3 className="font-bold text-base leading-snug line-clamp-1 group-hover:text-primary transition-colors">
                        {job.title}
                      </h3>
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1">
                        <Building className="w-3.5 h-3.5" />
                        <span className="font-medium">{job.company}</span>
                      </div>
                    </div>

                    <div className="space-y-1.5 text-xs text-muted-foreground pt-1">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate">{job.location} &middot; {job.workLocation || "On-site"}</span>
                      </div>
                      {job.salaryRange && (
                        <div className="flex items-center gap-1.5 font-semibold text-foreground">
                          <DollarSign className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>{job.salaryRange}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="pt-5 border-t border-dashed border-border mt-4 flex items-center justify-between">
                    <span className="text-[11px] text-muted-foreground">
                      {formatDistanceToNow(new Date(job.createdAt), { addSuffix: true })}
                    </span>
                    <Button
                      size="sm"
                      onClick={() => handleApplyClick(job.applyLink)}
                      className="text-xs h-8 cursor-pointer gap-1.5 rounded-lg"
                    >
                      Apply Now <ExternalLink className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
