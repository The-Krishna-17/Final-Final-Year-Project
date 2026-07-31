"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { axiosInstance } from "@/utils/axiosInstance";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Activity,
  Briefcase,
  CalendarIcon,
  CircleCheck,
  Star,
  Award,
  TrendingUp,
  MessageSquare,
} from "lucide-react";
import {
  IoBagOutline,
  IoBriefcaseOutline,
  IoDocumentTextOutline,
  IoShareSocialOutline,
  IoTimerOutline,
} from "react-icons/io5";
import {
  RiLightbulbFlashLine,
  RiBookOpenLine,
  RiMessage2Line,
  RiStarFill,
  RiStarLine,
  RiShareBoxLine,
} from "react-icons/ri";
import { format } from "date-fns";
import { SOCIAL_LINKS, MONTHS } from "@/constant/data";
import { DateField } from "@/store/features/auth/type";
import Link from "next/link";
import { GoDash } from "react-icons/go";

export default function PublicProfilePage() {
  const { userId } = useParams();
  const [profile, setProfile] = useState<any>(null);
  const [skillProfile, setSkillProfile] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true);
        const [userRes, skillsRes, reviewsRes] = await Promise.all([
          axiosInstance.get(`/users/${userId}`),
          axiosInstance.get(`/skills/user/${userId}`),
          axiosInstance.get(`/reviews/user/${userId}`),
        ]);

        setProfile(userRes.data.data.user);
        setSkillProfile(skillsRes.data.data.profile);
        setReviews(reviewsRes.data.data.reviews);
      } catch (error) {
        console.error("Failed to fetch public profile:", error);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchProfileData();
    }
  }, [userId]);

  const fmtDate = (d: DateField | null | undefined): string => {
    if (!d || (!d.year && !d.month)) return "Present";
    const m = d.month ? MONTHS[d.month - 1] : "";
    const yearStr = d.year ? String(d.year) : "";
    if (!m) return yearStr || "Present";
    return d.day ? `${m} ${d.day}, ${yearStr}` : `${m} ${yearStr}`;
  };

  if (loading) {
    return (
      <div className="px-8 py-0 overflow-hidden rounded-xl border bg-card">
        {/* Cover strip skeleton */}
        <Skeleton className="h-24 bg-muted border-b border-border -mx-8" />

        <div className="flex items-end justify-between flex-wrap gap-4 -mt-12 pb-0 px-0">
          {/* Avatar + info */}
          <div className="flex items-end gap-5">
            <Skeleton className="h-24 w-24 rounded-full shrink-0 border-[3px] border-background" />

            <div className="pb-1 space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-5 w-28 rounded-full" />
              </div>
              <Skeleton className="h-4 w-44" />
              <Skeleton className="h-3.5 w-36" />
            </div>
          </div>
        </div>

        {/* Stats strip */}
        <div className="grid grid-cols-4 gap-2 mt-6 pt-5 border-t pb-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-muted rounded-lg px-3 py-3 space-y-2">
              <Skeleton className="h-3 w-12" />
              <Skeleton className="h-4 w-16" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-4 text-muted-foreground min-h-[60vh]">
        <IoBagOutline className="text-6xl opacity-20" />
        <p className="text-lg">User not found or no longer exists.</p>
      </div>
    );
  }

  const averageRating =
    reviews.length > 0
      ? (
          reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        ).toFixed(1)
      : "No ratings";

  const getDifficultyColor = (diff: string) => {
    switch (diff?.toLowerCase()) {
      case "advanced":
        return "bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800";
      case "intermediate":
        return "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800";
      default:
        return "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800";
    }
  };

  return (
    <div className="space-y-4">
      <Card className="px-8 py-0 overflow-hidden">
        {/* Cover strip */}
        <div className="h-24 -mx-8 border-b border-border relative overflow-hidden">
          <div className="absolute inset-0 bg-linear-to-r from-primary/60 via-primary/70 to-primary/50 dark:from-primary/20 dark:via-primary/30 dark:to-primary/10" />
          <svg
            className="absolute inset-0 w-full h-full"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Large background rings */}
            <circle
              cx="5%"
              cy="50%"
              r="28"
              fill="none"
              stroke="rgba(255,255,255,0.15)"
              strokeWidth="1.5"
            />
            <circle
              cx="92%"
              cy="30%"
              r="40"
              fill="none"
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="1.5"
            />
            <circle
              cx="75%"
              cy="90%"
              r="32"
              fill="none"
              stroke="rgba(255,255,255,0.12)"
              strokeWidth="1.5"
            />
            {/* Medium filled dots */}
            <circle cx="18%" cy="25%" r="5" fill="rgba(255,255,255,0.2)" />
            <circle cx="42%" cy="78%" r="7" fill="rgba(255,255,255,0.15)" />
            <circle cx="67%" cy="20%" r="4" fill="rgba(255,255,255,0.2)" />
            <circle cx="88%" cy="65%" r="6" fill="rgba(255,255,255,0.15)" />
            {/* Small sharp dots */}
            <circle cx="28%" cy="55%" r="2" fill="rgba(255,255,255,0.5)" />
            <circle cx="50%" cy="30%" r="1.5" fill="rgba(255,255,255,0.55)" />
            <circle cx="61%" cy="72%" r="2" fill="rgba(255,255,255,0.45)" />
            <circle cx="80%" cy="40%" r="1.5" fill="rgba(255,255,255,0.5)" />
            <circle cx="35%" cy="88%" r="2" fill="rgba(255,255,255,0.4)" />
            <circle cx="12%" cy="70%" r="1.5" fill="rgba(255,255,255,0.5)" />
            {/* Tilted crosses / plus signs */}
            <line
              x1="55%"
              y1="48%"
              x2="57%"
              y2="52%"
              stroke="rgba(255,255,255,0.4)"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <line
              x1="56%"
              y1="48%"
              x2="56%"
              y2="52%"
              stroke="rgba(255,255,255,0.4)"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            {/* Diagonal lines */}
            <line
              x1="22%"
              y1="5%"
              x2="26%"
              y2="18%"
              stroke="rgba(255,255,255,0.2)"
              strokeWidth="1"
              strokeLinecap="round"
            />
            <line
              x1="70%"
              y1="8%"
              x2="73%"
              y2="22%"
              stroke="rgba(255,255,255,0.15)"
              strokeWidth="1"
              strokeLinecap="round"
            />
            {/* Tiny squares */}
            <rect
              x="46%"
              y="12%"
              width="5"
              height="5"
              rx="1"
              fill="rgba(255,255,255,0.25)"
              transform="rotate(25 46 12)"
            />
            <rect
              x="83%"
              y="72%"
              width="4"
              height="4"
              rx="1"
              fill="rgba(255,255,255,0.2)"
              transform="rotate(40 83 72)"
            />
            <rect
              x="10%"
              y="85%"
              width="6"
              height="6"
              rx="1"
              fill="rgba(255,255,255,0.18)"
              transform="rotate(15 10 85)"
            />
          </svg>
        </div>

        <div className="flex items-end justify-between flex-wrap gap-4 -mt-12 pb-0">
          {/* Avatar + info */}
          <div className="flex items-end gap-5">
            <div className="relative w-fit">
              {profile.avatar ? (
                <img
                  src={profile.avatar}
                  alt="profile picture"
                  className="h-24 w-24 rounded-full border-[3px] border-background ring-1 ring-border object-cover object-center"
                />
              ) : (
                <Avatar className="h-24 w-24 border-[3px] border-background ring-1 ring-border">
                  <AvatarFallback className="text-2xl bg-muted text-primary font-bold">
                    {profile.firstName?.[0]?.toUpperCase()}
                    {profile.lastName?.[0]?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              )}
            </div>

            <div className="pb-1 mt-8">
              <p className="text-lg font-medium">
                {profile.firstName?.[0]?.toUpperCase() +
                  profile.firstName.slice(1)}{" "}
                {profile.lastName?.[0]?.toUpperCase() +
                  profile.lastName.slice(1)}
              </p>
              <p className="text-sm text-muted-foreground">{profile.email}</p>
              <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                <CalendarIcon className="w-3 h-3" />
                Member since{" "}
                {profile.createdAt
                  ? format(new Date(profile.createdAt), "PPP")
                  : "—"}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-6 border-t border-border pb-6 mt-6">
          {/* REPUTATION SCORE */}
          <div className="rounded-xl border border-border/60 bg-muted/40 p-4 space-y-3 hover:bg-muted/60 transition">
            <div className="flex items-center gap-2 text-muted-foreground">
              <TrendingUp className="w-4 h-4" />
              <p className="text-xs font-medium uppercase tracking-wide">
                Reputation Score
              </p>
            </div>
            <p className="text-base font-semibold text-foreground">
              {skillProfile?.reputationScore || 0}
            </p>
          </div>

          {/* TOTAL REVIEWS */}
          <div className="rounded-xl border border-border/60 bg-muted/40 p-4 space-y-3 hover:bg-muted/60 transition">
            <div className="flex items-center gap-2 text-muted-foreground">
              <MessageSquare className="w-4 h-4" />
              <p className="text-xs font-medium uppercase tracking-wide">
                Total Reviews
              </p>
            </div>
            <p className="text-base font-semibold text-foreground">
              {reviews.length}
            </p>
          </div>

          {/* AVG RATING */}
          <div className="rounded-xl border border-border/60 bg-muted/40 p-4 space-y-3 hover:bg-muted/60 transition">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Star className="w-4 h-4" />
              <p className="text-xs font-medium uppercase tracking-wide">
                Avg Rating
              </p>
            </div>
            <div className="flex items-center gap-1">
              <p className="text-base font-semibold text-foreground">
                {averageRating}
              </p>
              {reviews.length > 0 && (
                <RiStarFill className="text-yellow-500 text-sm" />
              )}
            </div>
          </div>

          {/* MODE / AVAILABILITY */}
          <div className="rounded-xl border border-border/60 bg-muted/40 p-4 space-y-3 hover:bg-muted/60 transition">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Activity className="w-4 h-4" />
              <p className="text-xs font-medium uppercase tracking-wide">
                Preference
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span
                className={`h-2.5 w-2.5 rounded-full ${skillProfile?.availability === "available" ? "bg-success" : skillProfile?.availability === "busy" ? "bg-yellow-500" : "bg-muted-foreground"}`}
              />
              <p className="text-base font-semibold capitalize">
                {skillProfile?.mode || "Both"} •{" "}
                {skillProfile?.availability || "Unknown"}
              </p>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {/* Professional Summary */}
          <Card className="px-8">
            <CardHeader className="px-0">
              <CardTitle className="text-lg flex items-center gap-2">
                <IoBagOutline className="text-xl" />
                Professional Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {profile.bio ? (
                <p className="pb-6 text-foreground/90">{profile.bio}</p>
              ) : (
                <div className="flex flex-col items-center justify-center py-6 text-center border-dashed rounded-lg bg-muted/50 border mb-6">
                  <IoDocumentTextOutline className="text-3xl text-muted-foreground mb-2" />
                  <p className="text-sm font-medium text-muted-foreground">
                    No bio provided
                  </p>
                  <p className="text-xs text-muted-foreground/70 mt-1">
                    This user hasn’t added a professional summary yet.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Work Experience */}
          <Card className="px-8">
            <CardHeader className="px-0">
              <CardTitle className="text-lg flex items-center gap-2">
                <IoTimerOutline className="text-xl" />
                Work Experience
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 space-y-8 pb-8">
              {/* Current Work */}
              {profile.currentWork?.company && (
                <div className="flex gap-4">
                  {/* Timeline */}
                  <div className="flex flex-col items-center">
                    <div className="h-3 w-3 rounded-full bg-primary mt-2" />
                    {profile.workExperience &&
                      profile.workExperience.length > 0 && (
                        <div className="w-0.5 flex-1 bg-border" />
                      )}
                  </div>
                  {/* Content */}
                  <div>
                    <p className="font-semibold text-base">
                      {profile.currentWork.role} @ {profile.currentWork.company}
                    </p>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      {fmtDate(profile.currentWork.startDate)}
                      <GoDash />
                      {profile.currentWork.endDate
                        ? fmtDate(profile.currentWork.endDate)
                        : "Present"}
                    </p>
                    {profile.currentWork.description && (
                      <p className="text-sm text-foreground/80 mt-1">
                        {profile.currentWork.description}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Past Experience */}
              {profile.workExperience?.map((we: any, index: number) => (
                <div key={we._id || index} className="flex gap-4">
                  {/* Timeline Dot + Line */}
                  <div className="flex flex-col items-center">
                    <div className="h-3 w-3 rounded-full bg-muted-foreground mt-2" />
                    {profile.workExperience &&
                      index !== profile.workExperience.length - 1 && (
                        <div className="w-0.5 flex-1 bg-border" />
                      )}
                  </div>
                  {/* Content */}
                  <div>
                    <p className="font-semibold text-base">
                      {we.role} @ {we.company}
                    </p>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      {fmtDate(we.startDate)}
                      <GoDash />
                      {we.endDate ? fmtDate(we.endDate) : "Present"}
                    </p>
                    {we.description && (
                      <p className="text-sm text-foreground/80 mt-1">
                        {we.description}
                      </p>
                    )}
                  </div>
                </div>
              ))}

              {/* Empty State */}
              {!profile.currentWork?.company &&
                (!profile.workExperience ||
                  profile.workExperience.length === 0) && (
                  <div className="flex flex-col items-center justify-center py-6 text-center border-dashed rounded-lg bg-muted/50 border mb-6">
                    <IoBriefcaseOutline className="text-3xl text-muted-foreground mb-2" />
                    <p className="text-sm font-medium text-muted-foreground">
                      No work experience listed
                    </p>
                  </div>
                )}
            </CardContent>
          </Card>

          {/* Skills Section */}
          {(skillProfile?.offerSkills?.length > 0 ||
            skillProfile?.wantSkills?.length > 0) && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Card className="px-6 py-2">
                <CardHeader className="px-0">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <RiLightbulbFlashLine className="text-yellow-500" />
                    Skills Offered
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-0 pb-6">
                  {skillProfile.offerSkills?.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {skillProfile.offerSkills.map((skill: any) => (
                        <div
                          key={skill._id}
                          className={`px-3 py-1.5 rounded-full border text-xs font-medium flex items-center gap-1.5 ${getDifficultyColor(skill.difficulty)}`}
                        >
                          {skill.primarySkill.name}
                          <span className="opacity-60 text-[10px] uppercase tracking-wider">
                            {skill.difficulty}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground italic">
                      No skills offered yet.
                    </p>
                  )}
                </CardContent>
              </Card>

              <Card className="px-6 py-2">
                <CardHeader className="px-0">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <RiBookOpenLine className="text-primary" />
                    Skills Wanted
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-0 pb-6">
                  {skillProfile.wantSkills?.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {skillProfile.wantSkills.map((skill: any) => (
                        <div
                          key={skill._id}
                          className="px-3 py-1.5 rounded-full border border-border/60 bg-muted/50 text-foreground text-xs font-medium"
                        >
                          {skill.primarySkill.name}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground italic">
                      No skills wanted yet.
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {/* Reviews */}
          <Card className="px-8">
            <CardHeader className="px-0">
              <CardTitle className="text-lg flex items-center gap-2">
                <RiMessage2Line className="text-primary text-xl" />
                Skill Swap Reviews
              </CardTitle>
            </CardHeader>
            <CardContent className="px-0 pb-8 space-y-4">
              {reviews.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-6 text-center border-dashed rounded-lg bg-muted/50 border mb-6">
                  <RiStarLine className="text-3xl text-muted-foreground mb-2" />
                  <p className="text-sm font-medium text-muted-foreground">
                    No reviews yet
                  </p>
                  <p className="text-xs text-muted-foreground/70 mt-1">
                    This user hasn't received any feedback.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {reviews.map((review) => (
                    <div
                      key={review._id}
                      className="border border-border/50 shadow-sm hover:shadow-md transition-shadow rounded-xl p-5 flex flex-col h-full bg-card"
                    >
                      <div className="flex justify-between items-start gap-4 mb-4">
                        <div className="flex items-center gap-3 min-w-0">
                          <Avatar className="w-10 h-10 border border-border/50 shrink-0">
                            <AvatarImage src={review.reviewer.avatar} />
                            <AvatarFallback className="bg-primary/5 text-primary text-xs font-bold">
                              {review.reviewer.firstName?.[0]}
                              {review.reviewer.lastName?.[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div className="truncate">
                            <p className="font-medium text-sm text-foreground truncate">
                              {review.reviewer.firstName}{" "}
                              {review.reviewer.lastName}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {format(
                                new Date(review.createdAt),
                                "MMM d, yyyy",
                              )}
                            </p>
                          </div>
                        </div>
                        <div className="flex text-yellow-500 text-sm shrink-0 bg-yellow-500/10 px-2 py-1 rounded-full">
                          {[1, 2, 3, 4, 5].map((star) =>
                            star <= review.rating ? (
                              <RiStarFill key={star} />
                            ) : (
                              <RiStarLine
                                key={star}
                                className="text-yellow-500/30"
                              />
                            ),
                          )}
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground leading-relaxed bg-muted/30 p-3.5 rounded-lg border border-border/30 grow relative">
                        <span className="absolute -top-2 -left-1 text-2xl text-primary/20 font-serif">
                          "
                        </span>
                        <p className="relative z-10 pl-2 italic">
                          "{review.feedback}"
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Social Profile */}
        <Card className="px-8 h-fit">
          <CardHeader className="px-0">
            <CardTitle className="text-lg flex items-center gap-2">
              <IoShareSocialOutline className="text-xl" />
              Social Profiles
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 px-0 pb-8">
            {SOCIAL_LINKS.map(({ key, label, icon: Icon, hoverClass }) => {
              const href = profile.socialLinks?.[key];
              if (!href) return null;
              return (
                <Link
                  key={key}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`group flex items-center justify-between rounded-xl border px-4 py-3 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${hoverClass}`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="text-xl transition-transform duration-200 group-hover:scale-110" />
                    <span className="font-medium">{label}</span>
                  </div>
                  <RiShareBoxLine className="text-muted-foreground transition-all duration-200 group-hover:translate-x-1 group-hover:text-current" />
                </Link>
              );
            })}

            {(!profile.socialLinks ||
              !Object.values(profile.socialLinks).some(Boolean)) && (
              <div className="flex flex-col items-center justify-center py-6 text-center border border-dashed rounded-lg bg-muted/50 px-2">
                <IoShareSocialOutline className="text-3xl text-muted-foreground mb-2" />
                <p className="text-sm font-medium text-muted-foreground">
                  No social links added
                </p>
                <p className="text-xs text-muted-foreground/70 mt-1">
                  This user hasn't added any social profiles yet.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
