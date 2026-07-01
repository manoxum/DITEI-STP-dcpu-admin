import React, { useState, useEffect } from 'react';
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
  ExternalLink,
  PlusSquare,
  UserCheck
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip as RechartsTooltip 
} from 'recharts';

const INITIAL_TITLES_DB = {
  'TIT-STP-2026-001': {
    id: 'TIT-STP-2026-001',
    utente: {
      name: 'António dos Santos',
      nif: '100234567',
      contact: '+239 990 1234',
      email: 'antonio.santo@email.st',
      address: 'Avenida Marginal, São Tomé'
    },
    area: '1,200m²',
    status: 'issued',
    date: '15 Mai 2026',
    location: 'Pantufo, Água Grande',
    parcel: {
      id: 'REC-2026-005',
      area: '1,200 m²',
      perimeter: '145 m',
      location: 'Pantufo, Água Grande',
      usage: 'Habitacional Consolidado',
      topography: 'Aprovada (Jun/2026)'
    },
    documents: [
      { id: 'DOC-001', name: 'Planta de Delimitação Georeferenciada', type: 'PDF', size: '2.4 MB', date: '08 Mai 2026', category: 'Technical' },
      { id: 'DOC-002', name: 'Certidão de Registo Predial (Cópia)', type: 'PDF', size: '1.1 MB', date: '12 Mai 2026', category: 'Legal' },
      { id: 'DOC-003', name: 'Comprovativo de Emolumentos', type: 'PNG', size: '450 KB', date: '10 Mai 2026', category: 'Financial' }
    ],
    history: [
      { event: 'Título Emitido Oficialmente', date: '2026-05-15 14:30', user: 'Direção Geral DSGC', type: 'system', details: 'Assinatura digital qualificada aplicada com sucesso.' },
      { event: 'Aprovação Jurídica', date: '2026-05-12 10:15', user: 'Dário Évora (Jurista)', type: 'legal', details: 'Preenchimento de requisitos regulamentares de ocupação.' },
      { event: 'Levantamento de Campo Concluído', date: '2026-05-08 16:45', user: 'Bernardo Cruz (Técnico)', type: 'field', details: 'Delimitação por coordenadas GPS homologada.' }
    ]
  },
  'TIT-STP-2026-002': {
    id: 'TIT-STP-2026-002',
    utente: {
      name: 'Maria da Silva',
      nif: '100554321',
      contact: '+239 991 5566',
      email: 'maria.silva@email.st',
      address: 'Trindade, Mé-Zóchi'
    },
    area: '850m²',
    status: 'pending',
    date: '12 Mai 2026',
    location: 'Trindade, Mé-Zóchi',
    parcel: {
      id: 'REC-2026-012',
      area: '850 m²',
      perimeter: '118 m',
      location: 'Trindade, Mé-Zóchi',
      usage: 'Residencial',
      topography: 'Aprovada (Mai/2026)'
    },
    documents: [
      { id: 'DOC-010', name: 'Delimitação por Coordenadas (Polígono)', type: 'PDF', size: '1.9 MB', date: '10 Mai 2026', category: 'Technical' },
      { id: 'DOC-011', name: 'BI e Passaporte Registado', type: 'PDF', size: '890 KB', date: '05 Mai 2026', category: 'Legal' }
    ],
    history: [
      { event: 'Processo Aguarda Validação de Assinatura', date: '2026-05-12 11:00', user: 'Secretaria DSGC', type: 'system', details: 'Todos os emolumentos pagos. Aguardando ato administrativo.' },
      { event: 'Conformidade Técnica Aprovada', date: '2026-05-11 14:20', user: 'Equipa de Geomática', type: 'field', details: 'Análise de não-sobreposição de parcelas validada com sucesso.' }
    ]
  },
  'TIT-STP-2026-003': {
    id: 'TIT-STP-2026-003',
    utente: {
      name: 'Companhia de Investimento Lda',
      nif: '500887766',
      contact: '+239 224 4455',
      email: 'contato@investimento.st',
      address: 'Zona Industrial de Neves, Lembá'
    },
    area: '15,000m²',
    status: 'review',
    date: '10 Mai 2026',
    location: 'Neves, Lembá',
    parcel: {
      id: 'REC-2026-022',
      area: '15,000 m²',
      perimeter: '520 m',
      location: 'Neves, Lembá',
      usage: 'Comercial / Industrial',
      topography: 'Requer Inspeção In-Loco'
    },
    documents: [
      { id: 'DOC-021', name: 'Plano Geral de Localização de Neves', type: 'PDF', size: '5.2 MB', date: '09 Mai 2026', category: 'Technical' },
      { id: 'DOC-022', name: 'Contrato de Parceria com Ministério de Fomento', type: 'PDF', size: '3.1 MB', date: '04 Mai 2026', category: 'Legal' }
    ],
    history: [
      { event: 'Revisão Técnica Iniciada', date: '2026-05-10 16:30', user: 'Bernardo Cruz (Técnico)', type: 'system', details: 'Verificação visual por sobrevoo detetou inconformidade ligeira no muro Norte.' },
      { event: 'Entrada de Processo Administrativo', date: '2026-05-04 09:12', user: 'Portal Governamental', type: 'request', details: 'Solicitação de concessão em regime industrial.' }
    ]
  },
  'TIT-STP-2026-004': {
    id: 'TIT-STP-2026-004',
    utente: {
      name: 'João Batista',
      nif: '100345678',
      contact: '+239 995 9988',
      email: 'joao.batista@email.st',
      address: 'Santana, Cantagalo'
    },
    area: '450m²',
    status: 'revoked',
    date: '08 Mai 2026',
    location: 'Santana, Cantagalo',
    parcel: {
      id: 'REC-2026-041',
      area: '450 m²',
      perimeter: '88 m',
      location: 'Santana, Cantagalo',
      usage: 'Agrícola',
      topography: 'Cancelada'
    },
    documents: [
      { id: 'DOC-041', name: 'Planta de Delimitação Cancelada', type: 'PDF', size: '1.2 MB', date: '01 Mai 2026', category: 'Technical' },
      { id: 'DOC-042', name: 'Despacho de Revogação de Concessão', type: 'PDF', size: '920 KB', date: '01 Jun 2026', category: 'Legal' }
    ],
    history: [
      { event: 'Título Cancelado e Revogado', date: '2026-06-01 09:00', user: 'Direção Geral DSGC', type: 'system', details: 'Decreto Ministerial decretou sobreposição ilegal com Reserva Ecológica Marinha.' },
      { event: 'Auditoria de Fronteira Identificada', date: '2026-05-25 15:45', user: 'Comissão de Parques STP', type: 'legal', details: 'Parcela entra 40 metros adentro na área protegida de manguezais costeiros.' },
      { event: 'Título Emitido (Uso Comum)', date: '2026-05-08 11:30', user: 'Secretaria Geral', type: 'system', details: 'Emissão provisória anterior cancelada juridicamente nesta data.' }
    ]
  },
  'TIT-STP-2026-005': {
    id: 'TIT-STP-2026-005',
    utente: {
      name: 'Elena Rodrigues',
      nif: '122998334',
      contact: '+239 992 4433',
      email: 'elena.rod@email.st',
      address: 'Guadalupe, Lobata'
    },
    area: '900m²',
    status: 'issued',
    date: '05 Mai 2026',
    location: 'Guadalupe, Lobata',
    parcel: {
      id: 'REC-2026-009',
      area: '900 m²',
      perimeter: '120 m',
      location: 'Guadalupe, Lobata',
      usage: 'Misto',
      topography: 'Aprovada (Mai/2026)'
    },
    documents: [
      { id: 'DOC-051', name: 'Desenho de Planta Aprovado', type: 'PDF', size: '1.4 MB', date: '02 Mai 2026', category: 'Technical' }
    ],
    history: [
      { event: 'Homologação Concluída', date: '2026-05-05 10:10', user: 'Direção Geral DSGC', type: 'system', details: 'Emitido a título integral de posse perpétua.' }
    ]
  }
};

