import { UserData } from "../auth/type";

export interface JobItem {
  _id: string;
  title: string;
  company: string;
  location: string;
  type: "Full-time" | "Part-time" | "Internship" | "Contract" | "Placement";
  workLocation: "On-site" | "Remote" | "Hybrid";
  description: string;
  requirements: string[];
  salaryRange: string | null;
  applyLink: string;
  status: "open" | "closed";
  postedBy: UserData;
  createdAt: string;
  updatedAt: string;
}

export interface JobState {
  jobs: JobItem[];
  adminJobs: JobItem[];
  currentJob: JobItem | null;
  loadingJobs: boolean;
  loadingAdminJobs: boolean;
  loadingCurrent: boolean;
  loadingAction: boolean;
  errorJobs: string | null;
  errorAdminJobs: string | null;
  errorCurrent: string | null;
  errorAction: string | null;
}

export interface CreateJobPayload {
  title: string;
  company: string;
  location: string;
  type: "Full-time" | "Part-time" | "Internship" | "Contract" | "Placement";
  workLocation?: "On-site" | "Remote" | "Hybrid";
  description: string;
  requirements: string[];
  salaryRange?: string | null;
  applyLink: string;
  status?: "open" | "closed";
}

export interface UpdateJobPayload extends CreateJobPayload {
  id: string;
}

export interface JobsResponse {
  success: boolean;
  message: string;
  data: {
    jobs: JobItem[];
  };
}

export interface JobResponse {
  success: boolean;
  message: string;
  data: {
    job: JobItem;
  };
}
