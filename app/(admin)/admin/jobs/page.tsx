"use client";

import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  fetchAdminJobs,
  createJobAction,
  updateJobAction,
  deleteJobAction,
} from "@/store/features/jobs/jobSlice";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
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
  Plus,
  Edit,
  Trash2,
  MapPin,
  Building,
  DollarSign,
  ExternalLink,
  CheckCircle,
  XCircle,
  FileText,
} from "lucide-react";
import { toast } from "sonner";
import { JobItem } from "@/store/features/jobs/type";

const JOB_TYPES = [
  "Full-time",
  "Part-time",
  "Internship",
  "Contract",
  "Placement",
];
const WORK_LOCATIONS = ["On-site", "Remote", "Hybrid"];

export default function AdminJobsPage() {
  const dispatch = useAppDispatch();
  const { adminJobs, loadingAdminJobs, loadingAction } = useAppSelector(
    (s) => s.jobs,
  );

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("");

  // Dialog management
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<JobItem | null>(null);

  // Form states
  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [location, setLocation] = useState("");
  const [type, setType] = useState<any>("Full-time");
  const [workLocation, setWorkLocation] = useState<any>("On-site");
  const [description, setDescription] = useState("");
  const [requirementsText, setRequirementsText] = useState("");
  const [salaryRange, setSalaryRange] = useState("");
  const [applyLink, setApplyLink] = useState("");
  const [status, setStatus] = useState<"open" | "closed">("open");
  const [deleteReason, setDeleteReason] = useState("");

  useEffect(() => {
    dispatch(fetchAdminJobs());
  }, [dispatch]);

  const handleOpenCreate = () => {
    setSelectedJob(null);
    setTitle("");
    setCompany("");
    setLocation("");
    setType("Full-time");
    setWorkLocation("On-site");
    setDescription("");
    setRequirementsText("");
    setSalaryRange("");
    setApplyLink("");
    setStatus("open");
    setIsFormOpen(true);
  };

  const handleOpenEdit = (job: JobItem) => {
    setSelectedJob(job);
    setTitle(job.title);
    setCompany(job.company);
    setLocation(job.location);
    setType(job.type);
    setWorkLocation(job.workLocation || "On-site");
    setDescription(job.description);
    setRequirementsText(job.requirements?.join("\n") || "");
    setSalaryRange(job.salaryRange || "");
    setApplyLink(job.applyLink);
    setStatus(job.status);
    setIsFormOpen(true);
  };

  const handleOpenDelete = (job: JobItem) => {
    setSelectedJob(job);
    setDeleteReason("");
    setIsDeleteOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !title.trim() ||
      !company.trim() ||
      !location.trim() ||
      !description.trim() ||
      !applyLink.trim()
    ) {
      toast.error("Please fill in all required fields.");
      return;
    }

    const requirements = requirementsText
      .split("\n")
      .map((r) => r.trim())
      .filter((r) => r.length > 0);

    const payload = {
      title,
      company,
      location,
      type,
      workLocation,
      description,
      requirements,
      salaryRange: salaryRange.trim() || null,
      applyLink,
      status,
    };

    try {
      if (selectedJob) {
        await dispatch(
          updateJobAction({ id: selectedJob._id, ...payload }),
        ).unwrap();
        toast.success("Job listing updated successfully!");
      } else {
        await dispatch(createJobAction(payload)).unwrap();
        toast.success("Job listed successfully!");
      }
      setIsFormOpen(false);
    } catch (err: any) {
      toast.error(err || "Operation failed.");
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedJob) return;
    if (!deleteReason.trim()) {
      toast.error("Please provide a valid reason for deletion.");
      return;
    }
    try {
      await dispatch(
        deleteJobAction({ id: selectedJob._id, reason: deleteReason.trim() }),
      ).unwrap();
      toast.success("Job listing deleted successfully.");
      setIsDeleteOpen(false);
    } catch (err: any) {
      toast.error(err || "Failed to delete job.");
    }
  };

  // Filter local listings for admin dashboard search
  const filteredJobs = adminJobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === "" || job.type === selectedType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Briefcase className="text-primary" />
            Job Listings Management
          </h1>
          <p className="text-sm text-muted-foreground mt-1.5">
            Admin console to upload placement notices, internship openings, and
            career options for the student workspace.
          </p>
        </div>
        <Button onClick={handleOpenCreate} className="cursor-pointer gap-1.5">
          <Plus className="w-4 h-4" /> Post New Job
        </Button>
      </div>

      {/* Filters Bar */}
      <div className="flex items-center justify-between gap-4 flex-wrap bg-card p-4 rounded-xl border border-border">
        {/* Search */}
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-base" />
          <Input
            placeholder="Search by title, company..."
            className="pl-9 h-9 text-xs bg-background"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Type Filter */}
        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="h-9 px-3 rounded-lg border border-border bg-background text-foreground text-xs font-semibold focus:outline-hidden cursor-pointer"
        >
          <option value="">All Job Types</option>
          {JOB_TYPES.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      {/* Admin Jobs Directory Table */}
      <Card className="border-border overflow-hidden bg-card">
        <CardContent className="p-0">
          {loadingAdminJobs ? (
            <div className="flex flex-col items-center justify-center py-20 text-muted-foreground gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <p className="text-xs font-medium">Fetching career listings...</p>
            </div>
          ) : filteredJobs.length === 0 ? (
            <div className="py-16 text-center text-muted-foreground space-y-1">
              <p className="font-semibold text-sm">
                No jobs match requirements
              </p>
              <p className="text-xs">
                Create a new post or change filters to find items.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-muted/50 border-b border-border text-muted-foreground font-semibold uppercase tracking-wider">
                  <tr>
                    <th className="px-4 py-3">Position & Company</th>
                    <th className="px-4 py-3">Location</th>
                    <th className="px-4 py-3">Work Mode</th>
                    <th className="px-4 py-3">Type</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Posted Date</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredJobs.map((job) => (
                    <tr
                      key={job._id}
                      className="hover:bg-muted/20 transition-colors"
                    >
                      <td className="px-4 py-3 font-medium">
                        <div>
                          <p className="font-semibold text-sm text-foreground leading-tight">
                            {job.title}
                          </p>
                          <p className="text-muted-foreground text-[11px] font-medium flex items-center gap-1 mt-0.5">
                            <Building className="w-3 h-3" /> {job.company}
                          </p>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground text-sm">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" /> {job.location}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <Badge
                          variant="outline"
                          className="font-semibold text-[10px]"
                        >
                          {job.workLocation || "On-site"}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <Badge
                          variant="secondary"
                          className="font-semibold text-[10px]"
                        >
                          {job.type}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        {job.status === "open" ? (
                          <Badge className="bg-green-600 hover:bg-green-700 text-white font-semibold">
                            Open
                          </Badge>
                        ) : (
                          <Badge
                            variant="outline"
                            className="text-muted-foreground"
                          >
                            Closed
                          </Badge>
                        )}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {new Date(job.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 text-muted-foreground hover:text-foreground cursor-pointer"
                            onClick={() => handleOpenEdit(job)}
                            title="Edit Job"
                          >
                            <Edit className="w-4 h-4 text-blue-500" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 text-muted-foreground hover:text-destructive cursor-pointer"
                            onClick={() => handleOpenDelete(job)}
                            title="Delete Job"
                          >
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create / Edit Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedJob ? "Edit Job Listing" : "Post New Job Opportunity"}
            </DialogTitle>
            <DialogDescription>
              Provide positioning, requirements, and applying contacts. This
              listing will be immediately available to all workspace users.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 py-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Job Title *
                </label>
                <Input
                  placeholder="e.g. Associate Backend Developer"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Company Name *
                </label>
                <Input
                  placeholder="e.g. Google DeepMind"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Location *
                </label>
                <Input
                  placeholder="e.g. Bangalore, India"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Work Mode *
                </label>
                <select
                  value={workLocation}
                  onChange={(e) => setWorkLocation(e.target.value)}
                  className="h-10 px-3 w-full rounded-md border border-input bg-background text-sm font-semibold focus:outline-hidden focus:ring-2 focus:ring-primary cursor-pointer"
                >
                  {WORK_LOCATIONS.map((wl) => (
                    <option key={wl} value={wl}>
                      {wl}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Job Type *
                </label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as any)}
                  className="h-10 px-3 w-full rounded-md border border-input bg-background text-sm font-semibold focus:outline-hidden focus:ring-2 focus:ring-primary cursor-pointer"
                >
                  {JOB_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Salary / Compensation
                </label>
                <Input
                  placeholder="e.g. $80k - $100k or Negotiable"
                  value={salaryRange}
                  onChange={(e) => setSalaryRange(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Job Description *
              </label>
              <Textarea
                placeholder="Detail core duties, technology stack, and expectations..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="min-h-30"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center justify-between">
                <span>Requirements (one item per line)</span>
                <span className="text-[10px] text-muted-foreground font-normal lowercase italic">
                  press enter to separate
                </span>
              </label>
              <Textarea
                placeholder="3+ years of experience with Node.js&#10;Familiarity with React and Redux&#10;Excellent communication skills"
                value={requirementsText}
                onChange={(e) => setRequirementsText(e.target.value)}
                className="min-h-22.5"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Apply URL / Contact Email *
                </label>
                <Input
                  placeholder="e.g. careers@company.com or https://company.com/apply"
                  value={applyLink}
                  onChange={(e) => setApplyLink(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Status
                </label>
                <div className="flex gap-4 items-center h-10 border border-input rounded-md px-3 bg-background">
                  <label className="flex items-center gap-1.5 text-xs font-semibold cursor-pointer">
                    <input
                      type="radio"
                      name="status"
                      checked={status === "open"}
                      onChange={() => setStatus("open")}
                      className="accent-primary"
                    />
                    Open & Accepting Applications
                  </label>
                  <label className="flex items-center gap-1.5 text-xs font-semibold cursor-pointer">
                    <input
                      type="radio"
                      name="status"
                      checked={status === "closed"}
                      onChange={() => setStatus("closed")}
                      className="accent-primary"
                    />
                    Closed
                  </label>
                </div>
              </div>
            </div>

            <DialogFooter className="gap-2 sm:justify-end">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsFormOpen(false)}
                className="cursor-pointer"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                disabled={loadingAction}
                className="cursor-pointer min-w-25"
              >
                {loadingAction ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  "Save Job"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Trash2 className="w-5 h-5 text-red-500" /> Confirm Deletion
            </DialogTitle>
            <DialogDescription className="text-sm">
              Are you sure you want to delete the job listing for{" "}
              <strong>{selectedJob?.title}</strong> at{" "}
              <strong>{selectedJob?.company}</strong>? This action is permanent
              and cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Reason for Deletion *
            </label>
            <Textarea
              placeholder="Provide a valid reason for deleting this job listing..."
              value={deleteReason}
              onChange={(e) => setDeleteReason(e.target.value)}
              className="min-h-20 text-sm"
            />
          </div>

          <DialogFooter className="flex gap-2 sm:justify-end mt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsDeleteOpen(false)}
              className="cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleDeleteConfirm}
              className="cursor-pointer"
            >
              Yes, Delete Post
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
