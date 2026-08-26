export interface AppNotification {
  _id: string;
  recipient: string;
  sender?: {
    _id: string;
    firstName: string;
    lastName: string;
    avatar?: string;
  } | null;
  type:
    | "SWAP_REQUEST"
    | "SWAP_ACCEPTED"
    | "SWAP_REJECTED"
    | "SWAP_CANCELLED"
    | "MEETING_INVITATION"
    | "MEETING_STARTED"
    | "MEETING_UPDATED"
    | "MEETING_CANCELLED"
    | "NEW_MESSAGE"
    | "SYSTEM_ALERT"
    | "ADMIN_USER_DELETED"
    | "ADMIN_REVIEW_DELETED"
    | "ADMIN_JOB_DELETED"
    | "ADMIN_BLOG_DELETED";
  title: string;
  message: string;
  link?: string;
  isRead: boolean;
  readAt?: string;
  data?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationState {
  notifications: AppNotification[];
  unreadCount: number;
  total: number;
  page: number;
  pages: number;
  loading: boolean;
  error: string | null;
}
