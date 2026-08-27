"use client";

import React, { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { axiosInstance } from "@/utils/axiosInstance";
import {
  Heading,
  Heading1,
  Image as ImageIcon,
  Code,
  Quote,
  List,
  AlignLeft,
  Trash2,
  GripVertical,
  Loader2,
  MoveUp,
  MoveDown,
} from "lucide-react";
import { toast } from "sonner";

// ─── Block Types ────────────────────────────────────────────────────────────────

export type BlockType =
  | "paragraph"
  | "heading2"
  | "heading3"
  | "code"
  | "quote"
  | "bullet"
  | "image";

export interface Block {
  id: string;
  type: BlockType;
  content: string;    // text / code / alt text / bullet text / quote text
  language?: string;  // for code blocks
  imageUrl?: string;  // for images
  imageAlt?: string;  // for images
}

function generateId() {
  return Math.random().toString(36).slice(2, 9);
}

// ─── Serialize blocks to the markdown-like format for storage ───────────────────

export function serializeBlocks(blocks: Block[]): string {
  return blocks
    .map((block) => {
      switch (block.type) {
        case "heading2":
          return `## ${block.content}`;
        case "heading3":
          return `### ${block.content}`;
        case "code":
          return `\`\`\`${block.language || ""}
${block.content}
\`\`\``;
        case "quote":
          return `> ${block.content}`;
        case "bullet":
          return `- ${block.content}`;
        case "image":
          return `![${block.imageAlt || ""}](${block.imageUrl || ""})`;
        case "paragraph":
        default:
          return block.content;
      }
    })
    .join("\n\n");
}

// ─── Deserialize stored string back to blocks (for editing) ────────────────────

export function deserializeToBlocks(content: string): Block[] {
  if (!content.trim()) return [{ id: generateId(), type: "paragraph", content: "" }];

  const blocks: Block[] = [];
  const lines = content.split("\n");
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();

    if (!trimmed) {
      i++;
      continue;
    }

    // Code block
    if (trimmed.startsWith("```")) {
      const lang = trimmed.replace("```", "").trim();
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith("```")) {
        codeLines.push(lines[i]);
        i++;
      }
      blocks.push({
        id: generateId(),
        type: "code",
        content: codeLines.join("\n"),
        language: lang,
      });
      i++; // skip closing ```
      continue;
    }

    // Heading 2
    if (trimmed.startsWith("## ")) {
      blocks.push({ id: generateId(), type: "heading2", content: trimmed.replace("## ", "") });
      i++;
      continue;
    }

    // Heading 3
    if (trimmed.startsWith("### ")) {
      blocks.push({ id: generateId(), type: "heading3", content: trimmed.replace("### ", "") });
      i++;
      continue;
    }

    // Blockquote
    if (trimmed.startsWith("> ")) {
      blocks.push({ id: generateId(), type: "quote", content: trimmed.replace("> ", "") });
      i++;
      continue;
    }

    // Bullet
    if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
      blocks.push({ id: generateId(), type: "bullet", content: trimmed.substring(2) });
      i++;
      continue;
    }

    // Image markdown
    const imgMatch = trimmed.match(/^!\[(.*?)\]\((.*?)\)$/);
    if (imgMatch) {
      blocks.push({
        id: generateId(),
        type: "image",
        content: imgMatch[1],
        imageAlt: imgMatch[1],
        imageUrl: imgMatch[2],
      });
      i++;
      continue;
    }

    // Paragraph
    blocks.push({ id: generateId(), type: "paragraph", content: line });
    i++;
  }

  return blocks.length > 0
    ? blocks
    : [{ id: generateId(), type: "paragraph", content: "" }];
}

// ─── Individual Block Renderers (Edit Mode) ─────────────────────────────────────

interface BlockEditorProps {
  block: Block;
  onChange: (id: string, updates: Partial<Block>) => void;
  onDelete: (id: string) => void;
  onMoveUp: (id: string) => void;
  onMoveDown: (id: string) => void;
  isFirst: boolean;
  isLast: boolean;
  uploadImage: (file: File) => Promise<string>;
}

