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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { fetchMutualMatches, fetchRecommendedMatches, searchMatches, filterMatches } from "@/store/features/matches/matchSlice";
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

// ─── Swap Request Modal ───────────────────────────────────────────────────────

interface SwapModalProps {
  match: any;
  onClose: () => void;
}

const SwapRequestModal = ({ match, onClose }: SwapModalProps) => {
  const dispatch = useAppDispatch();
  const { loadingAction } = useAppSelector((state) => state.swaps);

  const firstName = match.userProfile.user.firstName || "";
  const lastName = match.userProfile.user.lastName || "";
  const fullName = `${firstName} ${lastName}`.trim() || "Unknown User";
  const initials = `${firstName?.[0] || ""}${lastName?.[0] || ""}`.toUpperCase() || "U";

  const learnSkillName = match.matchDetails?.aWantsB?.offerSkill?.primarySkill?.name;
  const teachSkillName = match.matchDetails?.bWantsA?.offerSkill?.primarySkill?.name;

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
        })
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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md border border-gray-100 dark:border-gray-800">
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <Avatar className="w-10 h-10">
              <AvatarImage src={match.userProfile.user.avatar} alt={fullName} />
              <AvatarFallback className="bg-blue-100 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 text-sm font-medium">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold text-sm text-gray-900 dark:text-white">{fullName}</p>
              <p className="text-xs text-muted-foreground">Request skill swap</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {success ? (
          <div className="flex flex-col items-center justify-center py-12 gap-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-500" />
            <p className="font-semibold text-gray-900 dark:text-white">Request Sent!</p>
            <p className="text-sm text-muted-foreground">
              {fullName} will be notified of your swap request.
            </p>
          </div>
        ) : (
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1 block">
                  You offer
                </label>
                <Input
                  placeholder="e.g. React"
                  value={offersSkill}
                  onChange={(e) => setOffersSkill(e.target.value)}
                  className="text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1 block">
                  You want to learn
                </label>
                <Input
                  placeholder="e.g. Python"
                  value={wantsSkill}
                  onChange={(e) => setWantsSkill(e.target.value)}
                  className="text-sm"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1 block">
                Message{" "}
                <span className="normal-case font-normal">(optional)</span>
              </label>
              <textarea
                className="w-full text-sm px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-background resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                rows={3}
                placeholder={`Hi ${firstName}, I'd love to swap skills with you!`}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                maxLength={500}
              />
              <p className="text-[11px] text-muted-foreground text-right">{message.length}/500</p>
            </div>

            <div className="flex gap-3 pt-1">
              <Button variant="outline" onClick={onClose} className="flex-1" disabled={loadingAction}>
                Cancel
              </Button>
              <Button onClick={handleSend} className="flex-1 gap-2" disabled={loadingAction}>
                {loadingAction ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <ArrowLeftRight className="w-4 h-4" />
                )}
                Send Request
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};


