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
  Calendar,
  Trash2,
  RotateCcw,
  Check,
  Upload,
  Plus,
  RefreshCw,
  Eye,
  CheckSquare
} from "lucide-react";
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useNavigate } from "react-router-dom";
import { cn } from "../../lib/utils";

// Static definitions of delimitation processes
const DELIMITATION_PROCESSES = [
  { id: 'STP-PROCESS-8842', applicant: 'João Manuel dos Santos', location: 'Bairro do Hospital, Água Grande', district: 'Água Grande', locality: 'Bairro do Hospital', date: '2026-06-16', area: '1,245m²', status: 'ready', usage: 'Urbano Consolidado' },
  { id: 'STP-PROCESS-8835', applicant: 'Maria da Silva', location: 'Trindade, Mé-Zóchi', district: 'Mé-Zóchi', locality: 'Trindade', date: '2026-06-15', area: '850m²', status: 'ready', usage: 'Residencial' },
  { id: 'STP-PROCESS-8821', applicant: 'António Valdimir', location: 'Pantufo, Água Grande', district: 'Água Grande', locality: 'Pantufo', date: '2026-06-14', area: '2,100m²', status: 'pending', usage: 'Misto' },
  { id: 'STP-PROCESS-8812', applicant: 'Empresa Turística Lda', location: 'Porto Alegre, Caué', district: 'Caué', locality: 'Porto Alegre', date: '2026-06-12', area: '15,500m²', status: 'ready', usage: 'Comercial / Industrial' },
];

// Initial geometries for processes (x: [0, 1000], y: [0, 600] SVG space)
const INITIAL_GEOMETRIES: Record<string, Array<{id: string, x: number, y: number}>> = {
  'STP-PROCESS-8842': [
    { id: 'V1', x: 230, y: 120 },
    { id: 'V2', x: 480, y: 80 },
    { id: 'V3', x: 650, y: 170 },
    { id: 'V4', x: 580, y: 390 },
    { id: 'V5', x: 280, y: 440 }
  ],
  'STP-PROCESS-8835': [
    { id: 'V1', x: 300, y: 150 },
    { id: 'V2', x: 580, y: 120 },
    { id: 'V3', x: 620, y: 360 },
    { id: 'V4', x: 340, y: 410 }
  ],
  'STP-PROCESS-8812': [
    { id: 'V1', x: 180, y: 190 },
    { id: 'V2', x: 740, y: 110 },
    { id: 'V3', x: 820, y: 450 },
    { id: 'V4', x: 210, y: 490 }
  ],
  'STP-PROCESS-8821': [
    { id: 'V1', x: 400, y: 200 },
    { id: 'V2', x: 600, y: 200 },
    { id: 'V3', x: 500, y: 350 }
  ]
};

// Default documents
const INITIAL_DOCS_MAP: Record<string, any[]> = {
  'STP-PROCESS-8842': [
    { id: 'DOC-01', name: 'Croquis de Levantamento Prévio', type: 'PDF', size: '1.2 MB', date: '15 Jun 2026', category: 'Technical' },
    { id: 'DOC-02', name: 'Cópia de BI do Requerente', type: 'PDF', size: '540 KB', date: '14 Jun 2026', category: 'Identity' }
  ],
  'STP-PROCESS-8835': [
    { id: 'DOC-03', name: 'Documento de Cedência Provisória', type: 'PDF', size: '2.1 MB', date: '12 Jun 2026', category: 'Legal' }
  ],
  'STP-PROCESS-8812': [
    { id: 'DOC-04', name: 'Plano Diretor Turístico Homologado', type: 'PDF', size: '4.8 MB', date: '10 Jun 2026', category: 'Technical' }
  ],
  'STP-PROCESS-8821': []
};

// Default images list
const INITIAL_IMAGES_MAP: Record<string, string[]> = {
  'STP-PROCESS-8842': [
    'https://images.unsplash.com/photo-1590247813693-5541d1c609fd?auto=format&fit=crop&q=80&w=400&h=400&sig=1',
    'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&q=80&w=400&h=400&sig=2'
  ],
  'STP-PROCESS-8835': [
    'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&q=80&w=400&h=400&sig=3'
  ],
  'STP-PROCESS-8812': [
    'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&q=80&w=400&h=400&sig=4',
    'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&q=80&w=400&h=400&sig=5'
  ],
  'STP-PROCESS-8821': []
};

