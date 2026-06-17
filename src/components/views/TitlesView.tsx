import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
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
  Hash,
  X,
  ChevronRight,
  ArrowLeft,
  Check,
  Shield,
  Building,
  Calendar,
  ExternalLink
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
  const navigate = useNavigate();
  const [filter, setFilter] = useState('all');
  const [showIssueModal, setShowIssueModal] = useState(false);
  const [issueStep, setIssueStep] = useState(1);
  const [selectedProcess, setSelectedProcess] = useState<string | null>(null);

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
          <button 
            onClick={() => { setShowIssueModal(true); setIssueStep(1); }}
            className="flex items-center gap-2 px-6 py-4 rounded-2xl premium-gradient text-white font-bold text-sm shadow-xl shadow-emerald-500/20 hover:scale-105 transition-all"
          >
            <Award className="w-4 h-4" /> Emitir Novo Título
          </button>
        </div>
      </div>

      {/* Issue New Title Modal */}
      <AnimatePresence>
        {showIssueModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 md:p-12">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" 
              onClick={() => setShowIssueModal(false)}
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white dark:bg-slate-900 rounded-[3rem] w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col md:flex-row h-[85vh] max-h-[800px]"
            >
              {/* Left Sidebar - Steps */}
              <div className="w-full md:w-80 bg-slate-50 dark:bg-slate-950 p-10 border-r border-slate-100 dark:border-slate-800 flex flex-col">
                <div className="mb-10">
                  <div className="w-12 h-12 rounded-2xl premium-gradient flex items-center justify-center text-white mb-4 shadow-lg shadow-emerald-500/20">
                    <Award className="w-6 h-6" />
                  </div>
                  <h2 className="text-2xl font-display font-black tracking-tight leading-tight">Emissão de Título</h2>
                </div>

                <div className="space-y-6 flex-1">
                  {[
                    { step: 1, label: "Seleção de Processo", icon: Search },
                    { step: 2, label: "Verificações Legais", icon: CheckCircle2 },
                    { step: 3, label: "Detalhes do Título", icon: FileCheck },
                    { step: 4, label: "Digitalização e Assinatura", icon: Award }
                  ].map((s) => (
                    <div key={s.step} className="flex items-center gap-4 group">
                      <div className={cn(
                        "w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-500",
                        issueStep === s.step ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20" : 
                        issueStep > s.step ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-500" :
                        "bg-white dark:bg-slate-800 text-slate-300 border border-slate-100 dark:border-slate-700"
                      )}>
                        {issueStep > s.step ? <Check className="w-5 h-5" /> : <s.icon className="w-5 h-5" />}
                      </div>
                      <div>
                        <p className={cn(
                          "text-[9px] font-black uppercase tracking-[0.2em]",
                          issueStep === s.step ? "text-emerald-500" : "text-slate-400"
                        )}>Passo {s.step}</p>
                        <p className={cn(
                          "text-sm font-bold tracking-tight",
                          issueStep === s.step ? "text-slate-900 dark:text-white" : "text-slate-400"
                        )}>{s.label}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <button 
                  onClick={() => setShowIssueModal(false)}
                  className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-red-500 transition-colors"
                >
                  <X className="w-4 h-4" /> Cancelar Operação
                </button>
              </div>

              {/* Main Content Area */}
              <div className="flex-1 flex flex-col bg-white dark:bg-slate-900">
                <div className="flex-1 overflow-y-auto p-10 md:p-16">
                  <AnimatePresence mode="wait">
                    {issueStep === 1 && (
                      <motion.div 
                        key="step1" 
                        initial={{ opacity: 0, x: 20 }} 
                        animate={{ opacity: 1, x: 0 }} 
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-8"
                      >
                        <div>
                          <h3 className="text-2xl font-display font-black tracking-tight mb-2">Vincular Processo Validado</h3>
                          <p className="text-slate-500 dark:text-slate-400 font-medium">Selecione um processo que já tenha passado pelas fases de delimitação e aprovação topográfica.</p>
                        </div>
                        
                        <div className="relative group">
                          <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                          <input 
                            type="text" 
                            placeholder="Pesquisar por ID, Requerente ou Localidade..."
                            className="w-full pl-16 pr-6 py-5 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-3xl text-sm font-bold focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all shadow-inner"
                          />
                        </div>

                        <div className="space-y-4">
                          {[
                            { id: 'STP-PROCESS-8842', name: 'João Manuel dos Santos', area: '1,245m²', location: 'Bairro do Hospital' },
                            { id: 'STP-PROCESS-8835', name: 'Maria da Graça', area: '850m²', location: 'Santana' },
                          ].map((p) => (
                            <button 
                              key={p.id}
                              onClick={() => setSelectedProcess(p.id)}
                              className={cn(
                                "w-full p-6 rounded-[2rem] border text-left transition-all flex items-center justify-between group",
                                selectedProcess === p.id 
                                  ? "border-emerald-500 bg-emerald-50/50 dark:bg-emerald-500/5 shadow-lg shadow-emerald-500/5" 
                                  : "border-slate-100 dark:border-slate-800 hover:border-emerald-500/30 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                              )}
                            >
                               <div className="flex items-center gap-6">
                                 <div className={cn(
                                   "w-12 h-12 rounded-xl flex items-center justify-center transition-colors",
                                   selectedProcess === p.id ? "bg-emerald-500 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-400"
                                 )}>
                                   <FileCheck className="w-6 h-6" />
                                 </div>
                                 <div className="space-y-0.5">
                                   <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{p.id}</p>
                                   <p className="font-display font-black text-lg tracking-tight group-hover:text-emerald-500 transition-colors">{p.name}</p>
                                   <div className="flex items-center gap-4 text-xs font-bold text-slate-500">
                                      <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {p.location}</span>
                                      <span className="flex items-center gap-1 text-emerald-500"><TrendingUp className="w-3 h-3" /> {p.area}</span>
                                   </div>
                                 </div>
                               </div>
                               {selectedProcess === p.id && <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-white shadow-lg"><Check className="w-5 h-5" /></div>}
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    )}

                    {issueStep === 2 && (
                       <motion.div 
                         key="step2" 
                         initial={{ opacity: 0, x: 20 }} 
                         animate={{ opacity: 1, x: 0 }} 
                         exit={{ opacity: 0, x: -20 }}
                         className="space-y-10"
                       >
                         <div>
                           <h3 className="text-2xl font-display font-black tracking-tight mb-2">Conformidade e Taxas</h3>
                           <p className="text-slate-500 dark:text-slate-400 font-medium">Verificação automatizada de pré-requisitos legais e financeiros.</p>
                         </div>

                         <div className="space-y-4">
                           {[
                             { label: "Planta de Delimitação Aprovada", status: "success", desc: "Coordenadas georeferenciadas validadas por topografia." },
                             { label: "Pagamento de Emolumentos", status: "success", desc: "Taxa de emissão (5.000 STN) confirmada via sistema bancário." },
                             { label: "Anuencia de Confrontantes", status: "success", desc: "Certificação de não-obstrução por vizinhos de parcela." },
                             { label: "Documentação de Identificação", status: "pending", desc: "BI/Cartão de Cidadão do requerente necessita de verificação final." },
                           ].map((check, i) => (
                             <div key={i} className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 flex items-start gap-4 transition-all">
                               <div className={cn(
                                 "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-1",
                                 check.status === 'success' ? "bg-emerald-500/10 text-emerald-500" : "bg-amber-500/10 text-amber-500"
                               )}>
                                 {check.status === 'success' ? <CheckCircle2 className="w-6 h-6" /> : <Clock className="w-6 h-6" />}
                               </div>
                               <div>
                                 <p className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                   {check.label}
                                   {check.status === 'success' && <span className="text-[10px] font-black uppercase text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full">Ok</span>}
                                 </p>
                                 <p className="text-sm text-slate-500 font-medium mt-1 uppercase tracking-tight">{check.desc}</p>
                               </div>
                             </div>
                           ))}
                         </div>
                       </motion.div>
                    )}

                    {issueStep === 3 && (
                      <motion.div 
                        key="step3" 
                        initial={{ opacity: 0, x: 20 }} 
                        animate={{ opacity: 1, x: 0 }} 
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-8"
                      >
                         <div>
                           <h3 className="text-2xl font-display font-black tracking-tight mb-2">Composição do Título</h3>
                           <p className="text-slate-500 dark:text-slate-400 font-medium">Dados finais que constarão no documento oficial.</p>
                         </div>

                         <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2">
                              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Referência Automática</label>
                              <div className="px-6 py-4 rounded-2xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-mono font-bold text-emerald-500">
                                TSTP-2026-REG-{(Math.floor(Math.random() * 9000) + 1000)}
                              </div>
                            </div>
                            <div className="space-y-2">
                              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Data de Emissão</label>
                              <div className="px-6 py-4 rounded-2xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-bold">
                                17 de Junho, 2026
                              </div>
                            </div>
                         </div>

                         <div className="space-y-6 pt-6 border-t border-slate-100 dark:border-slate-800">
                            <div className="space-y-4">
                              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Observações e Restrições de Uso</label>
                              <textarea 
                                className="w-full px-8 py-6 rounded-3xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 font-medium transition-all min-h-[150px] text-sm"
                                placeholder="Indique se existem restrições ambientais, servidões ou condições especiais..."
                              ></textarea>
                            </div>
                            
                            <div className="flex items-center gap-4 p-6 rounded-3xl border-2 border-dashed border-emerald-500/20 bg-emerald-500/[0.02]">
                              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                                <Shield className="w-6 h-6" />
                              </div>
                              <p className="text-xs font-bold text-slate-500 uppercase tracking-tight leading-relaxed">
                                Este título será vinculado à assinatura digital do Administrador da DSGC e fará fé pública perante todas as instâncias judiciais.
                              </p>
                            </div>
                         </div>
                      </motion.div>
                    )}

                    {issueStep === 4 && (
                       <motion.div 
                         key="step4" 
                         initial={{ opacity: 0, scale: 0.95 }} 
                         animate={{ opacity: 1, scale: 1 }} 
                         className="flex flex-col items-center justify-center text-center space-y-10 py-10"
                       >
                         <div className="relative">
                            <motion.div 
                              animate={{ scale: [1, 1.1, 1], rotate: [0, 360] }}
                              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                              className="absolute inset-0 bg-emerald-500/20 blur-[60px] rounded-full"
                            />
                            <div className="w-40 h-40 rounded-[3rem] premium-gradient text-white flex items-center justify-center shadow-2xl shadow-emerald-500/30 relative z-10">
                               <Award className="w-20 h-20" />
                            </div>
                         </div>

                         <div className="space-y-3">
                           <h3 className="text-4xl font-display font-black tracking-tight">Título Gerado com Sucesso</h3>
                           <p className="text-slate-500 dark:text-slate-400 font-medium max-w-sm mx-auto">
                             O título foi assinado digitalmente e está pronto para entrega física ou digital ao proprietário.
                           </p>
                         </div>

                         <div className="grid grid-cols-2 gap-4 w-full max-w-md">
                            <button className="flex items-center justify-center gap-3 py-5 rounded-2xl bg-slate-900 text-white font-black uppercase tracking-widest text-xs hover:scale-105 transition-all shadow-xl">
                               <Printer className="w-5 h-5" /> Imprimir
                            </button>
                            <button className="flex items-center justify-center gap-3 py-5 rounded-2xl bg-white border border-slate-200 text-slate-900 font-black uppercase tracking-widest text-xs hover:scale-105 transition-all shadow-sm">
                               <Download className="w-5 h-5" /> PDF Digital
                            </button>
                         </div>
                       </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Footer Actions */}
                {issueStep < 4 && (
                  <div className="p-10 md:px-16 md:py-10 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/30 dark:bg-black/10">
                    <button 
                      onClick={() => setIssueStep(s => Math.max(1, s - 1))}
                      disabled={issueStep === 1}
                      className={cn(
                        "flex items-center gap-2 text-xs font-black uppercase tracking-widest transition-all",
                        issueStep === 1 ? "opacity-0 invisible" : "text-slate-400 hover:text-slate-900 dark:hover:text-white"
                      )}
                    >
                      <ArrowLeft className="w-4 h-4" /> Anterior
                    </button>

                    <div className="flex gap-2">
                      {Array.from({ length: 3 }).map((_, i) => (
                        <div 
                          key={i} 
                          className={cn(
                            "h-1.5 rounded-full transition-all duration-500",
                            issueStep === i + 1 ? "w-8 bg-emerald-500" : "w-2 bg-slate-200 dark:bg-slate-700"
                          )}
                        />
                      ))}
                    </div>

                    <button 
                      onClick={() => setIssueStep(s => s + 1)}
                      disabled={issueStep === 1 && !selectedProcess}
                      className={cn(
                        "flex items-center gap-2 px-10 py-5 rounded-2xl font-black uppercase tracking-widest text-xs transition-all",
                        (issueStep === 1 && !selectedProcess) 
                          ? "bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed" 
                          : "premium-gradient text-white shadow-xl shadow-emerald-500/10 hover:scale-105 active:scale-95"
                      )}
                    >
                      {issueStep === 3 ? "Finalizar e Assinar" : "Próximo Passo"} <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
                
                {issueStep === 4 && (
                   <div className="p-10 md:px-16 md:py-10 border-t border-slate-100 dark:border-slate-800 flex justify-center bg-slate-50/30 dark:bg-black/10">
                      <button 
                        onClick={() => { setShowIssueModal(false); setIssueStep(1); setSelectedProcess(null); }}
                        className="px-12 py-5 rounded-2xl bg-emerald-500 text-white font-black uppercase tracking-widest text-xs hover:scale-105 transition-all shadow-2xl shadow-emerald-500/20"
                      >
                         Concluir e Voltar
                      </button>
                   </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

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
                    <tr 
                      key={title.id} 
                      onClick={() => navigate(`/titles/${title.id}`)}
                      className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors cursor-pointer"
                    >
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
                        <div className="flex justify-end gap-2">
                          <button 
                            onClick={(e) => { e.stopPropagation(); navigate(`/titles/${title.id}`); }}
                            className="p-2 hover:bg-emerald-500/10 rounded-lg transition-colors text-slate-400 hover:text-emerald-500"
                          >
                            <ExternalLink className="w-5 h-5" />
                          </button>
                          <button 
                            onClick={(e) => e.stopPropagation()}
                            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors text-slate-400 hover:text-slate-900 dark:hover:text-white"
                          >
                            <MoreVertical className="w-5 h-5" />
                          </button>
                        </div>
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
