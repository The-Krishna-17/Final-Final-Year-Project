"use client";

import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchSwapPartners } from "@/store/features/swaps/swapSlice";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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
} from "react-icons/ri";
import Link from "next/link";

export default function ConnectionsPage() {
  const dispatch = useAppDispatch();
  const { swapPartners, loadingPartners } = useAppSelector((s) => s.swaps);
  const [query, setQuery] = useState("");

  useEffect(() => {
    dispatch(fetchSwapPartners());
  }, [dispatch]);

  const filtered = swapPartners.filter((p) => {
    const fullName = `${p.user.firstName} ${p.user.lastName}`.toLowerCase();
    const offered = (p.offeredSkill || "").toLowerCase();
    const wanted = (p.wantedSkill || "").toLowerCase();
    return (
      fullName.includes(query.toLowerCase()) ||
      offered.includes(query.toLowerCase()) ||
      wanted.includes(query.toLowerCase())
    );
  });

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
        <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/40 px-3 py-1.5 rounded-full border">
          <RiTeamLine className="text-base text-primary" />
          <span>
            <strong className="text-foreground">{swapPartners.length}</strong>{" "}
            connection{swapPartners.length !== 1 ? "s" : ""}
          </span>
        </div>
        {query && (
          <div className="text-sm text-muted-foreground">
            Showing{" "}
            <strong className="text-foreground">{filtered.length}</strong>{" "}
            result{filtered.length !== 1 ? "s" : ""} for "{query}"
          </div>
        )}
      </div>

      {/* Loading */}
      {loadingPartners ? (
        <div className="flex flex-col items-center justify-center py-24 text-muted-foreground gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-sm">Loading your connections...</p>
        </div>
      ) : filtered.length === 0 ? (
        /* Empty state */
        <div className="flex flex-col items-center justify-center py-20 text-center border rounded-xl bg-muted/10 border-dashed">
          <RiUserHeartLine className="text-5xl text-muted-foreground opacity-25 mb-4" />
          {query ? (
            <>
              <h3 className="font-medium text-base">No results for "{query}"</h3>
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
              <h3 className="font-medium text-base">No connections yet</h3>
              <p className="text-sm text-muted-foreground mt-1.5 max-w-xs">
                Accept a swap request or get one accepted to build your skill
                network.
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
          {filtered.map((partner) => {
            const firstName = partner.user.firstName || "";
            const lastName = partner.user.lastName || "";
            const fullName = `${firstName} ${lastName}`.trim() || "Unknown User";
            const initials =
              `${firstName?.[0] || ""}${lastName?.[0] || ""}`.toUpperCase() ||
              "U";

            return (
              <Card
                key={partner.swapId}
                className="overflow-hidden gap-0 py-0 hover:shadow-md transition-shadow duration-200 group"
              >
                {/* Top gradient banner */}
                <div className="h-16 bg-gradient-to-br from-primary/20 via-violet-500/10 to-emerald-500/10 relative">
                  <div className="absolute inset-0 bg-grid-white/5" />
                </div>

                <CardContent className="px-4 pb-4 pt-0 -mt-8 space-y-4">
                  {/* Avatar */}
                  <div className="flex justify-between items-end">
                    <Avatar className="w-16 h-16 border-4 border-background shadow-md ring-2 ring-emerald-500/40">
                      <AvatarImage src={partner.user.avatar} alt={fullName} />
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-violet-600 text-white text-lg font-semibold">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    {/* Active connection badge */}
                    <Badge
                      variant="outline"
                      className="text-[10px] gap-1 border-emerald-300 text-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800 mb-1"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
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
                      <div className="flex items-center gap-2 text-xs px-2.5 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/50">
                        <RiPresentationLine className="text-blue-500 shrink-0 text-sm" />
                        <span className="text-blue-800 dark:text-blue-300 truncate">
                          <span className="font-medium">Teaches:</span>{" "}
                          {partner.offeredSkill}
                        </span>
                      </div>
                    )}
                    {partner.wantedSkill && (
                      <div className="flex items-center gap-2 text-xs px-2.5 py-1.5 rounded-lg bg-violet-50 dark:bg-violet-950/30 border border-violet-100 dark:border-violet-900/50">
                        <RiBookOpenLine className="text-violet-500 shrink-0 text-sm" />
                        <span className="text-violet-800 dark:text-violet-300 truncate">
                          <span className="font-medium">Learning:</span>{" "}
                          {partner.wantedSkill}
                        </span>
                      </div>
                    )}
                    {!partner.offeredSkill && !partner.wantedSkill && (
                      <div className="flex items-center gap-2 text-xs px-2.5 py-1.5 rounded-lg bg-muted/30 border border-dashed">
                        <RiArrowLeftRightLine className="text-muted-foreground shrink-0 text-sm" />
                        <span className="text-muted-foreground">
                          Skill swap partner
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Action buttons */}
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <Link href="/messages">
                      <Button
                        size="sm"
                        variant="outline"
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
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
