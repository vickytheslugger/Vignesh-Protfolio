import React from 'react';

interface AnimatedLayoutProps {
  children: React.ReactNode;
}

export function AnimatedLayout({ children }: AnimatedLayoutProps) {
  return (
    <div className="relative overflow-hidden min-h-screen">
      {/* Cyber Background Grid — pure CSS, zero JS cost */}
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(to_right,#10b98115_1px,transparent_1px),linear-gradient(to_bottom,#10b98115_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>

      {/* Glow — pure CSS */}
      <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[500px] w-[500px] rounded-full bg-emerald-400 opacity-10 blur-[150px]"></div>

      <div className="relative z-10 w-full h-full">
        {children}
      </div>
    </div>
  );
}
