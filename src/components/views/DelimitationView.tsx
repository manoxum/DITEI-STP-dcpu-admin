import { 
  Map as MapIcon, 
  Layers, 
  MousePointer2, 
  Maximize2, 
  ZoomIn, 
  ZoomOut, 
  Info,
  Maximize,
  Navigation,
  Image as ImageIcon,
  Ruler,
  Save,
  CheckCircle2,
  AlertCircle,
  Search,
  Filter,
  ArrowLeft,
  ChevronRight,
  Clock,
  User,
  MapPin,
  Calendar
} from "lucide-react";
import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "../../lib/utils";

const DELIMITATION_PROCESSES = [
  { id: 'STP-PROCESS-8842', applicant: 'João Manuel dos Santos', location: 'Bairro do Hospital, Água Grande', date: '2026-06-16', area: '1,245m²', status: 'ready' },
  { id: 'STP-PROCESS-8835', applicant: 'Maria da Graça', location: 'Santana, Cantagalo', date: '2026-06-15', area: '850m²', status: 'ready' },
  { id: 'STP-PROCESS-8821', applicant: 'António Valdimir', location: 'Pantufo, Água Grande', date: '2026-06-14', area: '2,100m²', status: 'pending' },
  { id: 'STP-PROCESS-8812', applicant: 'Empresa Turística Lda', location: 'Porto Alegre, Caué', date: '2026-06-12', area: '15,500m²', status: 'ready' },
];

