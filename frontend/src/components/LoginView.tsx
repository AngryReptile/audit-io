import { useState } from 'react';
import { motion } from 'framer-motion';
import { GoogleLogin } from '@react-oauth/google';
import { Zap, Play, Loader2 } from 'lucide-react';

export default function LoginView({ onLogin, onDemoLogin, theme }: { onLogin: any, onDemoLogin: () => Promise<void>, theme: 'light' | 'dark' }) {
  const [demoLoading, setDemoLoading] = useState(false);

  const handleDemo = async () => {
    setDemoLoading(true);
    try {
      await onDemoLogin();
    } finally {
      setDemoLoading(false);
    }
  };

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-[var(--bg-page)] relative overflow-hidden transition-colors duration-500">
      {/* Premium Background System */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-mesh-gradient opacity-80" />
        <div className="absolute inset-0 bg-noise opacity-100" />
        
        {/* Dynamic Animated Blobs */}
        <div className="absolute top-[10%] left-[10%] w-[50%] h-[50%] bg-emerald-500/10 blur-[120px] rounded-full animate-float" />
        <div className="absolute bottom-[10%] right-[10%] w-[45%] h-[45%] bg-amber-500/10 blur-[120px] rounded-full animate-float-delayed" />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
        className="max-w-md w-full p-12 glass-card rounded-[3rem] text-center shadow-2xl relative z-10"
      >
        <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-amber-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-emerald-500/30 mx-auto mb-10 ring-1 ring-white/20">
          <Zap className="text-white fill-white" size={36} />
        </div>
        <h2 className="text-5xl font-black text-[var(--text-title)] mb-4 tracking-tighter">Audit.ai</h2>
        <p className="text-[var(--text-main)] font-medium mb-12 text-lg leading-relaxed">The world's first frontier-class security auditing platform.</p>
        
        <div className="space-y-6">
          <div className="flex justify-center flex-col items-center gap-6">
            <GoogleLogin 
              onSuccess={onLogin} 
              onError={() => alert('Login failed')} 
              theme={theme === 'dark' ? "filled_black" : "outline"}
              shape="pill"
              size="large"
            />
          </div>

          {/* Divider */}
          <div className="flex items-center gap-4 px-4">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            <span className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-600">or</span>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          </div>

          {/* Demo Mode Button */}
          <motion.button
            onClick={handleDemo}
            disabled={demoLoading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full relative group overflow-hidden px-8 py-4 rounded-2xl font-black text-[12px] uppercase tracking-[0.2em] transition-all duration-300 border border-emerald-500/20 bg-emerald-500/[0.06] text-emerald-400 hover:bg-emerald-500/[0.12] hover:border-emerald-500/40 hover:shadow-lg hover:shadow-emerald-500/10 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
          >
            {/* Subtle animated glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/0 via-emerald-500/5 to-emerald-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <span className="relative z-10 flex items-center gap-3">
              {demoLoading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Play size={16} className="fill-emerald-400 group-hover:scale-110 transition-transform" />
              )}
              {demoLoading ? 'Launching Demo...' : 'Try Demo Mode'}
            </span>
          </motion.button>

          <p className="text-[10px] font-black uppercase tracking-widest text-[#71717a] mt-6 italic opacity-60">Secure access via Google OAuth 2.0</p>
        </div>
      </motion.div>
    </div>
  );
}
