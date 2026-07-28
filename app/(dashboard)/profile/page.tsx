"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  getMe,
  resendVerificationEmail,
} from "@/store/features/auth/authSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  Activity,
  Briefcase,
  CalendarIcon,
  CircleCheck,
  ClipboardEdit,
  ClipboardEditIcon,
  Clock,
  Mail,
  Plus,
  ShieldHalf,
  Trash2,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { MdOutlineFileUpload } from "react-icons/md";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import {
  deleteAvatar,
  updateProfile,
  uploadAvatar,
} from "@/store/features/profile/profileSlice";
import Image from "next/image";
import { toast } from "sonner";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRouter } from "next/navigation";
import {
  IoBagOutline,
  IoBriefcaseOutline,
  IoDocumentTextOutline,
  IoKeyOutline,
  IoShareSocialOutline,
  IoTimerOutline,
} from "react-icons/io5";
import {
  WorkExperience,
  SocialLinks,
  CurrentWork,
  DateField,
} from "@/store/features/auth/type";
import {
  EMPTY_CW,
  EMPTY_DATE,
  EMPTY_EXP,
  MONTHS,
  NOW_MONTH,
  NOW_YEAR,
  SOCIAL_LINKS,
} from "@/constant/data";
import Link from "next/link";
import { RiShareBoxLine } from "react-icons/ri";
import { GoDash } from "react-icons/go";
import { FaRegTrashAlt } from "react-icons/fa";

