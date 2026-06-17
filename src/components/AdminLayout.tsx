import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Menu, 
  X, 
  Bell, 
  Search, 
  User, 
  ChevronRight,
  Sun,
  Moon,
  LogOut,
  Shield
} from 'lucide-react';
import { cn } from '../lib/utils';
import { NAV_ITEMS, AdminSection } from '../types';

interface AdminLayoutProps {
  children: React.ReactNode;
  onLogout: () => void;
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
}

export function AdminLayout({ 
  children, 
  onLogout,
  theme,
  setTheme
}: AdminLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const currentPath = location.pathname.substring(1) || 'home';

  return (
    <div className={cn("min-h-screen font-sans transition-colors duration-300", theme)}>
      <div className="flex bg-slate-50/50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 min-h-screen">
        
        {/* Sidebar */}
        <motion.aside 
          initial={false}
          animate={{ width: isSidebarOpen ? 280 : 80 }}
          className="bg-white dark:bg-slate-900 h-screen fixed left-0 top-0 z-50 flex flex-col border-r border-slate-200 dark:border-slate-800/80 shadow-xl dark:shadow-none transition-colors duration-500"
        >
          <div className="p-7 flex items-center gap-4">
            <div className="w-11 h-11 premium-gradient rounded-xl flex shrink-0 items-center justify-center shadow-lg shadow-emerald-500/30">
              <Shield className="w-6 h-6 text-white" />
            </div>
            {isSidebarOpen && (
              <motion.span 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="font-display font-black text-2xl tracking-tighter whitespace-nowrap bg-gradient-to-r from-emerald-600 to-teal-700 bg-clip-text text-transparent"
              >
                DSGC
              </motion.span>
            )}
          </div>

          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto custom-scrollbar">
            {NAV_ITEMS.map((item) => (
              <NavItemComponent
                key={item.id}
                item={item}
                isActive={currentPath === item.id}
                isOpen={isSidebarOpen}
                onClick={() => navigate(`/${item.id}`)}
              />
            ))}
          </nav>

          <div className="p-5 border-t border-slate-100 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-900/50">
            <button 
              onClick={onLogout}
              className="w-full flex items-center gap-3 p-3.5 rounded-2xl hover:bg-red-50 dark:hover:bg-red-950/30 transition-all text-slate-500 hover:text-red-600 dark:hover:text-red-400 group"
            >
              <LogOut className="w-5 h-5 shrink-0" />
              {isSidebarOpen && <span className="font-bold text-sm tracking-tight">Terminar Sessão</span>}
            </button>
          </div>
        </motion.aside>

        {/* Main Content */}
        <main 
          className={cn(
            "flex-1 flex flex-col min-h-screen transition-all duration-500",
            isSidebarOpen ? "ml-[280px]" : "ml-[80px]"
          )}
        >
          {/* Header */}
          <header className="h-24 bg-white/70 dark:bg-slate-950/70 backdrop-blur-2xl border-b border-slate-200/60 dark:border-slate-800/50 flex items-center justify-between px-10 sticky top-0 z-40 transition-colors duration-500">
            <div className="flex items-center gap-4 lg:gap-6 flex-1 max-w-xl">
              <button 
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="p-2.5 bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-xl transition-all shrink-0"
              >
                <Menu className="w-6 h-6" />
              </button>
              <div className="relative group hidden sm:block flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Pesquisar..."
                  className="pl-12 pr-6 py-3 bg-slate-100 dark:bg-slate-900 rounded-2xl text-sm w-full focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:bg-white dark:focus:bg-slate-950 border border-transparent focus:border-emerald-500/20 transition-all font-medium"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-4 ml-4">
              <button 
                onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
                className="p-3 bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-xl transition-all group shrink-0"
                title={theme === 'light' ? 'Ativar Modo Nocturno' : 'Ativar Modo Diurno'}
              >
                {theme === 'light' ? <Moon className="w-5.5 h-5.5 text-slate-500" /> : <Sun className="w-5.5 h-5.5 text-emerald-400" />}
              </button>

              <button className="relative p-3 bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-xl transition-all group text-slate-500 shrink-0">
                <Bell className="w-5.5 h-5.5 group-hover:text-emerald-500 transition-colors" />
                <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white dark:border-slate-950 animate-pulse"></span>
              </button>
              
              <div className="flex items-center gap-4 pl-4 sm:pl-6 border-l border-slate-200 dark:border-slate-800 ml-1 sm:ml-2">
                <div className="text-right hidden xl:block">
                  <p className="text-sm font-black leading-none tracking-tight">Engr. Alberto Costa</p>
                  <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-black uppercase tracking-[0.1em] mt-1.5 opacity-80 whitespace-nowrap">Diretor Técnico</p>
                </div>
                <div className="w-12 h-12 rounded-2xl premium-gradient p-0.5 shadow-lg shadow-emerald-500/20 shrink-0">
                  <div className="w-full h-full rounded-[0.65rem] bg-white dark:bg-slate-900 flex items-center justify-center overflow-hidden">
                    <User className="w-7 h-7 text-slate-400" />
                  </div>
                </div>
              </div>
            </div>
          </header>

          {/* Content Area */}
          <div className="flex-1 p-8 overflow-y-auto">
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
