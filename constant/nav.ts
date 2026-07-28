import {
  LayoutDashboard,
  Brain,
  Users,
  MessageSquare,
  User,
  Video,
  ArrowLeftRight,
  UserCheck,
  Bell,
} from "lucide-react";

export const NAV_ITEMS = ({
  pendingReceived,
  swapPartnersCount,
  upcomingMeetings,
  unreadNotifications = 0,
}: {
  pendingReceived: number;
  swapPartnersCount: number;
  upcomingMeetings: number;
  unreadNotifications?: number;
}) => [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/my-skills", icon: Brain, label: "My Skills" },
  { href: "/matches", icon: Users, label: "Matches" },
  {
    href: "/requests",
    icon: ArrowLeftRight,
    label: "Requests",
    badge: pendingReceived > 0 ? pendingReceived : null,
    badgeColor: "bg-warning",
  },
  {
    href: "/connections",
    icon: UserCheck,
    label: "Connections",
    badge: swapPartnersCount > 0 ? swapPartnersCount : null,
    badgeColor: "bg-success",
  },
  {
    href: "/meetings",
    icon: Video,
    label: "Meetings",
    badge: upcomingMeetings > 0 ? upcomingMeetings : null,
    badgeColor: "bg-info",
  },
  { href: "/messages", icon: MessageSquare, label: "Messages" },
  {
    href: "/notifications",
    icon: Bell,
    label: "Notifications",
    badge: unreadNotifications > 0 ? unreadNotifications : null,
    badgeColor: "bg-destructive",
  },
  { href: "/profile", icon: User, label: "Profile" },
];
