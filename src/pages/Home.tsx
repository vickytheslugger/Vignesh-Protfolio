import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Terminal, ChevronRight, ShieldAlert, FileText } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { AnimatedLayout } from '@/components/AnimatedLayout';

export function Home() {
  const [content, setContent] = useState<any>(null);
  const [resumeUrl, setResumeUrl] = useState('/resume.pdf');
  const [text, setText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    supabase.from('content').select('*').in('section', ['hero', 'resume']).then(({ data, error }) => {
      const heroData = data?.find(d => d.section === 'hero');
      const resumeData = data?.find(d => d.section === 'resume');

      if (heroData?.data) {
        setContent(heroData.data);
      } else {
        setContent({
          headline: "Hi I am Vignesh",
          subheadline: "Cybersecurity and AI Student",
          intro: "I build secure, intelligent systems and explore the intersection of artificial intelligence and cybersecurity. Welcome to my digital workspace."
        });
      }

      if (resumeData?.data?.url) {
        setResumeUrl(resumeData.data.url);
      }

      setIsLoading(false);
    });
  }, []);

  useEffect(() => {
    if (content?.headline) {
      let i = 0;
      const timer = setInterval(() => {
        setText(content.headline.slice(0, i));
        i++;
        if (i > content.headline.length) {
          clearInterval(timer);
          setIsTyping(false);
        }
      }, 100);
      return () => clearInterval(timer);
    }
  }, [content?.headline]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!content) return null;

  return (
    <AnimatedLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center [perspective:1200px]">
          <motion.div
            initial={{ opacity: 0, x: -100, z: -200 }}
            animate={{ opacity: 1, x: 0, z: 0 }}
            transition={{ duration: 1, type: "spring", bounce: 0.3 }}
            className="[transform-style:preserve-3d]"
          >
            <div className="inline-flex items-center space-x-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-4 py-1.5 mb-6 [transform:translateZ(30px)]">
              <Terminal className="w-4 h-4 text-emerald-400" />
              <span className="text-sm font-mono text-emerald-400">System Online</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-slate-100 mb-4 tracking-tight group cursor-default [transform:translateZ(50px)]">
              <span className="block min-h-[1.2em] relative">
                <motion.span
                  whileHover={{
                    x: [0, -2, 2, -1, 1, 0],
                    transition: { duration: 0.2, repeat: Infinity }
                  }}
                  className="relative z-10"
                >
                  {text}
                </motion.span>
                <span className={`inline-block w-3 h-[0.8em] bg-emerald-400 ml-1 ${isTyping ? 'animate-pulse' : 'animate-pulse'}`}></span>
              </span>
            </h1>
            
            <h2 className="text-2xl md:text-3xl font-mono text-slate-400 mb-6 [transform:translateZ(40px)]">
              {content.subheadline}
            </h2>
            
            <p className="text-lg text-slate-500 mb-8 max-w-xl [transform:translateZ(30px)]">
              {content.intro}
            </p>

            <div className="flex flex-wrap gap-4 [transform:translateZ(60px)]">
              <motion.button
                onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
                aria-label="View Projects"
                whileHover={{ 
                  scale: 1.1, 
                  rotateX: -15,
                  rotateY: 15,
                  boxShadow: "0 0 30px rgba(52,211,153,0.9)" 
                }}
                whileTap={{ scale: 0.95, translateZ: -20 }}
                className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-slate-950 bg-emerald-400 transition-all [transform-style:preserve-3d]"
              >
                <span className="[transform:translateZ(20px)] flex items-center">
                  View Projects
                  <ChevronRight className="ml-2 w-5 h-5" />
                </span>
              </motion.button>
              <motion.button
                onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                aria-label="Contact Me"
                whileHover={{ 
                  scale: 1.1, 
                  rotateX: 15,
                  rotateY: -15,
                  boxShadow: "0 0 30px rgba(52,211,153,0.5)" 
                }}
                whileTap={{ scale: 0.95, translateZ: -20 }}
                className="inline-flex items-center justify-center px-6 py-3 border border-emerald-500/30 text-base font-medium rounded-md text-emerald-400 bg-emerald-500/10 transition-all [transform-style:preserve-3d]"
              >
                <span className="[transform:translateZ(20px)]">
                  Contact Me
                </span>
              </motion.button>
              <a href={resumeUrl} target="_blank" rel="noopener noreferrer" aria-label="View Resume">
                <motion.button
                  whileHover={{ 
                    scale: 1.1, 
                    rotateX: -15,
                    rotateY: -15,
                    boxShadow: "0 0 30px rgba(52,211,153,0.5)" 
                  }}
                  whileTap={{ scale: 0.95, translateZ: -20 }}
                  className="inline-flex items-center justify-center px-6 py-3 border border-emerald-500/30 text-base font-medium rounded-md text-emerald-400 bg-slate-900/50 hover:bg-emerald-500/10 transition-all [transform-style:preserve-3d]"
                >
                  <span className="[transform:translateZ(20px)] flex items-center">
                    <FileText className="mr-2 w-5 h-5" />
                    Resume
                  </span>
                </motion.button>
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.5, rotateX: 60, z: -500 }}
            animate={{ opacity: 1, scale: 1, rotateX: 0, z: 0 }}
            transition={{ duration: 1.2, delay: 0.3, type: "spring", bounce: 0.4 }}
            className="hidden lg:flex justify-center [transform-style:preserve-3d]"
          >
            <div className="relative w-96 h-96 [transform-style:preserve-3d]">
              {/* Complex Orbital Rings */}
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={{ 
                    rotateZ: i % 2 === 0 ? 360 : -360,
                    rotateX: [0, 45, 0],
                    rotateY: [0, 45, 0]
                  }}
                  transition={{ 
                    rotateZ: { duration: 10 + i * 5, repeat: Infinity, ease: "linear" },
                    rotateX: { duration: 8, repeat: Infinity, ease: "easeInOut" },
                    rotateY: { duration: 12, repeat: Infinity, ease: "easeInOut" }
                  }}
                  className="absolute inset-0 border border-emerald-500/20 rounded-full"
                  style={{ 
                    padding: i * 20,
                    transform: `translateZ(${i * 40}px)`
                  }}
                />
              ))}
              
              {/* Central Core */}
              <motion.div 
                animate={{ 
                  scale: [1, 1.1, 1],
                  boxShadow: [
                    "0 0 20px rgba(52,211,153,0.3)",
                    "0 0 50px rgba(52,211,153,0.6)",
                    "0 0 20px rgba(52,211,153,0.3)"
                  ]
                }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-0 flex items-center justify-center [transform:translateZ(100px)]"
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-emerald-400/20 blur-2xl rounded-full animate-pulse"></div>
                  <ShieldAlert className="w-40 h-40 text-emerald-400 drop-shadow-[0_0_20px_rgba(52,211,153,1)]" />
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </AnimatedLayout>
  );
}
