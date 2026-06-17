import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  Plus, 
  Briefcase, 
  User, 
  MapPin, 
  FileText, 
  CheckCircle2, 
  ArrowRight,
  ChevronRight,
  Info,
  Clock,
  IdCard,
  Phone,
  Mail,
  Users
} from 'lucide-react';
import { cn } from '../../lib/utils';

const SERVICE_TYPES = [
  { id: 'concessao', title: 'Concessão de Terreno', icon: MapPin, color: 'emerald', description: 'Atribuição de novos terrenos do estado' },
  { id: 'transpasse', title: 'Transpasse', icon: Briefcase, color: 'blue', description: 'Transferência de titularidade de propriedade' },
  { id: 'legalizacao', title: 'Legalização', icon: FileText, color: 'amber', description: 'Legalização de ocupações pre-existentes' },
  { id: 'certidao', title: 'Certidão de Registo', icon: IdCard, color: 'purple', description: 'Emissão de documento comprovativo de registo' },
];

const RECENT_UTENTES = [
  { id: '1', name: 'António dos Santos', nif: '123456789', phone: '9012345' },
  { id: '2', name: 'Maria da Silva Ramos', nif: '987654321', phone: '9056789' },
  { id: '3', name: 'João Batista', nif: '456123789', phone: '9022334' },
];

