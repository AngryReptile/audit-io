import { useState, useEffect, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useLocation } from 'react-router-dom';
import { GoogleOAuthProvider, googleLogout } from '@react-oauth/google';
import axios from 'axios';
import { 
  Settings, Code, History, 
  Terminal, LayoutGrid, LogOut, ChevronRight, Zap,
  Sun, Moon
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { DashboardSkeleton, PageTransition } from './components/Skeletons';
import LoginView from './components/LoginView';
import Dashboard from './components/Dashboard';

// Lazy Load Heavy Components
const ManualReview = lazy(() => import('./components/ManualReview'));
const RepoReview = lazy(() => import('./components/RepoReview'));
const HistoryView = lazy(() => import('./components/HistoryView'));
const AdminPanel = lazy(() => import('./components/AdminPanel'));

export default function App() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => 
    (localStorage.getItem('theme') as 'light' | 'dark') || 'dark'
  );

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) setUser(JSON.parse(savedUser || 'null'));
    setLoading(false);
  }, []);

  const handleLoginSuccess = async (response: any) => {
    try {
      const { data } = await axios.post('/api/auth/google', {
        token: response.credential
      });
      if (data.success) {
        setUser(data.user);
        localStorage.setItem('user', JSON.stringify(data.user));
      }
    } catch (err: any) {
      console.error('Login failed:', err);
      const msg = err.response?.data?.error || err.message || 'Authentication error';
      alert(`Login failed: ${msg}`);
    }
  };

  const logout = () => {
    googleLogout();
    setUser(null);
    localStorage.removeItem('user');
  };

  if (loading) return <DashboardSkeleton />;

  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <Router>
        {!user ? (
          <LoginView onLogin={handleLoginSuccess} theme={theme} />
        ) : (
          <AppContent user={user} logout={logout} theme={theme} toggleTheme={toggleTheme} />
        )}
      </Router>
    </GoogleOAuthProvider>
  );
}

function AppContent({ user, logout, theme, toggleTheme }: { user: any, logout: () => void, theme: 'light' | 'dark', toggleTheme: () => void }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 1024);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 1024) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  return (
    <div className="flex flex-col md:flex-row h-screen bg-[var(--bg-page)] text-[var(--text-main)] font-sans selection:bg-indigo-500/30 overflow-hidden relative transition-colors duration-500">
      <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-900/10 blur-[120px] rounded-full animate-float pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-900/10 blur-[120px] rounded-full animate-float-delayed pointer-events-none" />
      
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-6 bg-[var(--sidebar-bg)] backdrop-blur-3xl border-b border-white/[0.05] z-50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg ring-1 ring-white/10">
            <Zap className="text-white fill-white" size={14} />
          </div>
          <h1 className="text-sm font-black text-[var(--text-title)] tracking-tighter">Audit.io</h1>
        </div>
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 text-[var(--text-title)] bg-white/[0.05] rounded-xl border border-white/[0.05]"
        >
          <LayoutGrid size={20} />
        </button>
      </div>

      <Sidebar 
        user={user} 
        logout={logout} 
        isOpen={isSidebarOpen} 
        setIsOpen={setIsSidebarOpen} 
        theme={theme} 
        toggleTheme={toggleTheme}
        isMobileOpen={isMobileMenuOpen}
        setIsMobileOpen={setIsMobileMenuOpen}
      />
      
      <main className="flex-1 overflow-y-auto px-6 md:px-12 py-8 md:py-10 relative z-10 custom-scrollbar">
         <AnimatePresence mode="wait">
            <Suspense fallback={<DashboardSkeleton />}>
              <Routes location={location} key={location.pathname}>
                <Route path="/" element={<PageTransition><Dashboard user={user} theme={theme} /></PageTransition>} />
                <Route path="/manual" element={<PageTransition><ManualReview user={user} theme={theme} /></PageTransition>} />
                <Route path="/repo" element={<PageTransition><RepoReview user={user} theme={theme} /></PageTransition>} />
                <Route path="/history" element={<PageTransition><HistoryView user={user} theme={theme} /></PageTransition>} />
                <Route path="/admin" element={user.role === 'admin' ? <PageTransition><AdminPanel user={user} theme={theme} /></PageTransition> : <Navigate to="/" />} />
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </Suspense>
         </AnimatePresence>
      </main>
    </div>
  );
}

