"use client";

import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  fetchMySwaps,
  respondToSwap,
  cancelSwap,
} from "@/store/features/swaps/swapSlice";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge, badgeVariants } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
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
} from "react-icons/ri";
import {
  Loader2,
  Clock,
  CheckCircle2,
  XCircle,
  Ban,
  Quote,
  Check,
  ArrowLeftRight,
  X,
} from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";

// ─── Status Badge ─────────────────────────────────────────────────────────────

const statusMeta = {
  pending: { label: "Pending", dot: "bg-warning" },
  accepted: { label: "Accepted", dot: "bg-success" },
  rejected: { label: "Rejected", dot: "bg-danger" },
  cancelled: { label: "Cancelled", dot: "bg-muted-foreground" },
  completed: { label: "Completed", dot: "bg-success" },
};

const StatusBadge = ({ status }: { status: SkillSwap["status"] }) => {
  const { label, dot } = statusMeta[status];

  return (
    <Badge
      variant="outline"
      className="text-[11px] font-medium gap-1.5 text-muted-foreground border-border bg-transparent"
    >
      <span className={`h-1.5 w-1.5 rounded-full ${dot}`} />
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
      await dispatch(
        respondToSwap({ swapId: swap._id, action: "accepted" }),
      ).unwrap();
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
      await dispatch(
        respondToSwap({ swapId: swap._id, action: "rejected" }),
      ).unwrap();
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
    <Card className="w-full max-w-md rounded-xl hover:shadow-sm bg-card text-card-foreground overflow-hidden p-0">
      {/* Ticket header strip */}
      <CardHeader className="flex items-center justify-between px-4 py-2 border-b border-border bg-muted">
        <span className="text-xs font-semibold text-muted-foreground tracking-[0.15em]">
          Trade Ticket
        </span>
        <span
          className={`shrink-0 -rotate-2 rounded-lg border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] ${
            swap.status === "accepted"
              ? "text-primary-foreground bg-primary border-primary"
              : swap.status === "rejected"
                ? "text-destructive-foreground bg-destructive border-destructive"
                : swap.status === "cancelled"
                  ? "text-muted-foreground bg-muted border-border"
                  : "text-secondary-foreground bg-secondary border-secondary"
          }`}
        >
          {swap.status === "accepted"
            ? "Accepted"
            : swap.status === "rejected"
              ? "Declined"
              : swap.status === "cancelled"
                ? "Cancelled"
                : "Pending"}
        </span>
      </CardHeader>

      <CardContent className="py-4 space-y-4">
        {/* Header row */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 shrink-0 rounded-full border-2 border-primary flex items-center justify-center overflow-hidden bg-muted">
            {peer?.avatar ? (
              <img
                src={peer.avatar}
                alt={fullName}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-base font-semibold text-primary">
                {initials}
              </span>
            )}
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-sm truncate">{fullName}</p>
            <p className="text-xs flex items-center gap-1 mt-0.5 text-muted-foreground">
              <Clock className="w-3 h-3 shrink-0" />
              {timeAgo}
            </p>
          </div>
        </div>

        {/* Skill exchange row — ledger style with dashed connector */}
        <div className="relative grid grid-cols-[1fr_auto_1fr] gap-2 items-stretch">
          <div className="rounded-lg border border-border bg-background p-2.5">
            <p className="text-xs font-semibold uppercase mb-1 text-primary">
              {type === "received" ? "They offer" : "You offer"}
            </p>
            <p className="text-sm font-semibold truncate">
              {swap.requesterOffersSkill || (
                <span className="text-sm font-semibold truncate">
                  Not specified
                </span>
              )}
            </p>
          </div>

          <div className="flex items-center justify-center relative">
            <div
              className="absolute w-full border-t border-dashed border-border"
              style={{ top: "50%" }}
            />
            <div className="relative w-7 h-7 rounded-full bg-primary flex items-center justify-center shrink-0">
              <ArrowLeftRight className="w-3.5 h-3.5 text-primary-foreground" />
            </div>
          </div>

          <div className="rounded-lg border border-border bg-background p-2.5">
            <p className="text-xs font-bold uppercase mb-1 text-secondary-foreground font-mono">
              {type === "received" ? "They want" : "You want"}
            </p>
            <p className="text-sm font-semibold truncate">
              {swap.requesterWantsSkill || (
                <span className="italic font-normal text-muted-foreground">
                  Not specified
                </span>
              )}
            </p>
          </div>
        </div>

        {/* Message */}
        {swap.message && (
          <div className="flex gap-2 pt-3 border-t border-dashed border-border">
            <Quote className="w-3.5 h-3.5 mt-0.5 shrink-0 text-primary" />
            <p className="text-sm text-muted-foreground leading-relaxed">
              {swap.message}
            </p>
          </div>
        )}

        {/* Actions */}
        {swap.status === "pending" && (
          <div className="pt-3 flex gap-2 border-t border-dashed border-border">
            {type === "received" ? (
              <>
                <button
                  className="flex-1 h-9 rounded-lg text-sm font-semibold flex items-center justify-center gap-1.5 bg-primary text-primary-foreground transition-opacity disabled:opacity-60 cursor-pointer"
                  onClick={handleAccept}
                  disabled={isActioning}
                >
                  {isActioning ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Check className="w-4 h-4" />
                  )}
                  Accept
                </button>
                <button
                  className="flex-1 h-9 rounded-lg text-sm font-semibold flex items-center justify-center gap-1.5 border border-border text-muted-foreground transition-opacity disabled:opacity-60 cursor-pointer"
                  onClick={handleReject}
                  disabled={isActioning}
                >
                  {isActioning ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <X className="w-4 h-4" />
                  )}
                  Reject
                </button>
              </>
            ) : (
              <button
                className="w-full h-9 rounded-lg text-sm font-semibold flex items-center justify-center gap-1.5 border border-border text-muted-foreground transition-opacity disabled:opacity-60 cursor-pointer"
                onClick={handleCancel}
                disabled={isActioning}
              >
                {isActioning ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Ban className="w-3.5 h-3.5" />
                )}
                Cancel Request
              </button>
            )}
          </div>
        )}

        {/* Responded at */}
        {swap.respondedAt && (
          <p className="text-[11px] text-right pt-1 text-muted-foreground tracking-[0.15em]">
            {swap.status === "accepted" ? "Accepted" : "Responded"} ·{" "}
            {format(new Date(swap.respondedAt), "MMM d, yyyy · h:mm a")}
          </p>
        )}
      </CardContent>
    </Card>
  );
};

