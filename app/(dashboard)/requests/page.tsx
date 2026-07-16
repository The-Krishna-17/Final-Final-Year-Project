"use client";

import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  fetchMySwaps,
  respondToSwap,
  cancelSwap,
} from "@/store/features/swaps/swapSlice";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { SkillSwap } from "@/store/features/swaps/type";
import {
  RiArrowLeftRightLine,
  RiCheckLine,
  RiCloseLine,
  RiTimeLine,
  RiExchangeLine,
  RiInboxLine,
  RiSendPlaneLine,
  RiErrorWarningLine,
} from "react-icons/ri";
import { Loader2, Clock, CheckCircle2, XCircle, Ban } from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";

// ─── Status Badge ─────────────────────────────────────────────────────────────

const StatusBadge = ({ status }: { status: SkillSwap["status"] }) => {
  const map = {
    pending: {
      label: "Pending",
      icon: <Clock className="w-3 h-3" />,
      className:
        "border-amber-300 text-amber-700 bg-amber-50 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800",
    },
    accepted: {
      label: "Accepted",
      icon: <CheckCircle2 className="w-3 h-3" />,
      className:
        "border-emerald-300 text-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800",
    },
    rejected: {
      label: "Rejected",
      icon: <XCircle className="w-3 h-3" />,
      className:
        "border-red-300 text-red-700 bg-red-50 dark:bg-red-950/40 dark:text-red-400 dark:border-red-800",
    },
    cancelled: {
      label: "Cancelled",
      icon: <Ban className="w-3 h-3" />,
      className:
        "border-gray-300 text-gray-600 bg-gray-50 dark:bg-gray-800/40 dark:text-gray-400 dark:border-gray-700",
    },
  };

  const { label, icon, className } = map[status];

  return (
    <Badge variant="outline" className={`text-[11px] font-medium gap-1.5 ${className}`}>
      {icon}
      {label}
    </Badge>
  );
};

// ─── Swap Card ────────────────────────────────────────────────────────────────

interface SwapCardProps {
  swap: SkillSwap;
  type: "received" | "sent";
}

