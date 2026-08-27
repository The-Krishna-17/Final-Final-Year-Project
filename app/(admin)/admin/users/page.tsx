"use client";

import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  fetchAdminUsers,
  updateAdminUserRole,
  toggleAdminUserLock,
  deleteAdminUser,
} from "@/store/features/admin/adminSlice";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  RiSearchLine,
  RiUserSettingsLine,
  RiCheckDoubleLine,
  RiLock2Line,
  RiLockUnlockLine,
  RiDeleteBinLine,
  RiShieldCheckLine,
  RiAlertLine,
  RiShieldLine,
} from "react-icons/ri";

type ModalType = "delete" | "lock" | "unlock" | null;

interface ConfirmTarget {
  userId: string;
  name: string;
  email?: string;
  avatar?: string;
}

export default function AdminUsersPage() {
  const dispatch = useAppDispatch();
  const {
    users = [],
    pagination,
    loadingUsers,
  } = useAppSelector((s) => s.admin);

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");

  const [page, setPage] = useState(1);

  // Modal state
  const [modalType, setModalType] = useState<ModalType>(null);
  const [confirmTarget, setConfirmTarget] = useState<ConfirmTarget | null>(
    null,
  );
  const [modalLoading, setModalLoading] = useState(false);
  const [deleteReason, setDeleteReason] = useState("");

  const loadData = () => {
    dispatch(
      fetchAdminUsers({
        page,
        limit: 10,
        search,
        role: roleFilter,
      }),
    );
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      loadData();
    }, 300);
    return () => clearTimeout(timeout);
  }, [dispatch, search, roleFilter, page]);

  const openModal = (
    type: ModalType,
    userId: string,
    name: string,
    email?: string,
    avatar?: string,
  ) => {
    setModalType(type);
    setConfirmTarget({ userId, name, email, avatar });
  };

  const closeModal = () => {
    setModalType(null);
    setConfirmTarget(null);
    setModalLoading(false);
    setDeleteReason("");
  };

  const handleRoleChange = async (
    userId: string,
    newRole: "user" | "admin" | "moderator",
  ) => {
    try {
      await dispatch(updateAdminUserRole({ userId, role: newRole })).unwrap();
      toast.success(`User role updated to ${newRole}`);
    } catch (err: any) {
      toast.error(err || "Failed to update role");
    }
  };

  const handleConfirm = async () => {
    if (!confirmTarget || !modalType) return;
    if (modalType === "delete" && !deleteReason.trim()) {
      toast.error("Please provide a valid reason for deletion.");
      return;
    }
    setModalLoading(true);
    try {
      if (modalType === "delete") {
        await dispatch(
          deleteAdminUser({
            userId: confirmTarget.userId,
            reason: deleteReason.trim(),
          }),
        ).unwrap();
        toast.success("User account deleted");
      } else if (modalType === "lock") {
        await dispatch(
          toggleAdminUserLock({ userId: confirmTarget.userId, lock: true }),
        ).unwrap();
        toast.success("Account locked");
      } else if (modalType === "unlock") {
        await dispatch(
          toggleAdminUserLock({ userId: confirmTarget.userId, lock: false }),
        ).unwrap();
        toast.success("Account unlocked");
      }
      closeModal();
    } catch (err: any) {
      toast.error(err || "Action failed");
      setModalLoading(false);
    }
  };

  const getModalConfig = () => {
    switch (modalType) {
      case "delete":
        return {
          icon: <RiDeleteBinLine className="w-6 h-6 text-destructive" />,
          iconBg: "bg-destructive/10",
          title: "Delete User Account",
          description: `This will permanently delete the account for "${confirmTarget?.name}". This action cannot be undone and all associated data will be lost.`,
          confirmLabel: "Delete Account",
          confirmVariant: "destructive" as const,
        };
      case "lock":
        return {
          icon: <RiLock2Line className="w-6 h-6 text-amber-500" />,
          iconBg: "bg-amber-500/10",
          title: "Lock Account",
          description: `This will lock "${confirmTarget?.name}"'s account for 30 days. They will be unable to log in during this period.`,
          confirmLabel: "Lock Account",
          confirmVariant: "default" as const,
        };
      case "unlock":
        return {
          icon: <RiLockUnlockLine className="w-6 h-6 text-green-500" />,
          iconBg: "bg-green-500/10",
          title: "Unlock Account",
          description: `This will immediately restore access to "${confirmTarget?.name}"'s account. They will be able to log in normally.`,
          confirmLabel: "Unlock Account",
          confirmVariant: "default" as const,
        };

      default:
        return null;
    }
  };

  const modalConfig = getModalConfig();

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <RiUserSettingsLine className="text-primary" />
            User Management & Moderation
          </h1>
          <p className="text-sm text-muted-foreground mt-1.5">
            Manage registered accounts, assign administrative roles, and toggle
            account security locks.
          </p>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="flex items-center justify-between gap-4 flex-wrap bg-card p-4 rounded-xl border border-border">
        {/* Search */}
        <div className="relative w-full max-w-sm">
          <RiSearchLine className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-base" />
          <Input
            placeholder="Search by name or email..."
            className="pl-9 h-9 text-xs bg-background"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3 flex-wrap text-xs">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="h-9 px-3 rounded-lg border border-border bg-background text-foreground text-xs font-semibold focus:outline-hidden cursor-pointer"
          >
            <option value="">All Roles</option>
            <option value="user">User</option>
            <option value="moderator">Moderator</option>
            <option value="admin">Admin</option>
          </select>


        </div>
      </div>

      {/* User Directory Table */}
      <Card className="border-border overflow-hidden">
        <CardContent className="p-0">
          {loadingUsers ? (
            <div className="flex flex-col items-center justify-center py-20 text-muted-foreground gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <p className="text-xs font-medium">Fetching directory...</p>
            </div>
          ) : !users || users.length === 0 ? (
            <div className="py-16 text-center text-muted-foreground space-y-1">
              <p className="font-semibold text-sm">No users found</p>
              <p className="text-xs">
                Try adjusting your search query or role filters.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-muted/50 border-b border-border text-muted-foreground font-semibold uppercase tracking-wider">
                  <tr>
                    <th className="px-4 py-3">User</th>
                    <th className="px-4 py-3">Role</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Joined</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {users.map((u) => {
                    const fullName = `${u.firstName} ${u.lastName}`.trim();
                    const initials =
                      `${u.firstName?.[0] || ""}${u.lastName?.[0] || ""}`.toUpperCase();
                    const isLocked = !!(
                      u.lockUntil && new Date(u.lockUntil) > new Date()
                    );

                    return (
                      <tr
                        key={u._id}
                        className="hover:bg-muted/20 transition-colors"
                      >
                        {/* User identity */}
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-9 w-9 border border-border">
                              <AvatarImage src={u.avatar || undefined} />
                              <AvatarFallback className="text-xs font-semibold bg-secondary text-secondary-foreground">
                                {initials}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-semibold text-sm text-foreground leading-tight">
                                {fullName}
                              </p>
                              <p className="text-muted-foreground text-[11px]">
                                {u.email}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Role selection dropdown */}
                        <td className="px-4 py-3">
                          <select
                            value={u.role}
                            onChange={(e) =>
                              handleRoleChange(u._id, e.target.value as any)
                            }
                            className="h-7 px-2 text-xs font-semibold rounded-md border border-border bg-background capitalize"
                          >
                            <option value="user">User</option>
                            <option value="moderator">Moderator</option>
                            <option value="admin">Admin</option>
                          </select>
                        </td>

                        {/* Status badges */}
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            {isLocked ? (
                              <Badge
                                variant="outline"
                                className="text-[10px] bg-red-500/10 text-red-600 border-red-500/20"
                              >
                                <RiLock2Line className="mr-1" /> Locked
                              </Badge>
                            ) : (
                              <Badge
                                variant="outline"
                                className="text-[10px] bg-green-500/10 text-green-600 border-green-500/20"
                              >
                                Active
                              </Badge>
                            )}
                          </div>
                        </td>

                        {/* Joined Date */}
                        <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                          {new Date(u.createdAt).toLocaleDateString()}
                        </td>

                        {/* Actions */}
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">


                            {/* Toggle Lock */}
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-8 w-8 text-muted-foreground hover:text-foreground cursor-pointer"
                              title={
                                isLocked ? "Unlock Account" : "Lock Account"
                              }
                              onClick={() =>
                                openModal(
                                  isLocked ? "unlock" : "lock",
                                  u._id,
                                  fullName,
                                  u.email,
                                  u.avatar ?? undefined,
                                )
                              }
                            >
                              {isLocked ? (
                                <RiLockUnlockLine className="text-amber-500" />
                              ) : (
                                <RiLock2Line />
                              )}
                            </Button>

                            {/* Delete User */}
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-8 w-8 text-muted-foreground hover:text-destructive cursor-pointer"
                              title="Delete Account"
                              onClick={() =>
                                openModal(
                                  "delete",
                                  u._id,
                                  fullName,
                                  u.email,
                                  u.avatar ?? undefined,
                                )
                              }
                            >
                              <RiDeleteBinLine />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination bar */}
          {pagination && pagination.pages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-border bg-muted/30">
              <span className="text-xs text-muted-foreground">
                Showing page{" "}
                <strong className="text-foreground">{pagination.page}</strong>{" "}
                of{" "}
                <strong className="text-foreground">{pagination.pages}</strong>{" "}
                ({pagination.total} total users)
              </span>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="h-8 text-xs rounded-lg"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                >
                  Previous
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-8 text-xs rounded-lg"
                  disabled={page >= pagination.pages}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Unified Confirm Action Modal */}
      <Dialog open={!!modalType} onOpenChange={(open) => !open && closeModal()}>
        <DialogContent className="sm:max-w-md">
          {modalConfig && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-4 mb-1">
                  <div
                    className={`h-12 w-12 rounded-2xl ${modalConfig.iconBg} flex items-center justify-center shrink-0`}
                  >
                    {modalConfig.icon}
                  </div>
                  <div>
                    <DialogTitle className="text-base">
                      {modalConfig.title}
                    </DialogTitle>
                  </div>
                </div>
                <DialogDescription className="text-sm leading-relaxed">
                  {modalConfig.description}
                </DialogDescription>
              </DialogHeader>

              {/* User preview card */}
              {confirmTarget && (
                <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/40 border border-border my-2">
                  <Avatar className="h-9 w-9 border border-border">
                    <AvatarImage src={confirmTarget.avatar || undefined} />
                    <AvatarFallback className="text-xs font-semibold">
                      {confirmTarget.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .slice(0, 2)
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      {confirmTarget.name}
                    </p>
                    {confirmTarget.email && (
                      <p className="text-xs text-muted-foreground">
                        {confirmTarget.email}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Reason textarea (only for delete) */}
              {modalType === "delete" && (
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Reason for Deletion *
                  </label>
                  <Textarea
                    placeholder="Provide a valid reason for deleting this user account..."
                    value={deleteReason}
                    onChange={(e) => setDeleteReason(e.target.value)}
                    className="min-h-20 text-sm"
                  />
                </div>
              )}

              <DialogFooter className="gap-2 sm:justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  className="cursor-pointer"
                  onClick={closeModal}
                  disabled={modalLoading}
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  variant={modalConfig.confirmVariant}
                  className="cursor-pointer"
                  onClick={handleConfirm}
                  disabled={modalLoading}
                >
                  {modalLoading ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" />{" "}
                      Processing...
                    </>
                  ) : (
                    modalConfig.confirmLabel
                  )}
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
