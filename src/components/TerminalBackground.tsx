import React, { useMemo } from 'react';

const CODE_SNIPPETS = [
  'const database = connect("mongodb://localhost:27017/portfolio");',
  'app.get("/api/projects", async (req, res) => {',
  '  const projects = await Project.find().sort({ order: 1 });',
  'git commit -m "feat: add 3d terminal background"',
  'npm install lucide-react framer-motion tailwindcss',
  'docker build -t portfolio-v3 .',
  'kubectl apply -f deployment.yaml',
  'ssh root@192.168.1.105',
  'systemctl restart portfolio-service',
  'curl -X POST https://api.vignesh.dev/contact',
  'openssl genrsa -out private.key 2048',
  'chmod 600 ~/.ssh/id_rsa',
];

const BINARY_STRINGS = [
  '01010110 01101001 01100111 01101110 01100101 01110011 01101000',
  '11001010 10101100 11110000 00001111',
  '00000000 11111111 10101010 01010101',
  '10110110 01101101 11011011 00110110',
];

// Pre-generate lines at module level (not on every render)
function generateLines() {
  const lines: { text: string; x: number; delay: number; duration: number; opacity: number; isBinary: boolean }[] = [];
  for (let i = 0; i < 15; i++) {
    const isBinary = i % 4 === 0;
    lines.push({
      text: isBinary
        ? BINARY_STRINGS[i % BINARY_STRINGS.length]
        : CODE_SNIPPETS[i % CODE_SNIPPETS.length],
      x: (i * 7 + 3) % 95,
      delay: i * 2.5,
      duration: isBinary ? 18 : 28,
      opacity: 0.3 + (i % 3) * 0.15,
      isBinary,
    });
  }
  return lines;
}

const STATIC_LINES = generateLines();

export function TerminalBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 opacity-70 select-none">
      {/* Scanlines — pure CSS, no perf cost */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.04),rgba(0,0,255,0.06))] bg-[length:100%_4px,5px_100%]" />

      <div className="absolute inset-0 font-mono text-[11px] sm:text-[13px] text-emerald-400/80">
        {STATIC_LINES.map((line, i) => (
          <div
            key={i}
            className="absolute whitespace-nowrap terminal-line-float"
            style={{
              left: `${line.x}%`,
              opacity: line.opacity,
              animationDuration: `${line.duration}s`,
              animationDelay: `${line.delay}s`,
            }}
          >
            {line.text}
          </div>
        ))}
      </div>

      {/* Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(2,6,23,0.9)_100%)]" />
    </div>
  );
}
