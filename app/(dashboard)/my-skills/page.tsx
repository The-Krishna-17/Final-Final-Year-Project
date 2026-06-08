"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
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
import { CiSearch } from "react-icons/ci";
import { IoSchoolSharp } from "react-icons/io5";
import { MdAdd, MdMenuBook } from "react-icons/md";
import { toast } from "sonner";
import { Loader2, Star, Trash2, Pencil } from "lucide-react";
import { FaStar } from "react-icons/fa";
import { getMe } from "@/store/features/auth/authSlice";
import { Badge } from "@/components/ui/badge";

const MySkillsPage = () => {
  const dispatch = useAppDispatch();
  const {
    profile,
    loadingAddOffer,
    loadingAddWant,
    loadingUpdate,
    loadingRemove,
  } = useAppSelector((state) => state.skills);

  const { user } = useAppSelector((state) => state.auth);

  const offerSkills = profile?.offerSkills;
  const wantSkills = profile?.wantSkills;

  // Dialog state for Offer Skills
  const [openOfferDialog, setOpenOfferDialog] = useState(false);
  const [offerSkillName, setOfferSkillName] = useState("");
  const [offerSkillLevel, setOfferSkillLevel] = useState("");

  // Dialog state for Want Skills
  const [openWantDialog, setOpenWantDialog] = useState(false);
  const [wantSkillName, setWantSkillName] = useState("");
  const [wantSkillLevel, setWantSkillLevel] = useState("");

  // Update dialog state
  const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
  const [updateSkillId, setUpdateSkillId] = useState("");
  const [updateListType, setUpdateListType] = useState<"offer" | "want">(
    "offer",
  );
  const [updateLevel, setUpdateLevel] = useState("");
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
    currentLevel: number,
    name: string,
  ) => {
    setUpdateSkillId(skillId);
    setUpdateListType(listType);
    setUpdateLevel(currentLevel.toString());
    setUpdateSkillName(name);
    setOpenUpdateDialog(true);
  };

  const handleUpdateSkill = async () => {
    if (!updateLevel) {
      toast.error("Please select a new skill level");
      return;
    }
    try {
      await dispatch(
        updateSkill({
          skillId: updateSkillId,
          listType: updateListType,
          newLevel: Number(updateLevel),
        }),
      ).unwrap();
      toast.success("Skill updated successfully!");
      setOpenUpdateDialog(false);
    } catch (error: any) {
      toast.error(error || "Failed to update skill");
    }
  };

  const handleAddOfferSkill = async () => {
    if (!offerSkillName.trim()) {
      toast.error("Please enter a skill name");
      return;
    }
    if (!offerSkillLevel) {
      toast.error("Please select a skill level");
      return;
    }

    try {
      await dispatch(
        addOfferSkill({
          name: offerSkillName,
          level: Number(offerSkillLevel),
        }),
      ).unwrap();

      toast.success("Teaching skill added successfully!");
      setOpenOfferDialog(false);
      setOfferSkillName("");
      setOfferSkillLevel("");
    } catch (error: any) {
      toast.error(error || "Failed to add teaching skill");
    }
  };

  const handleAddWantSkill = async () => {
    if (!wantSkillName.trim()) {
      toast.error("Please enter a skill name");
      return;
    }

    try {
      await dispatch(
        addWantSkill({
          name: wantSkillName,
          // level is optional for want skills, but if they selected one, send it
          ...(wantSkillLevel
            ? { level: Number(wantSkillLevel) }
            : { level: 1 }),
        }),
      ).unwrap();

      toast.success("Learning skill added successfully!");
      setOpenWantDialog(false);
      setWantSkillName("");
      setWantSkillLevel("");
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
            Manage what you can teach and what you want to learn!
          </h2>
        </div>
        {/* <div className="relative max-w-[250px] lg:min-w-xl">
          <CiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search skills..."
            className="pl-10 bg-white dark:bg-white dark:text-black"
          />
        </div> */}
      </div>
      {/* Tabs */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* ── Teaching Skills ── */}
        <Card className="flex flex-col gap-5 p-5 h-fit">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-primary/10 p-2.5">
                <IoSchoolSharp className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold leading-tight">
                  Skills I Can Teach
                </h3>
                <p className="text-xs text-muted-foreground">
                  Share your expertise with others
                </p>
              </div>
            </div>
            <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium tabular-nums">
              {offerSkillsCount} Skills
            </span>
          </div>

          {/* Empty state */}
          {offerSkillsCount === 0 && (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-muted/30 py-10 text-center">
              <div className="mb-3 rounded-full bg-muted p-4">
                <IoSchoolSharp className="h-7 w-7 text-muted-foreground" />
              </div>
              <h4 className="mb-1 font-semibold">Ready to inspire others?</h4>
              <p className="mb-0 max-w-[260px] text-sm text-muted-foreground">
                Share what you know and connect with people eager to learn from
                your experience.
              </p>
            </div>
          )}

          {/* Skill cards */}
          {offerSkillsCount > 0 && (
            <div className="flex flex-col gap-3">
              {offerSkills &&
                offerSkills.length > 0 &&
                offerSkills.map((skill) => (
                  <div
                    key={skill._id}
                    className="rounded-xl border border-border bg-muted/20 p-4 transition-shadow hover:shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-2">
                      {/* Left */}
                      <div className="flex-1 min-w-0">
                        <h3 className="truncate font-semibold">{skill.name}</h3>
                        <div className="mt-1.5 flex items-center gap-2">
                          <Badge variant="secondary" className="text-xs">
                            {skill.category}
                          </Badge>
                          <div className="flex items-center gap-1 rounded-md bg-background border border-border px-2 py-0.5 text-xs">
                            <Star className="h-3 w-3 fill-current" />
                            <span>{skill.level}/5</span>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-1.5 shrink-0">
                        <Button
                          size="icon"
                          variant="outline"
                          className="h-8 w-8 border-blue-200 text-blue-600 hover:bg-blue-50 hover:text-blue-700"
                          onClick={() =>
                            openUpdateFor(
                              skill._id,
                              "offer",
                              skill.level,
                              skill.name,
                            )
                          }
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>

                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              size="icon"
                              variant="outline"
                              className="h-8 w-8 text-red-500 hover:bg-red-50 hover:text-red-600"
                            >
                              {removingSkillId === skill._id ? (
                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                              ) : (
                                <Trash2 className="h-3.5 w-3.5" />
                              )}
                            </Button>
                          </DialogTrigger>

                          <DialogContent className="sm:max-w-md">
                            <DialogHeader>
                              <div className="mb-2 flex justify-center">
                                <div className="rounded-full bg-red-100 p-3">
                                  <Trash2 className="h-6 w-6 text-red-600" />
                                </div>
                              </div>
                              <DialogTitle className="text-center">
                                Remove Skill
                              </DialogTitle>
                              <DialogDescription className="text-center">
                                Are you sure you want to remove{" "}
                                <span className="font-medium text-foreground">
                                  {skill.name}
                                </span>
                                ?
                                <br />
                                This skill will no longer appear in your
                                teaching profile and may affect your skill match
                                recommendations.
                              </DialogDescription>
                            </DialogHeader>

                            <div className="rounded-lg border bg-muted/50 p-3">
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="font-medium">{skill.name}</p>
                                  <p className="text-sm text-muted-foreground">
                                    {skill.category}
                                  </p>
                                </div>
                                <div className="rounded-md bg-background px-2 py-1 text-sm">
                                  Level {skill.level}/5
                                </div>
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
                                    Removing...
                                  </>
                                ) : (
                                  <>
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Remove Skill
                                  </>
                                )}
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>

                    {skill.tags.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {skill.tags.map((tag) => (
                          <Badge
                            key={tag}
                            variant="outline"
                            className="capitalize text-xs"
                          >
                            #{tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
            </div>
          )}

          {/* Add button */}
          <Dialog open={openOfferDialog} onOpenChange={setOpenOfferDialog}>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full border-dashed">
                <MdAdd className="mr-2 h-4 w-4" />
                Add Teaching Skill
              </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Add Teaching Skill</DialogTitle>
                <DialogDescription>
                  Add a skill you can teach to other members of the platform.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-4">
                <div className="flex flex-col gap-2">
                  <label className="text-base">Skill Name</label>
                  <Input
                    id="skill-name"
                    placeholder="e.g. React, Backend, Guitar, Plumbing, Public Speaking..."
                    value={offerSkillName}
                    onChange={(e) => setOfferSkillName(e.target.value)}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-base">Skill Level</label>
                  <Select
                    value={offerSkillLevel}
                    onValueChange={setOfferSkillLevel}
                  >
                    <SelectTrigger
                      id="skill-level"
                      className="w-full rounded-full py-5 cursor-pointer"
                    >
                      <SelectValue placeholder="Select your proficiency level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1" className="cursor-pointer">
                        <FaStar className="inline mr-1" />
                        Beginner
                      </SelectItem>
                      <SelectItem value="2" className="cursor-pointer">
                        <span className="inline-flex gap-0.5 mr-1">
                          <FaStar />
                          <FaStar />
                        </span>
                        Basic
                      </SelectItem>
                      <SelectItem value="3" className="cursor-pointer">
                        <span className="inline-flex gap-0.5 mr-1">
                          <FaStar />
                          <FaStar />
                          <FaStar />
                        </span>
                        Intermediate
                      </SelectItem>
                      <SelectItem value="4" className="cursor-pointer">
                        <span className="inline-flex gap-0.5 mr-1">
                          <FaStar />
                          <FaStar />
                          <FaStar />
                          <FaStar />
                        </span>
                        Advanced
                      </SelectItem>
                      <SelectItem value="5" className="cursor-pointer">
                        <span className="inline-flex gap-0.5 mr-1">
                          <FaStar />
                          <FaStar />
                          <FaStar />
                          <FaStar />
                          <FaStar />
                        </span>
                        Expert
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <DialogFooter>
                <Button
                  onClick={handleAddOfferSkill}
                  disabled={loadingAddOffer}
                >
                  {loadingAddOffer ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <MdAdd className="mr-2 h-4 w-4" />
                  )}
                  Add Skill
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </Card>

        {/* ── Learning Skills ── */}
        <Card className="flex flex-col gap-5 p-5 h-fit">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-primary/10 p-2.5">
                <MdMenuBook className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold leading-tight">
                  Skills I Want to Learn
                </h3>
                <p className="text-xs text-muted-foreground">
                  Discover new opportunities to grow
                </p>
              </div>
            </div>
            <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium tabular-nums">
              {wantSkillsCount} Skills
            </span>
          </div>

          {/* Empty state */}
          {wantSkillsCount === 0 && (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-muted/30 py-10 text-center">
              <div className="mb-3 rounded-full bg-muted p-4">
                <MdMenuBook className="h-7 w-7 text-muted-foreground" />
              </div>
              <h4 className="mb-1 font-semibold">
                Ready to learn something new?
              </h4>
              <p className="mb-0 max-w-[260px] text-sm text-muted-foreground">
                Add skills you're interested in learning and we'll help you
                discover people who can teach them.
              </p>
            </div>
          )}

          {/* Skill cards */}
          {wantSkillsCount > 0 && (
            <div className="flex flex-col gap-3">
              {wantSkills &&
                wantSkills.length > 0 &&
                wantSkills.map((skill) => (
                  <div
                    key={skill._id}
                    className="rounded-xl border border-border bg-muted/20 p-4 transition-shadow hover:shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-2">
                      {/* Left */}
                      <div className="flex-1 min-w-0">
                        <h3 className="truncate font-semibold">{skill.name}</h3>
                        <div className="mt-1.5 flex items-center gap-2">
                          <Badge variant="secondary" className="text-xs">
                            {skill.category}
                          </Badge>
                          <div className="flex items-center gap-1 rounded-md bg-background border border-border px-2 py-0.5 text-xs">
                            <Star className="h-3 w-3 fill-current" />
                            <span>{skill.level}/5</span>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-1.5 shrink-0">
                        <Button
                          size="icon"
                          variant="outline"
                          className="h-8 w-8 border-blue-200 text-blue-600 hover:bg-blue-50 hover:text-blue-700"
                          onClick={() =>
                            openUpdateFor(
                              skill._id,
                              "want",
                              skill.level,
                              skill.name,
                            )
                          }
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>

                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              size="icon"
                              variant="outline"
                              className="h-8 w-8 text-red-500 hover:bg-red-50 hover:text-red-600"
                            >
                              {removingSkillId === skill._id ? (
                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                              ) : (
                                <Trash2 className="h-3.5 w-3.5" />
                              )}
                            </Button>
                          </DialogTrigger>

                          <DialogContent className="sm:max-w-md">
                            <DialogHeader>
                              <div className="mb-2 flex justify-center">
                                <div className="rounded-full bg-red-100 p-3">
                                  <Trash2 className="h-6 w-6 text-red-600" />
                                </div>
                              </div>
                              <DialogTitle className="text-center">
                                Remove Skill
                              </DialogTitle>
                              <DialogDescription className="text-center">
                                Are you sure you want to remove{" "}
                                <span className="font-medium text-foreground">
                                  {skill.name}
                                </span>
                                ?
                                <br />
                                This skill will no longer appear in your
                                teaching profile and may affect your skill match
                                recommendations.
                              </DialogDescription>
                            </DialogHeader>

                            <div className="rounded-lg border bg-muted/50 p-3">
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="font-medium">{skill.name}</p>
                                  <p className="text-sm text-muted-foreground">
                                    {skill.category}
                                  </p>
                                </div>
                                <div className="rounded-md bg-background px-2 py-1 text-sm">
                                  Level {skill.level}/5
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
                              >
                                {removingSkillId === skill._id ? (
                                  <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Removing...
                                  </>
                                ) : (
                                  <>
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Remove Skill
                                  </>
                                )}
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>

                    {skill.tags.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {skill.tags.map((tag) => (
                          <Badge
                            key={tag}
                            variant="outline"
                            className="capitalize text-xs"
                          >
                            #{tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
            </div>
          )}

          {/* Add button */}
          <Dialog open={openWantDialog} onOpenChange={setOpenWantDialog}>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full border-dashed">
                <MdAdd className="mr-2 h-4 w-4" />
                Add Learning Skill
              </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Add Learning Skill</DialogTitle>
                <DialogDescription>
                  Add a skill you want to learn. We'll connect you with people
                  who can teach it.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-4">
                <div className="flex flex-col gap-2">
                  <label className="text-base">Skill Name</label>
                  <Input
                    id="want-skill-name"
                    placeholder="e.g. Python, Digital Marketing, Piano..."
                    value={wantSkillName}
                    onChange={(e) => setWantSkillName(e.target.value)}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-base">
                    Your Current Level (Optional)
                  </label>
                  <Select
                    value={wantSkillLevel}
                    onValueChange={setWantSkillLevel}
                  >
                    <SelectTrigger
                      id="want-skill-level"
                      className="w-full rounded-full py-5 cursor-pointer"
                    >
                      <SelectValue placeholder="Select your current level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1" className="cursor-pointer">
                        <FaStar className="inline mr-1" />
                        Beginner
                      </SelectItem>
                      <SelectItem value="2" className="cursor-pointer">
                        <span className="inline-flex gap-0.5 mr-1">
                          <FaStar />
                          <FaStar />
                        </span>
                        Basic
                      </SelectItem>
                      <SelectItem value="3" className="cursor-pointer">
                        <span className="inline-flex gap-0.5 mr-1">
                          <FaStar />
                          <FaStar />
                          <FaStar />
                        </span>
                        Intermediate
                      </SelectItem>
                      <SelectItem value="4" className="cursor-pointer">
                        <span className="inline-flex gap-0.5 mr-1">
                          <FaStar />
                          <FaStar />
                          <FaStar />
                          <FaStar />
                        </span>
                        Advanced
                      </SelectItem>
                      <SelectItem value="5" className="cursor-pointer">
                        <span className="inline-flex gap-0.5 mr-1">
                          <FaStar />
                          <FaStar />
                          <FaStar />
                          <FaStar />
                          <FaStar />
                        </span>
                        Expert
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <DialogFooter>
                <Button onClick={handleAddWantSkill} disabled={loadingAddWant}>
                  {loadingAddWant ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <MdAdd className="mr-2 h-4 w-4" />
                  )}
                  Add Skill
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </Card>
      </div>

      {/* ── Shared Update Level Dialog ── */}
      <Dialog open={openUpdateDialog} onOpenChange={setOpenUpdateDialog}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Update Skill Level</DialogTitle>
            <DialogDescription>
              Update your proficiency level for{" "}
              <span className="font-semibold">{updateSkillName}</span>.
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <Select value={updateLevel} onValueChange={setUpdateLevel}>
              <SelectTrigger className="w-full rounded-full py-5 cursor-pointer">
                <SelectValue placeholder="Select new level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1" className="cursor-pointer">
                  <FaStar className="inline mr-1" />
                  Beginner
                </SelectItem>
                <SelectItem value="2" className="cursor-pointer">
                  <span className="inline-flex gap-0.5 mr-1">
                    <FaStar />
                    <FaStar />
                  </span>
                  Basic
                </SelectItem>
                <SelectItem value="3" className="cursor-pointer">
                  <span className="inline-flex gap-0.5 mr-1">
                    <FaStar />
                    <FaStar />
                    <FaStar />
                  </span>
                  Intermediate
                </SelectItem>
                <SelectItem value="4" className="cursor-pointer">
                  <span className="inline-flex gap-0.5 mr-1">
                    <FaStar />
                    <FaStar />
                    <FaStar />
                    <FaStar />
                  </span>
                  Advanced
                </SelectItem>
                <SelectItem value="5" className="cursor-pointer">
                  <span className="inline-flex gap-0.5 mr-1">
                    <FaStar />
                    <FaStar />
                    <FaStar />
                    <FaStar />
                    <FaStar />
                  </span>
                  Expert
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button onClick={handleUpdateSkill} disabled={loadingUpdate}>
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