const SwapCard = ({ swap, type }: SwapCardProps) => {
  const dispatch = useAppDispatch();
  const { loadingAction } = useAppSelector((s) => s.swaps);
  const [actioningId, setActioningId] = useState<string | null>(null);

  const peer = type === "received" ? swap.requester : swap.recipient;
  const firstName = peer?.firstName || "";
  const lastName = peer?.lastName || "";
  const fullName = `${firstName} ${lastName}`.trim() || "Unknown User";
  const initials =
    `${firstName?.[0] || ""}${lastName?.[0] || ""}`.toUpperCase() || "U";

  const timeAgo = swap.createdAt
    ? formatDistanceToNow(new Date(swap.createdAt), { addSuffix: true })
    : "";

  const isActioning = actioningId === swap._id && loadingAction;

  const handleAccept = async () => {
    setActioningId(swap._id);
    try {
      await dispatch(respondToSwap({ swapId: swap._id, action: "accepted" })).unwrap();
      toast.success(`Swap with ${fullName} accepted!`);
    } catch (err: any) {
      toast.error(err || "Failed to accept swap");
    } finally {
      setActioningId(null);
    }
  };

  const handleReject = async () => {
    setActioningId(swap._id);
    try {
      await dispatch(respondToSwap({ swapId: swap._id, action: "rejected" })).unwrap();
      toast.info(`Swap request from ${fullName} rejected.`);
    } catch (err: any) {
      toast.error(err || "Failed to reject swap");
    } finally {
      setActioningId(null);
    }
  };

  const handleCancel = async () => {
    setActioningId(swap._id);
    try {
      await dispatch(cancelSwap(swap._id)).unwrap();
      toast.info("Swap request cancelled.");
    } catch (err: any) {
      toast.error(err || "Failed to cancel swap");
    } finally {
      setActioningId(null);
    }
  };

  return (
    <Card className="overflow-hidden gap-0 py-0">
      {/* Accent bar by status */}
      <div
        className={`h-[3px] w-full ${
          swap.status === "pending"
            ? "bg-amber-400"
            : swap.status === "accepted"
            ? "bg-emerald-500"
            : swap.status === "rejected"
            ? "bg-red-400"
            : "bg-gray-300"
        }`}
      />

      <CardContent className="p-4 space-y-4">
        {/* Header row */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <Avatar className="w-10 h-10 shrink-0">
              <AvatarImage src={peer?.avatar} alt={fullName} />
              <AvatarFallback className="bg-blue-100 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 text-sm font-medium">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="font-semibold text-sm truncate">{fullName}</p>
              <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                <RiTimeLine className="shrink-0" />
                {timeAgo}
              </p>
            </div>
          </div>
          <StatusBadge status={swap.status} />
        </div>

        {/* Skill exchange row */}
        <div className="grid grid-cols-[1fr_auto_1fr] gap-2 items-center">
          <div className="rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900 p-2.5">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-1">
              {type === "received" ? "They offer" : "You offer"}
            </p>
            <p className="text-sm font-medium text-blue-900 dark:text-blue-200 truncate">
              {swap.requesterOffersSkill || (
                <span className="italic text-muted-foreground font-normal">Not specified</span>
              )}
            </p>
          </div>

          <div className="flex items-center justify-center">
            <div className="w-7 h-7 rounded-full border bg-background flex items-center justify-center shrink-0">
              <RiArrowLeftRightLine className="text-xs text-muted-foreground" />
            </div>
          </div>

          <div className="rounded-lg bg-violet-50 dark:bg-violet-950/30 border border-violet-100 dark:border-violet-900 p-2.5">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-violet-600 dark:text-violet-400 mb-1">
              {type === "received" ? "They want" : "You want"}
            </p>
            <p className="text-sm font-medium text-violet-900 dark:text-violet-200 truncate">
              {swap.requesterWantsSkill || (
                <span className="italic text-muted-foreground font-normal">Not specified</span>
              )}
            </p>
          </div>
        </div>

        {/* Message */}
        {swap.message && (
          <>
            <Separator />
            <div className="flex gap-2">
              <RiExchangeLine className="text-muted-foreground text-sm mt-0.5 shrink-0" />
              <p className="text-sm text-muted-foreground italic leading-relaxed">
                "{swap.message}"
              </p>
            </div>
          </>
        )}

        {/* Actions */}
        {swap.status === "pending" && (
          <>
            <Separator />
            {type === "received" ? (
              <div className="flex gap-2">
                <Button
                  size="sm"
                  className="flex-1 h-9 gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white"
                  onClick={handleAccept}
                  disabled={isActioning}
                >
                  {isActioning ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <RiCheckLine className="text-base" />
                  )}
                  Accept
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1 h-9 gap-1.5 border-red-200 text-red-600 hover:bg-red-50 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950/30"
                  onClick={handleReject}
                  disabled={isActioning}
                >
                  {isActioning ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <RiCloseLine className="text-base" />
                  )}
                  Reject
                </Button>
              </div>
            ) : (
              <Button
                size="sm"
                variant="outline"
                className="w-full h-9 gap-1.5 border-gray-200 text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800/40"
                onClick={handleCancel}
                disabled={isActioning}
              >
                {isActioning ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Ban className="w-3.5 h-3.5" />
                )}
                Cancel Request
              </Button>
            )}
          </>
        )}

        {/* Responded at */}
        {swap.respondedAt && (
          <p className="text-[11px] text-muted-foreground text-right">
            {swap.status === "accepted" ? "Accepted" : "Responded"}{" "}
            {format(new Date(swap.respondedAt), "MMM d, yyyy · h:mm a")}
          </p>
        )}
      </CardContent>
    </Card>
  );
};

// ─── Empty State ──────────────────────────────────────────────────────────────

