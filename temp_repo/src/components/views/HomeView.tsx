import { Shield, Lock, FileText, ArrowRight, User } from "lucide-react";
import { motion } from "motion/react";

export function HomeView({ onEnter }: { onEnter: () => void }) {
  const hour = new Date().getHours();
  let greeting = "Bom dia";
  if (hour >= 12 && hour < 18) greeting = "Boa tarde";
  if (hour >= 18) greeting = "Boa noite";

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 py-10 sm:px-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-3xl"
      >
        <div className="w-24 h-24 premium-gradient rounded-[2rem] flex items-center justify-center mx-auto mb-10 shadow-3xl shadow-emerald-500/30">
          <Shield className="w-12 h-12 text-white" />
        </div>
        
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-black tracking-tighter mb-6 leading-[0.9]">
          {greeting}, <br />
          <span className="bg-gradient-to-r from-emerald-600 to-teal-700 bg-clip-text text-transparent italic">Engr. Alberto Costa</span>
        </h1>
        
        <p className="text-base sm:text-xl text-slate-500 dark:text-slate-400 mb-10 sm:mb-16 font-medium max-w-xl mx-auto leading-relaxed">
          O portal administrativo da DSGC está pronto para a sua supervisão técnico-geográfica.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
           <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-3xl shadow-sm">
              <Lock className="w-8 h-8 text-slate-300 dark:text-slate-700 mx-auto mb-4" />
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Criptografia</p>
              <p className="font-bold text-sm">AES-256 Ativa</p>
           </div>
           <div className="bg-emerald-600 p-8 rounded-3xl shadow-2xl shadow-emerald-500/20 text-white transform hover:scale-105 transition-transform duration-500">
              <User className="w-8 h-8 text-emerald-100/40 mx-auto mb-4" />
              <p className="text-[10px] font-black text-emerald-100/50 uppercase tracking-[0.2em] mb-1">Privilégios</p>
              <p className="font-bold text-sm">Administrador</p>
           </div>
           <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-3xl shadow-sm">
              <FileText className="w-8 h-8 text-slate-300 dark:text-slate-700 mx-auto mb-4" />
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Integridade</p>
              <p className="font-bold text-sm">Dados Verificados</p>
           </div>
        </div>

        <button 
          onClick={onEnter}
          className="group relative w-full sm:w-auto px-8 sm:px-12 py-5 sm:py-6 rounded-[2rem] bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black text-lg sm:text-xl shadow-2xl hover:shadow-emerald-500/20 transition-all duration-500 overflow-hidden active:scale-95"
        >
          <span className="relative z-10 flex items-center gap-4">
             Iniciar Dashboard
             <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform duration-500" />
          </span>
          <div className="absolute inset-0 bg-emerald-600 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
        </button>
      </motion.div>
      
      <div className="mt-14 sm:mt-24 space-y-2 opacity-40 group hover:opacity-100 transition-opacity">
        <p className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.4em]">
          MINISTÉRIO DAS INFRAESTRUTURAS E RECURSOS NATURAIS
        </p>
        <p className="text-[9px] font-bold text-slate-400 dark:text-slate-600 uppercase tracking-[0.2em]">
          República Democrática de São Tomé e Príncipe
        </p>
      </div>
    </div>
  );
}
