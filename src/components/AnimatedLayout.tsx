import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import { Cpu, Lock, Database } from 'lucide-react';

interface AnimatedLayoutProps {
  children: React.ReactNode;
}

export function AnimatedLayout({ children }: AnimatedLayoutProps) {
  // Mouse tracking for parallax
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 150 };
  const smoothMouseX = useSpring(mouseX, springConfig);
  const smoothMouseY = useSpring(mouseY, springConfig);

  const rotateX = useTransform(smoothMouseY, [-300, 300], [5, -5]);
  const rotateY = useTransform(smoothMouseX, [-300, 300], [-5, 5]);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    mouseX.set(x);
    mouseY.set(y);
  };

  return (
    <div 
      className="relative overflow-hidden min-h-screen"
      onMouseMove={handleMouseMove}
    >
      {/* Cyber Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#10b98115_1px,transparent_1px),linear-gradient(to_bottom,#10b98115_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>
      
      {/* Floating 3D Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ 
              x: Math.random() * 100 + "%", 
              y: Math.random() * 100 + "%", 
              z: -500,
              opacity: 0 
            }}
            animate={{ 
              y: [null, "-=100", "+=100"],
              z: [-500, 0, -500],
              opacity: [0, 0.2, 0],
              rotate: [0, 180, 360]
            }}
            transition={{ 
              duration: 15 + Math.random() * 20, 
              repeat: Infinity, 
              ease: "linear" 
            }}
            className="absolute w-12 h-12 border border-emerald-500/10 rounded-lg flex items-center justify-center text-emerald-500/5"
          >
            {i % 3 === 0 ? <Cpu size={24} /> : i % 3 === 1 ? <Lock size={24} /> : <Database size={24} />}
          </motion.div>
        ))}
      </div>

      <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[500px] w-[500px] rounded-full bg-emerald-400 opacity-10 blur-[150px]"></div>

      <motion.div
        style={{ rotateX, rotateY }}
        className="relative z-10 w-full h-full [transform-style:preserve-3d]"
      >
        {children}
      </motion.div>
    </div>
  );
}