const EmptyState = ({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) => (
  <div className="flex flex-col items-center justify-center p-16 text-center border rounded-xl bg-muted/10 border-dashed mt-2">
    <div className="text-4xl text-muted-foreground opacity-30 mb-4">{icon}</div>
    <h3 className="font-medium text-base">{title}</h3>
    <p className="text-sm text-muted-foreground mt-1.5 max-w-xs">{description}</p>
  </div>
);

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function RequestsPage() {
  const dispatch = useAppDispatch();
  const { swaps, loadingSwaps } = useAppSelector((s) => s.swaps);
  const { user } = useAppSelector((s) => s.auth);

  useEffect(() => {
    dispatch(fetchMySwaps());
  }, [dispatch]);

  const myId = user?._id;

  const received = swaps.filter(
    (s) => s.recipient?._id === myId || s.recipient === (myId as any)
  );
  const sent = swaps.filter(
    (s) => s.requester?._id === myId || s.requester === (myId as any)
  );

  const pendingReceivedCount = received.filter((s) => s.status === "pending").length;
  const pendingSentCount = sent.filter((s) => s.status === "pending").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="font-semibold text-2xl">Swap Requests</h1>
        <p className="text-base text-muted-foreground">
          Manage all your incoming and outgoing skill swap requests.
        </p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          {
            label: "Received",
            value: received.length,
            sub: `${pendingReceivedCount} pending`,
            color: "text-blue-600 dark:text-blue-400",
            bg: "bg-blue-50 dark:bg-blue-950/30",
          },
          {
            label: "Sent",
            value: sent.length,
            sub: `${pendingSentCount} pending`,
            color: "text-violet-600 dark:text-violet-400",
            bg: "bg-violet-50 dark:bg-violet-950/30",
          },
          {
            label: "Accepted",
            value: swaps.filter((s) => s.status === "accepted").length,
            sub: "active swaps",
            color: "text-emerald-600 dark:text-emerald-400",
            bg: "bg-emerald-50 dark:bg-emerald-950/30",
          },
          {
            label: "Rejected",
            value: swaps.filter((s) => s.status === "rejected").length,
            sub: "declined",
            color: "text-red-600 dark:text-red-400",
            bg: "bg-red-50 dark:bg-red-950/30",
          },
        ].map(({ label, value, sub, color, bg }) => (
          <Card key={label} className={`${bg} border-0 py-0 gap-0`}>
            <CardContent className="p-4">
              <p className={`text-2xl font-bold ${color}`}>{value}</p>
              <p className="text-sm font-medium mt-0.5">{label}</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">{sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Loading */}
      {loadingSwaps ? (
        <div className="flex items-center justify-center py-20">
          <div className="flex flex-col items-center gap-3 text-muted-foreground">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <p className="text-sm">Loading swap requests...</p>
          </div>
        </div>
      ) : (
        <Tabs defaultValue="received">
          <TabsList variant="line" className="flex items-center gap-4">
            <TabsTrigger value="received" className="cursor-pointer gap-2">
              <RiInboxLine className="text-base" />
              Received
              {pendingReceivedCount > 0 && (
                <span className="ml-1 inline-flex items-center justify-center w-5 h-5 text-[10px] font-bold rounded-full bg-primary text-primary-foreground">
                  {pendingReceivedCount}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="sent" className="cursor-pointer gap-2">
              <RiSendPlaneLine className="text-base" />
              Sent
              {pendingSentCount > 0 && (
                <span className="ml-1 inline-flex items-center justify-center w-5 h-5 text-[10px] font-bold rounded-full bg-primary text-primary-foreground">
                  {pendingSentCount}
                </span>
              )}
            </TabsTrigger>
          </TabsList>

          {/* Received Tab */}
          <TabsContent value="received" className="mt-6">
            {received.length === 0 ? (
              <EmptyState
                icon={<RiInboxLine />}
                title="No requests received yet"
                description="When someone sends you a swap request, it will appear here."
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {received.map((swap) => (
                  <SwapCard key={swap._id} swap={swap} type="received" />
                ))}
              </div>
            )}
          </TabsContent>

          {/* Sent Tab */}
          <TabsContent value="sent" className="mt-6">
            {sent.length === 0 ? (
              <EmptyState
                icon={<RiSendPlaneLine />}
                title="No requests sent yet"
                description="Head over to Matches and send your first swap request to someone!"
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {sent.map((swap) => (
                  <SwapCard key={swap._id} swap={swap} type="sent" />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