function Sidebar({ user, logout, isOpen, setIsOpen, theme, toggleTheme, isMobileOpen, setIsMobileOpen }: { user: any, logout: any, isOpen: boolean, setIsOpen: (v: boolean) => void, theme: 'light' | 'dark', toggleTheme: () => void, isMobileOpen: boolean, setIsMobileOpen: (v: boolean) => void }) {
  const location = useLocation();

  const navItems = [
    { icon: LayoutGrid, label: 'Dashboard', path: '/' },
    { icon: Terminal, label: 'Manual Audit', path: '/manual' },
    { icon: Code, label: 'Repo Browser', path: '/repo' },
    { icon: History, label: 'Audit Logs', path: '/history' },
  ];

  if (user.role === 'admin') {
    navItems.push({ icon: Settings, label: 'Control Center', path: '/admin' });
  }

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[55] md:hidden"
          />
        )}
      </AnimatePresence>

      <motion.aside 
        initial={false}
        animate={{ 
          width: isOpen ? '280px' : '90px',
          x: (window.innerWidth < 768 && !isMobileOpen) ? -280 : 0
        }}
        className={`fixed md:relative z-[60] h-full transition-all duration-500 ease-[0.23,1,0.32,1] bg-[var(--sidebar-bg)] backdrop-blur-3xl flex flex-col p-6 border-r border-white/5 md:border-none shadow-2xl md:shadow-none`}
      >
        <div className="flex items-center gap-4 mb-14 overflow-hidden px-2">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-xl shadow-indigo-500/10 ring-1 ring-white/10 shrink-0 rotate-3">
            <Zap className="text-white fill-white" size={20} />
          </div>
          <div className={`transition-opacity duration-300 ${(isOpen || isMobileOpen) ? 'opacity-100' : 'opacity-0'}`}>
            <h1 className="text-lg font-black text-[var(--text-title)] tracking-tighter leading-none">Audit.io</h1>
            <span className="text-[10px] font-black text-indigo-400/80 uppercase tracking-widest mt-0.5 inline-block">Enterprise v2.0</span>
          </div>
        </div>

        <nav className="flex-1 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const showLabel = isOpen || (window.innerWidth < 768 && isMobileOpen);
            return (
              <Link 
                key={item.path} 
                to={item.path}
                className={`flex items-center justify-between p-3.5 rounded-xl transition-all relative group ${
                  isActive ? 'bg-indigo-600/10 text-indigo-400' : 'text-gray-500 hover:text-[var(--text-title)]'
                }`}
              >
                <div className="flex items-center gap-4">
                  <item.icon size={18} className={isActive ? 'text-indigo-400' : 'text-gray-500 group-hover:text-indigo-400 transition-colors'} />
                  <span className={`font-bold text-[13px] tracking-tight transition-all duration-300 ${showLabel ? 'opacity-100' : 'opacity-0 h-0 hidden'}`}>
                    {item.label}
                  </span>
                </div>
                {isActive && showLabel && <div className="w-1 h-4 bg-indigo-500 rounded-full" />}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto space-y-4">
          <button 
            onClick={toggleTheme}
            className="w-full flex items-center justify-between p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.03] hover:border-indigo-500/20 transition-all group"
          >
            <div className="flex items-center gap-4">
              {theme === 'dark' ? (
                <Sun size={18} className="text-amber-400 group-hover:rotate-45 transition-transform" />
              ) : (
                <Moon size={18} className="text-indigo-400 group-hover:-rotate-12 transition-transform" />
              )}
              <span className={`font-bold text-[11px] uppercase tracking-widest transition-opacity duration-300 ${(isOpen || isMobileOpen) ? 'opacity-100' : 'opacity-0 h-0 hidden'}`}>
                {theme === 'dark' ? 'Crystal' : 'Luminous'}
              </span>
            </div>
          </button>

          <div className="p-3 bg-white/[0.03] rounded-2xl border border-white/[0.02] hover:border-indigo-500/20 transition-all cursor-pointer group">
             <div className="flex items-center gap-3 relative z-10 transition-transform group-hover:scale-[1.01]">
               <img 
                 src={user.avatar} 
                 alt="" 
                 className="w-10 h-10 rounded-full border border-white/10 shadow-xl shrink-0"
                 referrerPolicy="no-referrer"
               />
               <div className={`overflow-hidden transition-all duration-300 ${(isOpen || isMobileOpen) ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4 w-0'}`}>
                 <p className="text-[13px] font-bold text-[var(--text-title)] truncate leading-tight mb-0.5">{user.name.split(' ')[0]}</p>
                 <p className="text-[9px] font-black text-gray-500 truncate uppercase tracking-widest opacity-80 italic">Pro Access</p>
               </div>
             </div>
          </div>

          <button 
            onClick={logout}
            className="btn-ghost w-full py-3.5 rounded-xl font-black text-[9px] uppercase tracking-[0.25em] flex items-center justify-center gap-2 group"
          >
            <LogOut size={14} className="group-hover:translate-x-0.5 transition-transform" /> {(isOpen || isMobileOpen) ? 'Exit' : ''}
          </button>

          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="hidden md:block w-full p-2 text-gray-700 hover:text-white transition-colors"
          >
            <ChevronRight className={`mx-auto transition-transform ${isOpen ? 'rotate-180' : ''}`} size={16} />
          </button>
        </div>
      </motion.aside>
    </>
  );
}
