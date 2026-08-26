"use client";

import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchAdminSwaps, updateAdminSwapStatus } from "@/store/features/admin/adminSlice";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  RiSearchLine,
  RiArrowLeftRightLine,
  RiCheckDoubleLine,
  RiCloseCircleLine,
} from "react-icons/ri";

export default function AdminSwapsPage() {
  const dispatch = useAppDispatch();
  const { swaps = [], loadingSwaps } = useAppSelector((s) => s.admin);

  const [statusFilter, setStatusFilter] = useState("");
  const [search, setSearch] = useState("");

  const loadSwaps = () => {
    dispatch(fetchAdminSwaps({ status: statusFilter, search }));
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      loadSwaps();
    }, 300);
    return () => clearTimeout(timeout);
  }, [dispatch, statusFilter, search]);

  const handleUpdateStatus = async (swapId: string, newStatus: string) => {
    try {
      await dispatch(updateAdminSwapStatus({ swapId, status: newStatus })).unwrap();
      toast.success(`Swap status updated to ${newStatus}`);
    } catch (err: any) {
      toast.error(err || "Failed to update swap status");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <RiArrowLeftRightLine className="text-primary" />
          Skill Swaps Platform Monitor
        </h1>
        <p className="text-sm text-muted-foreground mt-1.5">
          Track active peer-to-peer exchange requests, status progressions, and perform admin dispute resolutions.
        </p>
      </div>

      {/* Filters */}
      <div className="flex items-center justify-between gap-4 flex-wrap bg-card p-4 rounded-xl border border-border">
        {/* Search */}
        <div className="relative w-full max-w-sm">
          <RiSearchLine className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-base" />
          <Input
            placeholder="Search by user or skill..."
            className="pl-9 h-9 text-xs bg-background"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-9 px-3 rounded-lg border border-border bg-background text-foreground text-xs font-semibold focus:outline-hidden cursor-pointer"
          >
            <option value="">All Swap Statuses</option>
            <option value="pending">Pending</option>
            <option value="accepted">Accepted</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Swaps Table */}
      <Card className="border-border overflow-hidden">
        <CardContent className="p-0">
          {loadingSwaps ? (
            <div className="flex flex-col items-center justify-center py-20 text-muted-foreground gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <p className="text-xs font-medium">Loading skill swaps...</p>
            </div>
          ) : !swaps || swaps.length === 0 ? (
            <div className="py-16 text-center text-muted-foreground space-y-1">
              <p className="font-semibold text-sm">No skill swaps found</p>
              <p className="text-xs">Adjust your search query or status filter.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-muted/50 border-b border-border text-muted-foreground font-semibold uppercase tracking-wider">
                  <tr>
                    <th className="px-4 py-3">Requester</th>
                    <th className="px-4 py-3">Recipient</th>
                    <th className="px-4 py-3">Skills Offered / Wanted</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Date</th>
                    <th className="px-4 py-3 text-right">Admin Intervene</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {swaps.map((s) => {
                    const reqName = `${s.requester?.firstName} ${s.requester?.lastName}`.trim();
                    const recName = `${s.recipient?.firstName} ${s.recipient?.lastName}`.trim();

                    return (
                      <tr key={s._id} className="hover:bg-muted/20 transition-colors">
                        {/* Requester */}
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2.5">
                            <Avatar className="h-8 w-8 border border-border">
                              <AvatarImage src={s.requester?.avatar} />
                              <AvatarFallback className="text-[10px] font-bold">
                                {s.requester?.firstName?.[0]}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-semibold text-foreground leading-tight">{reqName}</p>
                              <p className="text-[10px] text-muted-foreground">{s.requester?.email}</p>
                            </div>
                          </div>
                        </td>

                        {/* Recipient */}
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2.5">
                            <Avatar className="h-8 w-8 border border-border">
                              <AvatarImage src={s.recipient?.avatar} />
                              <AvatarFallback className="text-[10px] font-bold">
                                {s.recipient?.firstName?.[0]}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-semibold text-foreground leading-tight">{recName}</p>
                              <p className="text-[10px] text-muted-foreground">{s.recipient?.email}</p>
                            </div>
                          </div>
                        </td>

                        {/* Skills Exchange */}
                        <td className="px-4 py-3 space-y-0.5">
                          <p className="font-medium text-foreground">
                            <span className="text-primary font-semibold">Teaches:</span>{" "}
                            {s.requesterOffersSkill || "N/A"}
                          </p>
                          <p className="font-medium text-foreground">
                            <span className="text-amber-500 font-semibold">Wants:</span>{" "}
                            {s.requesterWantsSkill || "N/A"}
                          </p>
                        </td>

                        {/* Status Badge */}
                        <td className="px-4 py-3">
                          <Badge
                            variant="outline"
                            className={`text-[10px] uppercase font-bold ${
                              s.status === "completed"
                                ? "bg-green-500/10 text-green-600 border-green-500/20"
                                : s.status === "accepted"
                                ? "bg-blue-500/10 text-blue-600 border-blue-500/20"
                                : s.status === "pending"
                                ? "bg-amber-500/10 text-amber-600 border-amber-500/20"
                                : "bg-red-500/10 text-red-600 border-red-500/20"
                            }`}
                          >
                            {s.status}
                          </Badge>
                        </td>

                        {/* Date */}
                        <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                          {new Date(s.createdAt).toLocaleDateString()}
                        </td>

                        {/* Actions */}
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {s.status !== "completed" && (
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-7 text-[11px] gap-1 text-green-600 border-green-500/30 hover:bg-green-500/10 cursor-pointer"
                                onClick={() => handleUpdateStatus(s._id, "completed")}
                              >
                                <RiCheckDoubleLine /> Complete
                              </Button>
                            )}
                            {s.status !== "cancelled" && (
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-7 text-[11px] gap-1 text-red-600 border-red-500/30 hover:bg-red-500/10 cursor-pointer"
                                onClick={() => handleUpdateStatus(s._id, "cancelled")}
                              >
                                <RiCloseCircleLine /> Cancel
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
