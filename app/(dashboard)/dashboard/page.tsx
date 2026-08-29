"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { getMe } from "@/store/features/auth/authSlice";
import { getUserSkills } from "@/store/features/skills/skillSlice";
import {
  fetchMySwaps,
  fetchSwapPartners,
} from "@/store/features/swaps/swapSlice";
import {
  fetchRecommendedMatches,
  fetchMutualMatches,
} from "@/store/features/matches/matchSlice";
import { fetchMeetings } from "@/store/features/meetings/meetingSlice";
import { fetchNotifications } from "@/store/features/notifications/notificationSlice";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LiaToolsSolid } from "react-icons/lia";
import {
  Brain,
  Target,
  UserCheck,
  Users,
  Video,
  Bell,
  ArrowRight,
  Plus,
  Calendar,
  MessageSquare,
  TrendingUp,
  Award,
  ChevronRight,
  Sparkles,
  Clock,
  CheckCircle2,
  Circle,
  FileText,
  Briefcase,
  Link2,
  MailCheck,
  Image,
  Zap,
  ShieldAlert,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { FaCheckCircle } from "react-icons/fa";

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
};

const StatCard = ({
  title,
  value,
  icon: Icon,
  accent,
  href,
  description,
}: {
  title: string;
  value: number | string;
  icon: React.ElementType;
  accent: string;
  href: string;
  description?: string;
}) => (
  <Link href={href}>
    <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1 cursor-pointer border-0 bg-linear-to-br from-background to-muted/30">
      <div className={`absolute inset-0 opacity-[0.03] ${accent}`} />
      <CardContent className="p-5 flex items-center gap-4">
        <div
          className={`flex items-center justify-center w-12 h-12 rounded-xl ${accent} bg-opacity-10 transition-transform duration-300 group-hover:scale-110`}
        >
          <Icon className="w-6 h-6" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            {title}
          </p>
          <p className="text-2xl font-bold mt-0.5 tabular-nums">{value}</p>
          {description && (
            <p className="text-xs text-muted-foreground mt-0.5 truncate">
              {description}
            </p>
          )}
        </div>
        <ChevronRight className="w-5 h-5 text-muted-foreground/50 group-hover:text-primary transition-colors" />
      </CardContent>
    </Card>
  </Link>
);

const MeetingCard = ({ meeting }: { meeting: any }) => {
  const router = useRouter();
  const isUpcoming =
    meeting.status === "scheduled" || meeting.status === "ongoing";
  const meetingTime = new Date(meeting.scheduledAt).toLocaleString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="flex items-center gap-4 p-3 rounded-xl bg-muted/30 hover:bg-muted/60 transition-colors">
      <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-info/10 shrink-0">
        <Video className="w-5 h-5 text-info" />
      </div>
      <div className="flex-1">
        <p className="text-base font-medium text-nowrap">{meeting.title}</p>
        <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5 text-nowrap">
          <Clock className="w-3 h-3" />
          {meetingTime}
        </p>
      </div>
      <Badge
        variant={
          meeting.status === "ongoing"
            ? "default"
            : meeting.status === "scheduled"
              ? "secondary"
              : "outline"
        }
        className="text-[10px] capitalize"
      >
        {meeting.status}
      </Badge>
      {isUpcoming && (
        <Button
          size="sm"
          variant="ghost"
          className="h-8 w-8 p-0 shrink-0"
          onClick={() => router.push(`/meetings/${meeting.roomId}`)}
        >
          <ArrowRight className="w-4 h-4" />
        </Button>
      )}
    </div>
  );
};

