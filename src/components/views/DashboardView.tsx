import { 
  Users, 
  Files, 
  MapPin, 
  CheckCircle2, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight,
  Clock
} from "lucide-react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from 'recharts';
import { motion } from 'motion/react';
import { cn } from '../../lib/utils';

const data = [
  { name: 'Jan', processos: 45, titulos: 24 },
  { name: 'Fev', processos: 52, titulos: 31 },
  { name: 'Mar', processos: 48, titulos: 35 },
  { name: 'Abr', processos: 61, titulos: 42 },
  { name: 'Mai', processos: 55, titulos: 48 },
  { name: 'Jun', processos: 67, titulos: 53 },
];

const stats = [
  { label: 'Processos Ativos', value: '1,284', icon: Files, change: '+12.5%', trend: 'up', color: 'emerald' },
  { label: 'Títulos Emitidos', value: '452', icon: CheckCircle2, change: '+8.2%', trend: 'up', color: 'blue' },
  { label: 'Levantamentos', value: '89', icon: MapPin, change: '-3.1%', trend: 'down', color: 'amber' },
  { label: 'Utilizadores', value: '24', icon: Users, change: '+2', trend: 'up', color: 'indigo' },
];

export function DashboardView() {
  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-4xl font-display font-black tracking-tighter">Dashboard Overview</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1.5 font-medium">Bem-vindo ao centro estratégico da Direção dos Serviços Geográficos e Cadastrais.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-7 rounded-[2rem] shadow-sm dark:shadow-none group relative overflow-hidden"
          >
            <div className="flex justify-between items-start relative z-10">
              <div className={cn(
                "p-3.5 rounded-2xl transition-all duration-500 group-hover:scale-110",
                stat.color === 'emerald' ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" :
                stat.color === 'blue' ? "bg-blue-500/10 text-blue-600 dark:text-blue-400" :
                stat.color === 'amber' ? "bg-amber-500/10 text-amber-600 dark:text-amber-400" :
                "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400"
              )}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div className={cn(
                "flex items-center gap-1 text-xs font-black px-2.5 py-1 rounded-full",
                stat.trend === 'up' ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" : "bg-red-500/10 text-red-600 dark:text-red-400"
              )}>
                {stat.change}
                {stat.trend === 'up' ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
              </div>
            </div>
            <div className="mt-6 relative z-10">
              <h3 className="text-4xl font-display font-black tracking-tight">{stat.value}</h3>
              <p className="text-slate-500 dark:text-slate-400 text-xs font-black uppercase tracking-[0.15em] mt-2 opacity-70">{stat.label}</p>
            </div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-slate-100/50 to-transparent dark:from-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-[2.5rem] shadow-sm">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h3 className="font-display font-black text-xl tracking-tight">Atividade Institucional</h3>
              <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-widest">Comparativo de Eficiência Semestral</p>
            </div>
            <div className="flex gap-6">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Processos</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]"></div>
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Títulos</span>
              </div>
            </div>
          </div>
          <div className="h-[380px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorProcessos" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#059669" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#059669" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorTitulos" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="6 6" vertical={false} stroke="#e2e8f0" className="dark:stroke-slate-800/50" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fontWeight: 800, fill: '#94a3b8' }} 
                  dy={15}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fontWeight: 800, fill: '#94a3b8' }} 
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'var(--tw-backgroundColor-slate-900)',
                    color: 'white',
                    borderRadius: '16px', 
                    border: 'none', 
                    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)',
                    padding: '12px'
                  }}
                  itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="processos" 
                  stroke="#059669" 
                  strokeWidth={4}
                  fillOpacity={1} 
                  fill="url(#colorProcessos)" 
                  animationDuration={2000}
                />
                <Area 
                  type="monotone" 
                  dataKey="titulos" 
                  stroke="#2563eb" 
                  strokeWidth={4}
                  fillOpacity={1} 
                  fill="url(#colorTitulos)" 
                  animationDuration={2000}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-[2.5rem] shadow-sm">
          <h3 className="font-display font-black text-xl tracking-tight mb-8">Fluxo de Sistema</h3>
          <div className="space-y-7">
            {[1, 2, 3, 4, 5].map((_, i) => (
              <div key={i} className="flex gap-5 group items-center">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800/80 flex shrink-0 items-center justify-center group-hover:bg-emerald-500/10 transition-all duration-500">
                  <Clock className="w-5.5 h-5.5 text-slate-400 group-hover:text-emerald-500 transition-colors" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-black truncate tracking-tight">Processo #STP-{202600 + i}</p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">Engr. Alberto Maria • {i * 15 + 5} min atrás</p>
                </div>
                <div className="w-2 h-2 rounded-full bg-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>
            ))}
          </div>
          <button className="w-full mt-10 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 text-xs font-black uppercase tracking-[0.2em] hover:bg-emerald-500 hover:text-white transition-all duration-500">
            Relatório de Atividade
          </button>
        </div>
      </div>
    </div>
  );
}
