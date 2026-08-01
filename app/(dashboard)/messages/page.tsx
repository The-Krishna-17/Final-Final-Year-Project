"use client";

import { ChangeEvent, useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { toast } from "sonner";
import {
  FileText,
  ImageIcon,
  Loader2,
  Paperclip,
  Send,
  Video,
  MessageCircle,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { axiosInstance } from "@/utils/axiosInstance";
import { SwapPartner } from "@/store/features/swaps/type";

type Attachment = {
  _id: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
};
type ChatMessage = {
  _id: string;
  sender: { _id: string };
  text: string;
  attachment?: Attachment | null;
  createdAt: string;
};
const MAX_FILE_SIZE = 15 * 1024 * 1024;
const formatSize = (bytes: number) =>
  `${(bytes / 1024 / 1024).toFixed(bytes > 1024 * 1024 ? 1 : 2)} MB`;

export default function MessagesPage() {
  const [partners, setPartners] = useState<SwapPartner[]>([]);
  const [active, setActive] = useState<SwapPartner | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [text, setText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [partnerTyping, setPartnerTyping] = useState(false);
  const socketRef = useRef<Socket | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const activePartnerIdRef = useRef<string | null>(null);
  useEffect(() => {
    axiosInstance
      .get("/swaps/partners")
      .then((r) => {
        const activePartners = r.data.data.partners.filter(
          (p: SwapPartner) => p.status !== "completed",
        );
        setPartners(activePartners);
        setActive(activePartners[0] ?? null);
      })
      .catch(() => toast.error("Could not load chat connections"))
      .finally(() => setLoading(false));
  }, []);
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  useEffect(() => {
    const socket = io(
      process.env.NEXT_PUBLIC_SOCKET_URL ||
        "http://localhost:5000" ||
        "https://skillsxchange.vercel.app/",
      { path: "/socket.io/", withCredentials: true },
    );
    socketRef.current = socket;
    socket.on("connect_error", () =>
      toast.error("Real-time chat is unavailable"),
    );
    socket.on("message:new", (message: ChatMessage) =>
      setMessages((current) =>
        current.some((item) => item._id === message._id)
          ? current
          : [...current, message],
      ),
    );
    socket.on(
      "typing:update",
      ({ senderId, isTyping }: { senderId: string; isTyping: boolean }) => {
        if (senderId === activePartnerIdRef.current) setPartnerTyping(isTyping);
      },
    );
    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, []);
  useEffect(() => {
    activePartnerIdRef.current = active?.user._id || null;
    setPartnerTyping(false);
    if (!active) return;
    setMessages([]);
    axiosInstance
      .get(`/messages/${active.user._id}`)
      .then((r) => setMessages(r.data.data.messages))
      .catch(() => toast.error("Could not load messages"));
    socketRef.current?.emit("conversation:join", {
      partnerId: active.user._id,
    });
  }, [active]);
  const handleTextChange = (value: string) => {
    setText(value);
    if (!active || !socketRef.current?.connected) return;
    socketRef.current.emit("typing:update", {
      recipientId: active.user._id,
      isTyping: Boolean(value.trim()),
    });
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    if (value.trim())
      typingTimeoutRef.current = setTimeout(
        () =>
          socketRef.current?.emit("typing:update", {
            recipientId: active.user._id,
            isTyping: false,
          }),
        1300,
      );
  };
  const chooseFile = (event: ChangeEvent<HTMLInputElement>) => {
    const selected = event.target.files?.[0];
    if (!selected) return;
    if (selected.size > MAX_FILE_SIZE)
      return toast.error("Files must be 15 MB or smaller");
    setFile(selected);
  };
  const send = async () => {
    if (!active || (!text.trim() && !file) || !socketRef.current?.connected)
      return;
    setSending(true);
    socketRef.current.emit("typing:update", {
      recipientId: active.user._id,
      isTyping: false,
    });
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    try {
      const attachment = file
        ? {
            name: file.name,
            type: file.type || "application/octet-stream",
            data: await new Promise<string>((resolve, reject) => {
              const reader = new FileReader();
              reader.onload = () => resolve(reader.result as string);
              reader.onerror = reject;
              reader.readAsDataURL(file);
            }),
          }
        : undefined;
      socketRef.current.emit(
        "message:send",
        { recipientId: active.user._id, text, attachment },
        (result: { ok: boolean; error?: string }) => {
          setSending(false);
          if (!result.ok)
            return toast.error(result.error || "Message could not be sent");
          setText("");
          setFile(null);
          if (fileRef.current) fileRef.current.value = "";
        },
      );
    } catch {
      setSending(false);
      toast.error("Could not read that file");
    }
  };
  if (loading)
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="animate-spin" />
      </div>
    );
  if (!partners.length)
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center border border-border rounded-lg bg-muted/20 border-dashed mt-4">
        <MessageCircle className="text-4xl w-10 h-10 text-muted-foreground mb-4 opacity-50" />
        <h3 className="font-medium text-lg">No conversations yet</h3>
        <p className="text-sm text-muted-foreground mt-1 max-w-sm">
          Accept a skill-swap request to start messaging with your exchange
          partner.
        </p>
      </div>
    );
  const initials = (p: SwapPartner) =>
    `${p.user.firstName[0] || ""}${p.user.lastName[0] || ""}`.toUpperCase();
  return (
    <div className="-mx-4 -mt-6 grid h-[calc(100vh-5rem)] grid-cols-1 overflow-hidden border-t bg-background md:grid-cols-[280px_1fr]">
      <aside className="flex flex-col border-b md:border-b-0 md:border-r overflow-hidden">
        <div className="p-4 font-semibold border-b border-border shrink-0">
          Messages
        </div>
        <div className="flex-1 overflow-y-auto">
          {partners.map((partner) => (
            <button
              key={partner.swapId}
              onClick={() => setActive(partner)}
              className={`flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-muted/60 ${active?.user._id === partner.user._id ? "bg-muted" : ""}`}
            >
              <Avatar>
                <AvatarImage src={partner.user.avatar} />
                <AvatarFallback>{initials(partner)}</AvatarFallback>
              </Avatar>
              <span className="min-w-0">
                <span className="block truncate font-medium">
                  {partner.user.firstName} {partner.user.lastName}
                </span>
                <span className="block truncate text-xs text-muted-foreground">
                  {partner.offeredSkill || "Skill partner"}
                </span>
              </span>
            </button>
          ))}
        </div>
      </aside>
      {active && (
        <section className="flex min-h-0 flex-col">
          <header className="flex items-center gap-3 border-b p-4">
            <Avatar>
              <AvatarImage src={active.user.avatar} />
              <AvatarFallback>{initials(active)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold">
                {active.user.firstName} {active.user.lastName}
              </p>
              <p className="text-xs text-muted-foreground">
                Connected skill partner
              </p>
            </div>
          </header>
          <main className="flex-1 space-y-3 overflow-y-auto p-4">
            {messages.map((message) => {
              const mine = message.sender._id !== active.user._id;
              const a = message.attachment;
              return (
                <div
                  key={message._id}
                  className={`flex ${mine ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm ${mine ? "bg-primary text-primary-foreground" : "bg-muted"}`}
                  >
                    {message.text && (
                      <p className="whitespace-pre-wrap">{message.text}</p>
                    )}
                    {a && (
                      <a
                        href={a.url}
                        target="_blank"
                        className="mt-2 flex items-center gap-2 rounded-lg border border-current/20 bg-background/10 p-2 hover:bg-background/20"
                      >
                        {a.mimeType.startsWith("image/") ? (
                          <ImageIcon size={18} />
                        ) : a.mimeType.startsWith("video/") ? (
                          <Video size={18} />
                        ) : (
                          <FileText size={18} />
                        )}
                        <span className="min-w-0">
                          <span className="block truncate">
                            {a.originalName}
                          </span>
                          <span className="text-xs opacity-70">
                            {formatSize(a.size)}
                          </span>
                        </span>
                      </a>
                    )}
                    <p className="mt-1 text-[10px] opacity-60">
                      {new Date(message.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              );
            })}
            <div ref={endRef} />
            {partnerTyping && (
              <p className="text-xs italic text-muted-foreground">
                {active.user.firstName} is typing…
              </p>
            )}
          </main>
          <footer className="border-t p-3">
            {file && (
              <div className="mb-2 flex items-center justify-between rounded bg-muted px-3 py-2 text-xs">
                <span className="truncate">
                  {file.name} · {formatSize(file.size)}
                </span>
                <button onClick={() => setFile(null)}>Remove</button>
              </div>
            )}
            <div className="flex gap-2">
              <input
                ref={fileRef}
                onChange={chooseFile}
                type="file"
                className="hidden"
                accept="image/*,video/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.zip,.txt"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={() => fileRef.current?.click()}
                aria-label="Attach file"
              >
                <Paperclip size={18} />
              </Button>
              <Input
                value={text}
                onChange={(event) => handleTextChange(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !event.shiftKey) {
                    event.preventDefault();
                    send();
                  }
                }}
                placeholder="Write a message..."
                maxLength={4000}
              />
              <Button
                onClick={send}
                disabled={sending || (!text.trim() && !file)}
                size="icon"
                aria-label="Send message"
              >
                {sending ? (
                  <Loader2 className="animate-spin" size={18} />
                ) : (
                  <Send size={18} />
                )}
              </Button>
            </div>
          </footer>
        </section>
      )}
    </div>
  );
}
