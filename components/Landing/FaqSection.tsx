import React from "react";
import Layout from "../Layout/Layout";
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
          <div className="text-center space-y-3">
            <div className="flex items-center justify-center gap-2 text-primary">
              <FaQuestionCircle className="text-xl" />
              <p className="text-sm uppercase tracking-widest text-muted-foreground">
                FAQs
              </p>
            </div>

            <h2 className="text-3xl font-bold">Frequently asked questions</h2>

            <p className="text-muted-foreground">
              Everything you need to know about SkillXchange and how it works.
            </p>
          </div>

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
        </div>
      </section>
    </Layout>
  );
};

export default FaqSection;