const MatchCard = ({ m }: { m: any }) => {
  const isMutual = m.matchDetails?.isMutual;
  const learnSkill = m.matchDetails?.aWantsB?.offerSkill;
  const teachSkill = m.matchDetails?.bWantsA?.offerSkill;
  const learnScore = m.matchDetails?.aWantsB?.score ?? 0;
  const teachScore = m.matchDetails?.bWantsA?.score ?? 0;
  const matchPercent = m.matchPercent ?? Math.round((m.totalScore / 200) * 100);
  const firstName = m.userProfile.user.firstName || "";
  const lastName = m.userProfile.user.lastName || "";
  const fullName = `${firstName} ${lastName}`.trim() || "Unknown User";
  const initials = `${firstName?.[0] || ""}${lastName?.[0] || ""}`.toUpperCase() || "U";

  const [showSwapModal, setShowSwapModal] = useState(false);

  return (
    <>
      {showSwapModal && (
        <SwapRequestModal match={m} onClose={() => setShowSwapModal(false)} />
      )}

      <Card className="flex flex-col overflow-hidden gap-0 py-0">
        {/* TOP ACCENT BAR */}
        <div
          className={`h-[3px] w-full ${
            isMutual ? "bg-emerald-500" : "bg-amber-400"
          }`}
        />

        <CardHeader className="flex flex-row items-center justify-between gap-3 px-4 pt-4 pb-3 space-y-0">
          {/* AVATAR + USER INFO */}
          <div className="flex items-center gap-3 min-w-0">
            <div className="relative shrink-0">
              <Avatar className="w-[42px] h-[42px]">
                <AvatarImage
                  src={m.userProfile.user.avatar}
                  alt={fullName}
                />
                <AvatarFallback className="bg-blue-100 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 text-[13px] font-medium">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <span
                className={`absolute -bottom-0.5 -right-0.5 w-[11px] h-[11px] rounded-full border-2 border-background ${
                  isMutual ? "bg-emerald-500" : "bg-amber-400"
                }`}
              />
            </div>
            <div className="min-w-0">
              <p className="font-medium text-sm truncate leading-tight">
                {fullName}
              </p>
              <p className="text-xs text-muted-foreground truncate mt-0.5">
                {m.userProfile.user.currentWork?.role || m.userProfile.user.role || "Professional"}
                {m.userProfile.user.currentWork?.company ? ` · ${m.userProfile.user.currentWork.company}` : ""}
              </p>
            </div>
          </div>

          {/* SCORE + BADGE */}
          <div className="flex flex-col items-end shrink-0 gap-1.5">
            <div className="flex items-baseline gap-0.5">
              <span className="text-[26px] font-medium leading-none">
                {matchPercent}
              </span>
              <span className="text-xs text-muted-foreground">%</span>
            </div>
            <Badge
              variant="outline"
              className={`text-[11px] font-medium gap-1 ${
                isMutual
                  ? "border-emerald-300 text-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800"
                  : "border-amber-300 text-amber-700 bg-amber-50 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800"
              }`}
            >
              {isMutual ? (
                <RiExchangeLine className="text-[11px]" />
              ) : (
                <RiArrowRightLine className="text-[11px]" />
              )}
              {isMutual ? "Mutual" : "One-way"}
            </Badge>
          </div>
        </CardHeader>

        <Separator />

        <CardContent className="px-4 py-3 flex flex-col gap-2">
          {/* YOU LEARN */}
          {learnSkill ? (
            <div className="flex items-center gap-3 p-2.5 rounded-lg border border-dashed bg-muted/30">
              <div className="w-[30px] h-[30px] rounded-lg bg-blue-100 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 flex items-center justify-center shrink-0">
                <RiBookOpenLine className="text-[15px]" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide mb-0.5">
                  You learn
                </p>
                <p className="font-medium text-sm truncate">
                  {learnSkill?.primarySkill?.name}
                </p>
                <p className="text-[11px] text-muted-foreground">
                  {learnSkill?.domain} · {learnSkill?.difficulty}
                </p>
              </div>
              <span className="text-[11px] font-medium text-blue-700 dark:text-blue-300 bg-blue-100 dark:bg-blue-950/50 px-2 py-1 rounded-full shrink-0">
                {learnScore} pts
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-3 p-2.5 rounded-lg border border-dashed bg-muted/10 opacity-60">
              <div className="w-[30px] h-[30px] rounded-lg bg-muted text-muted-foreground flex items-center justify-center shrink-0">
                <RiBookOpenLine className="text-[15px]" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide mb-0.5">
                  You learn
                </p>
                <p className="font-medium text-sm truncate italic text-muted-foreground">
                  No offered skills match
                </p>
              </div>
            </div>
          )}

          {/* SWAP ICON */}
          <div className="flex items-center justify-center gap-2 text-muted-foreground">
            <div className="h-px w-7 bg-border" />
            <div className="w-[22px] h-[22px] rounded-full border bg-background flex items-center justify-center">
              <RiArrowUpDownLine className="text-xs" />
            </div>
            <div className="h-px w-7 bg-border" />
          </div>

          {/* YOU TEACH */}
          {teachSkill ? (
            <div className="flex items-center gap-3 p-2.5 rounded-lg border border-dashed bg-muted/30">
              <div className="w-[30px] h-[30px] rounded-lg bg-violet-100 dark:bg-violet-950/50 text-violet-700 dark:text-violet-300 flex items-center justify-center shrink-0">
                <RiPresentationLine className="text-[15px]" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide mb-0.5">
                  You teach
                </p>
                <p className="font-medium text-sm truncate">
                  {teachSkill?.primarySkill?.name}
                </p>
                <p className="text-[11px] text-muted-foreground">
                  {teachSkill?.domain} · {teachSkill?.difficulty}
                </p>
              </div>
              <span className="text-[11px] font-medium text-violet-700 dark:text-violet-300 bg-violet-100 dark:bg-violet-950/50 px-2 py-1 rounded-full shrink-0">
                {teachScore} pts
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-3 p-2.5 rounded-lg border border-dashed bg-muted/10 opacity-60">
              <div className="w-[30px] h-[30px] rounded-lg bg-muted text-muted-foreground flex items-center justify-center shrink-0">
                <RiPresentationLine className="text-[15px]" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide mb-0.5">
                  You teach
                </p>
                <p className="font-medium text-sm truncate italic text-muted-foreground">
                  No requested skills match
                </p>
              </div>
            </div>
          )}

          {/* TAGS ROW */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {m.matchDetails?.modeCompatible && (
              <Badge
                variant="secondary"
                className="text-[11px] gap-1 font-normal"
              >
                <RiCheckboxCircleLine className="text-[11px]" />
                Mode compatible
              </Badge>
            )}
            {m.matchDetails?.isMutual && (
              <Badge
                variant="secondary"
                className="text-[11px] gap-1 font-normal"
              >
                <RiHeartLine className="text-[11px]" />
                Mutual interest
              </Badge>
            )}
            {(m.matchDetails?.aWantsB?.breakdown?.tokenSimilarity > 0 || m.matchDetails?.bWantsA?.breakdown?.tokenSimilarity > 0) && (
              <Badge
                variant="secondary"
                className="text-[11px] gap-1 font-normal"
              >
                <RiCoinLine className="text-[11px]" />
                Token match
              </Badge>
            )}
            {(m.matchDetails?.aWantsB?.breakdown?.domainSimilarity > 0 || m.matchDetails?.bWantsA?.breakdown?.domainSimilarity > 0) && (
              <Badge
                variant="secondary"
                className="text-[11px] gap-1 font-normal"
              >
                <RiAppsLine className="text-[11px]" />
                Domain similarity
              </Badge>
            )}
          </div>
        </CardContent>

        <Separator />

        <CardFooter className="px-4 py-2.5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <RiShieldStarLine className="text-sm text-amber-500" />
            <span>
              +{m.matchDetails?.reputationBoost ?? 0} rep boost
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="h-8 text-xs gap-1.5"
            >
              <RiUserLine className="text-sm" />
              Profile
            </Button>
            <Button
              size="sm"
              className="h-8 text-xs gap-1.5"
              onClick={() => setShowSwapModal(true)}
            >
              <RiExchangeLine className="text-sm" />
              Request swap
            </Button>
          </div>
        </CardFooter>
      </Card>
    </>
  );
};

const page = () => {
  const dispatch = useAppDispatch();
  const { recommendedMatches, mutualMatches, searchResults, loadingSearch, filteredMatches, loadingFilter } = useAppSelector((state) => state.matches);

  const [searchQuery, setSearchQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [activeTab, setActiveTab] = useState("recommended");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    mode: "",
    availability: "",
    domain: "",
    difficulty: "",
  });

  const handleApplyFilters = () => {
    dispatch(filterMatches(filters));
    setActiveTab("filtered");
    setShowFilters(false);
  };

  const handleClearFilters = () => {
    setFilters({ mode: "", availability: "", domain: "", difficulty: "" });
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
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
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
              className="pl-10 bg-background dark:bg-background w-full"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowDropdown(true);
              }}
              onFocus={() => setShowDropdown(true)}
            />

            {/* Search Results Dropdown */}
            {showDropdown && searchQuery.trim().length > 0 && (
              <div className="absolute top-full right-0 mt-2 w-[800px] max-w-[calc(100vw-2rem)] z-50 bg-background border rounded-xl shadow-2xl max-h-[75vh] overflow-y-auto flex flex-col">
                <div className="p-4 border-b sticky top-0 bg-background/95 backdrop-blur z-10 flex justify-between items-center">
                  <h3 className="font-medium">
                    Search Results for <span className="text-primary">"{searchQuery}"</span>
                  </h3>
                  <Button variant="ghost" size="sm" onClick={() => setShowDropdown(false)} className="h-8 px-2 text-xs">
                    Close
                  </Button>
                </div>
                <div className="p-4">
                  {loadingSearch ? (
                    <div className="py-12 flex flex-col items-center justify-center text-muted-foreground gap-3">
                      <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
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
                      <p className="text-sm">No matches found for "{searchQuery}".</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
          <Button 
            variant={showFilters ? "secondary" : "outline"} 
            onClick={() => setShowFilters(!showFilters)}
            className="shrink-0"
          >
            <RiEqualizerLine className="mr-2 text-lg" />
            Filter
          </Button>
        </div>
      </div>

      {/* FILTER UI */}
      {showFilters && (
        <Card className="p-5 bg-card border shadow-sm rounded-xl mb-2">
          <div className="flex items-center gap-2 mb-4 pb-2 border-b text-sm font-semibold">
            <RiEqualizerLine className="text-lg text-primary" />
            <h3>Refine Recommendations</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
            <div className="space-y-2">
              <label className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">Mode</label>
              <Select value={filters.mode || "all"} onValueChange={(val) => setFilters({...filters, mode: val === "all" ? "" : val})}>
                <SelectTrigger className="h-9 w-full bg-background">
                  <SelectValue placeholder="Any Mode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Any Mode</SelectItem>
                  <SelectItem value="teach">Teach</SelectItem>
                  <SelectItem value="learn">Learn</SelectItem>
                  <SelectItem value="both">Both</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">Availability</label>
              <Select value={filters.availability || "all"} onValueChange={(val) => setFilters({...filters, availability: val === "all" ? "" : val})}>
                <SelectTrigger className="h-9 w-full bg-background">
                  <SelectValue placeholder="Any Availability" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Any Availability</SelectItem>
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="busy">Busy</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">Difficulty</label>
              <Select value={filters.difficulty || "all"} onValueChange={(val) => setFilters({...filters, difficulty: val === "all" ? "" : val})}>
                <SelectTrigger className="h-9 w-full bg-background">
                  <SelectValue placeholder="Any Difficulty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Any Difficulty</SelectItem>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">Domain</label>
              <Input 
                placeholder="e.g. Frontend" 
                value={filters.domain}
                onChange={(e) => setFilters({...filters, domain: e.target.value})}
                className="h-9 bg-background"
              />
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-dashed">
            <Button variant="ghost" size="sm" onClick={handleClearFilters}>Reset</Button>
            <Button size="sm" className="px-6" onClick={handleApplyFilters}>Apply Filters</Button>
          </div>
        </Card>
      )}

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
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 w-full">
            {recommendedMatches.map((m) => (
              <MatchCard key={m.profileId} m={m} />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="mutual" className="mt-6">
          {mutualMatches.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 w-full">
              {mutualMatches.map((m) => (
                <MatchCard key={m.profileId} m={m} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-12 text-center border rounded-lg bg-muted/20 border-dashed mt-4">
              <RiHeartLine className="text-4xl text-muted-foreground mb-4 opacity-50" />
              <h3 className="font-medium text-lg">No mutual matches yet</h3>
              <p className="text-sm text-muted-foreground mt-1 max-w-sm">
                Mutual matches appear here when you offer a skill someone wants, and they offer a skill you want.
              </p>
            </div>
          )}
        </TabsContent>
        <TabsContent value="filtered" className="mt-6">
          {loadingFilter ? (
            <div className="flex items-center justify-center py-12">
               <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : filteredMatches?.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 w-full">
              {filteredMatches.map((m) => (
                <MatchCard key={m.profileId} m={m} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-12 text-center border rounded-lg bg-muted/20 border-dashed mt-4">
              <RiEqualizerLine className="text-4xl text-muted-foreground mb-4 opacity-50" />
              <h3 className="font-medium text-lg">No matches found</h3>
              <p className="text-sm text-muted-foreground mt-1 max-w-sm">
                Try adjusting your filters to see more results.
              </p>
              <Button variant="outline" className="mt-4" onClick={handleClearFilters}>Clear Filters</Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default page;
