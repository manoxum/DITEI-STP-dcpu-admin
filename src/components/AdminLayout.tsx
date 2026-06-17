import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Menu,
  Bell,
  Search,
  User,
  Sun,
  Moon,
  Monitor,
  LogOut,
  Shield
} from 'lucide-react';
import { cn } from '../lib/utils';
import { NAV_ITEMS } from '../types';
import { useTheme, ThemeMode } from '../contexts/ThemeContext';

interface AdminLayoutProps {
  children: React.ReactNode;
  onLogout: () => void;
}

const THEME_OPTIONS: { mode: ThemeMode; icon: React.ElementType; label: string }[] = [
  { mode: 'auto',  icon: Monitor, label: 'Auto' },
  { mode: 'light', icon: Sun,     label: 'Claro' },
  { mode: 'dark',  icon: Moon,    label: 'Escuro' },
];

export function ThemeToggle({ compact = false }: { compact?: boolean }) {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex items-center bg-slate-300/60 dark:bg-slate-900 rounded-xl p-1 gap-0.5">
      {THEME_OPTIONS.map(({ mode, icon: Icon, label }) => (
        <button
          key={mode}
          onClick={() => setTheme(mode)}
          title={label}
          className={cn(
            "flex items-center gap-1.5 px-2.5 py-2 rounded-lg text-xs font-bold transition-all duration-200",
            theme === mode
              ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-sm"
              : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
          )}
        >
          <Icon className="w-4 h-4 shrink-0" />
          {!compact && <span className="hidden sm:inline">{label}</span>}
        </button>
      ))}
    </div>
  );
}

