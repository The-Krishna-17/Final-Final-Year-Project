"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  updateSkill,
  removeSkill,
  getUserSkills,
} from "@/store/features/skills/skillSlice";
import { SkillItem } from "@/store/features/skills/type";
import { AddSkillDialog } from "@/components/AddSkillDialog";
import { IoSchoolSharp } from "react-icons/io5";
import { MdAdd, MdMenuBook } from "react-icons/md";
import { toast } from "sonner";
import {
  Loader2,
  Trash2,
  Pencil,
  Sparkles,
  Globe,
  Monitor,
  Calendar,
  Languages,
  Target,
  BookOpen,
} from "lucide-react";
import { getMe } from "@/store/features/auth/authSlice";
import { cn } from "@/lib/utils";

// ─────────────────────────────────────────────────────────────────────────────
// LEVEL INDICATOR
// ─────────────────────────────────────────────────────────────────────────────

const LevelDots = ({ level }: { level: string | null }) => {
  const n = level === "Advanced" ? 3 : level === "Intermediate" ? 2 : 1;
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3].map((d) => (
        <span
          key={d}
          className={cn(
            "h-1.5 w-1.5 rounded-sm",
            d <= n ? "bg-foreground" : "bg-muted",
          )}
        />
      ))}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// SKILL CARD
// ─────────────────────────────────────────────────────────────────────────────

interface SkillCardProps {
  skill: SkillItem;
  index: number;
  listType: "offer" | "want";
  onEdit: (skill: SkillItem, listType: "offer" | "want") => void;
  onRemove: (skillId: string, listType: "offer" | "want") => Promise<void>;
  removingId: string | null;
}

