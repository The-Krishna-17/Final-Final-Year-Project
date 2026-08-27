"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FaCheckCircle, FaEnvelope, FaPaperPlane } from "react-icons/fa";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { CONTACT_BENEFITS } from "@/constant/data";
import { axiosInstance } from "@/utils/axiosInstance";
import Layout from "../Layout/Layout";

export default function ContactSection() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName.trim() || !email.trim() || !subject.trim() || !message.trim()) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setLoading(true);

    try {
      const response = await axiosInstance.post("/contact", {
        fullName: fullName.trim(),
        email: email.trim(),
        subject: subject.trim(),
        message: message.trim(),
      });

      toast.success(
        response.data?.message || "Thank you! Your message has been sent successfully."
      );

      // Reset form
      setFullName("");
      setEmail("");
      setSubject("");
      setMessage("");
    } catch (error: any) {
      console.error("Contact form submit error:", error);
      const errMsg =
        error.response?.data?.message ||
        "Failed to send message. Please try again later.";
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <section
        id="contact"
        className="space-y-6 mb-16 bg-muted/40 p-4 border border-border/50 rounded-2xl"
      >
        <div className="flex flex-col lg:flex-row items-stretch gap-6">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="space-y-4 lg:w-[60%] flex-1"
          >
            <div className="space-y-3 max-w-2xl">
              <p className="text-sm uppercase tracking-widest text-muted-foreground font-medium">
                Get In Touch
              </p>
              <h2 className="text-3xl font-bold leading-tight">
                Let's build the future of skill sharing together
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                SkillXchange is committed to making skill development accessible
                to everyone. Whether you're a learner, mentor, researcher, or
                potential partner, we're always open to new conversations and
                collaborations.
              </p>
            </div>

            <div className="space-y-4">
              {CONTACT_BENEFITS.map((item) => (
                <div key={item} className="flex items-start gap-4">
                  <FaCheckCircle className="text-primary mt-1 shrink-0" />
                  <p className="text-muted-foreground">{item}</p>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-3 border px-4 py-3 rounded-xl w-fit bg-background shadow-xs">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <FaEnvelope className="text-primary" />
              </div>

              <div>
                <h4 className="font-semibold text-sm">Email Us</h4>
                <p className="text-xs text-muted-foreground">
                  thekrishnadhami17@gmail.com
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="rounded-xl border bg-card p-6 shadow-sm flex-1 lg:w-[40%]"
          >
            <div className="mb-5">
              <h2 className="text-2xl font-bold">Contact SkillXchange</h2>
              <p className="text-sm text-muted-foreground mt-1.5">
                Have a question, suggestion, or partnership opportunity? We'd
                love to hear from you.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold mb-1.5 block text-foreground">
                    Full Name *
                  </label>
                  <Input
                    placeholder="John Doe"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold mb-1.5 block text-foreground">
                    Email Address *
                  </label>
                  <Input
                    type="email"
                    placeholder="john@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold mb-1.5 block text-foreground">
                  Subject *
                </label>
                <Input
                  placeholder="How can we help?"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>

              <div>
                <label className="text-xs font-semibold mb-1.5 block text-foreground">
                  Message *
                </label>
                <Textarea
                  placeholder="Write your message here..."
                  className="min-h-24 leading-relaxed"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>

              <Button
                type="submit"
                className="w-full rounded-full h-11 cursor-pointer gap-2 font-medium"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Sending Message...
                  </>
                ) : (
                  <>
                    Send Message <FaPaperPlane className="w-3.5 h-3.5" />
                  </>
                )}
              </Button>
            </form>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