const page = () => {
  const dispatch = useAppDispatch();
  const { user, loadingMe } = useAppSelector((state) => state.auth);
  const [loadingUser, setLoadingUser] = useState(false);
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [bio, setBio] = useState("");
  const [currentWork, setCurrentWork] = useState<CurrentWork | null>(null);
  const [workExperience, setWorkExperience] = useState<WorkExperience[]>([]);
  const [socialLinks, setSocialLinks] = useState<SocialLinks>({});
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const [resending, setResending] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      setLoadingUser(true);
      await dispatch(getMe());
      setLoadingUser(false);
    };
    fetchUser();
  }, [dispatch]);

  const handleAvatarDelete = async () => {
    try {
      await dispatch(deleteAvatar()).unwrap();
      toast.success("Avatar removed successfully!");
    } catch (error: any) {
      toast.error(
        error?.global || error?.message || "Failed to remove avatar.",
      );
    }
  };

  // Pre-fill form when dialog opens
  useEffect(() => {
    if (open && user) {
      setFirstName(user.firstName || "");
      setLastName(user.lastName || "");
      setBio(user.bio || "");
      setCurrentWork(user.currentWork ? { ...user.currentWork } : null);
      setWorkExperience(
        user.workExperience ? user.workExperience.map((e) => ({ ...e })) : [],
      );
      setSocialLinks(user.socialLinks || {});
    }
  }, [open, user]);

  /** Format a DateField to a human-readable string e.g. "Jun 2025" or "Jun 15, 2025" */
  const fmtDate = (d: DateField | null | undefined): string => {
    if (!d || (!d.year && !d.month)) return "Present";
    const m = d.month ? MONTHS[d.month - 1] : "";
    const yearStr = d.year ? String(d.year) : "";
    if (!m) return yearStr || "Present";
    return d.day ? `${m} ${d.day}, ${yearStr}` : `${m} ${yearStr}`;
  };

  // Open file picker
  const openFilePicker = () => {
    fileRef.current?.click();
  };

  // Handle file selection
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!validTypes.includes(file.type)) {
      toast.error("Unsupported file format", {
        description: "Please upload a JPEG, PNG, WEBP, or GIF image.",
      });
      if (fileRef.current) fileRef.current.value = "";
      return;
    }

    const MAX_SIZE = 4 * 1024 * 1024; // 4MB
    if (file.size > MAX_SIZE) {
      toast.error("File is too large", {
        description: "Please upload an image smaller than 4MB.",
      });
      if (fileRef.current) fileRef.current.value = "";
      return;
    }

    const reader = new FileReader();

    reader.onloadend = async () => {
      const base64String = reader.result as string;
      try {
        await dispatch(uploadAvatar({ avatar: base64String })).unwrap();
        toast.success("Profile picture updated!");
      } catch (err: any) {
        toast.error(err?.global || "Failed to update profile picture");
      }
      if (fileRef.current) fileRef.current.value = "";
    };

    reader.readAsDataURL(file);
  };

  const handleUpdateProfile = async () => {
    const payload = {
      firstName: firstName || undefined,
      lastName: lastName || undefined,
      bio: bio || null,
      currentWork: currentWork?.company ? currentWork : null,
      workExperience,
      socialLinks,
    };
    try {
      await dispatch(updateProfile(payload)).unwrap();
      toast.success("Profile updated successfully!");
      setOpen(false);
    } catch (error: any) {
      toast.error(
        error?.global ||
          error?.message ||
          "Failed to update profile. Please try again later.",
      );
    }
  };

  const addExp = () =>
    setWorkExperience((prev) => [
      ...prev,
      { ...EMPTY_EXP, startDate: { ...EMPTY_DATE }, endDate: null },
    ]);
  const removeExp = (i: number) =>
    setWorkExperience((prev) => prev.filter((_, idx) => idx !== i));

  /** Update a scalar field on a work experience entry */
  const updateExpField = (
    i: number,
    field: "company" | "role" | "description",
    value: string,
  ) =>
    setWorkExperience((prev) =>
      prev.map((exp, idx) => (idx === i ? { ...exp, [field]: value } : exp)),
    );

  /** Update a date sub-field on startDate or endDate of a work experience entry */
  const updateExpDate = (
    i: number,
    which: "startDate" | "endDate",
    key: keyof DateField,
    value: number | null,
  ) =>
    setWorkExperience((prev) =>
      prev.map((exp, idx) => {
        if (idx !== i) return exp;
        if (which === "endDate" && value === null && key === "year") {
          return { ...exp, endDate: null }; // null endDate = Present
        }
        const existing = exp[which] ?? {
          year: NOW_YEAR,
          month: NOW_MONTH,
          day: null,
        };
        return { ...exp, [which]: { ...existing, [key]: value } };
      }),
    );

  /** Toggle a work experience entry between "Present" and a real end date */
  const toggleEndDate = (i: number, isPresent: boolean) =>
    setWorkExperience((prev) =>
      prev.map((exp, idx) =>
        idx !== i
          ? exp
          : {
              ...exp,
              endDate: isPresent
                ? null
                : { year: NOW_YEAR, month: NOW_MONTH, day: null },
            },
      ),
    );

  /** Update currentWork scalar fields */
  const updateCW = (field: "company" | "role" | "description", value: string) =>
    setCurrentWork((prev) => ({ ...(prev ?? EMPTY_CW), [field]: value }));

  /** Update currentWork date sub-fields */
  const updateCWDate = (
    which: "startDate" | "endDate",
    key: keyof DateField,
    value: number | null,
  ) =>
    setCurrentWork((prev) => {
      const base = prev ?? EMPTY_CW;
      const existing = base[which] ?? {
        year: NOW_YEAR,
        month: NOW_MONTH,
        day: null,
      };
      return { ...base, [which]: { ...existing, [key]: value } };
    });

  const updateSocial = (key: keyof SocialLinks, value: string) =>
    setSocialLinks((prev) => ({ ...prev, [key]: value || null }));

  const handleResendVerification = async () => {
    setResending(true);
    try {
      await dispatch(resendVerificationEmail()).unwrap();
      toast.success("Verification email sent!", {
        description: "Please check your inbox and click the link.",
      });
    } catch (error: any) {
      toast.error(error?.global || "Failed to send verification email.");
    } finally {
      setResending(false);
    }
  };

  return (
    <>
      {loadingMe || loadingUser ? (
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

            {/* Action buttons */}
            <div className="flex items-center gap-2 pb-1">
              <Skeleton className="h-8 w-28 rounded-full" />
              <Skeleton className="h-8 w-32 rounded-full" />
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
      ) : (
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
                <circle
                  cx="50%"
                  cy="30%"
                  r="1.5"
                  fill="rgba(255,255,255,0.55)"
                />
                <circle cx="61%" cy="72%" r="2" fill="rgba(255,255,255,0.45)" />
                <circle
                  cx="80%"
                  cy="40%"
                  r="1.5"
                  fill="rgba(255,255,255,0.5)"
                />
                <circle cx="35%" cy="88%" r="2" fill="rgba(255,255,255,0.4)" />
                <circle
                  cx="12%"
                  cy="70%"
                  r="1.5"
                  fill="rgba(255,255,255,0.5)"
                />

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
                <div
                  className="relative cursor-pointer group w-fit"
                  onClick={openFilePicker}
                >
                  <input
                    type="file"
                    ref={fileRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileChange}
                  />

                  {user?.avatar ? (
                    <img
                      src={user.avatar}
                      alt="profile picture"
                      className="h-24 w-24 rounded-full border-[3px] border-background ring-1 ring-border object-cover object-center transition-all duration-200 group-hover:brightness-60 group-hover:scale-[1.03]"
                    />
                  ) : (
                    <Avatar className="h-24 w-24 border-[3px] border-background ring-1 ring-border transition-all duration-200 group-hover:brightness-60 group-hover:scale-[1.03]">
                      <AvatarFallback className="text-2xl bg-muted text-primary">
                        {user?.firstName?.[0]?.toUpperCase()}
                        {user?.lastName?.[0]?.toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  )}

                  {/* Upload overlay */}
                  <div className="absolute inset-0 rounded-full flex flex-col items-center justify-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <MdOutlineFileUpload className="text-white text-[22px] drop-shadow" />
                    <span className="text-white text-[10px] font-semibold tracking-wide drop-shadow">
                      Upload
                    </span>
                  </div>

                  {/* Delete button — only when avatar exists */}
                  {user?.avatar && (
                    <Dialog>
                      <DialogTrigger asChild>
                        <button
                          onClick={(e) => e.stopPropagation()}
                          className="absolute -top-1 right-0 w-6 h-6 rounded-full cursor-pointer bg-destructive text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-destructive/80 shadow-sm z-10"
                          aria-label="Remove avatar"
                        >
                          <FaRegTrashAlt className="w-3 h-3" />
                        </button>
                      </DialogTrigger>

                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Remove profile photo?</DialogTitle>
                          <DialogDescription>
                            This will permanently delete your current profile
                            photo. You can always upload a new one later.
                          </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                          <DialogClose asChild>
                            <Button
                              variant="destructive"
                              onClick={handleAvatarDelete}
                            >
                              <FaRegTrashAlt className="w-3 h-3" />
                              Remove Photo
                            </Button>
                          </DialogClose>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  )}

                  {/* Online dot — hidden on hover */}
                  <span className="absolute bottom-1 right-1.5 w-3.5 h-3.5 rounded-full bg-success border-2 border-background group-hover:opacity-0 transition-opacity duration-200" />
                </div>

                <div className="pb-1 mt-8">
                  <p className="text-lg font-medium">
                    {user &&
                      user?.firstName?.[0]?.toUpperCase() +
                        user.firstName.slice(1) +
                        " " +
                        user?.lastName?.[0]?.toUpperCase() +
                        user.lastName.slice(1)}
                  </p>
                  <p className="text-sm text-muted-foreground">{user?.email}</p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                    <CalendarIcon className="w-3 h-3" />
                    Member since{" "}
                    {user?.createdAt
                      ? format(new Date(user.createdAt), "PPP")
                      : "—"}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 pb-1">
                <Dialog open={open} onOpenChange={setOpen}>
                  <DialogTrigger asChild>
                    <Button
                      variant={"outline"}
                      className="flex items-center gap-2"
                    >
                      <ClipboardEdit />
                      Edit Profile
                    </Button>
                  </DialogTrigger>

                  <DialogContent
                    className="p-0 min-w-[560px] max-h-[90vh] overflow-y-auto rounded-2xl border border-border"
                    style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                  >
                    {/* ── Hero Banner ── */}
                    <div className="relative overflow-visible bg-linear-to-r from-primary/60 via-primary/70 to-primary/50 dark:from-primary/20 dark:via-primary/30 dark:to-primary/10 px-7 pt-6 pb-10">
                      {/* Decorative SVG */}
                      <div className="absolute inset-0 overflow-hidden rounded-t-2xl">
                        <svg
                          className="w-full h-full"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <circle
                            cx="480"
                            cy="-20"
                            r="120"
                            stroke="white"
                            fill="none"
                            strokeWidth="1"
                            opacity="0.12"
                          />
                          <circle
                            cx="520"
                            cy="80"
                            r="60"
                            stroke="white"
                            fill="none"
                            strokeWidth="0.5"
                            opacity="0.08"
                          />
                          <circle
                            cx="60"
                            cy="140"
                            r="80"
                            stroke="white"
                            fill="none"
                            strokeWidth="0.5"
                            opacity="0.08"
                          />
                          <circle
                            cx="200"
                            cy="20"
                            r="3"
                            fill="white"
                            opacity="0.25"
                          />
                          <circle
                            cx="340"
                            cy="60"
                            r="2"
                            fill="white"
                            opacity="0.2"
                          />
                          <circle
                            cx="450"
                            cy="100"
                            r="4"
                            fill="white"
                            opacity="0.15"
                          />
                          <line
                            x1="160"
                            y1="0"
                            x2="200"
                            y2="140"
                            stroke="white"
                            strokeWidth="0.4"
                            opacity="0.12"
                          />
                          <line
                            x1="320"
                            y1="0"
                            x2="280"
                            y2="140"
                            stroke="white"
                            strokeWidth="0.3"
                            opacity="0.1"
                          />
                        </svg>
                      </div>

                      {/* Title */}
                      <div className="relative z-10 mb-2">
                        <h2 className="text-2xl font-semibold text-primary-foreground">
                          Edit Profile
                        </h2>
                        <p className="text-base text-primary-foreground">
                          Update your information
                        </p>
                      </div>

                      {/* Avatar + Change Photo — sits at bottom of hero, overlaps body via negative margin */}
                      <div className="relative z-10 flex items-end justify-between">
                        {user?.avatar ? (
                          <img
                            src={user.avatar}
                            alt="profile picture"
                            className="h-[72px] w-[72px] rounded-full border-[3px] border-white object-cover shadow-lg translate-y-1/2"
                          />
                        ) : (
                          <div className="h-[72px] w-[72px] rounded-full border-[3px] border-white bg-linear-to-r from-primary to-primary/60 flex items-center justify-center shadow-lg translate-y-1/2">
                            <span className="font-serif text-2xl text-primary-foreground">
                              {user?.firstName?.[0]?.toUpperCase()}
                              {user?.lastName?.[0]?.toUpperCase()}
                            </span>
                          </div>
                        )}
                        <Button onClick={openFilePicker} variant={"outline"}>
                          <MdOutlineFileUpload className="text-sm" />
                          Change photo
                        </Button>
                      </div>
                    </div>

                    {/* ── Body ── */}
                    <div className="px-4 py-2">
                      {/* Tabs */}
                      <Tabs defaultValue="basic" className="w-full">
                        <TabsList className="w-full grid grid-cols-3 mb-6 bg-muted/40 rounded-xl p-1 border border-muted">
                          <TabsTrigger
                            value="basic"
                            className="rounded-lg text-xs font-medium tracking-wide uppercase data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm"
                          >
                            Basic
                          </TabsTrigger>
                          <TabsTrigger
                            value="experience"
                            className="rounded-lg text-xs font-medium tracking-wide uppercase data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm"
                          >
                            Experience
                          </TabsTrigger>
                          <TabsTrigger
                            value="social"
                            className="rounded-lg text-xs font-medium tracking-wide uppercase data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm"
                          >
                            Social
                          </TabsTrigger>
                        </TabsList>

                        {/* ── BASIC TAB ── */}
                        <TabsContent value="basic" className="space-y-4 mt-0">
                          <div className="grid grid-cols-2 gap-3">
                            <div className="flex flex-col gap-1.5">
                              <label className="text-[11px] font-medium uppercase tracking-widest text-muted-foreground">
                                First Name
                              </label>
                              <Input
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                              />
                            </div>
                            <div className="flex flex-col gap-1.5">
                              <label className="text-[11px] font-medium uppercase tracking-widest text-muted-foreground">
                                Last Name
                              </label>
                              <Input
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                              />
                            </div>
                          </div>

                          {/* Bio */}
                          <div className="flex flex-col gap-1.5">
                            <label className="text-[11px] font-medium uppercase tracking-widest text-muted-foreground">
                              Professional Summary
                            </label>
                            <Textarea
                              rows={3}
                              maxLength={500}
                              placeholder="Tell others a bit about yourself..."
                              value={bio}
                              onChange={(e) => setBio(e.target.value)}
                              className="bg-background"
                            />
                            <p className="text-[11px] text-muted-foreground text-right">
                              {bio.length}/500
                            </p>
                          </div>

                          {/* Current Position */}
                          <div className="rounded-xl border border-border/60 bg-muted p-4 space-y-3">
                            <p className="text-[11px] font-semibold uppercase tracking-widest text-primary flex items-center gap-1.5">
                              <Briefcase className="w-3.5 h-3.5" />
                              Current Position
                            </p>
                            <div className="grid grid-cols-2 gap-2">
                              <Input
                                placeholder="Company"
                                value={currentWork?.company ?? ""}
                                onChange={(e) =>
                                  updateCW("company", e.target.value)
                                }
                                className="bg-background"
                              />
                              <Input
                                placeholder="Role / Title"
                                value={currentWork?.role ?? ""}
                                onChange={(e) =>
                                  updateCW("role", e.target.value)
                                }
                                className="bg-background"
                              />
                            </div>

                            <p className="text-[11px] text-muted-foreground">
                              Start date
                            </p>
                            <div className="grid grid-cols-3 gap-2">
                              <select
                                className="h-9 rounded-full border border-border/60 bg-background px-2 text-sm"
                                value={
                                  currentWork?.startDate?.month ?? NOW_MONTH
                                }
                                onChange={(e) =>
                                  updateCWDate(
                                    "startDate",
                                    "month",
                                    Number(e.target.value),
                                  )
                                }
                              >
                                {MONTHS.map((m, idx) => (
                                  <option key={m} value={idx + 1}>
                                    {m}
                                  </option>
                                ))}
                              </select>
                              <Input
                                type="number"
                                placeholder="Year"
                                min={1950}
                                max={NOW_YEAR}
                                value={currentWork?.startDate?.year ?? NOW_YEAR}
                                onChange={(e) =>
                                  updateCWDate(
                                    "startDate",
                                    "year",
                                    Number(e.target.value),
                                  )
                                }
                                className="bg-background"
                              />
                              <Input
                                type="number"
                                placeholder="Day (opt.)"
                                min={1}
                                max={31}
                                value={currentWork?.startDate?.day ?? ""}
                                onChange={(e) =>
                                  updateCWDate(
                                    "startDate",
                                    "day",
                                    e.target.value
                                      ? Number(e.target.value)
                                      : null,
                                  )
                                }
                                className="bg-background"
                              />
                            </div>
                            <Textarea
                              rows={2}
                              placeholder="Short description (optional)"
                              value={currentWork?.description ?? ""}
                              onChange={(e) =>
                                updateCW("description", e.target.value)
                              }
                              className="bg-background"
                            />
                          </div>
                        </TabsContent>

                        {/* ── EXPERIENCE TAB ── */}
                        <TabsContent
                          value="experience"
                          className="mt-0 space-y-3"
                        >
                          <div className="max-h-72 overflow-y-auto space-y-3 pr-1 [&::-webkit-scrollbar]:hidden">
                            {workExperience.length === 0 && (
                              <div className="flex flex-col items-center justify-center py-10 text-muted-foreground gap-2">
                                <Briefcase className="w-8 h-8 opacity-30" />
                                <p className="text-sm">
                                  No experience entries yet
                                </p>
                              </div>
                            )}
                            {workExperience.map((exp, i) => (
                              <div
                                key={i}
                                className="rounded-xl border border-border/60 bg-muted/20 p-4 space-y-3"
                              >
                                <div className="flex items-center justify-between">
                                  <span className="text-[11px] font-semibold uppercase tracking-widest bg-primary text-primary-foreground px-2.5 py-1 rounded-md">
                                    Entry {i + 1}
                                  </span>
                                  <Button
                                    size="icon"
                                    variant="ghost"
                                    className="h-7 w-7 rounded-lg text-destructive hover:bg-destructive/10"
                                    onClick={() => removeExp(i)}
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </Button>
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                  <Input
                                    placeholder="Company"
                                    value={exp.company}
                                    onChange={(e) =>
                                      updateExpField(
                                        i,
                                        "company",
                                        e.target.value,
                                      )
                                    }
                                  />
                                  <Input
                                    placeholder="Role / Position"
                                    value={exp.role}
                                    onChange={(e) =>
                                      updateExpField(i, "role", e.target.value)
                                    }
                                  />
                                </div>
                                <p className="text-[11px] text-muted-foreground font-medium">
                                  Start date
                                </p>
                                <div className="grid grid-cols-3 gap-2">
                                  <select
                                    className="h-9 rounded-xl border border-border/60 bg-background px-2 text-sm"
                                    value={exp.startDate?.month ?? NOW_MONTH}
                                    onChange={(e) =>
                                      updateExpDate(
                                        i,
                                        "startDate",
                                        "month",
                                        Number(e.target.value),
                                      )
                                    }
                                  >
                                    {MONTHS.map((m, idx) => (
                                      <option key={m} value={idx + 1}>
                                        {m}
                                      </option>
                                    ))}
                                  </select>
                                  <Input
                                    type="number"
                                    placeholder="Year"
                                    min={1950}
                                    max={NOW_YEAR}
                                    value={exp.startDate?.year ?? ""}
                                    onChange={(e) =>
                                      updateExpDate(
                                        i,
                                        "startDate",
                                        "year",
                                        Number(e.target.value),
                                      )
                                    }
                                  />
                                  <Input
                                    type="number"
                                    placeholder="Day (opt.)"
                                    min={1}
                                    max={31}
                                    value={exp.startDate?.day ?? ""}
                                    onChange={(e) =>
                                      updateExpDate(
                                        i,
                                        "startDate",
                                        "day",
                                        e.target.value
                                          ? Number(e.target.value)
                                          : null,
                                      )
                                    }
                                  />
                                </div>
                                <div className="flex items-center justify-between">
                                  <p className="text-[11px] text-muted-foreground font-medium">
                                    End date
                                  </p>
                                  <label className="flex items-center gap-1.5 text-[11px] text-muted-foreground cursor-pointer">
                                    <input
                                      type="checkbox"
                                      checked={exp.endDate === null}
                                      onChange={(e) =>
                                        toggleEndDate(i, e.target.checked)
                                      }
                                    />
                                    Present / Ongoing
                                  </label>
                                </div>
                                {exp.endDate !== null && (
                                  <div className="grid grid-cols-3 gap-2">
                                    <select
                                      className="h-9 rounded-xl border border-border/60 bg-background px-2 text-sm"
                                      value={exp.endDate?.month ?? NOW_MONTH}
                                      onChange={(e) =>
                                        updateExpDate(
                                          i,
                                          "endDate",
                                          "month",
                                          Number(e.target.value),
                                        )
                                      }
                                    >
                                      {MONTHS.map((m, idx) => (
                                        <option key={m} value={idx + 1}>
                                          {m}
                                        </option>
                                      ))}
                                    </select>
                                    <Input
                                      type="number"
                                      placeholder="Year"
                                      min={1950}
                                      max={NOW_YEAR + 5}
                                      value={exp.endDate?.year ?? ""}
                                      onChange={(e) =>
                                        updateExpDate(
                                          i,
                                          "endDate",
                                          "year",
                                          Number(e.target.value),
                                        )
                                      }
                                    />
                                    <Input
                                      type="number"
                                      placeholder="Day (opt.)"
                                      min={1}
                                      max={31}
                                      value={exp.endDate?.day ?? ""}
                                      onChange={(e) =>
                                        updateExpDate(
                                          i,
                                          "endDate",
                                          "day",
                                          e.target.value
                                            ? Number(e.target.value)
                                            : null,
                                        )
                                      }
                                    />
                                  </div>
                                )}
                                <Textarea
                                  rows={2}
                                  placeholder="Short description (optional)"
                                  value={exp.description ?? ""}
                                  onChange={(e) =>
                                    updateExpField(
                                      i,
                                      "description",
                                      e.target.value,
                                    )
                                  }
                                />
                              </div>
                            ))}
                          </div>
                          <Button
                            onClick={addExp}
                            variant={"ghost"}
                            className="w-full"
                          >
                            <Plus className="w-4 h-4" />
                            Add experience entry
                          </Button>
                        </TabsContent>

                        {/* ── SOCIAL TAB ── */}
                        <TabsContent value="social" className="mt-0 space-y-3">
                          {SOCIAL_LINKS.map(
                            ({ key, icon: Icon, hoverClass }) => (
                              <div
                                key={key}
                                className="flex items-center gap-3"
                              >
                                {/* Icon box */}
                                <div
                                  className={`w-9 h-9 rounded-xl border border-border/60 bg-muted/40 flex items-center justify-center text-muted-foreground shrink-0 ${hoverClass}`}
                                >
                                  <Icon className="text-base" />
                                </div>

                                {/* Input */}
                                <Input
                                  placeholder={
                                    key === "website"
                                      ? "https://yourwebsite.com"
                                      : `https://${key}.com/yourprofile`
                                  }
                                  value={socialLinks[key] ?? ""}
                                  onChange={(e) =>
                                    updateSocial(key, e.target.value)
                                  }
                                />
                              </div>
                            ),
                          )}
                        </TabsContent>
                      </Tabs>
                    </div>

                    {/* ── Footer ── */}
                    <div className="flex items-center justify-between px-7 py-4 border-t border-border/60">
                      <Button
                        variant="ghost"
                        onClick={() => setOpen(false)}
                        className="text-muted-foreground hover:text-foreground rounded-xl"
                      >
                        Cancel
                      </Button>
                      <Button onClick={handleUpdateProfile}>
                        <ClipboardEditIcon className="w-4 h-4" />
                        Update Profile
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>

                <Button
                  onClick={() => router.push("/change-password")}
                  className="flex items-center gap-2"
                >
                  <IoKeyOutline />
                  Change Password
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-6 border-t border-border pb-6">
              {/* ROLE */}
              <div className="rounded-xl border border-border/60 bg-muted/40 p-4 space-y-3 hover:bg-muted/60 transition">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <ShieldHalf className="w-4 h-4" />
                  <p className="text-xs font-medium uppercase tracking-wide">
                    Role
                  </p>
                </div>
                <p className="text-base font-semibold text-foreground">
                  {user &&
                    user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1)}
                </p>
              </div>

              {/* LAST LOGIN */}
              <div className="rounded-xl border border-border/60 bg-muted/40 p-4 space-y-3 hover:bg-muted/60 transition">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  <p className="text-xs font-medium uppercase tracking-wide">
                    Last login
                  </p>
                </div>
                <p className="text-base font-semibold text-foreground">
                  {user?.lastLogin
                    ? format(new Date(user.lastLogin), "PPP")
                    : "—"}
                </p>
              </div>

              {/* EMAIL */}
              <div className="rounded-xl border border-border/60 bg-muted/40 p-4 space-y-3 hover:bg-muted/60 transition">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="w-4 h-4" />
                  <p className="text-xs font-medium uppercase tracking-wide">
                    Email
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  {user?.isEmailVerified ? (
                    <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full bg-success-muted text-success-muted-foreground">
                      <CircleCheck className="w-3 h-3" />
                      Verified
                    </span>
                  ) : (
                    <Button
                      size="sm"
                      variant="outline"
                      className="rounded-full text-xs px-3 py-1"
                      onClick={handleResendVerification}
                      disabled={resending}
                    >
                      {resending ? "Sending..." : "Verify Email"}
                    </Button>
                  )}
                </div>
              </div>

              {/* STATUS */}
              <div className="rounded-xl border border-border/60 bg-muted/40 p-4 space-y-3 hover:bg-muted/60 transition">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Activity className="w-4 h-4" />
                  <p className="text-xs font-medium uppercase tracking-wide">
                    Status
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`h-2.5 w-2.5 rounded-full ${user?.isLocked ? "bg-destructive" : "bg-success"}`}
                  />
                  <p
                    className={`text-base font-semibold ${user?.isLocked ? "text-destructive" : "text-success"}`}
                  >
                    {user?.isLocked ? "Locked" : "Active"}
                  </p>
                </div>
              </div>
            </div>
          </Card>

          <div className="grid grid-cols-3 gap-6">
            <div className="col-span-2 space-y-4">
              {/* Professional Summary */}
              <Card className="px-8">
                <CardHeader className="px-0">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <IoBagOutline className="text-xl" />
                    Professional Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  {user?.bio ? (
                    <p>{user.bio}</p>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-6 text-center border-dashed rounded-lg bg-muted/50 border">
                      <IoDocumentTextOutline className="text-3xl text-muted-foreground mb-2" />

                      <p className="text-sm font-medium text-muted-foreground">
                        No bio provided
                      </p>

                      <p className="text-xs text-muted-foreground/70 mt-1">
                        User hasn’t added a professional summary yet.
                      </p>
                    </div>
                  )}{" "}
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

                <CardContent className="p-0 space-y-8">
                  {/* Current Work */}
                  {user?.currentWork?.company && (
                    <div className="flex gap-4">
                      {/* Timeline */}
                      <div className="flex flex-col items-center">
                        <div className="h-3 w-3 rounded-full bg-primary mt-2" />
                        <div className="w-[2px] flex-1 bg-border" />
                      </div>

                      {/* Content */}
                      <div>
                        <p className="font-semibold text-base">
                          {user.currentWork.role} @ {user.currentWork.company}
                        </p>

                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          {fmtDate(user.currentWork.startDate)}
                          <GoDash />
                          {user.currentWork.endDate
                            ? fmtDate(user.currentWork.endDate)
                            : "Present"}
                        </p>

                        {user.currentWork.description && (
                          <p className="text-sm text-foreground/80 mt-1">
                            {user.currentWork.description}
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Past Experience */}
                  {user?.workExperience?.map((we, index) => (
                    <div key={we._id} className="flex gap-4">
                      {/* Timeline Dot + Line */}
                      <div className="flex flex-col items-center">
                        <div className="h-3 w-3 rounded-full bg-muted-foreground mt-2" />

                        {user.workExperience &&
                          index !== user.workExperience.length - 1 && (
                            <div className="w-[4px] flex-1 bg-border" />
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
                  {!user?.currentWork?.company &&
                    (!user?.workExperience ||
                      user.workExperience.length === 0) && (
                      <div className="flex flex-col items-center justify-center py-6 text-center border-dashed rounded-lg bg-muted/50 border">
                        <IoBriefcaseOutline className="text-3xl text-muted-foreground mb-2" />

                        <p className="text-sm font-medium text-muted-foreground">
                          No work experience listed
                        </p>

                        <p className="text-xs text-muted-foreground/70 mt-1">
                          Add your roles, companies, and experience to showcase
                          your journey.
                        </p>
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

              <CardContent className="space-y-3 px-0">
                {SOCIAL_LINKS.map(({ key, label, icon: Icon, hoverClass }) => {
                  const href = user?.socialLinks?.[key];

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

                {(!user?.socialLinks ||
                  !Object.values(user.socialLinks).some(Boolean)) && (
                  <div className="flex flex-col items-center justify-center py-6 text-center border border-dashed rounded-lg bg-muted/50 px-2">
                    <IoShareSocialOutline className="text-3xl text-muted-foreground mb-2" />

                    <p className="text-sm font-medium text-muted-foreground">
                      No social links added
                    </p>

                    <p className="text-xs text-muted-foreground/70 mt-1">
                      Add your LinkedIn, GitHub, Twitter and other profiles to
                      get discovered.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </>
  );
};

export default page;
