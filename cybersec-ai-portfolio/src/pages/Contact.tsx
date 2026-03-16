import { motion } from 'motion/react';
import { Instagram, Github, Linkedin, Send } from 'lucide-react';
import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { AnimatedLayout } from '@/components/AnimatedLayout';

export function Contact() {
  const [formState, setFormState] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    const { error: submitError } = await supabase.from('messages').insert([formState]);
    
    setIsSubmitting(false);
    if (!submitError) {
      setSubmitted(true);
      setFormState({ name: '', email: '', message: '' });
    } else {
      setError('Failed to send message. Please try again later.');
      setTimeout(() => setError(null), 5000);
    }
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
            <span className="text-emerald-400">&gt;</span> Contact
          </h2>
          <div className="w-24 h-1 bg-emerald-500/20 mx-auto rounded-full"></div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h3 className="text-2xl font-bold text-slate-100 mb-6">Get In Touch</h3>
            <p className="text-slate-400 mb-8 leading-relaxed">
              I'm currently open for new opportunities. Whether you have a question or just want to say hi, I'll try my best to get back to you!
            </p>

            <div className="flex gap-6 mt-8 relative z-50">
              <motion.a 
                href="https://www.instagram.com/_silent._.slugger_/" 
                target="_blank" 
                rel="noopener noreferrer" 
                aria-label="Instagram"
                initial="initial"
                whileHover="hover"
                whileTap="tap"
                variants={{
                  initial: { y: 0, scale: 1, boxShadow: "0px 6px 0px rgba(30, 41, 59, 1)" },
                  hover: { 
                    y: -8, 
                    scale: 1.1, 
                    boxShadow: "0px 12px 0px rgba(16, 185, 129, 0.4)",
                    transition: { type: "spring", stiffness: 400, damping: 10 } 
                  },
                  tap: { 
                    y: 4, 
                    scale: 0.9, 
                    boxShadow: "0px 2px 0px rgba(16, 185, 129, 0.6)",
                    transition: { type: "spring", stiffness: 500, damping: 30 }
                  }
                }}
                className="p-4 bg-slate-900 border border-slate-800 rounded-2xl text-slate-300 hover:text-emerald-400 transition-colors"
              >
                <Instagram className="w-8 h-8" />
              </motion.a>
              <motion.a 
                href="https://github.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                aria-label="GitHub"
                initial="initial"
                whileHover="hover"
                whileTap="tap"
                variants={{
                  initial: { y: 0, scale: 1, boxShadow: "0px 6px 0px rgba(30, 41, 59, 1)" },
                  hover: { 
                    y: -8, 
                    scale: 1.1, 
                    boxShadow: "0px 12px 0px rgba(16, 185, 129, 0.4)",
                    transition: { type: "spring", stiffness: 400, damping: 10 } 
                  },
                  tap: { 
                    y: 4, 
                    scale: 0.9, 
                    boxShadow: "0px 2px 0px rgba(16, 185, 129, 0.6)",
                    transition: { type: "spring", stiffness: 500, damping: 30 }
                  }
                }}
                className="p-4 bg-slate-900 border border-slate-800 rounded-2xl text-slate-300 hover:text-emerald-400 transition-colors"
              >
                <Github className="w-8 h-8" />
              </motion.a>
              <motion.a 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                aria-label="LinkedIn"
                initial="initial"
                whileHover="hover"
                whileTap="tap"
                variants={{
                  initial: { y: 0, scale: 1, boxShadow: "0px 6px 0px rgba(30, 41, 59, 1)" },
                  hover: { 
                    y: -8, 
                    scale: 1.1, 
                    boxShadow: "0px 12px 0px rgba(16, 185, 129, 0.4)",
                    transition: { type: "spring", stiffness: 400, damping: 10 } 
                  },
                  tap: { 
                    y: 4, 
                    scale: 0.9, 
                    boxShadow: "0px 2px 0px rgba(16, 185, 129, 0.6)",
                    transition: { type: "spring", stiffness: 500, damping: 30 }
                  }
                }}
                className="p-4 bg-slate-900 border border-slate-800 rounded-2xl text-slate-300 hover:text-emerald-400 transition-colors"
              >
                <Linkedin className="w-8 h-8" />
              </motion.a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-slate-900/50 border border-slate-800 rounded-2xl p-8 relative overflow-hidden group"
          >
            <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(16,185,129,0.05)_50%,transparent_50%)] bg-[length:100%_4px] opacity-0 group-hover:opacity-100 transition-opacity" />
            {submitted ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mb-4">
                  <Send className="w-8 h-8 text-emerald-400" />
                </div>
                <h4 className="text-xl font-bold text-slate-100">Message Sent!</h4>
                <p className="text-slate-400">Thanks for reaching out. I'll get back to you soon.</p>
                <button 
                  onClick={() => setSubmitted(false)}
                  className="mt-4 text-emerald-400 hover:text-emerald-300 font-mono text-sm"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm text-center">
                    {error}
                  </div>
                )}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-slate-400 mb-2">Name</label>
                  <input
                    type="text"
                    id="name"
                    required
                    value={formState.name}
                    onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-slate-100 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-colors"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-slate-400 mb-2">Email</label>
                  <input
                    type="email"
                    id="email"
                    required
                    value={formState.email}
                    onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-slate-100 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-colors"
                    placeholder="john@example.com"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-slate-400 mb-2">Message</label>
                  <textarea
                    id="message"
                    required
                    rows={4}
                    value={formState.message}
                    onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-slate-100 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-colors resize-none"
                    placeholder="Your message here..."
                  ></textarea>
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-emerald-400 hover:bg-emerald-500 text-slate-950 font-bold py-3 px-4 rounded-lg transition-colors flex items-center justify-center disabled:opacity-70"
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                  {!isSubmitting && <Send className="w-4 h-4 ml-2" />}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </AnimatedLayout>
  );
}
