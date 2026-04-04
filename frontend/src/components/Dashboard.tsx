import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { LayoutGrid, Sparkles, Zap, History, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { DashboardSkeleton } from './Skeletons';

export default function Dashboard({ user, theme: _theme }: { user: any, theme: 'light' | 'dark' }) {
  const [stats, setStats] = useState({
    totalReviews: 0,
    avgScore: 0,
    totalBugs: 0,
    totalDocs: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await axios.get(`/api/stats/${user.id}`);
        setStats(data);
      } catch (err) {
        console.error('Failed to fetch stats');
      }
      setLoading(false);
    };
    fetchStats();
  }, [user.id]);

  if (loading) return <DashboardSkeleton />;

  return (
    <div className="w-full mx-auto space-y-12 md:space-y-16 pb-20">
      <header className="flex justify-between items-end relative py-2">
        <div className="z-10">
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 text-indigo-500 font-bold tracking-widest text-[9px] md:text-[10px] uppercase mb-4"
          >
            <Sparkles size={14} className="animate-pulse" /> System Intel active
          </motion.div>
          <h1 className="text-4xl md:text-6xl font-black text-[var(--text-title)] tracking-tighter mb-5 select-none leading-[0.9]">Welcome back, <br className="md:hidden"/>{user.name.split(' ')[0]}.</h1>
          <p className="text-[var(--text-main)] font-medium text-base md:text-lg max-w-xl leading-relaxed opacity-80">Your security posture is currently optimized. Explore recent audits or initiate a new deep-scan below.</p>
        </div>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
        <StatCard label="Analyses" value={stats.totalReviews.toString()} icon={LayoutGrid} color="indigo" />
        <StatCard label="Avg Score" value={stats.avgScore.toString()} icon={Sparkles} color="emerald" />
        <StatCard label="Vulns Caught" value={stats.totalBugs.toString()} icon={Zap} color="rose" />
        <StatCard label="Docs Built" value={stats.totalDocs.toString()} icon={History} color="blue" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative group mt-8"
      >
        <div className="glass-card rounded-[2.5rem] md:rounded-[3.5rem] p-8 md:p-16 overflow-hidden relative shadow-2xl transition-all duration-700 hover:shadow-indigo-500/5 group/card">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/[0.03] blur-[120px] rounded-full translate-x-1/2 -translate-y-1/2 group-hover/card:bg-indigo-500/[0.07] transition-colors duration-1000" />
          
          <div className="grid lg:grid-cols-2 gap-12 md:gap-20 items-center relative z-10">
            <div className="space-y-6 md:space-y-10">
              <h2 className="text-4xl md:text-5xl font-black text-[var(--text-title)] leading-[1.1] tracking-tight">Initiate <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-violet-600">Deep Intelligence</span></h2>
              <p className="text-[var(--text-main)] font-medium text-lg md:text-xl leading-relaxed max-w-lg opacity-90">Seamlessly audit public repositories or individual code blocks using Google's frontier AI models.</p>
              <div className="flex flex-col sm:flex-row gap-4 md:gap-6 pt-2">
                 <Link to="/repo" className="btn-primary py-5 md:py-6 px-8 rounded-2xl font-black text-[15px] flex items-center justify-center gap-3">
                   Fetch Repo <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                 </Link>
                 <Link to="/manual" className="py-5 md:py-6 px-8 bg-white/[0.04] hover:bg-white/[0.08] text-[var(--text-title)] border border-white/[0.05] rounded-2xl font-black text-[15px] transition-all active:scale-95 flex items-center justify-center shadow-lg hover:shadow-xl">
                   Manual Audit
                 </Link>
              </div>
            </div>
            
            <div className="hidden lg:flex justify-center select-none pointer-events-none">
              <div className="relative w-72 h-72 flex items-center justify-center">
                <div className="absolute inset-0 bg-indigo-500/10 blur-[80px] rounded-full animate-pulse-subtle" />
                <div className="absolute inset-0 bg-purple-500/10 blur-[100px] rounded-full mix-blend-screen" />
                <Zap size={140} className="text-indigo-500 relative z-10 animate-float opacity-80" />
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function StatCard({ label, value, icon: Icon, color }: { label: string, value: string, icon: any, color: 'indigo'|'emerald'|'rose'|'blue' }) {
  const colors = {
    indigo: 'text-indigo-400 border-indigo-500/10 hover:border-indigo-500/30',
    emerald: 'text-emerald-400 border-emerald-500/10 hover:border-emerald-500/30',
    rose: 'text-rose-400 border-rose-500/10 hover:border-rose-500/30',
    blue: 'text-blue-400 border-blue-500/10 hover:border-blue-500/30'
  };

  return (
    <motion.div 
      whileHover={{ y: -6, scale: 1.01 }}
      className={`bg-[var(--glass-bg)] border rounded-[2.2rem] md:rounded-[2.8rem] p-6 md:p-10 transition-all shadow-2xl relative overflow-hidden group ${colors[color]}`}
    >
      <div className="absolute top-[-20px] right-[-20px] opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
        <Icon size={120} />
      </div>
      <div className={`w-12 h-12 md:w-14 md:h-14 bg-white/[0.03] rounded-2xl flex items-center justify-center mb-6 md:mb-8 relative z-10 ring-1 ring-white/10 group-hover:rotate-6 transition-transform shadow-inner`}>
        <Icon size={24} />
      </div>
      <div className="relative z-10">
        <p className="text-gray-500 font-bold uppercase text-[8px] md:text-[9px] tracking-[0.2em] mb-2 select-none">{label}</p>
        <p className="text-3xl md:text-4xl font-black text-[var(--text-title)] tracking-tighter select-none">{value}</p>
      </div>
    </motion.div>
  );
}