function BlockEditor({
  block,
  onChange,
  onDelete,
  onMoveUp,
  onMoveDown,
  isFirst,
  isLast,
  uploadImage,
}: BlockEditorProps) {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file.");
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      toast.error("Image must be under 8MB.");
      return;
    }
    setUploading(true);
    try {
      const url = await uploadImage(file);
      onChange(block.id, { imageUrl: url });
      toast.success("Image uploaded!");
    } catch {
      toast.error("Failed to upload image.");
    } finally {
      setUploading(false);
    }
  };

  const baseClass =
    "group relative flex gap-2 rounded-xl border border-transparent hover:border-border transition-colors p-1";

  const controls = (
    <div className="flex flex-col gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 pt-1">
      <button
        type="button"
        onClick={() => onMoveUp(block.id)}
        disabled={isFirst}
        className="p-1 rounded-md hover:bg-muted cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        title="Move up"
      >
        <MoveUp className="w-3 h-3 text-muted-foreground" />
      </button>
      <button
        type="button"
        onClick={() => onMoveDown(block.id)}
        disabled={isLast}
        className="p-1 rounded-md hover:bg-muted cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        title="Move down"
      >
        <MoveDown className="w-3 h-3 text-muted-foreground" />
      </button>
      <button
        type="button"
        onClick={() => onDelete(block.id)}
        className="p-1 rounded-md hover:bg-destructive/10 cursor-pointer transition-colors"
        title="Delete block"
      >
        <Trash2 className="w-3 h-3 text-red-400" />
      </button>
    </div>
  );

  if (block.type === "heading2") {
    return (
      <div className={baseClass}>
        {controls}
        <div className="flex-1">
          <div className="text-[10px] font-bold uppercase text-primary/60 mb-1 ml-1 tracking-widest flex items-center gap-1">
            <Heading className="w-3 h-3" /> Heading 2
          </div>
          <Input
            value={block.content}
            onChange={(e) => onChange(block.id, { content: e.target.value })}
            placeholder="Heading 2"
            className="text-xl font-bold bg-primary/5 border-primary/20 h-12"
          />
        </div>
      </div>
    );
  }

  if (block.type === "heading3") {
    return (
      <div className={baseClass}>
        {controls}
        <div className="flex-1">
          <div className="text-[10px] font-bold uppercase text-violet-500/60 mb-1 ml-1 tracking-widest flex items-center gap-1">
            <Heading className="w-3 h-3" /> Heading 3
          </div>
          <Input
            value={block.content}
            onChange={(e) => onChange(block.id, { content: e.target.value })}
            placeholder="Heading 3"
            className="text-lg font-semibold bg-violet-500/5 border-violet-300/30 h-10"
          />
        </div>
      </div>
    );
  }

  if (block.type === "quote") {
    return (
      <div className={baseClass}>
        {controls}
        <div className="flex-1">
          <div className="text-[10px] font-bold uppercase text-amber-600/60 mb-1 ml-1 tracking-widest flex items-center gap-1">
            <Quote className="w-3 h-3" /> Blockquote
          </div>
          <div className="border-l-4 border-amber-400 pl-3 bg-amber-50/50 dark:bg-amber-950/20 rounded-r-xl py-2">
            <Textarea
              value={block.content}
              onChange={(e) => onChange(block.id, { content: e.target.value })}
              placeholder="Write a key insight, tip, or quote..."
              className="italic text-sm bg-transparent border-none shadow-none resize-none min-h-12 p-0 focus-visible:ring-0"
            />
          </div>
        </div>
      </div>
    );
  }

  if (block.type === "bullet") {
    return (
      <div className={baseClass}>
        {controls}
        <div className="flex-1 flex items-start gap-2 pt-2">
          <span className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0" />
          <Input
            value={block.content}
            onChange={(e) => onChange(block.id, { content: e.target.value })}
            placeholder="List item"
            className="bg-background border-dashed text-sm h-9"
          />
        </div>
      </div>
    );
  }

  if (block.type === "code") {
    return (
      <div className={baseClass}>
        {controls}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1 ml-1">
            <div className="text-[10px] font-bold uppercase text-amber-500/70 tracking-widest flex items-center gap-1">
              <Code className="w-3 h-3" /> Code Block
            </div>
            <Input
              value={block.language || ""}
              onChange={(e) => onChange(block.id, { language: e.target.value })}
              placeholder="Language (e.g. js)"
              className="w-28 h-6 text-[10px] px-2 bg-muted border-border"
            />
          </div>
          <div className="rounded-xl overflow-hidden border border-slate-700 bg-slate-950">
            <div className="bg-slate-900 px-4 py-1.5 text-[10px] font-mono text-slate-400 border-b border-slate-800 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
              <span className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
              <span className="ml-2 text-slate-500">{block.language || "code"}</span>
            </div>
            <Textarea
              value={block.content}
              onChange={(e) => onChange(block.id, { content: e.target.value })}
              placeholder={`// Write your ${block.language || "code"} here...`}
              className="font-mono text-xs text-slate-100 bg-transparent border-none shadow-none resize-none min-h-28 p-4 focus-visible:ring-0"
            />
          </div>
        </div>
      </div>
    );
  }

  if (block.type === "image") {
    return (
      <div className={baseClass}>
        {controls}
        <div className="flex-1 space-y-2">
          <div className="text-[10px] font-bold uppercase text-emerald-500/60 mb-1 ml-1 tracking-widest flex items-center gap-1">
            <ImageIcon className="w-3 h-3" /> Image
          </div>

          {/* Image preview */}
          {block.imageUrl ? (
            <div className="relative rounded-xl overflow-hidden border border-border bg-muted/30 group/img">
              <img
                src={block.imageUrl}
                alt={block.imageAlt || "Blog image"}
                className="w-full max-h-64 object-cover"
              />
              <div className="absolute inset-0 bg-black/0 group-hover/img:bg-black/40 transition-all flex items-center justify-center gap-2 opacity-0 group-hover/img:opacity-100">
                <Button
                  type="button"
                  size="sm"
                  variant="secondary"
                  onClick={() => fileInputRef.current?.click()}
                  className="cursor-pointer text-xs gap-1"
                >
                  <ImageIcon className="w-3 h-3" /> Change Image
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="destructive"
                  onClick={() => onChange(block.id, { imageUrl: "" })}
                  className="cursor-pointer text-xs gap-1"
                >
                  <Trash2 className="w-3 h-3" /> Remove
                </Button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="w-full h-40 rounded-xl border-2 border-dashed border-emerald-400/40 bg-emerald-50/30 dark:bg-emerald-950/10 hover:bg-emerald-50/60 dark:hover:bg-emerald-950/20 transition-all flex flex-col items-center justify-center gap-3 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {uploading ? (
                <>
                  <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
                  <span className="text-xs text-muted-foreground font-medium">Uploading to Cloudinary...</span>
                </>
              ) : (
                <>
                  <div className="p-3 rounded-full bg-emerald-500/10">
                    <ImageIcon className="w-7 h-7 text-emerald-500" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">Upload image</p>
                    <p className="text-xs text-muted-foreground mt-0.5">PNG, JPG, WEBP · 8MB max</p>
                  </div>
                </>
              )}
            </button>
          )}

          {/* Alt text */}
          <Input
            value={block.imageAlt || ""}
            onChange={(e) => onChange(block.id, { imageAlt: e.target.value })}
            placeholder="Caption (optional)"
            className="bg-background text-xs h-9"
          />

          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageFileChange}
          />
        </div>
      </div>
    );
  }

  // Paragraph (default)
  return (
    <div className={baseClass}>
      {controls}
      <div className="flex-1">
        <Textarea
          value={block.content}
          onChange={(e) => onChange(block.id, { content: e.target.value })}
          placeholder="Write here..."
          className="min-h-20 bg-background text-sm leading-relaxed border-border resize-none"
        />
      </div>
    </div>
  );
}

