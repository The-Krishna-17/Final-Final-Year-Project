"use client";

import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchJobs } from "@/store/features/jobs/jobSlice";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Loader2,
  Briefcase,
  Search,
  MapPin,
  DollarSign,
  Calendar,
  Building,
  ExternalLink,
  ClipboardList,
  Wifi,
  Home,
  MapPinned,
} from "lucide-react";
import { JobItem } from "@/store/features/jobs/type";
import { formatDistanceToNow } from "date-fns";

const JOB_TYPES = [
  "Full-time",
  "Part-time",
  "Internship",
  "Contract",
  "Placement",
];

const TYPE_COLORS: Record<string, string> = {
  "Full-time":
    "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-800",
  "Part-time":
    "bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950/30 dark:text-sky-400 dark:border-sky-800",
  Internship:
    "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-800",
  Contract:
    "bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-950/30 dark:text-violet-400 dark:border-violet-800",
  Placement:
    "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/30 dark:text-rose-400 dark:border-rose-800",
};

export default function JobsPage() {
  const dispatch = useAppDispatch();
  const { jobs, loadingJobs } = useAppSelector((s) => s.jobs);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("");

  const [selectedJob, setSelectedJob] = useState<JobItem | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchJobs());
  }, [dispatch]);

  const handleSearch = () => {
    dispatch(
      fetchJobs({
        search: searchQuery,
        type: selectedType || undefined,
      }),
    );
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setSelectedType("");
    dispatch(fetchJobs());
  };

  const openDetails = (job: JobItem) => {
    setSelectedJob(job);
    setIsDetailsOpen(true);
  };

  const handleApplyClick = (applyLink: string) => {
    let url = applyLink;
    if (url.includes("@") && !url.startsWith("mailto:")) {
      url = `mailto:${url}`;
    } else if (
      !url.startsWith("http://") &&
      !url.startsWith("https://") &&
      !url.includes("@")
    ) {
      url = `https://${url}`;
    }
    window.open(url, "_blank");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="space-y-1">
          <h1 className="font-semibold text-2xl flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-primary" />
            Job & Internship Board
          </h1>
          <p className="text-base text-muted-foreground">
            Discover placements, internships, and opportunities verified by
            admins.
          </p>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by title, company, or keywords..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="pl-10 h-10 bg-background"
          />
        </div>

        <Select
          value={selectedType}
          onValueChange={(val) => setSelectedType(val === "all" ? "" : val)}
        >
          <SelectTrigger className="w-full sm:w-48 h-10! bg-background">
            <SelectValue placeholder="All Job Types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {JOB_TYPES.map((type) => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex gap-2">
          <Button onClick={handleSearch} className="h-10 px-5 cursor-pointer">
            Search
          </Button>
          {(searchQuery || selectedType) && (
            <Button
              variant="outline"
              onClick={handleClearFilters}
              className="h-10 cursor-pointer"
            >
              Clear
            </Button>
          )}
        </div>
      </div>

      {/* Jobs Grid */}
      {loadingJobs ? (
        <div className="flex flex-col items-center justify-center py-24 text-muted-foreground gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-sm">Fetching job listings...</p>
        </div>
      ) : jobs.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center border border-dashed rounded-xl bg-muted/10 border-border">
          <Briefcase className="w-12 h-12 text-muted-foreground opacity-30 mb-3" />
          <h3 className="font-medium text-base">No positions available</h3>
          <p className="text-sm text-muted-foreground mt-1.5 max-w-sm">
            No open roles right now. Check back soon for new opportunities!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {jobs.map((job) => {
            const dateStr = formatDistanceToNow(new Date(job.createdAt), {
              addSuffix: true,
            });
            const companyInit = job.company?.[0]?.toUpperCase() || "J";

            return (
              <div
                key={job._id}
                className="group overflow-hidden rounded-lg border border-border bg-card text-card-foreground transition-shadow duration-200 hover:shadow-md flex flex-col"
              >
                <div className="px-5 pb-5 pt-4 flex flex-col flex-1">
                  {/* Top row: logo + type badge */}
                  <div className="flex justify-between items-start mb-3">
                    <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center font-bold text-base text-foreground border border-border">
                      {companyInit}
                    </div>
                    <Badge
                      variant="outline"
                      className={`text-[10px] font-medium border ${
                        TYPE_COLORS[job.type] ||
                        "bg-muted text-muted-foreground border-border"
                      }`}
                    >
                      {job.type}
                    </Badge>
                  </div>

                  {/* Title & company */}
                  <div className="mb-3">
                    <h3
                      onClick={() => openDetails(job)}
                      className="font-semibold text-sm leading-snug line-clamp-1 hover:text-primary transition-colors cursor-pointer mb-1"
                    >
                      {job.title}
                    </h3>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Building className="w-3 h-3" />
                      <span className="truncate">{job.company}</span>
                    </div>
                  </div>

                  {/* Meta info */}
                  <div className="space-y-1.5 text-xs text-muted-foreground mb-4 flex-1">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3 h-3 shrink-0" />
                      <span className="truncate">{job.location}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      {job.workLocation === "Remote" ? (
                        <Wifi className="w-3 h-3 shrink-0" />
                      ) : job.workLocation === "Hybrid" ? (
                        <Home className="w-3 h-3 shrink-0" />
                      ) : (
                        <MapPinned className="w-3 h-3 shrink-0" />
                      )}
                      <span>{job.workLocation || "On-site"}</span>
                    </div>
                    {job.salaryRange && (
                      <div className="flex items-center gap-1.5 font-medium text-foreground">
                        <DollarSign className="w-3 h-3 text-green-600 shrink-0" />
                        <span>{job.salaryRange}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3 h-3 shrink-0" />
                      <span>Posted {dateStr}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="grid grid-cols-2 gap-2 border-t border-dashed border-border pt-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openDetails(job)}
                      className="text-xs h-8 cursor-pointer"
                    >
                      Details
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleApplyClick(job.applyLink)}
                      className="text-xs h-8 cursor-pointer gap-1"
                    >
                      Apply <ExternalLink className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Job Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        {selectedJob && (
          <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto">
            <DialogHeader className="border-b border-border pb-4">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-lg bg-muted flex items-center justify-center font-bold text-lg text-foreground border border-border shrink-0">
                  {selectedJob.company?.[0]?.toUpperCase()}
                </div>
                <div>
                  <DialogTitle className="text-lg font-bold">
                    {selectedJob.title}
                  </DialogTitle>
                  <DialogDescription className="text-sm font-medium flex items-center gap-1.5 mt-0.5 text-muted-foreground">
                    <Building className="w-3.5 h-3.5" />
                    {selectedJob.company} &middot; {selectedJob.location}
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>

            <div className="space-y-5 py-4">
              {/* Quick info */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-muted/40 p-3 rounded-lg border border-border text-xs">
                <div>
                  <span className="text-muted-foreground block uppercase font-bold text-[9px] tracking-wider">
                    Job Type
                  </span>
                  <span className="font-semibold text-foreground text-sm">
                    {selectedJob.type}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground block uppercase font-bold text-[9px] tracking-wider">
                    Work Mode
                  </span>
                  <span className="font-semibold text-foreground text-sm">
                    {selectedJob.workLocation || "On-site"}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground block uppercase font-bold text-[9px] tracking-wider">
                    Compensation
                  </span>
                  <span className="font-semibold text-foreground text-sm">
                    {selectedJob.salaryRange || "Not Specified"}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground block uppercase font-bold text-[9px] tracking-wider">
                    Posted
                  </span>
                  <span className="font-semibold text-foreground text-sm">
                    {new Date(selectedJob.createdAt).toLocaleDateString(
                      undefined,
                      { dateStyle: "medium" },
                    )}
                  </span>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <h4 className="font-semibold text-sm text-foreground flex items-center gap-1.5">
                  <ClipboardList className="w-4 h-4 text-primary" />
                  Description
                </h4>
                <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                  {selectedJob.description}
                </p>
              </div>

              {/* Requirements */}
              {selectedJob.requirements?.length > 0 && (
                <div className="space-y-1.5">
                  <h4 className="font-semibold text-sm text-foreground">
                    Key Requirements
                  </h4>
                  <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1 leading-relaxed">
                    {selectedJob.requirements.map((req, idx) => (
                      <li key={idx}>{req}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <DialogFooter className="border-t border-border pt-4 flex gap-2 sm:justify-end">
              <Button
                variant="outline"
                onClick={() => setIsDetailsOpen(false)}
                className="cursor-pointer"
              >
                Close
              </Button>
              <Button
                onClick={() => handleApplyClick(selectedJob.applyLink)}
                className="cursor-pointer gap-1.5"
              >
                Apply <ExternalLink className="w-4 h-4" />
              </Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}
