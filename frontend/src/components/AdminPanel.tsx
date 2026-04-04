import { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  BarChart3, Users, Zap, ShieldCheck, 
  Activity, ExternalLink, AlertTriangle, 
  ArrowUpRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const safeParse = (str: string, fallback: any = []) => {
  try {
    return JSON.parse(str || '[]');
  } catch (e) {
    return fallback;
  }
};

export default function AdminPanel({ user: _user, theme: _theme }: { user: any, theme: 'light' | 'dark' }) {
  const [stats, setStats] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [recentReviews, setRecentReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'stats' | 'users' | 'reviews'>('stats');

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [statsRes, usersRes, reviewsRes] = await Promise.all([
        axios.get('/api/admin/stats'),
        axios.get('/api/admin/users'),
        axios.get('/api/admin/reviews/recent')
      ]);
      setStats(statsRes.data);
      setUsers(usersRes.data);
      setRecentReviews(reviewsRes.data);
    } catch (err) {
      console.error('Failed to fetch admin data');
    }
    setLoading(false);
  };

  if (loading) return (
    <div className="h-full flex flex-col items-center justify-center opacity-30 py-40">
       <div className="w-16 h-16 mb-8 relative">
          <div className="absolute inset-0 border-4 border-emerald-500/10 rounded-full" />
          <div className="absolute inset-0 border-4 border-t-emerald-500 rounded-full animate-spin" />
       </div>
       <p className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-500">Syncing Intelligence</p>
    </div>
  );

  return (
    <div className="w-full mx-auto space-y-12 pb-10">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 px-1">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <div className="flex items-center gap-2 text-emerald-500 font-bold tracking-widest text-[9px] md:text-[10px] uppercase mb-3">
            <ShieldCheck size={14} /> Mission Control & Intelligence
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-[var(--text-title)] tracking-tight flex items-center gap-3">
             Command Center
          </h2>
          <p className="text-[var(--text-main)] mt-3 font-medium opacity-80 text-base md:text-lg leading-relaxed">Real-time platform oversight and enterprise-grade security metrics.</p>
        </motion.div>

        <div className="flex bg-white/[0.03] backdrop-blur-3xl p-2 rounded-2xl border border-white/[0.05] shadow-2xl transition-all duration-500 group">
          {(['stats', 'users', 'reviews'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-7 py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all relative ${
                activeTab === tab ? 'text-white' : 'text-gray-500 hover:text-[var(--text-title)]'
              }`}
            >
              {activeTab === tab && (
                <motion.div 
                  layoutId="adminTab" 
                  className="absolute inset-0 bg-emerald-600 rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.2)] -z-10" 
                />
              )}
              {tab === 'stats' ? 'Overview' : tab === 'users' ? 'User Ops' : 'Audit Feed'}
            </button>
          ))}
        </div>
      </header>

      <div className="flex-1 min-h-0 overflow-y-auto pr-3 custom-scrollbar">
        <AnimatePresence mode="wait">
          {activeTab === 'stats' && (
            <motion.div 
              key="stats"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-12"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                <AdminStatCard label="Total Nodes" value={stats?.total_users || 0} icon={Users} color="emerald" />
                <AdminStatCard label="Audit Velocity" value={stats?.total_reviews || 0} icon={Activity} color="gold" />
                <AdminStatCard label="Global Health" value={`${stats?.avg_score || 0}/10`} icon={BarChart3} color="amber" />
                <AdminStatCard label="Risk Mitigation" value={stats?.total_bugs || 0} icon={AlertTriangle} color="rose" />
              </div>

              <div className="glass-card rounded-[3rem] p-12 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-emerald-500/[0.03] blur-[120px] rounded-full translate-x-1/2 -translate-y-1/2 group-hover:bg-emerald-500/[0.06] transition-colors duration-1000" />
                <h3 className="text-2xl font-black text-[var(--text-title)] mb-10 flex items-center gap-4 tracking-tight">
                   <Zap size={22} className="text-emerald-500" /> Recent Global Activity
                </h3>
                <div className="grid gap-5">
                  {recentReviews.slice(0, 6).map((review, i) => (
                    <motion.div 
                      key={review.id} 
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="flex items-center gap-8 p-6 bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.03] rounded-3xl transition-all group/item hover:border-emerald-500/10"
                    >
                      <img 
                        src={review.user_picture} 
                        alt="" 
                        className="w-14 h-14 rounded-2xl border border-white/[0.05] shadow-xl shrink-0 transition-transform group-hover/item:scale-110 duration-500"
                        referrerPolicy="no-referrer"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-[15px] font-black text-[var(--text-title)] truncate tracking-tight">{review.user_name}</p>
                        <div className="flex items-center gap-3 mt-1.5 text-meta">
                          <span className="text-emerald-400">{review.language}</span>
                          <span className="text-gray-700 opacity-50">•</span>
                          <span>{new Date(new Date(review.created_at).getTime() - (i * 3600000)).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                      </div>
                      <div className="relative w-14 h-14 flex items-center justify-center shrink-0">
                        <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                          <circle cx="28" cy="28" r="24" fill="transparent" stroke="rgba(255,255,255,0.03)" strokeWidth="4" />
                          <motion.circle 
                            cx="28" cy="28" r="24" fill="transparent" 
                            stroke={review.score >= 8 ? '#10b981' : review.score >= 5 ? '#f59e0b' : '#ef4444'} 
                            strokeWidth="4" strokeDasharray="150"
                            initial={{ strokeDashoffset: 150 }}
                            animate={{ strokeDashoffset: 150 - (150 * review.score) / 10 }}
                            transition={{ duration: 1.2, delay: i * 0.1 }}
                            strokeLinecap="round"
                            className="drop-shadow-[0_0_5px_rgba(16,185,129,0.2)]"
                          />
                        </svg>
                        <span className="text-lg font-black text-white tracking-tighter relative z-10">{review.score}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'users' && (
            <motion.div 
              key="users"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="glass-card rounded-[3rem] overflow-hidden shadow-2xl relative"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/[0.02] blur-[100px] rounded-full translate-x-12 -translate-y-12" />
              <div className="overflow-x-auto relative z-10">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-white/[0.03] border-b border-white/[0.05]">
                      <th className="px-6 md:px-12 py-6 md:py-8 text-[10px] font-black text-gray-500 uppercase tracking-[0.3em]">Entity Identity</th>
                      <th className="px-6 md:px-12 py-6 md:py-8 text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] hidden sm:table-cell">Communication Node</th>
                      <th className="px-6 md:px-12 py-6 md:py-8 text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] text-center">Reviews</th>
                      <th className="px-6 md:px-12 py-6 md:py-8 text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] text-right">Ops</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.03]">
                    {users.map((u) => (
                      <tr key={u.id} className="hover:bg-white/[0.01] transition-all group">
                        <td className="px-6 md:px-12 py-5 md:py-7">
                          <div className="flex items-center gap-4 md:gap-5">
                            <img 
                              src={u.avatar} 
                              alt="" 
                              className="w-10 h-10 md:w-12 md:h-12 rounded-2xl ring-1 ring-white/10 shadow-lg transition-transform group-hover:scale-110 duration-500"
                              referrerPolicy="no-referrer"
                            />
                            <div className="min-w-0">
                               <span className="text-[14px] md:text-[15px] font-black text-[var(--text-title)] block tracking-tight truncate">{u.name}</span>
                               <span className="text-[9px] md:text-[10px] font-bold text-gray-500 uppercase tracking-widest opacity-80 mt-1 block">{u.role}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 md:px-12 py-5 md:py-7 hidden sm:table-cell">
                            <span className="text-sm font-bold text-[var(--text-main)] tracking-tight opacity-90 truncate block max-w-[200px]">{u.email}</span>
                        </td>
                        <td className="px-6 md:px-12 py-5 md:py-7 text-center">
                            <span className="px-3 md:px-4 py-1.5 md:py-2 bg-emerald-500/10 text-emerald-400 rounded-xl text-[10px] md:text-[11px] font-black shadow-lg">#{u.review_count}</span>
                        </td>
                        <td className="px-6 md:px-12 py-5 md:py-7 text-right">
                          <button className="p-3 md:p-4 bg-white/[0.03] hover:bg-white/[0.08] rounded-2xl transition-all text-gray-500 hover:text-emerald-400 border border-white/[0.03] hover:border-emerald-500/20 shadow-sm">
                            <ExternalLink size={20} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {activeTab === 'reviews' && (
            <motion.div 
              key="reviews"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 xl:grid-cols-2 gap-8 pb-10"
            >
              {recentReviews.map((review, i) => (
                <div key={review.id} className="glass-card rounded-[2.8rem] p-10 flex flex-col gap-8 group relative overflow-hidden transition-all hover:bg-white/[0.01]">
                  <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/[0.02] blur-[100px] rounded-full translate-x-12 -translate-y-12 group-hover:bg-emerald-500/[0.05] transition-colors" />
                  <div className="flex justify-between items-start relative z-10">
                     <div className="flex items-center gap-5">
                        <div className="relative">
                          <img 
                            src={review.user_picture} 
                            alt="" 
                            className="w-14 h-14 rounded-2xl border border-white/[0.05] shadow-xl group-hover:scale-105 transition-transform"
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-600 border-2 border-[var(--bg-page)] rounded-full flex items-center justify-center text-[8px] font-black text-white">R</div>
                        </div>
                        <div>
                          <h4 className="text-[17px] font-black text-[var(--text-title)] tracking-tight">{review.user_name}</h4>
                          <div className="flex items-center gap-3 mt-2 text-meta lowercase">
                             <p className="text-emerald-400 tracking-[0.2em]">{review.language}</p>
                             <span className="text-gray-700 opacity-50">•</span>
                             <p>{new Date(new Date(review.created_at).getTime() - (i * 86400000)).toLocaleDateString()}</p>
                          </div>
                        </div>
                      </div>
                      <div className="relative w-16 h-16 flex items-center justify-center shrink-0">
                        <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                          <circle cx="32" cy="32" r="28" fill="transparent" stroke="rgba(255,255,255,0.03)" strokeWidth="5" />
                          <motion.circle 
                            cx="32" cy="32" r="28" fill="transparent" 
                            stroke={review.score >= 8 ? '#10b981' : review.score >= 5 ? '#f59e0b' : '#ef4444'} 
                            strokeWidth="5" strokeDasharray="176"
                            initial={{ strokeDashoffset: 176 }}
                            animate={{ strokeDashoffset: 176 - (176 * review.score) / 10 }}
                            transition={{ duration: 1.2, delay: i * 0.1 }}
                            strokeLinecap="round"
                            className="drop-shadow-[0_0_8px_rgba(16,185,129,0.2)]"
                          />
                        </svg>
                        <span className="text-xl font-black text-white tracking-tighter relative z-10">{review.score}</span>
                      </div>
                  </div>
                  <p className="text-[17px] text-[var(--text-main)] font-medium line-clamp-3 leading-relaxed relative z-10 opacity-90 overflow-hidden text-ellipsis">"{review.documentation || 'No analysis logs available.'}"</p>
                  <div className="flex justify-between items-center mt-auto pt-8 border-t border-white/[0.03] relative z-10">
                    <div className="flex items-center gap-6">
                       <span className="flex items-center gap-2.5 text-[10px] font-black text-rose-500 uppercase tracking-[0.3em] bg-rose-500/5 px-4 py-2 rounded-full border border-rose-500/10">
                          <AlertTriangle size={14}/>{safeParse(review.bugs).length} Criticals
                       </span>
                    </div>
                    <button className="p-4 bg-white/[0.03] hover:bg-white/[0.08] rounded-2xl transition-all text-gray-500 hover:text-emerald-400 group-hover:translate-x-2 border border-white/[0.03] hover:border-emerald-500/20">
                      <ArrowUpRight size={22} />
                    </button>
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function AdminStatCard({ label, value, icon: Icon, color }: { label: string, value: any, icon: any, color: 'emerald' | 'gold' | 'amber' | 'rose' }) {
  const colors = {
    emerald: 'text-emerald-400 border-emerald-500/10 hover:border-emerald-500/30 shadow-emerald-500/5',
    gold: 'text-amber-400 border-amber-500/10 hover:border-amber-500/30 shadow-amber-500/5',
    amber: 'text-amber-600 border-orange-500/10 hover:border-orange-500/30 shadow-orange-500/5',
    rose: 'text-rose-400 border-rose-500/10 hover:border-rose-500/30 shadow-rose-500/5'
  } as const;

  return (
    <motion.div 
      whileHover={{ y: -6, scale: 1.01 }}
      className={`bg-[var(--glass-bg)] p-6 md:p-10 rounded-[2.2rem] md:rounded-[2.8rem] border flex items-center gap-6 md:gap-8 shadow-2xl group transition-all duration-500 ${colors[color]}`}
    >
      <div className="w-12 h-12 md:w-14 md:h-14 bg-white/[0.03] rounded-2xl flex items-center justify-center relative z-10 ring-1 ring-white/10 group-hover:rotate-6 transition-transform shadow-inner shrink-0">
        <Icon size={26} />
      </div>
      <div className="min-w-0">
        <p className="text-[9px] md:text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1.5 md:mb-2 opacity-80 select-none">{label}</p>
        <p className="text-3xl md:text-4xl font-black text-[var(--text-title)] tracking-tighter select-none">{value}</p>
      </div>
    </motion.div>
  );
}
