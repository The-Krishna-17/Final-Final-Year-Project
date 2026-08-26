"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  previewSkill,
  addOfferSkill,
  addWantSkill,
  clearPreview,
} from "@/store/features/skills/skillSlice";
import { SkillFormState, SkillPreview } from "@/store/features/skills/type";
import { toast } from "sonner";
import {
  Loader2,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  BadgeInfo,
  Pencil,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

// ─────────────────────────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const EMPTY_FORM: SkillFormState = {
  description: "",
  currentLevel: "",
  experience: "",
  goal: "",
  preferredLearningStyle: "",
  preferredSessionMode: "",
  availability: "",
  preferredLanguage: "",
};

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────

interface AddSkillDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** "offer" = teach, "want" = learn */
  listType: "offer" | "want";
  /** Called after a skill is successfully saved — use to re-fetch the profile */
  onSkillSaved?: () => void;
}

type Step = "form" | "preview" | "clarification";

// ─────────────────────────────────────────────────────────────────────────────
// BADGE — confidence meter
// ─────────────────────────────────────────────────────────────────────────────

const ConfidenceBadge = ({ confidence }: { confidence: number }) => {
  const color =
    confidence >= 75
      ? "text-emerald-600 bg-emerald-50 border-emerald-200"
      : confidence >= 45
        ? "text-amber-600 bg-amber-50 border-amber-200"
        : "text-rose-600 bg-rose-50 border-rose-200";

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium",
        color,
      )}
    >
      AI confidence: {confidence}%
    </span>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// CHIP LIST
// ─────────────────────────────────────────────────────────────────────────────

const ChipList = ({
  items,
  variant = "outline",
}: {
  items: string[];
  variant?: "outline" | "muted";
}) =>
  items.length === 0 ? (
    <span className="text-xs text-muted-foreground italic">
      None identified
    </span>
  ) : (
    <div className="flex flex-wrap gap-1.5">
      {items.map((item) => (
        <span
          key={item}
          className={cn(
            "rounded-md px-2 py-0.5 text-[11px] capitalize",
            variant === "outline"
              ? "border border-border text-muted-foreground"
              : "bg-muted text-muted-foreground",
          )}
        >
          {item}
        </span>
      ))}
    </div>
  );

// ─────────────────────────────────────────────────────────────────────────────
// PREVIEW PANEL — editable field row
// ─────────────────────────────────────────────────────────────────────────────

