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
  Target,
  Layers,
  Scale,
  Map,
  SplitSquareHorizontal,
  FolderSync,
  AlertTriangle,
  FileSignature,
  Users
} from 'lucide-react';
import { cn } from '../../lib/utils';

const SERVICE_CATEGORIES = [
  {
    category: 'Cadastro e Estruturação Fundiária',
    services: [
      { id: 'rgg', title: 'Representação Gráfica (RGG)', icon: Target, color: 'emerald', description: 'Identificação georreferenciada de limites de propriedade' },
      { id: 'destaque', title: 'Destaque / Emparcelamento', icon: SplitSquareHorizontal, color: 'purple', description: 'Divisão, fusão ou fracionamento de parcelas' },
      { id: 'demarcacao', title: 'Retificação de Estremas', icon: Layers, color: 'amber', description: 'Ajuste de áreas e correção de limites cadastrais' },
    ]
  },
  {
    category: 'Acesso a Dados Geográficos',
    services: [
      { id: 'certidao', title: 'Certidão Cadastral', icon: IdCard, color: 'blue', description: 'Emissão de documento comprovativo com valor legal' },
      { id: 'plantas', title: 'Emissão de Plantas e Cartas', icon: Map, color: 'indigo', description: 'Requisição de cartografia e fotografia aérea' },
    ]
  },
  {
    category: 'Titulação e Direitos Fundiários',
    services: [
      { id: 'concessao', title: 'Concessão de Terreno', icon: MapPin, color: 'emerald', description: 'Atribuição de novos terrenos pertencentes ao estado' },
      { id: 'transpasse', title: 'Transpasse / Averbamento', icon: FolderSync, color: 'sky', description: 'Transferência de titularidade e atualização de dados' },
      { id: 'legalizacao', title: 'Legalização de Posse', icon: FileSignature, color: 'teal', description: 'Regularização jurídica de ocupações pré-existentes' },
    ]
  },
  {
    category: 'Fiscalização e Peritagem',
    services: [
      { id: 'litigio', title: 'Resolução de Conflitos', icon: Scale, color: 'rose', description: 'Mediação do DSGC para sobreposições de polígonos' },
      { id: 'vistoria', title: 'Vistorias e Avaliações', icon: AlertTriangle, color: 'orange', description: 'Peritagem técnica ao local para avaliação' },
    ]
  }
];

const RECENT_UTENTES = [
  { id: '1', name: 'António dos Santos', nif: '123456789', phone: '9012345' },
  { id: '2', name: 'Maria da Silva Ramos', nif: '987654321', phone: '9056789' },
  { id: '3', name: 'João Batista', nif: '456123789', phone: '9022334' },
];

// Helper to find a specific service object when we only have the ID
const findServiceById = (id: string | null) => {
  if (!id) return null;
  for (const cat of SERVICE_CATEGORIES) {
    const s = cat.services.find(serv => serv.id === id);
    if (s) return s;
  }
  return null;
};