// ─── Block Type Picker ──────────────────────────────────────────────────────────

const BLOCK_TYPES: { type: BlockType; label: string; icon: React.ReactNode; desc: string; color: string }[] = [
  {
    type: "paragraph",
    label: "Paragraph",
    icon: <AlignLeft className="w-4 h-4" />,
    desc: "Regular text body",
    color: "text-foreground",
  },
  {
    type: "heading2",
    label: "Heading 2",
    icon: <Heading className="w-4 h-4" />,
    desc: "Section heading",
    color: "text-primary",
  },
  {
    type: "heading3",
    label: "Heading 3",
    icon: <Heading className="w-4 h-4" />,
    desc: "Sub-section heading",
    color: "text-violet-500",
  },
  {
    type: "image",
    label: "Image",
    icon: <ImageIcon className="w-4 h-4" />,
    desc: "Upload from device",
    color: "text-emerald-500",
  },
  {
    type: "code",
    label: "Code Block",
    icon: <Code className="w-4 h-4" />,
    desc: "Syntax-styled snippet",
    color: "text-amber-500",
  },
  {
    type: "quote",
    label: "Blockquote",
    icon: <Quote className="w-4 h-4" />,
    desc: "Key insight or tip",
    color: "text-amber-600",
  },
  {
    type: "bullet",
    label: "Bullet Point",
    icon: <List className="w-4 h-4" />,
    desc: "List item",
    color: "text-blue-500",
  },
];