const SkillCard = ({
  skill,
  index,
  listType,
  onEdit,
  onRemove,
  removingId,
}: SkillCardProps) => {
  const ai = skill.ai;
  const label = ai?.primarySkill || skill.rawInput || "Unknown Skill";
  const domain = ai?.domain || "General";
  const category = ai?.category || domain;

  const metaItems = [
    skill.preferredSessionMode && {
      icon: <Monitor className="h-3 w-3" />,
      label: skill.preferredSessionMode,
    },
    skill.availability && {
      icon: <Calendar className="h-3 w-3" />,
      label: skill.availability,
    },
    skill.preferredLanguage && {
      icon: <Languages className="h-3 w-3" />,
      label: skill.preferredLanguage,
    },
  ].filter(Boolean) as { icon: React.ReactNode; label: string }[];

  return (
    <div className="group w-80 shrink-0 rounded-xl border border-border bg-background p-5 transition-colors hover:border-primary/50 border-b-4 border-b-primary flex flex-col gap-0">
      {/* Header row */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] tabular-nums text-muted-foreground">
              {String(index + 1).padStart(2, "0")}
            </span>
            <span className="text-[11px] font-medium px-2 py-0.5 rounded-full border border-border text-muted-foreground">
              {category}
            </span>
          </div>
          <h3 className="mt-1.5 text-base font-semibold capitalize">{label}</h3>
          {skill.rawInput && (
            <p className="mt-1 line-clamp-2 text-xs italic text-muted-foreground">
              &ldquo;{skill.rawInput}&rdquo;
            </p>
          )}
        </div>
      </div>

      {/* Level + actions */}
      <div className="mt-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <LevelDots level={skill.currentLevel} />
          <span className="text-[11px] text-muted-foreground">
            {skill.currentLevel || "No level set"}
          </span>
        </div>

        <div className="flex items-center gap-1 opacity-70 group-hover:opacity-100 transition-opacity">
          <Button
            size="icon"
            variant="ghost"
            className="h-7 w-7 border border-transparent hover:bg-accent hover:text-accent-foreground"
            onClick={() => onEdit(skill, listType)}
          >
            <Pencil className="h-3.5 w-3.5" />
          </Button>

          {/* Delete confirmation */}
          <Dialog>
            <DialogTrigger asChild>
              <Button
                size="icon"
                variant="ghost"
                className="h-7 w-7 border border-transparent hover:bg-destructive/10 hover:text-destructive"
              >
                {removingId === skill._id ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Trash2 className="h-3.5 w-3.5" />
                )}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-sm">
              <DialogHeader>
                <DialogTitle>Remove skill</DialogTitle>
                <DialogDescription>
                  This will remove{" "}
                  <span className="font-medium text-foreground capitalize">
                    {label}
                  </span>{" "}
                  from your {listType === "offer" ? "teaching" : "learning"}{" "}
                  profile.
                </DialogDescription>
              </DialogHeader>
              <div className="rounded-lg border bg-muted/50 p-4">
                <p className="text-base font-medium capitalize">{label}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {domain} · {skill.currentLevel || "No level"}
                </p>
              </div>
              <DialogFooter>
                <Button
                  variant="destructive"
                  disabled={removingId === skill._id}
                  onClick={() => onRemove(skill._id, listType)}
                  className="w-full"
                >
                  {removingId === skill._id ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Removing…
                    </>
                  ) : (
                    <>
                      <Trash2 className="mr-2 h-4 w-4" />
                      Remove
                    </>
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Divider */}
      {(ai?.topics?.length > 0 ||
        ai?.technologies?.length > 0 ||
        metaItems.length > 0) && <div className="my-3 h-px bg-border" />}

      {/* Topics */}
      {ai?.topics?.length > 0 && (
        <div className="mb-2.5">
          <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
            Topics
          </p>
          <div className="flex flex-wrap gap-1.5">
            {ai.topics.map((topic) => (
              <span
                key={topic}
                className="rounded-md border border-border px-2 py-0.5 text-[11px] capitalize text-muted-foreground"
              >
                {topic}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Technologies */}
      {ai?.technologies?.length > 0 && (
        <div className="mb-2.5">
          <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
            Technologies
          </p>
          <div className="flex flex-wrap gap-1.5">
            {ai.technologies.map((t) => (
              <span
                key={t}
                className="rounded-md bg-muted px-2 py-0.5 text-[11px] text-muted-foreground"
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Meta pills (session mode, availability, language) */}
      {metaItems.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {metaItems.map(({ icon, label: meta }) => (
            <span
              key={meta}
              className="inline-flex items-center gap-1 rounded-full border border-border px-2 py-0.5 text-[10px] text-muted-foreground"
            >
              {icon}
              {meta}
            </span>
          ))}
        </div>
      )}

      {/* Goal / Experience snippets */}
      {skill.goal && (
        <div className="mt-2.5 flex items-start gap-1.5">
          <Target className="mt-0.5 h-3 w-3 shrink-0 text-muted-foreground" />
          <p className="text-[11px] text-muted-foreground line-clamp-2">
            {skill.goal}
          </p>
        </div>
      )}

      {/* AI confidence */}
      {typeof ai?.confidence === "number" && (
        <div className="mt-2.5 flex items-center gap-1.5">
          <Sparkles className="h-3 w-3 text-muted-foreground" />
          <span className="text-[10px] text-muted-foreground">
            AI confidence: {ai.confidence}%
          </span>
        </div>
      )}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// EMPTY STATE
// ─────────────────────────────────────────────────────────────────────────────

const EmptyState = ({
  listType,
  onAdd,
}: {
  listType: "offer" | "want";
  onAdd: () => void;
}) => {
  const isTeach = listType === "offer";
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col items-center justify-center rounded-xl border-2 border-primary/50 border-dashed bg-muted/30 py-10 text-center">
        <div className="mb-3 rounded-full bg-primary p-4">
          {isTeach ? (
            <IoSchoolSharp className="h-6 w-6 text-primary-foreground" />
          ) : (
            <MdMenuBook className="h-6 w-6 text-primary-foreground" />
          )}
        </div>
        <h4 className="mb-1 font-semibold text-primary">
          {isTeach
            ? "Ready to inspire others?"
            : "Ready to learn something new?"}
        </h4>
        <p className="mb-0 max-w-64 text-sm text-muted-foreground">
          {isTeach
            ? "Share what you know and connect with people eager to learn from your experience."
            : "Add skills you're interested in learning and we'll match you with the right mentors."}
        </p>
      </div>
      <Button
        variant="outline"
        className="w-full bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground"
        onClick={onAdd}
      >
        <MdAdd className="mr-2 h-4 w-4" />
        {isTeach ? "Add Teaching Skill" : "Add Learning Skill"}
      </Button>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// PAGE
// ─────────────────────────────────────────────────────────────────────────────

const MySkillsPage = () => {
  const dispatch = useAppDispatch();
  const { profile, loadingUpdate } = useAppSelector((state) => state.skills);
  const { user } = useAppSelector((state) => state.auth);

  const offerSkills = profile?.offerSkills ?? [];
  const wantSkills = profile?.wantSkills ?? [];

  // Add-skill dialogs
  const [openOfferDialog, setOpenOfferDialog] = useState(false);
  const [openWantDialog, setOpenWantDialog] = useState(false);

  // Update dialog
  const [updateTarget, setUpdateTarget] = useState<{
    skill: SkillItem;
    listType: "offer" | "want";
  } | null>(null);
  const [updateLevel, setUpdateLevel] = useState<
    "Beginner" | "Intermediate" | "Advanced"
  >("Beginner");

  // Remove state
  const [removingSkillId, setRemovingSkillId] = useState<string | null>(null);

  useEffect(() => {
    dispatch(getMe());
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      const userId = user._id || user.id;
      if (userId) dispatch(getUserSkills(userId.toString()));
    }
  }, [dispatch, user]);

  // ── Handlers ──────────────────────────────────────────────────────────────

  const handleRemoveSkill = async (
    skillId: string,
    listType: "offer" | "want",
  ) => {
    setRemovingSkillId(skillId);
    try {
      await dispatch(removeSkill({ skillId, listType })).unwrap();
      toast.success("Skill removed successfully!");
    } catch (error: any) {
      toast.error(error || "Failed to remove skill");
    } finally {
      setRemovingSkillId(null);
    }
  };

  const openUpdateFor = (skill: SkillItem, listType: "offer" | "want") => {
    setUpdateTarget({ skill, listType });
    setUpdateLevel(
      (skill.currentLevel as "Beginner" | "Intermediate" | "Advanced") ||
        "Beginner",
    );
  };

  const handleUpdateSkill = async () => {
    if (!updateTarget) return;
    try {
      await dispatch(
        updateSkill({
          skillId: updateTarget.skill._id,
          listType: updateTarget.listType,
          currentLevel: updateLevel,
        }),
      ).unwrap();
      toast.success("Skill updated successfully!");
      setUpdateTarget(null);
    } catch (error: any) {
      toast.error(error || "Failed to update skill");
    }
  };

  // ─────────────────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-6">
      {/* ── Top Bar ── */}
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <h1 className="font-semibold text-2xl">My Skills</h1>
          <h2 className="text-base text-muted-foreground">
            Describe what you can teach or want to learn — our AI structures it
            for you.
          </h2>
        </div>
      </div>

      <div className="flex flex-col gap-10">
        {/* ══ Skills I Want to Learn ══════════════════════════════════════ */}
        <section className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-primary p-2.5">
                <MdMenuBook className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                  Want to learn
                </p>
                <h3 className="font-semibold leading-tight">
                  Skills I Want to Learn
                </h3>
              </div>
            </div>
            <span className="rounded-full border border-border px-3 py-1 text-xs font-medium tabular-nums text-muted-foreground">
              {wantSkills.length}
            </span>
          </div>

          {wantSkills.length === 0 ? (
            <EmptyState listType="want" onAdd={() => setOpenWantDialog(true)} />
          ) : (
            <div
              className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1"
              style={{ msOverflowStyle: "none", scrollbarWidth: "none" }}
            >
              {wantSkills.map((skill, i) => (
                <SkillCard
                  key={skill._id}
                  skill={skill}
                  index={i}
                  listType="want"
                  onEdit={openUpdateFor}
                  onRemove={handleRemoveSkill}
                  removingId={removingSkillId}
                />
              ))}

              {/* Add more card */}
              <button
                onClick={() => setOpenWantDialog(true)}
                className="w-40 shrink-0 rounded-xl flex flex-col items-center justify-center gap-2 text-muted-foreground hover:bg-muted/30 hover:text-primary transition-colors border-2 border-primary/50 border-dashed cursor-pointer"
              >
                <MdAdd className="h-5 w-5" />
                <span className="text-xs font-medium">Add Learning Skill</span>
              </button>
            </div>
          )}
        </section>

        {/* ══ Skills I Can Teach ═════════════════════════════════════════ */}
        <section className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-primary p-2.5">
                <IoSchoolSharp className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                  Can teach
                </p>
                <h3 className="font-semibold leading-tight">
                  Skills I Can Teach
                </h3>
              </div>
            </div>
            <span className="rounded-full border border-border px-3 py-1 text-xs font-medium tabular-nums text-muted-foreground">
              {offerSkills.length}
            </span>
          </div>

          {offerSkills.length === 0 ? (
            <EmptyState
              listType="offer"
              onAdd={() => setOpenOfferDialog(true)}
            />
          ) : (
            <div
              className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1"
              style={{ msOverflowStyle: "none", scrollbarWidth: "none" }}
            >
              {offerSkills.map((skill, i) => (
                <SkillCard
                  key={skill._id}
                  skill={skill}
                  index={i}
                  listType="offer"
                  onEdit={openUpdateFor}
                  onRemove={handleRemoveSkill}
                  removingId={removingSkillId}
                />
              ))}

              {/* Add more card */}
              <button
                onClick={() => setOpenOfferDialog(true)}
                className="w-40 shrink-0 rounded-xl flex flex-col items-center justify-center gap-2 text-muted-foreground hover:bg-muted/30 hover:text-primary transition-colors border-2 border-primary/50 border-dashed cursor-pointer"
              >
                <MdAdd className="h-5 w-5" />
                <span className="text-xs font-medium">Add Teaching Skill</span>
              </button>
            </div>
          )}
        </section>
      </div>

      {/* ── Add-skill dialogs (multi-step) ─────────────────────────────── */}
      <AddSkillDialog
        open={openWantDialog}
        onOpenChange={setOpenWantDialog}
        listType="want"
      />
      <AddSkillDialog
        open={openOfferDialog}
        onOpenChange={setOpenOfferDialog}
        listType="offer"
      />

      {/* ── Update Level Dialog ────────────────────────────────────────── */}
      <Dialog
        open={!!updateTarget}
        onOpenChange={(open) => !open && setUpdateTarget(null)}
      >
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Update Skill Level</DialogTitle>
            <DialogDescription>
              Update the level for{" "}
              <span className="font-semibold capitalize">
                {updateTarget?.skill.ai?.primarySkill ||
                  updateTarget?.skill.rawInput ||
                  "this skill"}
              </span>
              .
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <div className="flex gap-2">
              {(["Beginner", "Intermediate", "Advanced"] as const).map(
                (level) => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setUpdateLevel(level)}
                    className={cn(
                      "flex-1 rounded-lg border px-3 py-2.5 text-xs font-medium transition-colors cursor-pointer",
                      updateLevel === level
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

          <DialogFooter>
            <Button
              onClick={handleUpdateSkill}
              disabled={loadingUpdate}
              className="w-full"
            >
              {loadingUpdate ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving…
                </>
              ) : (
                <>
                  <Pencil className="mr-2 h-4 w-4" />
                  Save Changes
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MySkillsPage;
