import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { supabase } from '@/lib/supabase';
import { Award, ExternalLink, Calendar, Building2, FileDown } from 'lucide-react';
import { AnimatedLayout } from '@/components/AnimatedLayout';

export function Certifications() {
  const [certifications, setCertifications] = useState<any[]>([]);

  useEffect(() => {
    supabase.from('certifications').select('*').order('issue_date', { ascending: false }).then(({ data }) => {
      if (data) setCertifications(data);
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
            <span className="text-emerald-400">&gt;</span> Certifications & Licenses
          </h2>
          <div className="w-24 h-1 bg-emerald-500/20 mx-auto rounded-full"></div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 [perspective:1000px]">
          {certifications.map((cert, index) => (
            <motion.div
              key={cert.id}
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
              {/* Certificate Image / Badge / Document */}
              {cert.image_url ? (
                <div className="h-48 overflow-hidden bg-slate-800/50 flex items-center justify-center p-4">
                  <img
                    src={cert.image_url}
                    alt={cert.name}
                    className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                    loading="lazy"
                  />
                </div>
              ) : cert.document_url ? (
                <a
                  href={cert.document_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-48 bg-slate-800 flex flex-col items-center justify-center gap-4 hover:bg-slate-750 transition-all cursor-pointer relative overflow-hidden"
                >
                  {/* Animated glow ring */}
                  <motion.div
                    animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.6, 0.3] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute w-28 h-28 rounded-full border-2 border-emerald-400/30"
                  />
                  <motion.div
                    animate={{ scale: [1.1, 1, 1.1], opacity: [0.2, 0.5, 0.2] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                    className="absolute w-36 h-36 rounded-full border border-emerald-400/15"
                  />
                  {/* Certificate icon */}
                  <div className="relative z-10">
                    <motion.div
                      animate={{ rotate: [0, 5, -5, 0] }}
                      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <Award className="w-16 h-16 text-emerald-400/60 group-hover:text-emerald-400 transition-colors drop-shadow-[0_0_12px_rgba(52,211,153,0.3)]" />
                    </motion.div>
                  </div>
                  <span className="relative z-10 text-xs font-mono text-emerald-400/50 group-hover:text-emerald-400 transition-colors text-center px-4">
                    Click here to view certificate ↗
                  </span>
                </a>
              ) : (
                <div className="h-48 bg-slate-800 flex items-center justify-center">
                  <div className="relative">
                    <Award className="w-16 h-16 text-emerald-400/30" />
                    <motion.div
                      animate={{ opacity: [0.3, 0.8, 0.3] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="absolute inset-0 flex items-center justify-center"
                    >
                      <Award className="w-16 h-16 text-emerald-400/50" />
                    </motion.div>
                  </div>
                </div>
              )}

              <div className="p-6 flex-1 flex flex-col relative overflow-hidden">
                {/* CRT scanline overlay */}
                <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(16,185,129,0.03)_50%,transparent_50%)] bg-[length:100%_4px] opacity-0 group-hover:opacity-100 transition-opacity" />

                {/* Certificate Name */}
                <h3 className="text-xl font-bold text-slate-100 mb-2 group-hover:text-emerald-400 transition-colors">
                  {cert.name}
                </h3>

                {/* Issuing Organization */}
                <div className="flex items-center text-sm text-emerald-400/80 mb-2">
                  <Building2 className="w-4 h-4 mr-2 shrink-0" />
                  <span>{cert.issuing_organization}</span>
                </div>

                {/* Dates */}
                <div className="flex items-center text-sm text-slate-400 mb-3">
                  <Calendar className="w-4 h-4 mr-2 shrink-0" />
                  <span>
                    Issued: {cert.issue_date}
                    {cert.expiry_date && ` · Expires: ${cert.expiry_date}`}
                    {!cert.expiry_date && ' · No Expiration'}
                  </span>
                </div>

                {/* Credential ID */}
                {cert.credential_id && (
                  <p className="text-xs font-mono text-slate-500 mb-3">
                    ID: {cert.credential_id}
                  </p>
                )}

                {/* Description */}
                {cert.description && (
                  <p className="text-slate-400 text-sm mb-4 flex-1">
                    {cert.description}
                  </p>
                )}

                {/* Skills/Tags */}
                {cert.skills && cert.skills.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {cert.skills.map((skill: string, i: number) => (
                      <motion.span
                        key={i}
                        whileHover={{ scale: 1.1, backgroundColor: "rgba(52,211,153,0.2)", color: "rgb(52,211,153)" }}
                        className="px-2 py-1 text-xs font-mono text-emerald-400 bg-emerald-400/10 rounded-md border border-emerald-400/20 cursor-default transition-colors"
                      >
                        {skill}
                      </motion.span>
                    ))}
                  </div>
                )}

                {/* Links */}
                {(cert.credential_url || cert.document_url) && (
                  <div className="mt-auto pt-4 border-t border-slate-800 flex items-center gap-4 flex-wrap">
                    {cert.credential_url && (
                      <motion.a
                        whileHover={{ scale: 1.05, textShadow: "0px 0px 8px rgba(52,211,153,0.8)" }}
                        whileTap={{ scale: 0.95 }}
                        href={cert.credential_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Verify credential for ${cert.name}`}
                        className="text-slate-400 hover:text-emerald-400 transition-colors flex items-center text-sm"
                      >
                        <ExternalLink className="w-4 h-4 mr-2" /> Verify Credential
                      </motion.a>
                    )}
                    {cert.document_url && (
                      <motion.a
                        whileHover={{ scale: 1.05, textShadow: "0px 0px 8px rgba(6,182,212,0.8)" }}
                        whileTap={{ scale: 0.95 }}
                        href={cert.document_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`View document for ${cert.name}`}
                        className="text-slate-400 hover:text-cyan-400 transition-colors flex items-center text-sm"
                      >
                        <FileDown className="w-4 h-4 mr-2" /> View Document
                      </motion.a>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {certifications.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-slate-500 py-16"
          >
            <Award className="w-16 h-16 mx-auto mb-4 text-slate-700" />
            <p className="font-mono">No certifications to display yet.</p>
          </motion.div>
        )}
      </div>
    </AnimatedLayout>
  );
}
