import { motion } from 'framer-motion';
import { GoogleLogin } from '@react-oauth/google';
import { Zap } from 'lucide-react';

export default function LoginView({ onLogin, theme }: { onLogin: any, theme: 'light' | 'dark' }) {
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
          <p className="text-[10px] font-black uppercase tracking-widest text-[#71717a] mt-6 italic opacity-60">Secure access via Google OAuth 2.0</p>
        </div>
      </motion.div>
    </div>
  );
}