// ─── Main Editor Component ──────────────────────────────────────────────────────

interface BlogBlockEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export default function BlogBlockEditor({ value, onChange }: BlogBlockEditorProps) {
  const [blocks, setBlocks] = useState<Block[]>(() => deserializeToBlocks(value));

  const updateParent = (updatedBlocks: Block[]) => {
    onChange(serializeBlocks(updatedBlocks));
  };

  const addBlock = (type: BlockType) => {
    const newBlock: Block = {
      id: generateId(),
      type,
      content: "",
      language: type === "code" ? "javascript" : undefined,
      imageUrl: type === "image" ? "" : undefined,
      imageAlt: type === "image" ? "" : undefined,
    };
    const updated = [...blocks, newBlock];
    setBlocks(updated);
    updateParent(updated);
  };

  const updateBlock = (id: string, updates: Partial<Block>) => {
    const updated = blocks.map((b) => (b.id === id ? { ...b, ...updates } : b));
    setBlocks(updated);
    updateParent(updated);
  };

  const deleteBlock = (id: string) => {
    const updated = blocks.filter((b) => b.id !== id);
    const final = updated.length === 0
      ? [{ id: generateId(), type: "paragraph" as BlockType, content: "" }]
      : updated;
    setBlocks(final);
    updateParent(final);
  };

  const moveBlock = (id: string, dir: "up" | "down") => {
    const idx = blocks.findIndex((b) => b.id === id);
    if (idx === -1) return;
    const newIdx = dir === "up" ? idx - 1 : idx + 1;
    if (newIdx < 0 || newIdx >= blocks.length) return;
    const updated = [...blocks];
    [updated[idx], updated[newIdx]] = [updated[newIdx], updated[idx]];
    setBlocks(updated);
    updateParent(updated);
  };

  const uploadImage = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async () => {
        try {
          const base64 = reader.result as string;
          const res = await axiosInstance.post("/blogs/upload-image", { data: base64 });
          resolve(res.data.data.url);
        } catch (err) {
          reject(err);
        }
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  return (
    <div className="space-y-4">
      {/* Block Type Toolbar */}
      <div className="flex items-center gap-1.5 flex-wrap bg-muted/40 border border-border rounded-xl p-2.5">
        <span className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest mr-1">
          Add Block:
        </span>
        {BLOCK_TYPES.map((bt) => (
          <button
            key={bt.type}
            type="button"
            onClick={() => addBlock(bt.type)}
            title={bt.desc}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-background border border-border hover:bg-accent hover:border-accent-foreground/20 transition-all cursor-pointer text-xs font-medium ${bt.color}`}
          >
            {bt.icon}
            <span className="hidden sm:inline">{bt.label}</span>
          </button>
        ))}
      </div>

      {/* Blocks */}
      <div className="space-y-2 min-h-40">
        {blocks.length === 0 && (
          <div className="text-center py-10 text-sm text-muted-foreground border-2 border-dashed border-border rounded-xl">
            Click a block type above to start writing your article.
          </div>
        )}
        {blocks.map((block, idx) => (
          <BlockEditor
            key={block.id}
            block={block}
            onChange={updateBlock}
            onDelete={deleteBlock}
            onMoveUp={(id) => moveBlock(id, "up")}
            onMoveDown={(id) => moveBlock(id, "down")}
            isFirst={idx === 0}
            isLast={idx === blocks.length - 1}
            uploadImage={uploadImage}
          />
        ))}
      </div>

      {/* Word count */}
      <div className="text-[11px] text-muted-foreground text-right pr-1">
        {blocks.filter((b) => b.type !== "image").reduce((sum, b) => sum + b.content.split(/\s+/).filter(Boolean).length, 0)} words ·{" "}
        {Math.max(1, Math.ceil(blocks.filter((b) => b.type !== "image").reduce((sum, b) => sum + b.content.split(/\s+/).filter(Boolean).length, 0) / 200))} min read
      </div>
    </div>
  );
}
