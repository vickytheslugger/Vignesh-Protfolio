import React, { useEffect, useState, useMemo } from 'react';
import { motion } from 'motion/react';

const CODE_SNIPPETS = [
  'const database = connect("mongodb://localhost:27017/portfolio");',
  'app.get("/api/projects", async (req, res) => {',
  '  const projects = await Project.find().sort({ order: 1 });',
  '  res.json(projects);',
  '});',
  'import { motion } from "framer-motion";',
  'export function Hero() {',
  '  return <motion.div animate={{ opacity: 1 }}>...</motion.div>;',
  '}',
  'git commit -m "feat: add 3d terminal background"',
  'npm install lucide-react framer-motion tailwindcss',
  'docker build -t portfolio-v3 .',
  'kubectl apply -f deployment.yaml',
  'ssh root@192.168.1.105',
  'cat /etc/nginx/nginx.conf',
  'systemctl restart portfolio-service',
  'grep -r "emerald-400" src/',
  'find . -name "*.tsx" | xargs wc -l',
  'curl -X POST https://api.vignesh.dev/contact',
  'openssl genrsa -out private.key 2048',
  'chmod 600 ~/.ssh/id_rsa',
  '01010110 01101001 01100111 01101110 01100101 01110011 01101000',
  '11001010 10101100 11110000 00001111',
  '00000000 11111111 10101010 01010101',
  '10110110 01101101 11011011 00110110',
];

export function TerminalBackground() {
  const [lines, setLines] = useState<{ id: number; text: string; x: number; y: number; opacity: number; isBinary: boolean }[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setLines((prev) => {
        const isBinary = Math.random() > 0.7;
        const newLine = {
          id: Date.now(),
          text: isBinary 
            ? Array.from({ length: 20 }, () => Math.round(Math.random())).join('') 
            : CODE_SNIPPETS[Math.floor(Math.random() * CODE_SNIPPETS.length)],
          x: Math.random() * 95, // percentage
          y: 110, // start below screen
          opacity: Math.random() * 0.4 + 0.1,
          isBinary
        };
        return [...prev.slice(-60), newLine];
      });
    }, 400);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 opacity-70 select-none">
      {/* Scanlines Effect */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.4)_50%),linear-gradient(90deg,rgba(255,0,0,0.1),rgba(0,255,0,0.06),rgba(0,0,255,0.1))] bg-[length:100%_4px,5px_100%]" />
      
      <div className="absolute inset-0 font-mono text-[12px] sm:text-[14px] text-emerald-400/70">
        {lines.map((line) => (
          <motion.div
            key={line.id}
            initial={{ y: '110vh', opacity: 0 }}
            animate={{ 
              y: '-20vh', 
              opacity: line.opacity,
              x: line.isBinary ? 0 : [0, 2, -2, 0],
            }}
            transition={{ 
              y: { duration: line.isBinary ? 15 : 25, ease: 'linear' },
              x: { duration: 0.2, repeat: Infinity, repeatType: 'reverse', repeatDelay: Math.random() * 5 }
            }}
            className={`absolute whitespace-nowrap ${line.isBinary ? 'writing-mode-vertical text-emerald-400/80' : ''}`}
            style={{ left: `${line.x}%` }}
          >
            {line.text}
          </motion.div>
        ))}
      </div>

      {/* Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(2,6,23,0.9)_100%)]" />
    </div>
  );
}