export function ServicesView() {
  const [step, setStep] = useState(1);
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewUtenteForm, setShowNewUtenteForm] = useState(false);

  const currentService = findServiceById(selectedService);

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
                className="space-y-10"
              >
                {SERVICE_CATEGORIES.map((category) => (
                  <div key={category.category} className="space-y-4">
                    <h2 className="text-lg font-black uppercase tracking-widest text-slate-400 pl-2">
                      {category.category}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                      {category.services.map((service) => (
                        <button
                          key={service.id}
                          onClick={() => {
                            setSelectedService(service.id);
                            setStep(2);
                          }}
                          className={cn(
                            "group p-6 rounded-[2rem] bg-white dark:bg-slate-900 border text-left transition-all duration-300 hover:shadow-xl flex flex-col justify-between",
                            selectedService === service.id 
                              ? "border-emerald-500 ring-4 ring-emerald-500/10" 
                              : "border-slate-200 dark:border-slate-800 hover:border-emerald-500/50"
                          )}
                        >
                          <div>
                            <div className={cn(
                              "w-12 h-12 rounded-xl flex items-center justify-center mb-5 transition-colors duration-500 shrink-0",
                              service.color === 'emerald' ? "bg-emerald-500/10 text-emerald-500" :
                              service.color === 'blue' ? "bg-blue-500/10 text-blue-500" :
                              service.color === 'amber' ? "bg-amber-500/10 text-amber-500" :
                              service.color === 'purple' ? "bg-purple-500/10 text-purple-500" :
                              service.color === 'indigo' ? "bg-indigo-500/10 text-indigo-500" :
                              service.color === 'sky' ? "bg-sky-500/10 text-sky-500" :
                              service.color === 'teal' ? "bg-teal-500/10 text-teal-500" :
                              service.color === 'rose' ? "bg-rose-500/10 text-rose-500" :
                              service.color === 'orange' ? "bg-orange-500/10 text-orange-500" :
                              "bg-slate-500/10 text-slate-500"
                            )}>
                              <service.icon className="w-6 h-6" />
                            </div>
                            <h3 className="text-[1.1rem] leading-tight font-display font-black tracking-tight mb-2 pr-2">{service.title}</h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                              {service.description}
                            </p>
                          </div>
                          <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-850 flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-black text-[10px] uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                            Seleccionar <ArrowRight className="w-3.5 h-3.5" />
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
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
                  <div className="flex items-center gap-4 mb-8 pb-8 border-b border-slate-100 dark:border-slate-800">
                    <div className={cn(
                      "w-12 h-12 rounded-xl flex items-center justify-center shrink-0",
                      currentService?.color === 'emerald' ? "bg-emerald-500/10 text-emerald-500" :
                      currentService?.color === 'purple' ? "bg-purple-500/10 text-purple-500" :
                      currentService?.color === 'amber' ? "bg-amber-500/10 text-amber-500" :
                      currentService?.color === 'blue' ? "bg-blue-500/10 text-blue-500" :
                      currentService?.color === 'indigo' ? "bg-indigo-500/10 text-indigo-500" :
                      currentService?.color === 'sky' ? "bg-sky-500/10 text-sky-500" :
                      currentService?.color === 'teal' ? "bg-teal-500/10 text-teal-500" :
                      currentService?.color === 'rose' ? "bg-rose-500/10 text-rose-500" :
                      currentService?.color === 'orange' ? "bg-orange-500/10 text-orange-500" :
                      "bg-slate-500/10 text-slate-500"
                    )}>
                      {currentService && <currentService.icon className="w-6 h-6" />}
                    </div>
                    <div>
                      <h3 className="text-xl font-display font-black tracking-tight">{currentService?.title}</h3>
                      <p className="text-sm font-semibold text-slate-500">Informações Complementares e Formulário Específico</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Campos comuns */}
                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-1">Localização Principal</label>
                      <input type="text" className="w-full px-6 py-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 font-medium transition-all" placeholder="Distrito, Concelho ou Referência" />
                    </div>

                    {/* Campos Contextuais Baseados no Serviço */}
                    {selectedService === 'rgg' && (
                      <>
                        <div className="space-y-2">
                          <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-1">Área Estimada Declarada (m²)</label>
                          <input type="number" className="w-full px-6 py-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 font-medium transition-all" placeholder="0.00" />
                        </div>
                        <div className="md:col-span-2 space-y-2">
                          <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-1">Carregar Croqui / Levantamento Prévio</label>
                          <div className="w-full h-32 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col items-center justify-center text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900/50 cursor-pointer transition-colors">
                            <Map className="w-8 h-8 mb-2 opacity-50" />
                            <span className="text-sm font-semibold">Anexar ficheiro KML, KMZ ou PDF</span>
                          </div>
                        </div>
                      </>
                    )}

                    {selectedService === 'destaque' && (
                      <>
                        <div className="space-y-2">
                          <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-1">Processo Cadastral Mãe</label>
                          <input type="text" className="w-full px-6 py-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 font-medium transition-all" placeholder="Ex: N.º do Processo Original" />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                          <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-1">Tipo de Operação</label>
                          <div className="flex gap-4">
                            <label className="flex-1 flex items-center gap-3 p-4 border border-slate-200 dark:border-slate-800 rounded-2xl cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900">
                              <input type="radio" name="op_type" className="w-4 h-4 text-emerald-500" />
                              <span className="font-semibold text-sm">Destaque (Subdivisão)</span>
                            </label>
                            <label className="flex-1 flex items-center gap-3 p-4 border border-slate-200 dark:border-slate-800 rounded-2xl cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900">
                              <input type="radio" name="op_type" className="w-4 h-4 text-emerald-500" />
                              <span className="font-semibold text-sm">Emparcelamento (Fusão)</span>
                            </label>
                          </div>
                        </div>
                      </>
                    )}

                    {selectedService === 'demarcacao' && (
                      <>
                        <div className="space-y-2">
                          <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-1">Área Original Registada</label>
                          <input type="text" className="w-full px-6 py-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 font-medium transition-all" placeholder="m² ou ha" />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                          <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-1">Motivo da Retificação</label>
                          <textarea rows={3} className="w-full px-6 py-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 resize-none font-medium transition-all" placeholder="Justificação para alteração dos limites..." />
                        </div>
                      </>
                    )}

                    {selectedService === 'certidao' && (
                      <>
                        <div className="space-y-2">
                          <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-1">Número de Matriz (Opcional)</label>
                          <input type="text" className="w-full px-6 py-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 font-medium transition-all" placeholder="N.º Matricial" />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                          <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-1">Finalidade da Certidão</label>
                          <select className="w-full px-6 py-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 font-medium transition-all appearance-none cursor-pointer">
                            <option>Registo Notarial (Venda / Compra)</option>
                            <option>Herança / Sucessão</option>
                            <option>Crédito Bancário</option>
                            <option>Licenciamento Camarário</option>
                            <option>Outro</option>
                          </select>
                        </div>
                      </>
                    )}

                    {selectedService === 'plantas' && (
                      <>
                        <div className="space-y-2">
                          <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-1">Formato Pretendido</label>
                          <select className="w-full px-6 py-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 font-medium transition-all appearance-none cursor-pointer">
                            <option>PDF (Impressão)</option>
                            <option>DWG / DXF (AutoCAD)</option>
                            <option>Shapefile (SIG)</option>
                            <option>KML / KMZ (Google Earth)</option>
                          </select>
                        </div>
                        <div className="space-y-2 md:col-span-2">
                          <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-1">Escala / Nível de Detalhe</label>
                          <select className="w-full px-6 py-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 font-medium transition-all appearance-none cursor-pointer">
                            <option>Automático (Ajustar ao Polígono)</option>
                            <option>1:1.000</option>
                            <option>1:2.000</option>
                            <option>1:5.000</option>
                            <option>1:10.000</option>
                          </select>
                        </div>
                      </>
                    )}

                    {selectedService === 'concessao' && (
                      <>
                        <div className="space-y-2">
                          <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-1">Uso Pretendido</label>
                          <select className="w-full px-6 py-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 font-medium transition-all appearance-none cursor-pointer">
                            <option>Projetos Agrícolas / Pecuária</option>
                            <option>Construção Habitacional</option>
                            <option>Desenvolvimento Turístico</option>
                            <option>Fins Industriais / Comerciais</option>
                          </select>
                        </div>
                        <div className="space-y-2 md:col-span-2">
                          <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-1">Anexo: Plano e Viabilidade do Projeto</label>
                          <div className="w-full h-32 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col items-center justify-center text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900/50 cursor-pointer transition-colors">
                            <FileSignature className="w-8 h-8 mb-2 opacity-50" />
                            <span className="text-sm font-semibold">Anexar Memória Descritiva (PDF/DOC)</span>
                          </div>
                        </div>
                      </>
                    )}

                    {selectedService === 'transpasse' && (
                      <>
                        <div className="space-y-2">
                          <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-1">Processo de Origem</label>
                          <input type="text" className="w-full px-6 py-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 font-medium transition-all" placeholder="N.º Processo Original" />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                          <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-1">Motivo / Título Aquisitivo</label>
                          <select className="w-full px-6 py-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 font-medium transition-all appearance-none cursor-pointer">
                            <option>Compra e Venda</option>
                            <option>Doação</option>
                            <option>Herança / Partilhas</option>
                            <option>Arrendamento Longo Prazo</option>
                          </select>
                        </div>
                      </>
                    )}

                    {selectedService === 'legalizacao' && (
                      <>
                        <div className="space-y-2">
                          <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-1">Anos de Ocupação Declarados</label>
                          <input type="number" className="w-full px-6 py-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 font-medium transition-all" placeholder="Anos" />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                          <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-1">Declarações de Confrontantes</label>
                          <div className="w-full p-4 border border-slate-200 dark:border-slate-800 rounded-2xl flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <Users className="w-6 h-6 text-slate-400" />
                              <div>
                                <p className="font-semibold text-sm">Anexos de Declaração de Extremantes</p>
                                <p className="text-xs text-slate-500">Documentos assinados pelas propriedades vizinhas</p>
                              </div>
                            </div>
                            <button className="text-xs font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-3 py-1.5 rounded-lg">Carregar</button>
                          </div>
                        </div>
                      </>
                    )}

                    {selectedService === 'litigio' && (
                      <>
                        <div className="space-y-2">
                          <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-1">Processos ou Polígonos Envolvidos</label>
                          <input type="text" className="w-full px-6 py-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 font-medium transition-all" placeholder="N.ºs Processo em conflito" />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                          <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-1">Descrição Breve do Conflito</label>
                          <textarea rows={3} className="w-full px-6 py-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 resize-none font-medium transition-all" placeholder="Sobreposição de áreas, disputa de marcos..." />
                        </div>
                      </>
                    )}

                    {selectedService === 'vistoria' && (
                      <>
                        <div className="space-y-2">
                          <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-1">Data Provável da Vistoria (Pretendida)</label>
                          <input type="date" className="w-full px-6 py-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 font-medium transition-all" />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                          <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-1">Urgência do Pedido</label>
                          <div className="flex gap-4">
                            <label className="flex-1 flex items-center gap-3 p-4 border border-slate-200 dark:border-slate-800 rounded-2xl cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900">
                              <input type="radio" name="urgency" className="w-4 h-4 text-emerald-500" />
                              <span className="font-semibold text-sm text-slate-700 dark:text-slate-300">Normal</span>
                            </label>
                            <label className="flex-1 flex items-center gap-3 p-4 border border-amber-200/50 dark:border-amber-500/20 bg-amber-50/30 dark:bg-amber-500/5 rounded-2xl cursor-pointer hover:bg-amber-50 dark:hover:bg-amber-900/10">
                              <input type="radio" name="urgency" className="w-4 h-4 text-amber-500" />
                              <span className="font-semibold text-sm text-amber-700 dark:text-amber-500">Urgente (Taxa Adicional)</span>
                            </label>
                          </div>
                        </div>
                      </>
                    )}

                    {/* Shared field across all forms */}
                    <div className="md:col-span-2 space-y-2 mt-2">
                      <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-1">Notas e Observações de Triagem</label>
                      <textarea rows={3} className="w-full px-6 py-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 font-medium transition-all resize-none" placeholder="Qualquer contexto adicional recebido no atendimento..." />
                    </div>
                  </div>

                  <div className="mt-10 flex flex-col-reverse sm:flex-row gap-4">
                    <button 
                      onClick={() => setStep(4)}
                      className="flex-1 premium-gradient text-white py-5 rounded-2xl font-bold text-lg shadow-xl shadow-emerald-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                    >
                      Registar & Submeter Pedido
                    </button>
                    <button 
                      onClick={() => setStep(2)}
                      className="px-8 py-5 rounded-2xl bg-slate-100 dark:bg-slate-800 font-bold text-slate-500 hover:bg-slate-200 transition-all border border-transparent dark:border-slate-700"
                    >
                      Voltar ao Utente
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