const MatchCard = ({ match }: { match: any }) => {
  const router = useRouter();
  const name =
    match.userProfile?.user?.fullName ||
    `${match.userProfile?.user?.firstName || ""} ${match.userProfile?.user?.lastName || ""}`.trim() ||
    "Unknown User";

  const learnSkillObj = match.matchDetails?.aWantsB?.offerSkill;
  const learnSkillName =
    learnSkillObj?.ai?.primarySkill || learnSkillObj?.rawInput || "";

  const matchPercent =
    match.matchPercent ?? Math.round(((match.totalScore || 0) / 200) * 100);
  const isMutual = match.matchDetails?.isMutual;

  return (
    <div
      className="flex items-center justify-between gap-3 p-3.5 rounded-xl border border-border/60 bg-card hover:bg-muted/40 hover:border-primary/30 transition-all cursor-pointer group shrink-0 min-w-60"
      onClick={() => router.push(`/matches`)}
    >
      <div className="flex items-center gap-3 min-w-0">
        <Avatar className="h-10 w-10 ring-2 ring-border/80 group-hover:ring-primary/40 transition-all">
          <AvatarImage src={match.userProfile?.user?.avatar || undefined} />
          <AvatarFallback className="text-xs bg-primary/10 text-primary font-semibold">
            {name
              .split(" ")
              .map((n: string) => n[0])
              .join("")
              .slice(0, 2)}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold truncate text-foreground group-hover:text-primary transition-colors">
            {name}
          </p>
          {learnSkillName && (
            <p className="text-xs text-muted-foreground truncate">
              Teaches{" "}
              <span className="font-medium text-foreground">
                {learnSkillName}
              </span>
            </p>
          )}
          <div className="flex items-center gap-1.5 mt-1">
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                matchPercent >= 75
                  ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
                  : "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/30"
              }`}
            >
              {matchPercent}% Match
            </span>
            <span className="text-[10px] text-muted-foreground">
              {isMutual ? "✨ Mutual" : "⚡ 1-Way"}
            </span>
          </div>
        </div>
      </div>
      <Button
        size="sm"
        variant="ghost"
        className="h-8 w-8 p-0 shrink-0 text-muted-foreground group-hover:text-primary transition-colors"
      >
        <ArrowRight className="w-4 h-4" />
      </Button>
    </div>
  );
};

const QuickAction = ({
  href,
  icon: Icon,
  label,
  color,
}: {
  href: string;
  icon: React.ElementType;
  label: string;
  color: string;
}) => (
  <Link href={href}>
    <div
      className={`flex items-center gap-3 p-3 rounded-xl ${color}/10 hover:${color}/20 transition-all cursor-pointer group`}
    >
      <Icon className="w-5 h-5" />
      <span className="text-sm font-medium group-hover:translate-x-1 transition-transform">
        {label}
      </span>
    </div>
  </Link>
);

const NotificationItem = ({ notification }: { notification: any }) => {
  const router = useRouter();
  const timeAgo = (() => {
    const diff = Date.now() - new Date(notification.createdAt).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "Just now";
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  })();

  const getIcon = (type: string) => {
    switch (type) {
      case "SWAP_REQUEST":
      case "SWAP_ACCEPTED":
      case "SWAP_REJECTED":
      case "SWAP_CANCELLED":
        return <ArrowRight className="w-3.5 h-3.5 text-warning" />;
      case "MEETING_INVITATION":
      case "MEETING_STARTED":
      case "MEETING_UPDATED":
      case "MEETING_CANCELLED":
        return <Video className="w-3.5 h-3.5 text-info" />;
      case "NEW_MESSAGE":
        return <MessageSquare className="w-3.5 h-3.5 text-success" />;
      default:
        return <Sparkles className="w-3.5 h-3.5 text-primary" />;
    }
  };

  return (
    <div
      className={`flex items-start gap-3 p-3 rounded-xl transition-colors ${
        !notification.isRead ? "bg-primary/5" : "bg-muted/20"
      }`}
    >
      <div className="relative shrink-0 mt-0.5">
        {notification.sender?.avatar ? (
          <Avatar className="h-8 w-8">
            <AvatarImage src={notification.sender.avatar} />
            <AvatarFallback className="text-[10px]">
              {notification.sender.firstName?.[0]}
              {notification.sender.lastName?.[0]}
            </AvatarFallback>
          </Avatar>
        ) : (
          <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
            {getIcon(notification.type)}
          </div>
        )}
        {!notification.isRead && (
          <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-primary rounded-full ring-2 ring-background" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-foreground truncate">
          {notification.title}
        </p>
        <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
          {notification.message}
        </p>
        <span className="text-[10px] text-muted-foreground/70 mt-1 block">
          {timeAgo}
        </span>
      </div>
    </div>
  );
};

export default function DashboardPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  const { user } = useAppSelector((state) => state.auth);
  const { profile: skillProfile, loadingProfile: skillsLoading } =
    useAppSelector((state) => state.skills);
  const { swaps, swapPartners, loadingSwaps, loadingPartners } = useAppSelector(
    (state) => state.swaps,
  );
  const {
    recommendedMatches,
    mutualMatches,
    loadingRecommended,
    loadingMutual,
  } = useAppSelector((state) => state.matches);
  const { meetings, loadingMeetings: meetingsLoading } = useAppSelector(
    (state) => state.meetings,
  );
  const { notifications, loading: notificationsLoading } = useAppSelector(
    (state) => state.notifications,
  );

  const fetchAllData = useCallback(
    async (silent = false) => {
      if (!silent) setLoading(true);
      try {
        const meResult = await dispatch(getMe()).unwrap();
        const userId = meResult.data.user._id;
        await Promise.all([
          dispatch(fetchMySwaps()),
          dispatch(fetchSwapPartners()),
          dispatch(fetchRecommendedMatches({ limit: 5 })),
          dispatch(fetchMutualMatches({ limit: 5 })),
          dispatch(fetchMeetings()),
          dispatch(fetchNotifications({ limit: 5 })),
          dispatch(getUserSkills(userId)),
        ]);
      } catch {
        toast.error("Failed to load dashboard data");
      } finally {
        if (!silent) setLoading(false);
      }
    },
    [dispatch],
  );

  useEffect(() => {
    fetchAllData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const stats = useMemo(() => {
    const offeredSkills = skillProfile?.offerSkills?.length || 0;
    const wantedSkills = skillProfile?.wantSkills?.length || 0;
    const connections = swapPartners.length;
    const matches = recommendedMatches.length + mutualMatches.length;
    const upcomingMeetings = meetings.filter(
      (m) => m.status === "scheduled" || m.status === "ongoing",
    ).length;
    const unreadNotifications = notifications.filter((n) => !n.isRead).length;

    return {
      offeredSkills,
      wantedSkills,
      connections,
      matches,
      upcomingMeetings,
      unreadNotifications,
    };
  }, [
    skillProfile,
    swapPartners,
    recommendedMatches,
    mutualMatches,
    meetings,
    notifications,
  ]);

  const pendingSwaps = useMemo(
    () => swaps.filter((s) => s.status === "pending"),
    [swaps],
  );

  const recentMeetings = useMemo(() => {
    return meetings
      .filter((m) => m.status === "scheduled" || m.status === "ongoing")
      .sort(
        (a, b) =>
          new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime(),
      )
      .slice(0, 5);
  }, [meetings]);

  const topMatches = useMemo(() => {
    const combined = [...recommendedMatches, ...mutualMatches];
    const uniqueMap = new Map();
    combined.forEach((m) => {
      if (m.profileId && !uniqueMap.has(m.profileId)) {
        uniqueMap.set(m.profileId, m);
      }
    });
    return Array.from(uniqueMap.values())
      .sort((a, b) => (b.totalScore || 0) - (a.totalScore || 0))
      .slice(0, 5);
  }, [recommendedMatches, mutualMatches]);

  const recentNotifications = useMemo(
    () => notifications.slice(0, 5),
    [notifications],
  );

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Welcome Banner */}
      <Card className="relative overflow-hidden border-0 bg-linear-to-r from-primary/10 via-primary/5 to-transparent">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
        <CardContent className="p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
            <Avatar className="h-16 w-16 ring-4 ring-primary/10">
              <AvatarImage src={user?.avatar || undefined} />
              <AvatarFallback className="text-xl">
                {user?.firstName?.[0]}
                {user?.lastName?.[0]}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-primary">
                {getGreeting()}, {user?.firstName || "there"}!
              </h1>
              <p className="text-muted-foreground mt-1 text-sm sm:text-base">
                Ready to exchange skills and grow together? Here&apos;s
                what&apos;s happening on your dashboard.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard
          title="Offered Skills"
          value={stats.offeredSkills}
          icon={Brain}
          accent="bg-primary text-primary-foreground"
          href="/my-skills"
          description="Skills you can teach"
        />
        <StatCard
          title="Wanted Skills"
          value={stats.wantedSkills}
          icon={Target}
          accent="bg-primary text-primary-foreground"
          href="/my-skills"
          description="Skills you want to learn"
        />
        <StatCard
          title="Connections"
          value={stats.connections}
          icon={UserCheck}
          accent="bg-primary text-primary-foreground"
          href="/connections"
          description="Active swap partners"
        />
        <StatCard
          title="Matches"
          value={stats.matches}
          icon={Users}
          accent="bg-primary text-primary-foreground"
          href="/matches"
          description="Recommended & mutual"
        />
        <StatCard
          title="Upcoming"
          value={stats.upcomingMeetings}
          icon={Video}
          accent="bg-primary text-primary-foreground"
          href="/meetings"
          description="Scheduled sessions"
        />
        <StatCard
          title="Notifications"
          value={stats.unreadNotifications}
          icon={Bell}
          accent="bg-destructive text-destructive-foreground"
          href="/notifications"
          description="Unread updates"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - 2/3 width */}
        <div className="lg:col-span-2 space-y-6">
          {/* Upcoming Meetings */}
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Video className="w-5 h-5 text-info" />
                  Upcoming Meetings
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  asChild
                  className="text-xs text-muted-foreground hover:text-foreground"
                >
                  <Link href="/meetings" className="flex items-center gap-1">
                    View all <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {meetingsLoading ? (
                <div className="space-y-3">
                  {[...Array(3)].map((_, i) => (
                    <Skeleton key={i} className="h-14 w-full rounded-xl" />
                  ))}
                </div>
              ) : recentMeetings.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Video className="w-10 h-10 mx-auto mb-2 opacity-40" />
                  <p className="text-sm">No upcoming meetings</p>
                  <Button variant="outline" size="sm" className="mt-3" asChild>
                    <Link href="/meetings/create">Schedule a meeting</Link>
                  </Button>
                </div>
              ) : (
                <div
                  className="flex items-center overflow-x-auto gap-4"
                  style={{ msOverflowStyle: "none", scrollbarWidth: "none" }}
                >
                  {recentMeetings.map((meeting) => (
                    <MeetingCard key={meeting._id} meeting={meeting} />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recommended Matches */}
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Sparkles className="w-5 h-5" />
                  Recommended For You
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  asChild
                  className="text-xs text-muted-foreground hover:text-foreground"
                >
                  <Link href="/matches" className="flex items-center gap-1">
                    View all <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {loadingRecommended || loadingMutual ? (
                <div className="space-y-3">
                  {[...Array(3)].map((_, i) => (
                    <Skeleton key={i} className="h-14 w-full rounded-xl" />
                  ))}
                </div>
              ) : topMatches.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Users className="w-10 h-10 mx-auto mb-2 opacity-40" />
                  <p className="text-sm">No matches yet</p>
                  <Button variant="outline" size="sm" className="mt-3" asChild>
                    <Link href="/my-skills">Add skills to find matches</Link>
                  </Button>
                </div>
              ) : (
                <div
                  className="flex items-center overflow-x-auto gap-4"
                  style={{ msOverflowStyle: "none", scrollbarWidth: "none" }}
                >
                  {topMatches.map((match, idx) => (
                    <MatchCard key={match.profileId || idx} match={match} />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
          {/* Setup Your Profile */}
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <LiaToolsSolid className="w-5 h-5" />
                  Setup Your Profile
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  asChild
                  className="text-xs text-muted-foreground hover:text-foreground"
                >
                  <Link href="/profile" className="flex items-center gap-1">
                    Go to profile <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {/* Progress bar */}
              {(() => {
                const steps = [
                  !!user?.bio,
                  !!user?.workExperience?.length,
                  !!(
                    user?.socialLinks &&
                    Object.values(user.socialLinks).some(Boolean)
                  ),
                  !!user?.avatar,
                  !!skillProfile?.offerSkills?.length,
                ];
                const done = steps.filter(Boolean).length;
                const pct = Math.round((done / steps.length) * 100);
                return (
                  <div className="mb-5">
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="text-muted-foreground">
                        {done} of {steps.length} completed
                      </span>
                      <span className="font-semibold text-foreground">
                        {pct}%
                      </span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-linear-to-r from-chart-1 to-primary rounded-full transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })()}

              {/* Checklist items */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {(
                  [
                    {
                      label: "Professional Summary",
                      description: "Add a short bio about yourself",
                      done: !!user?.bio,
                      icon: FileText,
                      href: "/profile",
                    },
                    {
                      label: "Work Experience",
                      description: "Add your past or current roles",
                      done: !!user?.workExperience?.length,
                      icon: Briefcase,
                      href: "/profile",
                    },
                    {
                      label: "Social Profiles",
                      description: "Link LinkedIn, GitHub & more",
                      done: !!(
                        user?.socialLinks &&
                        Object.values(user.socialLinks).some(Boolean)
                      ),
                      icon: Link2,
                      href: "/profile",
                    },
                    {
                      label: "Profile Photo",
                      description: "Upload an avatar or photo",
                      done: !!user?.avatar,
                      icon: Image,
                      href: "/profile",
                    },
                    {
                      label: "Add Skills",
                      description: "List skills you offer or want",
                      done: !!skillProfile?.offerSkills?.length,
                      icon: Brain,
                      href: "/my-skills",
                    },
                  ] as {
                    label: string;
                    description: string;
                    done: boolean;
                    icon: React.ElementType;
                    href: string;
                  }[]
                ).map(({ label, description, done, icon: Icon, href }) => (
                  <Link href={href} key={label}>
                    <div
                      className={`flex items-start gap-3 p-3 rounded-xl border transition-all cursor-pointer group hover:-translate-y-0.5 hover:shadow-sm ${
                        done
                          ? "bg-success/5 border-success/20"
                          : "bg-muted/30 border-border hover:bg-muted/60"
                      }`}
                    >
                      <div className="mt-0.5 p-2 rounded-lg shrink-0 bg-primary text-primary-foreground">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3">
                          <p className="text-base font-medium truncate">
                            {label}
                          </p>
                          {done ? (
                            <FaCheckCircle className="w-4 h-4 text-green-700 shrink-0" />
                          ) : (
                            <Circle className="w-4 h-4 text-muted-foreground/50 shrink-0" />
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {description}
                        </p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-muted-foreground/30 group-hover:text-primary transition-colors mt-1 shrink-0" />
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - 1/3 width */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg">
                <TrendingUp className="w-5 h-5" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                <QuickAction
                  href="/my-skills"
                  icon={Plus}
                  label="Add Skill"
                  color="bg-primary"
                />
                <QuickAction
                  href="/matches"
                  icon={Users}
                  label="Find Matches"
                  color="bg-chart-2"
                />
                <QuickAction
                  href="/requests"
                  icon={ArrowRight}
                  label="Send Request"
                  color="bg-warning"
                />
                <QuickAction
                  href="/meetings/create"
                  icon={Calendar}
                  label="Schedule"
                  color="bg-info"
                />
                <QuickAction
                  href="/messages"
                  icon={MessageSquare}
                  label="Messages"
                  color="bg-success"
                />
                <QuickAction
                  href="/profile"
                  icon={Award}
                  label="Profile"
                  color="bg-chart-4"
                />
              </div>
            </CardContent>
          </Card>

          {/* Pending Swap Requests */}
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <ArrowRight className="w-5 h-5 text-warning" />
                  Swap Requests
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  asChild
                  className="text-xs text-muted-foreground hover:text-foreground"
                >
                  <Link href="/requests" className="flex items-center gap-1">
                    View all <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {loadingSwaps || loadingPartners ? (
                <div className="space-y-3">
                  {[...Array(2)].map((_, i) => (
                    <Skeleton key={i} className="h-14 w-full rounded-xl" />
                  ))}
                </div>
              ) : pendingSwaps.length === 0 ? (
                <div className="text-center py-6 text-muted-foreground">
                  <ArrowRight className="w-8 h-8 mx-auto mb-2 opacity-40" />
                  <p className="text-xs">No pending requests</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {pendingSwaps.slice(0, 3).map((swap) => (
                    <div
                      key={swap._id}
                      className="flex items-center gap-3 p-3 rounded-xl bg-muted/30"
                    >
                      <Avatar className="h-9 w-9">
                        <AvatarImage
                          src={swap.recipient?.avatar || undefined}
                        />
                        <AvatarFallback className="text-xs">
                          {swap.recipient?.firstName?.[0]}
                          {swap.recipient?.lastName?.[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {swap.recipient?.firstName} {swap.recipient?.lastName}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {swap.requesterWantsSkill} →{" "}
                          {swap.requesterOffersSkill}
                        </p>
                      </div>
                      <Badge
                        variant="outline"
                        className="text-[10px] capitalize"
                      >
                        {swap.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Notifications */}
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Bell className="w-5 h-5" />
                  Recent Alerts
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  asChild
                  className="text-xs text-muted-foreground hover:text-foreground"
                >
                  <Link
                    href="/notifications"
                    className="flex items-center gap-1"
                  >
                    View all <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {notificationsLoading ? (
                <div className="space-y-3">
                  {[...Array(3)].map((_, i) => (
                    <Skeleton key={i} className="h-14 w-full rounded-xl" />
                  ))}
                </div>
              ) : recentNotifications.length === 0 ? (
                <div className="text-center py-6 text-muted-foreground">
                  <Bell className="w-8 h-8 mx-auto mb-2 opacity-40" />
                  <p className="text-xs">No notifications yet</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {recentNotifications.map((notification) => (
                    <NotificationItem
                      key={notification._id}
                      notification={notification}
                    />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
