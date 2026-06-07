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
  getUserSkills,
} from "@/store/features/skills/skillSlice";
import { CiSearch } from "react-icons/ci";
import { IoSchoolSharp } from "react-icons/io5";
import { MdAdd, MdMenuBook } from "react-icons/md";
import { toast } from "sonner";
import { Divide, Loader2, Star } from "lucide-react";
import { FaStar } from "react-icons/fa";
import { getMe } from "@/store/features/auth/authSlice";
import { Badge } from "@/components/ui/badge";

const MySkillsPage = () => {
  const dispatch = useAppDispatch();
  const { profile, loadingAddOffer, loadingAddWant } = useAppSelector(
    (state) => state.skills,
  );

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

  useEffect(() => {
    dispatch(getMe());
  }, [dispatch]);

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
        <div className="relative max-w-[250px] lg:min-w-xl">
          <CiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search skills..."
            className="pl-10 bg-white dark:bg-white dark:text-black"
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Teaching Skills */}
        <Card className="p-6 flex flex-col justify-between">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-primary/10 p-3">
                <IoSchoolSharp className="h-6 w-6 text-primary" />
              </div>

              <div>
                <h3 className="font-semibold">Skills I Can Teach</h3>
                <p className="text-sm text-muted-foreground">
                  Share your expertise with others
                </p>
              </div>
            </div>

            <span className="rounded-full bg-muted px-3 py-1 text-sm font-medium">
              {offerSkillsCount} Skills
            </span>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {offerSkills &&
              offerSkills.map((skill) => (
                <Card
                  key={skill._id}
                  className="p-4 transition-all hover:shadow-md"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-lg">{skill.name}</h3>

                      <Badge variant="secondary" className="mt-1">
                        {skill.category}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-1 rounded-md bg-muted px-2 py-1 text-sm">
                      <Star className="h-4 w-4 fill-current" />
                      <span>{skill.level}/5</span>
                    </div>
                  </div>

                  {skill.tags.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {skill.tags.map((tag) => (
                        <Badge
                          key={tag}
                          variant="outline"
                          className="capitalize"
                        >
                          #{tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </Card>
              ))}
          </div>

          <div className="flex flex-col items-center justify-center text-center">
            {offerSkillsCount === 0 && (
              <>
                <div className="mb-4 rounded-full bg-muted p-4">
                  <IoSchoolSharp className="h-8 w-8 text-muted-foreground" />
                </div>

                <h4 className="mb-2 text-lg font-semibold">
                  Ready to inspire others?
                </h4>

                <p className="mb-6 max-w-md text-sm text-muted-foreground">
                  You haven't added any teaching skills yet. Share what you know
                  and connect with people eager to learn from your experience.
                </p>
              </>
            )}

            <Dialog open={openOfferDialog} onOpenChange={setOpenOfferDialog}>
              <DialogTrigger asChild>
                <Button>
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
                        <SelectItem
                          value="1"
                          className="cursor-pointer flex items-center gap-2"
                        >
                          <FaStar />
                          Beginner
                        </SelectItem>
                        <SelectItem
                          value="2"
                          className="cursor-pointer flex items-center gap-2"
                        >
                          <div className="flex items-center gap-1">
                            <FaStar />
                            <FaStar />
                          </div>
                          Basic
                        </SelectItem>
                        <SelectItem
                          value="3"
                          className="cursor-pointer flex items-center gap-2"
                        >
                          <div className="flex items-center gap-1">
                            <FaStar />
                            <FaStar />
                            <FaStar />
                          </div>
                          Intermediate
                        </SelectItem>
                        <SelectItem
                          value="4"
                          className="cursor-pointer flex items-center gap-2"
                        >
                          <div className="flex items-center gap-1">
                            <FaStar />
                            <FaStar />
                            <FaStar />
                            <FaStar />
                          </div>
                          Advanced
                        </SelectItem>
                        <SelectItem
                          value="5"
                          className="cursor-pointer flex items-center gap-2"
                        >
                          <div className="flex items-center gap-1">
                            <FaStar />
                            <FaStar />
                            <FaStar />
                            <FaStar />
                            <FaStar />
                          </div>
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
          </div>
        </Card>

        {/* Learning Skills */}
        <Card className="p-6 flex flex-col justify-between">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-primary/10 p-3">
                <MdMenuBook className="h-6 w-6 text-primary" />
              </div>

              <div>
                <h3 className="font-semibold">Skills I Want to Learn</h3>
                <p className="text-sm text-muted-foreground">
                  Discover new opportunities to grow
                </p>
              </div>
            </div>

            <span className="rounded-full bg-muted px-3 py-1 text-sm font-medium">
              {wantSkillsCount} Skills
            </span>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {wantSkills &&
              wantSkills.map((skill) => (
                <Card
                  key={skill._id}
                  className="p-4 transition-all hover:shadow-md"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-lg">{skill.name}</h3>

                      <Badge variant="secondary" className="mt-1">
                        {skill.category}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-1 rounded-md bg-muted px-2 py-1 text-sm">
                      <Star className="h-4 w-4 fill-current" />
                      <span>{skill.level}/5</span>
                    </div>
                  </div>

                  {skill.tags.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {skill.tags.map((tag) => (
                        <Badge
                          key={tag}
                          variant="outline"
                          className="capitalize"
                        >
                          #{tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </Card>
              ))}
          </div>

          <div className="flex flex-col items-center justify-center text-center">
            {wantSkillsCount === 0 && (
              <>
                <div className="mb-4 rounded-full bg-muted p-4">
                  <MdMenuBook className="h-8 w-8 text-muted-foreground" />
                </div>

                <h4 className="mb-2 text-lg font-semibold">
                  Ready to learn something new?
                </h4>

                <p className="mb-6 max-w-md text-sm text-muted-foreground">
                  Add skills you're interested in learning and we'll help you
                  discover people who can teach them.
                </p>
              </>
            )}

            <Dialog open={openWantDialog} onOpenChange={setOpenWantDialog}>
              <DialogTrigger asChild>
                <Button>
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
                        <SelectItem
                          value="1"
                          className="cursor-pointer flex items-center gap-2"
                        >
                          <FaStar />
                          Beginner
                        </SelectItem>
                        <SelectItem
                          value="2"
                          className="cursor-pointer flex items-center gap-2"
                        >
                          <div className="flex items-center gap-1">
                            <FaStar />
                            <FaStar />
                          </div>
                          Basic
                        </SelectItem>
                        <SelectItem
                          value="3"
                          className="cursor-pointer flex items-center gap-2"
                        >
                          <div className="flex items-center gap-1">
                            <FaStar />
                            <FaStar />
                            <FaStar />
                          </div>
                          Intermediate
                        </SelectItem>
                        <SelectItem
                          value="4"
                          className="cursor-pointer flex items-center gap-2"
                        >
                          <div className="flex items-center gap-1">
                            <FaStar />
                            <FaStar />
                            <FaStar />
                            <FaStar />
                          </div>
                          Advanced
                        </SelectItem>
                        <SelectItem
                          value="5"
                          className="cursor-pointer flex items-center gap-2"
                        >
                          <div className="flex items-center gap-1">
                            <FaStar />
                            <FaStar />
                            <FaStar />
                            <FaStar />
                            <FaStar />
                          </div>
                          Expert
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <DialogFooter>
                  <Button
                    onClick={handleAddWantSkill}
                    disabled={loadingAddWant}
                  >
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
          </div>
        </Card>
      </div>
    </div>
  );
};

export default MySkillsPage;
