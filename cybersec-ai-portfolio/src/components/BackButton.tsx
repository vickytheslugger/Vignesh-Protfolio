import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft } from 'lucide-react';

export function BackButton() {
  const navigate = useNavigate();

  return (
    <motion.button
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      whileHover={{ x: -5 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => navigate(-1)}
      className="flex items-center text-slate-400 mb-8 group transition-colors"
    >
      <div className="p-2 bg-slate-900 border border-slate-800 rounded-lg group-hover:border-emerald-500/50 group-hover:text-emerald-400 transition-colors">
        <ArrowLeft className="w-5 h-5" />
      </div>
    </motion.button>
  );
}
