import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { supabase } from '@/lib/supabase';
import { Briefcase, Calendar, MapPin } from 'lucide-react';
import { AnimatedLayout } from '@/components/AnimatedLayout';

export function Experience() {
  const [experiences, setExperiences] = useState<any[]>([]);

  useEffect(() => {
    supabase.from('experience').select('*').order('start_date', { ascending: false }).then(({ data }) => {
      if (data) setExperiences(data);
    });
  }, []);

  return (
    <AnimatedLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-slate-100 font-mono mb-4">
            <span className="text-emerald-400">&gt;</span> Experience
          </h2>
          <div className="w-24 h-1 bg-emerald-500/20 mx-auto rounded-full"></div>
        </motion.div>

        <div className="relative max-w-3xl mx-auto">
          {/* Timeline Line */}
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-slate-800 transform md:-translate-x-1/2"></div>

          <div className="space-y-12 [perspective:1000px]">
            {experiences.map((exp, index) => (
              <motion.div
                key={exp.id}
                initial={{ opacity: 0, x: index % 2 === 0 ? 50 : -50, rotateY: index % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: index * 0.1, type: "spring", stiffness: 100 }}
                className={`relative flex flex-col md:flex-row items-start [transform-style:preserve-3d] ${
                  index % 2 === 0 ? 'md:flex-row-reverse' : ''
                }`}
              >
                {/* Timeline Dot */}
                <motion.div 
                  whileInView={{ scale: [0, 1.5, 1], boxShadow: "0 0 20px rgba(52,211,153,0.8)" }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 + 0.3 }}
                  className="absolute left-8 md:left-1/2 w-4 h-4 rounded-full bg-emerald-400 border-4 border-slate-950 transform -translate-x-1/2 mt-1.5 z-10"
                ></motion.div>

                {/* Content */}
                <div className={`ml-16 md:ml-0 md:w-1/2 ${index % 2 === 0 ? 'md:pl-12' : 'md:pr-12'}`}>
                  <motion.div 
                    whileHover={{ scale: 1.05, rotateX: 5, rotateY: index % 2 === 0 ? -5 : 5, boxShadow: "0 30px 60px -15px rgba(52,211,153,0.4)" }}
                    className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 hover:border-emerald-500/30 transition-colors relative overflow-hidden group"
                  >
                    <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(16,185,129,0.05)_50%,transparent_50%)] bg-[length:100%_4px] opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="flex items-center justify-between mb-4 relative z-10">
                      {exp.logo ? (
                        <img src={exp.logo} alt={exp.organization} className="w-12 h-12 rounded-lg object-contain bg-white/5 p-1" referrerPolicy="no-referrer" />
                      ) : (
                        <div className="w-12 h-12 rounded-lg bg-slate-800 flex items-center justify-center">
                          <Briefcase className="w-6 h-6 text-emerald-400" />
                        </div>
                      )}
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        {exp.start_date} - {exp.end_date || 'Present'}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-slate-100">{exp.title}</h3>
                    <div className="flex flex-col sm:flex-row sm:items-center text-slate-400 text-sm mt-1 mb-4 space-y-1 sm:space-y-0 sm:space-x-4">
                      <span className="font-medium text-emerald-400/80">{exp.organization}</span>
                    </div>

                    <p className="text-slate-300 text-sm leading-relaxed mb-4">
                      {exp.description}
                    </p>

                    {exp.technologies && exp.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {exp.technologies.map((tech: string, i: number) => (
                          <motion.span 
                            key={i} 
                            whileHover={{ scale: 1.1, backgroundColor: "rgba(52,211,153,0.2)", color: "rgb(52,211,153)" }}
                            className="px-2 py-1 text-xs font-mono text-slate-400 bg-slate-800 rounded-md cursor-default transition-colors"
                          >
                            {tech}
                          </motion.span>
                        ))}
                      </div>
                    )}
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </AnimatedLayout>
  );
}
