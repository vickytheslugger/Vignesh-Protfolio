import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { supabase } from '@/lib/supabase';
import { Terminal, Shield, Cpu, Wrench } from 'lucide-react';
import { AnimatedLayout } from '@/components/AnimatedLayout';

export function Skills() {
  const [skills, setSkills] = useState<any[]>([]);

  useEffect(() => {
    supabase.from('skills').select('*').order('name', { ascending: true }).then(({ data }) => {
      if (data) setSkills(data);
    });
  }, []);

  const categories = ['Cybersecurity', 'Artificial Intelligence', 'Programming', 'Tools', 'Skills'];
  const categoryIcons: Record<string, any> = {
    'Cybersecurity': Shield,
    'Artificial Intelligence': Cpu,
    'Programming': Terminal,
    'Tools': Wrench,
    'Skills': Terminal,
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
            <span className="text-emerald-400">&gt;</span> Skills & Tools
          </h2>
          <div className="w-24 h-1 bg-emerald-500/20 mx-auto rounded-full"></div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 [perspective:1000px]">
          {categories.map((category, catIndex) => {
            const categorySkills = skills.filter(s => s.category === category);
            if (categorySkills.length === 0) return null;
            const Icon = categoryIcons[category] || Terminal;

            return (
              <motion.div
                key={category}
                initial={{ opacity: 0, y: 50, rotateX: -20 }}
                whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: catIndex * 0.1, type: "spring", stiffness: 100 }}
                whileHover={{ scale: 1.05, rotateX: 5, rotateY: 5, boxShadow: "0 25px 50px -12px rgba(52,211,153,0.5)" }}
                className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 [transform-style:preserve-3d] transition-colors relative overflow-hidden group"
              >
                <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(16,185,129,0.05)_50%,transparent_50%)] bg-[length:100%_4px] opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="flex items-center space-x-3 mb-6 border-b border-slate-800 pb-4">
                  <div className="p-2 bg-emerald-500/10 rounded-lg">
                    <Icon className="w-6 h-6 text-emerald-400" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-100">{category}</h3>
                </div>

                <div className="flex flex-wrap gap-3">
                  {categorySkills.map((skill, index) => (
                    <motion.div
                      key={skill.id}
                      whileHover={{ scale: 1.1, y: -5, boxShadow: "0 10px 20px -5px rgba(52,211,153,0.5)" }}
                      whileTap={{ scale: 0.9, boxShadow: "0 0 15px rgba(52,211,153,0.8)" }}
                      className="px-4 py-2 bg-slate-800 rounded-lg border border-slate-700 text-slate-300 text-sm font-medium hover:border-emerald-500/50 hover:text-emerald-400 transition-colors cursor-default"
                    >
                      {skill.name}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </AnimatedLayout>
  );
}
