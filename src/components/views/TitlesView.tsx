import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  FileCheck, 
  Search, 
  Filter, 
  Download, 
  Printer, 
  MoreVertical, 
  CheckCircle2, 
  AlertCircle, 
  Clock,
  MapPin,
  TrendingUp,
  Award,
  Hash
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip as RechartsTooltip 
} from 'recharts';

const TITLES_DATA = [
  { id: 'TIT-STP-2026-001', utente: 'António dos Santos', area: '1,200m²', status: 'issued', date: '15 Mai 2026', location: 'Pantufo, Água Grande' },
  { id: 'TIT-STP-2026-002', utente: 'Maria da Silva', area: '850m²', status: 'pending', date: '12 Mai 2026', location: 'Trindade, Mé-Zóchi' },
  { id: 'TIT-STP-2026-003', utente: 'Companhia de Investimento Lda', area: '15,000m²', status: 'review', date: '10 Mai 2026', location: 'Neves, Lembá' },
  { id: 'TIT-STP-2026-004', utente: 'João Batista', area: '450m²', status: 'issued', date: '08 Mai 2026', location: 'Santana, Cantagalo' },
  { id: 'TIT-STP-2026-005', utente: 'Elena Rodrigues', area: '900m²', status: 'issued', date: '05 Mai 2026', location: 'Guadalupe, Lobata' },
];

const STATS = [
  { label: 'Títulos Emitidos', value: '452', icon: FileCheck, color: 'emerald' },
  { label: 'Em Processamento', value: '128', icon: Clock, color: 'blue' },
  { label: 'Sob Revisão Técnica', value: '12', icon: AlertCircle, color: 'amber' },
];

const CHART_DATA = [
  { name: 'Habitacional', value: 65, color: '#10b981' },
  { name: 'Comercial', value: 20, color: '#3b82f6' },
  { name: 'Industrial', value: 10, color: '#6366f1' },
  { name: 'Agrícola', value: 5, color: '#f59e0b' },
];

