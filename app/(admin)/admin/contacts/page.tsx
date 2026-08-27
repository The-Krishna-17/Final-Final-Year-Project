"use client";

import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  fetchAdminContacts,
  updateAdminContactStatus,
  deleteAdminContact,
} from "@/store/features/admin/adminSlice";
import { AdminContactMessage } from "@/store/features/admin/adminType";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Loader2,
  Mail,
  Search,
  Trash2,
  Clock,
  User,
  MessageSquare,
  CheckCircle2,
  MailOpen,
  Reply,
} from "lucide-react";
import { toast } from "sonner";

const STATUS_VARIANTS: Record<string, { label: string; class: string }> = {
  unread: {
    label: "Unread",
    class: "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-800",
  },
  read: {
    label: "Read",
    class: "bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950/40 dark:text-sky-400 dark:border-sky-800",
  },
  replied: {
    label: "Replied",
    class: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800",
  },
};

export default function AdminContactsPage() {
  const dispatch = useAppDispatch();
  const { contacts = [], loadingContacts } = useAppSelector((s) => s.admin);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedMsg, setSelectedMsg] = useState<AdminContactMessage | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    dispatch(fetchAdminContacts());
  }, [dispatch]);

  const handleSearch = () => {
    dispatch(
      fetchAdminContacts({
        status: selectedStatus === "all" ? undefined : selectedStatus,
        search: searchQuery,
      })
    );
  };

  const handleStatusFilterChange = (status: string) => {
    setSelectedStatus(status);
    dispatch(
      fetchAdminContacts({
        status: status === "all" ? undefined : status,
        search: searchQuery,
      })
    );
  };

  const openDetailModal = (msg: AdminContactMessage) => {
    setSelectedMsg(msg);
    setIsDetailOpen(true);

    // Auto mark unread as read when opened
    if (msg.status === "unread") {
      dispatch(updateAdminContactStatus({ messageId: msg._id, status: "read" }));
    }
  };

  const handleStatusChange = async (
    msgId: string,
    status: "unread" | "read" | "replied"
  ) => {
    try {
      await dispatch(updateAdminContactStatus({ messageId: msgId, status })).unwrap();
      toast.success(`Message marked as ${status}`);
      if (selectedMsg && selectedMsg._id === msgId) {
        setSelectedMsg((prev) => (prev ? { ...prev, status } : null));
      }
    } catch (err: any) {
      toast.error(err || "Failed to update status");
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedMsg) return;
    setDeleteLoading(true);
    try {
      await dispatch(deleteAdminContact(selectedMsg._id)).unwrap();
      toast.success("Contact message deleted successfully");
      setIsDeleteOpen(false);
      setIsDetailOpen(false);
    } catch (err: any) {
      toast.error(err || "Failed to delete contact message");
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <Mail className="text-primary w-6 h-6" />
          Contact Form Inquiries
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Review, filter, and respond to incoming user & partnership inquiries from the landing page.
        </p>
      </div>

      {/* Filter Bar & Search */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="flex items-center gap-1.5 bg-card border border-border p-1 rounded-xl w-full sm:w-auto">
          {["all", "unread", "read", "replied"].map((tab) => (
            <button
              key={tab}
              onClick={() => handleStatusFilterChange(tab)}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg capitalize transition-all cursor-pointer ${
                selectedStatus === tab
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, email, subject..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="pl-9 h-10 bg-card border-border text-xs"
          />
        </div>
      </div>

      {/* Messages Card List / Table */}
      <Card className="border-border overflow-hidden">
        <CardContent className="p-0">
          {loadingContacts ? (
            <div className="flex flex-col items-center justify-center py-20 text-muted-foreground gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <p className="text-xs font-medium">Fetching contact entries...</p>
            </div>
          ) : !contacts || contacts.length === 0 ? (
            <div className="py-16 text-center text-muted-foreground space-y-1">
              <Mail className="w-10 h-10 mx-auto opacity-30 mb-2" />
              <p className="font-semibold text-sm">No contact messages found</p>
              <p className="text-xs">
                Inquiries submitted via the landing page will appear here.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-muted/50 border-b border-border text-muted-foreground font-semibold uppercase tracking-wider">
                  <tr>
                    <th className="px-4 py-3">Sender</th>
                    <th className="px-4 py-3">Subject</th>
                    <th className="px-4 py-3">Message Preview</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Date</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {contacts.map((msg) => {
                    const statusInfo = STATUS_VARIANTS[msg.status] || STATUS_VARIANTS.unread;

                    return (
                      <tr
                        key={msg._id}
                        className={`hover:bg-muted/20 transition-colors ${
                          msg.status === "unread" ? "font-semibold bg-primary/5" : ""
                        }`}
                      >
                        {/* Sender */}
                        <td className="px-4 py-3">
                          <div>
                            <p className="text-foreground leading-tight">{msg.fullName}</p>
                            <a
                              href={`mailto:${msg.email}`}
                              className="text-[11px] text-muted-foreground hover:underline"
                              onClick={(e) => e.stopPropagation()}
                            >
                              {msg.email}
                            </a>
                          </div>
                        </td>

                        {/* Subject */}
                        <td className="px-4 py-3 max-w-xs">
                          <p className="text-foreground truncate">{msg.subject}</p>
                        </td>

                        {/* Message Preview */}
                        <td className="px-4 py-3 max-w-sm">
                          <p className="text-muted-foreground line-clamp-1 italic font-normal">
                            &quot;{msg.message}&quot;
                          </p>
                        </td>

                        {/* Status */}
                        <td className="px-4 py-3">
                          <Badge
                            variant="outline"
                            className={`text-[10px] font-medium border ${statusInfo.class}`}
                          >
                            {statusInfo.label}
                          </Badge>
                        </td>

                        {/* Date */}
                        <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                          {new Date(msg.createdAt).toLocaleDateString(undefined, {
                            dateStyle: "short",
                          })}
                        </td>

                        {/* Actions */}
                        <td className="px-4 py-3 text-right space-x-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => openDetailModal(msg)}
                            className="h-8 text-xs cursor-pointer"
                          >
                            View
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => {
                              setSelectedMsg(msg);
                              setIsDeleteOpen(true);
                            }}
                            className="h-8 w-8 text-muted-foreground hover:text-destructive cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
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

      {/* Message Detail Modal */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        {selectedMsg && (
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <div className="flex items-center justify-between gap-2 pr-6">
                <DialogTitle className="text-base font-bold flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-primary" />
                  Inquiry Details
                </DialogTitle>
                <Badge
                  variant="outline"
                  className={`text-[10px] font-medium border ${
                    (STATUS_VARIANTS[selectedMsg.status] || STATUS_VARIANTS.unread).class
                  }`}
                >
                  {(STATUS_VARIANTS[selectedMsg.status] || STATUS_VARIANTS.unread).label}
                </Badge>
              </div>
              <DialogDescription className="text-xs">
                Submitted on {new Date(selectedMsg.createdAt).toLocaleString()}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-2 text-xs">
              <div className="grid grid-cols-2 gap-3 bg-muted/40 p-3 rounded-xl border border-border">
                <div>
                  <span className="text-muted-foreground block font-bold text-[9px] uppercase tracking-wider">
                    Sender Name
                  </span>
                  <span className="font-semibold text-foreground text-sm">
                    {selectedMsg.fullName}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground block font-bold text-[9px] uppercase tracking-wider">
                    Email Address
                  </span>
                  <a
                    href={`mailto:${selectedMsg.email}`}
                    className="font-semibold text-primary hover:underline text-sm truncate block"
                  >
                    {selectedMsg.email}
                  </a>
                </div>
              </div>

              <div>
                <span className="text-muted-foreground block font-bold text-[9px] uppercase tracking-wider mb-1">
                  Subject
                </span>
                <p className="font-semibold text-foreground text-sm bg-card border border-border p-2.5 rounded-lg">
                  {selectedMsg.subject}
                </p>
              </div>

              <div>
                <span className="text-muted-foreground block font-bold text-[9px] uppercase tracking-wider mb-1">
                  Message Content
                </span>
                <div className="bg-card border border-border p-3.5 rounded-lg text-foreground leading-relaxed whitespace-pre-wrap">
                  {selectedMsg.message}
                </div>
              </div>

              {/* Status Toggles */}
              <div className="pt-2 border-t border-border flex items-center justify-between">
                <span className="text-muted-foreground font-semibold text-[11px]">
                  Mark Status:
                </span>
                <div className="flex gap-1.5">
                  <Button
                    size="sm"
                    variant={selectedMsg.status === "unread" ? "default" : "outline"}
                    onClick={() => handleStatusChange(selectedMsg._id, "unread")}
                    className="h-7 text-[11px] px-2.5 cursor-pointer"
                  >
                    Unread
                  </Button>
                  <Button
                    size="sm"
                    variant={selectedMsg.status === "read" ? "default" : "outline"}
                    onClick={() => handleStatusChange(selectedMsg._id, "read")}
                    className="h-7 text-[11px] px-2.5 cursor-pointer"
                  >
                    Read
                  </Button>
                  <Button
                    size="sm"
                    variant={selectedMsg.status === "replied" ? "default" : "outline"}
                    onClick={() => handleStatusChange(selectedMsg._id, "replied")}
                    className="h-7 text-[11px] px-2.5 cursor-pointer"
                  >
                    Replied
                  </Button>
                </div>
              </div>
            </div>

            <DialogFooter className="flex gap-2 sm:justify-between border-t border-border pt-3">
              <Button
                variant="destructive"
                size="sm"
                onClick={() => setIsDeleteOpen(true)}
                className="cursor-pointer text-xs"
              >
                Delete Entry
              </Button>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsDetailOpen(false)}
                  className="cursor-pointer text-xs"
                >
                  Close
                </Button>
                <Button
                  size="sm"
                  onClick={() => window.open(`mailto:${selectedMsg.email}?subject=Re: ${selectedMsg.subject}`)}
                  className="cursor-pointer text-xs gap-1.5"
                >
                  <Reply className="w-3.5 h-3.5" /> Send Reply
                </Button>
              </div>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Trash2 className="w-5 h-5 text-red-500" /> Delete Contact Message
            </DialogTitle>
            <DialogDescription className="text-xs">
              Are you sure you want to delete this contact inquiry entry? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2 sm:justify-end mt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsDeleteOpen(false)}
              disabled={deleteLoading}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleDeleteConfirm}
              disabled={deleteLoading}
            >
              {deleteLoading ? <Loader2 className="w-4 h-4 animate-spin mr-1.5" /> : null}
              Confirm Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
