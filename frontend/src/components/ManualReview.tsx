import { useState } from 'react';
import axios from 'axios';
import { Terminal, Copy, Play, Loader2, Sparkles, AlertTriangle, CheckCircle, Hash } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactDiffViewer from 'react-diff-viewer-continued';

export default function ManualReview({ user, theme }: { user: any, theme: 'light' | 'dark' }) {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [splitView, setSplitView] = useState(false);

  const handleReview = async () => {
    if (!code) return;
    setLoading(true);
    setResult(null);
    try {
      const response = await axios.post('/api/review', {
        code,
        userId: user.id
      });
      setResult(response.data);
    } catch (err: any) {
      alert(`Error analyzing code: ${err.message}`);
    }
    setLoading(false);
  };

  return (
    <div className="w-full mx-auto space-y-8 pb-10">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 px-1">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <div className="flex items-center gap-2 text-indigo-500 font-bold tracking-widest text-[9px] md:text-[10px] uppercase mb-3">
            <Terminal size={12} /> Live Analysis Engine
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-[var(--text-title)] tracking-tight flex items-center gap-3">
             Manual Review
          </h2>
          <p className="text-[var(--text-main)] mt-3 font-medium opacity-80 max-w-lg text-base md:text-lg leading-relaxed">Paste your implementation for an instant security and performance audit from Gemini v2.0.</p>
        </motion.div>
        
        <AnimatePresence>
          {result && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex gap-3"
            >
              <button 
                onClick={() => setSplitView(!splitView)}
                className="px-6 py-3 rounded-xl bg-white/[0.04] border border-white/[0.05] text-[10px] font-black uppercase tracking-widest hover:bg-white/[0.08] transition-all shadow-lg"
              >
                {splitView ? 'Unified' : 'Split'} View
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
 
      <div className="flex flex-col xl:flex-row gap-8 xl:gap-12 flex-1 min-h-0">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col space-y-4 h-full xl:w-1/2"
        >
          <div className="glass-card rounded-[2.2rem] md:rounded-[2.8rem] p-6 md:p-10 flex-1 flex flex-col relative overflow-hidden group min-h-[400px]">
            <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/[0.02] blur-[100px] rounded-full" />
            
            <div className="flex justify-between items-center mb-8 relative z-10">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Autonomous Detection Active</span>
              </div>
              <button 
                onClick={() => setCode('')} 
                className="p-2.5 text-gray-500 hover:text-rose-500 transition-colors bg-white/[0.03] rounded-xl border border-white/[0.03] hover:border-rose-500/20"
                title="Clear code"
              >
                <div className="p-0.5"><Copy size={18} /></div>
              </button>
            </div>

            <textarea 
              className="flex-1 w-full bg-transparent border-none text-[var(--text-title)] font-mono text-sm resize-none focus:outline-none placeholder:text-gray-600 leading-relaxed custom-scrollbar p-2"
              placeholder="// Paste your code here (any language)..."
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />

            <div className="mt-8 pt-8 border-t border-white/[0.03] flex gap-5">
              <button 
                onClick={handleReview}
                disabled={loading || !code}
                className="btn-primary flex-1 py-6 rounded-2xl font-black text-[15px] flex items-center justify-center gap-3"
              >
                {loading ? <Loader2 className="animate-spin" size={22} /> : <Play className="fill-white" size={22} />}
                {loading ? 'Analyzing...' : 'Start Intelligence Audit'}
              </button>
            </div>
          </div>
        </motion.div>

        <div className="xl:w-1/2 overflow-y-auto pr-1 md:pr-3 custom-scrollbar">
          <AnimatePresence mode="wait">
            {!result && !loading && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-full flex flex-col items-center justify-center text-center p-12 opacity-20 select-none grayscale"
              >
                <div className="p-12 rounded-[4rem] bg-indigo-500/[0.03] mb-8 border border-indigo-500/[0.05]">
                  <Terminal size={100} className="text-indigo-400" />
                </div>
                <h3 className="text-2xl font-black text-[var(--text-title)] mb-3 italic tracking-tight">Idle State</h3>
                <p className="max-w-xs font-medium text-[var(--text-main)] text-lg">Input your source code to initiate a world-class security assessment.</p>
              </motion.div>
            )}

            {loading && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-full flex flex-col items-center justify-center py-20"
              >
                <div className="relative w-28 h-28 mb-10">
                  <div className="absolute inset-0 border-[5px] border-indigo-500/10 rounded-full" />
                  <div className="absolute inset-0 border-[5px] border-t-indigo-500 rounded-full animate-spin" />
                  <Sparkles className="absolute inset-0 m-auto text-indigo-500 animate-pulse" size={36} />
                </div>
                <p className="text-indigo-500 font-black uppercase tracking-[0.5em] text-[11px] opacity-80">Pipeline Active</p>
              </motion.div>
            )}

            {result && (
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-12 pb-10"
              >
                {/* Score Section */}
                <div className="glass-card rounded-[2.2rem] md:rounded-[3rem] p-8 md:p-12 relative overflow-hidden group">
                  <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-center">
                    <div className="relative w-32 h-32 md:w-36 md:h-36 flex items-center justify-center shrink-0">
                      <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                        <circle cx="72" cy="72" r="64" fill="transparent" stroke="rgba(128,128,128,0.1)" strokeWidth="12" />
                        <motion.circle 
                          cx="72" cy="72" r="64" 
                          fill="transparent" 
                          stroke={result.score >= 8 ? '#10b981' : result.score >= 5 ? '#f59e0b' : '#ef4444'} 
                          strokeWidth="12" 
                          strokeDasharray="402"
                          initial={{ strokeDashoffset: 402 }}
                          animate={{ strokeDashoffset: 402 - (402 * result.score) / 10 }}
                          transition={{ duration: 1.5, ease: "easeOut" }}
                          strokeLinecap="round"
                        />
                      </svg>
                      <div className="z-10 text-center">
                        <span className="text-6xl font-black text-[var(--text-title)] tracking-tighter">{result.score}</span>
                        <div className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-600 mt-1">Audit Grade</div>
                      </div>
                    </div>
                    <div className="flex-1">
                       <div className="flex items-center justify-between mb-4">
                         <h4 className="text-2xl font-black text-[var(--text-title)] flex items-center gap-3 tracking-tight">
                           <Sparkles className="text-indigo-500" size={22} /> Executive Summary
                         </h4>
                         {result.detectedLanguage && (
                           <span className="px-4 py-1.5 rounded-full bg-indigo-500/10 text-indigo-400 text-[10px] font-black uppercase tracking-widest border border-indigo-500/20 shadow-lg">
                             Identified: {result.detectedLanguage}
                           </span>
                         )}
                       </div>
                       <p className="text-[17px] text-[var(--text-main)] font-medium leading-relaxed opacity-90">"{result.documentation}"</p>
                    </div>
                  </div>
                </div>

                {/* Bug List */}
                {result.bugs && result.bugs.length > 0 && (
                  <div className="space-y-6">
                    <h4 className="text-xl font-black text-[var(--text-title)] flex items-center gap-4 px-2">
                      <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-2xl shadow-lg ring-1 ring-rose-500/20"><AlertTriangle className="text-rose-500" size={20}/></div>
                      Detected Anomalies
                    </h4>
                    <div className="grid gap-5">
                      {result.bugs.map((bug: any, i: number) => (
                        <motion.div 
                          key={i}
                          initial={{ opacity: 0, x: 30 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.1 }}
                          className="p-8 bg-rose-500/[0.02] border border-rose-500/10 rounded-[2rem] relative group overflow-hidden"
                        >
                          <div className="absolute top-0 left-0 w-1.5 h-full bg-rose-500/30" />
                          <div className="flex justify-between items-start mb-5">
                            <span className="text-[10px] font-black uppercase tracking-widest bg-rose-500/10 text-rose-500 px-4 py-2 rounded-full border border-rose-500/20">
                              {bug.severity} Sensitivity
                            </span>
                            {bug.line && (
                              <div className="flex items-center gap-2 text-gray-500 text-[10px] font-black uppercase tracking-widest bg-white/[0.03] px-4 py-2 rounded-full border border-white/[0.05]">
                                <Hash size={12} /> Row {bug.line}
                              </div>
                            )}
                          </div>
                          <p className="text-[var(--text-main)] font-medium text-lg leading-relaxed opacity-90">{bug.description}</p>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Suggestions */}
                {result.suggestions && result.suggestions.length > 0 && (
                   <div className="space-y-8">
                      <h4 className="text-xl font-black text-[var(--text-title)] flex items-center gap-4 px-2">
                        <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl shadow-lg ring-1 ring-emerald-500/20"><CheckCircle className="text-emerald-500" size={20}/></div>
                        Recommended Fixes
                      </h4>
                      <div className="space-y-10">
                        {result.suggestions.map((sugg: any, i: number) => (
                          <motion.div 
                            key={i}
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.15 }}
                            className="glass-card rounded-[2.5rem] overflow-hidden shadow-2xl transition-all hover:border-indigo-500/10"
                          >
                            <div className="p-10 border-b border-white/[0.03] bg-white/[0.01]">
                              <p className="text-[17px] text-[var(--text-title)] font-bold leading-relaxed">{sugg.description}</p>
                            </div>
                            <div className="p-6 text-[11px] bg-[var(--bg-page)]/40">
                              <ReactDiffViewer
                                oldValue={sugg.before}
                                newValue={sugg.after}
                                splitView={splitView}
                                useDarkTheme={theme === 'dark'}
                                showDiffOnly={false}
                                styles={{
                                  variables: {
                                    dark: {
                                      diffViewerBackground: 'transparent',
                                      addedBackground: 'rgba(16, 185, 129, 0.08)',
                                      removedBackground: 'rgba(239, 68, 68, 0.08)',
                                    },
                                    light: {
                                      diffViewerBackground: '#ffffff',
                                      addedBackground: 'rgba(16, 185, 129, 0.08)',
                                      removedBackground: 'rgba(239, 68, 68, 0.08)',
                                    }
                                  }
                                }}
                              />
                            </div>
                          </motion.div>
                        ))}
                      </div>
                   </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
