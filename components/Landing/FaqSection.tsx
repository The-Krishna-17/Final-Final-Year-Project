"use client";

import React from "react";
import Layout from "../Layout/Layout";
import { motion } from "framer-motion";
import { FaQuestionCircle } from "react-icons/fa";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { FAQS } from "@/constant/data";

const FaqSection = () => {
  return (
    <Layout>
      <section className="space-y-6" id="faqs">
        <div className="px-6 space-y-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
            className="text-center space-y-3"
          >
            <p className="text-sm uppercase tracking-widest text-muted-foreground">
              FAQs
            </p>

            <h2 className="text-3xl font-bold">Frequently asked questions</h2>

            <p className="text-muted-foreground">
              Everything you need to know about SkillXchange and how it works.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Accordion type="single" collapsible className="w-full">
              {FAQS.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left text-base font-medium">
                    {faq.question}
                  </AccordionTrigger>

                  <AccordionContent className="text-muted-foreground leading-relaxed">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default FaqSection;
