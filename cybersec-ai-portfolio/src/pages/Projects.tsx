import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { supabase } from '@/lib/supabase';
import { Github, ExternalLink, FolderGit2 } from 'lucide-react';
import { AnimatedLayout } from '@/components/AnimatedLayout';

export function Projects() {
  const [projects, setProjects] = useState<any[]>([]);

  useEffect(() => {
    supabase.from('projects').select('*').order('order', { ascending: true }).then(({ data }) => {
      if (data) setProjects(data);
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
            <span className="text-emerald-400">&gt;</span> Projects
          </h2>
          <div className="w-24 h-1 bg-emerald-500/20 mx-auto rounded-full"></div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 [perspective:1000px]">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 50, rotateX: 30 }}
              whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: index * 0.1, type: "spring", stiffness: 100 }}
              whileHover={{ 
                y: -10, 
                rotateX: 5, 
                rotateY: -5, 
                boxShadow: "0 20px 40px -10px rgba(52,211,153,0.4)" 
              }}
              className="bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden group hover:border-emerald-500/50 transition-all duration-300 flex flex-col [transform-style:preserve-3d]"
            >
              {project.image ? (
                <div className="h-48 overflow-hidden">
                  <img 
                    src={project.image} 
                    alt={project.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                    loading="lazy"
                  />
                </div>
              ) : (
                <div className="h-48 bg-slate-800 flex items-center justify-center">
                  <FolderGit2 className="w-16 h-16 text-slate-600" />
                </div>
              )}
              
              <div className="p-6 flex-1 flex flex-col relative overflow-hidden">
                <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(16,185,129,0.03)_50%,transparent_50%)] bg-[length:100%_4px] opacity-0 group-hover:opacity-100 transition-opacity" />
                <h3 className="text-xl font-bold text-slate-100 mb-2 group-hover:text-emerald-400 transition-colors">
                  {project.title}
                </h3>
                <p className="text-slate-400 text-sm mb-4 flex-1">
                  {project.description}
                </p>
                
                <div className="flex flex-wrap gap-2 mb-6">
                  {project.technologies?.map((tech: string, i: number) => (
                    <span key={i} className="px-2 py-1 text-xs font-mono text-emerald-400 bg-emerald-400/10 rounded-md border border-emerald-400/20">
                      {tech}
                    </span>
                  ))}
                </div>
                
                <div className="flex items-center space-x-4 mt-auto pt-4 border-t border-slate-800">
                  {project.github_url && (
                    <motion.a 
                      whileHover={{ scale: 1.1, textShadow: "0px 0px 8px rgba(52,211,153,0.8)" }}
                      whileTap={{ scale: 0.9 }}
                      href={project.github_url} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      aria-label={`View source code for ${project.title}`}
                      className="text-slate-400 hover:text-emerald-400 transition-colors flex items-center text-sm"
                    >
                      <Github className="w-4 h-4 mr-1" /> Code
                    </motion.a>
                  )}
                  {project.live_url && (
                    <motion.a 
                      whileHover={{ scale: 1.1, textShadow: "0px 0px 8px rgba(52,211,153,0.8)" }}
                      whileTap={{ scale: 0.9 }}
                      href={project.live_url} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      aria-label={`View live demo for ${project.title}`}
                      className="text-slate-400 hover:text-emerald-400 transition-colors flex items-center text-sm"
                    >
                      <ExternalLink className="w-4 h-4 mr-1" /> Live Demo
                    </motion.a>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </AnimatedLayout>
  );
}