export function TitlesView() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'card' | 'table'>('table');
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
  
  // Real time synchronized database of titles
  const [titlesDb, setTitlesDb] = useState<any>(() => {
    const cached = localStorage.getItem('STP_TITLES_DB');
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch (e) {}
    }
    return INITIAL_TITLES_DB;
  });

  // Keep state synced in localStorage
  useEffect(() => {
    localStorage.setItem('STP_TITLES_DB', JSON.stringify(titlesDb));
  }, [titlesDb]);

  // Modal wizards states
  const [showIssueModal, setShowIssueModal] = useState(false);
  const [issueStep, setIssueStep] = useState(1);
  const [selectedProcessId, setSelectedProcessId] = useState<string | null>(null);
  
  // Form details input fields for Wizard Step 3
  const [obsText, setObsText] = useState('');
  const [customUsage, setCustomUsage] = useState('Habitacional Consolidado');

  // Convert DB object into array
  const titlesList = Object.values(titlesDb);

  // Filter and search
  const filteredTitles = titlesList.filter((title: any) => {
    const matchesSearch = 
      title.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      title.utente.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      title.location.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (filter === 'all') return matchesSearch;
    return matchesSearch && title.status === filter;
  });

  // Core metrics calculation
  const issuedCount = titlesList.filter((t: any) => t.status === 'issued').length;
  const pendingCount = titlesList.filter((t: any) => t.status === 'pending').length;
  const reviewCount = titlesList.filter((t: any) => t.status === 'review').length;
  const revokedCount = titlesList.filter((t: any) => t.status === 'revoked').length;

  const CHART_DATA = [
    { name: 'Habitacional', value: 60 + (customUsage === 'Habitacional Consolidado' ? 1 : 0), color: '#10b981' },
    { name: 'Comercial', value: 20 + (customUsage === 'Comercial / Industrial' ? 1 : 0), color: '#3b82f6' },
    { name: 'Industrial', value: 10, color: '#6366f1' },
    { name: 'Agrícola', value: 10 + (customUsage === 'Agrícola' ? 1 : 0), color: '#f59e0b' },
  ];

  // Simulated process records that are ready for the title generation link
  const PROCESS_OPTIONS = [
    { id: 'STP-PROCESS-8842', name: 'João Manuel dos Santos', area: '1,245 m²', location: 'Bairro do Hospital, Água Grande', district: 'Água Grande', contact: '+239 991 2345', email: 'joao.santos@email.st', nif: '100456000' },
    { id: 'STP-PROCESS-8835', name: 'Maria da Graça', area: '850 m²', location: 'Trindade, Mé-Zóchi', district: 'Mé-Zóchi', contact: '+239 990 8822', email: 'maria.graca@email.st', nif: '122998855' },
    { id: 'STP-PROCESS-8911', name: 'Construções STP Lda', area: '4,500 m²', location: 'Chácara, Água Grande', district: 'Água Grande', contact: '+239 992 5566', email: 'obra.stp@email.st', nif: '500122345' }
  ];

  const clickedProcess = PROCESS_OPTIONS.find(p => p.id === selectedProcessId);

  // Execute actual submission of the brand new title
  const handleFinalizeAndIssue = () => {
    if (!clickedProcess) return;

    // Generate consecutive sequential index ID
    let maxNum = 0;
    Object.keys(titlesDb).forEach(key => {
      const parts = key.split('-');
      const num = parseInt(parts[parts.length - 1]);
      if (!isNaN(num) && num > maxNum) {
        maxNum = num;
      }
    });

    const nextNumberFormatted = String(maxNum + 1).padStart(3, '0');
    const newTitleId = `TIT-STP-2026-${nextNumberFormatted}`;

    const newRecord = {
      id: newTitleId,
      utente: {
        name: clickedProcess.name,
        nif: clickedProcess.nif,
        contact: clickedProcess.contact,
        email: clickedProcess.email,
        address: clickedProcess.location
      },
      area: clickedProcess.area,
      status: 'issued', // Created directly as issued
      date: new Date().toLocaleDateString('pt-PT', { day: '2-digit', month: 'short', year: 'numeric' }),
      location: clickedProcess.location,
      parcel: {
        id: `REC-2026-0${nextNumberFormatted}`,
        area: clickedProcess.area,
        perimeter: '210 m',
        location: clickedProcess.location,
        usage: customUsage,
        topography: 'Aprovada (SIG)'
      },
      documents: [
        { id: 'DOC-501', name: 'Memorial Descritivo Vetorial', type: 'PDF', size: '1.8 MB', date: 'Hoje', category: 'Technical' },
        { id: 'DOC-502', name: 'Croquis Certificado Digital', type: 'PDF', size: '2.5 MB', date: 'Hoje', category: 'Administrative' }
      ],
      history: [
        { 
          event: 'Título Emitido no Sistema', 
          date: new Date().toISOString().substring(0, 16).replace('T', ' '), 
          user: 'Secretário Geral (Assinado)', 
          type: 'system', 
          details: `Dossiê criado com as seguintes observações: ${obsText || 'Nenhuma restrição registrada.'}` 
        },
        { 
          event: 'Aprovação Topográfica Concluída', 
          date: 'Fase Anterior', 
          user: 'Topógrafo de Campo', 
          type: 'field', 
          details: 'Polígono cadastral delimitado perfeitamente no SIG sem transposição de áreas.' 
        }
      ]
    };

    setTitlesDb((prev: any) => ({
      ...prev,
      [newTitleId]: newRecord
    }));

    setIssueStep(4); // Trigger success step page
  };

  return (
    <div className="space-y-10 pb-20">
      
      {/* HEADER ROW */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-display font-black tracking-tighter">Análise e Emissão de Títulos</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">Controlo oficial de titularidade, registro predial e legalidade cadastral das concessões.</p>
        </div>
        <div className="flex w-full md:w-auto flex-col sm:flex-row gap-3 shrink-0">
          <button className="flex items-center gap-2 px-5 py-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-bold text-xs uppercase tracking-wider hover:bg-slate-50 dark:hover:bg-slate-950 transition-all">
            <Download className="w-4 h-4" /> Exportar Lista
          </button>
          
          <button 
            onClick={() => { 
              setSelectedProcessId(PROCESS_OPTIONS[0].id); 
              setIssueStep(1); 
              setObsText('');
              setCustomUsage('Habitacional Consolidado');
              setShowIssueModal(true); 
            }}
            className="flex items-center gap-2 px-6 py-3.5 rounded-2xl premium-gradient text-white font-bold text-xs uppercase tracking-widest shadow-xl shadow-emerald-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <Award className="w-4.5 h-4.5" /> Emitir Novo Título
          </button>
        </div>
      </div>

      {/* FULL-SCREEN DIGITAL PRODUCTION WIZARD MODAL */}
      <AnimatePresence>
        {showIssueModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-12">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              className="absolute inset-0 bg-slate-900/65 backdrop-blur-md" 
              onClick={() => setShowIssueModal(false)}
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 30 }}
              className="relative bg-white dark:bg-slate-900 rounded-[2rem] sm:rounded-[2.5rem] w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col md:flex-row h-[92vh] md:h-[85vh] max-h-[820px] border border-slate-150 dark:border-slate-800"
            >
              {/* Left Steps progress sidebar - styled professionally */}
              <div className="w-full md:w-80 bg-slate-50 dark:bg-slate-950 p-5 sm:p-8 border-b md:border-b-0 md:border-r border-slate-150 dark:border-slate-805 flex flex-col justify-between">
                <div className="space-y-8">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl premium-gradient flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
                      <Award className="w-5.5 h-5.5" />
                    </div>
                    <div>
                      <h2 className="text-xl font-display font-black tracking-tight leading-none text-slate-900 dark:text-white">Emissão de Registro</h2>
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1 block">DSGC Oficial STP</span>
                    </div>
                  </div>

                  <div className="space-y-6">
                    {[
                      { step: 1, label: "Processo SIG Validado", desc: "Seleção do dossiê", icon: Search },
                      { step: 2, label: "Conformidade Legal", desc: "Verificações e taxas", icon: UserCheck },
                      { step: 3, label: "Memória do Instrumento", desc: "Usos e restrições", icon: FileCheck },
                      { step: 4, label: "Assinatura Eletrónica", desc: "Homologação digital", icon: Shield }
                    ].map((s) => (
                      <div key={s.step} className="flex items-start gap-3.5 group">
                        <div className={cn(
                          "w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300 border text-xs font-bold",
                          issueStep === s.step ? "bg-emerald-500 text-white border-emerald-500 shadow-md shadow-emerald-500/20" : 
                          issueStep > s.step ? "bg-emerald-100 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 border-emerald-500/10" :
                          "bg-white dark:bg-slate-800 text-slate-400 border-slate-200 dark:border-slate-700"
                        )}>
                          {issueStep > s.step ? <Check className="w-4.5 h-4.5" /> : <span>{s.step}</span>}
                        </div>
                        <div>
                          <p className={cn(
                            "text-sm font-bold tracking-tight leading-tight",
                            issueStep === s.step ? "text-slate-900 dark:text-white" : "text-slate-400"
                          )}>{s.label}</p>
                          <p className="text-[10px] text-slate-400 font-medium">{s.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <button 
                  onClick={() => setShowIssueModal(false)}
                  className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-rose-500 transition-colors mt-6 pt-4 border-t border-slate-100 dark:border-slate-800"
                >
                  <X className="w-3.5 h-3.5" /> Abandonar Dossiê
                </button>
              </div>

              {/* Main wizard responsive content columns */}
              <div className="flex-1 flex flex-col bg-white dark:bg-slate-900 justify-between overflow-y-auto">
                <div className="p-5 sm:p-8 md:p-12 space-y-6">
                  
                  {/* STEP 1: Link verified process */}
                  {issueStep === 1 && (
                    <motion.div 
                      key="step1" 
                      initial={{ opacity: 0, x: 20 }} 
                      animate={{ opacity: 1, x: 0 }} 
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-6"
                    >
                      <div>
                        <h3 className="text-2xl font-display font-black tracking-tight text-slate-900 dark:text-white mb-2">Vincular Processo de Campo</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Selecione abaixo um processo técnico cadastral cuja vistoria topográfica in-loco e SIG já se encontrem deferidas para despacho.</p>
                      </div>

                      <div className="space-y-3.5">
                        {PROCESS_OPTIONS.map((p) => (
                          <button 
                            type="button"
                            key={p.id}
                            onClick={() => setSelectedProcessId(p.id)}
                            className={cn(
                              "w-full p-5 rounded-2xl border text-left transition-all flex items-center justify-between group",
                              selectedProcessId === p.id 
                                ? "border-emerald-500 bg-emerald-500/[0.03] dark:bg-emerald-500/[0.02] shadow-md" 
                                : "border-slate-150 dark:border-slate-800 hover:border-emerald-550/20 hover:bg-slate-50 dark:hover:bg-slate-950/40"
                            )}
                          >
                            <div className="flex items-center gap-4">
                              <div className={cn(
                                "w-10 h-10 rounded-xl flex items-center justify-center transition-all",
                                selectedProcessId === p.id ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/10" : "bg-slate-105 dark:bg-slate-800 text-slate-400"
                              )}>
                                <FileCheck className="w-5 h-5" />
                              </div>
                              <div className="space-y-1">
                                <span className="text-[10px] font-mono font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">{p.id}</span>
                                <p className="font-display font-black text-slate-800 dark:text-slate-100 group-hover:text-emerald-555 transition-colors">{p.name}</p>
                                <div className="flex flex-wrap items-center gap-3 text-xs font-semibold text-slate-400 mt-0.5">
                                  <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" /> {p.location}</span>
                                  <span className="text-emerald-600 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-black rounded-md">{p.area}</span>
                                </div>
                              </div>
                            </div>
                            
                            {selectedProcessId === p.id && (
                              <div className="w-7 h-7 rounded-full bg-emerald-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/15">
                                <Check className="w-4 h-4" />
                              </div>
                            )}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* STEP 2: Pre-requirements legal validation */}
                  {issueStep === 2 && (
                    <motion.div 
                      key="step2" 
                      initial={{ opacity: 0, x: 20 }} 
                      animate={{ opacity: 1, x: 0 }} 
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-6"
                    >
                      <div>
                        <h3 className="text-2xl font-display font-black tracking-tight text-slate-900 dark:text-white mb-2">Conformidade e Regularização</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Assegure que os requisitos regulamentares fiscais e legais estão em ordem para emissão de fé pública territorial.</p>
                      </div>

                      <div className="space-y-3.5">
                        {[
                          { label: "Análise de Sobreposição (Inexistente)", val: "Aprovada", desc: "O polígono vetorizado não conflita com domínio público ou vizinhos.", status: "success" },
                          { label: "Anuencia Fiduciária de Confrontantes", val: "Aprovada", desc: "Consenso formal de limites delimitados assinado pelas partes confinantes.", status: "success" },
                          { label: "Compensação de Emolumentos Prediais", val: "Pago", desc: "Taxa de concessão pública recolhida na Repartição de Finanças.", status: "success" },
                          { label: "Verificação BI do Proprietário", val: "Aprovado", desc: "Cópia do Bilhete de Identidade STP visada.", status: "success" }
                        ].map((chk, idx) => (
                          <div key={idx} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-850 flex items-start gap-3.5">
                            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                              <CheckCircle2 className="w-5 h-5" />
                            </div>
                            <div>
                              <p className="font-bold text-sm text-slate-800 dark:text-slate-100 flex items-center gap-2">
                                {chk.label}
                                <span className="text-[9px] font-black uppercase text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full">{chk.val}</span>
                              </p>
                              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1">{chk.desc}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* STEP 3: Configure Title Details, usage patterns, details, observations */}
                  {issueStep === 3 && (
                    <motion.div 
                      key="step3" 
                      initial={{ opacity: 0, x: 20 }} 
                      animate={{ opacity: 1, x: 0 }} 
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-6"
                    >
                      <div>
                        <h3 className="text-2xl font-display font-black tracking-tight text-slate-900 dark:text-white mb-2">Compor Memorial de Concessão</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Configure as condicionantes administrativas que constarão na certidão predial perpétua.</p>
                      </div>

                      <div className="space-y-4">
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-black uppercase tracking-wider text-slate-450 block">Uso Preferencial Cadastrado</label>
                          <select 
                            value={customUsage}
                            onChange={(e) => setCustomUsage(e.target.value)}
                            className="w-full px-4 py-3 border border-slate-205 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-950 text-sm font-medium focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500"
                          >
                            <option value="Habitacional Consolidado">Habitacional Consolidado</option>
                            <option value="Comercial / Industrial">Comercial / Industrial</option>
                            <option value="Agrícola">Agrícola</option>
                            <option value="Misto">Misto</option>
                          </select>
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[10px] font-black uppercase tracking-wider text-slate-450 block font-bold">Observações / Restrições Legais</label>
                          <textarea 
                            value={obsText}
                            onChange={(e) => setObsText(e.target.value)}
                            placeholder="Ex: Terreno com servidão de passagem no flanco Este de 3m. Proibida construção de alvenaria impermeável a menos de 10m da linha de água costeira."
                            rows={3}
                            className="w-full px-4 py-3 border border-slate-205 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-950 text-sm font-medium focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 text-slate-850 dark:text-white"
                          />
                        </div>

                        <div className="p-4 border-2 border-dashed border-emerald-500/10 bg-emerald-500/[0.01] rounded-2xl flex items-center gap-3">
                          <Shield className="w-5 h-5 text-emerald-500 shrink-0" />
                          <p className="text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
                            A assinatura digital irá referenciar a planta vetorizada com as coordenadas geográficas correspondentes.
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* STEP 4: Success Generated page */}
                  {issueStep === 4 && (
                    <motion.div 
                      key="step4" 
                      initial={{ opacity: 0, scale: 0.95 }} 
                      animate={{ opacity: 1, scale: 1 }} 
                      className="flex flex-col items-center justify-center text-center space-y-6 py-6"
                    >
                      <div className="relative">
                        <motion.div 
                          animate={{ scale: [1, 1.15, 1], rotate: [0, 360] }}
                          transition={{ duration: 7, repeat: Infinity }}
                          className="absolute inset-0 bg-emerald-500/15 blur-[55px] rounded-full"
                        />
                        <div className="w-28 h-28 rounded-[2rem] premium-gradient text-white flex items-center justify-center shadow-xl shadow-emerald-500/20 relative z-10">
                           <Award className="w-14 h-14" />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <h3 className="text-3xl font-display font-black tracking-tight text-slate-900 dark:text-white">Título Emitido no Sistema</h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 font-bold max-w-sm mx-auto uppercase tracking-wide">
                          Registro formalizado com integridade digital.
                        </p>
                      </div>

                      <div className="p-4 bg-emerald-500/5 rounded-2xl border border-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono text-xs font-black px-6">
                        Vínculo Cadastral Oficial Criado com Sucesso
                      </div>
                    </motion.div>
                  )}

                </div>

                {/* Footer buttons row */}
                <div className="p-5 sm:p-8 border-t border-slate-100 dark:border-slate-800 flex flex-wrap justify-between items-center gap-4 bg-slate-50/50 dark:bg-slate-950/20">
                  {issueStep < 4 ? (
                    <>
                      <button 
                        type="button" 
                        disabled={issueStep === 1}
                        onClick={() => setIssueStep(s => Math.max(1, s - 1))}
                        className={cn(
                          "px-4 py-2 text-xs font-black uppercase tracking-wider text-slate-400 hover:text-slate-700 transition-colors",
                          issueStep === 1 && "opacity-0 invisible"
                        )}
                      >
                        Anterior
                      </button>

                      <div className="flex gap-1.5">
                        {[1, 2, 3].map(step => (
                          <div 
                            key={step} 
                            className={cn(
                              "h-1 px-1 rounded-full transition-all duration-300",
                              issueStep === step ? "w-6 bg-emerald-500" : "w-1.5 bg-slate-200 dark:bg-slate-800"
                            )}
                          />
                        ))}
                      </div>

                      <button 
                        type="button" 
                        onClick={() => {
                          if (issueStep === 3) {
                            handleFinalizeAndIssue();
                          } else {
                            setIssueStep(s => s + 1);
                          }
                        }}
                        className="px-6 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-bold text-xs uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] shadow-md transition-all flex items-center gap-2"
                      >
                        {issueStep === 3 ? "Emitir e Assinar" : "Avançar"} <ChevronRight className="w-4 h-4" />
                      </button>
                    </>
                  ) : (
                    <button 
                      type="button" 
                      onClick={() => {
                        setShowIssueModal(false);
                        setIssueStep(1);
                        setSelectedProcessId(null);
                      }}
                      className="w-full py-4 text-center bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl text-xs uppercase tracking-widest shadow-md transition-all"
                    >
                      Concluir e Voltar ao Painel
                    </button>
                  )}
                </div>

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* SEARCH AND GRID CONTAINER */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
        <div className="xl:col-span-3 space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-3xl flex flex-wrap items-center justify-between gap-4 shadow-sm">
            <div className="relative flex-1 min-w-[240px]">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Pesquisar por Título # ou Nome..."
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
            
            <div className="flex flex-wrap items-center gap-3">
              <button 
                onClick={() => setShowFilters(!showFilters)}
                className={cn(
                  "px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors shadow-sm flex items-center gap-2",
                  showFilters 
                    ? "bg-slate-100 dark:bg-slate-800 text-emerald-600 dark:text-emerald-400" 
                    : "bg-white dark:bg-slate-800 text-slate-500 hover:text-emerald-600"
                )}
              >
                <Filter className="w-4 h-4" /> Filtros Avançados
              </button>
              
              <div className="flex gap-1 p-1 bg-slate-100 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-850">
                {[
                  { id: 'all', label: 'Todos' },
                  { id: 'issued', label: 'Emitidos' },
                  { id: 'pending', label: 'Pendentes' },
                  { id: 'review', label: 'Revisão' },
                  { id: 'revoked', label: 'Revogados' }
                ].map((t) => (
                  <button 
                    key={t.id}
                    onClick={() => setFilter(t.id)}
                    className={cn(
                      "px-3.5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all",
                      filter === t.id 
                        ? "bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 shadow-sm" 
                        : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-350"
                    )}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              <div className={cn("bg-slate-100 dark:bg-slate-950 p-1 rounded-2xl border border-slate-200 dark:border-slate-850 hidden lg:flex", isMobile ? "hidden" : "")}>
                <button 
                  onClick={() => setViewMode('card')}
                  title="Visualização em Cartões"
                  className={cn("px-3 py-2 rounded-xl transition-all flex items-center gap-2", viewMode === 'card' ? "bg-white dark:bg-slate-800 shadow-sm text-emerald-600 dark:text-emerald-400" : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-350")}
                >
                  <MapPin className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => setViewMode('table')}
                  title="Visualização em Tabela"
                  className={cn("px-3 py-2 rounded-xl transition-all flex items-center gap-2", viewMode === 'table' ? "bg-white dark:bg-slate-800 shadow-sm text-emerald-600 dark:text-emerald-400" : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-350")}
                >
                  <FileCheck className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          <AnimatePresence>
            {showFilters && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-3xl overflow-hidden shadow-sm"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Distrito</label>
                    <select className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 px-4 py-2.5 rounded-xl text-sm font-medium focus:outline-none focus:border-emerald-500">
                      <option value="">Todos os Distritos</option>
                      <option value="agua-grande">Água Grande</option>
                      <option value="me-zochi">Mé-Zóchi</option>
                      <option value="lemba">Lembá</option>
                      <option value="lobata">Lobata</option>
                      <option value="cantagalo">Cantagalo</option>
                      <option value="caué">Caué</option>
                      <option value="principe">RAP (Príncipe)</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Uso do Solo (Tipologia)</label>
                    <select className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 px-4 py-2.5 rounded-xl text-sm font-medium focus:outline-none focus:border-emerald-500">
                      <option value="">Todas as Tipologias</option>
                      <option value="habitacional">Habitacional Consolidado</option>
                      <option value="comercial">Comercial / Industrial</option>
                      <option value="agricola">Agrícola</option>
                      <option value="misto">Misto</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Intervalo de Datas</label>
                    <input type="date" className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 px-4 py-2.5 rounded-xl text-sm font-medium focus:outline-none focus:border-emerald-500" />
                  </div>
                </div>
                <div className="flex justify-end mt-6">
                  <button onClick={() => setShowFilters(false)} className="px-5 py-2.5 bg-emerald-500 text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-emerald-600 transition-colors">
                    Aplicar Filtros
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {viewMode === 'table' ? (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] p-4 md:p-8 shadow-sm">
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full min-w-[760px] text-left">
                  <thead>
                    <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400">
                      <th className="pb-4.5 pl-6 text-[10px] font-black uppercase tracking-[0.2em]">Referência</th>
                      <th className="pb-4.5 px-4 text-[10px] font-black uppercase tracking-[0.2em]">Titular e Regime NIF</th>
                      <th className="pb-4.5 px-4 text-[10px] font-black uppercase tracking-[0.2em]">Localização Lote</th>
                      <th className="pb-4.5 px-4 text-[10px] font-black uppercase tracking-[0.2em] text-center">Status Registo</th>
                      <th className="pb-4.5 pr-6 text-right text-[10px] font-black uppercase tracking-[0.2em]">Acções</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 dark:divide-slate-800/60">
                    {filteredTitles.map((title: any) => (
                      <tr 
                        key={title.id} 
                        onClick={() => navigate(`/titles/${title.id}`)}
                        className="group hover:bg-slate-55 dark:hover:bg-slate-950/40 transition-colors cursor-pointer"
                      >
                        <td className="py-5.5 pl-6">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center group-hover:bg-emerald-500/10 transition-colors">
                              <Hash className="w-4 h-4 text-slate-400 group-hover:text-emerald-500 transition-colors" />
                            </div>
                            <div>
                              <p className="text-sm font-black tracking-tight text-slate-900 dark:text-white leading-tight">{title.id}</p>
                              <p className="text-[10px] font-bold text-slate-400 uppercase mt-0.5 tracking-wider">{title.area} • {title.parcel?.id || 'REC-00'}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-5.5 px-4">
                          <p className="text-sm font-bold text-slate-900 dark:text-white leading-tight">{title.utente.name}</p>
                          <p className="text-[10px] font-bold text-slate-400 mt-0.5 uppercase">Registo: {title.date}</p>
                        </td>
                        <td className="py-5.5 px-4">
                          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                            <MapPin className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                            <span className="text-xs font-semibold truncate max-w-[170px]">{title.location}</span>
                          </div>
                        </td>
                        <td className="py-5.5 px-4">
                           <div className={cn(
                             "mx-auto flex items-center justify-center gap-1 px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest max-w-[120px]",
                             title.status === 'issued' ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/10" :
                             title.status === 'pending' ? "bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/10" :
                             title.status === 'review' ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/10" :
                             "bg-rose-500/10 text-rose-600 dark:text-rose-450 border border-rose-500/10"
                           )}>
                             {title.status === 'issued' ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                             {title.status === 'issued' ? 'Emitido' : title.status === 'pending' ? 'Pendente' : title.status === 'review' ? 'Revisão' : 'Revogado'}
                           </div>
                        </td>
                        <td className="py-5.5 pr-6 text-right">
                          <div className="flex justify-end gap-2">
                            <button 
                              onClick={(e) => { e.stopPropagation(); navigate(`/titles/${title.id}`); }}
                              className="p-2 hover:bg-emerald-500/10 rounded-xl transition-colors text-slate-400 hover:text-emerald-500"
                              title="Abrir Instrumento Requerido"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {filteredTitles.length === 0 && (
                      <tr>
                        <td colSpan={5} className="py-12 text-center opacity-50">
                          <span className="text-xs font-black uppercase tracking-widest text-slate-400">Nenhum registro correspondente</span>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTitles.map((title: any, i: number) => (
                <motion.div
                  key={title.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => navigate(`/titles/${title.id}`)}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-3xl shadow-sm hover:shadow-md hover:border-emerald-500/30 transition-all cursor-pointer group flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0 group-hover:bg-emerald-100 dark:group-hover:bg-emerald-500/20 transition-colors">
                          <Hash className="w-4 h-4 text-slate-500 group-hover:text-emerald-600 transition-colors" />
                        </div>
                        <div>
                          <p className="text-sm font-black tracking-tight text-slate-900 dark:text-white leading-tight">{title.id}</p>
                          <p className="text-[9px] font-bold text-slate-400 mt-0.5 uppercase tracking-wider">{title.area} • {title.parcel?.id || 'REC-00'}</p>
                        </div>
                      </div>
                      <div className={cn(
                        "flex items-center justify-center gap-1.5 px-2.5 py-1 rounded-xl text-[9px] font-black uppercase tracking-widest shrink-0 border",
                        title.status === 'issued' ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/10" :
                        title.status === 'pending' ? "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/10" :
                        title.status === 'review' ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/10" :
                        "bg-rose-500/10 text-rose-600 dark:text-rose-450 border-rose-500/10"
                      )}>
                        {title.status === 'issued' ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                        {title.status === 'issued' ? 'Emitido' : title.status === 'pending' ? 'Pendente' : title.status === 'review' ? 'Revisão' : 'Revogado'}
                      </div>
                    </div>

                    <div className="space-y-3 mb-4">
                      <div className="p-2.5 bg-slate-50 dark:bg-slate-950/50 rounded-2xl border border-slate-100 dark:border-slate-800/80">
                        <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">Titular / Proprietário</p>
                        <p className="font-bold text-sm text-slate-900 dark:text-white leading-tight">{title.utente.name}</p>
                        <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mt-0.5 flex items-center gap-1.5">
                           <FileCheck className="w-3 h-3" /> NIF: {title.utente.nif || 'N/A'}
                        </p>
                      </div>

                      <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400 text-[11px] font-medium px-1">
                        <MapPin className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate">{title.location}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-3 mt-1">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Reg: {title.date}</p>
                    <div className="text-emerald-500 font-bold text-[9px] uppercase tracking-wider flex items-center gap-1 group-hover:text-emerald-600 transition-colors">
                      Detalhes 
                      <div className="w-5 h-5 rounded-md bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center">
                        <ChevronRight className="w-3 h-3" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
              {filteredTitles.length === 0 && (
                <div className="col-span-1 md:col-span-2 lg:col-span-3 py-12 text-center opacity-50 bg-white dark:bg-slate-900 rounded-[2rem] border border-dashed border-slate-200 dark:border-slate-800">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Nenhum registro correspondente</span>
                </div>
              )}
            </div>
          )}

          <div className="grid grid-cols-1 gap-4 md:hidden">
            {viewMode === 'table' && filteredTitles.map((title: any) => (
                <div
                  key={title.id}
                  onClick={() => navigate(`/titles/${title.id}`)}
                  className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/30 p-5 cursor-pointer transition-colors hover:bg-slate-50 dark:hover:bg-slate-950/40"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
                        <Hash className="w-4 h-4 text-slate-400" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-black tracking-tight text-slate-900 dark:text-white leading-tight">{title.id}</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase mt-0.5 tracking-wider">{title.area} • {title.parcel?.id || 'REC-00'}</p>
                      </div>
                    </div>
                    <div className={cn(
                      "flex items-center justify-center gap-1 px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest shrink-0",
                      title.status === 'issued' ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/10" :
                      title.status === 'pending' ? "bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/10" :
                      title.status === 'review' ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/10" :
                      "bg-rose-500/10 text-rose-600 dark:text-rose-450 border border-rose-500/10"
                    )}>
                      {title.status === 'issued' ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                      {title.status === 'issued' ? 'Emitido' : title.status === 'pending' ? 'Pendente' : title.status === 'review' ? 'Revisão' : 'Revogado'}
                    </div>
                  </div>

                  <div className="mt-4 space-y-3">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Titular</p>
                      <p className="text-sm font-bold text-slate-900 dark:text-white leading-tight">{title.utente.name}</p>
                      <p className="text-[10px] font-bold text-slate-400 mt-0.5 uppercase">Registo: {title.date}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Localização</p>
                      <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                        <MapPin className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                        <span className="text-xs font-semibold">{title.location}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                    <button
                      onClick={(e) => { e.stopPropagation(); navigate(`/titles/${title.id}`); }}
                      className="p-2 hover:bg-emerald-500/10 rounded-xl transition-colors text-slate-400 hover:text-emerald-500"
                      title="Abrir Instrumento Requerido"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}

              {filteredTitles.length === 0 && (
                <div className="py-12 text-center opacity-50">
                  <span className="text-xs font-black uppercase tracking-widest text-slate-400">Nenhum registro correspondente</span>
                </div>
              )}
            </div>
          </div>

        <div className="space-y-8">
           {/* Tipologia de Uso Pie Chart card */}
           <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-7 rounded-[2.5rem] shadow-sm">
             <h3 className="font-display font-black text-lg tracking-tight mb-6">Uso do Território</h3>
             <div className="h-[210px] w-full">
               <ResponsiveContainer width="100%" height="100%">
                 <PieChart>
                   <Pie
                     data={CHART_DATA}
                     cx="50%"
                     cy="50%"
                     innerRadius={50}
                     outerRadius={70}
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
             <div className="grid grid-cols-2 gap-3 mt-4 text-[10px] font-black uppercase tracking-widest text-slate-550 leading-none">
                {CHART_DATA.map((item, i) => (
                  <div key={i} className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="truncate">{item.name}</span>
                  </div>
                ))}
             </div>
           </div>

           {/* Efficiency Increase badge */}
           <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-[2.5rem] relative overflow-hidden shadow-sm">
             <div className="relative z-10">
               <div className="w-11 h-11 bg-emerald-500/10 dark:bg-white/10 rounded-2xl flex items-center justify-center mb-5">
                 <TrendingUp className="w-5.5 h-5.5 text-emerald-600 dark:text-emerald-400" />
               </div>
               <h4 className="font-display font-black text-2xl tracking-tighter leading-none mb-1 text-slate-900 dark:text-white">+18.5%</h4>
               <p className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest leading-relaxed">
                 Aprovação e segurança fiduciária consolidada neste trimestre.
               </p>
             </div>
             <div className="absolute bottom-0 right-0 w-32 h-32 bg-emerald-500/10 dark:bg-emerald-500/20 rounded-full blur-[65px] translate-y-1/2 translate-x-1/2" />
           </div>
        </div>
      </div>
    </div>
  );
}