export function DelimitationView() {
  const [selectedProcess, setSelectedProcess] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const currentProcess = DELIMITATION_PROCESSES.find(p => p.id === selectedProcess);

  if (!selectedProcess) {
    return (
      <div className="space-y-10 pb-20">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-4xl font-display font-black tracking-tighter">Revisão e Delimitação</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">Fila de processos aguardando validação topográfica e delimitação.</p>
          </div>
          <div className="flex gap-3">
            <div className="relative group min-w-[300px]">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Pesquisar processos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500/50 transition-all font-medium"
              />
            </div>
            <button className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 transition-all">
              <Filter className="w-5 h-5 text-slate-500" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {DELIMITATION_PROCESSES.map((process, i) => (
            <motion.div
              key={process.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-[2.5rem] shadow-sm hover:shadow-xl hover:border-emerald-500/30 transition-all duration-500 flex flex-col"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center">
                  <MapIcon className="w-6 h-6 text-emerald-500" />
                </div>
                <div className={cn(
                  "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
                  process.status === 'ready' ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" : "bg-slate-100 dark:bg-slate-800 text-slate-400"
                )}>
                  {process.status === 'ready' ? 'Pronto para Delimitação' : 'Aguardando Medição'}
                </div>
              </div>

              <div className="mb-8">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">{process.id}</p>
                <h3 className="text-xl font-display font-black tracking-tight leading-tight">{process.applicant}</h3>
              </div>

              <div className="space-y-4 mb-8 flex-1">
                <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400">
                  <MapPin className="w-4 h-4 shrink-0" />
                  <span className="text-sm font-medium">{process.location}</span>
                </div>
                <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400">
                  <Maximize2 className="w-4 h-4 shrink-0" />
                  <span className="text-sm font-medium">{process.area}</span>
                </div>
                <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400">
                  <Calendar className="w-4 h-4 shrink-0" />
                  <span className="text-sm font-medium">Entrada: {process.date}</span>
                </div>
              </div>

              <button 
                onClick={() => setSelectedProcess(process.id)}
                disabled={process.status !== 'ready'}
                className={cn(
                  "w-full py-4 rounded-2xl font-bold text-sm tracking-widest uppercase transition-all flex items-center justify-center gap-2",
                  process.status === 'ready' 
                    ? "premium-gradient text-white shadow-lg shadow-emerald-500/20 hover:scale-105" 
                    : "bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed"
                )}
              >
                Iniciar Delimitação <ChevronRight className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <button 
            onClick={() => setSelectedProcess(null)}
            className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-emerald-500 transition-colors mb-4 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Voltar à Lista
          </button>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center">
               <MapIcon className="w-6 h-6 text-emerald-500" />
            </div>
            <div>
              <h1 className="text-3xl font-display font-black tracking-tight">{currentProcess?.id}</h1>
              <p className="text-slate-500 dark:text-slate-400 font-medium">Delimitação: {currentProcess?.applicant}</p>
            </div>
          </div>
        </div>
        <div className="flex gap-3">
          <button className="px-5 py-3 rounded-xl border border-slate-200 dark:border-slate-800 font-bold text-sm hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors flex items-center gap-2">
            <Save className="w-4 h-4" />
            Guardar Rascunho
          </button>
          <button className="premium-gradient text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-emerald-500/20 hover:opacity-90 transition-opacity">
            <CheckCircle2 className="w-5 h-5" />
            Aprovar Delimitação
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 space-y-6">
          {/* Map Interface */}
          <div className="glass-card rounded-[2.5rem] h-[600px] overflow-hidden relative border-none shadow-xl bg-slate-100 dark:bg-slate-950">
            {/* Mock Map Background (Satellite View) */}
            <div className="absolute inset-0 overflow-hidden">
               <div className="absolute inset-0 opacity-40 dark:opacity-40 bg-[url('https://images.unsplash.com/photo-1541462608141-ad6b3eb16995?auto=format&fit=crop&q=80&w=2000')] bg-cover bg-center"></div>
               <div className="absolute inset-0 bg-white/20 dark:bg-transparent"></div>
               <svg className="absolute inset-0 w-full h-full p-20" viewBox="0 0 1000 600">
                  <path 
                    d="M 200 100 L 400 50 L 600 150 L 550 350 L 250 400 Z" 
                    fill="rgba(16, 185, 129, 0.2)" 
                    stroke="#10b981" 
                    strokeWidth="3"
                    strokeDasharray="8 4"
                    className="animate-pulse"
                  />
                  <circle cx="200" cy="100" r="6" fill="white" stroke="#10b981" strokeWidth="2" />
                  <circle cx="400" cy="50" r="6" fill="white" stroke="#10b981" strokeWidth="2" />
                  <circle cx="600" cy="150" r="6" fill="white" stroke="#10b981" strokeWidth="2" />
                  <circle cx="550" cy="350" r="6" fill="white" stroke="#10b981" strokeWidth="2" />
                  <circle cx="250" cy="400" r="6" fill="white" stroke="#10b981" strokeWidth="2" />
                  
                  {/* Surrounding parcels */}
                  <path d="M 600 150 L 800 100 L 850 300 L 550 350 Z" fill="rgba(255, 255, 255, 0.05)" stroke="rgba(255, 255, 255,0.2)" strokeWidth="1" />
                  <path d="M 200 100 L 100 200 L 50 350 L 250 400 Z" fill="rgba(255, 255, 255, 0.05)" stroke="rgba(255, 255, 255,0.2)" strokeWidth="1" />
               </svg>
            </div>

            {/* Map Controls */}
            <div className="absolute top-8 left-8 space-y-2">
              <div className="bg-white/90 dark:bg-slate-900/80 backdrop-blur-md flex flex-col p-2 space-y-1 rounded-2xl shadow-2xl border border-slate-200 dark:border-white/10">
                <button className="p-3 hover:bg-slate-100 dark:hover:bg-white/10 rounded-xl text-slate-600 dark:text-white transition-colors"><ZoomIn className="w-5 h-5" /></button>
                <button className="p-3 hover:bg-slate-100 dark:hover:bg-white/10 rounded-xl text-slate-600 dark:text-white transition-colors"><ZoomOut className="w-5 h-5" /></button>
                <div className="h-[1px] bg-slate-200 dark:bg-white/10 mx-1"></div>
                <button className="p-3 hover:bg-slate-100 dark:hover:bg-white/10 rounded-xl text-slate-600 dark:text-white transition-colors"><Navigation className="w-5 h-5" /></button>
              </div>
            </div>

            <div className="absolute top-8 right-8">
              <div className="bg-white/90 dark:bg-slate-900/80 backdrop-blur-md flex items-center p-2 rounded-2xl shadow-2xl border border-slate-200 dark:border-white/10 overflow-hidden">
                <button className="px-4 py-2 flex items-center gap-2 text-xs font-black uppercase tracking-widest text-white bg-emerald-500 rounded-xl">
                  <ImageIcon className="w-4 h-4" />
                  Satélite
                </button>
                <button className="px-4 py-2 flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                  <MapIcon className="w-4 h-4" />
                  Híbrido
                </button>
              </div>
            </div>

            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
               <div className="bg-white/90 dark:bg-slate-900/80 backdrop-blur-md flex items-center p-2 rounded-[2rem] shadow-2xl border border-slate-200 dark:border-white/10 gap-1">
                  <button className="p-4 text-emerald-400 bg-emerald-500/10 rounded-2xl transition-all shadow-inner"><MousePointer2 className="w-6 h-6" /></button>
                  <button className="p-4 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all"><Ruler className="w-6 h-6" /></button>
                  <button className="p-4 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all"><Layers className="w-6 h-6" /></button>
                  <div className="w-[1px] h-10 bg-slate-200 dark:bg-white/10 mx-3"></div>
                   <button className="p-4 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all hover:scale-110"><PlusIcon className="w-6 h-6" /></button>
               </div>
            </div>

            <div className="absolute bottom-8 right-8 flex items-center gap-4">
               <div className="bg-white/90 dark:bg-slate-900/80 backdrop-blur-md px-6 py-3 rounded-2xl shadow-2xl border border-slate-200 dark:border-white/10">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Escala</p>
                  <p className="text-sm font-display font-black text-slate-900 dark:text-white">1 : 2,500</p>
               </div>
               <div className="bg-white/90 dark:bg-slate-900/80 backdrop-blur-md px-6 py-3 rounded-2xl shadow-2xl border border-slate-200 dark:border-white/10">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Coordenadas</p>
                  <p className="text-sm font-mono font-bold text-slate-900 dark:text-white animate-pulse">0° 20' 11" N | 6° 44' 02" E</p>
               </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-[2.5rem] flex items-center gap-5">
              <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center">
                <Maximize2 className="w-7 h-7 text-blue-500" />
              </div>
              <div>
                <p className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Área Total</p>
                <p className="text-2xl font-display font-black tracking-tight">{currentProcess?.area || '1,245.50 m²'}</p>
              </div>
            </div>
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-[2.5rem] flex items-center gap-5">
              <div className="w-14 h-14 rounded-2xl bg-purple-500/10 flex items-center justify-center">
                <AlertCircle className="w-7 h-7 text-purple-500" />
              </div>
              <div>
                <p className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Sobreposições</p>
                <p className="text-2xl font-display font-black tracking-tight">0 Detetadas</p>
              </div>
            </div>
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-[2.5rem] flex items-center gap-5">
              <div className="w-14 h-14 rounded-2xl bg-orange-500/10 flex items-center justify-center">
                <Info className="w-7 h-7 text-orange-500" />
              </div>
              <div>
                <p className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Tipo Solo</p>
                <p className="text-2xl font-display font-black tracking-tight">Urbano Consolidado</p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-[2.5rem] space-y-8 shadow-sm">
            <h3 className="font-display font-black text-xl tracking-tight">Informações da Parcela</h3>
            
            <div className="space-y-4">
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800/50 space-y-1.5 transition-all">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] leading-none">Distrito</p>
                <p className="font-bold">Água Grande</p>
              </div>
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800/50 space-y-1.5 transition-all">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] leading-none">Localidade</p>
                <p className="font-bold">Bairro do Hospital</p>
              </div>
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800/50 space-y-1.5 transition-all">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] leading-none">Requerente</p>
                <p className="font-bold">{currentProcess?.applicant || 'João Manuel dos Santos'}</p>
              </div>
            </div>

            <div className="pt-8 border-t border-slate-100 dark:border-slate-800">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6">Fotos e Instrumentos</h4>
              <div className="grid grid-cols-2 gap-4">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="aspect-square rounded-2xl bg-slate-100 dark:bg-slate-800 overflow-hidden relative group cursor-pointer shadow-sm">
                    <img 
                      src={`https://images.unsplash.com/photo-1590247813693-5541d1c609fd?auto=format&fit=crop&q=80&w=400&h=400&sig=${i}`} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-emerald-500/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                      <Maximize className="w-6 h-6 text-white" />
                    </div>
                  </div>
                ))}
              </div>
               <button className="w-full mt-6 py-4 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 text-xs font-black uppercase tracking-widest text-slate-400 hover:border-emerald-500/50 hover:text-emerald-500 transition-all flex items-center justify-center gap-2">
                 <PlusIcon className="w-4 h-4" />
                 Carregar Instrumentos
               </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PlusIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  );
}
