import { 
  LayoutGrid, 
  List, 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal, 
  Calendar, 
  User, 
  ArrowRight,
  X,
  MapPin,
  Phone,
  Mail,
  FileText,
  AlertCircle,
  CheckCircle,
  ExternalLink,
  ChevronRight,
  Clock,
  Trash2,
  CheckSquare,
  Sparkles,
  Award,
  Check,
  FileSignature
} from "lucide-react";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useNavigate } from "react-router-dom";
import { cn } from "../../lib/utils";

// Baseline original processes with enriched meta-details
const INITIAL_PROCESSES = [
  { 
    id: 'STP-001', 
    applicant: 'João Manuel', 
    type: 'Concessão', 
    status: 'pending', 
    date: '2026-06-15', 
    urgent: true, 
    location: 'Água Grande, Chácara', 
    phone: '+239 991 2345', 
    email: 'joao.manuel@email.st', 
    nif: '100456123', 
    desc: 'Requerimento para concessão definitiva de lote urbano de 1200m² destinado à habitação própria unifamiliar.' 
  },
  { 
    id: 'STP-002', 
    applicant: 'Maria das Dores', 
    type: 'Legalização', 
    status: 'in_review', 
    date: '2026-06-14', 
    urgent: false, 
    location: 'Trindade, Mé-Zóchi', 
    phone: '+239 990 8765', 
    email: 'maria.dores@email.st', 
    nif: '100789456', 
    desc: 'Processo de legalização de vivenda unifamiliar construída em parcelamento informal sem registro original anterior.' 
  },
  { 
    id: 'STP-003', 
    applicant: 'António Silva', 
    type: 'Transpasse', 
    status: 'approved', 
    date: '2026-06-12', 
    urgent: false, 
    location: 'Neves, Lembá', 
    phone: '+239 995 4321', 
    email: 'antonio.silva@email.st', 
    nif: '101234567', 
    desc: 'Transpasse de propriedade de parcelas rústicas florestais exploradas sob concessão provisória agrícola.' 
  },
  { 
    id: 'STP-004', 
    applicant: 'Construções STP Lda', 
    type: 'Delimitação', 
    status: 'pending', 
    date: '2026-06-11', 
    urgent: true, 
    location: 'Bairro do Hospital, Água Grande', 
    phone: '+239 992 5566', 
    email: 'contacto@construcoesstp.st', 
    nif: '500122345', 
    desc: 'Delimitação poligonal cadastral para averbação SIG de lote com área aproximada de 1.245m².' 
  },
  { 
    id: 'STP-005', 
    applicant: 'Isabel Rocha', 
    type: 'Reclamação', 
    status: 'in_review', 
    date: '2026-06-10', 
    urgent: false, 
    location: 'Guadalupe, Lobata', 
    phone: '+239 997 1212', 
    email: 'isabel.rocha@email.st', 
    nif: '100554433', 
    desc: 'Litígio decorrente de sobreposição involuntária de confrontações em herança predial de partilha familiar.' 
  },
  { 
    id: 'STP-006', 
    applicant: 'Pedro Afonso', 
    type: 'Concessão', 
    status: 'rejected', 
    date: '2026-06-08', 
    urgent: false, 
    location: 'Porto Alegre, Caué', 
    phone: '+239 999 8877', 
    email: 'pedro.afonso@email.st', 
    nif: '100223344', 
    desc: 'Pedido de concessão florestal rústica em área que colide com os limites protegidos do Parque Natural Obô.' 
  },
];

const COLUMNS = [
  { id: 'pending', label: 'Pendentes', color: 'amber' },
  { id: 'in_review', label: 'Em Revisão', color: 'blue' },
  { id: 'approved', label: 'Aprovados', color: 'emerald' },
  { id: 'rejected', label: 'Rejeitados', color: 'red' },
];