export function AdminLayout({ children, onLogout }: AdminLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);
  const [isMobile, setIsMobile] = React.useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  React.useEffect(() => {
    const handleResize = () => {
      const mobileStatus = window.innerWidth < 1024;
      setIsMobile(mobileStatus);
      // Automatically collapse sidebar on mobile by default
      if (mobileStatus) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const currentPath = location.pathname.substring(1) || 'home';

  return (
    <div className={cn("min-h-screen font-sans transition-colors duration-300")}>
      <div className="flex bg-slate-200 dark:bg-slate-950 text-slate-800 dark:text-slate-100 min-h-screen">

        {/* Backdrop overlay on mobile */}
        <AnimatePresence>
          {isMobile && isSidebarOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs z-40"
            />
          )}
        </AnimatePresence>

        {/* Sidebar */}
        <motion.aside
          initial={false}
          animate={
            isMobile
              ? { x: isSidebarOpen ? 0 : -280, width: 280 }
              : { x: 0, width: isSidebarOpen ? 280 : 80 }
          }
          transition={{ type: "tween", ease: "easeInOut", duration: 0.3 }}
          className="bg-slate-100 dark:bg-slate-900 h-screen fixed left-0 top-0 z-50 flex flex-col border-r border-slate-300/60 dark:border-slate-800/80 shadow-sm dark:shadow-none transition-colors duration-500"
        >
          <div className="p-7 flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 premium-gradient rounded-xl flex shrink-0 items-center justify-center shadow-lg shadow-emerald-500/30">
                <Shield className="w-6 h-6 text-white" />
              </div>
              {(isSidebarOpen || isMobile) && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="font-display font-black text-2xl tracking-tighter whitespace-nowrap bg-gradient-to-r from-emerald-600 to-teal-700 bg-clip-text text-transparent"
                >
                  DSGC
                </motion.span>
              )}
            </div>
          </div>

          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto custom-scrollbar">
            {NAV_ITEMS.map((item) => (
              <NavItemComponent
                key={item.id}
                item={item}
                isActive={currentPath === item.id}
                isOpen={isSidebarOpen || isMobile}
                onClick={() => {
                  navigate(`/${item.id}`);
                  if (isMobile) {
                    setIsSidebarOpen(false);
                  }
                }}
              />
            ))}
          </nav>

          <div className="p-5 border-t border-slate-100 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-900/50">
            <button
              onClick={onLogout}
              className="w-full flex items-center gap-3 p-3.5 rounded-2xl hover:bg-red-50 dark:hover:bg-red-950/30 transition-all text-slate-500 hover:text-red-600 dark:hover:text-red-400 group"
            >
              <LogOut className="w-5 h-5 shrink-0" />
              {(isSidebarOpen || isMobile) && <span className="font-bold text-sm tracking-tight">Terminar Sessão</span>}
            </button>
          </div>
        </motion.aside>

        {/* Main Content */}
        <main
          className={cn(
            "flex-1 flex flex-col min-h-screen transition-all duration-300",
            isMobile ? "ml-0" : isSidebarOpen ? "ml-[280px]" : "ml-[80px]"
          )}
        >
          {/* Header */}
          <header className="h-24 bg-slate-200/90 dark:bg-slate-950/70 backdrop-blur-2xl border-b border-slate-300/60 dark:border-slate-800/50 flex items-center justify-between px-4 sm:px-10 sticky top-0 z-40 transition-colors duration-500">
            <div className="flex items-center gap-4 lg:gap-6 flex-1 max-w-xl">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="p-2.5 bg-slate-300/60 dark:bg-slate-900 hover:bg-slate-300 dark:hover:bg-slate-800 rounded-xl transition-all shrink-0"
              >
                <Menu className="w-6 h-6" />
              </button>
              <div className="relative group hidden sm:block flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Pesquisar..."
                  className="pl-12 pr-6 py-3 bg-slate-300/50 dark:bg-slate-900 rounded-2xl text-sm w-full focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:bg-white dark:focus:bg-slate-950 border border-transparent focus:border-emerald-500/20 transition-all font-medium"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3 ml-2 sm:ml-4">
              <ThemeToggle />

              <button className="relative p-3 bg-slate-300/60 dark:bg-slate-900 hover:bg-slate-300 dark:hover:bg-slate-800 rounded-xl transition-all group text-slate-500 shrink-0">
                <Bell className="w-5.5 h-5.5 group-hover:text-emerald-500 transition-colors" />
                <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white dark:border-slate-950 animate-pulse"></span>
              </button>

              <div className="flex items-center gap-4 pl-4 sm:pl-6 border-l border-slate-200 dark:border-slate-800 ml-1 sm:ml-2">
                <div className="text-right hidden xl:block">
                  <p className="text-sm font-black leading-none tracking-tight">Engr. Alberto Costa</p>
                  <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-black uppercase tracking-[0.1em] mt-1.5 opacity-80 whitespace-nowrap">Diretor Técnico</p>
                </div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl premium-gradient p-0.5 shadow-lg shadow-emerald-500/20 shrink-0">
                  <div className="w-full h-full rounded-[0.65rem] bg-white dark:bg-slate-900 flex items-center justify-center overflow-hidden">
                    <User className="w-6 h-6 sm:w-7 sm:h-7 text-slate-400" />
                  </div>
                </div>
              </div>
            </div>
          </header>

          {/* Content Area */}
          <div className="flex-1 p-4 sm:p-8 overflow-y-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.3 }}
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  );
}

interface NavItemProps {
  item: any;
  isActive: boolean;
  isOpen: boolean;
  onClick: () => void;
  key?: string | number;
}

function NavItemComponent({ item, isActive, isOpen, onClick }: NavItemProps) {
  const Icon = item.icon;

  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-3.5 p-3.5 rounded-2xl transition-all duration-300 relative group",
        isActive
          ? "sidebar-link-active"
          : "text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-100"
      )}
    >
      <Icon className={cn("w-5.5 h-5.5 shrink-0", isActive ? "text-emerald-600 dark:text-emerald-400" : "group-hover:text-emerald-500 transition-colors opacity-70 group-hover:opacity-100")} />
      {isOpen && (
        <span className="font-bold text-sm whitespace-nowrap tracking-tight">{item.label}</span>
      )}
      {isActive && (
        <motion.div
          layoutId="active-indicator"
          className="absolute left-0 w-1.5 h-7 bg-emerald-500 rounded-r-full shadow-[0_0_12px_rgba(16,185,129,0.5)]"
        />
      )}
    </button>
  );
}