export function TitlesView() {
  const [filter, setFilter] = useState('all');

  return (
    <div className="space-y-10 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-display font-black tracking-tighter">Análise e Emissão de Títulos</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">Controlo de titularidade e registo oficial de propriedade.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-6 py-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-bold text-sm hover:bg-slate-50 transition-all">
            <Download className="w-4 h-4" /> Exportar Lista
          </button>
          <button className="flex items-center gap-2 px-6 py-4 rounded-2xl premium-gradient text-white font-bold text-sm shadow-xl shadow-emerald-500/20 hover:scale-105 transition-all">
            <Award className="w-4 h-4" /> Emitir Novo Título
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {STATS.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-[2.5rem] shadow-sm relative overflow-hidden group"
          >
            <div className="flex justify-between items-start relative z-10">
              <div className={cn(
                "w-14 h-14 rounded-2xl flex items-center justify-center transition-transform duration-500 group-hover:scale-110",
                stat.color === 'emerald' ? "bg-emerald-500/10 text-emerald-500" :
                stat.color === 'blue' ? "bg-blue-500/10 text-blue-500" :
                "bg-amber-500/10 text-amber-500"
              )}>
                <stat.icon className="w-8 h-8" />
              </div>
              <div className="w-2 h-2 rounded-full bg-slate-200 dark:bg-slate-800"></div>
            </div>
            <div className="mt-6 relative z-10">
              <h3 className="text-4xl font-display font-black tracking-tight">{stat.value}</h3>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 mt-2">{stat.label}</p>
            </div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-slate-100 dark:from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
        <div className="xl:col-span-3 space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-[2.5rem] shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
              <div className="relative group flex-1 max-w-md">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Pesquisar por Título # ou Nome..."
                  className="w-full pl-10 pr-4 py-3 bg-slate-50/50 dark:bg-slate-950/50 border border-slate-100 dark:border-slate-800 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500/50 transition-all"
                />
              </div>
              <div className="flex gap-2 p-1.5 bg-slate-100 dark:bg-slate-800 rounded-2xl">
                {['all', 'issued', 'pending', 'review'].map((t) => (
                  <button 
                    key={t}
                    onClick={() => setFilter(t)}
                    className={cn(
                      "px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all",
                      filter === t 
                        ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm" 
                        : "text-slate-500 hover:text-slate-700"
                    )}
                  >
                    {t === 'all' ? 'Todos' : t === 'issued' ? 'Emitidos' : t === 'pending' ? 'Pendentes' : 'Revisão'}
                  </button>
                ))}
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-50 dark:border-slate-800">
                    <th className="pb-6 text-left px-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Referência</th>
                    <th className="pb-6 text-left px-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Titular</th>
                    <th className="pb-6 text-left px-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Localização</th>
                    <th className="pb-6 text-left px-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Status</th>
                    <th className="pb-6 text-right px-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Acções</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                  {TITLES_DATA.map((title) => (
                    <tr key={title.id} className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                      <td className="py-6 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center group-hover:bg-emerald-500/10 transition-colors">
                            <Hash className="w-5 h-5 text-slate-400 group-hover:text-emerald-500 transition-colors" />
                          </div>
                          <div>
                            <p className="text-sm font-black tracking-tight">{title.id}</p>
                            <p className="text-[10px] font-bold text-slate-400 uppercase mt-0.5">{title.area}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-6 px-4">
                        <p className="text-sm font-bold text-slate-900 dark:text-white">{title.utente}</p>
                        <p className="text-[10px] font-medium text-slate-500 mt-0.5">{title.date}</p>
                      </td>
                      <td className="py-6 px-4">
                        <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                          <MapPin className="w-3.5 h-3.5" />
                          <span className="text-xs font-medium">{title.location}</span>
                        </div>
                      </td>
                      <td className="py-6 px-4">
                         <div className={cn(
                           "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest",
                           title.status === 'issued' ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" :
                           title.status === 'pending' ? "bg-blue-500/10 text-blue-600 dark:text-blue-400" :
                           "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                         )}>
                           {title.status === 'issued' ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                           {title.status === 'issued' ? 'Emitido' : title.status === 'pending' ? 'Pendente' : 'Revisão'}
                         </div>
                      </td>
                      <td className="py-6 px-4 text-right">
                        <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors text-slate-400 hover:text-slate-900 dark:hover:text-white">
                          <MoreVertical className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="space-y-8">
           <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-[2.5rem] shadow-sm">
             <h3 className="font-display font-black text-xl tracking-tight mb-8">Tipologia de Uso</h3>
             <div className="h-[250px] w-full">
               <ResponsiveContainer width="100%" height="100%">
                 <PieChart>
                   <Pie
                     data={CHART_DATA}
                     cx="50%"
                     cy="50%"
                     innerRadius={60}
                     outerRadius={80}
                     paddingAngle={5}
                     dataKey="value"
                   >
                     {CHART_DATA.map((entry, index) => (
                       <Cell key={`cell-${index}`} fill={entry.color} />
                     ))}
                   </Pie>
                   <RechartsTooltip />
                 </PieChart>
               </ResponsiveContainer>
             </div>
             <div className="grid grid-cols-2 gap-4 mt-8">
                {CHART_DATA.map((item, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">{item.name}</span>
                  </div>
                ))}
             </div>
           </div>

           <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white relative overflow-hidden">
             <div className="relative z-10">
               <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mb-6">
                 <TrendingUp className="w-6 h-6 text-emerald-400" />
               </div>
               <h4 className="font-display font-black text-2xl tracking-tight mb-2">+15,8%</h4>
               <p className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-relaxed">
                 Aumento na eficiência de emissão comparado ao semestre anterior.
               </p>
             </div>
             <div className="absolute bottom-0 right-0 w-32 h-32 bg-emerald-500/20 rounded-full blur-[60px] translate-y-1/2 translate-x-1/2"></div>
           </div>
        </div>
      </div>
    </div>
  );
}