export function ServicesView() {
  const [step, setStep] = useState(1);
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewUtenteForm, setShowNewUtenteForm] = useState(false);

  const currentService = SERVICE_TYPES.find(s => s.id === selectedService);

  return (
    <div className="space-y-10 pb-20">
      <div>
        <h1 className="text-3xl sm:text-4xl font-display font-black tracking-tighter">Atendimento ao Cidadão</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">Registo presencial de pedidos e gestão de utentes.</p>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center gap-4 mb-8 overflow-x-auto pb-2 scrollbar-hide">
        {[
          { num: 1, label: 'Seleccionar Serviço' },
          { num: 2, label: 'Identificar Utente' },
          { num: 3, label: 'Detalhes do Pedido' },
          { num: 4, label: 'Confirmação' },
        ].map((s) => (
          <React.Fragment key={s.num}>
            <div className="flex items-center gap-3 shrink-0">
              <div className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center font-black transition-all duration-500",
                step >= s.num 
                  ? "premium-gradient text-white shadow-lg shadow-emerald-500/20" 
                  : "bg-slate-100 dark:bg-slate-800 text-slate-400"
              )}>
                {step > s.num ? <CheckCircle2 className="w-5 h-5" /> : s.num}
              </div>
              <span className={cn(
                "text-sm font-bold uppercase tracking-widest whitespace-nowrap",
                step >= s.num ? "text-slate-900 dark:text-white" : "text-slate-400"
              )}>
                {s.label}
              </span>
            </div>
            {s.num < 4 && <div className="w-8 h-[1px] bg-slate-200 dark:border-slate-800 shrink-0" />}
          </React.Fragment>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-8">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                {SERVICE_TYPES.map((service) => (
                  <button
                    key={service.id}
                    onClick={() => {
                      setSelectedService(service.id);
                      setStep(2);
                    }}
                    className={cn(
                      "group p-8 rounded-[2.5rem] bg-white dark:bg-slate-900 border text-left transition-all duration-500 hover:shadow-xl",
                      selectedService === service.id 
                        ? "border-emerald-500 ring-4 ring-emerald-500/10" 
                        : "border-slate-200 dark:border-slate-800 hover:border-emerald-500/50"
                    )}
                  >
                    <div className={cn(
                      "w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-colors duration-500",
                      service.color === 'emerald' ? "bg-emerald-500/10 text-emerald-500" :
                      service.color === 'blue' ? "bg-blue-500/10 text-blue-500" :
                      service.color === 'amber' ? "bg-amber-500/10 text-amber-500" :
                      "bg-purple-500/10 text-purple-500"
                    )}>
                      <service.icon className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-display font-black tracking-tight mb-2">{service.title}</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                      {service.description}
                    </p>
                    <div className="mt-6 flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-black text-xs uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                      Seleccionar <ArrowRight className="w-4 h-4" />
                    </div>
                  </button>
                ))}
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-[2.5rem] shadow-sm">
                  <h3 className="text-xl font-display font-black tracking-tight mb-6">Procurar Utente</h3>
                  <div className="relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                    <input 
                      type="text"
                      placeholder="Nome, NIF ou Telefone..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 font-medium transition-all"
                    />
                  </div>

                  <div className="mt-8 space-y-4">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4 px-2">Sugestões Recentes</p>
                    {RECENT_UTENTES.map((utente) => (
                      <button
                        key={utente.id}
                        onClick={() => setStep(3)}
                        className="w-full flex items-center justify-between p-5 rounded-2xl border border-slate-100 dark:border-slate-800/50 hover:border-emerald-500/50 hover:bg-emerald-500/5 transition-all group"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                            <User className="w-6 h-6 text-slate-400" />
                          </div>
                          <div className="text-left">
                            <p className="font-bold text-slate-900 dark:text-white">{utente.name}</p>
                            <p className="text-xs text-slate-500 font-medium">NIF: {utente.nif} • Tel: {utente.phone}</p>
                          </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-emerald-500 group-hover:translate-x-1 transition-all" />
                      </button>
                    ))}
                  </div>

                  <div className="mt-8 pt-8 border-t border-slate-100 dark:border-slate-800/50 flex justify-center">
                    <button 
                      onClick={() => setShowNewUtenteForm(true)}
                      className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold uppercase text-xs tracking-widest hover:scale-105 transition-transform"
                    >
                      <Plus className="w-4 h-4" /> registar Novo Utente
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-[2.5rem] shadow-sm">
                  <h3 className="text-xl font-display font-black tracking-tight mb-8">Informações Complementares</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-1">Localização Prevista</label>
                      <input type="text" className="w-full px-6 py-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 font-medium transition-all" placeholder="Ex: Bobô-Forro, Água Grande" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-1">Área Estimada (m²)</label>
                      <input type="number" className="w-full px-6 py-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 font-medium transition-all" placeholder="0.00" />
                    </div>
                    <div className="md:col-span-2 space-y-2">
                      <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-1">Notas Adicionais</label>
                      <textarea rows={4} className="w-full px-6 py-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 font-medium transition-all resize-none" placeholder="Observações do técnico sobre o pedido..." />
                    </div>
                  </div>

                  <div className="mt-10 flex flex-col-reverse sm:flex-row gap-4">
                    <button 
                      onClick={() => setStep(4)}
                      className="flex-1 premium-gradient text-white py-5 rounded-2xl font-bold text-lg shadow-xl shadow-emerald-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                    >
                      Submeter Pedido
                    </button>
                    <button 
                      onClick={() => setStep(2)}
                      className="px-8 py-5 rounded-2xl bg-slate-100 dark:bg-slate-800 font-bold text-slate-500 hover:bg-slate-200 transition-all"
                    >
                      Voltar
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-14 sm:py-20 px-5 sm:px-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] shadow-sm"
              >
                <div className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-emerald-500/30">
                  <CheckCircle2 className="w-12 h-12 text-white" />
                </div>
                <h2 className="text-3xl sm:text-4xl font-display font-black tracking-tight mb-4">Pedido Registado!</h2>
                <p className="text-base sm:text-xl text-slate-500 dark:text-slate-400 mb-10 max-w-lg mx-auto leading-relaxed">
                  O pedido foi inserido com sucesso no sistema. O utente receberá uma notificação via SMS com o número do processo.
                </p>
                <div className="bg-emerald-500/5 border border-emerald-500/20 p-8 rounded-3xl max-w-md mx-auto mb-12">
                   <p className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-600 mb-2">Referência do Processo</p>
                   <p className="text-3xl font-mono font-bold text-slate-900 dark:text-white">STP-2026-8842</p>
                </div>
                <button 
                  onClick={() => {
                    setStep(1);
                    setSelectedService(null);
                  }}
                  className="premium-gradient text-white w-full sm:w-auto px-10 py-5 rounded-2xl font-bold text-lg hover:scale-105 transition-transform shadow-lg shadow-emerald-500/20"
                >
                  Novo Atendimento
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Info Sidebar */}
        <div className="space-y-8">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-10 rounded-[2.5rem] relative overflow-hidden shadow-sm">
             <div className="relative z-10">
               <h3 className="font-display font-black text-2xl tracking-tight mb-6 text-slate-900 dark:text-white">Resumo em Tempo Real</h3>
               <div className="space-y-6">
                 <div className="flex gap-4">
                   <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 dark:bg-white/10 flex shrink-0 items-center justify-center">
                     <Clock className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                   </div>
                   <div>
                     <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Média de Espera</p>
                     <p className="text-lg font-bold text-slate-900 dark:text-white">14 Minutos</p>
                   </div>
                 </div>
                 <div className="flex gap-4">
                   <div className="w-12 h-12 rounded-2xl bg-blue-500/10 dark:bg-white/10 flex shrink-0 items-center justify-center">
                     <Users className="w-6 h-6 text-blue-500 dark:text-blue-400" />
                   </div>
                   <div>
                     <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Utentes em Fila</p>
                     <p className="text-lg font-bold text-slate-900 dark:text-white">4 Pessoas</p>
                   </div>
                 </div>
               </div>
             </div>
             <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 dark:bg-emerald-500/20 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2"></div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-[2.5rem] shadow-sm">
             <div className="flex items-center gap-3 mb-6">
               <Info className="w-5 h-5 text-emerald-500" />
               <h4 className="font-bold tracking-tight">Registo Requisitado</h4>
             </div>
             <p className="text-sm text-slate-500 leading-relaxed mb-6">
               Certifique-se de que o utente possui todos os documentos originais necessários para o serviço seleccionado.
             </p>
             <ul className="space-y-3">
               {[
                 'Cartão de Cidadão / BI',
                 'NIF (Número de Identificação Fiscal)',
                 'Croquis de Localização (se aplicável)',
                 'Comprovativo de Pagamento de Taxas',
               ].map((item, i) => (
                 <li key={i} className="flex items-center gap-3 text-xs font-bold text-slate-600 dark:text-slate-400">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                    {item}
                 </li>
               ))}
             </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
