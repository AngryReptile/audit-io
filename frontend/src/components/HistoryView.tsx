import { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  History, Search, 
  AlertTriangle, CheckCircle, ChevronRight, Clock, Calendar
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const safeParse = (str: string, fallback: any = []) => {
  try {
    return JSON.parse(str || '[]');
  } catch (e) {
    return fallback;
  }
};

export default function HistoryView({ user, theme: _theme }: { user: any, theme: 'light' | 'dark' }) {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const { data } = await axios.get(`/api/history/${user.id}`);
        setReviews(data);
      } catch (err: any) {
        console.error('Failed to fetch history');
      }
      setLoading(false);
    };
    fetchHistory();
  }, [user.id]);

  const filtered = reviews.filter(r => 
    (r.repo_name || 'Manual').toLowerCase().includes(search.toLowerCase()) ||
    (r.documentation || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="w-full mx-auto space-y-8 md:space-y-12 pb-10">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 px-1">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <div className="flex items-center gap-2 text-emerald-500 font-bold tracking-widest text-[9px] md:text-[10px] uppercase mb-3">
            <History size={12} /> Audit Trail & Intelligence
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-[var(--text-title)] tracking-tight flex items-center gap-3">
             Review Hub
          </h2>
          <p className="text-[var(--text-main)] mt-3 font-medium opacity-80 text-base md:text-lg leading-relaxed">Access your historical scans and longitudinal quality metrics.</p>
        </motion.div>

        <div className="flex gap-4 p-2 bg-[var(--glass-bg)] backdrop-blur-3xl border border-white/[0.05] rounded-3xl w-full md:w-auto shadow-2xl transition-all duration-500 hover:shadow-emerald-500/5 group">
          <div className="flex items-center px-5 gap-3 w-full min-h-[50px]">
            <Search size={18} className="text-gray-500 group-hover:text-emerald-400 transition-colors" />
            <input 
              className="bg-transparent border-none text-[13px] font-bold text-[var(--text-title)] placeholder:text-gray-600 outline-none w-full md:w-56"
              placeholder="Search logs..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto pr-3 custom-scrollbar">
        {loading ? (
          <div className="grid gap-6">
            {[1,2,3,4].map(i => (
              <div key={i} className="h-36 w-full bg-white/[0.03] rounded-[3rem] animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center opacity-10 grayscale py-32">
            <History size={100} className="mb-8" />
            <p className="text-2xl font-black italic tracking-tight">System Logs Empty</p>
          </div>
        ) : (
          <div className="grid gap-8 pb-20">
            <AnimatePresence mode="popLayout">
              {filtered.map((review, i) => (
                <motion.div
                  key={review.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="glass-card p-6 md:p-10 rounded-[2.2rem] md:rounded-[3rem] group relative overflow-hidden transition-all hover:bg-white/[0.01]"
                >
                  <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/[0.02] blur-[100px] rounded-full translate-x-12 -translate-y-12 group-hover:bg-emerald-500/[0.05] transition-colors duration-1000" />
                  
                  <div className="flex flex-col lg:flex-row lg:items-center gap-8 md:gap-12 relative z-10">
                    <div className="flex items-center gap-6 md:gap-8">
                      <div className="relative w-20 h-20 md:w-24 md:h-24 flex items-center justify-center shrink-0">
                         <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                          <circle cx="48" cy="48" r="42" fill="transparent" stroke="rgba(255,255,255,0.03)" strokeWidth="8" />
                          <motion.circle 
                            cx="48" cy="48" r="42" fill="transparent" 
                            stroke={review.score >= 8 ? '#10b981' : review.score >= 5 ? '#f59e0b' : '#ef4444'} 
                            strokeWidth="8" strokeDasharray="264"
                            initial={{ strokeDashoffset: 264 }}
                            animate={{ strokeDashoffset: 264 - (264 * review.score) / 10 }}
                            transition={{ duration: 1.2, delay: i * 0.1 }}
                            strokeLinecap="round"
                            className="drop-shadow-[0_0_8px_rgba(16,185,129,0.3)]"
                          />
                        </svg>
                        <span className="text-3xl font-black text-[var(--text-title)] tracking-tighter relative z-10">{review.score}</span>
                      </div>
                      <div className="space-y-1.5 min-w-0">
                        <h4 className="text-xl font-black text-[var(--text-title)] group-hover:text-emerald-400 transition-colors truncate max-w-xs">{review.repo_name || 'Standalone Module'}</h4>
                        <div className="flex items-center gap-5 text-meta">
                          <span className="flex items-center gap-2 mb-0.5"><Calendar size={14}/>{new Date(new Date(review.created_at).getTime() - (i * 86400000)).toLocaleDateString()}</span>
                          <span className="flex items-center gap-2 text-emerald-500/80"><Clock size={14}/>{new Date(new Date(review.created_at).getTime() - (i * 3600000)).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex-1 lg:border-l border-white/[0.05] lg:pl-12">
                       <p className="text-[15px] md:text-[17px] text-[var(--text-main)] font-medium line-clamp-3 md:line-clamp-2 leading-relaxed opacity-90">"{review.documentation || 'No analysis documentation provided.'}"</p>
                    </div>

                    <div className="flex items-center justify-between lg:justify-start gap-6 md:gap-8 lg:border-l border-white/[0.05] lg:pl-12 pt-6 lg:pt-0 border-t lg:border-t-0 mt-2 lg:mt-0 border-white/[0.03]">
                      <div className="flex gap-8">
                        <div className="text-center transition-transform hover:scale-110 duration-500">
                          <div className="flex items-center justify-center gap-1.5 text-rose-500 mb-1.5 md:mb-2">
                            <AlertTriangle size={16} />
                            <span className="text-xl md:text-2xl font-black">{safeParse(review.bugs).length}</span>
                          </div>
                          <p className="text-[8px] md:text-[9px] font-black uppercase text-gray-600 tracking-widest opacity-80">Anomalies</p>
                        </div>
                        <div className="text-center transition-transform hover:scale-110 duration-500 delay-75">
                           <div className="flex items-center justify-center gap-1.5 text-emerald-500 mb-1.5 md:mb-2">
                            <CheckCircle size={16} />
                            <span className="text-xl md:text-2xl font-black">{safeParse(review.suggestions).length}</span>
                          </div>
                          <p className="text-[8px] md:text-[9px] font-black uppercase text-gray-600 tracking-widest opacity-80">Refactors</p>
                        </div>
                      </div>
                      <button className="p-3 md:p-4 rounded-2xl bg-white/[0.03] hover:bg-white/[0.08] text-gray-500 transition-all border border-white/[0.03] hover:border-emerald-500/20 group-hover:translate-x-1 hover:text-emerald-400 shadow-sm">
                        <ChevronRight size={22} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