// ─── Empty State ──────────────────────────────────────────────────────────────

const EmptyState = ({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) => (
  <div className="flex flex-col items-center justify-center p-16 text-center border rounded-xl bg-muted/10 border-dashed mt-2">
    <div className="text-4xl text-muted-foreground opacity-30 mb-4">{icon}</div>
    <h3 className="font-medium text-base">{title}</h3>
    <p className="text-sm text-muted-foreground mt-1.5 max-w-xs">
      {description}
    </p>
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
    (s) => s.recipient?._id === myId || s.recipient === (myId as any),
  );
  const sent = swaps.filter(
    (s) => s.requester?._id === myId || s.requester === (myId as any),
  );

  const pendingReceivedCount = received.filter(
    (s) => s.status === "pending",
  ).length;
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Received",
            value: received.length,
            sub: `${pendingReceivedCount} pending`,
            icon: RiInboxLine,
            color: "text-primary-foreground",
            bg: "bg-primary",
            gradient: "bg-primary/5",
          },
          {
            label: "Sent",
            value: sent.length,
            sub: `${pendingSentCount} pending`,
            icon: RiSendPlaneLine,
            color: "text-primary-foreground",
            bg: "bg-primary",
            gradient: "bg-primary/5",
          },
          {
            label: "Accepted",
            value: swaps.filter((s) => s.status === "accepted").length,
            sub: "active swaps",
            icon: RiCheckLine,
            color: "text-primary-foreground",
            bg: "bg-primary",
            gradient: "bg-primary/5",
          },
          {
            label: "Rejected",
            value: swaps.filter((s) => s.status === "rejected").length,
            sub: "declined",
            icon: RiCloseLine,
            color: "text-destructive-foreground",
            bg: "bg-destructive",
            gradient: "bg-destructive/5",
          },
        ].map((stat) => (
          <Card
            key={stat.label}
            className={`border-0 hover:shadow-xs transition-shadow bg-linear-to-r ${stat.gradient}`}
          >
            <CardContent className="p-4 flex items-center gap-4">
              <div className={`p-3 rounded-xl shrink-0 ${stat.bg}`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div className="min-w-0">
                <p className="text-2xl font-bold truncate">{stat.value}</p>
                <p className="text-xs font-medium text-muted-foreground truncate">
                  {stat.label}{" "}
                  <span className="font-normal opacity-70">· {stat.sub}</span>
                </p>
              </div>
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
