"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
  addOfferSkill,
  addWantSkill,
  updateSkill,
  removeSkill,
  getUserSkills,
} from "@/store/features/skills/skillSlice";
import { IoSchoolSharp } from "react-icons/io5";
import { MdAdd, MdMenuBook } from "react-icons/md";
import { toast } from "sonner";
import { Loader2, Star, Trash2, Pencil, Sparkles } from "lucide-react";
import { getMe } from "@/store/features/auth/authSlice";

const MySkillsPage = () => {
  const dispatch = useAppDispatch();
  const { profile, loadingAddOffer, loadingAddWant, loadingUpdate } =
    useAppSelector((state) => state.skills);

  const { user } = useAppSelector((state) => state.auth);

  const offerSkills = profile?.offerSkills;
  const wantSkills = profile?.wantSkills;

  // Dialog state for Offer Skills
  const [openOfferDialog, setOpenOfferDialog] = useState(false);
  const [offerSkillInput, setOfferSkillInput] = useState("");

  // Dialog state for Want Skills
  const [openWantDialog, setOpenWantDialog] = useState(false);
  const [wantSkillInput, setWantSkillInput] = useState("");

  // Update dialog state
  const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
  const [updateSkillId, setUpdateSkillId] = useState("");
  const [updateListType, setUpdateListType] = useState<"offer" | "want">(
    "offer",
  );
  const [updateDifficulty, setUpdateDifficulty] = useState("");
  const [updateSkillName, setUpdateSkillName] = useState("");

  // Remove state
  const [removingSkillId, setRemovingSkillId] = useState<string | null>(null);

  useEffect(() => {
    dispatch(getMe());
  }, [dispatch]);

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

  const openUpdateFor = (
    skillId: string,
    listType: "offer" | "want",
    currentDifficulty: string,
    name: string,
  ) => {
    setUpdateSkillId(skillId);
    setUpdateListType(listType);
    setUpdateDifficulty(currentDifficulty || "Beginner");
    setUpdateSkillName(name);
    setOpenUpdateDialog(true);
  };

  const handleUpdateSkill = async () => {
    if (!updateDifficulty) {
      toast.error("Please select a difficulty level");
      return;
    }
    try {
      await dispatch(
        updateSkill({
          skillId: updateSkillId,
          listType: updateListType,
          difficulty: updateDifficulty as
            | "Beginner"
            | "Intermediate"
            | "Advanced",
        }),
      ).unwrap();
      toast.success("Skill updated successfully!");
      setOpenUpdateDialog(false);
    } catch (error: any) {
      toast.error(error || "Failed to update skill");
    }
  };

  const handleAddOfferSkill = async () => {
    if (!offerSkillInput.trim()) {
      toast.error("Please describe what you can teach");
      return;
    }
    try {
      await dispatch(addOfferSkill({ name: offerSkillInput })).unwrap();
      toast.success("Teaching skill added! AI is processing…");
      setOpenOfferDialog(false);
      setOfferSkillInput("");
    } catch (error: any) {
      toast.error(error || "Failed to add teaching skill");
    }
  };

  const handleAddWantSkill = async () => {
    if (!wantSkillInput.trim()) {
      toast.error("Please describe what you want to learn");
      return;
    }
    try {
      await dispatch(addWantSkill({ name: wantSkillInput })).unwrap();
      toast.success("Learning skill added! AI is processing…");
      setOpenWantDialog(false);
      setWantSkillInput("");
    } catch (error: any) {
      toast.error(error || "Failed to add learning skill");
    }
  };

  useEffect(() => {
    if (user) {
      const userId = user._id || user.id;
      if (userId) {
        dispatch(getUserSkills(userId.toString()));
      }
    }
  }, [dispatch, user]);

  const offerSkillsCount = profile?.offerSkills?.length || 0;
  const wantSkillsCount = profile?.wantSkills?.length || 0;

  return (
    <div className="space-y-6">
      {/* Top Bar */}
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <h1 className="font-semibold text-2xl">My Skills</h1>
          <h2 className="text-base text-muted-foreground">
            Describe what you can teach or want to learn our AI structures it
            for you.
          </h2>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-col gap-10">
        {/* ── Skills I Want to Learn ── */}
        <div className="flex flex-col gap-4">
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
              {wantSkillsCount}
            </span>
          </div>

          {/* Empty state */}
          {wantSkillsCount === 0 && (
            <div className="flex flex-col gap-4">
              <div className="flex flex-col items-center justify-center rounded-xl border-2 border-primary/50 border-dashed bg-muted/30 py-10 text-center">
                <div className="mb-3 rounded-full bg-primary p-4">
                  <MdMenuBook className="h-6 w-6 text-primary-foreground" />
                </div>
                <h4 className="mb-1 font-semibold text-primary">
                  Ready to learn something new?
                </h4>
                <p className="mb-0 max-w-70 text-sm text-muted-foreground">
                  Add skills you're interested in learning and we'll help you
                  discover people who can teach them.
                </p>
              </div>

              <Dialog open={openWantDialog} onOpenChange={setOpenWantDialog}>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground"
                  >
                    <MdAdd className="mr-2 h-4 w-4" />
                    Add Learning Skill
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-lg">
                  <DialogHeader>
                    <DialogTitle>What do you want to learn?</DialogTitle>
                    <DialogDescription>
                      Write naturally we'll convert it into structured learning
                      goals, topics, and difficulty levels.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-medium">
                        Describe your learning goal
                      </label>
                      <textarea
                        id="want-skill-input-empty"
                        placeholder="I want to learn JWT authentication with Node.js, Express, refresh tokens, and secure APIs..."
                        value={wantSkillInput}
                        onChange={(e) => setWantSkillInput(e.target.value)}
                        onKeyDown={(e) =>
                          e.key === "Enter" &&
                          !e.shiftKey &&
                          handleAddWantSkill()
                        }
                        className="w-full min-h-27.5 resize-none rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                      />
                    </div>
                    <div className="flex items-start gap-2 rounded-md bg-muted/40 p-3 text-xs text-muted-foreground">
                      <Sparkles className="h-4 w-4 text-foreground mt-0.5" />
                      <div>
                        AI will extract{" "}
                        <span className="font-medium text-foreground">
                          learning goals, topics, difficulty level, and search
                          tags
                        </span>{" "}
                        to match you with the right mentors or resources.
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      onClick={handleAddWantSkill}
                      disabled={loadingAddWant || !wantSkillInput.trim()}
                      className="w-full"
                    >
                      {loadingAddWant ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <MdAdd className="h-4 w-4" />
                      )}
                      Add Skill
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          )}

          {/* Skill cards */}
          {wantSkillsCount > 0 && (
            <div
              className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1"
              style={{ msOverflowStyle: "none", scrollbarWidth: "none" }}
            >
              {wantSkills?.map((skill, i) => {
                const cat = skill.primarySkill?.category || "Other";
                const diff = skill.difficulty || "Beginner";
                const diffLevel =
                  diff === "Advanced" ? 3 : diff === "Intermediate" ? 2 : 1;

                return (
                  <div
                    key={skill._id}
                    className="group w-80 shrink-0 rounded-xl border border-border bg-background p-5 transition-colors hover:border-primary/50 border-b-4 border-b-primary"
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] tabular-nums text-muted-foreground">
                            {String(i + 1).padStart(2, "0")}
                          </span>
                          <span className="text-[11px] font-medium px-2 py-0.5 rounded-full border border-border text-muted-foreground">
                            {cat}
                          </span>
                        </div>
                        <h3 className="mt-1.5 text-base font-medium capitalize">
                          {skill.primarySkill?.name || "Unknown Skill"}
                        </h3>

                        {skill.rawInput && (
                          <p className="mt-1 line-clamp-2 text-xs italic text-muted-foreground">
                            "{skill.rawInput}"
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Difficulty + actions */}
                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          {[1, 2, 3].map((d) => (
                            <span
                              key={d}
                              className={`h-1.5 w-1.5 rounded-sm ${
                                d <= diffLevel ? "bg-foreground" : "bg-muted"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-[11px] text-muted-foreground">
                          {diff}
                        </span>
                      </div>

                      <div className="flex items-center gap-1 opacity-70 group-hover:opacity-100 transition-opacity">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-7 w-7 border border-transparent hover:bg-accent hover:text-accent-foreground"
                          onClick={() =>
                            openUpdateFor(
                              skill._id,
                              "want",
                              skill.difficulty || "Beginner",
                              skill.primarySkill?.name || "Skill",
                            )
                          }
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>

                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-7 w-7 border border-transparent hover:bg-danger/10 hover:text-danger"
                            >
                              {removingSkillId === skill._id ? (
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
                                  {skill.primarySkill?.name || "this skill"}
                                </span>{" "}
                                from your learning profile. You can always
                                re-add it later.
                              </DialogDescription>
                            </DialogHeader>
                            <div className="rounded-lg border bg-muted/50 p-4">
                              <div className="flex flex-col gap-2 justify-between">
                                <div>
                                  <p className="text-base font-medium capitalize">
                                    {skill.primarySkill?.name || "Unknown"}
                                  </p>
                                  <p className="text-xs text-muted-foreground mt-0.5">
                                    {cat} · {diff}
                                  </p>
                                </div>
                              </div>
                            </div>
                            <DialogFooter>
                              <Button
                                variant="destructive"
                                disabled={removingSkillId === skill._id}
                                onClick={() =>
                                  handleRemoveSkill(skill._id, "want")
                                }
                                className="w-full"
                              >
                                {removingSkillId === skill._id ? (
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

                    {(skill.topics?.length > 0 || skill.tokens?.length > 0) && (
                      <div className="my-3 h-px bg-border" />
                    )}

                    {/* Topics */}
                    {skill.topics?.length > 0 && (
                      <div className="mb-2.5">
                        <p className="mb-1.5 text-[11px] font-medium uppercase tracking-wide">
                          Topics
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {skill.topics.map((topic) => (
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

                    {/* Tokens */}
                    {skill.tokens?.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {skill.tokens.slice(0, 5).map((tag) => (
                          <span
                            key={tag}
                            className="rounded-md bg-muted px-2 py-0.5 text-[11px] text-muted-foreground"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Add card */}
              <Dialog open={openWantDialog} onOpenChange={setOpenWantDialog}>
                <DialogTrigger asChild>
                  <button className="w-40 shrink-0 rounded-xl flex flex-col items-center justify-center gap-2 text-muted-foreground hover:bg-muted/30 hover:text-primary transition-colors border-2 border-primary/50 border-dashed cursor-pointer">
                    <MdAdd className="h-5 w-5" />
                    <span className="text-xs font-medium">
                      Add Learning Skill
                    </span>
                  </button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-lg">
                  <DialogHeader>
                    <DialogTitle>What do you want to learn?</DialogTitle>
                    <DialogDescription>
                      Write naturally we'll convert it into structured learning
                      goals, topics, and difficulty levels.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-medium">
                        Describe your learning goal
                      </label>
                      <textarea
                        id="want-skill-input"
                        placeholder="I want to learn JWT authentication with Node.js, Express, refresh tokens, and secure APIs..."
                        value={wantSkillInput}
                        onChange={(e) => setWantSkillInput(e.target.value)}
                        onKeyDown={(e) =>
                          e.key === "Enter" &&
                          !e.shiftKey &&
                          handleAddWantSkill()
                        }
                        className="w-full min-h-27.5 resize-none rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                      />
                    </div>
                    <div className="flex items-start gap-2 rounded-md bg-muted/40 p-3 text-xs text-muted-foreground">
                      <Sparkles className="h-4 w-4 text-foreground mt-0.5" />
                      <div>
                        AI will extract{" "}
                        <span className="font-medium text-foreground">
                          learning goals, topics, difficulty level, and search
                          tags
                        </span>{" "}
                        to match you with the right mentors or resources.
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      onClick={handleAddWantSkill}
                      disabled={loadingAddWant || !wantSkillInput.trim()}
                      className="w-full"
                    >
                      {loadingAddWant ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <MdAdd className="h-4 w-4" />
                      )}
                      Add Skill
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          )}
        </div>

        {/* ── Skills I Can Teach ── */}
        <div className="flex flex-col gap-4">
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
              {offerSkillsCount}
            </span>
          </div>

          {/* Empty state */}
          {offerSkillsCount === 0 && (
            <div className="flex flex-col gap-4">
              <div className="flex flex-col items-center justify-center rounded-xl  border-2 border-primary/50 border-dashed bg-muted/30 py-10 text-center">
                <div className="mb-3 rounded-full bg-primary p-4">
                  <IoSchoolSharp className="h-6 w-6 text-primary-foreground" />
                </div>
                <h4 className="mb-1 font-semibold text-primary">
                  Ready to inspire others?
                </h4>
                <p className="mb-0 max-w-70 text-sm text-muted-foreground">
                  Share what you know and connect with people eager to learn
                  from your experience.
                </p>
              </div>

              <Dialog open={openOfferDialog} onOpenChange={setOpenOfferDialog}>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground"
                  >
                    <MdAdd className="mr-2 h-4 w-4" />
                    Add Teaching Skill
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-lg">
                  <DialogHeader>
                    <DialogTitle>What can you teach?</DialogTitle>
                    <DialogDescription>
                      Write naturally, we'll convert it into structured skills,
                      topics, and difficulty levels.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-medium">
                        Describe your teaching skill
                      </label>
                      <textarea
                        id="offer-skill-input-empty"
                        placeholder="I can teach React including hooks, state management, Redux, and real-world project structure..."
                        value={offerSkillInput}
                        onChange={(e) => setOfferSkillInput(e.target.value)}
                        onKeyDown={(e) =>
                          e.key === "Enter" &&
                          !e.shiftKey &&
                          handleAddOfferSkill()
                        }
                        className="w-full min-h-27.5 resize-none rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                      />
                    </div>
                    <div className="flex items-start gap-2 rounded-md bg-muted/40 p-3 text-xs text-muted-foreground">
                      <Sparkles className="h-4 w-4 text-foreground mt-0.5" />
                      <div>
                        AI will extract{" "}
                        <span className="font-medium text-foreground">
                          skills, topics, difficulty level, and search tags
                        </span>{" "}
                        to help match learners with you.
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      onClick={handleAddOfferSkill}
                      disabled={loadingAddOffer || !offerSkillInput.trim()}
                      className="w-full"
                    >
                      {loadingAddOffer ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <MdAdd className="h-4 w-4" />
                      )}
                      Add Skill
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          )}

          {/* Skill cards */}
          {offerSkillsCount > 0 && (
            <div
              className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1"
              style={{ msOverflowStyle: "none", scrollbarWidth: "none" }}
            >
              {offerSkills?.map((skill, i) => {
                const cat = skill.primarySkill?.category || "Other";
                const diff = skill.difficulty || "Beginner";
                const diffLevel =
                  diff === "Advanced" ? 3 : diff === "Intermediate" ? 2 : 1;

                return (
                  <div
                    key={skill._id}
                    className="group w-80 shrink-0 rounded-xl border border-border bg-background p-5 transition-colors border-b-4 border-b-primary hover:border-primary/50"
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] tabular-nums text-muted-foreground">
                            {String(i + 1).padStart(2, "0")}
                          </span>
                          <span className="text-[11px] font-medium px-2 py-0.5 rounded-full border border-border text-muted-foreground">
                            {cat}
                          </span>
                        </div>
                        <h3 className="mt-1.5 text-base font-medium capitalize">
                          {skill.primarySkill?.name || "Unknown Skill"}
                        </h3>

                        {skill.rawInput && (
                          <p className="mt-1 line-clamp-2 text-xs italic text-muted-foreground">
                            "{skill.rawInput}"
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Difficulty + actions */}
                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          {[1, 2, 3].map((d) => (
                            <span
                              key={d}
                              className={`h-1.5 w-1.5 rounded-sm ${
                                d <= diffLevel ? "bg-foreground" : "bg-muted"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-[11px] text-muted-foreground">
                          {diff}
                        </span>
                      </div>

                      <div className="flex items-center gap-1 opacity-70 group-hover:opacity-100 transition-opacity">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-7 w-7 border border-transparent hover:bg-accent hover:text-accent-foreground"
                          onClick={() =>
                            openUpdateFor(
                              skill._id,
                              "offer",
                              skill.difficulty || "Beginner",
                              skill.primarySkill?.name || "Skill",
                            )
                          }
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>

                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-7 w-7 border border-transparent hover:bg-danger/10 hover:text-danger"
                            >
                              {removingSkillId === skill._id ? (
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
                                  {skill.primarySkill?.name || "this skill"}
                                </span>{" "}
                                from your teaching profile. You can always
                                re-add it later.
                              </DialogDescription>
                            </DialogHeader>
                            <div className="rounded-lg border bg-muted/50 px-3 py-2.5">
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="text-sm font-medium capitalize">
                                    {skill.primarySkill?.name || "Unknown"}
                                  </p>
                                  <p className="text-xs text-muted-foreground mt-0.5">
                                    {cat} · {diff}
                                  </p>
                                </div>
                                <span className="text-[11px] font-medium px-2 py-0.5 rounded-full border border-border text-muted-foreground">
                                  {cat}
                                </span>
                              </div>
                            </div>
                            <DialogFooter>
                              <Button
                                variant="destructive"
                                disabled={removingSkillId === skill._id}
                                onClick={() =>
                                  handleRemoveSkill(skill._id, "offer")
                                }
                              >
                                {removingSkillId === skill._id ? (
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

                    {(skill.topics?.length > 0 || skill.tokens?.length > 0) && (
                      <div className="my-3 h-px bg-border" />
                    )}

                    {/* Topics */}
                    {skill.topics?.length > 0 && (
                      <div className="mb-2.5">
                        <p className="mb-1.5 text-[11px] font-medium uppercase tracking-wide">
                          Topics
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {skill.topics.map((topic) => (
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

                    {/* Keywords */}
                    {skill.tokens?.length > 0 && (
                      <div>
                        <div className="flex flex-wrap gap-1.5">
                          {skill.tokens.slice(0, 8).map((tag) => (
                            <span
                              key={tag}
                              className="rounded-md bg-muted px-2 py-0.5 text-[11px] text-muted-foreground"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                        {skill.tokens.length > 8 && (
                          <p className="mt-1 text-[10px] text-muted-foreground">
                            +{skill.tokens.length - 8} more keywords
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Add card */}
              <Dialog open={openOfferDialog} onOpenChange={setOpenOfferDialog}>
                <DialogTrigger asChild>
                  <button className="w-40 shrink-0 rounded-xl flex flex-col items-center justify-center gap-2 text-muted-foreground hover:bg-muted/30 hover:text-primary transition-colors border-2 border-primary/50 border-dashed cursor-pointer">
                    <MdAdd className="h-5 w-5" />
                    <span className="text-xs font-medium">
                      Add Teaching Skill
                    </span>
                  </button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-lg">
                  <DialogHeader>
                    <DialogTitle>What can you teach?</DialogTitle>
                    <DialogDescription>
                      Write naturally, we'll convert it into structured skills,
                      topics, and difficulty levels.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-medium">
                        Describe your teaching skill
                      </label>
                      <textarea
                        id="offer-skill-input"
                        placeholder="I can teach React including hooks, state management, Redux, and real-world project structure..."
                        value={offerSkillInput}
                        onChange={(e) => setOfferSkillInput(e.target.value)}
                        onKeyDown={(e) =>
                          e.key === "Enter" &&
                          !e.shiftKey &&
                          handleAddOfferSkill()
                        }
                        className="w-full min-h-27.5 resize-none rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                      />
                    </div>
                    <div className="flex items-start gap-2 rounded-md bg-muted/40 p-3 text-xs text-muted-foreground">
                      <Sparkles className="h-4 w-4 text-foreground mt-0.5" />
                      <div>
                        AI will extract{" "}
                        <span className="font-medium text-foreground">
                          skills, topics, difficulty level, and search tags
                        </span>{" "}
                        to help match learners with you.
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      onClick={handleAddOfferSkill}
                      disabled={loadingAddOffer || !offerSkillInput.trim()}
                      className="w-full"
                    >
                      {loadingAddOffer ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <MdAdd className="h-4 w-4" />
                      )}
                      Add Skill
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          )}
        </div>
      </div>

      {/* ── Shared Update Difficulty Dialog ── */}
      <Dialog open={openUpdateDialog} onOpenChange={setOpenUpdateDialog}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Update Difficulty</DialogTitle>
            <DialogDescription>
              Update the difficulty level for{" "}
              <span className="font-semibold capitalize">
                {updateSkillName}
              </span>
              .
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <Select
              value={updateDifficulty}
              onValueChange={setUpdateDifficulty}
            >
              <SelectTrigger className="w-full rounded-full py-5 cursor-pointer">
                <SelectValue placeholder="Select difficulty" />
              </SelectTrigger>
              <SelectContent className="p-2">
                <SelectItem value="Beginner" className="cursor-pointer">
                  Beginner
                </SelectItem>
                <SelectItem value="Intermediate" className="cursor-pointer">
                  Intermediate
                </SelectItem>
                <SelectItem value="Advanced" className="cursor-pointer">
                  Advanced
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button
              onClick={handleUpdateSkill}
              disabled={loadingUpdate}
              className="w-full"
            >
              {loadingUpdate ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Pencil className="mr-2 h-4 w-4" />
              )}
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MySkillsPage;
