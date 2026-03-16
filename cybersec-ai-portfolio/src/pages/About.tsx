import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { supabase } from '@/lib/supabase';
import { Target, Shield, Cpu, Lock } from 'lucide-react';
import { AnimatedLayout } from '@/components/AnimatedLayout';

export function About() {
  const [content, setContent] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    supabase.from('content').select('*').eq('section', 'about').single().then(({ data, error }) => {
      if (data?.data) {
        setContent(data.data);
      } else {
        setContent({
          bio: "I am a passionate technologist focusing on the intersection of cybersecurity and artificial intelligence. With a strong foundation in both offensive and defensive security, I strive to build resilient systems.",
          careerGoals: "My goal is to lead innovative security research and develop AI-driven solutions that proactively identify and mitigate emerging cyber threats.",
          focusAreas: ["Cybersecurity", "Artificial Intelligence", "Automation", "Security Research"]
        });
      }
      setIsLoading(false);
    });
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!content) return null;

  const focusIcons: Record<string, any> = {
    'Cybersecurity': Shield,
    'Artificial Intelligence': Cpu,
    'Automation': Target,
    'Security Research': Lock,
  };

  return (
    <AnimatedLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-slate-100 font-mono mb-4">
            <span className="text-emerald-400">&gt;</span> About_Me
          </h2>
          <div className="w-24 h-1 bg-emerald-500/20 mx-auto rounded-full"></div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 [perspective:1000px]">
          <motion.div
            initial={{ opacity: 0, x: -50, rotateY: -20 }}
            whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ delay: 0.2, type: "spring", bounce: 0.4 }}
            className="space-y-8 [transform-style:preserve-3d]"
          >
            <motion.div 
              whileHover={{ scale: 1.02, rotateX: 2, rotateY: 2, boxShadow: "0 10px 30px -10px rgba(52,211,153,0.3)" }}
              className="bg-slate-900/50 border border-slate-800 rounded-2xl p-8 backdrop-blur-sm transition-colors relative overflow-hidden group"
            >
              <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(16,185,129,0.05)_50%,transparent_50%)] bg-[length:100%_4px] opacity-0 group-hover:opacity-100 transition-opacity" />
              <h3 className="text-xl font-mono text-emerald-400 mb-4">Biography</h3>
              <p className="text-slate-300 leading-relaxed">
                {content.bio}
              </p>
            </motion.div>

            <motion.div 
              whileHover={{ scale: 1.02, rotateX: 2, rotateY: 2, boxShadow: "0 10px 30px -10px rgba(52,211,153,0.3)" }}
              className="bg-slate-900/50 border border-slate-800 rounded-2xl p-8 backdrop-blur-sm transition-colors relative overflow-hidden group"
            >
              <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(16,185,129,0.05)_50%,transparent_50%)] bg-[length:100%_4px] opacity-0 group-hover:opacity-100 transition-opacity" />
              <h3 className="text-xl font-mono text-emerald-400 mb-4">Career Goals</h3>
              <p className="text-slate-300 leading-relaxed">
                {content.careerGoals}
              </p>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50, rotateY: 20 }}
            whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ delay: 0.4, type: "spring", bounce: 0.4 }}
            className="[transform-style:preserve-3d]"
          >
            <h3 className="text-xl font-mono text-emerald-400 mb-6 px-2">Focus Areas</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {content.focusAreas?.map((area: string, index: number) => {
                const Icon = focusIcons[area] || Target;
                return (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.05, rotateZ: 1, boxShadow: "0 10px 20px -5px rgba(52,211,153,0.4)" }}
                    whileTap={{ scale: 0.95, boxShadow: "0 0 15px rgba(52,211,153,0.8)" }}
                    className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 flex items-start space-x-4 group hover:border-emerald-500/50 transition-colors cursor-pointer"
                  >
                    <div className="p-3 bg-slate-800 rounded-lg group-hover:bg-emerald-500/10 transition-colors">
                      <Icon className="w-6 h-6 text-emerald-400" />
                    </div>
                    <div>
                      <h4 className="text-slate-200 font-medium">{area}</h4>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </AnimatedLayout>
  );
}
