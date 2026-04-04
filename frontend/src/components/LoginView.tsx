import { motion } from 'framer-motion';
import { GoogleLogin } from '@react-oauth/google';
import { Zap } from 'lucide-react';

export default function LoginView({ onLogin, theme }: { onLogin: any, theme: 'light' | 'dark' }) {
  return (
    <div className="h-screen w-screen flex items-center justify-center bg-[var(--bg-page)] relative overflow-hidden transition-colors duration-500">
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-[10%] left-[10%] w-[40%] h-[40%] bg-indigo-500/10 blur-[150px] rounded-full animate-float opacity-50" />
        <div className="absolute bottom-[10%] right-[10%] w-[35%] h-[35%] bg-blue-500/10 blur-[150px] rounded-full animate-float-delayed opacity-50" />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
        className="max-w-md w-full p-12 glass-card rounded-[3rem] text-center shadow-2xl relative z-10"
      >
        <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-indigo-500/30 mx-auto mb-10 ring-1 ring-white/20">
          <Zap className="text-white fill-white" size={36} />
        </div>
        <h2 className="text-5xl font-black text-[var(--text-title)] mb-4 tracking-tighter">Audit.ai</h2>
        <p className="text-[var(--text-main)] font-medium mb-12 text-lg leading-relaxed">The world's first frontier-class security auditing platform.</p>
        
        <div className="space-y-6">
          <div className="flex justify-center flex-col items-center">
            <GoogleLogin 
              onSuccess={onLogin} 
              onError={() => alert('Login failed')} 
              theme={theme === 'dark' ? "filled_black" : "outline"}
              shape="pill"
              size="large"
            />
          </div>
          <p className="text-[10px] font-black uppercase tracking-widest text-[#71717a] mt-6 italic">Sign in to start your scan</p>
        </div>
      </motion.div>
    </div>
  );
}
