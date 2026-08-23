"use client";

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchOverviewStats } from "@/store/features/admin/adminSlice";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import {
  RiUser3Line,
  RiCheckDoubleLine,
  RiLock2Line,
  RiArrowLeftRightLine,
  RiVideoChatLine,
  RiStarLine,
  RiPresentationLine,
  RiBookOpenLine,
  RiLineChartLine,
} from "react-icons/ri";

export default function AdminOverviewPage() {
  const dispatch = useAppDispatch();
  const { overview, loadingOverview } = useAppSelector((s) => s.admin);

  useEffect(() => {
    dispatch(fetchOverviewStats());
  }, [dispatch]);

  if (loadingOverview) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-muted-foreground gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="text-sm font-medium">Loading platform analytics...</p>
      </div>
    );
  }

  if (!overview) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-muted-foreground gap-3 text-center">
        <p className="text-sm font-medium text-destructive">Unable to retrieve platform overview analytics.</p>
        <button
          onClick={() => dispatch(fetchOverviewStats())}
          className="px-4 py-2 text-xs font-semibold rounded-lg bg-primary text-primary-foreground hover:opacity-90"
        >
          Retry Fetching Data
        </button>
      </div>
    );
  }

  const users = overview.users || { total: 0, verified: 0, locked: 0, roles: {} };
  const skills = overview.skills || { totalProfiles: 0, totalOffers: 0, totalWants: 0, topOffers: [], topWants: [] };
  const swaps = overview.swaps || { total: 0, breakdown: {} };
  const meetings = overview.meetings || { total: 0, breakdown: {} };
  const reviews = overview.reviews || { total: 0, avgRating: 0 };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <RiLineChartLine className="text-primary" />
            Platform Executive Summary
          </h1>
          <p className="text-sm text-muted-foreground mt-1.5">
            Real-time analytics across user activity, skill distributions, swap lifecycles, and video calls.
          </p>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <Card className="bg-card border-border shadow-xs">
          <CardContent className="p-4 space-y-2">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-xs font-semibold uppercase tracking-wider">Total Users</span>
              <RiUser3Line className="text-lg text-primary" />
            </div>
            <div className="text-2xl font-bold">{users.total}</div>
            <p className="text-[11px] text-muted-foreground">{users.verified} verified accounts</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border shadow-xs">
          <CardContent className="p-4 space-y-2">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-xs font-semibold uppercase tracking-wider">Email Verified</span>
              <RiCheckDoubleLine className="text-lg text-green-500" />
            </div>
            <div className="text-2xl font-bold">{users.verified}</div>
            <p className="text-[11px] text-muted-foreground">
              {users.total > 0 ? Math.round((users.verified / users.total) * 100) : 0}% verification rate
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border shadow-xs">
          <CardContent className="p-4 space-y-2">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-xs font-semibold uppercase tracking-wider">Locked Users</span>
              <RiLock2Line className="text-lg text-amber-500" />
            </div>
            <div className="text-2xl font-bold">{users.locked}</div>
            <p className="text-[11px] text-muted-foreground">Temporary auth lockouts</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border shadow-xs">
          <CardContent className="p-4 space-y-2">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-xs font-semibold uppercase tracking-wider">Total Swaps</span>
              <RiArrowLeftRightLine className="text-lg text-blue-500" />
            </div>
            <div className="text-2xl font-bold">{swaps.total || 0}</div>
            <p className="text-[11px] text-muted-foreground">
              {swaps.breakdown?.completed || 0} completed successfully
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border shadow-xs">
          <CardContent className="p-4 space-y-2">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-xs font-semibold uppercase tracking-wider">Video Calls</span>
              <RiVideoChatLine className="text-lg text-purple-500" />
            </div>
            <div className="text-2xl font-bold">{meetings.total || 0}</div>
            <p className="text-[11px] text-muted-foreground">
              {meetings.breakdown?.completed || 0} sessions hosted
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border shadow-xs">
          <CardContent className="p-4 space-y-2">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-xs font-semibold uppercase tracking-wider">Avg Rating</span>
              <RiStarLine className="text-lg text-yellow-500" />
            </div>
            <div className="text-2xl font-bold flex items-center gap-1">
              <span>{reviews.avgRating || 0}</span>
              <span className="text-xs text-muted-foreground font-normal">/ 5.0</span>
            </div>
            <p className="text-[11px] text-muted-foreground">{reviews.total || 0} total reviews</p>
          </CardContent>
        </Card>
      </div>

      {/* Top Skills Supply vs Demand Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Top Offered Skills */}
        <Card className="border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <RiPresentationLine className="text-primary" />
              Top Skills Offered (Supply)
            </CardTitle>
            <CardDescription className="text-xs">
              Skills users are most frequently willing to teach others.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {!skills.topOffers || skills.topOffers.length === 0 ? (
              <p className="text-xs text-muted-foreground py-4 text-center">No skill offer data yet.</p>
            ) : (
              skills.topOffers.map((item, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="capitalize">{item.skill}</span>
                    <span className="text-muted-foreground">{item.count} users</span>
                  </div>
                  <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all duration-300"
                      style={{
                        width: `${Math.min(100, (item.count / Math.max(...skills.topOffers.map((o) => o.count), 1)) * 100)}%`,
                      }}
                    />
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Top Wanted Skills */}
        <Card className="border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <RiBookOpenLine className="text-amber-500" />
              Top Skills Wanted (Demand)
            </CardTitle>
            <CardDescription className="text-xs">
              Skills users are actively seeking to learn on the platform.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {!skills.topWants || skills.topWants.length === 0 ? (
              <p className="text-xs text-muted-foreground py-4 text-center">No skill demand data yet.</p>
            ) : (
              skills.topWants.map((item, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="capitalize">{item.skill}</span>
                    <span className="text-muted-foreground">{item.count} requests</span>
                  </div>
                  <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-amber-500 rounded-full transition-all duration-300"
                      style={{
                        width: `${Math.min(100, (item.count / Math.max(...skills.topWants.map((o) => o.count), 1)) * 100)}%`,
                      }}
                    />
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      {/* Lifecycle Distributions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Swap Lifecycle Breakdown */}
        <Card className="border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">Skill Swap Status Breakdown</CardTitle>
            <CardDescription className="text-xs">
              Current state distribution of all skill swap requests created.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="p-3 rounded-xl border border-border bg-muted/20">
                <span className="text-xs font-semibold text-amber-600 block uppercase">Pending</span>
                <span className="text-xl font-bold mt-1 block">{swaps.breakdown?.pending || 0}</span>
              </div>
              <div className="p-3 rounded-xl border border-border bg-muted/20">
                <span className="text-xs font-semibold text-blue-600 block uppercase">Accepted</span>
                <span className="text-xl font-bold mt-1 block">{swaps.breakdown?.accepted || 0}</span>
              </div>
              <div className="p-3 rounded-xl border border-border bg-muted/20">
                <span className="text-xs font-semibold text-green-600 block uppercase">Completed</span>
                <span className="text-xl font-bold mt-1 block">{swaps.breakdown?.completed || 0}</span>
              </div>
              <div className="p-3 rounded-xl border border-border bg-muted/20">
                <span className="text-xs font-semibold text-red-500 block uppercase">Cancelled</span>
                <span className="text-xl font-bold mt-1 block">{swaps.breakdown?.cancelled || 0}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Video Call Meetings Distribution */}
        <Card className="border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">Video Meetings Distribution</CardTitle>
            <CardDescription className="text-xs">
              Status distribution of Jitsi video calls scheduled by swap partners.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-3 rounded-xl border border-border bg-muted/20">
                <span className="text-xs font-semibold text-blue-500 block uppercase">Scheduled</span>
                <span className="text-xl font-bold mt-1 block">{meetings.breakdown?.scheduled || 0}</span>
              </div>
              <div className="p-3 rounded-xl border border-border bg-muted/20">
                <span className="text-xs font-semibold text-green-500 block uppercase">Completed</span>
                <span className="text-xl font-bold mt-1 block">{meetings.breakdown?.completed || 0}</span>
              </div>
              <div className="p-3 rounded-xl border border-border bg-muted/20">
                <span className="text-xs font-semibold text-red-500 block uppercase">Cancelled</span>
                <span className="text-xl font-bold mt-1 block">{meetings.breakdown?.cancelled || 0}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
