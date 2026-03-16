import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';

interface SectionWrapperProps {
  children: React.ReactNode;
  id: string;
}

export function SectionWrapper({ children, id }: SectionWrapperProps) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const rotateX = useTransform(scrollYProgress, [0, 0.5, 1], [8, 0, -8]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.95, 1, 0.95]);
  const opacity = useTransform(scrollYProgress, [0, 0.05, 0.95, 1], [0, 1, 1, 0]);
  const y = useTransform(scrollYProgress, [0, 1], [30, -30]);

  return (
    <section
      id={id}
      ref={ref}
      className="min-h-screen flex items-center justify-center py-20 relative"
      style={{ perspective: "1200px" }}
    >
      <motion.div
        style={{
          rotateX,
          scale,
          opacity,
          y,
          transformStyle: "preserve-3d"
        }}
        className="w-full h-full flex items-center justify-center"
      >
        <div className="w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          {children}
        </div>
      </motion.div>
    </section>
  );
}
