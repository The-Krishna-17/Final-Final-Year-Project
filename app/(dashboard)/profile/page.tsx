"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  getMe,
  resendVerificationEmail,
} from "@/store/features/auth/authSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  Activity,
  CalendarIcon,
  CircleCheck,
  ClipboardEdit,
  ClipboardEditIcon,
  Clock,
  Mail,
  ShieldHalf,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { MdOutlineFileUpload } from "react-icons/md";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import {
  updateProfile,
  uploadAvatar,
} from "@/store/features/profile/profileSlice";
import Image from "next/image";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { IoKeyOutline } from "react-icons/io5";

const page = () => {
  const dispatch = useAppDispatch();
  const { user, loadingMe } = useAppSelector((state) => state.auth);
  const [loadingUser, setLoadingUser] = useState(false);
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
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
      firstName,
      lastName,
    };
    try {
      await dispatch(updateProfile(payload)).unwrap();
      toast.success("Profile updated successfully!");
      setOpen(false);
    } catch (error: any) {
      toast.error(
        error?.message || "Failed to update profile. Please try again later.",
      );
    }
  };

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
              <div className="relative cursor-pointer">
                {user?.avatar ? (
                  <Image
                    src={user.avatar}
                    alt="profile picture"
                    width={200}
                    height={200}
                    className="h-24 w-24 rounded-full border-[3px] border-background ring-1 ring-border object-cover object-center"
                  />
                ) : (
                  <Avatar className="h-24 w-24 border-[3px] border-background ring-1 ring-border">
                    <AvatarFallback className="text-2xl bg-muted text-primary">
                      {user?.firstName?.[0]?.toUpperCase()}
                      {user?.lastName?.[0]?.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                )}

                <span className="absolute bottom-1 right-2 w-3.5 h-3.5 rounded-full bg-green-500 border-2 border-background" />
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
                <p className="text-xs text-muted-foreground/70 flex items-center gap-1 mt-0.5">
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
              <>
                <input
                  type="file"
                  ref={fileRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileChange}
                />

                <Button
                  variant="outline"
                  className="flex items-center gap-2"
                  onClick={openFilePicker}
                >
                  <MdOutlineFileUpload />
                  Upload Photo
                </Button>
              </>

              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <Button className="flex items-center gap-2">
                    <ClipboardEdit />
                    Edit Profile
                  </Button>
                </DialogTrigger>

                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle className="text-xl font-semibold">
                      Edit Profile
                    </DialogTitle>
                    <DialogDescription className="text-sm text-muted-foreground">
                      Update your personal information and profile details
                    </DialogDescription>
                  </DialogHeader>

                  <div className="relative flex flex-col items-center gap-3 py-6">
                    {/* BACKGROUND LAYER */}
                    <div className="absolute inset-0 overflow-hidden border-b border-border -z-10 rounded-xl">
                      {/* Gradient */}
                      <div className="absolute inset-0 bg-linear-to-r from-primary/60 via-primary/70 to-primary/50 dark:from-primary/20 dark:via-primary/30 dark:to-primary/10" />

                      {/* SVG Pattern */}
                      <svg
                        className="absolute inset-0 w-full h-full opacity-70"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <circle
                          cx="10%"
                          cy="40%"
                          r="30"
                          stroke="white"
                          fill="none"
                          opacity="0.15"
                        />
                        <circle
                          cx="80%"
                          cy="30%"
                          r="45"
                          stroke="white"
                          fill="none"
                          opacity="0.1"
                        />
                        <circle
                          cx="60%"
                          cy="80%"
                          r="35"
                          stroke="white"
                          fill="none"
                          opacity="0.12"
                        />

                        <circle
                          cx="25%"
                          cy="60%"
                          r="4"
                          fill="white"
                          opacity="0.2"
                        />
                        <circle
                          cx="70%"
                          cy="50%"
                          r="3"
                          fill="white"
                          opacity="0.25"
                        />
                        <circle
                          cx="90%"
                          cy="70%"
                          r="5"
                          fill="white"
                          opacity="0.15"
                        />
                      </svg>
                    </div>

                    {/* PROFILE IMAGE */}
                    <div className="relative z-10 mt-10">
                      {user?.avatar ? (
                        <Image
                          src={user.avatar}
                          alt="profile picture"
                          width={96}
                          height={96}
                          className="h-24 w-24 rounded-full border-4 border-background ring-2 ring-border object-cover"
                        />
                      ) : (
                        <Avatar className="h-24 w-24 border-4 border-background ring-2 ring-border">
                          <AvatarFallback className="text-xl bg-muted text-primary">
                            {user?.firstName?.[0]?.toUpperCase()}
                            {user?.lastName?.[0]?.toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                      )}
                    </div>

                    {/* BUTTON */}
                    <Button
                      variant="outline"
                      className="relative z-10"
                      onClick={openFilePicker}
                    >
                      <MdOutlineFileUpload />
                      Change Photo
                    </Button>
                  </div>

                  {/* Form Fields */}
                  <div className="space-y-4">
                    <div className="flex flex-col gap-2">
                      <label className="text-base font-medium">
                        First Name
                      </label>
                      <Input
                        type="text"
                        defaultValue={
                          user?.firstName
                            ? user.firstName.charAt(0).toUpperCase() +
                              user.firstName.slice(1)
                            : ""
                        }
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="text-base font-medium">Last Name</label>
                      <Input
                        type="text"
                        defaultValue={
                          user?.lastName
                            ? user.lastName.charAt(0).toUpperCase() +
                              user.lastName.slice(1)
                            : ""
                        }
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Footer */}
                  <DialogFooter>
                    <Button onClick={handleUpdateProfile}>
                      <ClipboardEditIcon />
                      Update Profile
                    </Button>
                  </DialogFooter>
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
                  <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full bg-green-500/10 text-green-600 dark:text-green-400">
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
                  className={`h-2.5 w-2.5 rounded-full ${user?.isLocked ? "bg-red-500" : "bg-green-500"}`}
                />
                <p
                  className={`text-base font-semibold ${user?.isLocked ? "text-red-500" : "text-green-600"}`}
                >
                  {user?.isLocked ? "Locked" : "Active"}
                </p>
              </div>
            </div>
          </div>
        </Card>
      )}
    </>
  );
};

export default page;
