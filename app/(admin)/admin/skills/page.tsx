"use client";

import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  fetchSkillsTaxonomy,
  overrideSkillAIClassification,
} from "@/store/features/admin/adminSlice";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  RiBrainLine,
  RiAlertLine,
  RiCheckDoubleLine,
  RiEditBoxLine,
  RiFolder3Line,
} from "react-icons/ri";

export default function AdminSkillsPage() {
  const dispatch = useAppDispatch();
  const { taxonomy, loadingTaxonomy } = useAppSelector((s) => s.admin);

  // Edit Modal state
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [primarySkillInput, setPrimarySkillInput] = useState("");
  const [domainInput, setDomainInput] = useState("");
  const [categoryInput, setCategoryInput] = useState("");

  useEffect(() => {
    dispatch(fetchSkillsTaxonomy());
  }, [dispatch]);

  const openOverrideModal = (item: any) => {
    setSelectedItem(item);
    setPrimarySkillInput(item.ai?.primarySkill || item.rawInput || "");
    setDomainInput(item.ai?.domain || "General");
    setCategoryInput(item.ai?.category || "General");
    setIsEditOpen(true);
  };

  const handleSaveOverride = async () => {
    if (!selectedItem) return;
    try {
      await dispatch(
        overrideSkillAIClassification({
          profileId: selectedItem.profileId,
          skillId: selectedItem.skillId,
          primarySkill: primarySkillInput,
          domain: domainInput,
          category: categoryInput,
        })
      ).unwrap();
      toast.success("AI classification overridden successfully");
      setIsEditOpen(false);
    } catch (err: any) {
      toast.error(err || "Failed to override skill AI data");
    }
  };

  if (loadingTaxonomy || !taxonomy) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-muted-foreground gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="text-xs font-medium">Loading AI Skill taxonomy...</p>
      </div>
    );
  }

  const domainCounts = taxonomy?.domainCounts || {};
  const lowConfidenceQueue = taxonomy?.lowConfidenceQueue || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <RiBrainLine className="text-primary" />
          AI Skill Taxonomy & Knowledge Base
        </h1>
        <p className="text-sm text-muted-foreground mt-1.5">
          Monitor Google Gemini AI skill extraction accuracy, inspect domain distributions, and resolve low-confidence extractions.
        </p>
      </div>

      {/* Domain Distribution Cards */}
      <Card className="border-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <RiFolder3Line className="text-primary" />
            Domain Category Breakdown
          </CardTitle>
          <CardDescription className="text-xs">
            Distribution of user skills categorized by AI domain ontology.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            {Object.keys(domainCounts).length === 0 ? (
              <p className="text-xs text-muted-foreground py-2 col-span-full">No domain entries recorded yet.</p>
            ) : (
              Object.entries(domainCounts).map(([dom, count]) => (
                <div key={dom} className="p-3 rounded-xl border border-border bg-card text-center space-y-1">
                  <span className="text-xs font-medium text-muted-foreground block truncate capitalize">{dom}</span>
                  <span className="text-xl font-bold text-foreground block">{count}</span>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Low-Confidence AI Skill Queue */}
      <Card className="border-border">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <RiAlertLine className="text-amber-500" />
                Low-Confidence AI Queue ({lowConfidenceQueue.length})
              </CardTitle>
              <CardDescription className="text-xs">
                Skill extractions with AI confidence score &lt; 60% or marked as needing clarification.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {lowConfidenceQueue.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground space-y-1">
              <RiCheckDoubleLine className="text-4xl text-green-500 mx-auto mb-2 opacity-80" />
              <p className="font-semibold text-sm">All skills classified with high confidence!</p>
              <p className="text-xs">No pending items in the AI review queue.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-muted/50 border-b border-border text-muted-foreground font-semibold uppercase tracking-wider">
                  <tr>
                    <th className="px-4 py-3">User</th>
                    <th className="px-4 py-3">Raw Input Description</th>
                    <th className="px-4 py-3">AI Extracted Skill</th>
                    <th className="px-4 py-3">Domain</th>
                    <th className="px-4 py-3">Confidence</th>
                    <th className="px-4 py-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {lowConfidenceQueue.map((item) => (
                    <tr key={item.skillId} className="hover:bg-muted/20 transition-colors">
                      <td className="px-4 py-3">
                        <div>
                          <p className="font-semibold text-foreground">
                            {item.user?.firstName} {item.user?.lastName}
                          </p>
                          <p className="text-[10px] text-muted-foreground">{item.user?.email}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3 max-w-xs truncate font-medium text-foreground">
                        "{item.rawInput}"
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-semibold text-primary">{item.ai?.primarySkill || "Unassigned"}</span>
                      </td>
                      <td className="px-4 py-3">{item.ai?.domain || "General"}</td>
                      <td className="px-4 py-3">
                        <Badge
                          variant="outline"
                          className={`text-[10px] ${
                            (item.ai?.confidence || 0) < 40
                              ? "bg-red-500/10 text-red-600 border-red-500/20"
                              : "bg-amber-500/10 text-amber-600 border-amber-500/20"
                          }`}
                        >
                          {item.ai?.confidence || 0}%
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-7 text-xs gap-1"
                          onClick={() => openOverrideModal(item)}
                        >
                          <RiEditBoxLine /> Override
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Admin Override Skill Modal */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Override AI Classification</DialogTitle>
            <DialogDescription className="text-xs">
              Manually specify the primary skill, domain, and category. This will set confidence to 100% (Admin Verified).
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2 text-xs">
            <div>
              <label className="font-semibold text-muted-foreground block mb-1">User Raw Input</label>
              <div className="p-2.5 rounded-lg bg-muted/40 border border-border text-foreground font-mono text-[11px]">
                "{selectedItem?.rawInput}"
              </div>
            </div>

            <div>
              <label className="font-semibold text-muted-foreground block mb-1">Primary Skill Name</label>
              <Input
                value={primarySkillInput}
                onChange={(e) => setPrimarySkillInput(e.target.value)}
                placeholder="e.g. React.js"
                className="h-9 text-xs"
              />
            </div>

            <div>
              <label className="font-semibold text-muted-foreground block mb-1">Domain</label>
              <Input
                value={domainInput}
                onChange={(e) => setDomainInput(e.target.value)}
                placeholder="e.g. Technology & Engineering"
                className="h-9 text-xs"
              />
            </div>

            <div>
              <label className="font-semibold text-muted-foreground block mb-1">Category</label>
              <Input
                value={categoryInput}
                onChange={(e) => setCategoryInput(e.target.value)}
                placeholder="e.g. Frontend Development"
                className="h-9 text-xs"
              />
            </div>
          </div>

          <DialogFooter className="gap-2 sm:justify-end">
            <Button variant="outline" size="sm" className="rounded-lg" onClick={() => setIsEditOpen(false)}>
              Cancel
            </Button>
            <Button size="sm" className="rounded-lg" onClick={handleSaveOverride}>
              Save & Verify
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
