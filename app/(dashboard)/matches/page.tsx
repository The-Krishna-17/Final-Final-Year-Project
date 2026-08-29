"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  fetchMutualMatches,
  fetchRecommendedMatches,
  searchMatches,
  filterMatches,
} from "@/store/features/matches/matchSlice";
import { requestSwap } from "@/store/features/swaps/swapSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import React, { useEffect, useState, useRef } from "react";
import { CiSearch } from "react-icons/ci";
import {
  RiAppsLine,
  RiArrowRightLine,
  RiArrowUpDownLine,
  RiBookOpenLine,
  RiCheckboxCircleLine,
  RiCoinLine,
  RiExchangeLine,
  RiHeartLine,
  RiPresentationLine,
  RiShieldStarLine,
  RiUserLine,
  RiEqualizerLine,
} from "react-icons/ri";
import { X, Loader2, ArrowLeftRight, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

// ─── HELPER FUNCTIONS FOR AI SKILL ABSTRACTION ───────────────────────────────

const getSkillDisplayName = (skillItem: any) => {
  if (!skillItem) return "";
  if (typeof skillItem === "string") return skillItem;
  return (
    skillItem.ai?.primarySkill ||
    skillItem.rawInput ||
    skillItem.name ||
    "Skill"
  );
};

const getSkillDomain = (skillItem: any) => {
  if (!skillItem || typeof skillItem === "string") return "General";
  return skillItem.ai?.domain || skillItem.domain || "General";
};

const getSkillCategory = (skillItem: any) => {
  if (!skillItem || typeof skillItem === "string") return "";
  return skillItem.ai?.category || skillItem.category || "";
};

const getSkillLevel = (skillItem: any) => {
  if (!skillItem || typeof skillItem === "string") return null;
  return skillItem.currentLevel || skillItem.difficulty || null;
};

const getSkillTopics = (skillItem: any): string[] => {
  if (!skillItem || typeof skillItem === "string") return [];
  const topics = skillItem.ai?.topics || [];
  const techs = skillItem.ai?.technologies || [];
  const keywords = skillItem.ai?.keywords || [];
  const combined = Array.from(new Set([...topics, ...techs, ...keywords]));
  return combined.filter(Boolean).slice(0, 3);
};

const getSessionMode = (skillItem: any) => {
  if (!skillItem || typeof skillItem === "string") return null;
  return skillItem.preferredSessionMode || null;
};

const getLearningStyle = (skillItem: any) => {
  if (!skillItem || typeof skillItem === "string") return null;
  return skillItem.preferredLearningStyle || null;
};

// ─── Swap Request Modal ───────────────────────────────────────────────────────

interface SwapModalProps {
  match: any;
  onClose: () => void;
}

const SwapRequestModal = ({ match, onClose }: SwapModalProps) => {
  const dispatch = useAppDispatch();
  const { loadingAction } = useAppSelector((state) => state.swaps);

  const firstName = match.userProfile?.user?.firstName || "";
  const lastName = match.userProfile?.user?.lastName || "";
  const fullName = `${firstName} ${lastName}`.trim() || "Unknown User";
  const initials =
    `${firstName?.[0] || ""}${lastName?.[0] || ""}`.toUpperCase() || "U";

  const learnSkillObj = match.matchDetails?.aWantsB?.offerSkill;
  const teachSkillObj = match.matchDetails?.bWantsA?.offerSkill;

  const learnSkillName = getSkillDisplayName(learnSkillObj);
  const teachSkillName = getSkillDisplayName(teachSkillObj);

  const [offersSkill, setOffersSkill] = useState(teachSkillName || "");
  const [wantsSkill, setWantsSkill] = useState(learnSkillName || "");
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSend = async () => {
    try {
      await dispatch(
        requestSwap({
          recipientId: match.userProfile.user._id,
          requesterOffersSkill: offersSkill || undefined,
          requesterWantsSkill: wantsSkill || undefined,
          message: message || undefined,
        }),
      ).unwrap();
      setSuccess(true);
      toast.success(`Swap request sent to ${fullName}!`);
      setTimeout(onClose, 1500);
    } catch (err: any) {
      toast.error(err || "Failed to send swap request");
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md px-4 animate-in fade-in duration-200"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-background rounded-2xl shadow-2xl w-full max-w-md border border-border/80 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-border bg-muted/20">
          <div className="flex items-center gap-3">
            <Avatar className="w-10 h-10 ring-2 ring-primary/20">
              <AvatarImage
                src={match.userProfile?.user?.avatar}
                alt={fullName}
              />
              <AvatarFallback className="bg-primary/10 text-primary text-sm font-semibold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold text-sm text-foreground">
                {fullName}
              </p>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <RiExchangeLine className="text-primary text-xs" /> Request
                Skill Exchange
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded-lg hover:bg-muted"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {success ? (
          <div className="flex flex-col items-center justify-center py-12 px-6 gap-3 text-center">
            <div className="w-14 h-14 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center animate-bounce">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <p className="font-bold text-lg text-foreground">
              Exchange Request Sent!
            </p>
            <p className="text-sm text-muted-foreground max-w-xs">
              {fullName} will be notified of your skill swap proposal.
            </p>
          </div>
        ) : (
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block">
                  You Offer
                </label>
                <Input
                  placeholder="e.g. React.js"
                  value={offersSkill}
                  onChange={(e) => setOffersSkill(e.target.value)}
                  className="text-sm rounded-xl bg-muted/30 border-border"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block">
                  You Want to Learn
                </label>
                <Input
                  placeholder="e.g. Python"
                  value={wantsSkill}
                  onChange={(e) => setWantsSkill(e.target.value)}
                  className="text-sm rounded-xl bg-muted/30 border-border"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block">
                Personal Message{" "}
                <span className="normal-case font-normal text-muted-foreground/70">
                  (optional)
                </span>
              </label>
              <textarea
                className="w-full text-sm px-3.5 py-2.5 border border-border rounded-xl bg-muted/30 resize-none focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
                rows={3}
                placeholder={`Hi ${firstName}, I saw your skill profile and would love to exchange skills!`}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                maxLength={500}
              />
              <p className="text-[10px] text-muted-foreground text-right">
                {message.length}/500
              </p>
            </div>

            <div className="flex gap-3 pt-2">
              <Button
                variant="outline"
                onClick={onClose}
                className="flex-1 rounded-xl"
                disabled={loadingAction}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSend}
                className="flex-1 gap-2 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 shadow-md shadow-primary/20"
                disabled={loadingAction}
              >
                {loadingAction ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <ArrowLeftRight className="w-4 h-4" />
                )}
                Send Proposal
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// ─── IMPROVISED RECOMMENDATION MATCH CARD (CLEAN & MINIMALIST) ───────────────

const MatchCard = ({ m }: { m: any }) => {
  const isMutual = m.matchDetails?.isMutual;
  const learnSkillObj = m.matchDetails?.aWantsB?.offerSkill;
  const teachSkillObj = m.matchDetails?.bWantsA?.offerSkill;

  const learnScore = m.matchDetails?.aWantsB?.score ?? 0;
  const teachScore = m.matchDetails?.bWantsA?.score ?? 0;
  const matchPercent =
    m.matchPercent ?? Math.round(((m.totalScore || 0) / 200) * 100);

  const firstName = m.userProfile?.user?.firstName || "";
  const lastName = m.userProfile?.user?.lastName || "";
  const fullName = `${firstName} ${lastName}`.trim() || "Unknown User";
  const initials =
    `${firstName?.[0] || ""}${lastName?.[0] || ""}`.toUpperCase() || "U";

  const [showSwapModal, setShowSwapModal] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  // Extracted skill fields
  const learnName = getSkillDisplayName(learnSkillObj);
  const learnDomain = getSkillDomain(learnSkillObj);
  const learnCategory = getSkillCategory(learnSkillObj);
  const learnLevel = getSkillLevel(learnSkillObj);
  const learnTopics = getSkillTopics(learnSkillObj);
  const learnMode = getSessionMode(learnSkillObj);

  const teachName = getSkillDisplayName(teachSkillObj);
  const teachDomain = getSkillDomain(teachSkillObj);
  const teachCategory = getSkillCategory(teachSkillObj);
  const teachLevel = getSkillLevel(teachSkillObj);
  const teachTopics = getSkillTopics(teachSkillObj);
  const teachMode = getSessionMode(teachSkillObj);

  // Breakdown detail metrics
  const aBreakdown = m.matchDetails?.aWantsB?.breakdown || {};
  const bBreakdown = m.matchDetails?.bWantsA?.breakdown || {};
  const hasDirectMatch =
    (aBreakdown.directMatch || 0) > 0 || (bBreakdown.directMatch || 0) > 0;
  const hasTokenMatch =
    (aBreakdown.tokenSimilarity || 0) > 0 ||
    (bBreakdown.tokenSimilarity || 0) > 0;
  const hasDomainMatch =
    (aBreakdown.domainSimilarity || 0) > 0 ||
    (bBreakdown.domainSimilarity || 0) > 0;
  const hasLevelBonus =
    (aBreakdown.levelBonus || 0) > 0 || (bBreakdown.levelBonus || 0) > 0;

  return (
    <>
      {showSwapModal && (
        <SwapRequestModal match={m} onClose={() => setShowSwapModal(false)} />
      )}

      <Card className="group relative flex flex-col justify-between overflow-hidden border border-border/80 bg-card hover:border-border transition-all duration-200 rounded-3xl gap-0 py-0 shadow-2xs hover:shadow-md">
        {/* HEADER SECTION */}
        <CardHeader className="flex flex-row items-center justify-between gap-3 px-5 pt-4 pb-3 space-y-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="relative shrink-0">
              <Avatar className="w-11 h-11 border border-border">
                <AvatarImage src={m.userProfile?.user?.avatar} alt={fullName} />
                <AvatarFallback className="bg-muted text-muted-foreground font-semibold text-xs">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <span
                className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-background ${
                  isMutual ? "bg-emerald-500" : "bg-muted-foreground/40"
                }`}
                title={
                  isMutual ? "Mutual Skill Swap" : "One-Way Recommendation"
                }
              />
            </div>
            <div className="min-w-0">
              <h3 className="font-semibold text-sm text-foreground truncate leading-tight group-hover:text-primary transition-colors">
                {fullName}
              </h3>
              <p className="text-xs text-muted-foreground truncate mt-0.5">
                {m.userProfile?.user?.currentWork?.role ||
                  m.userProfile?.user?.role ||
                  "Skill Peer"}
                {m.userProfile?.user?.currentWork?.company
                  ? ` · ${m.userProfile.user.currentWork.company}`
                  : ""}
              </p>
            </div>
          </div>

          {/* MATCH SCORE & TYPE */}
          <div className="flex flex-col items-end shrink-0 gap-1">
            <div className="flex items-baseline gap-0.5">
              <span className="text-2xl font-bold leading-none text-foreground">
                {matchPercent}%
              </span>
              <span className="text-[10px] text-muted-foreground uppercase font-medium">
                Match
              </span>
            </div>
            <Badge
              variant="outline"
              className="text-[10px] font-medium gap-1 border-border text-muted-foreground bg-muted/30 px-2 py-0.5 rounded-md"
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  isMutual ? "bg-emerald-500" : "bg-muted-foreground/60"
                }`}
              />
              {isMutual ? "Mutual" : "One-way"}
            </Badge>
          </div>
        </CardHeader>

        <Separator className="opacity-50" />

        {/* SKILLS EXCHANGE CONTAINER */}
        <CardContent className="px-5 py-4 flex flex-col gap-3 flex-1">
          {/* YOU LEARN SECTION */}
          {learnName ? (
            <div className="flex flex-col gap-1.5 p-3 rounded-xl border border-border/60 bg-muted/20 hover:bg-muted/40 transition-colors">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-6 h-6 rounded-md bg-muted text-muted-foreground flex items-center justify-center shrink-0">
                    <RiBookOpenLine className="text-xs" />
                  </div>
                  <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                    You Learn
                  </span>
                </div>
                {learnScore > 0 && (
                  <span className="text-[10px] font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded-md shrink-0">
                    +{learnScore} pts
                  </span>
                )}
              </div>

              <div>
                <h4 className="font-medium text-sm text-foreground truncate">
                  {learnName}
                </h4>
                <p className="text-xs text-muted-foreground truncate">
                  {learnDomain} {learnCategory ? `· ${learnCategory}` : ""}
                </p>
              </div>

              {/* LEVEL & TOPIC TAGS */}
              <div className="flex flex-wrap items-center gap-1 pt-0.5">
                {learnLevel && (
                  <Badge
                    variant="outline"
                    className="text-[10px] font-normal text-muted-foreground border-border px-1.5 py-0"
                  >
                    {learnLevel}
                  </Badge>
                )}
                {learnMode && (
                  <Badge
                    variant="outline"
                    className="text-[10px] font-normal text-muted-foreground border-border px-1.5 py-0"
                  >
                    {learnMode}
                  </Badge>
                )}
                {learnTopics.map((topic, i) => (
                  <span
                    key={i}
                    className="text-[10px] text-muted-foreground/80 bg-background border border-border/50 px-1.5 py-0.5 rounded-md"
                  >
                    #{topic}
                  </span>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2.5 p-3 rounded-xl border border-dashed border-border/60 bg-muted/10 opacity-60">
              <div className="w-6 h-6 rounded-md bg-muted text-muted-foreground flex items-center justify-center shrink-0">
                <RiBookOpenLine className="text-xs" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                  You Learn
                </p>
                <p className="text-xs italic text-muted-foreground truncate">
                  No matching skill
                </p>
              </div>
            </div>
          )}

          {/* DIVIDER WITH SWAP ICON */}
          <div className="flex items-center justify-center gap-3 my-0.5">
            <div className="h-px flex-1 bg-border/60" />
            <div className="w-6 h-6 rounded-full border border-border bg-background flex items-center justify-center text-muted-foreground text-xs">
              <RiArrowUpDownLine className="text-xs" />
            </div>
            <div className="h-px flex-1 bg-border/60" />
          </div>

          {/* YOU TEACH SECTION */}
          {teachName ? (
            <div className="flex flex-col gap-1.5 p-3 rounded-xl border border-border/60 bg-muted/20 hover:bg-muted/40 transition-colors">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-6 h-6 rounded-md bg-muted text-muted-foreground flex items-center justify-center shrink-0">
                    <RiPresentationLine className="text-xs" />
                  </div>
                  <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                    You Teach
                  </span>
                </div>
                {teachScore > 0 && (
                  <span className="text-[10px] font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded-md shrink-0">
                    +{teachScore} pts
                  </span>
                )}
              </div>

              <div>
                <h4 className="font-medium text-sm text-foreground truncate">
                  {teachName}
                </h4>
                <p className="text-xs text-muted-foreground truncate">
                  {teachDomain} {teachCategory ? `· ${teachCategory}` : ""}
                </p>
              </div>

              {/* LEVEL & TOPIC TAGS */}
              <div className="flex flex-wrap items-center gap-1 pt-0.5">
                {teachLevel && (
                  <Badge
                    variant="outline"
                    className="text-[10px] font-normal text-muted-foreground border-border px-1.5 py-0"
                  >
                    {teachLevel}
                  </Badge>
                )}
                {teachMode && (
                  <Badge
                    variant="outline"
                    className="text-[10px] font-normal text-muted-foreground border-border px-1.5 py-0"
                  >
                    {teachMode}
                  </Badge>
                )}
                {teachTopics.map((topic, i) => (
                  <span
                    key={i}
                    className="text-[10px] text-muted-foreground/80 bg-background border border-border/50 px-1.5 py-0.5 rounded-md"
                  >
                    #{topic}
                  </span>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2.5 p-3 rounded-xl border border-dashed border-border/60 bg-muted/10 opacity-60">
              <div className="w-6 h-6 rounded-md bg-muted text-muted-foreground flex items-center justify-center shrink-0">
                <RiPresentationLine className="text-xs" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                  You Teach
                </p>
                <p className="text-xs italic text-muted-foreground truncate">
                  Open to swap request
                </p>
              </div>
            </div>
          )}

          {/* CLEAN MATCH SIGNALS */}
          <div className="flex flex-wrap gap-1 pt-1">
            {hasDirectMatch && (
              <Badge
                variant="secondary"
                className="text-[10px] font-normal text-muted-foreground gap-1 border border-border/40"
              >
                <RiCheckboxCircleLine className="text-xs" /> Direct Match
              </Badge>
            )}
            {hasTokenMatch && (
              <Badge
                variant="secondary"
                className="text-[10px] font-normal text-muted-foreground gap-1 border border-border/40"
              >
                <RiCoinLine className="text-xs" /> Token Match
              </Badge>
            )}
            {hasDomainMatch && (
              <Badge
                variant="secondary"
                className="text-[10px] font-normal text-muted-foreground gap-1 border border-border/40"
              >
                <RiAppsLine className="text-xs" /> Domain Match
              </Badge>
            )}
            {hasLevelBonus && (
              <Badge
                variant="secondary"
                className="text-[10px] font-normal text-muted-foreground gap-1 border border-border/40"
              >
                <RiCheckboxCircleLine className="text-xs" /> Level Match
              </Badge>
            )}
          </div>

          {/* TOGGLE EXPANDABLE AI INSIGHT DETAILS */}
          <div className="pt-0.5">
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="text-[11px] font-medium text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
            >
              <span>
                {showDetails ? "Hide Match Details" : "View Score Details"}
              </span>
              <RiArrowRightLine
                className={`text-xs transition-transform duration-200 ${showDetails ? "rotate-90" : ""}`}
              />
            </button>

            {showDetails && (
              <div className="mt-2 p-3 rounded-lg bg-muted/30 border border-border/50 text-xs space-y-1 text-muted-foreground animate-in slide-in-from-top-1 duration-150">
                <div className="flex justify-between items-center">
                  <span>Direct Skill Match:</span>
                  <span className="font-medium text-foreground">
                    +
                    {Math.max(
                      aBreakdown.directMatch || 0,
                      bBreakdown.directMatch || 0,
                    )}{" "}
                    pts
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Token Similarity:</span>
                  <span className="font-medium text-foreground">
                    +
                    {Math.max(
                      aBreakdown.tokenSimilarity || 0,
                      bBreakdown.tokenSimilarity || 0,
                    )}{" "}
                    pts
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Domain Similarity:</span>
                  <span className="font-medium text-foreground">
                    +
                    {Math.max(
                      aBreakdown.domainSimilarity || 0,
                      bBreakdown.domainSimilarity || 0,
                    )}{" "}
                    pts
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Level Synergy:</span>
                  <span className="font-medium text-foreground">
                    +
                    {Math.max(
                      aBreakdown.levelBonus || 0,
                      bBreakdown.levelBonus || 0,
                    )}{" "}
                    pts
                  </span>
                </div>
              </div>
            )}
          </div>
        </CardContent>

        <Separator className="opacity-50" />

        {/* FOOTER SECTION */}
        <CardFooter className="px-5 py-3 flex items-center justify-between gap-3 bg-muted/10">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            {m.userProfile?.reputationScore > 0 ? (
              <>
                <RiShieldStarLine className="text-sm text-amber-500" />
                <span className="text-foreground font-medium">
                  {m.userProfile.reputationScore.toFixed(1)}
                </span>
                <span>/ 5 Rating</span>
              </>
            ) : (
              <>
                <RiShieldStarLine className="text-sm opacity-50" />
                <span>Verified Peer</span>
              </>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Link href={`/profile/${m.userProfile?.user?._id}`}>
              <Button
                variant="outline"
                size="sm"
                className="h-8 text-xs gap-1.5 rounded-lg"
              >
                <RiUserLine className="text-xs" />
                Profile
              </Button>
            </Link>
            <Button
              size="sm"
              className="h-8 text-xs gap-1.5 rounded-lg"
              onClick={() => setShowSwapModal(true)}
            >
              <RiExchangeLine className="text-xs" />
              Request Swap
            </Button>
          </div>
        </CardFooter>
      </Card>
    </>
  );
};

const page = () => {
  const dispatch = useAppDispatch();
  const {
    recommendedMatches,
    mutualMatches,
    searchResults,
    loadingSearch,
    filteredMatches,
    loadingFilter,
  } = useAppSelector((state) => state.matches);

  const [searchQuery, setSearchQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [activeTab, setActiveTab] = useState("recommended");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<{
    difficulty: string;
    sortByScore: "asc" | "desc";
  }>({
    difficulty: "",
    sortByScore: "desc",
  });

  const handleApplyFilters = () => {
    // Only send the difficulty level if it exists
    const params = filters.difficulty ? { difficulty: filters.difficulty } : {};
    dispatch(filterMatches(params));
    setActiveTab("filtered");
  };

  const handleClearFilters = () => {
    setFilters({ difficulty: "", sortByScore: "desc" });
    dispatch(filterMatches({}));
    setActiveTab("recommended");
  };

  useEffect(() => {
    dispatch(fetchRecommendedMatches({}));
    dispatch(fetchMutualMatches({}));
  }, [dispatch]);

  // Debounced Search
  useEffect(() => {
    const handler = setTimeout(() => {
      if (searchQuery.trim()) {
        dispatch(searchMatches({ query: searchQuery }));
      }
    }, 500);
    return () => clearTimeout(handler);
  }, [searchQuery, dispatch]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="space-y-6">
      {/* Top Bar */}
      <div className="flex items-start justify-between">
        <div className="space-y-1 flex-1 max-w-xl">
          <h1 className="font-semibold text-2xl">Matches</h1>
          <h2 className="text-base text-muted-foreground">
            Find your perfect skill match and connect with peers who can teach
            what you want to learn.
          </h2>
        </div>
        <div className="flex gap-2 w-full max-w-xl">
          <div className="relative w-full" ref={dropdownRef}>
            <CiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-lg" />
            <Input
              type="text"
              placeholder="Search for skills..."
              className="pl-10 bg-background w-full"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowDropdown(true);
              }}
              onFocus={() => setShowDropdown(true)}
            />

            {/* Search Results Dropdown */}
            {showDropdown && searchQuery.trim().length > 0 && (
              <div
                className="absolute top-full right-0 mt-2 w-200 max-w-[calc(100vw-2rem)] z-50 bg-background border border-border rounded-xl shadow-2xl max-h-[75vh] overflow-y-auto flex flex-col"
                style={{ msOverflowStyle: "none", scrollbarWidth: "none" }}
              >
                <div className="p-4 border-b border-border sticky top-0 bg-background/95 backdrop-blur z-10 flex justify-between items-center">
                  <h3 className="font-medium">
                    Search Results for{" "}
                    <span className="text-foreground">"{searchQuery}"</span>
                  </h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowDropdown(false)}
                    className="h-8 px-2 text-xs"
                  >
                    Close
                  </Button>
                </div>
                <div className="p-4">
                  {loadingSearch ? (
                    <div className="py-12 flex flex-col items-center justify-center text-muted-foreground gap-3">
                      <Loader2 className="w-6 h-6 animate-spin text-foreground" />
                      <p className="text-sm">Searching matches...</p>
                    </div>
                  ) : searchResults?.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {searchResults.map((m) => (
                        <MatchCard key={m.profileId} m={m} />
                      ))}
                    </div>
                  ) : (
                    <div className="py-12 flex flex-col items-center justify-center text-muted-foreground gap-2">
                      <RiUserLine className="text-4xl opacity-20" />
                      <p className="text-sm">
                        No matches found for "{searchQuery}".
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant={filters.difficulty ? "secondary" : "outline"}
                className="shrink-0"
              >
                <RiEqualizerLine className="mr-2 text-lg" />
                Filter
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Filter by Difficulty</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuRadioGroup
                value={filters.difficulty || "all"}
                onValueChange={(val) => {
                  const diff = val === "all" ? "" : val;
                  const newFilters = { ...filters, difficulty: diff };
                  setFilters(newFilters);
                  const params: any = {};
                  if (newFilters.difficulty)
                    params.difficulty = newFilters.difficulty;
                  if (newFilters.sortByScore)
                    params.sortByScore = newFilters.sortByScore;
                  dispatch(filterMatches(params));
                  setActiveTab("filtered");
                }}
              >
                <DropdownMenuRadioItem value="all" className="cursor-pointer">
                  Any Difficulty
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem
                  value="beginner"
                  className="cursor-pointer"
                >
                  Beginner
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem
                  value="intermediate"
                  className="cursor-pointer"
                >
                  Intermediate
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem
                  value="advanced"
                  className="cursor-pointer"
                >
                  Advanced
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>

              <DropdownMenuSeparator />
              <DropdownMenuLabel>Sort by Match Score</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuRadioGroup
                value={filters.sortByScore || "desc"}
                onValueChange={(val: string) => {
                  const sortVal = val as "asc" | "desc";
                  const newFilters = { ...filters, sortByScore: sortVal };
                  setFilters(newFilters);
                  const params: any = {};
                  if (newFilters.difficulty)
                    params.difficulty = newFilters.difficulty;
                  if (newFilters.sortByScore)
                    params.sortByScore = newFilters.sortByScore;
                  dispatch(filterMatches(params));
                  setActiveTab("filtered");
                }}
              >
                <DropdownMenuRadioItem value="desc" className="cursor-pointer">
                  High to Low
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="asc" className="cursor-pointer">
                  Low to High
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>

              <DropdownMenuSeparator />
              <div className="p-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start text-xs h-8 text-muted-foreground cursor-pointer"
                  onClick={handleClearFilters}
                >
                  Clear Filters
                </Button>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList variant={"line"} className="flex items-center gap-4">
          <TabsTrigger value="recommended" className="cursor-pointer">
            Recommended
          </TabsTrigger>
          <TabsTrigger value="mutual" className="cursor-pointer">
            Mutual
          </TabsTrigger>
          {(filteredMatches?.length > 0 || activeTab === "filtered") && (
            <TabsTrigger value="filtered" className="cursor-pointer">
              Filtered
            </TabsTrigger>
          )}
        </TabsList>
        <TabsContent value="recommended" className="mt-6">
          {recommendedMatches.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 w-full">
              {recommendedMatches.map((m) => (
                <MatchCard key={m.profileId} m={m} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-12 text-center border border-border rounded-lg bg-muted/20 border-dashed mt-4">
              <RiExchangeLine className="text-4xl text-muted-foreground mb-4 opacity-50" />
              <h3 className="font-medium text-lg">
                No recommended matches yet
              </h3>
              <p className="text-sm text-muted-foreground mt-1 max-w-sm">
                Recommendations appear here once you've added skills to your
                profile. Add skills you offer and skills you want to learn to
                get started.
              </p>
            </div>
          )}
        </TabsContent>
        <TabsContent value="mutual" className="mt-6">
          {mutualMatches.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 w-full">
              {mutualMatches.map((m) => (
                <MatchCard key={m.profileId} m={m} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-12 text-center border border-border rounded-lg bg-muted/20 border-dashed mt-4">
              <RiHeartLine className="text-4xl text-muted-foreground mb-4 opacity-50" />
              <h3 className="font-medium text-lg">No mutual matches yet</h3>
              <p className="text-sm text-muted-foreground mt-1 max-w-sm">
                Mutual matches appear here when you offer a skill someone wants,
                and they offer a skill you want.
              </p>
            </div>
          )}
        </TabsContent>
        <TabsContent value="filtered" className="mt-6">
          {loadingFilter ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-foreground" />
            </div>
          ) : filteredMatches?.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 w-full">
              {filteredMatches.map((m) => (
                <MatchCard key={m.profileId} m={m} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-12 text-center border border-border rounded-lg bg-muted/20 border-dashed mt-4">
              <RiEqualizerLine className="text-4xl text-muted-foreground mb-4 opacity-50" />
              <h3 className="font-medium text-lg">No matches found</h3>
              <p className="text-sm text-muted-foreground mt-1 max-w-sm">
                Try adjusting your filters to see more results.
              </p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={handleClearFilters}
              >
                Clear Filters
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default page;
