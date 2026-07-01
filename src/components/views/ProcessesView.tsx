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
  ChevronLeft,
  Clock,
  Trash2,
  CheckSquare,
  Award,
  Check,
  FileSignature
} from "lucide-react";
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useNavigate } from "react-router-dom";
import { cn } from "../../lib/utils";

// Baseline original processes with enriched meta-details matching advanced e-Gov systems
const INITIAL_PROCESSES = [
  { 
    id: 'STP-001', 
    applicant: 'João Manuel', 
    type: 'Concessão de Terreno', 
    status: 'pending', 
    step: 1, // 1. Triagem & Admissibilidade
    date: '2026-06-15', 
    urgent: true, 
    location: 'Água Grande, Chácara', 
    phone: '+239 991 2345', 
    email: 'joao.manuel@email.st', 
    nif: '100456123', 
    desc: 'Requerimento para concessão definitiva de lote urbano de 1200m² destinado à habitação própria unifamiliar.',
    checklist: { bi: true, fees: true, title_chain: false, non_overlap: false, neighbors: false, director_sign: false, cert_seal: false }
  },
  { 
    id: 'STP-002', 
    applicant: 'Maria das Dores', 
    type: 'Legalização de Posse', 
    status: 'in_review', 
    step: 3, // 3. Vistoria SIG & Delimitação
    date: '2026-06-14', 
    urgent: false, 
    location: 'Trindade, Mé-Zóchi', 
    phone: '+239 990 8765', 
    email: 'maria.dores@email.st', 
    nif: '100789456', 
    desc: 'Processo de legalização de vivenda unifamiliar construída em parcelamento informal sem registro original anterior.',
    checklist: { bi: true, fees: true, title_chain: true, non_overlap: false, neighbors: false, director_sign: false, cert_seal: false }
  },
  { 
    id: 'STP-003', 
    applicant: 'António Silva', 
    type: 'Transpasse / Averbamento', 
    status: 'approved', 
    step: 6, // 6. Emissão de Título Digital
    date: '2026-06-12', 
    urgent: false, 
    location: 'Neves, Lembá', 
    phone: '+239 995 4321', 
    email: 'antonio.silva@email.st', 
    nif: '101234567', 
    desc: 'Transpasse de propriedade de parcelas rústicas florestais exploradas sob concessão provisória agrícola.',
    checklist: { bi: true, fees: true, title_chain: true, non_overlap: true, neighbors: true, director_sign: true, cert_seal: true }
  },
  { 
    id: 'STP-004', 
    applicant: 'Construções STP Lda', 
    type: 'Representação Gráfica (RGG)', 
    status: 'pending', 
    step: 2, // 2. Auditoria Legal & Registo
    date: '2026-06-11', 
    urgent: true, 
    location: 'Bairro do Hospital, Água Grande', 
    phone: '+239 992 5566', 
    email: 'contacto@construcoesstp.st', 
    nif: '500122345', 
    desc: 'Identificação georreferenciada via SIG de lote com área aproximada de 1.245m² do domínio privado do estado.',
    checklist: { bi: true, fees: true, title_chain: false, non_overlap: false, neighbors: false, director_sign: false, cert_seal: false }
  },
  { 
    id: 'STP-005', 
    applicant: 'Isabel Rocha', 
    type: 'Resolução de Conflitos', 
    status: 'in_review', 
    step: 4, // 4. Consulta Pública & Confrontantes
    date: '2026-06-10', 
    urgent: false, 
    location: 'Guadalupe, Lobata', 
    phone: '+239 997 1212', 
    email: 'isabel.rocha@email.st', 
    nif: '100554433', 
    desc: 'Litígio decorrente de sobreposição involuntária de confrontações em herança predial de partilha familiar.',
    checklist: { bi: true, fees: true, title_chain: true, non_overlap: true, neighbors: false, director_sign: false, cert_seal: false }
  },
  { 
    id: 'STP-006', 
    applicant: 'Pedro Afonso', 
    type: 'Certidão Cadastral', 
    status: 'rejected', 
    step: 5, // 5. Homologação & Despacho
    date: '2026-06-08', 
    urgent: false, 
    location: 'Porto Alegre, Caué', 
    phone: '+239 999 8877', 
    email: 'pedro.afonso@email.st', 
    nif: '100223344', 
    desc: 'Pedido de emissão de certidão de limites cadastrais. Rejeitado por dados em falta e ausência de vistoria prévia.',
    checklist: { bi: true, fees: true, title_chain: true, non_overlap: false, neighbors: false, director_sign: false, cert_seal: false }
  },
];

const COLUMNS = [
  { id: 'pending', label: 'Pendentes', color: 'amber' },
  { id: 'in_review', label: 'Em Revisão', color: 'blue' },
  { id: 'approved', label: 'Aprovados', color: 'emerald' },
  { id: 'rejected', label: 'Rejeitados', color: 'red' },
];

const ADVANCED_STAGES = [
  { id: 1, label: '1. Triagem de Entrada', color: 'slate', key: 'intake', desc: 'Validar formalmente documento de entrada e taxas administrativas.' },
  { id: 2, label: '2. Auditoria Legal Registral', color: 'blue', key: 'legal', desc: 'Certidão histórico predial, busca de registo prévio e ónus.' },
  { id: 3, label: '3. Medição SIG & Vistoria', color: 'indigo', key: 'sig', desc: 'Levantamento topográfico, GPS centimétrico, topologia cadastral.' },
  { id: 4, label: '4. Consulta de Confrontantes', color: 'amber', key: 'public', desc: 'Notificação de confinantes com prazo legal de 15 dias sem impugnações.' },
  { id: 5, label: '5. Despacho & Homologação', color: 'violet', key: 'decision', desc: 'Despacho assinado de concessão da Direção de Geografia e Cadastro.' },
  { id: 6, label: '6. Emissão de Título Digital', color: 'emerald', key: 'issue', desc: 'Geração de certificado com assinatura criptográfica e-Gov.' }
];

