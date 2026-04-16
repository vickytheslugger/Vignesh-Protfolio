import { Link, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import { Shield, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

export function Navbar() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const links = [
    { name: 'Home', path: '#home' },
    { name: 'About', path: '#about' },
    { name: 'Projects', path: '#projects' },
    { name: 'Skills & Tools', path: '#skills' },
    { name: 'Experience', path: '#experience' },
    { name: 'Certifications', path: '#certifications' },
    { name: 'Contact', path: '#contact' },
  ];

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id.replace('#', ''));
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsOpen(false);
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-slate-950/95 backdrop-blur-xl border-b border-emerald-500/40 shadow-[0_0_40px_rgba(16,185,129,0.3)]">
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.3)_50%)] bg-[length:100%_8px]" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex items-center justify-between h-16">
          <button onClick={() => scrollToSection('#home')} aria-label="Go to Home" className="flex items-center space-x-2 group">
            <Shield className="w-8 h-8 text-emerald-400 group-hover:text-emerald-300 transition-colors" />
            <span className="font-mono font-bold text-xl text-slate-100 tracking-tight">
              VIGNESH<span className="text-emerald-400">.S</span>
            </span>
          </button>

          {/* Desktop Menu */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {links.map((link) => (
                <button 
                  key={link.name} 
                  onClick={() => scrollToSection(link.path)}
                  aria-label={`Go to ${link.name}`}
                  className="relative px-3 py-2 text-sm font-medium font-mono transition-colors hover:text-emerald-400 text-slate-300"
                >
                  <motion.div
                    whileHover={{ scale: 1.1, textShadow: "0px 0px 8px rgba(52,211,153,0.8)" }}
                    whileTap={{ scale: 0.9 }}
                  >
                    {link.name}
                  </motion.div>
                </button>
              ))}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              aria-label={isOpen ? "Close menu" : "Open menu"}
              className="text-slate-300 hover:text-emerald-400 p-2"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="md:hidden bg-slate-900 border-b border-emerald-500/20"
        >
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {links.map((link) => (
              <button
                key={link.name}
                onClick={() => scrollToSection(link.path)}
                aria-label={`Go to ${link.name}`}
                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium font-mono text-slate-300 hover:bg-slate-800 hover:text-emerald-400"
              >
                {link.name}
              </button>
            ))}
          </div>
        </motion.div>
      )}
    </nav>
  );
}