export function ProcessesView() {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<'board' | 'list'>('board');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Persistent processes list state
  const [processes, setProcesses] = useState<any[]>(() => {
    const cached = localStorage.getItem('STP_PROCESSES');
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch (e) {
        // Fallback
      }
    }
    return INITIAL_PROCESSES;
  });

  // active selected process for drawer
  const [selectedProcess, setSelectedProcess] = useState<any | null>(null);

  // add process modal open state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New Process input form states
  const [newApplicant, setNewApplicant] = useState('');
  const [newType, setNewType] = useState('Concessão');
  const [newLocation, setNewLocation] = useState('Água Grande');
  const [newPhone, setNewPhone] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newNif, setNewNif] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newUrgent, setNewUrgent] = useState(false);

  // Feedback notifications (toast)
  const [toastMsg, setToastMsg] = useState<{message: string, type: 'success' | 'info' | 'error'} | null>(null);

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'info') => {
    setToastMsg({ message, type });
    setTimeout(() => {
      setToastMsg(null);
    }, 4500);
  };

  // Sync state to local storage
  useEffect(() => {
    localStorage.setItem('STP_PROCESSES', JSON.stringify(processes));
  }, [processes]);

  // Sync selected element if any values change inside the general array
  const activeSelected = selectedProcess 
    ? processes.find(p => p.id === selectedProcess.id) 
    : null;

  // Filter list of processes based on search query
  const filteredProcesses = processes.filter(p => {
    const query = searchQuery.toLowerCase();
    return (
      p.id.toLowerCase().includes(query) ||
      p.applicant.toLowerCase().includes(query) ||
      p.type.toLowerCase().includes(query) ||
      (p.location && p.location.toLowerCase().includes(query))
    );
  });

  // Handle status update of selected process
  const updateProcessStatus = (procId: string, newStatus: string) => {
    setProcesses(prev => 
      prev.map(p => p.id === procId ? { ...p, status: newStatus } : p)
    );
    showToast(`O estado do processo ${procId} foi atualizado com sucesso!`, 'success');
  };

  // Handle switching urgency
  const toggleProcessUrgency = (procId: string) => {
    setProcesses(prev => 
      prev.map(p => p.id === procId ? { ...p, urgent: !p.urgent } : p)
    );
    showToast(`Prioridade de urgência atualizada.`, 'info');
  };

  // Handle process deletion
  const handleDeleteProcess = (procId: string) => {
    setProcesses(prev => prev.filter(p => p.id !== procId));
    setSelectedProcess(null);
    showToast(`O processo ${procId} foi permanentemente removido.`, 'info');
  };

  // Create new active process flow
  const handleCreateProcess = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newApplicant.trim()) {
      showToast('Por favor, informe o nome do requerente.', 'error');
      return;
    }

    // Generate unique index sequence
    let maxIdx = 0;
    processes.forEach(p => {
      const pNum = parseInt(p.id.split('-').pop() || '0');
      if (pNum > maxIdx) maxIdx = pNum;
    });
    const nextId = `STP-${String(maxIdx + 1).padStart(3, '0')}`;

    const newProc = {
      id: nextId,
      applicant: newApplicant,
      type: newType,
      status: 'pending',
      date: new Date().toISOString().split('T')[0],
      urgent: newUrgent,
      location: newLocation,
      phone: newPhone || '+239 990 0000',
      email: newEmail || `${newApplicant.toLowerCase().replace(/\s+/g, '')}@email.st`,
      nif: newNif || '100888999',
      desc: newDesc || 'Instrução inicial cadastral sem memória descritiva complementar.'
    };

    setProcesses([newProc, ...processes]);
    setIsAddModalOpen(false);
    
    // Reset Form
    setNewApplicant('');
    setNewType('Concessão');
    setNewLocation('Água Grande');
    setNewPhone('');
    setNewEmail('');
    setNewNif('');
    setNewDesc('');
    setNewUrgent(false);

    showToast(`Processo ${nextId} criado com sucesso e agendado para o estado Pendente!`, 'success');
  };

  const getColumnColorClass = (color: string) => {
    switch (color) {
      case 'amber': return 'bg-amber-500';
      case 'blue': return 'bg-blue-500';
      case 'emerald': return 'bg-emerald-500';
      case 'red': return 'bg-red-500';
      default: return 'bg-slate-500';
    }
  };

  return (
    <div className="space-y-6 relative">
      
      {/* Dynamic Toast Feedback Overlay */}
      <AnimatePresence>
        {toastMsg && (
          <motion.div 
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className={cn(
              "fixed top-6 right-6 z-50 p-5 rounded-2xl shadow-xl flex items-center gap-3 border backdrop-blur-md max-w-sm",
              toastMsg.type === 'success' ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20" :
              toastMsg.type === 'error' ? "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20" :
              "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20"
            )}
          >
            {toastMsg.type === 'success' ? <CheckCircle className="w-5 h-5 shrink-0" /> : <AlertCircle className="w-5 h-5 shrink-0" />}
            <span className="text-sm font-semibold">{toastMsg.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-display font-black tracking-tighter">Gestão de Processos</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium">Acompanhe, ordene, delibere e altere estados dos dossiês administrativos e territoriais.</p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
            <button 
              onClick={() => setViewMode('board')}
              title="Visualização em Quadro Kanban"
              className={cn("px-3.5 py-2.5 rounded-lg transition-all flex items-center gap-2 text-xs font-black uppercase tracking-wider", viewMode === 'board' ? "bg-white dark:bg-slate-700 shadow-sm text-emerald-600 dark:text-emerald-400" : "text-slate-400")}
            >
              <LayoutGrid className="w-4 h-4" />
              <span>Quadro</span>
            </button>
            <button 
              onClick={() => setViewMode('list')}
              title="Visualização em Lista Detalhada"
              className={cn("px-3.5 py-2.5 rounded-lg transition-all flex items-center gap-2 text-xs font-black uppercase tracking-wider", viewMode === 'list' ? "bg-white dark:bg-slate-700 shadow-sm text-emerald-600 dark:text-emerald-400" : "text-slate-400")}
            >
              <List className="w-4 h-4" />
              <span>Lista</span>
            </button>
          </div>
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="premium-gradient text-white px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-emerald-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <Plus className="w-4 h-4" />
            Novo Processo
          </button>
        </div>
      </div>

      {/* SEARCH AND FILTERS BAR */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-3xl flex flex-wrap items-center justify-between gap-4 shadow-sm">
        <div className="relative flex-1 min-w-[300px]">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filtrar processos por ID (ex: STP-001), requerente, lote ou localização..."
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
          <div className="px-4 py-2.5 bg-slate-100 dark:bg-slate-950 border border-slate-100 dark:border-slate-850 rounded-xl text-xs font-black uppercase tracking-wider text-slate-500 flex items-center gap-2">
            <CheckSquare className="w-3.5 h-3.5 text-emerald-500" />
            <span>Resultados: {filteredProcesses.length}</span>
          </div>
        </div>
      </div>

      {/* RENDER VIEW SCHEME */}
      <div className="overflow-x-auto pb-4">
        {viewMode === 'board' ? (
          /* KANBAN BOARD VIEW */
          <div className="flex gap-6 min-w-[1000px] mt-4">
            {COLUMNS.map(column => {
              const colProcesses = filteredProcesses.filter(p => p.status === column.id);
              return (
                <div key={column.id} className="flex-1 space-y-4">
                  
                  {/* Column Title Banner */}
                  <div className="flex items-center justify-between px-3 pb-1 border-b border-slate-100 dark:border-slate-800/10">
                    <div className="flex items-center gap-2.5">
                      <div className={cn("w-3.5 h-3.5 rounded-full", getColumnColorClass(column.color))} />
                      <h3 className="font-display font-black text-sm tracking-tight text-slate-800 dark:text-slate-200">
                        {column.label}
                      </h3>
                      <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-2 py-0.5 rounded-full text-[10px] font-black">
                        {colProcesses.length}
                      </span>
                    </div>
                  </div>
                  
                  {/* Column Droppable Container mockup */}
                  <div className="space-y-4 min-h-[550px] p-2 bg-slate-50/50 dark:bg-slate-950/20 rounded-[2rem] border border-dashed border-slate-200/50 dark:border-slate-800/30">
                    {colProcesses.length === 0 ? (
                      <div className="h-40 flex flex-col items-center justify-center text-center opacity-40">
                        <FolderEmptyIcon className="w-8 h-8 text-slate-400 mb-2" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Vazio</span>
                      </div>
                    ) : (
                      colProcesses.map((process, idx) => (
                        <ProcessCard 
                          key={process.id} 
                          process={process} 
                          index={idx} 
                          onClick={() => setSelectedProcess(process)}
                        />
                      ))
                    )}
                  </div>

                </div>
              );
            })}
          </div>
        ) : (
          /* TABULAR DETAILED LIST VIEW */
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 rounded-3xl overflow-hidden shadow-sm mt-4">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50 dark:bg-slate-950 border-b border-slate-100 dark:border-slate-850">
                <tr>
                  <th className="pl-8 pr-4 py-4.5 font-bold text-xs uppercase tracking-wider text-slate-400">ID Processo</th>
                  <th className="px-6 py-4.5 font-bold text-xs uppercase tracking-wider text-slate-400">Requerente</th>
                  <th className="px-6 py-4.5 font-bold text-xs uppercase tracking-wider text-slate-400">Tipo de Pedido</th>
                  <th className="px-6 py-4.5 font-bold text-xs uppercase tracking-wider text-slate-400">Localização</th>
                  <th className="px-6 py-4.5 font-bold text-xs uppercase tracking-wider text-slate-400">Estado</th>
                  <th className="px-6 py-4.5 font-bold text-xs uppercase tracking-wider text-slate-400">Data</th>
                  <th className="pr-8 pl-4 py-4.5 text-right font-bold text-xs uppercase tracking-wider text-slate-400">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredProcesses.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-20 text-center">
                      <div className="max-w-xs mx-auto space-y-2 opacity-50">
                        <X className="w-10 h-10 text-rose-500 mx-auto" />
                        <p className="font-display font-black text-lg">Nenhum processo localizado</p>
                        <p className="text-xs text-slate-400 font-medium">Altere os termos da busca para obter resultados.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredProcesses.map((process, i) => (
                    <tr 
                      key={process.id} 
                      onClick={() => setSelectedProcess(process)}
                      className="hover:bg-slate-50/80 dark:hover:bg-slate-950/60 transition-all cursor-pointer group"
                    >
                      <td className="pl-8 pr-4 py-5.5">
                        <div className="flex items-center gap-2.5">
                          <span className="font-mono font-black text-sm text-slate-900 dark:text-white">{process.id}</span>
                          {process.urgent && (
                            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-5.5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                            <User className="w-4 h-4 text-emerald-500" />
                          </div>
                          <div>
                            <span className="font-bold text-sm block tracking-tight text-slate-800 dark:text-slate-100">{process.applicant}</span>
                            <span className="text-[10px] font-semibold text-slate-450 block truncate max-w-[140px] opacity-70">NIF {process.nif}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5.5 text-slate-500 dark:text-slate-400">
                        <span className="text-xs font-black uppercase tracking-wider px-2.5 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-700 dark:text-slate-300">
                          {process.type}
                        </span>
                      </td>
                      <td className="px-6 py-5.5 text-slate-500 dark:text-slate-400">
                        <div className="flex items-center gap-1.5 text-xs font-semibold">
                          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{process.location}</span>
                        </div>
                      </td>
                      <td className="px-6 py-5.5">
                        <StatusBadge status={process.status} />
                      </td>
                      <td className="px-6 py-5.5 text-xs font-bold font-mono text-slate-400">{process.date}</td>
                      <td className="pr-8 pl-4 py-5.5 text-right">
                         <button 
                           onClick={(e) => {
                             e.stopPropagation();
                             setSelectedProcess(process);
                           }}
                           className="p-2 py-1 bg-slate-105 hover:bg-slate-100 dark:hover:bg-slate-850 rounded-lg transition-all text-xs font-black uppercase tracking-wider text-emerald-500 flex items-center gap-1.5 ml-auto border border-emerald-500/10"
                         >
                           Ver Detalhes
                           <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                         </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* DYNAMIC PROCESS SLIDEOUT DRAWER / MODAL DETAILS */}
      <AnimatePresence>
        {activeSelected && (
          <div className="fixed inset-0 z-50 flex justify-end">
            
            {/* Backdrop Glow with micro blur */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProcess(null)}
              className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
            />
            
            {/* Drawer Body panel */}
            <motion.div 
              initial={{ x: "100%", opacity: 0.95 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "100%", opacity: 0.95 }}
              transition={{ type: "spring", damping: 24, stiffness: 180 }}
              className="relative w-full max-w-xl h-full bg-white dark:bg-slate-900 shadow-2xl border-l border-slate-200 dark:border-slate-800 flex flex-col justify-between overflow-y-auto"
            >
              
              {/* Drawer Top Header Banner */}
              <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-950/20">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono font-black text-emerald-500 uppercase tracking-widest px-2.5 py-1 bg-emerald-500/10 rounded-lg">
                      {activeSelected.id}
                    </span>
                    {activeSelected.urgent && (
                      <span className="bg-rose-500/10 text-rose-500 text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full animate-pulse">
                        Urgente
                      </span>
                    )}
                  </div>
                  <h2 className="text-2xl font-display font-black tracking-tight leading-none text-slate-900 dark:text-white mt-1">
                    Dossier Administrativo
                  </h2>
                </div>
                <button 
                  onClick={() => setSelectedProcess(null)}
                  className="p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-2xl transition-colors shadow-sm"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Drawer Scrollable Content Area */}
              <div className="flex-1 p-8 space-y-8">
                
                {/* 1. SECTOR DE ESTADO (INTERACTIVE STATUS STATE MACHINE SWITCHER) */}
                <div className="space-y-3 bg-slate-50/50 dark:bg-slate-950/20 p-5 rounded-2xl border border-slate-150/40 dark:border-slate-800/40">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] block">
                    Tramitação e Estado Corrente
                  </span>
                  
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {COLUMNS.map(col => {
                      const isActive = activeSelected.status === col.id;
                      return (
                        <button
                          key={col.id}
                          onClick={() => updateProcessStatus(activeSelected.id, col.id)}
                          className={cn(
                            "py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all border",
                            isActive 
                              ? col.id === 'pending' ? "bg-amber-500 text-white border-amber-500 shadow-md shadow-amber-500/20" :
                                col.id === 'in_review' ? "bg-blue-500 text-white border-blue-500 shadow-md shadow-blue-500/20" :
                                col.id === 'approved' ? "bg-emerald-500 text-white border-emerald-500 shadow-md shadow-emerald-500/20" :
                                "bg-red-500 text-white border-red-500 shadow-md shadow-red-500/20"
                              : "bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850"
                          )}
                        >
                          <div className={cn("w-2 h-2 rounded-full shrink-0", 
                            isActive ? "bg-white" :
                            col.id === 'pending' ? "bg-amber-500" :
                            col.id === 'in_review' ? "bg-blue-500" :
                            col.id === 'approved' ? "bg-emerald-500" : "bg-red-500"
                          )} />
                          {col.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 2. REQUERENTE CARD AND PERSONAL META DATA */}
                <div className="space-y-4">
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">
                    Dados do Utente Requerente
                  </h3>
                  
                  <div className="bg-slate-50/50 dark:bg-slate-950/20 rounded-2xl p-6 border border-slate-100 dark:border-slate-850 space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-display font-black text-xl shadow-inner pb-0.5">
                        {activeSelected.applicant.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-bold text-base text-slate-900 dark:text-white leading-tight">
                          {activeSelected.applicant}
                        </h4>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5 block">
                          NIF de Registo: {activeSelected.nif}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-150/50 dark:border-slate-800/40">
                      <div className="flex items-center gap-2.5 text-slate-605 dark:text-slate-400">
                        <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                        <span className="text-xs font-semibold">{activeSelected.phone}</span>
                      </div>
                      <div className="flex items-center gap-2.5 text-slate-605 dark:text-slate-400">
                        <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                        <span className="text-xs font-semibold truncate" title={activeSelected.email}>{activeSelected.email}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3. TERRAIN DESCRIPTION AND BRIEF REQUIREMENT NOTES */}
                <div className="space-y-4">
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">
                    Memória de Descrição Cadastral
                  </h3>
                  
                  <div className="bg-white dark:bg-slate-900/40 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 space-y-4">
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-emerald-500 mt-0.5 shrink-0" />
                      <div>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Localização do Lote</span>
                        <span className="text-sm font-bold text-slate-800 dark:text-slate-100">{activeSelected.location}</span>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <FileText className="w-5 h-5 text-emerald-500 mt-0.5 shrink-0" />
                      <div>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Propósitos e Descrição do Pedido</span>
                        <p className="text-xs font-medium text-slate-500 dark:text-slate-450 mt-1 leading-relaxed">
                          {activeSelected.desc}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 4. DOCUMENTATION INSTRUCTION SHELF AND CHECKS */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center sm:gap-2.5">
                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">
                      Arquivo de Documentos Anexos
                    </h3>
                    <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded-full text-[9px] font-black uppercase text-slate-500">
                      Instruído
                    </span>
                  </div>

                  <div className="space-y-3.5">
                    <div className="bg-slate-50/50 dark:bg-slate-950/20 p-4.5 rounded-2xl border border-slate-100 dark:border-slate-850 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-emerald-500/10 text-emerald-500 rounded-xl">
                          <Check className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="text-xs font-bold block text-slate-800 dark:text-slate-100">Cópia do Bilhete de Identidade (BI)</span>
                          <span className="text-[10px] text-slate-400 font-bold block mt-0.5 font-mono">1.2 MB • PDF Verificado</span>
                        </div>
                      </div>
                      <span className="text-[10px] font-black uppercase text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full">Ok</span>
                    </div>

                    <div className="bg-slate-50/50 dark:bg-slate-950/20 p-4.5 rounded-2xl border border-slate-100 dark:border-slate-850 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-emerald-500/10 text-emerald-500 rounded-xl">
                          <Check className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="text-xs font-bold block text-slate-800 dark:text-slate-100">Memória Descritiva de Divisões</span>
                          <span className="text-[10px] text-slate-400 font-bold block mt-0.5 font-mono">2.4 MB • PDF Verificado</span>
                        </div>
                      </div>
                      <span className="text-[10px] font-black uppercase text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full">Ok</span>
                    </div>
                  </div>
                </div>

                {/* 5. PROCESS STEP TIMELINE */}
                <div className="space-y-5">
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">
                    Fases de Tramitação Interna
                  </h3>
                  
                  <div className="relative pl-6 border-l border-slate-150 dark:border-slate-800 space-y-6">
                    <div className="relative">
                      <div className="absolute -left-[30px] top-1 bg-emerald-500 border-4 border-white dark:border-slate-900 w-4 h-4 rounded-full" />
                      <div>
                        <span className="text-xs font-black text-slate-800 dark:text-slate-200">Entrada e Abertura Digital</span>
                        <p className="text-[10.5px] text-slate-450 font-bold uppercase tracking-wider opacity-60">Efetuado • {activeSelected.date}</p>
                      </div>
                    </div>

                    <div className="relative">
                      <div className={cn("absolute -left-[30px] top-1 border-4 border-white dark:border-slate-900 w-4 h-4 rounded-full",
                        activeSelected.status === 'pending' ? "bg-amber-400" :
                        activeSelected.status === 'rejected' ? "bg-rose-500" : "bg-emerald-500"
                      )} />
                      <div>
                        <span className="text-xs font-black text-slate-800 dark:text-slate-200">Vistoria Topográfica e Desenho GIS</span>
                        <p className="text-[10.5px] text-slate-450 font-bold uppercase tracking-wider opacity-60">
                          {activeSelected.status === 'pending' ? "Pendente Planejamento Vistoria" : "Análise Topográfica Ativa"}
                        </p>
                      </div>
                    </div>

                    <div className="relative">
                      <div className={cn("absolute -left-[30px] top-1 border-4 border-white dark:border-slate-900 w-4 h-4 rounded-full",
                        activeSelected.status === 'approved' ? "bg-emerald-500" : "bg-slate-300 dark:bg-slate-800"
                      )} />
                      <div>
                        <span className="text-xs font-black text-slate-800 dark:text-slate-200">Decisão e Emissão de Título Conservatório</span>
                        <p className="text-[10.5px] text-slate-450 font-bold uppercase tracking-wider opacity-60">Conservador Chefe</p>
                      </div>
                    </div>
                  </div>
                </div>

              </div>

              {/* Drawer Bottom Actions Sticky section */}
              <div className="p-8 border-t border-slate-150 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20 space-y-3.5">
                
                {/* RELATIONAL GIS ACTION DIRECT BUTTON */}
                <button 
                  onClick={() => {
                    // Pre-load current process ID in local storage for Delimitation mapping module
                    localStorage.setItem('STP_ACTIVE_DELIMIT_ID', activeSelected.id);
                    setSelectedProcess(null);
                    navigate('/delimitation');
                  }}
                  className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-2xl text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/15"
                >
                  <MapPin className="w-4.5 h-4.5" />
                  Abrir Croquis e Delimitar SIG
                </button>

                <div className="flex gap-3">
                  <button 
                    onClick={() => toggleProcessUrgency(activeSelected.id)}
                    className="flex-1 py-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 font-bold text-xs uppercase tracking-wider hover:bg-slate-100 dark:hover:bg-slate-850 text-slate-600 dark:text-slate-350 transition-colors"
                  >
                    {activeSelected.urgent ? "Remover Urgência" : "Tornar Urgente"}
                  </button>
                  <button 
                    onClick={() => handleDeleteProcess(activeSelected.id)}
                    className="py-3.5 px-5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 hover:text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center border border-rose-500/10"
                    title="Excluir Processo do Sistema"
                  >
                    <Trash2 className="w-4 h-4 shrink-0" />
                  </button>
                  <button 
                    onClick={() => setSelectedProcess(null)}
                    className="flex-1 py-3.5 rounded-xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 hover:opacity-90 font-bold text-xs uppercase tracking-wider transition-colors"
                  >
                    Fechar Dossier
                  </button>
                </div>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* CREATE NEW PROCESS MODAL */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 md:p-12">
            
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-950/70 backdrop-blur-md"
              onClick={() => setIsAddModalOpen(false)}
            />
            
            {/* Modal Content */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white dark:bg-slate-900 rounded-[2.5rem] w-full max-w-xl p-8 md:p-10 border border-slate-150 dark:border-slate-800 shadow-2xl z-10"
            >
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-2xl font-display font-black tracking-tight text-slate-900 dark:text-white">
                    Registrar Novo Processo
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">Insira os dados iniciais do requerimento cadastral.</p>
                </div>
                <button 
                  onClick={() => setIsAddModalOpen(false)}
                  className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-slate-400 hover:text-slate-700 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateProcess} className="space-y-5">
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase text-slate-450 tracking-wider">Nome do Requerente *</label>
                    <input 
                      type="text" 
                      required
                      value={newApplicant}
                      onChange={(e) => setNewApplicant(e.target.value)}
                      placeholder="Ex: Manuel de Carvalho"
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-205 dark:border-slate-800 text-sm font-medium focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500/50 text-slate-800 dark:text-white"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase text-slate-455 tracking-wider">NIF do Proprietário</label>
                    <input 
                      type="text" 
                      value={newNif}
                      onChange={(e) => setNewNif(e.target.value)}
                      placeholder="Ex: 500122455"
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-205 dark:border-slate-800 text-sm font-medium focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500/50 text-slate-800 dark:text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase text-slate-455 tracking-wider">Tipo de Processo</label>
                    <select 
                      value={newType}
                      onChange={(e) => setNewType(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-205 dark:border-slate-800 text-sm font-medium focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-555/50 text-slate-800 dark:text-white"
                    >
                      <option value="Concessão">Concessão</option>
                      <option value="Legalização">Legalização</option>
                      <option value="Transpasse">Transpasse</option>
                      <option value="Delimitação">Delimitação</option>
                      <option value="Reclamação">Reclamação</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase text-slate-455 tracking-wider">Distrito / Localidade</label>
                    <select 
                      value={newLocation}
                      onChange={(e) => setNewLocation(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-205 dark:border-slate-800 text-sm font-medium focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-555/50 text-slate-800 dark:text-white"
                    >
                      <option value="Água Grande, Chácara">Água Grande, Chácara</option>
                      <option value="Bairro do Hospital, Água Grande">Bairro do Hospital, Água Grande</option>
                      <option value="Trindade, Mé-Zóchi">Trindade, Mé-Zóchi</option>
                      <option value="Neves, Lembá">Neves, Lembá</option>
                      <option value="Guadalupe, Lobata">Guadalupe, Lobata</option>
                      <option value="Santana, Cantagalo">Santana, Cantagalo</option>
                      <option value="Porto Alegre, Caué">Porto Alegre, Caué</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase text-slate-455 tracking-wider">Contacto de Telefone</label>
                    <input 
                      type="text" 
                      value={newPhone}
                      onChange={(e) => setNewPhone(e.target.value)}
                      placeholder="Ex: +239 990 1234"
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-205 dark:border-slate-800 text-sm font-medium focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-510/50 text-slate-800 dark:text-white"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase text-slate-455 tracking-wider">Correio Eletrónico</label>
                    <input 
                      type="email" 
                      value={newEmail}
                      onChange={(e) => setNewEmail(e.target.value)}
                      placeholder="Ex: manuel@email.st"
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-205 dark:border-slate-800 text-sm font-medium focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-510/50 text-slate-800 dark:text-white"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-slate-455 tracking-wider">Descrição Detalhada do Pedido</label>
                  <textarea 
                    value={newDesc}
                    onChange={(e) => setNewDesc(e.target.value)}
                    placeholder="Descrição opcional com as confrontações estimadas, vizinhança e benfeitorias existentes..."
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-205 dark:border-slate-800 text-sm font-medium focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-510/50 text-slate-800 dark:text-white"
                  />
                </div>

                <div className="flex items-center gap-2 pb-2">
                  <input 
                    type="checkbox" 
                    id="newUrgent"
                    checked={newUrgent}
                    onChange={(e) => setNewUrgent(e.checked || e.target.checked)}
                    className="rounded border-slate-300 text-emerald-500 focus:ring-emerald-500 h-4 w-4"
                  />
                  <label htmlFor="newUrgent" className="text-xs font-bold text-slate-600 dark:text-slate-300 select-none cursor-pointer">
                    Solicitar processamento em regime urgente e prioritário
                  </label>
                </div>

                <div className="flex gap-3 pt-2">
                  <button 
                    type="button" 
                    onClick={() => setIsAddModalOpen(false)}
                    className="flex-1 py-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-100 font-bold text-xs uppercase tracking-widest text-slate-600 dark:text-slate-350 transition-colors"
                  >
                    Voltar
                  </button>
                  <button 
                    type="submit" 
                    className="flex-1 py-3.5 rounded-xl premium-gradient text-white font-bold text-xs uppercase tracking-widest shadow-lg shadow-emerald-500/25 hover:brightness-105 transition-all"
                  >
                    Criar Processo
                  </button>
                </div>

              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}

// Subcomponents
interface ProcessCardProps {
  key?: any;
  process: any;
  index: number;
  onClick: () => void;
}

function ProcessCard({ process, index, onClick }: ProcessCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.04 }}
      onClick={onClick}
      className="glass-card p-5 rounded-2xl shadow-sm hover:shadow-xl hover:border-emerald-500/30 dark:hover:border-slate-700 transition-all cursor-pointer group relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
    >
      <div className="flex justify-between items-start mb-3">
        <span className="text-[10px] font-mono font-black text-slate-400 group-hover:text-emerald-500 uppercase tracking-widest leading-none">
          {process.id}
        </span>
        {process.urgent && (
          <span className="flex items-center gap-1 text-[9px] font-black text-rose-500 bg-rose-500/10 px-2 py-0.5 rounded-full uppercase tracking-wider">
            Prioritário
          </span>
        )}
      </div>
      
      <h4 className="font-display font-black text-slate-900 dark:text-white text-base leading-tight group-hover:text-emerald-550 dark:group-hover:text-emerald-400 transition-colors mb-2">
        {process.applicant}
      </h4>
      
      <p className="text-xs text-slate-500 font-bold mb-4 flex items-center gap-1.5 opacity-80">
        <FileSignature className="w-3.5 h-3.5 text-slate-450" />
        Tipo: {process.type}
      </p>

      <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 shrink-0">
          <MapPin className="w-3.5 h-3.5 text-slate-400" />
          <span className="truncate max-w-[120px]">{process.location?.split(',')[0]}</span>
        </div>
        <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400">
          <Calendar className="w-3 h-3" />
          {process.date}
        </div>
      </div>
    </motion.div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles = {
    pending: 'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border border-amber-500/10',
    in_review: 'bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400 border border-blue-500/10',
    approved: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-500/10',
    rejected: 'bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-400 border border-red-500/10',
  };

  const labels = {
    pending: 'Pendente',
    in_review: 'Em Revisão',
    approved: 'Aprovado',
    rejected: 'Rejeitado',
  };

  return (
    <span className={cn("px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider block text-center min-w-[100px]", styles[status as keyof typeof styles])}>
      {labels[status as keyof typeof labels]}
    </span>
  );
}

// Visual placeholders
function FolderEmptyIcon({ className }: { className?: string }) {
  return (
    <svg 
      fill="none" 
      viewBox="0 0 24 24" 
      strokeWidth={1.5} 
      stroke="currentColor" 
      className={className}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-18.69-2.03c.52-3.136 3.242-5.47 6.474-5.47 3.232 0 5.954 2.334 6.474 5.47M3.75 18h16.5M3.75 15h16.5" />
    </svg>
  );
}