export function ProcessesView() {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<'board' | 'list'>('board');
  const [isMobile, setIsMobile] = useState(false);
  const [isBoardDragging, setIsBoardDragging] = useState(false);
  const [canScrollBoardLeft, setCanScrollBoardLeft] = useState(false);
  const [canScrollBoardRight, setCanScrollBoardRight] = useState(false);
  const [workflowMode, setWorkflowMode] = useState<'traditional' | 'international'>('international');
  const [drawerTab, setDrawerTab] = useState<'dossier' | 'title'>('dossier');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const boardScrollRef = useRef<HTMLDivElement | null>(null);
  const boardDragStateRef = useRef({
    isDragging: false,
    startX: 0,
    startScrollLeft: 0,
    moved: false,
  });

  // active selected process for drawer
  const [selectedProcess, setSelectedProcess] = useState<any | null>(null);

  // Reset tab when selection changes
  useEffect(() => {
    setDrawerTab('dossier');
  }, [selectedProcess]);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (isMobile && viewMode !== 'list') {
      setViewMode('list');
    }
  }, [isMobile, viewMode]);

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

  useEffect(() => {
    const boardNode = boardScrollRef.current;
    if (!boardNode || viewMode !== 'board') {
      setCanScrollBoardLeft(false);
      setCanScrollBoardRight(false);
      return;
    }

    const updateBoardScrollState = () => {
      const { scrollLeft, scrollWidth, clientWidth } = boardNode;
      setCanScrollBoardLeft(scrollLeft > 8);
      setCanScrollBoardRight(scrollLeft + clientWidth < scrollWidth - 8);
    };

    updateBoardScrollState();
    boardNode.addEventListener('scroll', updateBoardScrollState, { passive: true });
    window.addEventListener('resize', updateBoardScrollState);

    return () => {
      boardNode.removeEventListener('scroll', updateBoardScrollState);
      window.removeEventListener('resize', updateBoardScrollState);
    };
  }, [viewMode, workflowMode, filteredProcesses.length]);

  // Handle status update of selected process
  const updateProcessStatus = (procId: string, newStatus: string) => {
    setProcesses(prev => 
      prev.map(p => {
        if (p.id === procId) {
          let syncStep = p.step || 1;
          if (newStatus === 'pending' && syncStep > 2) syncStep = 1;
          else if (newStatus === 'in_review' && (syncStep < 3 || syncStep > 5)) syncStep = 3;
          else if (newStatus === 'approved') syncStep = 6;
          return { ...p, status: newStatus, step: syncStep };
        }
        return p;
      })
    );
    showToast(`O estado do processo ${procId} foi atualizado com sucesso!`, 'success');
  };

  // Handle step update in advanced e-Gov workflow
  const updateProcessStep = (procId: string, nextStep: number) => {
    setProcesses(prev => 
      prev.map(p => {
        if (p.id === procId) {
          let autoStatus = p.status;
          if (nextStep === 6) autoStatus = 'approved';
          else if (nextStep === 1 || nextStep === 2) autoStatus = 'pending';
          else if (nextStep === 3 || nextStep === 4 || nextStep === 5) autoStatus = 'in_review';
          return { ...p, step: nextStep, status: autoStatus };
        }
        return p;
      })
    );
    const stageName = ADVANCED_STAGES.find(s => s.id === nextStep)?.label || 'Etapa';
    showToast(`Dossier promovido para: ${stageName}!`, 'success');
  };

  const scrollBoardByViewport = (direction: 'left' | 'right') => {
    const boardNode = boardScrollRef.current;
    if (!boardNode) return;

    const amount = Math.max(boardNode.clientWidth * 0.72, 280);
    boardNode.scrollBy({
      left: direction === 'right' ? amount : -amount,
      behavior: 'smooth',
    });
  };

  const handleBoardPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (isMobile || event.button !== 0) return;

    const boardNode = boardScrollRef.current;
    if (!boardNode) return;

    boardDragStateRef.current = {
      isDragging: true,
      startX: event.clientX,
      startScrollLeft: boardNode.scrollLeft,
      moved: false,
    };

    setIsBoardDragging(true);
    boardNode.setPointerCapture(event.pointerId);
  };

  const handleBoardPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const boardNode = boardScrollRef.current;
    const dragState = boardDragStateRef.current;
    if (!boardNode || !dragState.isDragging) return;

    const deltaX = event.clientX - dragState.startX;
    if (Math.abs(deltaX) > 6) {
      dragState.moved = true;
    }

    boardNode.scrollLeft = dragState.startScrollLeft - deltaX;
  };

  const handleBoardPointerEnd = (event: React.PointerEvent<HTMLDivElement>) => {
    const boardNode = boardScrollRef.current;
    const dragState = boardDragStateRef.current;
    if (!boardNode || !dragState.isDragging) return;

    dragState.isDragging = false;
    setIsBoardDragging(false);

    if (boardNode.hasPointerCapture(event.pointerId)) {
      boardNode.releasePointerCapture(event.pointerId);
    }

    window.setTimeout(() => {
      boardDragStateRef.current.moved = false;
    }, 0);
  };

  const handleBoardClickCapture = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!boardDragStateRef.current.moved) return;
    event.preventDefault();
    event.stopPropagation();
  };

  // Toggle dynamic checklist item state
  const toggleChecklistItem = (procId: string, itemKey: string) => {
    setProcesses(prev => 
      prev.map(p => {
        if (p.id === procId) {
          const checklist = p.checklist || { bi: false, fees: false, title_chain: false, non_overlap: false, neighbors: false, director_sign: false, cert_seal: false };
          return {
            ...p,
            checklist: {
              ...checklist,
              [itemKey]: !checklist[itemKey as keyof typeof checklist]
            }
          };
        }
        return p;
      })
    );
    showToast('Checklist de conformidade atualizada.', 'info');
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
      step: 1,
      date: new Date().toISOString().split('T')[0],
      urgent: newUrgent,
      location: newLocation,
      phone: newPhone || '+239 990 0000',
      email: newEmail || `${newApplicant.toLowerCase().replace(/\s+/g, '')}@email.st`,
      nif: newNif || '100888999',
      desc: newDesc || 'Instrução inicial cadastral sem memória descritiva complementar.',
      checklist: { bi: true, fees: false, title_chain: false, non_overlap: false, neighbors: false, director_sign: false, cert_seal: false }
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
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-display font-black tracking-tighter">Gestão de Processos</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium">Acompanhe, ordene, delibere e altere estados dos dossiês administrativos e territoriais.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3 shrink-0">
          
          {/* Developed country vs simplified workflow toggle */}
          <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200/40 dark:border-slate-700/40">
            <button 
              onClick={() => {
                setWorkflowMode('traditional');
                showToast('Alternado para Fluxo Simplificado (4 Estados).', 'info');
              }}
              title="Fluxo Simplificado Tradicional"
              className={cn(
                "px-3.5 py-2.5 rounded-lg transition-all text-xs font-black uppercase tracking-wider", 
                workflowMode === 'traditional' 
                  ? "bg-white dark:bg-slate-700 shadow-sm text-slate-800 dark:text-white" 
                  : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-350"
              )}
            >
              Fases Simples
            </button>
            <button 
              onClick={() => {
                setWorkflowMode('international');
                showToast('Alternado para Fluxo e-Gov Internacional (6 Etapas).', 'success');
              }}
              title="Fluxo de Tramitação e-Gov de Alta Resolução (Padrão Suíça & Estónia)"
              className={cn(
                "px-3.5 py-2.5 rounded-lg transition-all text-xs font-black uppercase tracking-wider flex items-center gap-1.5", 
                workflowMode === 'international' 
                  ? "bg-emerald-500 text-white shadow-sm font-black" 
                  : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-350"
              )}
            >
              <FileSignature className="w-3.5 h-3.5" />
              e-Gov Avançado (6 Passos)
            </button>
          </div>

          <div className={cn("bg-slate-100 dark:bg-slate-800 p-1 rounded-xl", isMobile ? "hidden" : "flex")}>
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
          <div className="px-4 py-2.5 bg-slate-100 dark:bg-slate-950 border border-slate-100 dark:border-slate-850 rounded-xl text-xs font-black uppercase tracking-wider text-slate-500 flex items-center gap-2">
            <CheckSquare className="w-3.5 h-3.5 text-emerald-500" />
            <span>Resultados: {filteredProcesses.length}</span>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showFilters && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-3xl overflow-hidden shadow-sm mb-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Estado / Fase</label>
                <select className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 px-4 py-2.5 rounded-xl text-sm font-medium focus:outline-none focus:border-emerald-500">
                  <option value="">Todas as Fases</option>
                  <option value="entry">Entrada do Pedido</option>
                  <option value="field">Trabalho de Campo</option>
                  <option value="juridic">Análise Jurídica</option>
                  <option value="issue">Emissão</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Urgência</label>
                <select className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 px-4 py-2.5 rounded-xl text-sm font-medium focus:outline-none focus:border-emerald-500">
                  <option value="">Qualquer Prioridade</option>
                  <option value="urgent">Urgente</option>
                  <option value="normal">Normal</option>
                </select>
              </div>
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
            </div>
            <div className="flex justify-end mt-6">
              <button 
                onClick={() => setShowFilters(false)}
                className="px-5 py-2.5 bg-emerald-500 text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-emerald-600 transition-colors"
              >
                Aplicar Filtros
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* RENDER VIEW SCHEME */}
      <div className="relative pb-4">
        {viewMode === 'board' ? (
          /* KANBAN BOARD VIEW */
          <>
            <AnimatePresence>
              {canScrollBoardLeft && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="pointer-events-none absolute inset-y-4 left-0 z-10 hidden lg:block w-24 bg-gradient-to-r from-slate-200 via-slate-200/85 to-transparent dark:from-slate-950 dark:via-slate-950/80"
                />
              )}
            </AnimatePresence>

            <AnimatePresence>
              {canScrollBoardRight && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="pointer-events-none absolute inset-y-4 right-0 z-10 hidden lg:block w-24 bg-gradient-to-l from-slate-200 via-slate-200/85 to-transparent dark:from-slate-950 dark:via-slate-950/80"
                />
              )}
            </AnimatePresence>

            <div className="absolute right-0 -top-2 hidden lg:flex items-center gap-2 z-20">
              <button
                type="button"
                onClick={() => scrollBoardByViewport('left')}
                disabled={!canScrollBoardLeft}
                className="w-10 h-10 rounded-full border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm shadow-sm flex items-center justify-center text-slate-500 disabled:opacity-35 disabled:cursor-not-allowed hover:text-slate-900 dark:hover:text-white transition-colors"
                title="Ver colunas anteriores"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => scrollBoardByViewport('right')}
                disabled={!canScrollBoardRight}
                className="w-10 h-10 rounded-full border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm shadow-sm flex items-center justify-center text-slate-500 disabled:opacity-35 disabled:cursor-not-allowed hover:text-slate-900 dark:hover:text-white transition-colors"
                title="Ver próximas colunas"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="mb-3 flex items-center justify-between lg:hidden">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                Deslize horizontalmente para ver mais colunas
              </p>
              <div className="flex items-center gap-1.5">
                <span className={cn("h-1.5 w-1.5 rounded-full transition-colors", canScrollBoardLeft ? "bg-emerald-500" : "bg-slate-300 dark:bg-slate-700")} />
                <span className={cn("h-1.5 w-1.5 rounded-full transition-colors", canScrollBoardRight ? "bg-emerald-500" : "bg-slate-300 dark:bg-slate-700")} />
              </div>
            </div>

            <div
              ref={boardScrollRef}
              onPointerDown={handleBoardPointerDown}
              onPointerMove={handleBoardPointerMove}
              onPointerUp={handleBoardPointerEnd}
              onPointerLeave={handleBoardPointerEnd}
              onPointerCancel={handleBoardPointerEnd}
              onClickCapture={handleBoardClickCapture}
              className={cn(
                "flex gap-6 min-w-[1000px] mt-4 overflow-x-auto scroll-smooth snap-x snap-mandatory pr-6 select-none",
                isMobile ? "cursor-auto" : isBoardDragging ? "cursor-grabbing" : "cursor-grab"
              )}
            >
            {workflowMode === 'traditional' ? (
              COLUMNS.map(column => {
                const colProcesses = filteredProcesses.filter(p => p.status === column.id);
                return (
                  <div key={column.id} className="flex-1 min-w-[250px] space-y-4 snap-start">
                    
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
                            workflowMode={workflowMode}
                          />
                        ))
                      )}
                    </div>

                  </div>
                );
              })
            ) : (
              ADVANCED_STAGES.map(stage => {
                const colProcesses = filteredProcesses.filter(p => (p.step || 1) === stage.id);
                return (
                  <div key={stage.id} className="flex-1 min-w-[260px] space-y-4 snap-start">
                    
                    {/* Column Title Banner */}
                    <div className="flex items-center justify-between px-3 pb-1 border-b border-slate-100 dark:border-slate-800/10">
                      <div className="flex flex-col gap-1.5">
                        <div className="flex items-center gap-2.5">
                          <div className={cn("w-3.5 h-3.5 rounded-full", getColumnColorClass(stage.color))} />
                          <h4 className="font-display font-black text-xs uppercase tracking-wider text-slate-800 dark:text-slate-200">
                            {stage.label.split('. ')[1]}
                          </h4>
                          <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-2 py-0.5 rounded-full text-[9px] font-black">
                            {colProcesses.length}
                          </span>
                        </div>
                        <p className="text-[9.5px] font-medium text-slate-400 leading-tight block truncate max-w-[210px]" title={stage.desc}>
                          {stage.desc}
                        </p>
                      </div>
                    </div>
                    
                    {/* Column Container */}
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
                            workflowMode={workflowMode}
                          />
                        ))
                      )}
                    </div>
                  </div>
                );
              })
            )}
            </div>
          </>
        ) : (
          /* TABULAR DETAILED LIST VIEW */
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 rounded-3xl overflow-hidden shadow-sm mt-4">
              {/* DESKTOP TABLE VIEW */}
              <div className="hidden lg:block overflow-x-auto">
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
                            {workflowMode === 'international' ? (
                              <div className="flex items-center gap-2">
                                <span className="text-[10px] font-bold font-mono bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 px-2 py-1 rounded border border-emerald-500/10 shrink-0">
                                  Etapa {process.step || 1} de 6
                                </span>
                                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 truncate max-w-[150px]" title={ADVANCED_STAGES.find(s => s.id === (process.step || 1))?.label}>
                                  {ADVANCED_STAGES.find(s => s.id === (process.step || 1))?.label.split('. ')[1]}
                                </span>
                              </div>
                            ) : (
                              <StatusBadge status={process.status} />
                            )}
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

              {/* MOBILE RESPONSIVE CARDS VIEW */}
              <div className="block lg:hidden p-4">
                {filteredProcesses.length === 0 ? (
                  <div className="py-12 text-center">
                    <div className="max-w-xs mx-auto space-y-2 opacity-50">
                      <X className="w-10 h-10 text-rose-500 mx-auto" />
                      <p className="font-display font-black text-lg text-slate-800 dark:text-slate-200">Nenhum processo localizado</p>
                      <p className="text-xs text-slate-400 font-medium">Altere os termos da busca para obter resultados.</p>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredProcesses.map((process, i) => (
                      <div 
                        key={process.id}
                        onClick={() => setSelectedProcess(process)}
                        className="bg-slate-50/50 dark:bg-slate-950/25 hover:bg-slate-50 dark:hover:bg-slate-950/40 p-5 rounded-2xl border border-slate-100/80 dark:border-slate-850 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between gap-4 group"
                      >
                        <div>
                          <div className="flex items-start justify-between mb-3">
                            <span className="font-mono font-black text-sm text-emerald-600 dark:text-emerald-400 bg-emerald-500/5 px-2.5 py-1 rounded-lg">
                              {process.id}
                            </span>
                            <div className="flex items-center gap-2">
                              {process.urgent && (
                                <span className="text-[10px] font-black text-white bg-rose-500 px-2 py-0.5 rounded-full uppercase tracking-wider">
                                  Urgente
                                </span>
                              )}
                              <span className="text-[10px] font-bold font-mono text-slate-400 dark:text-slate-500">{process.date}</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 flex items-center justify-center shrink-0">
                              <User className="w-4.5 h-4.5 text-emerald-500" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="font-bold text-sm tracking-tight text-slate-800 dark:text-slate-100 truncate">{process.applicant}</p>
                              <p className="text-[10px] font-semibold text-slate-400 dark:text-slate-500">NIF {process.nif}</p>
                            </div>
                          </div>

                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded text-slate-700 dark:text-slate-300">
                              {process.type}
                            </span>
                            <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                              <span className="truncate max-w-[170px]">{process.location}</span>
                            </div>
                          </div>
                        </div>

                        <div className="pt-3 border-t border-slate-100 dark:border-slate-850/80 flex items-center justify-between gap-2.5 mt-1">
                          <div className="min-w-0 flex-1">
                            {workflowMode === 'international' ? (
                              <div className="flex items-center gap-1.5">
                                <span className="text-[9px] font-bold font-mono bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 px-1.5 py-0.5 rounded border border-emerald-500/15 shrink-0">
                                  Fase {process.step || 1}/6
                                </span>
                                <span className="text-[11px] font-bold text-slate-600 dark:text-slate-300 truncate" title={ADVANCED_STAGES.find(s => s.id === (process.step || 1))?.label}>
                                  {ADVANCED_STAGES.find(s => s.id === (process.step || 1))?.label.split('. ')[1]}
                                </span>
                              </div>
                            ) : (
                              <StatusBadge status={process.status} />
                            )}
                          </div>

                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedProcess(process);
                            }}
                            className="p-1 px-3 bg-white hover:bg-slate-50 dark:bg-slate-900 dark:hover:bg-slate-850 hover:border-emerald-500/30 rounded-lg transition-all text-[11px] font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1 ml-auto border border-emerald-500/10 shrink-0"
                          >
                            Ver
                            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
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

              {/* TABS NAVIGATION FOR DOSSIER INFO VS OFFICIAL TITLE CERTIFICATE */}
              <div className="flex bg-slate-50 dark:bg-slate-950 px-8 py-3.5 border-b border-slate-150 dark:border-slate-800 gap-4">
                <button 
                  onClick={() => setDrawerTab('dossier')}
                  className={cn(
                    "text-xs font-black uppercase tracking-wider pb-2 border-b-2 transition-all",
                    drawerTab === 'dossier' 
                      ? "border-emerald-500 text-emerald-600 dark:text-emerald-400 font-black" 
                      : "border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-350"
                  )}
                >
                  Dossiê de Processo
                </button>
                <button 
                  onClick={() => setDrawerTab('title')}
                  className={cn(
                    "text-xs font-black uppercase tracking-wider pb-2 border-b-2 transition-all flex items-center gap-1.5",
                    drawerTab === 'title' 
                      ? "border-emerald-500 text-emerald-600 dark:text-emerald-400 font-black" 
                      : "border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-350"
                  )}
                >
                  <Award className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />
                  Título Oficial
                </button>
              </div>

              {/* Drawer Scrollable Content Area */}
              <div className="flex-1 p-8 space-y-8">
                {drawerTab === 'dossier' ? (
                  <>
                    {/* 1. SECTOR DE ESTADO (INTERACTIVE STATUS STATE MACHINE SWITCHER) */}
                    {workflowMode === 'traditional' ? (
                      <div className="space-y-3 bg-slate-50/50 dark:bg-slate-950/20 p-5 rounded-2xl border border-slate-150/40 dark:border-slate-800/40">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] block">
                          Tramitação e Estado Corrente (Tradicional)
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
              ) : (
                <div className="space-y-4 bg-slate-50/50 dark:bg-slate-950/20 p-6 rounded-2xl border border-slate-150/50 dark:border-slate-800/50">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200/50 dark:border-slate-800/50">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] flex items-center gap-1.5">
                      <FileSignature className="w-3.5 h-3.5 text-emerald-500" />
                      Ciclo e-Gov Internacional (Suíça/Estónia)
                    </span>
                    <span className="text-xs font-black text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full">
                      Etapa {activeSelected.step || 1} de 6
                    </span>
                  </div>

                  {/* Progress tracking line */}
                  <div className="flex justify-between items-center gap-1.5 py-2">
                    {ADVANCED_STAGES.map(s => {
                      const isPast = s.id < (activeSelected.step || 1);
                      const isCurrent = s.id === (activeSelected.step || 1);
                      return (
                        <button
                          key={s.id}
                          onClick={() => updateProcessStep(activeSelected.id, s.id)}
                          title={s.label}
                          className={cn(
                            "h-2.5 flex-1 rounded-full transition-all duration-300 relative group",
                            isPast ? "bg-emerald-500" :
                            isCurrent ? "bg-emerald-500 relative ring-4 ring-emerald-500/10 h-3" :
                            "bg-slate-200 dark:bg-slate-800 hover:bg-slate-300"
                          )}
                        >
                          {/* Hover tooltip */}
                          <span className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-slate-900 border border-slate-750 text-white text-[9.5px] font-bold py-1 px-2.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-xl z-20">
                            {s.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Active phase summary information */}
                  <div className="bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 p-4.5 rounded-2xl space-y-1.5 shadow-sm">
                    <div className="flex items-center justify-between">
                      <span className="font-display font-black text-sm text-slate-800 dark:text-slate-100">
                        {ADVANCED_STAGES.find(s => s.id === (activeSelected.step || 1))?.label}
                      </span>
                      <span className="text-[10px] uppercase font-black tracking-widest text-emerald-500 px-2.5 py-0.5 rounded-full bg-emerald-500/10 animate-pulse">
                        Em Curso
                      </span>
                    </div>
                    <p className="text-xs font-medium text-slate-450 dark:text-slate-400 leading-relaxed">
                      {ADVANCED_STAGES.find(s => s.id === (activeSelected.step || 1))?.desc}
                    </p>
                  </div>

                  {/* STEP NAVIGATION SHORTCUT BUTTONS */}
                  <div className="flex gap-2 pt-1">
                    <button
                      onClick={() => {
                        const prevS = Math.max(1, (activeSelected.step || 1) - 1);
                        updateProcessStep(activeSelected.id, prevS);
                      }}
                      disabled={(activeSelected.step || 1) === 1}
                      className="flex-1 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 disabled:opacity-40"
                    >
                      ← Voltar Etapa
                    </button>
                    <button
                      onClick={() => {
                        const nextS = Math.min(6, (activeSelected.step || 1) + 1);
                        updateProcessStep(activeSelected.id, nextS);
                      }}
                      disabled={(activeSelected.step || 1) === 6}
                      className="flex-1 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider bg-emerald-500 hover:bg-emerald-600 text-white disabled:opacity-40"
                    >
                      Avançar Etapa →
                    </button>
                  </div>
                </div>
              )}

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

                    {/* 5. PROCESS STEP TIMELINE vs COMPLIANCE AUDIT */}
                    {workflowMode === 'international' ? (
                      <div className="space-y-4 bg-slate-50/20 border border-slate-150 dark:border-slate-800 p-6 rounded-3xl">
                        <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
                          <div>
                            <h3 className="text-xs font-black text-slate-800 dark:text-slate-150 uppercase tracking-widest flex items-center gap-1.5">
                              <CheckCircle className="w-4 h-4 text-emerald-500" />
                              Auditoria de Conformidade e-Gov
                            </h3>
                            <p className="text-[10px] font-bold text-slate-400 mt-1">Requisitos de robustez predial requeridos na União Europeia</p>
                          </div>
                          <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-605 dark:text-emerald-400 rounded-full text-[10px] font-black font-mono">
                            {Object.values(activeSelected.checklist || {}).filter(Boolean).length}/7 Vistos
                          </span>
                        </div>

                        <div className="space-y-3 pt-1">
                          
                          {/* Checkbox 1: BI */}
                          <label className="flex items-start gap-3.5 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-950/25 transition-all border border-transparent hover:border-slate-100 dark:hover:border-slate-800/35 cursor-pointer select-none">
                            <input 
                              type="checkbox"
                              checked={!!activeSelected.checklist?.bi}
                              onChange={() => toggleChecklistItem(activeSelected.id, 'bi')}
                              className="mt-1 h-4 w-4 rounded border-slate-300 dark:border-slate-700 text-emerald-600 focus:ring-emerald-500"
                            />
                            <div>
                              <span className={cn("text-xs font-bold block", activeSelected.checklist?.bi ? "line-through text-slate-400" : "text-slate-800 dark:text-slate-205")}>
                                Bilhete de Identidade (BI) Validado
                              </span>
                              <span className="text-[10px] text-slate-400 block font-bold leading-tight mt-0.5">Validação automática de integridade civil e fiscal em tempo-real. (Etapa 1)</span>
                            </div>
                          </label>

                          {/* Checkbox 2: Fees */}
                          <label className="flex items-start gap-3.5 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-950/25 transition-all border border-transparent hover:border-slate-100 dark:hover:border-slate-800/35 cursor-pointer select-none">
                            <input 
                              type="checkbox"
                              checked={!!activeSelected.checklist?.fees}
                              onChange={() => toggleChecklistItem(activeSelected.id, 'fees')}
                              className="mt-1 h-4 w-4 rounded border-slate-300 dark:border-slate-700 text-emerald-600 focus:ring-emerald-500"
                            />
                            <div>
                              <span className={cn("text-xs font-bold block", activeSelected.checklist?.fees ? "line-through text-slate-400" : "text-slate-800 dark:text-slate-205")}>
                                Emolumentos e Taxas Liquidadas
                              </span>
                              <span className="text-[10px] text-slate-400 block font-bold leading-tight mt-0.5">Confirmação de recebimento através da plataforma bancária segura. (Etapa 1)</span>
                            </div>
                          </label>

                          {/* Checkbox 3: Title Chain */}
                          <label className="flex items-start gap-3.5 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-950/25 transition-all border border-transparent hover:border-slate-100 dark:hover:border-slate-800/35 cursor-pointer select-none">
                            <input 
                              type="checkbox"
                              checked={!!activeSelected.checklist?.title_chain}
                              onChange={() => toggleChecklistItem(activeSelected.id, 'title_chain')}
                              className="mt-1 h-4 w-4 rounded border-slate-300 dark:border-slate-700 text-emerald-600 focus:ring-emerald-500"
                            />
                            <div>
                              <span className={cn("text-xs font-bold block", activeSelected.checklist?.title_chain ? "line-through text-slate-400" : "text-slate-800 dark:text-slate-205")}>
                                Pesquisa de Ónus e Cadeia de Domínio
                              </span>
                              <span className="text-[10px] text-slate-400 block font-bold leading-tight mt-0.5">Pesquisa histórica contra falsificações, ónus judiciais ou heranças ativas. (Etapa 2)</span>
                            </div>
                          </label>

                          {/* Checkbox 4: Non overlap */}
                          <label className="flex items-start gap-3.5 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-950/25 transition-all border border-transparent hover:border-slate-100 dark:hover:border-slate-800/35 cursor-pointer select-none">
                            <input 
                              type="checkbox"
                              checked={!!activeSelected.checklist?.non_overlap}
                              onChange={() => toggleChecklistItem(activeSelected.id, 'non_overlap')}
                              className="mt-1 h-4 w-4 rounded border-slate-300 dark:border-slate-700 text-emerald-600 focus:ring-emerald-500"
                            />
                            <div>
                              <span className={cn("text-xs font-bold block", activeSelected.checklist?.non_overlap ? "line-through text-slate-400" : "text-slate-800 dark:text-slate-205")}>
                                Consistência SIG (Sem Sobreposições)
                              </span>
                              <span className="text-[10px] text-slate-400 block font-bold leading-tight mt-0.5">Vetorização e certificação de que as divisas não colidem com vias ou confrontantes. (Etapa 3)</span>
                            </div>
                          </label>

                          {/* Checkbox 5: Neighbors */}
                          <label className="flex items-start gap-3.5 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-950/25 transition-all border border-transparent hover:border-slate-100 dark:hover:border-slate-800/35 cursor-pointer select-none">
                            <input 
                              type="checkbox"
                              checked={!!activeSelected.checklist?.neighbors}
                              onChange={() => toggleChecklistItem(activeSelected.id, 'neighbors')}
                              className="mt-1 h-4 w-4 rounded border-slate-300 dark:border-slate-700 text-emerald-600 focus:ring-emerald-500"
                            />
                            <div>
                              <span className={cn("text-xs font-bold block", activeSelected.checklist?.neighbors ? "line-through text-slate-400" : "text-slate-800 dark:text-slate-205")}>
                                Notificação e Acordo dos Confrontantes
                              </span>
                              <span className="text-[10px] text-slate-400 block font-bold leading-tight mt-0.5">Período de consulta pública legalmente vencido sem oposição registada. (Etapa 4)</span>
                            </div>
                          </label>

                          {/* Checkbox 6: Director Sign */}
                          <label className="flex items-start gap-3.5 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-950/25 transition-all border border-transparent hover:border-slate-100 dark:hover:border-slate-800/35 cursor-pointer select-none">
                            <input 
                              type="checkbox"
                              checked={!!activeSelected.checklist?.director_sign}
                              onChange={() => toggleChecklistItem(activeSelected.id, 'director_sign')}
                              className="mt-1 h-4 w-4 rounded border-slate-300 dark:border-slate-700 text-emerald-600 focus:ring-emerald-500"
                            />
                            <div>
                              <span className={cn("text-xs font-bold block", activeSelected.checklist?.director_sign ? "line-through text-slate-400" : "text-slate-800 dark:text-slate-250")}>
                                Parecer Administrativo Homologado
                              </span>
                              <span className="text-[10px] text-slate-400 block font-bold leading-tight mt-0.5">Suficiência jurídica e decisão favorável assinada pelo Conservador de Registo. (Etapa 5)</span>
                            </div>
                          </label>

                          {/* Checkbox 7: Cert Seal */}
                          <label className="flex items-start gap-3.5 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-950/25 transition-all border border-transparent hover:border-slate-100 dark:hover:border-slate-800/35 cursor-pointer select-none">
                            <input 
                              type="checkbox"
                              checked={!!activeSelected.checklist?.cert_seal}
                              onChange={() => toggleChecklistItem(activeSelected.id, 'cert_seal')}
                              className="mt-1 h-4 w-4 rounded border-slate-300 dark:border-slate-700 text-emerald-600 focus:ring-emerald-500"
                            />
                            <div>
                              <span className={cn("text-xs font-bold block", activeSelected.checklist?.cert_seal ? "line-through text-slate-400" : "text-slate-800 dark:text-slate-205")}>
                                Selo Criptográfico Lavrado em Blockchain
                              </span>
                              <span className="text-[10px] text-slate-400 block font-bold leading-tight mt-0.5">Lavratura do hash e-Gov no sistema criptográfico para blindagem de dados contra subornos. (Etapa 6)</span>
                            </div>
                          </label>
                        </div>
                      </div>
                    ) : (
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
                              <span className="text-xs font-black text-slate-800 dark:text-slate-200">Vistoria Topográfica e Desenho SIG</span>
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
                    )}
                  </>
                ) : (
                  /* DYNAMIC TITLE VIEW DEPENDING ON STATUS */
                  <div className="space-y-6">
                    {/* Official certificate style border layout container */}
                    <div className={cn(
                      "p-6 sm:p-8 rounded-[2rem] border-2 relative overflow-hidden backdrop-blur-md shadow-xl transition-all duration-300",
                      activeSelected.status === 'approved' ? "bg-emerald-500/[0.02] border-emerald-500/30 dark:border-emerald-500/20 shadow-emerald-500/5" :
                      activeSelected.status === 'rejected' ? "bg-rose-500/[0.02] border-rose-500/30 dark:border-rose-500/20 shadow-rose-500/5" :
                      activeSelected.status === 'in_review' ? "bg-blue-500/[0.02] border-blue-500/30 dark:border-blue-500/20 shadow-blue-500/5" :
                      "bg-amber-500/[0.02] border-amber-500/30 dark:border-amber-500/20 shadow-amber-500/5"
                    )}>
                      
                      {/* Watermark Diagonal Stamps for non-released/rejected states */}
                      {activeSelected.status === 'rejected' && (
                        <div className="absolute inset-0 flex items-center justify-center rotate-[-15deg] opacity-[0.08] pointer-events-none select-none z-10">
                          <span className="text-[4.5rem] font-display font-black tracking-widest text-rose-500 border-8 border-rose-500 p-6 rounded-3xl">REVOGADO</span>
                        </div>
                      )}
                      
                      {activeSelected.status === 'pending' && (
                        <div className="absolute inset-0 flex items-center justify-center rotate-[-15deg] opacity-[0.08] pointer-events-none select-none z-10">
                          <span className="text-[3rem] font-display font-black tracking-wider text-amber-500 border-8 border-amber-500 p-4 rounded-3xl">EM INSTRUÇÃO</span>
                        </div>
                      )}

                      {activeSelected.status === 'in_review' && (
                        <div className="absolute inset-0 flex items-center justify-center rotate-[-15deg] opacity-[0.08] pointer-events-none select-none z-10">
                          <span className="text-[3.2rem] font-display font-black tracking-wider text-blue-500 border-8 border-blue-500 p-4 rounded-3xl">REVISÃO SIG</span>
                        </div>
                      )}

                      {/* Coat of arms headers */}
                      <div className="text-center pb-6 border-b border-slate-150 dark:border-slate-850 space-y-2">
                        <span className="text-[9px] font-black tracking-[0.25em] text-slate-400 block uppercase">República Democrática de São Tomé e Príncipe</span>
                        <h3 className="font-display font-black text-sm text-slate-800 dark:text-white leading-tight uppercase">
                          DIRECÇÃO DE GEOGRAFIA E CADASTRO
                        </h3>
                        <p className="text-[10px] uppercase font-black tracking-widest text-slate-450 dark:text-slate-400">
                          CONSERVAÇÃO DO REGISTO DE PROPRIEDADE TERRITORIAL
                        </p>
                      </div>

                      {/* Main certificate info fields */}
                      <div className="pt-6 space-y-5">
                        
                        {/* Status Stamp Block */}
                        <div className="flex justify-between items-center bg-white dark:bg-slate-950 p-4.5 rounded-2xl border border-slate-150 dark:border-slate-850 shadow-inner">
                          <div className="space-y-1">
                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">Certificado Identificador</span>
                            <span className="text-xs font-mono font-black text-slate-900 dark:text-white">{activeSelected.id}-REG</span>
                          </div>
                          <div className={cn(
                            "px-3 py-1.5 rounded-xl text-[10.5px] font-black uppercase tracking-wider flex items-center gap-1.5 border transition-all",
                            activeSelected.status === 'approved' ? "bg-emerald-500/10 border-emerald-300 text-emerald-600" :
                            activeSelected.status === 'rejected' ? "bg-rose-500/10 border-rose-300 text-rose-500" :
                            activeSelected.status === 'in_review' ? "bg-blue-500/10 border-blue-305 text-blue-600" :
                            "bg-amber-500/10 border-amber-300 text-amber-600"
                          )}>
                            <div className={cn("w-1.5 h-1.5 rounded-full shrink-0", 
                              activeSelected.status === 'approved' ? "bg-emerald-500 animate-pulse" :
                              activeSelected.status === 'rejected' ? "bg-rose-500" :
                              activeSelected.status === 'in_review' ? "bg-blue-500" : "bg-amber-500"
                            )} />
                            {activeSelected.status === 'approved' ? 'Emitido e Vigente' :
                             activeSelected.status === 'rejected' ? 'Anulado / Revogado' :
                             activeSelected.status === 'in_review' ? 'Em Revisão Técnica' :
                             'Pendente de Triagem'}
                          </div>
                        </div>

                        {/* Description warnings based on status */}
                        {activeSelected.status === 'pending' && (
                          <div className="bg-amber-500/5 border border-amber-500/20 p-4.5 rounded-2xl space-y-1.5">
                            <h4 className="text-xs font-black text-amber-805 dark:text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                              <AlertCircle className="w-3.5 h-3.5" />
                              Título Pendente de Triagem
                            </h4>
                            <p className="text-[11px] text-amber-900/85 dark:text-amber-500/85 font-medium leading-relaxed">
                              O requerimento encontra-se em fase de triagem documental prévia. Não tem validade legal para transações, alienação pública, hipotecas ou garantias por não possuir fé-pública emitida. Detalhes pendentes de instrução.
                            </p>
                          </div>
                        )}

                        {activeSelected.status === 'in_review' && (
                          <div className="bg-blue-500/5 border border-blue-500/20 p-4.5 rounded-2xl space-y-1.5">
                            <h4 className="text-xs font-black text-blue-800 dark:text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
                              <CheckSquare className="w-3.5 h-3.5" />
                              Fase de Revisão de Cadastro e Delimitação
                            </h4>
                            <p className="text-[11px] text-blue-900/80 dark:text-blue-400/85 font-medium leading-relaxed">
                              O lote encontra-se sob vistoria militar/topográfica activa. O croquis georreferenciado e as demarcações geográficas estão a ser calibradas para eliminar riscos de colisão com áreas públicas ou vizinhos herdeiros.
                            </p>
                          </div>
                        )}

                        {activeSelected.status === 'approved' && (
                          <div className="bg-emerald-500/5 border border-emerald-500/20 p-4.5 rounded-2xl space-y-1.5">
                            <h4 className="text-xs font-black text-emerald-800 dark:text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                              <CheckCircle className="w-3.5 h-3.5" />
                              Fé Pública Emitida (e-Gov Suíça)
                            </h4>
                            <p className="text-[11px] text-emerald-950/80 dark:text-emerald-400/85 font-medium leading-relaxed">
                              Este título foi digitalmente lavrado, assinado criptograficamente nos servidores do e-Gov de São Tomé e Príncipe, e possui validade jurídica internacional plena de registo predial.
                            </p>
                          </div>
                        )}

                        {activeSelected.status === 'rejected' && (
                          <div className="bg-rose-500/5 border border-rose-500/20 p-4.5 rounded-2xl space-y-1.5">
                            <h4 className="text-xs font-black text-rose-800 dark:text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
                              <AlertCircle className="w-3.5 h-3.5" />
                              Título Anulado e Revogado
                            </h4>
                            <p className="text-[11px] text-rose-955/80 dark:text-rose-400/85 font-medium leading-relaxed">
                              O pleito territorial foi revogado administrativamente devido a conflito insanável de delimitação, herança contestada ou fraude de instrução cadastral de solo público.
                            </p>
                          </div>
                        )}

                        {/* Detail records */}
                        <div className="grid grid-cols-2 gap-4 pt-1 sm:pt-2">
                          <div className="p-3 bg-slate-50/50 dark:bg-slate-950/20 border border-slate-100 dark:border-slate-800/40 rounded-xl">
                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-wide block">Requerente Titular</span>
                            <span className="text-xs font-black text-slate-800 dark:text-slate-100 block mt-0.5">{activeSelected.applicant}</span>
                          </div>
                          <div className="p-3 bg-slate-50/50 dark:bg-slate-950/20 border border-slate-100 dark:border-slate-800/40 rounded-xl">
                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-wide block">NIF Contribuinte</span>
                            <span className="text-xs font-mono font-bold text-slate-800 dark:text-slate-100 block mt-0.5">{activeSelected.nif}</span>
                          </div>
                          <div className="p-3 bg-slate-50/50 dark:bg-slate-950/20 border border-slate-100 dark:border-slate-800/40 rounded-xl">
                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-wide block">Localização Freguesia</span>
                            <span className="text-xs font-bold text-slate-800 dark:text-slate-100 block mt-0.5">{activeSelected.location}</span>
                          </div>
                          <div className="p-3 bg-slate-50/50 dark:bg-slate-950/20 border border-slate-100 dark:border-slate-800/40 rounded-xl">
                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-wide block">Tipo de Concessão</span>
                            <span className="text-xs font-bold text-slate-800 dark:text-slate-100 block mt-0.5">{activeSelected.type}</span>
                          </div>
                        </div>

                        {/* Geometric metadata values */}
                        <div className="p-4.5 bg-slate-50/40 dark:bg-slate-950/30 rounded-2xl border border-slate-100 dark:border-slate-800/40 space-y-2">
                          <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-wider">
                            <span>Vetor SIG de Delimitação</span>
                            <span className="text-emerald-500 font-bold">Coordenadas WGS84</span>
                          </div>
                          <div className="font-mono text-[10.5px] text-slate-500 dark:text-slate-400 space-y-1">
                            <div>Área Planor-Poligonal: <span className="font-bold text-slate-800 dark:text-slate-200">524.5 m²</span></div>
                            <div className="truncate">Polígono Vertex: <span className="font-semibold text-emerald-600">[0.33924° N, 6.7324° E]</span></div>
                          </div>
                        </div>

                        {/* Cryptographic Ledger seal only if approved */}
                        {activeSelected.status === 'approved' && (
                          <div className="p-4 bg-emerald-500/[0.02] border border-emerald-500/15 rounded-2xl space-y-2.5">
                            <div className="flex items-center gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                              <span className="text-[9px] font-black uppercase text-emerald-600 dark:text-emerald-400 tracking-widest">Selo Criptográfico e-Gov</span>
                            </div>
                            <p className="font-mono text-[9px] text-slate-450 dark:text-slate-500 break-all leading-tight">
                              SHA256: 3a2c5b9f71ee435f3bfe00ca12b5cd3eab7f2da59f71ee435f3bfe00caee5569
                            </p>
                            <div className="flex justify-between items-center text-[10px] text-slate-400 border-t border-slate-100 dark:border-slate-800 pt-2 shrink-0">
                              <span>Registo Oficial ST: ST-OFC-cad-{activeSelected.id}</span>
                              <span className="text-emerald-600 font-bold">VIGENTE</span>
                            </div>
                          </div>
                        )}
                      </div>

                    </div>

                    {/* Quick Simulation utilities so they can toggle status inside title page too */}
                    <div className="bg-slate-50/40 dark:bg-slate-950/20 p-4.5 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-2">
                      <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">Atalhos de Simulação do Título</span>
                      <p className="text-[11px] text-slate-400 font-medium">Use os atalhos abaixo para mudar o estado e visualizar as páginas de detalhes do título em tempo-real:</p>
                      <div className="grid grid-cols-2 gap-2 pt-1">
                        <button 
                          onClick={() => updateProcessStatus(activeSelected.id, 'pending')}
                          className="py-2 px-2 bg-amber-500/10 text-amber-600 hover:bg-amber-500/20 text-[10px] rounded-lg font-black uppercase"
                        >
                          Tornar Pendente
                        </button>
                        <button 
                          onClick={() => updateProcessStatus(activeSelected.id, 'in_review')}
                          className="py-2 px-2 bg-blue-500/10 text-blue-600 hover:bg-blue-500/20 text-[10px] rounded-lg font-black uppercase"
                        >
                          Tornar Em Revisão
                        </button>
                        <button 
                          onClick={() => updateProcessStatus(activeSelected.id, 'approved')}
                          className="py-2 px-2 bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 text-[10px] rounded-lg font-black uppercase"
                        >
                          Visualizar Emitido
                        </button>
                        <button 
                          onClick={() => updateProcessStatus(activeSelected.id, 'rejected')}
                          className="py-2 px-2 bg-rose-500/10 text-rose-600 hover:bg-rose-500/20 text-[10px] rounded-lg font-black uppercase"
                        >
                          Visualizar Revogado
                        </button>
                      </div>
                    </div>
                  </div>
                )}
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
                    className="flex-1 py-3.5 rounded-xl premium-gradient text-white hover:opacity-90 font-bold text-xs uppercase tracking-wider transition-all shadow-sm shadow-emerald-500/20"
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
  workflowMode?: 'traditional' | 'international';
}

function ProcessCard({ process, index, onClick, workflowMode }: ProcessCardProps) {
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
