"use client";

import type React from "react";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Search, CreditCard, BarChart4 } from "lucide-react";
import { Link } from "react-router-dom";

interface Step {
  icon: React.ElementType;
  title: string;
  description: string;
  color: string;
  textColor: string;
  features: string[];
}

const steps: Step[] = [
  {
    icon: Search,
    title: "Find Causes",
    description: "Discover meaningful causes that align with your values.",
    color: "bg-blue-100",
    textColor: "text-blue-600",
    features: [
      "Search by category",
      "View impact metrics",
      "Read success stories",
    ],
  },
  {
    icon: CreditCard,
    title: "Make Donations",
    description: "Securely contribute to your chosen campaigns.",
    color: "bg-green-100",
    textColor: "text-green-600",
    features: ["Secure payments", "Multiple payment options", "Tax receipts"],
  },
  {
    icon: BarChart4,
    title: "Track Impact",
    description: "Monitor how your donations make a difference.",
    color: "bg-orange-100",
    textColor: "text-orange-600",
    features: ["Real-time updates", "Impact reports", "Community feedback"],
  },
];

export default function HowItWorks() {
  return (
    <section className="py-24 relative overflow-hidden bg-background">
      {/* Modern Grid Background */}
      <div className="absolute inset-0 bg-grid-pattern opacity-20 dark:opacity-10"></div>

      {/* Gradient Overlays */}
      <div
        className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-background/80 to-transparent"
        style={{ zIndex: 1 }}
      ></div>
      <div
        className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-background/80 to-transparent"
        style={{ zIndex: 1 }}
      ></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Title Section with Advanced Animation */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{
            type: "spring",
            stiffness: 100,
            damping: 15,
          }}
          viewport={{ once: true }}
          className="text-center mb-16 relative"
        >
          <div
            className="absolute -top-10 left-1/2 -translate-x-1/2 
      w-24 h-24 bg-primary/10 rounded-full blur-2xl animate-pulse"
          ></div>

          <Badge
            variant="outline"
            className="mb-4 px-4 py-1.5 rounded-full 
      bg-primary/10 border-primary/20 text-primary"
          >
            Simple Process
          </Badge>

          <h2
            className="text-4xl md:text-5xl font-bold mb-6 
  bg-gradient-to-r from-primary via-accent to-foreground 
  text-transparent bg-clip-text"
          >
            How HeartShare Works
          </h2>

          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Our platform simplifies generosity, transforming your compassion
            into meaningful impact through three seamless steps.
          </p>
        </motion.div>

        {/* Process Steps with Enhanced Design */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 relative">
          {/* Connecting Animated Line */}
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: "100%" }}
            transition={{ duration: 1, delay: 0.5 }}
            className="hidden md:block absolute top-24 left-[25%] right-[25%] h-0.5 
      bg-gradient-to-r from-transparent via-primary to-transparent z-0"
          ></motion.div>

          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.8,
                delay: index * 0.2,
                type: "spring",
                stiffness: 100,
                damping: 15,
              }}
              viewport={{ once: true }}
              className="relative group"
            >
              {/* Outer glow effect that appears on hover */}
              <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/30 to-primary/10 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-700 group-hover:duration-200"></div>

              <Card
                className="h-full border-none shadow-lg 
    hover:shadow-xl transition-all duration-500 
    bg-card/80 dark:bg-[#1c1917]/70 backdrop-blur-lg overflow-hidden
    group-hover:scale-[1.02] relative z-10"
              >
                {/* Animated Gradient Border */}
                <div
                  className="absolute inset-0 
      bg-gradient-to-tr from-primary/20 via-transparent to-primary/20 
      dark:from-primary/30 dark:to-primary/10
      opacity-0 group-hover:opacity-100 transition-all duration-500"
                ></div>

                {/* Subtle background pattern */}
                <div className="absolute inset-0 bg-dot-pattern opacity-5 dark:opacity-10"></div>

                {/* Inner glow effect */}
                <div className="absolute -inset-1 bg-primary/5 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-0"></div>

                <CardContent className="pt-8 pb-6 relative z-10">
                  <div className="flex items-center justify-between mb-6">
                    <div
                      className={`flex items-center justify-center 
          h-16 w-16 rounded-full ${step.color} 
          transform group-hover:rotate-6 transition-transform duration-500
          shadow-lg dark:shadow-primary/20 relative overflow-hidden`}
                    >
                      {/* Inner glow effect for icon */}
                      <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      <step.icon
                        className={`h-8 w-8 ${step.textColor} relative z-10`}
                      />
                    </div>
                    <div
                      className="flex items-center justify-center 
          h-10 w-10 rounded-full bg-primary/20 dark:bg-primary/30
          text-primary font-bold text-sm
          shadow-inner transform group-hover:scale-110 transition-transform duration-500"
                    >
                      {index + 1}
                    </div>
                  </div>

                  <h3 className="text-xl font-semibold mb-3 group-hover:text-primary transition-colors duration-300">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground dark:text-muted-foreground/90 mb-5">
                    {step.description}
                  </p>

                  <ul className="space-y-3">
                    {step.features.map((feature, i) => (
                      <motion.li
                        key={i}
                        initial={{ opacity: 0.8 }}
                        whileHover={{ opacity: 1, x: 3 }}
                        className="flex items-center gap-2.5 text-sm 
            text-muted-foreground/90 dark:text-muted-foreground/80 hover:text-foreground 
            transition-all duration-300 group-hover:translate-x-0.5"
                      >
                        <div className="h-5 w-5 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center">
                          <div className="h-1.5 w-1.5 rounded-full bg-primary"></div>
                        </div>
                        <span className="font-medium">{feature}</span>
                      </motion.li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Link to="/login">
            <Button
              size="lg"
              className="rounded-full group px-8 py-4
            bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 
             text-white shadow-lg shadow-primary/40 
            hover:shadow-xl transition-all duration-300"
            >
              Start Your Giving Journey
              <ArrowRight
                className="ml-2 h-5 w-5 
    group-hover:translate-x-1 transition-transform"
              />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