const PreviewField = ({
  label,
  value,
  editable,
  onChange,
}: {
  label: string;
  value: string;
  editable?: boolean;
  onChange?: (val: string) => void;
}) => (
  <div className="flex flex-col gap-1">
    <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
      {label}
    </span>
    {editable && onChange ? (
      <input
        className="rounded-md border border-border bg-background px-2.5 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    ) : (
      <span className="text-sm font-medium text-foreground">
        {value || "—"}
      </span>
    )}
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// SKELETON LOADER
// ─────────────────────────────────────────────────────────────────────────────

const SkillPreviewSkeleton = () => (
  <div className="space-y-6 pt-1 animate-pulse min-h-112.5">
    <div className="space-y-2">
      <Skeleton className="h-6 w-1/3 bg-muted/65" />
      <Skeleton className="h-4 w-2/3 bg-muted/65" />
    </div>

    {/* AI confidence meter skeleton */}
    <div className="flex items-center justify-between gap-2 border-b border-border pb-4">
      <Skeleton className="h-5 w-28 rounded-full bg-muted/65" />
      <Skeleton className="h-5 w-36 rounded-full bg-muted/65" />
    </div>

    {/* AI extracted data box skeleton */}
    <div className="rounded-lg border border-border bg-muted/20 p-4 space-y-4">
      <div className="flex items-center gap-1.5 mb-1">
        <Sparkles className="h-3.5 w-3.5 text-muted-foreground/60 animate-pulse" />
        <Skeleton className="h-3.5 w-32 bg-muted/65" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Skeleton className="h-3 w-16 bg-muted/65" />
          <Skeleton className="h-8 w-full bg-muted/65" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-3 w-16 bg-muted/65" />
          <Skeleton className="h-8 w-full bg-muted/65" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-3 w-16 bg-muted/65" />
          <Skeleton className="h-8 w-full bg-muted/65" />
        </div>
      </div>

      <div className="space-y-2">
        <Skeleton className="h-3 w-12 bg-muted/65" />
        <div className="flex gap-1.5">
          <Skeleton className="h-6 w-16 bg-muted/65" />
          <Skeleton className="h-6 w-20 bg-muted/65" />
          <Skeleton className="h-6 w-14 bg-muted/65" />
        </div>
      </div>

      <div className="space-y-2">
        <Skeleton className="h-3 w-20 bg-muted/65" />
        <div className="flex gap-1.5">
          <Skeleton className="h-6 w-24 bg-muted/65" />
          <Skeleton className="h-6 w-16 bg-muted/65" />
          <Skeleton className="h-6 w-28 bg-muted/65" />
        </div>
      </div>
    </div>

    {/* User Details box skeleton */}
    <div className="rounded-lg border border-border bg-muted/10 p-4 space-y-3">
      <Skeleton className="h-3.5 w-24 bg-muted/65" />
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Skeleton className="h-3 w-12 bg-muted/65" />
          <Skeleton className="h-4 w-20 bg-muted/65" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-3 w-20 bg-muted/65" />
          <Skeleton className="h-4 w-16 bg-muted/65" />
        </div>
      </div>
    </div>

    {/* Actions skeleton */}
    <div className="flex gap-2 pt-2">
      <Skeleton className="h-10 flex-1 bg-muted/65" />
      <Skeleton className="h-10 flex-1 bg-muted/65" />
    </div>
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

export const AddSkillDialog = ({
  open,
  onOpenChange,
  listType,
  onSkillSaved,
}: AddSkillDialogProps) => {
  const dispatch = useAppDispatch();
  const { loadingPreview, preview, loadingAddOffer, loadingAddWant } =
    useAppSelector((state) => state.skills);

  const [step, setStep] = useState<Step>("form");
  const [form, setForm] = useState<SkillFormState>(EMPTY_FORM);
  const [clarificationAnswer, setClarificationAnswer] = useState("");

  // Editable AI fields (user can correct after preview)
  const [editablePrimarySkill, setEditablePrimarySkill] = useState("");
  const [editableDomain, setEditableDomain] = useState("");
  const [editableCategory, setEditableCategory] = useState("");

  const isTeach = listType === "offer";
  const isLoading = loadingAddOffer || loadingAddWant;

  // ── helpers ───────────────────────────────────────────────────────────────

  const setField = <K extends keyof SkillFormState>(
    key: K,
    value: SkillFormState[K],
  ) => setForm((prev) => ({ ...prev, [key]: value }));

  const resetDialog = () => {
    setStep("form");
    setForm(EMPTY_FORM);
    setClarificationAnswer("");
    setEditablePrimarySkill("");
    setEditableDomain("");
    setEditableCategory("");
    dispatch(clearPreview());
  };

  const handleClose = (open: boolean) => {
    if (!open) resetDialog();
    onOpenChange(open);
  };

  // ── Step 1: submit description to AI ─────────────────────────────────────

  const handleAnalyse = async () => {
    const desc = clarificationAnswer.trim() || form.description.trim();
    if (!desc) {
      toast.error("Please describe the skill first.");
      return;
    }

    try {
      const result = await dispatch(
        previewSkill({
          description: desc,
          currentLevel: form.currentLevel || undefined,
          experience: form.experience || undefined,
          goal: form.goal || undefined,
          preferredLearningStyle: form.preferredLearningStyle || undefined,
          preferredSessionMode: form.preferredSessionMode || undefined,
          availability: form.availability || undefined,
          preferredLanguage: form.preferredLanguage || undefined,
        }),
      ).unwrap();

      const p: SkillPreview = result.data.preview;

      if (p.ai.needsClarification) {
        setStep("clarification");
        return;
      }

      // Seed editable AI fields from the preview
      setEditablePrimarySkill(p.ai.primarySkill);
      setEditableDomain(p.ai.domain);
      setEditableCategory(p.ai.category);
      setStep("preview");
    } catch (err: any) {
      toast.error(err || "AI analysis failed. Please try again.");
    }
  };

  // ── Step 2: confirm and save ───────────────────────────────────────────

  const handleConfirm = async () => {
    if (!preview) return;

    const payload = {
      description: form.description.trim() || clarificationAnswer.trim(),
      currentLevel: form.currentLevel || undefined,
      experience: form.experience || undefined,
      goal: form.goal || undefined,
      preferredLearningStyle: form.preferredLearningStyle || undefined,
      preferredSessionMode: form.preferredSessionMode || undefined,
      availability: form.availability || undefined,
      preferredLanguage: form.preferredLanguage || undefined,
      ai: {
        ...preview.ai,
        primarySkill: editablePrimarySkill,
        domain: editableDomain,
        category: editableCategory,
      },
    };

    try {
      if (isTeach) {
        await dispatch(addOfferSkill(payload)).unwrap();
        toast.success(
          `"${editablePrimarySkill}" added to your teaching skills!`,
        );
      } else {
        await dispatch(addWantSkill(payload)).unwrap();
        toast.success(
          `"${editablePrimarySkill}" added to your learning goals!`,
        );
      }
      resetDialog();
      onOpenChange(false);
      onSkillSaved?.();
    } catch (err: any) {
      toast.error(err || "Failed to save skill. Please try again.");
    }
  };

  // ─────────────────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────────────────

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-xl min-h-112.5 max-h-[90vh] overflow-y-auto">
        {loadingPreview ? (
          <SkillPreviewSkeleton />
        ) : (
          <>
            {/* ── STEP: FORM ──────────────────────────────────────────────── */}
            {step === "form" && (
              <>
                <DialogHeader>
                  <DialogTitle>
                    {isTeach
                      ? "What can you teach?"
                      : "What do you want to learn?"}
                  </DialogTitle>
                  <DialogDescription>
                    {isTeach
                      ? "Describe your skill and fill in optional details. AI will structure the rest."
                      : "Describe what you want to learn and add context. AI will create a learning profile."}
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-5 pt-1">
                  {/* Description — required */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium">
                      {isTeach
                        ? "Describe your skill"
                        : "Describe your learning goal"}
                      <span className="ml-1 text-destructive">*</span>
                    </label>
                    <textarea
                      id={`${listType}-description`}
                      placeholder={
                        isTeach
                          ? "I can teach React including hooks, context, Redux and real-world project structure…"
                          : "I want to learn React to build scalable frontend applications…"
                      }
                      value={form.description}
                      onChange={(e) => setField("description", e.target.value)}
                      className="w-full min-h-25 resize-none rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>

                  {/* Current Skill Level — required */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium">
                      Current Skill Level
                      <span className="ml-1 text-destructive">*</span>
                    </label>
                    <div className="flex gap-2">
                      {(["Beginner", "Intermediate", "Advanced"] as const).map(
                        (level) => (
                          <button
                            key={level}
                            type="button"
                            onClick={() => setField("currentLevel", level)}
                            className={cn(
                              "flex-1 rounded-lg border px-3 py-2 text-xs font-medium transition-colors cursor-pointer",
                              form.currentLevel === level
                                ? "border-primary bg-primary text-primary-foreground"
                                : "border-border bg-background text-muted-foreground hover:border-primary/50",
                            )}
                          >
                            {level}
                          </button>
                        ),
                      )}
                    </div>
                  </div>

                  {/* Optional fields divider */}
                  <div className="flex items-center gap-2">
                    <div className="h-px flex-1 bg-border" />
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                      Optional details
                    </span>
                    <div className="h-px flex-1 bg-border" />
                  </div>

                  {/* Previous Experience */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-muted-foreground">
                      Previous Experience
                    </label>
                    <input
                      id={`${listType}-experience`}
                      type="text"
                      placeholder="I already know HTML, CSS and JavaScript…"
                      value={form.experience}
                      onChange={(e) => setField("experience", e.target.value)}
                      className="rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>

                  {/* Goal */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-muted-foreground">
                      {isTeach ? "Teaching Goal" : "Learning Goal"}
                    </label>
                    <input
                      id={`${listType}-goal`}
                      type="text"
                      placeholder={
                        isTeach
                          ? "Help students build production-ready apps…"
                          : "Build portfolio projects and get a frontend job…"
                      }
                      value={form.goal}
                      onChange={(e) => setField("goal", e.target.value)}
                      className="rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>

                  {/* 2-column optional selects */}
                  <div className="grid grid-cols-2 gap-3">
                    {/* Preferred Learning Style */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm font-medium text-muted-foreground">
                        {isTeach ? "Teaching Style" : "Learning Style"}
                      </label>
                      <Select
                        value={form.preferredLearningStyle}
                        onValueChange={(v) =>
                          setField(
                            "preferredLearningStyle",
                            v as SkillFormState["preferredLearningStyle"],
                          )
                        }
                      >
                        <SelectTrigger className="text-sm cursor-pointer">
                          <SelectValue placeholder="Select style" />
                        </SelectTrigger>
                        <SelectContent>
                          {[
                            "Project Based",
                            "Theory First",
                            "Hands-on",
                            "Flexible",
                          ].map((s) => (
                            <SelectItem
                              key={s}
                              value={s}
                              className="cursor-pointer"
                            >
                              {s}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Preferred Session Mode */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm font-medium text-muted-foreground">
                        Session Mode
                      </label>
                      <Select
                        value={form.preferredSessionMode}
                        onValueChange={(v) =>
                          setField(
                            "preferredSessionMode",
                            v as SkillFormState["preferredSessionMode"],
                          )
                        }
                      >
                        <SelectTrigger className="text-sm cursor-pointer">
                          <SelectValue placeholder="Select mode" />
                        </SelectTrigger>
                        <SelectContent>
                          {["Online", "Offline", "Hybrid"].map((m) => (
                            <SelectItem
                              key={m}
                              value={m}
                              className="cursor-pointer"
                            >
                              {m}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Availability */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm font-medium text-muted-foreground">
                        Availability
                      </label>
                      <Select
                        value={form.availability}
                        onValueChange={(v) =>
                          setField(
                            "availability",
                            v as SkillFormState["availability"],
                          )
                        }
                      >
                        <SelectTrigger className="text-sm cursor-pointer">
                          <SelectValue placeholder="Select time" />
                        </SelectTrigger>
                        <SelectContent>
                          {["Weekends", "Weekdays", "Evenings"].map((a) => (
                            <SelectItem
                              key={a}
                              value={a}
                              className="cursor-pointer"
                            >
                              {a}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Preferred Language */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm font-medium text-muted-foreground">
                        Preferred Language
                      </label>
                      <Select
                        value={form.preferredLanguage}
                        onValueChange={(v) =>
                          setField(
                            "preferredLanguage",
                            v as SkillFormState["preferredLanguage"],
                          )
                        }
                      >
                        <SelectTrigger className="text-sm cursor-pointer">
                          <SelectValue placeholder="Select language" />
                        </SelectTrigger>
                        <SelectContent>
                          {["English", "Nepali"].map((l) => (
                            <SelectItem
                              key={l}
                              value={l}
                              className="cursor-pointer"
                            >
                              {l}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* AI info note */}
                  <div className="flex items-start gap-2 rounded-lg bg-muted/40 p-3 text-xs text-muted-foreground">
                    <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-foreground" />
                    <span>
                      AI will extract{" "}
                      <span className="font-medium text-foreground">
                        skill name, domain, topics, technologies, keywords and
                        related skills
                      </span>{" "}
                      from your description. All other fields come directly from
                      you.
                    </span>
                  </div>

                  {/* Action */}
                  <Button
                    className="w-full"
                    onClick={handleAnalyse}
                    disabled={
                      loadingPreview ||
                      !form.description.trim() ||
                      !form.currentLevel
                    }
                  >
                    {loadingPreview ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Analysing with AI…
                      </>
                    ) : (
                      <>
                        <Sparkles className="mr-2 h-4 w-4" />
                        Analyse &amp; Preview
                        <ChevronRight className="ml-auto h-4 w-4" />
                      </>
                    )}
                  </Button>
                </div>
              </>
            )}

            {/* ── STEP: CLARIFICATION ─────────────────────────────────────── */}
            {step === "clarification" && preview && (
              <>
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <HelpCircle className="h-5 w-5 text-amber-500" />
                    Clarification Needed
                  </DialogTitle>
                  <DialogDescription>
                    AI needs a bit more context to accurately categorise your
                    skill.
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-5 pt-1">
                  <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-300">
                    <p className="font-medium">
                      {preview.ai.clarificationQuestion}
                    </p>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium">Your answer</label>
                    <textarea
                      id="clarification-answer"
                      placeholder="e.g. I mean React.js for building UI components…"
                      value={clarificationAnswer}
                      onChange={(e) => setClarificationAnswer(e.target.value)}
                      className="w-full min-h-20 resize-none rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => setStep("form")}
                    >
                      <ChevronLeft className="mr-2 h-4 w-4" />
                      Back
                    </Button>
                    <Button
                      className="flex-1"
                      onClick={handleAnalyse}
                      disabled={loadingPreview || !clarificationAnswer.trim()}
                    >
                      {loadingPreview ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Re-analysing…
                        </>
                      ) : (
                        <>
                          <Sparkles className="mr-2 h-4 w-4" />
                          Re-analyse
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </>
            )}

            {/* ── STEP: PREVIEW ───────────────────────────────────────────── */}
            {step === "preview" && preview && (
              <>
                <DialogHeader>
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <DialogTitle className="flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                      Review &amp; Confirm
                    </DialogTitle>
                    <ConfidenceBadge confidence={preview.ai.confidence} />
                  </div>
                  <DialogDescription>
                    AI has structured your skill. Review every field and edit if
                    needed before saving.
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-5 pt-1">
                  {/* AI-extracted core */}
                  <div className="rounded-lg border border-border bg-muted/20 p-4 space-y-4">
                    <div className="flex items-center gap-1.5 mb-1">
                      <Sparkles className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                        AI-extracted data
                      </span>
                      <span className="ml-auto">
                        <Pencil className="h-3 w-3 text-muted-foreground" />
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <PreviewField
                        label="Primary Skill"
                        value={editablePrimarySkill}
                        editable
                        onChange={setEditablePrimarySkill}
                      />
                      <PreviewField
                        label="Domain"
                        value={editableDomain}
                        editable
                        onChange={setEditableDomain}
                      />
                      <PreviewField
                        label="Category"
                        value={editableCategory}
                        editable
                        onChange={setEditableCategory}
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                        Topics
                      </span>
                      <ChipList items={preview.ai.topics} variant="outline" />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                        Technologies
                      </span>
                      <ChipList
                        items={preview.ai.technologies}
                        variant="outline"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                        Related Skills
                      </span>
                      <ChipList
                        items={preview.ai.relatedSkills}
                        variant="muted"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                        Keywords
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {preview.ai.keywords.slice(0, 8).map((k) => (
                          <span
                            key={k}
                            className="rounded-md bg-muted px-2 py-0.5 text-[11px] text-muted-foreground"
                          >
                            #{k}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* User-provided confirmed fields */}
                  <div className="rounded-lg border border-border bg-muted/10 p-4 space-y-3">
                    <div className="flex items-center gap-1.5 mb-1">
                      <BadgeInfo className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                        Your details
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-0.5">
                          Level
                        </p>
                        <p className="font-medium">
                          {form.currentLevel || "—"}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-0.5">
                          Session Mode
                        </p>
                        <p className="font-medium">
                          {form.preferredSessionMode || "—"}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-0.5">
                          Availability
                        </p>
                        <p className="font-medium">
                          {form.availability || "—"}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-0.5">
                          Language
                        </p>
                        <p className="font-medium">
                          {form.preferredLanguage || "—"}
                        </p>
                      </div>
                    </div>

                    {form.goal && (
                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-0.5">
                          Goal
                        </p>
                        <p className="text-sm">{form.goal}</p>
                      </div>
                    )}

                    {form.experience && (
                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-0.5">
                          Prior Experience
                        </p>
                        <p className="text-sm">{form.experience}</p>
                      </div>
                    )}
                  </div>

                  {preview.ai.confidence < 50 && (
                    <div className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-300">
                      <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                      <span>
                        Low confidence — please review the extracted data
                        carefully before saving.
                      </span>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => setStep("form")}
                    >
                      <ChevronLeft className="mr-2 h-4 w-4" />
                      Edit Form
                    </Button>
                    <Button
                      className="flex-1"
                      onClick={handleConfirm}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Saving…
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="mr-2 h-4 w-4" />
                          Confirm &amp; Save
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </>
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};
