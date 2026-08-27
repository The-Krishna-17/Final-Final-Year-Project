import { UserData } from "../auth/type";

export interface BlogItem {
  _id: string;
  title: string;
  subtitle?: string;
  category?: string;
  content: string;
  author: UserData;
  status: "draft" | "published";
  coverImage: string | null;
  tags: string[];
  likes: string[]; // array of User IDs who liked
  views: number;
  createdAt: string;
  updatedAt: string;
}

export interface BlogState {
  blogs: BlogItem[];
  myBlogs: BlogItem[];
  adminBlogs: BlogItem[];
  currentBlog: BlogItem | null;
  loadingBlogs: boolean;
  loadingMyBlogs: boolean;
  loadingAdminBlogs: boolean;
  loadingCurrent: boolean;
  loadingAction: boolean;
  errorBlogs: string | null;
  errorMyBlogs: string | null;
  errorAdminBlogs: string | null;
  errorCurrent: string | null;
  errorAction: string | null;
}

export interface CreateBlogPayload {
  title: string;
  subtitle?: string;
  category?: string;
  content: string;
  status?: "draft" | "published";
  coverImage?: string | null;
  tags?: string[];
}

export interface UpdateBlogPayload extends CreateBlogPayload {
  id: string;
}

export interface BlogsResponse {
  success: boolean;
  message: string;
  data: {
    blogs: BlogItem[];
  };
}

export interface BlogResponse {
  success: boolean;
  message: string;
  data: {
    blog: BlogItem;
  };
}
