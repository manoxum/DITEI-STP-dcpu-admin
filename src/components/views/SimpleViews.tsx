import { Users, UserPlus, Briefcase, PieChart, Download, FileText, TrendingUp, AlertCircle } from "lucide-react";
import { motion } from "motion/react";

export function ReportsView() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-display font-bold tracking-tight">Relatórios e Métricas</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Métricas de produtividade, auditorias e emissões.</p>
        </div>
        <div className="flex gap-3">
          <button className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 font-bold text-sm flex items-center gap-2">
            <Download className="w-4 h-4" />
            PDF
          </button>
          <button className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 font-bold text-sm flex items-center gap-2">
            <Download className="w-4 h-4" />
            Excel
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card p-8 rounded-3xl space-y-6">
           <div className="flex items-center gap-4">
             <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-emerald-500" />
             </div>
             <h3 className="font-display font-bold text-xl">Relatório de Produtividade</h3>
           </div>
           <p className="text-slate-500">Média de 4.2 processos despachados por dia por técnico no último mês.</p>
           <div className="space-y-3">
             <div className="flex justify-between text-sm font-bold">
               <span>Meta Mensal</span>
               <span className="text-emerald-500">85% Concluído</span>
             </div>
             <div className="h-3 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
               <motion.div initial={{ width: 0 }} animate={{ width: '85%' }} className="h-full bg-emerald-500" />
             </div>
           </div>
        </div>

        <div className="glass-card p-8 rounded-3xl space-y-6">
           <div className="flex items-center gap-4">
             <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-amber-500" />
             </div>
             <h3 className="font-display font-bold text-xl">Auditorias de Sistema</h3>
           </div>
           <p className="text-slate-500">Log de acessos e operações sensíveis efetuadas por utilizadores externos.</p>
           <button className="w-full py-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-bold text-sm hover:bg-slate-100 transition-colors">
             Ver Registos de Auditoria
           </button>
        </div>
      </div>
    </div>
  );
}

