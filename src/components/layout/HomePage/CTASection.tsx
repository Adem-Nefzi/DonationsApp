"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { HandHeart } from "lucide-react";
import { Link } from "react-router-dom";

export default function CtaSection() {
  return (
    <div className="bg-primary relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(68,64,60,0.2)_50%,transparent_75%,transparent_100%)] bg-[length:20px_20px] opacity-20"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold text-primary-foreground mb-4">
            Ready to Make an Impact?
          </h2>
          <p className="text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
            Join thousands of donors who are creating positive change in
            communities around the world.
          </p>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link to="/login">
              <Button size="lg" variant="secondary" className="gap-2">
                <HandHeart className="h-5 w-5" /> Start Your Journey
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