export function DelimitationView() {
  const navigate = useNavigate();
  
  // Load initial process list merged with dynamic processes
  const [activeProcessList, setActiveProcessList] = useState(() => {
    const defaultList = [...DELIMITATION_PROCESSES];
    const cachedProcesses = localStorage.getItem('STP_PROCESSES');
    if (cachedProcesses) {
      try {
        const parsed = JSON.parse(cachedProcesses);
        parsed.forEach((p: any) => {
          if (!defaultList.some(item => item.id === p.id)) {
            defaultList.push({
              id: p.id,
              applicant: p.applicant,
              location: p.location || 'Bairro do Hospital, Água Grande',
              district: p.location?.includes('Mé-Zóchi') ? 'Mé-Zóchi' : 'Água Grande',
              locality: p.location?.includes(',') ? p.location.split(',')[1].trim() : p.location || 'Bairro do Hospital',
              date: p.date,
              area: '1,200m²',
              status: p.status === 'approved' ? 'ready' : 'pending',
              usage: p.type === 'Legalização' ? 'Residencial' : 'Urbano Consolidado'
            });
          }
        });
      } catch (e) {}
    }
    return defaultList;
  });

  // Pre-load current process ID in local storage for Delimitation mapping module
  const [selectedProcess, setSelectedProcess] = useState<string | null>(() => {
    const cachedId = localStorage.getItem('STP_ACTIVE_DELIMIT_ID');
    if (cachedId) {
      // Verify if ID exists inside active list
      return cachedId;
    }
    return activeProcessList[0]?.id || 'STP-PROCESS-8842';
  });

  const [searchQuery, setSearchQuery] = useState('');

  // Fallback structures for custom or dynamically linked processes
  const getFallbackGeometry = (procId: string) => {
    if (INITIAL_GEOMETRIES[procId]) return INITIAL_GEOMETRIES[procId];
    return [
      { id: 'V1', x: 250, y: 140 },
      { id: 'V2', x: 520, y: 100 },
      { id: 'V3', x: 680, y: 220 },
      { id: 'V4', x: 490, y: 410 }
    ];
  };

  const getFallbackDocs = (procId: string) => {
    if (INITIAL_DOCS_MAP[procId]) return INITIAL_DOCS_MAP[procId];
    return [
      { id: 'DOC-99', name: 'Requerimento de Delimitação Cadastral', type: 'PDF', size: '1.4 MB', date: 'Hoje', category: 'Administrative' }
    ];
  };

  const getFallbackImages = (procId: string) => {
    if (INITIAL_IMAGES_MAP[procId]) return INITIAL_IMAGES_MAP[procId];
    return [
      'https://images.unsplash.com/photo-1590247813693-5541d1c609fd?auto=format&fit=crop&q=80&w=400&h=400&sig=1'
    ];
  };

  // Core CAD / Editor States
  const [vertices, setVertices] = useState<Array<{id: string, x: number, y: number}>>([]);
  const [activeTool, setActiveTool] = useState<'pointer' | 'draw' | 'ruler'>('pointer');
  const [mapLayer, setMapLayer] = useState<'satellite' | 'cad' | 'terrain'>('satellite');
  const [scaleZoom, setScaleZoom] = useState<number>(1.2);
  const [coordinateSystem, setCoordinateSystem] = useState<'WGS84' | 'ED50'>('WGS84');

  // Ruler Mode States
  const [rulerPoints, setRulerPoints] = useState<Array<{x: number, y: number}>>([]);
  const [tempRulerEnd, setTempRulerEnd] = useState<{x: number, y: number} | null>(null);

  // Vertex Drag state
  const [draggedVertexId, setDraggedVertexId] = useState<string | null>(null);

  // Form Fields State
  const [district, setDistrict] = useState('Água Grande');
  const [locality, setLocality] = useState('Bairro do Hospital');
  const [usage, setUsage] = useState('Urbano Consolidado');
  const [applicant, setApplicant] = useState('');
  const [docsList, setDocsList] = useState<any[]>([]);
  const [imagesList, setImagesList] = useState<string[]>([]);

  // Feedback notifications
  const [toast, setToast] = useState<{message: string, type: 'success' | 'info' | 'error'} | null>(null);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [newlyCreatedTitleId, setNewlyCreatedTitleId] = useState('');

  // Hidden File inputs references
  const fileInputRef = useRef<HTMLInputElement>(null);

  const currentProcess = activeProcessList.find(p => p.id === selectedProcess);

  // Helper to show a feedback message
  const showToastMsg = (msg: string, type: 'success' | 'info' | 'error' = 'info') => {
    setToast({ message: msg, type });
    setTimeout(() => {
      setToast(prev => prev?.message === msg ? null : prev);
    }, 4500);
  };

  // Switch Selected Process & Initialize Editor geometry
  useEffect(() => {
    if (selectedProcess) {
      const proc = activeProcessList.find(p => p.id === selectedProcess);
      if (proc) {
        setApplicant(proc.applicant);
        setDistrict(proc.district);
        setLocality(proc.locality);
        setUsage(proc.usage);
      }
      
      // Load vertices from LocalStorage if cached, or fall back
      const cached = localStorage.getItem(`STP_GEOM_${selectedProcess}`);
      if (cached) {
        try {
          setVertices(JSON.parse(cached));
        } catch(e) {
          setVertices(getFallbackGeometry(selectedProcess));
        }
      } else {
        setVertices(getFallbackGeometry(selectedProcess));
      }

      // Load documents & photos
      setDocsList(getFallbackDocs(selectedProcess));
      setImagesList(getFallbackImages(selectedProcess));
      setRulerPoints([]);
      setTempRulerEnd(null);
    }
  }, [selectedProcess, activeProcessList]);

  // Calculate coordinates dynamic changes
  const calculateGeometry = (pts: Array<{x: number, y: number}>) => {
    if (pts.length < 3) return { area: 0, perimeter: 0 };
    
    // Pixel scale: 1 pixel on 1000x600 canvas equals ~ 0.62 meters in real dimensions
    const pxToMeterRatio = 0.62;

    // Perimeter
    let peri = 0;
    for (let i = 0; i < pts.length; i++) {
      const next = pts[(i + 1) % pts.length];
      const dx = next.x - pts[i].x;
      const dy = next.y - pts[i].y;
      peri += Math.sqrt(dx * dx + dy * dy);
    }
    const perimeterMeters = peri * pxToMeterRatio;

    // Shoelace Area
    let areaSum = 0;
    for (let i = 0; i < pts.length; i++) {
      const next = pts[(i + 1) % pts.length];
      areaSum += pts[i].x * next.y - next.x * pts[i].y;
    }
    const areaMeters = Math.abs(areaSum) * 0.5 * (pxToMeterRatio * pxToMeterRatio);

    return {
      area: areaMeters,
      perimeter: perimeterMeters
    };
  };

  const geomResults = calculateGeometry(vertices);

  // SVG Mouse handlers for vertex dragging
  const handleMapMouseDown = (e: React.MouseEvent<SVGSVGElement>) => {
    if (activeTool === 'draw') {
      const svg = e.currentTarget;
      const rect = svg.getBoundingClientRect();
      const clickX = ((e.clientX - rect.left) / rect.width) * 1000;
      const clickY = ((e.clientY - rect.top) / rect.height) * 600;

      // Add a vertex
      const newIndex = vertices.length > 0 ? Math.max(...vertices.map(v => parseInt(v.id.substring(1)) || 0)) + 1 : 1;
      const newVert = {
        id: `V${newIndex}`,
        x: Math.round(clickX),
        y: Math.round(clickY)
      };
      setVertices([...vertices, newVert]);
      showToastMsg(`Vértice V${newIndex} adicionado nos Pixels: [${Math.round(clickX)}, ${Math.round(clickY)}]`, 'info');
    } else if (activeTool === 'ruler') {
      const svg = e.currentTarget;
      const rect = svg.getBoundingClientRect();
      const clickX = ((e.clientX - rect.left) / rect.width) * 1000;
      const clickY = ((e.clientY - rect.top) / rect.height) * 600;

      if (rulerPoints.length === 0) {
        setRulerPoints([{ x: clickX, y: clickY }]);
        setTempRulerEnd({ x: clickX, y: clickY });
      } else {
        // Form final ruler segment and clear ruler state
        const p1 = rulerPoints[0];
        const dx = clickX - p1.x;
        const dy = clickY - p1.y;
        const dist = (Math.sqrt(dx * dx + dy * dy) * 0.62).toFixed(1);
        showToastMsg(`Medição finalizada: ${dist} metros de distância linear.`, 'success');
        setRulerPoints([]);
        setTempRulerEnd(null);
      }
    }
  };

  const handleMapMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const svg = e.currentTarget;
    const rect = svg.getBoundingClientRect();
    const curX = ((e.clientX - rect.left) / rect.width) * 1000;
    const curY = ((e.clientY - rect.top) / rect.height) * 600;

    if (draggedVertexId) {
      setVertices(prev => prev.map(v => 
        v.id === draggedVertexId 
          ? { ...v, x: Math.round(Math.max(0, Math.min(1000, curX))), y: Math.round(Math.max(0, Math.min(600, curY))) }
          : v
      ));
    } else if (activeTool === 'ruler' && rulerPoints.length > 0) {
      setTempRulerEnd({ x: curX, y: curY });
    }
  };

  const handleMapMouseUp = () => {
    if (draggedVertexId) {
      setDraggedVertexId(null);
    }
  };

  const handleVertexMouseDown = (id: string, e: React.MouseEvent) => {
    e.stopPropagation(); // prevent map click / point creation
    setDraggedVertexId(id);
  };

  // Convert SVG coordinate x & y into São Tomé UTM coordinates mock
  // Vila de São Tomé lies near 0°20'N 6°44'E (UTM Zone 32N)
  const formatUTM = (x: number, y: number) => {
    const baseEasting = 693200;  // Real-world typical coordinates range
    const baseNorthing = 36800;
    // Map bounds mock
    const finalE = (baseEasting + x * 0.72).toFixed(2);
    const finalN = (baseNorthing + (600 - y) * 0.72).toFixed(2);
    return { east: finalE, north: finalN };
  };

  // Manual vertex inputs coordinate changes
  const updateVertexCoord = (id: string, field: 'x' | 'y', val: number) => {
    const safeVal = Math.max(0, Math.min(field === 'x' ? 1000 : 600, val));
    setVertices(prev => prev.map(v => v.id === id ? { ...v, [field]: safeVal } : v));
  };

  // Remove individual vertex
  const removeVertex = (id: string) => {
    const updated = vertices.filter(v => v.id !== id);
    setVertices(updated);
    showToastMsg(`Vértice ${id} removido da delimitação cadastral.`, 'info');
  };

  // Clear all vertices to draw from scratch
  const clearAllVertices = () => {
    setVertices([]);
    showToastMsg('Todos os vértices foram limpos do mapa. Defina novas marcações.', 'info');
  };

  // Reset to original preset vertices
  const resetVerticesToPreset = () => {
    if (selectedProcess) {
      setVertices(INITIAL_GEOMETRIES[selectedProcess] || []);
      showToastMsg('Vértices redefinidos para os valores originais do croquis.', 'info');
    }
  };

  // Saving drafts flow
  const handleSaveDraft = () => {
    if (!selectedProcess) return;
    localStorage.setItem(`STP_GEOM_${selectedProcess}`, JSON.stringify(vertices));
    
    // update status values in local list
    const updatedList = activeProcessList.map(p => 
      p.id === selectedProcess 
        ? { ...p, applicant, district, locality, usage, area: `${geomResults.area > 0 ? Math.round(geomResults.area) : 0}m²` }
        : p
    );
    setActiveProcessList(updatedList);
    showToastMsg('Delimitação guardada como rascunho com sucesso!', 'success');
  };

  // Approving delimitation & Creating property title
  const handleApproveDelimitation = () => {
    if (vertices.length < 3) {
      showToastMsg('Não é possível aprovar. O terreno precisa de pelo menos 3 vértices para formular um polígono!', 'error');
      return;
    }
    
    // Generate a brand new Title ID
    const titleRef = `TIT-STP-2026-${selectedProcess?.split('-').pop() || '009'}`;
    setNewlyCreatedTitleId(titleRef);

    // Write metadata & geometry to localStorage so the title views immediately can read it!
    const titleDetailsObject = {
      id: titleRef,
      status: 'issued',
      issueDate: 'Hoje (' + new Date().toLocaleDateString('pt-PT') + ')',
      expiryDate: 'Permanente',
      ownerId: 'OWN-101', // Linked owner ID
      utente: {
        name: applicant,
        nif: '100234567',
        contact: '+239 990 1234',
        email: 'antonio.santo@email.st',
        address: `${locality}, ${district}`
      },
      parcel: {
        id: `REC-2026-${selectedProcess?.split('-').pop() || '099'}`,
        area: `${Math.round(geomResults.area).toLocaleString('pt-PT')} m²`,
        perimeter: `${Math.round(geomResults.perimeter).toLocaleString('pt-PT')} m`,
        location: `${locality}, ${district}`,
        usage: usage,
        topography: 'Aprovada GIS (' + new Date().toLocaleDateString('pt-PT') + ')'
      },
      documents: docsList.map((d, index) => ({ ...d, id: `DOC-${index+50}` })),
      history: [
        { 
          event: 'Título Emitido por Delimitação Geográfica', 
          date: new Date().toLocaleDateString('pt-PT') + ' ' + new Date().toLocaleTimeString('pt-PT', {hour: '2-digit', minute:'2-digit'}), 
          user: 'Conservador-Chefe', 
          type: 'system', 
          details: `Polígono cadastral com ${vertices.length} vértices homologado eletronicamente.` 
        }
      ]
    };

    // Load dynamic master database STP_TITLES_DB and insert new record
    let titlesDb: Record<string, any> = {};
    const cachedDb = localStorage.getItem('STP_TITLES_DB');
    if (cachedDb) {
      try {
        titlesDb = JSON.parse(cachedDb);
      } catch (e) {}
    } else {
      // Setup master default values in case first access is through delimitation view
      titlesDb = {
        'TIT-STP-2026-001': {
          id: 'TIT-STP-2026-001',
          utente: { name: 'António dos Santos', nif: '100234567', contact: '+239 990 1234', email: 'antonio.santo@email.st', address: 'Avenida Marginal, São Tomé' },
          area: '1,200m²', status: 'issued', date: '15 Mai 2026', location: 'Pantufo, Água Grande'
        }
      };
    }

    titlesDb[titleRef] = {
      ...titleDetailsObject,
      area: `${Math.round(geomResults.area).toLocaleString('pt-PT')}m²`,
      date: new Date().toLocaleDateString('pt-PT', { day: '2-digit', month: 'short', year: 'numeric' }),
      location: `${locality}, ${district}`,
    };
    localStorage.setItem('STP_TITLES_DB', JSON.stringify(titlesDb));

    // Also populate legacy storage values for background backwards-compatibility
    let savedDetails: Record<string, any> = {};
    const detailsRaw = localStorage.getItem('STP_TITLES_DETAILS');
    if (detailsRaw) {
      try { savedDetails = JSON.parse(detailsRaw); } catch(e) {}
    }
    savedDetails[titleRef] = titleDetailsObject;
    localStorage.setItem('STP_TITLES_DETAILS', JSON.stringify(savedDetails));

    let savedList: any[] = [];
    const listRaw = localStorage.getItem('STP_TITLES');
    if (listRaw) {
      try { savedList = JSON.parse(listRaw); } catch(e) {}
    } else {
      savedList = [
        { id: 'TIT-STP-2026-001', utente: 'António dos Santos', area: '1,200m²', status: 'issued', date: '15 Mai 2026', location: 'Pantufo, Água Grande' },
        { id: 'TIT-STP-2026-002', utente: 'Maria da Silva', area: '850m²', status: 'pending', date: '12 Mai 2026', location: 'Trindade, Mé-Zóchi' },
        { id: 'TIT-STP-2026-003', utente: 'Companhia de Investimento Lda', area: '15,000m²', status: 'review', date: '10 Mai 2026', location: 'Neves, Lembá' },
        { id: 'TIT-STP-2026-004', utente: 'João Batista', area: '450m²', status: 'issued', date: '08 Mai 2026', location: 'Santana, Cantagalo' },
        { id: 'TIT-STP-2026-005', utente: 'Elena Rodrigues', area: '900m²', status: 'issued', date: '05 Mai 2026', location: 'Guadalupe, Lobata' },
      ];
    }
    
    if (!savedList.find(t => t.id === titleRef)) {
      savedList.unshift({
        id: titleRef,
        utente: applicant,
        area: `${Math.round(geomResults.area).toLocaleString('pt-PT')}m²`,
        status: 'issued',
        date: new Date().toLocaleDateString('pt-PT'),
        location: `${locality}, ${district}`
      });
    }
    localStorage.setItem('STP_TITLES', JSON.stringify(savedList));

    // Show modal success
    setShowApprovalModal(true);
  };

  // Simulated instrument file picker upload
  const handleTriggerUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isImg = file.type.startsWith('image/');
    const fakeUrl = isImg 
      ? URL.createObjectURL(file) 
      : 'https://images.unsplash.com/photo-1541462608141-ad6b3eb16995?auto=format&fit=crop&q=80&w=400';

    if (isImg) {
      setImagesList(prev => [...prev, fakeUrl]);
      showToastMsg(`Fotografia do terreno "${file.name}" importada com sucesso!`, 'success');
    } else {
      const newDoc = {
        id: `DOC-EXT-${docsList.length + 10}`,
        name: file.name,
        type: file.name.split('.').pop()?.toUpperCase() || 'PDF',
        size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
        date: 'Hoje',
        category: 'Legal'
      };
      setDocsList(prev => [...prev, newDoc]);
      showToastMsg(`Documento técnico "${file.name}" adicionado ao arquivo.`, 'success');
    }
  };

  // Filter list of processes based on search query
  const filteredProcesses = activeProcessList.filter(p => 
    p.applicant.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-10 pb-20">
      
      {/* Toast Overlay */}
      <AnimatePresence>
        {toast && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={cn(
              "fixed top-6 right-6 z-50 p-5 rounded-2xl shadow-xl flex items-center gap-3 border backdrop-blur-md max-w-sm",
              toast.type === 'success' ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20" :
              toast.type === 'error' ? "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20" :
              "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20"
            )}
          >
            {toast.type === 'success' ? <CheckCircle2 className="w-5 h-5 shrink-0" /> : <AlertCircle className="w-5 h-5 shrink-0" />}
            <span className="text-sm font-semibold">{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success Approval Modal */}
      <AnimatePresence>
        {showApprovalModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 md:p-12">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-xl"
              onClick={() => setShowApprovalModal(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              className="relative bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[3rem] w-full max-w-xl p-10 md:p-12 shadow-2xl overflow-hidden text-center"
            >
              {/* Highlight Circle Decoration */}
              <div className="w-24 h-24 rounded-full bg-emerald-500/10 border-2 border-emerald-500 text-emerald-500 flex items-center justify-center mx-auto mb-8 relative">
                <Check className="w-12 h-12" />
                <span className="absolute inset-0 rounded-full border border-emerald-500 animate-ping opacity-30" />
              </div>

              <h2 className="text-3xl font-display font-black tracking-tight mb-2">Homologação Bem Sucedida!</h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm font-medium leading-relaxed mb-8">
                As delimitações topográficas foram integradas permanentemente no SIG nacional. O título de propriedade foi oficializado e as assinaturas de posse qualificadas foram criptografadas.
              </p>

              <div className="bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-2xl p-6 text-left mb-8 space-y-3">
                <div className="flex justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5">
                  <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Novo Título</span>
                  <span className="text-xs font-black font-mono text-emerald-500">{newlyCreatedTitleId}</span>
                </div>
                <div className="flex justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5">
                  <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Beneficiário</span>
                  <span className="text-xs font-bold text-slate-800 dark:text-white">{applicant}</span>
                </div>
                <div className="flex justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5">
                  <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Área Cadastrada</span>
                  <span className="text-xs font-bold text-slate-800 dark:text-white">{Math.round(geomResults.area).toLocaleString()} m²</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Localidade</span>
                  <span className="text-xs font-bold text-slate-800 dark:text-white">{locality}, {district}</span>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <button 
                  onClick={() => {
                    setShowApprovalModal(false);
                    navigate(`/titles/${newlyCreatedTitleId}`);
                  }}
                  className="w-full py-4 rounded-xl premium-gradient text-white font-bold text-sm uppercase tracking-widest hover:brightness-105 transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
                >
                  <Eye className="w-4 h-4" /> Ver Título Oficializado
                </button>
                <button 
                  onClick={() => setShowApprovalModal(false)}
                  className="w-full py-4 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-sm hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                >
                  Continuar Cadastro Geral
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileUpload} 
        className="hidden" 
        accept="image/*,application/pdf"
      />

      {/* VIEW 1: PROCESS LIST (LANDING) */}
      {!selectedProcess ? (
        <div className="space-y-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="text-4xl font-display font-black tracking-tighter">Revisão e Delimitação</h1>
              <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">Inspeção topográfica estruturada e vetorização SIG das parcelas em STP.</p>
            </div>
            <div className="flex w-full md:w-auto gap-3">
              <div className="relative group flex-1 md:w-[320px] md:flex-none">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Pesquisar processos (Por ID, nome)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500/50 transition-all font-medium"
                />
              </div>
              <button className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 transition-all shrink-0">
                <Filter className="w-5 h-5 text-slate-500" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredProcesses.map((process, i) => (
              <motion.div
                key={process.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-[2.5rem] shadow-sm hover:shadow-xl hover:border-emerald-500/30 transition-all duration-500 flex flex-col justify-between h-[380px]"
              >
                <div>
                  <div className="flex justify-between items-start mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center">
                      <MapIcon className="w-6 h-6 text-emerald-500" />
                    </div>
                    <div className={cn(
                      "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
                      process.status === 'ready' ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" : "bg-orange-500/10 text-orange-600 dark:text-orange-400"
                    )}>
                      {process.status === 'ready' ? 'Apto a Delimitar' : 'Aguardando Medição'}
                    </div>
                  </div>

                  <div className="mb-6">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">{process.id}</p>
                    <h3 className="text-xl font-display font-black tracking-tight leading-tight group-hover:text-emerald-500 transition-colors line-clamp-2">{process.applicant}</h3>
                  </div>

                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400">
                      <MapPin className="w-4 h-4 shrink-0" />
                      <span className="text-xs font-semibold line-clamp-1">{process.location}</span>
                    </div>
                    <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400">
                      <Maximize2 className="w-4 h-4 shrink-0" />
                      <span className="text-xs font-semibold">Área Requerida: {process.area}</span>
                    </div>
                  </div>
                </div>

                <button 
                  onClick={() => setSelectedProcess(process.id)}
                  className="w-full py-4 rounded-xl font-bold text-xs tracking-widest uppercase transition-all flex items-center justify-center gap-2 premium-gradient text-white shadow-lg shadow-emerald-500/20 hover:scale-[1.03]"
                >
                  Modelar Polígono <ChevronRight className="w-4 h-4" />
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      ) : (
        
        /* VIEW 2: COMPREHENSIVE INTERACTIVE GEOMETRIC WORKSTATION */
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <button 
                onClick={() => setSelectedProcess(null)}
                className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-emerald-500 transition-colors mb-4 group"
              >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Listas Cadastrais
              </button>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-[1.25rem] bg-emerald-500/10 flex items-center justify-center shrink-0">
                   <MapIcon className="w-7 h-7 text-emerald-500" />
                </div>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-1">
                    <h1 className="text-2xl sm:text-3xl font-display font-black tracking-tight leading-none break-all">{currentProcess?.id}</h1>
                    <span className="px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 leading-none">Modo Vetorização Ativo</span>
                  </div>
                  <p className="text-slate-500 dark:text-slate-400 font-medium">Inspetor Responsável: <strong>Bernardo Cruz (Topógrafo)</strong></p>
                </div>
              </div>
            </div>
            <div className="flex w-full xl:w-auto flex-col sm:flex-row gap-3">
              <button 
                onClick={handleSaveDraft}
                className="px-6 py-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-bold text-sm hover:bg-slate-50 dark:hover:bg-slate-950 transition-colors flex items-center gap-2 shadow-sm"
              >
                <Save className="w-4 h-4 text-slate-400" />
                Guardar Rascunho
              </button>
              <button 
                onClick={handleApproveDelimitation}
                className="premium-gradient text-white px-8 py-4 rounded-2xl font-bold text-sm flex items-center gap-2 shadow-xl shadow-emerald-500/20 hover:brightness-105 transition-all"
              >
                <CheckCircle2 className="w-5 h-5 animate-pulse" />
                Validar & Emitir Título
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
            <div className="xl:col-span-3 space-y-6">
              
              {/* INTERACTIVE WORKSTATION CANVAS */}
              <div 
                className={cn(
                  "rounded-[2rem] sm:rounded-[3rem] h-[420px] sm:h-[520px] lg:h-[600px] overflow-hidden relative border shadow-2xl transition-all duration-500 bg-slate-900 border-slate-800",
                  activeTool === 'draw' ? "ring-2 ring-emerald-500/40" : "",
                  activeTool === 'ruler' ? "ring-2 ring-blue-500/40" : ""
                )}
              >
                {/* 1. LAYER BACKDROP */}
                <div className="absolute inset-0 overflow-hidden select-none pointer-events-none">
                  {mapLayer === 'satellite' && (
                    <>
                      <div className="absolute inset-0 opacity-40 bg-[url('https://images.unsplash.com/photo-1541462608141-ad6b3eb16995?auto=format&fit=crop&q=80&w=2000')] bg-cover bg-center transition-transform duration-[4000ms]" style={{ transform: `scale(${scaleZoom})` }} />
                      <div className="absolute inset-0 bg-slate-950/20" />
                    </>
                  )}
                  {mapLayer === 'terrain' && (
                    <>
                      <div className="absolute inset-0 opacity-45 bg-[url('https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=2000')] bg-cover bg-center" style={{ transform: `scale(${scaleZoom})` }} />
                      <div className="absolute inset-0 bg-slate-950/30" />
                    </>
                  )}
                  {mapLayer === 'cad' && (
                    <div className="absolute inset-0 bg-grid-pattern opacity-100" />
                  )}
                  
                  {/* Background Grid Accent overlayfor CAD aesthetics */}
                  <div className="absolute inset-0 bg-grid-lines pointer-events-none opacity-[0.03] dark:opacity-[0.07]" />
                </div>

                {/* 2. LIVE SVG VECTOR CANVAS */}
                <svg 
                  className="absolute inset-0 w-full h-full cursor-crosshair" 
                  viewBox="0 0 1000 600"
                  onMouseDown={handleMapMouseDown}
                  onMouseMove={handleMapMouseMove}
                  onMouseUp={handleMapMouseUp}
                  onMouseLeave={handleMapMouseUp}
                >
                  {/* Surrounding mock parcels backdrop */}
                  <polygon points="650,170 850,100 900,320 580,390" fill="rgba(255,255,255,0.01)" stroke="rgba(255,255,255,0.07)" strokeWidth="1" />
                  <polygon points="120,40 230,120 280,440 80,480" fill="rgba(255,255,255,0.01)" stroke="rgba(255,255,255,0.07)" strokeWidth="1" />

                  {/* Dynamic Closed Polyline path of the parcel being drawn */}
                  {vertices.length >= 2 && (
                    <polygon 
                      points={vertices.map(v => `${v.x},${v.y}`).join(' ')} 
                      fill="rgba(16, 185, 129, 0.12)" 
                      stroke="#10b981" 
                      strokeWidth="3.5"
                      strokeDasharray={activeTool === 'draw' ? "8 6" : "none"}
                      className="transition-all duration-300"
                    />
                  )}

                  {/* Draw polygon segments if in drafting */}
                  {activeTool === 'draw' && vertices.length > 0 && (
                    <polygon 
                      points={vertices.map(v => `${v.x},${v.y}`).join(' ')} 
                      fill="none" 
                      stroke="rgba(16, 185, 129, 0.4)" 
                      strokeWidth="12"
                      className="animate-pulse"
                    />
                  )}

                  {/* Draw Ruler Distance Mode Indicator */}
                  {activeTool === 'ruler' && rulerPoints.length > 0 && tempRulerEnd && (
                    <>
                      <line 
                        x1={rulerPoints[0].x} 
                        y1={rulerPoints[0].y} 
                        x2={tempRulerEnd.x} 
                        y2={tempRulerEnd.y} 
                        stroke="#3b82f6" 
                        strokeWidth="3" 
                        strokeDasharray="6 4"
                      />
                      <circle cx={rulerPoints[0].x} cy={rulerPoints[0].y} r="8" fill="#3b82f6" />
                      <circle cx={tempRulerEnd.x} cy={tempRulerEnd.y} r="6" fill="#3b82f6" />
                      
                      {/* Interactive dynamic ruler metric readout next to pointer */}
                      <g transform={`translate(${(rulerPoints[0].x + tempRulerEnd.x) / 2}, ${(rulerPoints[0].y + tempRulerEnd.y) / 2 - 15})`}>
                        <rect x="-60" y="-12" width="120" height="24" rx="6" fill="rgba(15,23,42,0.9)" stroke="#3b82f6" strokeWidth="1" />
                        <text fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle" y="4">
                          {(Math.sqrt((tempRulerEnd.x - rulerPoints[0].x)**2 + (tempRulerEnd.y - rulerPoints[0].y)**2) * 0.62).toFixed(1)} m
                        </text>
                      </g>
                    </>
                  )}

                  {/* Interactive draggable vertices (Circles) */}
                  {vertices.map((v, idx) => {
                    const nextV = vertices[(idx + 1) % vertices.length];
                    const midwayX = (v.x + nextV.x) / 2;
                    const midwayY = (v.y + nextV.y) / 2;
                    const segmentDist = Math.sqrt((nextV.x - v.x)**2 + (nextV.y - v.y)**2) * 0.62;

                    return (
                      <g key={v.id}>
                        {/* Segment distance readout flag */}
                        {vertices.length >= 2 && (
                          <g transform={`translate(${midwayX}, ${midwayY})`}>
                            <rect x="-35" y="-10" width="70" height="18" rx="5" fill="rgba(15, 23, 42, 0.7)" stroke="rgba(16, 185, 129, 0.4)" strokeWidth="1" />
                            <text fill="#10b981" fontSize="9" fontWeight="950" textAnchor="middle" y="2">
                              {segmentDist.toFixed(1)} m
                            </text>
                          </g>
                        )}

                        {/* Outer Glow for Vertices */}
                        <circle 
                          cx={v.x} 
                          cy={v.y} 
                          r="18" 
                          fill="transparent" 
                          className="cursor-pointer hover:fill-emerald-500/10 transition-colors"
                          onMouseDown={(e) => handleVertexMouseDown(v.id, e)}
                        />

                        {/* Vertex Point Circle marker */}
                        <circle 
                          cx={v.x} 
                          cy={v.y} 
                          r="8" 
                          fill="#ffffff" 
                          stroke="#10b981" 
                          strokeWidth="3"
                          className="cursor-grab active:cursor-grabbing hover:scale-125 transition-transform"
                          onMouseDown={(e) => handleVertexMouseDown(v.id, e)}
                        />

                        {/* Vertex Text Identifier Label banner */}
                        <g transform={`translate(${v.x}, ${v.y - 18})`}>
                          <rect x="-14" y="-8" width="28" height="14" rx="3" fill="#1e293b" stroke="#10b981" strokeWidth="0.5" />
                          <text fill="#10b981" fontSize="9" fontWeight="bold" textAnchor="middle" y="2">{v.id}</text>
                        </g>
                      </g>
                    );
                  })}
                </svg>

                {/* 3. TOOLBOX FLOATING SHELF */}
                <div className="absolute top-6 left-6 space-y-2">
                  <div className="bg-slate-900/90 backdrop-blur-md flex flex-col p-2 space-y-1.5 rounded-2xl border border-slate-800 shadow-2xl">
                    <button 
                      onClick={() => { setActiveTool('pointer'); setRulerPoints([]); }}
                      title="Navegar & Mover Vértices"
                      className={cn(
                        "p-3.5 rounded-xl transition-all",
                        activeTool === 'pointer' ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/25" : "text-slate-400 hover:text-white"
                      )}
                    >
                      <MousePointer2 className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={() => { setActiveTool('draw'); setRulerPoints([]); }}
                      title="Desenhar / Adicionar Vértices"
                      className={cn(
                        "p-3.5 rounded-xl transition-all",
                        activeTool === 'draw' ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/25" : "text-slate-400 hover:text-white"
                      )}
                    >
                      <Plus className="w-4 h-4 ml-0.5" />
                    </button>
                    <button 
                      onClick={() => setActiveTool('ruler')}
                      title="Régua de Medição"
                      className={cn(
                        "p-3.5 rounded-xl transition-all",
                        activeTool === 'ruler' ? "bg-blue-500 text-white shadow-lg shadow-blue-500/25" : "text-slate-400 hover:text-white"
                      )}
                    >
                      <Ruler className="w-5 h-5" />
                    </button>
                    <div className="h-[1px] bg-slate-800 mx-1.5" />
                    <button 
                      onClick={() => setScaleZoom(z => Math.min(2.5, z + 0.1))} 
                      title="Zoom In"
                      className="p-3.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                    >
                      <ZoomIn className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={() => setScaleZoom(z => Math.max(0.6, z - 0.1))} 
                      title="Zoom Out"
                      className="p-3.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                    >
                      <ZoomOut className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* 4. BASE LAYER PICKER SWIPER */}
                <div className="absolute top-6 right-6">
                  <div className="bg-slate-900/90 backdrop-blur-md flex items-center p-1.5 rounded-2xl border border-slate-800 shadow-2xl overflow-hidden">
                    {[
                      { id: 'satellite', label: 'Satélite', icon: ImageIcon },
                      { id: 'terrain', label: 'Relevo', icon: Navigation },
                      { id: 'cad', label: 'Vetor CAD', icon: Layers }
                    ].map(lay => (
                      <button
                        key={lay.id}
                        onClick={() => setMapLayer(lay.id as any)}
                        className={cn(
                          "px-4 py-2 rounded-xl flex items-center gap-2 text-xs font-black uppercase tracking-widest transition-all",
                          mapLayer === lay.id 
                            ? "bg-emerald-500 text-white font-extrabold shadow-md"
                            : "text-slate-400 hover:text-white"
                        )}
                      >
                        <lay.icon className="w-3.5 h-3.5" />
                        {lay.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 5. FLOATING HUD STATS AND METADATA BAR */}
                <div className="absolute bottom-6 left-6 right-6 flex flex-wrap items-center justify-between gap-4">
                  <div className="bg-slate-950/90 backdrop-blur-md px-6 py-4 rounded-2xl border border-slate-800 shadow-2xl flex items-center gap-6">
                    <div>
                      <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1">Escala Escrita</p>
                      <p className="text-sm font-display font-black text-white leading-none">1 : 2,500</p>
                    </div>
                    <div className="h-8 w-[1px] bg-slate-850" />
                    <div>
                      <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1">Sistema Referência</p>
                      <select 
                        value={coordinateSystem} 
                        onChange={(e) => setCoordinateSystem(e.target.value as any)}
                        className="text-xs font-bold text-emerald-400 bg-transparent outline-none cursor-pointer focus:ring-0 select-none pb-0 mt-0"
                      >
                        <option value="WGS84" className="bg-slate-900 text-white">WGS 84 / UTM 32N</option>
                        <option value="ED50" className="bg-slate-900 text-white">ED 50 / Lajes</option>
                      </select>
                    </div>
                    <div className="h-8 w-[1px] bg-slate-850" />
                    <div>
                      <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1">Instruções Ativas</p>
                      <p className="text-xs text-slate-300 font-medium">
                        {activeTool === 'pointer' ? "Arraste os círculos brancos para calibrar vértices." : 
                         activeTool === 'draw' ? "Clique no mapa livremente para adicionar novos vértices." :
                         "Clique no ponto inicial e em seguida de destino para medir a distância."}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                     <button 
                       onClick={clearAllVertices}
                       className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:bg-slate-850 text-slate-400 hover:text-red-400 transition-all shadow-xl font-bold flex items-center gap-2"
                     >
                       <Trash2 className="w-5 h-5" />
                       <span className="text-xs uppercase tracking-widest font-black hidden sm:inline">Limpar Área</span>
                     </button>
                     <button 
                       onClick={resetVerticesToPreset}
                       className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:bg-slate-850 text-slate-300 transition-all shadow-xl font-bold flex items-center gap-2"
                     >
                       <RotateCcw className="w-5 h-5" />
                       <span className="text-xs uppercase tracking-widest font-black hidden sm:inline">Restaurar Croquis</span>
                     </button>
                  </div>
                </div>

              </div>

              {/* GEOM RESULTS BAR */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-[2.5rem] flex items-center gap-5 shadow-sm">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                    <Maximize2 className="w-7 h-7" />
                  </div>
                  <div>
                    <p className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Área Calculada</p>
                    <p className="text-2xl font-display font-black tracking-tight text-slate-900 dark:text-white leading-none">
                      {geomResults.area > 0 ? (
                        <>
                          {Math.round(geomResults.area).toLocaleString('pt-PT')} <span className="text-sm font-semibold">m²</span>
                        </>
                      ) : (
                        <span className="text-slate-400 text-lg font-bold">Sem polígono</span>
                      )}
                    </p>
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-[2.5rem] flex items-center gap-5 shadow-sm">
                  <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                    <Navigation className="w-7 h-7" />
                  </div>
                  <div>
                    <p className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Perímetro Computado</p>
                    <p className="text-2xl font-display font-black tracking-tight text-slate-900 dark:text-white leading-none">
                      {geomResults.perimeter > 0 ? (
                        <>
                          {Math.round(geomResults.perimeter).toLocaleString('pt-PT')} <span className="text-sm font-semibold">metros</span>
                        </>
                      ) : (
                        <span className="text-slate-400 text-lg font-bold">Sem polígono</span>
                      )}
                    </p>
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-[2.5rem] flex items-center gap-5 shadow-sm">
                  <div className="w-14 h-14 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500">
                    <CheckSquare className="w-7 h-7" />
                  </div>
                  <div>
                    <p className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Total de Vértices</p>
                    <p className="text-2xl font-display font-black tracking-tight text-slate-900 dark:text-white leading-none">
                      {vertices.length} <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest block mt-0.5 sm:inline">Delimitados</span>
                    </p>
                  </div>
                </div>

              </div>

              {/* COORDINATES MANAGEMENT TABLE */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-10 rounded-[2.5rem] shadow-sm">
                 <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                   <div>
                     <h3 className="font-display font-black text-xl tracking-tight">Georreferenciação por Vértices (WGS 84)</h3>
                     <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Vetor polígono ajustável em tempo real</p>
                   </div>
                   <button 
                     onClick={() => {
                       // Append vertex centrally
                       const safeX = 500;
                       const safeY = 300;
                       const idx = vertices.length + 1;
                       setVertices([...vertices, { id: `V${idx}`, x: safeX, y: safeY }]);
                       showToastMsg(`Vértice V${idx} adicionado no centro!`, 'info');
                     }}
                     className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-[10px] uppercase tracking-widest font-black text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-950 transition-colors flex items-center gap-2"
                   >
                     <Plus className="w-4 h-4" /> Adicionar Vértice Manual
                   </button>
                 </div>

                 {vertices.length === 0 ? (
                   <div className="p-12 text-center text-slate-400 font-medium border border-dashed border-slate-200 dark:border-slate-800 rounded-3xl bg-slate-50/50 dark:bg-slate-950/20">
                     <AlertCircle className="w-10 h-10 mx-auto text-slate-300 mb-3" />
                     Selecione a ferramenta de desenho <span className="text-emerald-500 font-bold">"+"</span> no mapa e clique para estabelecer os limites da parcela.
                   </div>
                 ) : (
                   <>
                     <div className="hidden md:block overflow-x-auto">
                       <table className="w-full text-left">
                         <thead>
                           <tr className="border-b border-slate-150 dark:border-slate-800/60 pb-4">
                             <th className="pb-4 font-black uppercase text-[10px] tracking-widest text-slate-400 pl-4">ID</th>
                             <th className="pb-4 font-black uppercase text-[10px] tracking-widest text-slate-400">Ponto X (Pixel)</th>
                             <th className="pb-4 font-black uppercase text-[10px] tracking-widest text-slate-400">Ponto Y (Pixel)</th>
                             <th className="pb-4 font-black uppercase text-[10px] tracking-widest text-slate-400">Easting (Mtrs)</th>
                             <th className="pb-4 font-black uppercase text-[10px] tracking-widest text-slate-400">Northing (Mtrs)</th>
                             <th className="pb-4 font-black uppercase text-[10px] tracking-widest text-slate-400 text-right pr-4">Instruções</th>
                           </tr>
                         </thead>
                         <tbody className="divide-y divide-slate-100 dark:divide-slate-850">
                           {vertices.map((v) => {
                             const utm = formatUTM(v.x, v.y);
                             return (
                               <tr key={v.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-955/20 transition-colors">
                                 <td className="py-4 pl-4">
                                   <span className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-black flex items-center justify-center border border-emerald-500/20">{v.id}</span>
                                 </td>
                                 <td className="py-4">
                                   <input 
                                     type="number" 
                                     value={v.x}
                                     onChange={(e) => updateVertexCoord(v.id, 'x', parseInt(e.target.value) || 0)}
                                     className="w-24 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                                   />
                                 </td>
                                 <td className="py-4">
                                   <input 
                                     type="number" 
                                     value={v.y}
                                     onChange={(e) => updateVertexCoord(v.id, 'y', parseInt(e.target.value) || 0)}
                                     className="w-24 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                                   />
                                 </td>
                                 <td className="py-4 text-xs font-mono font-bold text-slate-600 dark:text-slate-350">{utm.east}</td>
                                 <td className="py-4 text-xs font-mono font-bold text-slate-600 dark:text-slate-350">{utm.north}</td>
                                 <td className="py-4 text-right pr-4">
                                   <button 
                                     onClick={() => removeVertex(v.id)}
                                     className="p-2 hover:bg-red-500/10 rounded-lg text-slate-400 hover:text-red-500 transition-colors"
                                     title="Excluir Vértice"
                                   >
                                     <Trash2 className="w-4.5 h-4.5" />
                                   </button>
                                 </td>
                               </tr>
                             );
                           })}
                         </tbody>
                       </table>
                     </div>

                     <div className="grid grid-cols-1 gap-4 md:hidden">
                       {vertices.map((v) => {
                         const utm = formatUTM(v.x, v.y);
                         return (
                           <div key={v.id} className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/30 p-4">
                             <div className="flex items-center justify-between gap-3">
                               <span className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-black flex items-center justify-center border border-emerald-500/20">
                                 {v.id}
                               </span>
                               <button
                                 onClick={() => removeVertex(v.id)}
                                 className="p-2 hover:bg-red-500/10 rounded-lg text-slate-400 hover:text-red-500 transition-colors"
                                 title="Excluir Vértice"
                               >
                                 <Trash2 className="w-4.5 h-4.5" />
                               </button>
                             </div>

                             <div className="mt-4 grid grid-cols-1 gap-3">
                               <div>
                                 <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Ponto X</label>
                                 <input
                                   type="number"
                                   value={v.x}
                                   onChange={(e) => updateVertexCoord(v.id, 'x', parseInt(e.target.value) || 0)}
                                   className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                                 />
                               </div>
                               <div>
                                 <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Ponto Y</label>
                                 <input
                                   type="number"
                                   value={v.y}
                                   onChange={(e) => updateVertexCoord(v.id, 'y', parseInt(e.target.value) || 0)}
                                   className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                                 />
                               </div>
                               <div className="flex items-center justify-between gap-3">
                                 <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Easting</span>
                                 <span className="text-xs font-mono font-bold text-slate-600 dark:text-slate-350">{utm.east}</span>
                               </div>
                               <div className="flex items-center justify-between gap-3">
                                 <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Northing</span>
                                 <span className="text-xs font-mono font-bold text-slate-600 dark:text-slate-350">{utm.north}</span>
                               </div>
                             </div>
                           </div>
                         );
                       })}
                     </div>
                   </>
                 )}
              </div>

            </div>

            {/* SIDEBAR DETAILS PANEL AND ANCILLARY CONTROLS */}
            <div className="space-y-6">
              
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-[2.5rem] space-y-6 shadow-sm">
                <h3 className="font-display font-black text-xl tracking-tight flex items-center gap-2">
                  <Info className="w-5 h-5 text-emerald-500" /> Atuação Territorial
                </h3>
                
                <div className="space-y-4">
                  
                  <div className="space-y-1.5">
                     <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Requerente Cadastrado</label>
                     <input 
                       type="text" 
                       value={applicant}
                       onChange={(e) => setApplicant(e.target.value)}
                       placeholder="Insira o nome do requerente"
                       className="w-full px-5 py-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800/80 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                     />
                  </div>

                  <div className="space-y-1.5">
                     <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Distrito Político</label>
                     <select 
                       value={district}
                       onChange={(e) => setDistrict(e.target.value)}
                       className="w-full px-5 py-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800/80 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 select-none cursor-pointer"
                     >
                       <option value="Água Grande">Água Grande (Capital)</option>
                       <option value="Mé-Zóchi">Mé-Zóchi</option>
                       <option value="Lobata">Lobata</option>
                       <option value="Cantagalo">Cantagalo</option>
                       <option value="Lembá">Lembá</option>
                       <option value="Caué">Caué</option>
                       <option value="Pagué">Pagué (Região Autónoma do Príncipe)</option>
                     </select>
                  </div>

                  <div className="space-y-1.5">
                     <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Localidade do Terreno</label>
                     <input 
                       type="text" 
                       value={locality}
                       onChange={(e) => setLocality(e.target.value)}
                       placeholder="E.g. Bairro do Hospital"
                       className="w-full px-5 py-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800/80 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                     />
                  </div>

                  <div className="space-y-1.5">
                     <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Uso de Solo Permitido</label>
                     <select 
                       value={usage}
                       onChange={(e) => setUsage(e.target.value)}
                       className="w-full px-5 py-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800/80 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 select-none cursor-pointer"
                     >
                       <option value="Urbano Consolidado">Habitacional / Urbano Consolidado</option>
                       <option value="Residencial">Multifamiliar / Residencial</option>
                       <option value="Comercial / Industrial">Industrial / Comercial Especial</option>
                       <option value="Agrícola">Uso Agrícola Integral</option>
                       <option value="Misto">Misto (Residencial e Comercial)</option>
                     </select>
                  </div>

                </div>

                {/* VISUAL DOCUMENTS & PHOTOS INTEGRATION */}
                <div className="pt-6 border-t border-slate-100 dark:border-slate-800 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 select-none">Levantamentos e Fotos</h3>
                    <button 
                      onClick={handleTriggerUpload}
                      className="text-[10px] font-black uppercase text-emerald-500 tracking-wider hover:underline"
                    >
                      Inserir Ficheiro
                    </button>
                  </div>

                  {imagesList.length === 0 ? (
                    <p className="text-xs text-slate-400 select-none">Nenhuma fotografia de campo associada.</p>
                  ) : (
                    <div className="grid grid-cols-3 gap-3">
                      {imagesList.map((img, i) => (
                        <div key={i} className="aspect-square rounded-xl bg-slate-100 dark:bg-slate-850 overflow-hidden relative group cursor-pointer shadow-sm border border-slate-100 dark:border-slate-800">
                          <img 
                            src={img} 
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute inset-0 bg-emerald-500/20 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center backdrop-blur-[1px]">
                            <Eye className="w-5 h-5 text-white" />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Documents files list */}
                  {docsList.length > 0 && (
                    <div className="space-y-2 pt-2">
                      {docsList.map((d, i) => (
                        <div key={i} className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20 flex items-center justify-between gap-2">
                          <p className="text-[11px] font-bold text-slate-700 dark:text-slate-350 line-clamp-1">{d.name}</p>
                          <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500">{d.type}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  <button 
                    onClick={handleTriggerUpload}
                    className="w-full py-3.5 rounded-2xl border-2 border-dashed border-slate-250 dark:border-slate-850 hover:border-emerald-500/40 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-emerald-500 transition-all flex items-center justify-center gap-2"
                  >
                    <Upload className="w-4 h-4" /> Importar Documentos
                  </button>
                </div>

              </div>

              {/* HIGH FIDELITY SYSTEM ACCENTS (No mock logs/telemetry but standard certification references) */}
              <div className="p-8 rounded-[2.5rem] bg-emerald-50 dark:bg-slate-900 border border-emerald-200 dark:border-slate-800 relative overflow-hidden shadow-sm">
                 <div className="relative z-10 space-y-4">
                   <div className="flex items-center gap-3">
                     <CheckSquare className="text-emerald-600 dark:text-emerald-400 w-5 h-5" />
                     <h4 className="font-display font-black text-sm uppercase tracking-wider text-slate-900 dark:text-white">Certificador SIG Criptográfico</h4>
                   </div>
                   <p className="text-slate-500 dark:text-slate-400 text-xs font-medium leading-relaxed">
                     Esta estação gerará automaticamente um comprovativo eletrónico georreferenciado e uma planta de implantação oficial com hash de integridade irreversível (SHA-256).
                   </p>
                 </div>
                 <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 dark:bg-emerald-500/5 rounded-full blur-[40px] translate-y-[-20px]" />
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}
