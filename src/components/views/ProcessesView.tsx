import { LayoutGrid, List, Plus, Search, Filter, MoreHorizontal, Calendar, User, ArrowRight } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "../../lib/utils";

const PROCESSES = [
  { id: 'STP-001', applicant: 'João Manuel', type: 'Concessão', status: 'pending', date: '2026-06-15', urgent: true },
  { id: 'STP-002', applicant: 'Maria das Dores', type: 'Legalização', status: 'in_review', date: '2026-06-14', urgent: false },
  { id: 'STP-003', applicant: 'António Silva', type: 'Transpasse', status: 'approved', date: '2026-06-12', urgent: false },
  { id: 'STP-004', applicant: 'Construções STP Lda', type: 'Delimitação', status: 'pending', date: '2026-06-11', urgent: true },
  { id: 'STP-005', applicant: 'Isabel Rocha', type: 'Reclamação', status: 'in_review', date: '2026-06-10', urgent: false },
  { id: 'STP-006', applicant: 'Pedro Afonso', type: 'Concessão', status: 'rejected', date: '2026-06-08', urgent: false },
];

const COLUMNS = [
  { id: 'pending', label: 'Pendentes', color: 'amber' },
  { id: 'in_review', label: 'Em Revisão', color: 'blue' },
  { id: 'approved', label: 'Aprovados', color: 'emerald' },
  { id: 'rejected', label: 'Rejeitados', color: 'red' },
];

export function ProcessesView() {
  const [viewMode, setViewMode] = useState<'board' | 'list'>('board');

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold tracking-tight">Gestão de Processos</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Acompanhe e despache processos administrativos.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
            <button 
              onClick={() => setViewMode('board')}
              className={cn("p-2 rounded-md transition-all", viewMode === 'board' ? "bg-white dark:bg-slate-700 shadow-sm text-emerald-500" : "text-slate-400")}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setViewMode('list')}
              className={cn("p-2 rounded-md transition-all", viewMode === 'list' ? "bg-white dark:bg-slate-700 shadow-sm text-emerald-500" : "text-slate-400")}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
          <button className="premium-gradient text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-emerald-500/20 hover:opacity-90 transition-opacity">
            <Plus className="w-5 h-5" />
            Novo Processo
          </button>
        </div>
      </div>

      <div className="glass-card p-4 rounded-2xl flex flex-wrap items-center justify-between gap-4">
        <div className="relative flex-1 min-w-[280px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Pesquisar por ID, Requerente..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all"
          />
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 font-semibold text-sm transition-colors">
            <Filter className="w-4 h-4" />
            Filtrar
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 font-semibold text-sm transition-colors">
            <Calendar className="w-4 h-4" />
            Data
          </button>
        </div>
      </div>

      <div className="overflow-x-auto pb-4">
        {viewMode === 'board' ? (
          <div className="flex gap-6 min-w-[1000px]">
            {COLUMNS.map(column => (
              <div key={column.id} className="flex-1 space-y-4">
                <div className="flex items-center justify-between px-2">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-6 rounded-full bg-${column.color}-500`}></div>
                    <h3 className="font-display font-bold">{column.label}</h3>
                    <span className="bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full text-[10px] font-bold">
                      {PROCESSES.filter(p => p.status === column.id).length}
                    </span>
                  </div>
                  <button className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors">
                    <Plus className="w-4 h-4 text-slate-400" />
                  </button>
                </div>
                
                <div className="space-y-4 min-h-[500px]">
                  {PROCESSES.filter(p => p.status === column.id).map((process, i) => (
                    <ProcessCard key={process.id} process={process} index={i} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="glass-card rounded-2xl overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider text-slate-400">ID Processo</th>
                  <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider text-slate-400">Requerente</th>
                  <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider text-slate-400">Tipo</th>
                  <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider text-slate-400">Estado</th>
                  <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider text-slate-400">Data</th>
                  <th className="px-6 py-4 transition-all"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {PROCESSES.map((process, i) => (
                  <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors group">
                    <td className="px-6 py-4 font-bold text-sm">{process.id}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                          <User className="w-4 h-4 text-slate-400" />
                        </div>
                        <span className="font-semibold text-sm">{process.applicant}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-500 text-sm">{process.type}</td>
                    <td className="px-6 py-4">
                      <StatusBadge status={process.status} />
                    </td>
                    <td className="px-6 py-4 text-xs font-bold text-slate-400">{process.date}</td>
                    <td className="px-6 py-4 text-right">
                       <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
                         <MoreHorizontal className="w-5 h-5 text-slate-400" />
                       </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

interface ProcessCardProps {
  process: any;
  index: number;
  key?: string | number;
}

function ProcessCard({ process, index }: ProcessCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.05 }}
      className="glass-card p-4 rounded-xl shadow-sm hover:shadow-md hover:border-emerald-500/30 transition-all cursor-move group"
    >
      <div className="flex justify-between items-start mb-3">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">
          {process.id}
        </span>
        {process.urgent && (
          <span className="flex items-center gap-1 text-[10px] font-bold text-red-500 bg-red-500/10 px-2 py-0.5 rounded-full uppercase italic">
            Urgente
          </span>
        )}
      </div>
      
      <h4 className="font-bold text-slate-900 dark:text-white leading-tight mb-2">
        {process.applicant}
      </h4>
      <p className="text-xs text-slate-500 font-medium mb-4 flex items-center gap-1.5">
        <LayoutGrid className="w-3 h-3" />
        {process.type}
      </p>

      <div className="flex items-center justify-between pt-3 border-t border-slate-50 dark:border-slate-800">
        <div className="flex -space-x-2">
          {[1, 2].map(i => (
            <div key={i} className="w-6 h-6 rounded-full border-2 border-white dark:border-slate-900 bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
              <User className="w-3 h-3 text-slate-400" />
            </div>
          ))}
        </div>
        <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400">
          <Calendar className="w-3 h-3" />
          {new Date(process.date).toLocaleDateString()}
        </div>
      </div>
    </motion.div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles = {
    pending: 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400',
    in_review: 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400',
    approved: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400',
    rejected: 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400',
  };

  const labels = {
    pending: 'Pendente',
    in_review: 'Em Revisão',
    approved: 'Aprovado',
    rejected: 'Rejeitado',
  };

  return (
    <span className={cn("px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider", styles[status as keyof typeof styles])}>
      {labels[status as keyof typeof labels]}
    </span>
  );
}
