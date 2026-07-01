import React, { useState } from "react";
import { Search, Filter, PieChart, Download, FileText, TrendingUp, AlertCircle, MapIcon, Layers, Hash, Activity } from "lucide-react";
import { motion } from "motion/react";
import { cn } from "../../lib/utils";

const MOCK_REPORTS = [
  { id: 'REP-2026-A1', type: 'Produtividade', desc: 'Resumo mensal de emissão de títulos por distrito.', date: '01 Jun 2026', status: 'ready', value: '+18%' },
  { id: 'REP-2026-A2', type: 'Auditoria Legal', desc: 'Verificação de conformidade topográfica e legal.', date: '15 Mai 2026', status: 'ready', value: '12 logs' },
  { id: 'REP-2026-A3', type: 'Arrecadação', desc: 'Emolumentos recolhidos no último trimestre fiscal.', date: '01 Mai 2026', status: 'pending', value: '€2.4M' },
  { id: 'REP-2026-B1', type: 'Gargalos Operacionais', desc: 'Tempo médio de espera em fase de medição in-loco.', date: '28 Abr 2026', status: 'ready', value: '14 Dias' },
];

export function ReportsView() {
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'card' | 'table'>('card');
  const [isMobile, setIsMobile] = useState(false);

  React.useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (mobile && viewMode !== 'card') {
        setViewMode('card');
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [viewMode]);

  const filteredReports = MOCK_REPORTS.filter(r => 
    r.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
    r.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.desc.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 relative pb-20">
      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-display font-black tracking-tighter">Relatórios e Métricas</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium">Métricas de produtividade, auditorias e emissões do SIG.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3 shrink-0">
           <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 font-bold text-xs uppercase tracking-wider bg-white dark:bg-slate-900 transition-all hover:bg-slate-50">
             <Download className="w-4 h-4" /> Exportar Dados
           </button>
           <div className={cn("bg-slate-100 dark:bg-slate-800 p-1 rounded-xl", isMobile ? "hidden" : "flex")}>
             <button 
               onClick={() => setViewMode('card')}
               title="Visualização em Cartões"
               className={cn("px-3.5 py-2.5 rounded-lg transition-all flex items-center gap-2 text-xs font-black uppercase tracking-wider", viewMode === 'card' ? "bg-white dark:bg-slate-700 shadow-sm text-emerald-600 dark:text-emerald-400" : "text-slate-400")}
             >
               <PieChart className="w-4 h-4" />
               <span>Cartões</span>
             </button>
             <button 
               onClick={() => setViewMode('table')}
               title="Visualização em Tabela"
               className={cn("px-3.5 py-2.5 rounded-lg transition-all flex items-center gap-2 text-xs font-black uppercase tracking-wider", viewMode === 'table' ? "bg-white dark:bg-slate-700 shadow-sm text-emerald-600 dark:text-emerald-400" : "text-slate-400")}
             >
               <Layers className="w-4 h-4" />
               <span>Lista</span>
             </button>
           </div>
        </div>
      </div>

      {/* OVERVIEW CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
        <div className="bg-emerald-50 dark:bg-emerald-500/5 p-8 rounded-[2rem] border border-emerald-500/20 flex items-center justify-between overflow-hidden relative">
          <div className="relative z-10 w-full">
             <div className="flex justify-between items-center w-full">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center">
                     <TrendingUp className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="font-display font-black text-xl text-emerald-950 dark:text-emerald-100">Eficiência Analítica</h3>
                    <p className="text-[10px] uppercase tracking-widest font-bold text-emerald-600/70 dark:text-emerald-400/70 mt-1">4.2 processos por dia / técnico</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-black tracking-widest text-emerald-600 uppercase">Meta Otingida</span>
                  <div className="text-3xl font-display font-black text-emerald-600 dark:text-emerald-400">85%</div>
                </div>
             </div>
             <div className="w-full bg-emerald-200/50 dark:bg-emerald-950/50 rounded-full h-3 mt-6 overflow-hidden">
               <motion.div initial={{ width: 0 }} animate={{ width: '85%' }} className="bg-emerald-500 h-full" />
             </div>
          </div>
        </div>
        
        <div className="bg-amber-50 dark:bg-amber-500/5 p-8 rounded-[2rem] border border-amber-500/20 flex items-center justify-between overflow-hidden relative">
          <div className="relative z-10 w-full">
             <div className="flex justify-between items-center w-full">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center">
                     <AlertCircle className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div>
                    <h3 className="font-display font-black text-xl text-amber-950 dark:text-amber-100">Auditorias Críticas</h3>
                    <p className="text-[10px] uppercase tracking-widest font-bold text-amber-600/70 dark:text-amber-400/70 mt-1">Logs de segurança do mês</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-black tracking-widest text-amber-600 uppercase">Alertas Activos</span>
                  <div className="text-3xl font-display font-black text-amber-600 dark:text-amber-400">12</div>
                </div>
             </div>
             <button className="w-full mt-6 py-3 rounded-2xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-400 font-bold text-xs uppercase tracking-wider transition-colors border border-amber-500/20">
               Examinar Registos
             </button>
          </div>
        </div>
      </div>

      {/* SEARCH BAR */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-3xl flex flex-wrap items-center justify-between gap-4 shadow-sm">
        <div className="relative flex-1 min-w-[300px]">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Pesquisar relatórios (Por Ref, nome)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-855 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500/50 transition-all font-medium"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-600 dark:hover:text-slate-250"
            >
              Limpar
            </button>
          )}
        </div>
        <div className="flex items-center gap-2.5">
          <button className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 hover:bg-slate-100 transition-all">
            <Filter className="w-4 h-4 text-slate-500" />
          </button>
        </div>
      </div>

      {/* REPORTS LIST */}
      {viewMode === 'card' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredReports.map((report, i) => (
            <motion.div
              key={report.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-[2rem] shadow-sm hover:shadow-md hover:border-emerald-500/30 transition-all duration-300 group cursor-pointer flex flex-col justify-between h-[280px]"
            >
              <div>
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center shrink-0">
                      <FileText className="w-6 h-6 text-indigo-500" />
                    </div>
                    <div>
                       <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">{report.id}</p>
                       <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">{report.type}</h3>
                    </div>
                  </div>
                  <div className={cn(
                    "px-2.5 py-1 rounded-md text-[9px] font-black uppercase tracking-widest shrink-0 border",
                    report.status === 'ready' ? "bg-emerald-50/50 dark:bg-emerald-500/10 text-emerald-600 border-emerald-500/20" : "bg-orange-50/50 dark:bg-orange-500/10 text-orange-600 border-orange-500/20"
                  )}>
                    {report.status === 'ready' ? 'Disponível' : 'Gerando...'}
                  </div>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-950/50 rounded-xl border border-slate-100 dark:border-slate-800/80 mb-4 h-20">
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400 line-clamp-2">{report.desc}</p>
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-5">
                 <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{report.date}</p>
                 <div className="flex items-center gap-3">
                    <span className="text-xs font-display font-black text-slate-700 dark:text-slate-200">{report.value}</span>
                    <button className="text-[10px] font-bold uppercase tracking-widest text-indigo-600 bg-indigo-50 dark:bg-indigo-500/10 px-3 py-1.5 rounded-lg border border-indigo-500/20">
                       Baixar
                    </button>
                 </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
         <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 rounded-[2.5rem] overflow-hidden shadow-sm p-4">
           <div className="overflow-x-auto">
             <table className="w-full text-left border-collapse">
               <thead className="bg-slate-50 dark:bg-slate-950 border-b border-slate-100 dark:border-slate-850">
                 <tr>
                   <th className="pl-6 pr-4 py-4 font-bold text-[10px] uppercase tracking-[0.2em] text-slate-400">Referência</th>
                   <th className="px-6 py-4 font-bold text-[10px] uppercase tracking-[0.2em] text-slate-400">Descrição e Foco</th>
                   <th className="px-6 py-4 font-bold text-[10px] uppercase tracking-[0.2em] text-slate-400 text-center">Estatística</th>
                   <th className="px-6 py-4 font-bold text-[10px] uppercase tracking-[0.2em] text-slate-400 text-center">Estado</th>
                   <th className="pr-6 pl-4 py-4 text-right font-bold text-[10px] uppercase tracking-[0.2em] text-slate-400">Ações</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                 {filteredReports.map((report) => (
                   <tr 
                     key={report.id} 
                     className="hover:bg-slate-50/80 dark:hover:bg-slate-950/60 transition-all cursor-pointer group"
                   >
                     <td className="pl-6 pr-4 py-5">
                       <div className="flex items-center gap-3">
                         <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-500 shrink-0">
                           <FileText className="w-5 h-5" />
                         </div>
                         <div className="min-w-0 flex-1">
                           <p className="font-bold text-sm tracking-tight text-slate-800 dark:text-slate-100 truncate">{report.type}</p>
                           <p className="text-[10px] font-semibold text-slate-450 opacity-70 uppercase tracking-widest mt-0.5">{report.id}</p>
                         </div>
                       </div>
                     </td>
                     <td className="px-6 py-5 w-[40%]">
                       <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">{report.desc}</span>
                     </td>
                     <td className="px-6 py-5 text-center">
                       <span className="text-sm font-display font-black text-slate-700 dark:text-slate-200">{report.value}</span>
                     </td>
                     <td className="px-6 py-5 text-center">
                       <div className={cn(
                         "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest border",
                         report.status === 'ready' ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 border-emerald-500/20" : "bg-orange-50 dark:bg-orange-500/10 text-orange-600 border-orange-500/20"
                       )}>
                         {report.status === 'ready' ? 'Disponível' : 'Gerando...'}
                       </div>
                     </td>
                     <td className="pr-6 pl-4 py-5 text-right">
                       <button className="text-[10px] font-bold uppercase tracking-wider text-slate-500 hover:text-indigo-600 transition-colors bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3.5 py-2 rounded-xl shadow-sm hover:border-indigo-500/30 flex items-center justify-end gap-2 ml-auto">
                         <Download className="w-3.5 h-3.5" /> Abrir
                       </button>
                     </td>
                   </tr>
                 ))}
               </tbody>
             </table>
           </div>
         </div>
      )}
    </div>
  );
}

