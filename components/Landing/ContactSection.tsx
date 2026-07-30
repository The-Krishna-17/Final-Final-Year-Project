"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FaCheckCircle, FaEnvelope, FaPaperPlane } from "react-icons/fa";
import { CONTACT_BENEFITS } from "@/constant/data";
import Layout from "../Layout/Layout";

export default function ContactSection() {
  return (
    <Layout>
      <section
        id="contact"
        className="space-y-6 mb-16 bg-muted/40 p-4 border border-border/50"
      >
        <div className="flex items-center gap-6">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="space-y-4 w-[60%] flex-1"
          >
            <div className="space-y-3 max-w-2xl">
              <p className="text-sm uppercase tracking-widest text-muted-foreground">
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

            <div className="flex items-center gap-3 border px-4 py-3 rounded-xl w-fit bg-background">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <FaEnvelope className="text-primary" />
              </div>

              <div>
                <h4 className="font-semibold">Email Us</h4>

                <p className="text-sm text-muted-foreground">
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
            className="rounded-xl border bg-card p-4 shadow-sm flex-1 w-[40%]"
          >
            <div className="mb-5">
              <h2 className="text-2xl font-bold">Contact SkillXchange</h2>

              <p className="text-muted-foreground mt-2">
                Have a question, suggestion, or partnership opportunity? We'd
                love to hear from you.
              </p>
            </div>

            <form className="space-y-3">
              <div className="flex items-center gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Full Name
                  </label>

                  <Input placeholder="John Doe" />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Email Address
                  </label>

                  <Input type="email" placeholder="john@example.com" />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">
                  Subject
                </label>

                <Input placeholder="How can we help?" />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">
                  Message
                </label>

                <Textarea
                  placeholder="Write your message here..."
                  className="min-h-20"
                />
              </div>

              <Button className="w-full rounded-full h-11">
                Send Message
                <FaPaperPlane />
              </Button>
            </form>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
