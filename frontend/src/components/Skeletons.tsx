import { motion } from 'framer-motion';

export const CardSkeleton = () => (
  <div className="bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-[2.5rem] p-8 animate-pulse shadow-xl transition-colors duration-500">
    <div className="w-14 h-14 bg-emerald-500/10 rounded-2xl mb-6 ring-1 ring-white/5" />
    <div className="h-4 w-20 bg-gray-500/20 rounded-full mb-3" />
    <div className="h-8 w-32 bg-[var(--text-title)]/10 rounded-xl" />
  </div>
);

export const DashboardSkeleton = () => (
  <div className="space-y-12 animate-in fade-in duration-700 pb-20">
    <div className="space-y-4">
      <div className="h-4 w-48 bg-emerald-500/20 rounded-full" />
      <div className="h-16 w-[500px] bg-[var(--text-title)]/10 rounded-3xl" />
      <div className="h-6 w-[400px] bg-gray-500/20 rounded-2xl" />
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
      {[1, 2, 3, 4].map(i => <CardSkeleton key={i} />)}
    </div>
    <div className="h-96 w-full bg-[var(--glass-bg)] rounded-[3.5rem] border border-[var(--glass-border)] shadow-2xl" />
  </div>
);

export const ListSkeleton = () => (
  <div className="space-y-6">
    {[1, 2, 3, 4, 5].map(i => (
      <div key={i} className="h-28 w-full bg-[var(--glass-bg)] rounded-[2.5rem] border border-[var(--glass-border)] animate-pulse shadow-lg" />
    ))}
  </div>
);

export const PageTransition = ({ children }: { children: React.ReactNode }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
    className="h-full"
  >
    {children}
  </motion.div>
);
