import React, { useRef } from 'react';
import { motion, useInView } from 'motion/react';

interface SectionWrapperProps {
  children: React.ReactNode;
  id: string;
}

export function SectionWrapper({ children, id }: SectionWrapperProps) {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      id={id}
      ref={ref}
      className="min-h-screen flex items-center justify-center py-20 relative"
    >
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="w-full h-full flex items-center justify-center"
      >
        <div className="w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          {children}
        </div>
      </motion.div>
    </section>
  );
}
