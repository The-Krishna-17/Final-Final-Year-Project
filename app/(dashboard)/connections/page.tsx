"use client";

import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchSwapPartners } from "@/store/features/swaps/swapSlice";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";
import {
  RiUserHeartLine,
  RiSearchLine,
  RiArrowLeftRightLine,
  RiBookOpenLine,
  RiPresentationLine,
  RiMessage2Line,
  RiCalendarLine,
  RiTeamLine,
  RiCheckDoubleLine,
} from "react-icons/ri";
import Link from "next/link";
import { completeSwap } from "@/store/features/swaps/swapSlice";
import { ReviewModal } from "@/components/ReviewModal/ReviewModal";
import { toast } from "sonner";
import { SwapUser } from "@/store/features/swaps/type";

export default function ConnectionsPage() {
  const dispatch = useAppDispatch();
  const { swapPartners, loadingPartners } = useAppSelector((s) => s.swaps);
  const [query, setQuery] = useState("");

  // Review Modal State
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewPartner, setReviewPartner] = useState<SwapUser | null>(null);
  const [reviewSwapId, setReviewSwapId] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState("active");
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [confirmTarget, setConfirmTarget] = useState<{
    swapId: string;
    user: SwapUser;
  } | null>(null);

  useEffect(() => {
    dispatch(fetchSwapPartners());
  }, [dispatch]);

  const confirmComplete = (swapId: string, user: SwapUser) => {
    setConfirmTarget({ swapId, user });
    setIsConfirmOpen(true);
  };

  const handleComplete = async () => {
    if (!confirmTarget) return;
    try {
      await dispatch(completeSwap(confirmTarget.swapId)).unwrap();
      toast.success("Skill swap marked as completed!");
      setIsConfirmOpen(false);

      // Auto open review modal
      setReviewPartner(confirmTarget.user);
      setReviewSwapId(confirmTarget.swapId);
      setIsReviewModalOpen(true);
      setConfirmTarget(null);
    } catch (error: any) {
      toast.error(error || "Failed to complete skill swap");
    }
  };
  const filteredActive = swapPartners.filter((p) => {
    if (p.status === "completed") return false;
    const fullName = `${p.user.firstName} ${p.user.lastName}`.toLowerCase();
    const offered = (p.offeredSkill || "").toLowerCase();
    const wanted = (p.wantedSkill || "").toLowerCase();
    return (
      fullName.includes(query.toLowerCase()) ||
      offered.includes(query.toLowerCase()) ||
      wanted.includes(query.toLowerCase())
    );
  });

  const filteredVeterans = swapPartners.filter((p) => {
    if (p.status !== "completed") return false;
    const fullName = `${p.user.firstName} ${p.user.lastName}`.toLowerCase();
    const offered = (p.offeredSkill || "").toLowerCase();
    const wanted = (p.wantedSkill || "").toLowerCase();
    return (
      fullName.includes(query.toLowerCase()) ||
      offered.includes(query.toLowerCase()) ||
      wanted.includes(query.toLowerCase())
    );
  });

  const activeCount = swapPartners.filter(
    (p) => p.status !== "completed",
  ).length;
  const veteranCount = swapPartners.filter(
    (p) => p.status === "completed",
  ).length;

  const currentFiltered =
    activeTab === "active" ? filteredActive : filteredVeterans;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="space-y-1">
          <h1 className="font-semibold text-2xl flex items-center gap-2">
            <RiUserHeartLine className="text-primary" />
            Connections
          </h1>
          <p className="text-base text-muted-foreground">
            People you're actively swapping skills with — your learning circle.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full max-w-sm">
          <RiSearchLine className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-lg" />
          <Input
            placeholder="Search by name or skill..."
            className="pl-10 bg-background"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Summary bar */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/40 px-3 py-1.5 rounded-full border border-border">
          <RiTeamLine className="text-base text-primary" />
          <span>
            <strong className="text-foreground">{swapPartners.length}</strong>{" "}
            total connection{swapPartners.length !== 1 ? "s" : ""}
          </span>
        </div>
        {query && (
          <div className="text-sm text-muted-foreground">
            Showing{" "}
            <strong className="text-foreground">
              {currentFiltered.length}
            </strong>{" "}
            result{currentFiltered.length !== 1 ? "s" : ""} for "{query}"
          </div>
        )}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2 max-w-100">
          <TabsTrigger value="active">
            Active Connections ({activeCount})
          </TabsTrigger>
          <TabsTrigger value="veterans">Veterans ({veteranCount})</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="mt-6">
          {loadingPartners ? (
            <div className="flex flex-col items-center justify-center py-24 text-muted-foreground gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <p className="text-sm">Loading your connections...</p>
            </div>
          ) : filteredActive.length === 0 ? (
            /* Empty state */
            <div className="flex flex-col items-center justify-center py-20 text-center border rounded-xl bg-muted/10 border-dashed">
              <RiUserHeartLine className="text-5xl text-muted-foreground opacity-25 mb-4" />
              {query ? (
                <>
                  <h3 className="font-medium text-base">
                    No results for "{query}"
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1.5 max-w-xs">
                    Try searching by a different name or skill.
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-4"
                    onClick={() => setQuery("")}
                  >
                    Clear search
                  </Button>
                </>
              ) : (
                <>
                  <h3 className="font-medium text-base">
                    No active connections
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1.5 max-w-xs">
                    Accept a swap request or get one accepted to build your
                    skill network.
                  </p>
                  <Link href="/matches">
                    <Button size="sm" className="mt-4 gap-2">
                      <RiArrowLeftRightLine />
                      Explore Matches
                    </Button>
                  </Link>
                </>
              )}
            </div>
          ) : (
            /* Connection grid */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredActive.map((partner) => {
                const firstName = partner.user.firstName || "";
                const lastName = partner.user.lastName || "";
                const fullName =
                  `${firstName} ${lastName}`.trim() || "Unknown User";
                const initials =
                  `${firstName?.[0] || ""}${lastName?.[0] || ""}`.toUpperCase() ||
                  "U";

                return (
                  <Card
                    key={partner.swapId}
                    className="overflow-hidden gap-0 py-0 hover:shadow-md transition-shadow duration-200 group"
                  >
                    {/* Top banner */}
                    <div className="h-16 bg-muted" />

                    <CardContent className="px-4 pb-4 pt-0 -mt-8 space-y-4">
                      {/* Avatar */}
                      <div className="flex justify-between items-end">
                        <Avatar className="w-16 h-16 border-4 border-background shadow-md">
                          <AvatarImage
                            src={partner.user.avatar}
                            alt={fullName}
                          />
                          <AvatarFallback className="bg-secondary text-secondary-foreground text-lg font-semibold">
                            {initials}
                          </AvatarFallback>
                        </Avatar>
                        {/* Active connection badge */}
                        <Badge
                          variant="outline"
                          className="text-[10px] gap-1 border-border text-muted-foreground bg-background mb-1"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-success" />
                          Connected
                        </Badge>
                      </div>

                      {/* Name */}
                      <div>
                        <h3 className="font-semibold text-base leading-tight truncate">
                          {fullName}
                        </h3>
                        <p className="text-xs text-muted-foreground truncate mt-0.5">
                          {partner.user.email}
                        </p>
                      </div>

                      {/* Skill exchange pills */}
                      <div className="space-y-2">
                        {partner.offeredSkill && (
                          <div className="flex items-center gap-2 text-xs px-2.5 py-1.5 rounded-lg bg-muted/40 border border-border">
                            <RiPresentationLine className="text-muted-foreground shrink-0 text-sm" />
                            <span className="text-foreground truncate">
                              <span className="font-medium">Teaches:</span>{" "}
                              {partner.offeredSkill}
                            </span>
                          </div>
                        )}
                        {partner.wantedSkill && (
                          <div className="flex items-center gap-2 text-xs px-2.5 py-1.5 rounded-lg bg-muted/40 border border-border">
                            <RiBookOpenLine className="text-muted-foreground shrink-0 text-sm" />
                            <span className="text-foreground truncate">
                              <span className="font-medium">Learning:</span>{" "}
                              {partner.wantedSkill}
                            </span>
                          </div>
                        )}
                        {!partner.offeredSkill && !partner.wantedSkill && (
                          <div className="flex items-center gap-2 text-xs px-2.5 py-1.5 rounded-lg bg-muted/30 border border-dashed border-border">
                            <RiArrowLeftRightLine className="text-muted-foreground shrink-0 text-sm" />
                            <span className="text-muted-foreground">
                              Skill swap partner
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Action buttons */}
                      <div className="flex flex-col gap-2 pt-1">
                        <div className="grid grid-cols-2 gap-2">
                          <Link href="/messages">
                            <Button
                              size="sm"
                              className="w-full h-8 text-xs gap-1.5"
                            >
                              <RiMessage2Line className="text-sm" />
                              Message
                            </Button>
                          </Link>
                          <Link href="/meetings">
                            <Button
                              size="sm"
                              className="w-full h-8 text-xs gap-1.5"
                            >
                              <RiCalendarLine className="text-sm" />
                              Meet
                            </Button>
                          </Link>
                        </div>
                        {partner.status !== "completed" ? (
                          <Button
                            size="sm"
                            variant="default"
                            className="w-full h-8 text-xs gap-1.5 bg-green-600 hover:bg-green-700 text-white"
                            onClick={() =>
                              confirmComplete(partner.swapId, partner.user)
                            }
                          >
                            <RiCheckDoubleLine className="text-sm" />
                            Complete & Review
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            variant="secondary"
                            className="w-full h-8 text-xs gap-1.5"
                            onClick={() => {
                              setReviewPartner(partner.user);
                              setReviewSwapId(partner.swapId);
                              setIsReviewModalOpen(true);
                            }}
                          >
                            <RiCheckDoubleLine className="text-sm text-green-500" />
                            Leave a Review
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>

        <TabsContent value="veterans" className="mt-6">
          {loadingPartners ? (
            <div className="flex flex-col items-center justify-center py-24 text-muted-foreground gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <p className="text-sm">Loading veterans...</p>
            </div>
          ) : filteredVeterans.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center border rounded-xl bg-muted/10 border-dashed">
              <RiCheckDoubleLine className="text-5xl text-muted-foreground opacity-25 mb-4" />
              <h3 className="font-medium text-base">No veterans yet</h3>
              <p className="text-sm text-muted-foreground mt-1.5 max-w-xs">
                Complete active skill swaps to add users to your Veterans list.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredVeterans.map((partner) => {
                const firstName = partner.user.firstName || "";
                const lastName = partner.user.lastName || "";
                const fullName =
                  `${firstName} ${lastName}`.trim() || "Unknown User";
                const initials =
                  `${firstName?.[0] || ""}${lastName?.[0] || ""}`.toUpperCase() ||
                  "U";

                return (
                  <Card
                    key={partner.swapId}
                    className="overflow-hidden gap-0 py-0 hover:shadow-md transition-shadow duration-200 group"
                  >
                    <div className="h-16 bg-muted relative">
                      <div className="absolute inset-0 bg-yellow-500/10" />
                    </div>
                    <CardContent className="px-4 pb-4 pt-0 -mt-8 space-y-4">
                      <div className="flex justify-between items-end">
                        <Avatar className="w-16 h-16 border-4 border-background shadow-md">
                          <AvatarImage
                            src={partner.user.avatar}
                            alt={fullName}
                          />
                          <AvatarFallback className="bg-secondary text-secondary-foreground text-lg font-semibold">
                            {initials}
                          </AvatarFallback>
                        </Avatar>
                        <Badge
                          variant="outline"
                          className="text-[10px] gap-1 border-border text-yellow-600 bg-yellow-500/10 mb-1"
                        >
                          <RiCheckDoubleLine className="text-sm" />
                          Veteran
                        </Badge>
                      </div>

                      <div>
                        <h3 className="font-semibold text-base leading-tight truncate">
                          {fullName}
                        </h3>
                        <p className="text-xs text-muted-foreground truncate mt-0.5">
                          {partner.user.email}
                        </p>
                      </div>

                      <div className="flex flex-col gap-2 pt-1">
                        <Button
                          size="sm"
                          variant="secondary"
                          className="w-full h-8 text-xs gap-1.5"
                          onClick={() => {
                            setReviewPartner(partner.user);
                            setReviewSwapId(partner.swapId);
                            setIsReviewModalOpen(true);
                          }}
                        >
                          <RiCheckDoubleLine className="text-sm text-green-500" />
                          Leave a Review
                        </Button>
                        <Link href={`/profile/${partner.user._id}`}>
                          <Button
                            size="sm"
                            variant="outline"
                            className="w-full h-8 text-xs gap-1.5"
                          >
                            <RiUserHeartLine className="text-sm" />
                            View Profile
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Confirmation Dialog */}
      <Dialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Complete Skill Swap?</DialogTitle>
            <DialogDescription>
              Are you sure you want to mark this skill swap as completed? This
              will:
              <ul className="list-disc pl-4 mt-2 space-y-1 text-sm">
                <li>
                  Move {confirmTarget?.user?.firstName} to your Veterans list
                </li>
                <li>Permanently delete all your chat messages with them</li>
                <li>Permanently delete all meeting history with them</li>
                <li>Allow you to leave a public review for them</li>
              </ul>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2 sm:justify-end mt-4">
            <Button variant="outline" onClick={() => setIsConfirmOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="default"
              className="bg-green-600 hover:bg-green-700 text-white"
              onClick={handleComplete}
            >
              Yes, complete swap
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Review Modal */}
      <ReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        partnerUser={reviewPartner}
        swapId={reviewSwapId}
      />
    </div>
  );
}
