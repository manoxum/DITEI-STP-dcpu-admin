import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { 
  Map as MapIcon, 
  Scissors, 
  Grid, 
  Undo, 
  Save, 
  Check, 
  ZoomIn, 
  ZoomOut,
  Users,
  Search,
  ArrowRight,
  SplitSquareHorizontal,
  SplitSquareVertical,
  Trash2,
  MapPin,
  Hexagon,
  PenTool,
  PencilRuler,
  CornerUpLeft,
  MousePointer2,
  Activity,
  Layers,
  Maximize2,
  Route,
  Waves,
  Plus,
  Trees,
  Mountain,
  Ruler,
  Droplets
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { UniversalMap } from '../maps/UniversalMap';
import { MapProviderType } from '../maps/types';
import Draggable from 'react-draggable';
import { useMapEvents, Polygon, Polyline, Marker, useMap, SVGOverlay } from 'react-leaflet';
import L from 'leaflet';

// Compute approx area on earth surface in square meters
function estimateGeoArea(points: {lat: number, lng: number}[]) {
  if (points.length < 3) return 0;
  let area = 0;
  for (let i = 0; i < points.length; i++) {
      let j = (i + 1) % points.length;
      area += (points[i].lng * Math.PI / 180) * (points[j].lat * Math.PI / 180) - (points[j].lng * Math.PI / 180) * (points[i].lat * Math.PI / 180);
  }
  return Math.abs(area) * 0.5 * 6378137 * 6378137;
}

const dotIcon = L.divIcon({
  className: 'custom-plot-marker',
  html: `<div style="width:14px;height:14px;background-color:#fff;border:3px solid #10b981;border-radius:50%;box-shadow:0 0 4px rgba(0,0,0,0.3);position:relative;left:-7px;top:-7px;pointer-events:none;"></div>`,
  iconSize: [0, 0],
  iconAnchor: [0, 0]
});

function DrawPlotMap({ points, setPoints, onAreaChange }: any) {
  useMapEvents({
    click(e) {
       const newPts = [...points, { lat: e.latlng.lat, lng: e.latlng.lng }];
       setPoints(newPts);
       if (newPts.length >= 3) onAreaChange(Math.round(estimateGeoArea(newPts)));
    }
  });

  return (
    <>
      {points.length > 2 && (
        <Polygon 
           positions={points} 
           pathOptions={{ color: '#10b981', weight: 4, fillColor: '#10b981', fillOpacity: 0.3, dashArray: '8, 8' }} 
        />
      )}
      {points.length > 0 && points.length <= 2 && (
        <Polyline 
           positions={points} 
           pathOptions={{ color: '#10b981', weight: 4, dashArray: '8, 8' }} 
        />
      )}
      {points.map((p: any, i: number) => (
         <Marker 
           key={`pt-${i}`}
           position={p}
           icon={dotIcon}
           draggable={true}
           eventHandlers={{
             drag: (e) => {
                const marker = e.target;
                const pos = marker.getLatLng();
                const newPts = [...points];
                newPts[i] = { lat: pos.lat, lng: pos.lng };
                setPoints(newPts);
             },
             dragend: (e) => {
                const marker = e.target;
                const pos = marker.getLatLng();
                const newPts = [...points];
                newPts[i] = { lat: pos.lat, lng: pos.lng };
                setPoints(newPts);
                if (newPts.length >= 3) onAreaChange(Math.round(estimateGeoArea(newPts)));
             }
           }}
         />
      ))}
    </>
  );
}

// Mock data for requests
const MOCK_REQUESTS = [
  { id: 'PROC-2023-001', name: 'João Manuel Silva', area: 500, type: 'Habitação' },
  { id: 'PROC-2023-042', name: 'Maria Santos', area: 1200, type: 'Agricultura' },
  { id: 'PROC-2023-089', name: 'Carlos Ferreira', area: 450, type: 'Habitação' },
  { id: 'PROC-2023-112', name: 'Ana Rodrigues', area: 800, type: 'Misto' },
  { id: 'PROC-2023-156', name: 'Rui Costa', area: 600, type: 'Comércio' },
];

const MASTER_PLOTS = [
  { id: 'GL-TRIN-001', name: 'Gleba A - Trindade', area: 50000, location: 'Mé-Zóchi', status: 'available', contour: 'Irregular', date: '21 Mai 2024', customPoints: null },
  { id: 'GL-AGUA-042', name: 'Talhão Central - Água Grande', area: 15000, location: 'Água Grande', status: 'in-progress', contour: 'Regular', date: '14 Abr 2024', customPoints: null },
  { id: 'GL-LOB-112', name: 'Zona de Expansão Norte', area: 120000, location: 'Lobata', status: 'available', contour: 'Irregular', date: '02 Jun 2024', customPoints: null },
  { id: 'GL-CAU-089', name: 'Parcela Ribeirinha - Caué', area: 35000, location: 'Caué', status: 'completed', contour: 'Irregular', date: '10 Jan 2024', customPoints: null },
];

// Tree-based geometry instead of generic rects, to support draggable divisions properly!
type LayoutTree = 
  | { type: 'leaf', id: string, assignedTo?: string, color?: string }
  | { 
      type: 'split', id: string, dir: 'v' | 'h', ratio: number, 
      curvePos: number, // % 
      curveOffset: number, // % deviation
      child1: LayoutTree, child2: LayoutTree 
    };

type PathRect = {
  id: string, x: number, y: number, w: number, h: number, 
  assignedTo?: string, color?: string, areaRatio: number
};

type Divider = {
  id: string, dir: 'v' | 'h', x: number, y: number, w: number, h: number, 
  ratio: number, curvePos: number, curveOffset: number, nodeRef: any
};

// Flatten tree to get renderable rectangles and dividers
function flattenTree(node: LayoutTree, x: number, y: number, w: number, h: number, areaTotal: number): { rects: PathRect[], divs: Divider[] } {
  if (node.type === 'leaf') {
    return {
      rects: [{ id: node.id, x, y, w, h, assignedTo: node.assignedTo, color: node.color, areaRatio: areaTotal }],
      divs: []
    };
  }

  const r = typeof node.ratio === 'number' && !isNaN(node.ratio) ? node.ratio : 50;
  
  if (node.dir === 'v') {
    const leftW = w * (r / 100);
    const rightW = w - leftW;
    const l1 = flattenTree(node.child1, x, y, leftW, h, areaTotal * (r / 100));
    const l2 = flattenTree(node.child2, x + leftW, y, rightW, h, areaTotal * (1 - r / 100));
    const me: Divider = { id: node.id, dir: 'v', x, y, w, h, ratio: r, curvePos: node.curvePos, curveOffset: node.curveOffset, nodeRef: node };
    return { rects: [...l1.rects, ...l2.rects], divs: [me, ...l1.divs, ...l2.divs] };
  } else {
    const topH = h * (r / 100);
    const botH = h - topH;
    const l1 = flattenTree(node.child1, x, y, w, topH, areaTotal * (r / 100));
    const l2 = flattenTree(node.child2, x, y + topH, w, botH, areaTotal * (1 - r / 100));
    const me: Divider = { id: node.id, dir: 'h', x, y, w, h, ratio: r, curvePos: node.curvePos, curveOffset: node.curveOffset, nodeRef: node };
    return { rects: [...l1.rects, ...l2.rects], divs: [me, ...l1.divs, ...l2.divs] };
  }
}

// Modify tree node entirely functionally
function updateNode(tree: LayoutTree, id: string, updater: (n: LayoutTree) => LayoutTree): LayoutTree {
  if (tree.id === id) return updater({ ...tree });
  if (tree.type === 'split') {
    return { ...tree, child1: updateNode(tree.child1, id, updater), child2: updateNode(tree.child2, id, updater) };
  }
  return tree;
}

export function LandPlanningView() {
  const location = useLocation();
  const [viewMode, setViewMode] = useState<'list' | 'workspace' | 'map_drawing'>('list');
  const [displayMode, setDisplayMode] = useState<'card' | 'table'>('card');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeProject, setActiveProject] = useState('PROJ-ZSO-001');
  
  const [activeTool, setActiveTool] = useState<'select' | 'split_v' | 'split_h' | 'curve' | 'road' | 'river' | 'tree' | 'ruler' | 'freecut'>('select');
  const [mapLayer, setMapLayer] = useState<'cad' | 'satellite' | 'terrain'>('cad');
  const [scaleZoom, setScaleZoom] = useState(1);
  const [totalArea, setTotalArea] = useState(10000); // 10,000 sqm
  
  const [layout, setLayout] = useState<LayoutTree>({ type: 'leaf', id: 'parcel-root' });
  const [selectedParcel, setSelectedParcel] = useState<string | null>('parcel-root');
  const [searchProcess, setSearchProcess] = useState('');
  const [mockPlots, setMockPlots] = useState(MASTER_PLOTS);
  const [showFilters, setShowFilters] = useState(false);

  // Natural Elements State
  const [roads, setRoads] = useState<{ id: string, d: string }[]>([]);
  const [rivers, setRivers] = useState<{ id: string, d: string }[]>([]);
  const [trees, setTrees] = useState<{ id: string, x: number, y: number }[]>([]);
  const [rulers, setRulers] = useState<{ id: string, d: string, dist: number }[]>([]);
  const [freecuts, setFreeCuts] = useState<{ id: string, d: string }[]>([]);

  const svgRef = useRef<SVGSVGElement | SVGGElement>(null);
  const [drawingPts, setDrawingPts] = useState<{x:number, y:number}[]>([]);
  
  // Custom Plot Drawing State
  const mapSvgRef = useRef<SVGSVGElement>(null);
  const [customPlotPoints, setCustomPlotPoints] = useState<{lat:number, lng:number}[]>([]);
  const [isDrawingPlot, setIsDrawingPlot] = useState(true);
  const [plotName, setPlotName] = useState('Novo Loteamento');
  const [plotLocation, setPlotLocation] = useState('Região Central');
  const [plotArea, setPlotArea] = useState('10000');
  const [draggingPtIndex, setDraggingPtIndex] = useState<number | null>(null);
  const [providerMapMode, setProviderMapMode] = useState<MapProviderType>('satellite');
  
  const [draggingDiv, setDraggingDiv] = useState<{id: string, dir: 'v'|'h'} | null>(null);

  useEffect(() => {
    if (location.state && location.state.processId) {
      const pId = location.state.processId;
      setMockPlots(prev => {
        if (!prev.find(p => p.id === pId)) {
          return [{
            id: pId,
            name: `Parcela Integrada: ${pId}`,
            area: 1245,
            location: 'Importado de Delimitação',
            status: 'available',
            contour: 'Importado',
            date: new Date().toLocaleDateString('pt-PT')
          }, ...prev];
        }
        return prev;
      });
      setActiveProject(pId);
      setViewMode('workspace');
      window.history.replaceState({}, document.title);
    }
  }, [location]);
  
  const handleSplit = (direction: 'v' | 'h') => {
    if (!selectedParcel) return;
    
    setLayout(prev => updateNode(prev, selectedParcel, (n) => {
      if (n.type !== 'leaf') return n;
      return {
        type: 'split',
        id: `split-${Date.now()}`,
        dir: direction,
        ratio: 50,
        curvePos: 50,
        curveOffset: 0,
        child1: { type: 'leaf', id: `parcel-${Date.now()}-1`, assignedTo: n.assignedTo, color: n.color },
        child2: { type: 'leaf', id: `parcel-${Date.now()}-2` }
      };
    }));
    
    setSelectedParcel(null);
    setActiveTool('select');
  };

  const handleReset = () => {
    setLayout({ type: 'leaf', id: 'parcel-root' });
    setSelectedParcel('parcel-root');
    setRoads([]);
    setRivers([]);
    setTrees([]);
    setRulers([]);
    setFreeCuts([]);
  };

  const assignProcess = (processId: string) => {
    if (!selectedParcel) return;
    const colors = ['fill-blue-500', 'fill-emerald-500', 'fill-purple-500', 'fill-amber-500', 'fill-rose-500', 'fill-cyan-500'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    
    setLayout(prev => updateNode(prev, selectedParcel, (n) => ({ ...n, assignedTo: processId, color: randomColor })));
    setSelectedParcel(null);
  };

  const removeAssignment = (id: string) => {
    setLayout(prev => updateNode(prev, id, (n) => ({ ...n, assignedTo: undefined, color: undefined })));
  };

  // Convert SVG coordinates
  const getSvgPoint = (e: React.MouseEvent | React.TouchEvent, ref: React.RefObject<SVGSVGElement | SVGGElement>) => {
    if (!ref.current) return { x: 0, y: 0 };
    const CTM = ref.current.getScreenCTM();
    if (!CTM) return { x: 0, y: 0 };
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
    return {
      x: (clientX - CTM.e) / CTM.a,
      y: (clientY - CTM.f) / CTM.d
    };
  };

  const handleCanvasMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
    if (activeTool === 'select' || activeTool === 'split_v' || activeTool === 'split_h' || activeTool === 'curve') return;
    const pt = getSvgPoint(e, svgRef);
    if (activeTool === 'tree') {
      setTrees(prev => [...prev, { id: `tree-${Date.now()}`, x: pt.x, y: pt.y }]);
      return;
    }
    setDrawingPts([pt]);
  };

  const handleCanvasMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (draggingDiv) {
      const pt = getSvgPoint(e, svgRef);
      setLayout(prev => updateNode(prev, draggingDiv.id, (n) => {
        if (n.type !== 'split') return n;
        
        const { divs } = flattenTree(prev, 0, 0, 100, 100, 1);
        const div = divs.find(d => d.id === draggingDiv.id);
        if (!div) return n;

        if (n.dir === 'v') {
          const ratio = Math.max(5, Math.min(95, ((pt.x - div.x) / div.w) * 100));
          return { ...n, ratio };
        } else {
          const ratio = Math.max(5, Math.min(95, ((pt.y - div.y) / div.h) * 100));
          return { ...n, ratio };
        }
      }));
      return;
    }

    if (drawingPts.length > 0) {
      const pt = getSvgPoint(e, svgRef);
      setDrawingPts(prev => [...prev, pt]);
    }
  };

  const handleCanvasMouseUp = () => {
    if (draggingDiv) {
      setDraggingDiv(null);
    }
    if (drawingPts.length > 1) {
      const d = drawingPts.map((p, i) => `${i===0?'M':'L'} ${p.x} ${p.y}`).join(' ');
      if (activeTool === 'road') setRoads(p => [...p, { id: `road-${Date.now()}`, d }]);
      else if (activeTool === 'river') setRivers(p => [...p, { id: `river-${Date.now()}`, d }]);
      else if (activeTool === 'freecut') {
         const startPt = drawingPts[0];
         const endPt = drawingPts[drawingPts.length - 1];
         const drawnMidPt = drawingPts[Math.floor(drawingPts.length / 2)];
         
         const { rects } = flattenTree(layout, 0, 0, 100, 100, 1);
         const hitRect = rects.find(r => 
           drawnMidPt.x >= r.x && drawnMidPt.x <= r.x + r.w && 
           drawnMidPt.y >= r.y && drawnMidPt.y <= r.y + r.h
         ) || rects[0];
         
         if (hitRect) {
            const dx = Math.abs(endPt.x - startPt.x);
            const dy = Math.abs(endPt.y - startPt.y);
            const isV = dy > dx;
            
            let ratio = 50;
            let curveOffset = 0;
            let curvePos = 50;
            
            if (isV) {
                ratio = ((drawnMidPt.x - hitRect.x) / hitRect.w) * 100;
                curveOffset = drawnMidPt.x - ((startPt.x + endPt.x) / 2);
                curvePos = ((drawnMidPt.y - hitRect.y) / hitRect.h) * 100;
            } else {
                ratio = ((drawnMidPt.y - hitRect.y) / hitRect.h) * 100;
                curveOffset = drawnMidPt.y - ((startPt.y + endPt.y) / 2);
                curvePos = ((drawnMidPt.x - hitRect.x) / hitRect.w) * 100;
            }
            
            ratio = Math.max(5, Math.min(95, ratio));
            curveOffset = Math.max(-40, Math.min(40, curveOffset));
            curvePos = Math.max(10, Math.min(90, curvePos));
            
            setLayout(prev => updateNode(prev, hitRect.id, (n) => {
              if (n.type !== 'leaf') return n;
              return {
                type: 'split',
                id: `split-${Date.now()}`,
                dir: isV ? 'v' : 'h',
                ratio,
                curvePos,
                curveOffset: curveOffset * 1.5,
                child1: { type: 'leaf', id: `parcel-${Date.now()}-1`, assignedTo: n.assignedTo, color: n.color },
                child2: { type: 'leaf', id: `parcel-${Date.now()}-2` }
              };
            }));
            setFreeCuts(p => [...p, { id: `freecut-${Date.now()}`, d }]);
         }
      }
      else if (activeTool === 'ruler') {
         const p1 = drawingPts[0];
         const p2 = drawingPts[drawingPts.length-1];
         // Very rough distance estimation on a 100x100 grid based on totalArea
         const gridDist = Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
         const sideLen = Math.sqrt(totalArea);
         const dist = (gridDist / 100) * sideLen;
         setRulers(p => [...p, { id: `ruler-${Date.now()}`, d: `M ${p1.x} ${p1.y} L ${p2.x} ${p2.y}`, dist }]);
      }
      setDrawingPts([]);
      setActiveTool('select');
    } else {
      setDrawingPts([]);
    }
  };

  const handleCurveDrag = (id: string, offsetDelta: number) => {
    setLayout(prev => updateNode(prev, id, (n) => {
      if (n.type !== 'split') return n;
      return { ...n, curveOffset: Math.max(-40, Math.min(40, n.curveOffset + offsetDelta)) };
    }));
  };

  const { rects, divs } = flattenTree(layout, 0, 0, 100, 100, 1);
  const assignedArea = rects.filter(p => p.assignedTo).reduce((acc, p) => acc + (totalArea * p.areaRatio), 0);
  const freeArea = totalArea - assignedArea;

  const filteredPlots = mockPlots.filter(plot => 
    plot.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
    plot.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    plot.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (viewMode === 'list') {
    return (
      <div className="space-y-6 relative pb-20">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-display font-black tracking-tighter">Planeamento de Loteamento</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium">Selecione uma Gleba principal para realizar distribuições e loteamentos.</p>
          </div>
          <div className="flex flex-wrap items-center gap-3 shrink-0">
             <div className="bg-slate-100 dark:bg-slate-800 p-1 rounded-xl hidden md:flex">
               <button 
                 onClick={() => setDisplayMode('card')}
                 title="Visualização em Cartões"
                 className={cn("px-3.5 py-2.5 rounded-lg transition-all flex items-center gap-2 text-xs font-black uppercase tracking-wider", displayMode === 'card' ? "bg-white dark:bg-slate-700 shadow-sm text-emerald-600 dark:text-emerald-400" : "text-slate-400")}
               >
                 <MapPin className="w-4 h-4" />
                 <span>Cartões</span>
               </button>
               <button 
                 onClick={() => setDisplayMode('table')}
                 title="Visualização em Tabela"
                 className={cn("px-3.5 py-2.5 rounded-lg transition-all flex items-center gap-2 text-xs font-black uppercase tracking-wider", displayMode === 'table' ? "bg-white dark:bg-slate-700 shadow-sm text-emerald-600 dark:text-emerald-400" : "text-slate-400")}
               >
                 <Layers className="w-4 h-4" />
                 <span>Lista</span>
               </button>
             </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-3xl flex flex-wrap items-center justify-between gap-4 shadow-sm">
          <div className="relative flex-1 min-w-[300px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Pesquisar lotes (Por ID, nome, localização)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
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
              <Activity className="w-4 h-4 hidden" /> <Layers className="w-4 h-4" /> Filtros Avançados
            </button>
            <div className="px-4 py-2.5 bg-slate-100 dark:bg-slate-950 border border-slate-100 dark:border-slate-850 rounded-xl text-xs font-black uppercase tracking-wider text-slate-500 flex items-center gap-2">
              Resultados: {filteredPlots.length}
            </div>
            <div className="w-px h-8 bg-slate-200 dark:bg-slate-700"></div>
            <button 
              onClick={() => {
                setCustomPlotPoints([]);
                setIsDrawingPlot(true);
                setViewMode('map_drawing');
              }}
              className="px-5 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors shadow-md shadow-emerald-500/20 flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> Novo Loteamento
            </button>
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
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Estado de Execução</label>
                  <select className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 px-4 py-2.5 rounded-xl text-sm font-medium focus:outline-none focus:border-emerald-500">
                    <option value="">Todos os Estados</option>
                    <option value="available">Disponível</option>
                    <option value="in-progress">Em Progresso</option>
                    <option value="completed">Concluída</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Distrito Geográfico</label>
                  <select className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 px-4 py-2.5 rounded-xl text-sm font-medium focus:outline-none focus:border-emerald-500">
                    <option value="">Todos os Distritos</option>
                    <option value="agua-grande">Água Grande</option>
                    <option value="me-zochi">Mé-Zóchi</option>
                    <option value="lemba">Lembá</option>
                    <option value="caué">Caué</option>
                    <option value="lobata">Lobata</option>
                    <option value="cantagalo">Cantagalo</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Dimensão da Gleba</label>
                  <select className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 px-4 py-2.5 rounded-xl text-sm font-medium focus:outline-none focus:border-emerald-500">
                    <option value="">Qualquer Dimensão</option>
                    <option value="small">Menos de 10,000m²</option>
                    <option value="medium">10,000m² - 50,000m²</option>
                    <option value="large">Mais de 50,000m²</option>
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

        {displayMode === 'card' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            {filteredPlots.map(plot => (
              <div key={plot.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm hover:shadow-md transition-all hover:border-emerald-500/30 group cursor-pointer flex flex-col justify-between" onClick={() => {
                setActiveProject(plot.id);
                setTotalArea(plot.area);
                setViewMode('workspace');
                handleReset();
              }}>
                 <div>
                   <div className="flex justify-between items-center mb-3">
                     <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 flex items-center justify-center">
                       <MapIcon className="w-5 h-5 text-indigo-500" />
                     </div>
                     <span className={cn(
                       "text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border",
                       plot.status === 'available' ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 border-emerald-500/20" : 
                       plot.status === 'in-progress' ? "bg-amber-50 text-amber-600 dark:bg-amber-500/10 border-amber-500/20" :
                       "bg-blue-50 text-blue-600 dark:bg-blue-500/10 border-blue-500/20"
                     )}>
                       {plot.status === 'available' ? 'Pendente' : plot.status === 'in-progress' ? 'Em Progresso' : 'Concluído'}
                     </span>
                   </div>
                   
                   <div className="mb-3">
                     <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-0.5">{plot.id}</p>
                     <h3 className="text-lg font-bold text-slate-900 dark:text-white line-clamp-1">{plot.name}</h3>
                   </div>
                   
                   <div className="space-y-1.5 mb-4 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-700/30">
                     <div className="flex items-center justify-between text-[11px] font-medium">
                       <span className="text-slate-500 flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-slate-400" /> Localização</span>
                       <span className="text-slate-700 dark:text-slate-300 font-semibold">{plot.location}</span>
                     </div>
                     <div className="flex items-center justify-between text-[11px] font-medium">
                       <span className="text-slate-500 flex items-center gap-1.5"><Maximize2 className="w-3.5 h-3.5 text-slate-400" /> Área Total</span>
                       <span className="text-slate-700 dark:text-slate-300 font-mono font-bold tracking-tight">{plot.area.toLocaleString()} m²</span>
                     </div>
                   </div>
                 </div>
                 
                 <div className="flex items-center justify-end">
                   <button className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 transition-colors bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 px-3 py-1.5 rounded-lg hover:bg-emerald-100 dark:hover:bg-emerald-500/20 flex items-center gap-1.5">
                     Workspace <ArrowRight className="w-3 h-3" />
                   </button>
                 </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 rounded-3xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-50 dark:bg-slate-950 border-b border-slate-100 dark:border-slate-850">
                  <tr>
                    <th className="pl-8 pr-4 py-4.5 font-bold text-xs uppercase tracking-wider text-slate-400">Referência e Nome</th>
                    <th className="px-6 py-4.5 font-bold text-xs uppercase tracking-wider text-slate-400">Localização</th>
                    <th className="px-6 py-4.5 font-bold text-xs uppercase tracking-wider text-slate-400">Área</th>
                    <th className="px-6 py-4.5 font-bold text-xs uppercase tracking-wider text-slate-400 text-center">Status</th>
                    <th className="pr-8 pl-4 py-4.5 text-right font-bold text-xs uppercase tracking-wider text-slate-400">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredPlots.map((plot) => (
                    <tr 
                      key={plot.id} 
                      onClick={() => {
                        setActiveProject(plot.id);
                        setTotalArea(plot.area);
                        setViewMode('workspace');
                        handleReset();
                      }}
                      className="hover:bg-slate-50/80 dark:hover:bg-slate-950/60 transition-all cursor-pointer group"
                    >
                      <td className="pl-8 pr-4 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-500 shrink-0">
                            <MapIcon className="w-4 h-4" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="font-bold text-sm tracking-tight text-slate-800 dark:text-slate-100 truncate">{plot.name}</p>
                            <p className="text-[10px] font-semibold text-slate-450 opacity-70 uppercase tracking-widest">{plot.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-medium text-slate-600 dark:text-slate-300 line-clamp-1">{plot.location}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-semibold text-slate-500 dark:text-slate-400 font-mono">{plot.area.toLocaleString()} m²</span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className={cn(
                          "inline-flex items-center px-2.5 py-1 rounded text-[10px] font-black uppercase tracking-wider border",
                          plot.status === 'available' ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 border-emerald-500/20" : 
                          plot.status === 'in-progress' ? "bg-amber-50 text-amber-600 dark:bg-amber-500/10 border-amber-500/20" :
                          "bg-blue-50 text-blue-600 dark:bg-blue-500/10 border-blue-500/20"
                        )}>
                          {plot.status === 'available' ? 'Pendente' : plot.status === 'in-progress' ? 'Progresso' : 'Concluído'}
                        </div>
                      </td>
                      <td className="pr-8 pl-4 py-4 text-right">
                        <button className="text-[10px] font-bold uppercase tracking-wider text-slate-500 hover:text-emerald-600 transition-colors bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 py-1.5 rounded-lg shadow-sm hover:border-emerald-500/30">
                          Planejar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    );
  }

  const handleSaveCustomPlot = () => {
    if (customPlotPoints.length < 3) return;
    const newId = `GL-CUST-${Math.floor(Math.random() * 1000)}`;
    const newPlot = {
      id: newId, 
      name: plotName, 
      area: parseInt(plotArea) || 10000, 
      location: plotLocation, 
      status: 'available', 
      contour: 'Custom', 
      date: new Date().toLocaleDateString('pt-PT'),
      customPoints: customPlotPoints
    };
    setMockPlots(prev => [newPlot, ...prev]);
    setActiveProject(newId);
    setTotalArea(newPlot.area);
    setViewMode('workspace');
    handleReset();
  };



  if (viewMode === 'map_drawing') {
    return (
      <div className="h-[calc(100vh-6rem)] flex flex-col relative">
         <div className="absolute top-6 left-6 z-30">
           <button 
             onClick={() => setViewMode('list')}
             className="flex items-center gap-2 text-sm font-bold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg px-4 py-2.5 rounded-xl text-slate-600 hover:text-emerald-600 transition-colors"
           >
             <CornerUpLeft className="w-4 h-4" /> Cancelar
           </button>
         </div>

         <div className="absolute bottom-6 left-6 z-30 bg-white/90 dark:bg-slate-900/90 backdrop-blur outline outline-1 outline-slate-200 dark:outline-slate-800 p-1.5 rounded-2xl flex flex-col gap-1 shadow-2xl">
            {(['osm', 'carto', 'satellite', 'simple'] as MapProviderType[]).map(ptype => (
               <button
                 key={ptype}
                 onClick={() => setProviderMapMode(ptype)}
                 className={cn(
                   "px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                   providerMapMode === ptype ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/20" : "text-slate-500 hover:bg-slate-100 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
                 )}
               >
                 {ptype}
               </button>
            ))}
         </div>
         
         <Draggable handle=".drag-handle" bounds="parent">
          <div className="absolute top-6 right-6 z-30 w-80 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl rounded-3xl p-6 flex flex-col max-h-[85vh] overflow-hidden">
            <h3 className="drag-handle cursor-move font-display font-black text-xl tracking-tight mb-4 flex items-center gap-2 text-slate-800 dark:text-white pb-2 border-b border-slate-100 dark:border-slate-800">
              <MapPin className="text-emerald-500 w-5 h-5 pointer-events-none" />
              Novo Loteamento
            </h3>
            
            <div className="space-y-4 overflow-y-auto pr-2 custom-scrollbar">
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 block mb-1">Nome da Gleba</label>
                <input type="text" value={plotName} onChange={e => setPlotName(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl px-3 py-2 text-sm font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none" />
              </div>
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 block mb-1">Localização</label>
                <input type="text" value={plotLocation} onChange={e => setPlotLocation(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl px-3 py-2 text-sm font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none" />
              </div>
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 block mb-1">Área Estimada (m²)</label>
                <input type="number" value={plotArea} onChange={e => setPlotArea(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl px-3 py-2 text-sm font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none" />
              </div>

               <div className="mt-6 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50">
                  <p className="text-xs text-slate-600 dark:text-slate-400 font-medium text-center">
                    {customPlotPoints.length === 0 ? 'Clique no mapa para iniciar o polígono' : customPlotPoints.length < 3 ? 'Adicione mais pontos para fechar a área' : 'Área baseada no formato traçado no mapa.'}
                  </p>
               </div>

               <button 
                 disabled={customPlotPoints.length < 3}
                 onClick={handleSaveCustomPlot}
                 className="mt-4 w-full bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 disabled:hover:bg-emerald-500 text-white font-bold text-sm tracking-wide py-3 rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
               >
                 <Check className="w-4 h-4" /> 
                 {customPlotPoints.length < 3 ? 'Defina a Área Geográfica' : 'Ir para Loteamento'}
               </button>
            </div>
          </div>
         </Draggable>

         <div className="flex-1 bg-slate-200 dark:bg-slate-800 relative z-10 overflow-hidden cursor-crosshair">
            <div className="absolute inset-0 z-0">
               <UniversalMap 
                  center={[0.33, 6.73]} // Central coordinates of STP
                  zoom={12} 
                  provider={providerMapMode} 
                  zoomControl={false}
               >
                 <DrawPlotMap 
                    points={customPlotPoints} 
                    setPoints={setCustomPlotPoints} 
                    draggingIndex={draggingPtIndex} 
                    setDraggingIndex={setDraggingPtIndex}
                    onAreaChange={(area) => setPlotArea(area.toString())}
                 />
               </UniversalMap>
            </div>
            {/* Draw Overlay */}
            <div className="absolute inset-0 bg-emerald-950/10 backdrop-blur-[1px] z-10 pointer-events-none" />
         </div>
      </div>
    );
  }

  const activePlotData = mockPlots.find(p => p.id === activeProject);

  const getClipPath = () => {
    if (activePlotData?.customPoints && activePlotData.customPoints.length > 2) {
      const minX = Math.min(...activePlotData.customPoints.map(p => p.lng));
      const maxX = Math.max(...activePlotData.customPoints.map(p => p.lng));
      const minY = Math.min(...activePlotData.customPoints.map(p => p.lat));
      const maxY = Math.max(...activePlotData.customPoints.map(p => p.lat));
      const rangeX = (maxX - minX) || 1;
      const rangeY = (maxY - minY) || 1;
      
      const pts = activePlotData.customPoints.map(p => {
        const nx = ((p.lng - minX) / rangeX) * 100;
        // Invert Y axis for CSS clip-path (lat increases north, but CSS percentage increases going down)
        const ny = (1 - ((p.lat - minY) / rangeY)) * 100;
        return `${nx}% ${ny}%`;
      }).join(', ');
      return `polygon(${pts})`;
    }
    const c = activePlotData?.contour || 'Regular';
    switch (c) {
      case 'Regular': return 'polygon(0% 25%, 100% 25%, 100% 75%, 0% 75%)';
      case 'Irregular': return 'polygon(5% 5%, 95% 0%, 100% 85%, 80% 100%, 15% 95%, 0% 50%)';
      default: return 'none';
    }
  };

  const getGeoBounds = (): [[number, number], [number, number]] => {
    if (activePlotData?.customPoints && activePlotData.customPoints.length > 2) {
      const minLat = Math.min(...activePlotData.customPoints.map(p => p.lat));
      const maxLat = Math.max(...activePlotData.customPoints.map(p => p.lat));
      const minLng = Math.min(...activePlotData.customPoints.map(p => p.lng));
      const maxLng = Math.max(...activePlotData.customPoints.map(p => p.lng));
      return [[minLat, minLng], [maxLat, maxLng]];
    }
    const center = [0.33, 6.73];
    const offset = 0.005;
    return [[center[0]-offset, center[1]-offset], [center[0]+offset, center[1]+offset]];
  };

  return (
    <div className="h-[calc(100vh-6rem)] flex flex-col">
      <div className="mb-6 flex items-end justify-between shrink-0">
        <div>
          <button 
            onClick={() => setViewMode('list')}
            className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-800 dark:hover:text-white mb-4 transition-colors"
          >
            <CornerUpLeft className="w-4 h-4" /> Voltar à lista de Glebas
          </button>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-display font-black tracking-tight text-slate-800 dark:text-white">Workspace de Loteamento</h1>
            <span className="px-2.5 py-1 bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 font-bold border border-emerald-500/20 text-xs rounded-lg">{activePlotData?.id}</span>
          </div>
          <p className="text-slate-500 dark:text-slate-400">Arraste as divisões, crie curvas e adicione vias de comunicação num espaço interativo.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl px-6 py-3 flex items-center gap-6 shadow-sm">
             <div>
               <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-0.5">Área Matriz</p>
               <p className="font-display font-bold text-slate-900 dark:text-white text-lg leading-none">{totalArea.toLocaleString()} <span className="text-xs">m²</span></p>
             </div>
             <div className="w-px h-8 bg-slate-200 dark:bg-slate-800"></div>
             <div>
               <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-0.5">Área Livre</p>
               <p className="font-display font-bold text-emerald-600 dark:text-emerald-400 text-lg leading-none">{Math.round(freeArea).toLocaleString()} <span className="text-xs">m²</span></p>
             </div>
          </div>
          <button className="px-6 py-3.5 bg-emerald-500 text-white text-sm font-bold uppercase tracking-wider rounded-2xl shadow-xl shadow-emerald-500/20 hover:bg-emerald-600 flex items-center gap-2 transition-all hover:-translate-y-0.5">
            <Save className="w-4.5 h-4.5" /> Salvar Projeto CAD
          </button>
        </div>
      </div>

      <div className="flex-1 min-h-0 relative rounded-[2.5rem] bg-slate-950 overflow-hidden border border-slate-800 shadow-2xl flex items-center justify-center">
        
        {/* Layer Backdrop Map */}
        <div className="absolute inset-0 select-none pointer-events-none">
          {mapLayer === 'satellite' && (
            <>
              <div className="absolute inset-0 opacity-50 bg-[url('https://images.unsplash.com/photo-1541462608141-ad6b3eb16995?auto=format&fit=crop&q=80&w=2000')] bg-cover bg-center transition-transform duration-1000" style={{ transform: `scale(${scaleZoom})` }} />
              <div className="absolute inset-0 bg-slate-950/40" />
            </>
          )}
          {mapLayer === 'terrain' && (
            <>
              <div className="absolute inset-0 opacity-40 bg-[url('https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=2000')] bg-cover bg-center transition-transform duration-1000" style={{ transform: `scale(${scaleZoom})` }} />
              <div className="absolute inset-0 bg-slate-950/60" />
            </>
          )}
          {mapLayer === 'cad' && (
            <div className="absolute inset-0 bg-[#0B1120]">
               <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(rgba(255,255,255,1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,1)_1px,transparent_1px)] bg-[size:40px_40px]" />
               <div className="absolute inset-0 opacity-[0.015] bg-[linear-gradient(rgba(255,255,255,1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,1)_1px,transparent_1px)] bg-[size:10px_10px]" />
            </div>
          )}
        </div>

        {/* Floating Drafting Tools Left */}
        <div className="absolute top-8 left-8 flex flex-col gap-2 z-20">
          <div className="bg-slate-900/80 backdrop-blur-xl flex flex-col p-2 space-y-1.5 rounded-2xl border border-slate-700/50 shadow-2xl">
            <button 
              onClick={() => setActiveTool('select')}
              title="Selecionar / Mover"
              className={cn("p-3.5 rounded-xl transition-all", activeTool === 'select' ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/25" : "text-slate-400 hover:text-white")}
            >
              <MousePointer2 className="w-5 h-5" />
            </button>
            <div className="h-px bg-slate-700/50 mx-2 my-1" />
            <button 
              onClick={() => { setActiveTool('split_v'); handleSplit('v'); }}
              title="Cortar Verticalmente"
              className={cn("p-3.5 rounded-xl transition-all text-blue-400 hover:text-blue-300")}
            >
              <SplitSquareHorizontal className="w-5 h-5" />
            </button>
            <button 
              onClick={() => { setActiveTool('split_h'); handleSplit('h'); }}
              title="Cortar Horizontalmente"
              className={cn("p-3.5 rounded-xl transition-all text-blue-400 hover:text-blue-300")}
            >
              <SplitSquareVertical className="w-5 h-5" />
            </button>
            <button 
              onClick={() => setActiveTool('curve')}
              title="Edição Curva de Cortes"
              className={cn("p-3.5 rounded-xl transition-all", activeTool === 'curve' ? "bg-amber-500 text-white shadow-lg shadow-amber-500/25" : "text-amber-500 hover:bg-amber-500/10")}
            >
              <Waves className="w-5 h-5" />
            </button>
            <div className="h-px bg-slate-700/50 mx-2 my-1" />
            <button 
               onClick={() => setActiveTool('freecut')}
               title="Corte Livre"
               className={cn("p-3.5 rounded-xl transition-all text-rose-400 hover:text-rose-300", activeTool === 'freecut' ? "bg-rose-500/20 shadow-lg shadow-rose-500/10" : "")}
            >
               <Scissors className="w-5 h-5" />
            </button>
            <button 
              onClick={() => setActiveTool('road')}
              title="Desenhar Estrada"
              className={cn("p-3.5 rounded-xl transition-all", activeTool === 'road' ? "bg-purple-500 text-white shadow-lg shadow-purple-500/25" : "text-purple-400 hover:bg-purple-500/10")}
            >
              <Route className="w-5 h-5" />
            </button>
            <button 
              onClick={() => setActiveTool('river')}
              title="Desenhar Rio / Água"
              className={cn("p-3.5 rounded-xl transition-all", activeTool === 'river' ? "bg-blue-500 text-white shadow-lg shadow-blue-500/25" : "text-blue-400 hover:bg-blue-500/10")}
            >
              <Droplets className="w-5 h-5" />
            </button>
            <button 
              onClick={() => setActiveTool('tree')}
              title="Adicionar Vegetação / Árvore"
              className={cn("p-3.5 rounded-xl transition-all", activeTool === 'tree' ? "bg-emerald-600 text-white shadow-lg shadow-emerald-500/25" : "text-emerald-500 hover:bg-emerald-500/10")}
            >
              <Trees className="w-5 h-5" />
            </button>
            <button 
              onClick={() => setActiveTool('ruler')}
              title="Medição (Régua)"
              className={cn("p-3.5 rounded-xl transition-all", activeTool === 'ruler' ? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/25" : "text-indigo-400 hover:bg-indigo-500/10")}
            >
              <Ruler className="w-5 h-5" />
            </button>
            <div className="h-px bg-slate-700/50 mx-2 my-1" />
            <button 
              onClick={() => setScaleZoom(z => Math.min(2.5, z + 0.1))} 
              title="Zoom In"
              className="p-3.5 rounded-xl text-slate-400 hover:text-white transition-colors"
            >
              <ZoomIn className="w-5 h-5" />
            </button>
            <button 
              onClick={() => setScaleZoom(z => Math.max(0.6, z - 0.1))} 
              title="Zoom Out"
              className="p-3.5 rounded-xl text-slate-400 hover:text-white transition-colors"
            >
              <ZoomOut className="w-5 h-5" />
            </button>
          </div>
          
          <div className="bg-slate-900/80 backdrop-blur-xl flex flex-col p-1.5 rounded-2xl border border-slate-700/50 shadow-2xl mt-4">
             {[
               { id: 'satellite', label: 'SAT', icon: MapIcon },
               { id: 'terrain', label: 'GEO', icon: Hexagon },
               { id: 'cad', label: 'CAD', icon: Layers }
             ].map(lay => (
                <button
                  key={lay.id}
                  onClick={() => setMapLayer(lay.id as any)}
                  className={cn(
                    "p-3 rounded-xl transition-all font-black text-[10px] tracking-widest",
                    mapLayer === lay.id 
                      ? "bg-slate-700 text-white shadow-inner"
                      : "text-slate-400 hover:text-white"
                  )}
                >
                  {lay.label}
                </button>
             ))}
          </div>
        </div>

        {/* Master Interactive Map Canvas Center */}
        <div className="absolute inset-x-6 top-6 bottom-40 z-10 rounded-[2.5rem] overflow-hidden shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] border border-slate-700/50">
           <UniversalMap 
             center={activePlotData?.customPoints ? [(activePlotData.customPoints[0].lat + activePlotData.customPoints[2].lat)/2, (activePlotData.customPoints[0].lng + activePlotData.customPoints[2].lng)/2] : [0.33, 6.73]}
             zoom={14}
             provider={mapLayer}
             zoomControl={true}
             scrollWheelZoom={true}
           >
              <SVGOverlay 
                bounds={getGeoBounds()}
                attributes={{ preserveAspectRatio: "none", viewBox: "0 0 100 100" }}
              >
                 <g 
                   ref={svgRef}
                   className={cn(
                     "pointer-events-auto origin-top-left group",
                     (activeTool === 'road' || activeTool === 'river' || activeTool === 'freecut' || activeTool === 'ruler') && "cursor-crosshair",
                     activeTool === 'tree' && "cursor-pointer",
                     activeTool === 'select' && "cursor-default"
                   )}
                   style={{ 
                     clipPath: getClipPath(),
                     WebkitClipPath: getClipPath()
                   }}
                   onMouseDown={(e) => { e.stopPropagation(); handleCanvasMouseDown(e); }}
                   onMouseMove={(e) => { e.stopPropagation(); handleCanvasMouseMove(e); }}
                   onMouseUp={(e) => { e.stopPropagation(); handleCanvasMouseUp(); }}
                   onMouseLeave={(e) => { e.stopPropagation(); handleCanvasMouseUp(); }}
                   onTouchStart={(e) => { e.stopPropagation(); handleCanvasMouseDown(e); }}
                   onTouchMove={(e) => { e.stopPropagation(); handleCanvasMouseMove(e); }}
                   onTouchEnd={(e) => { e.stopPropagation(); handleCanvasMouseUp(); }}
                 >
                   {/* Background Rect to catch events inside the SVG space */}
                   <rect x="0" y="0" width="100" height="100" className={cn("fill-slate-900/60 pointer-events-auto", !activePlotData?.customPoints ? "stroke-[0.5] stroke-emerald-500/50" : "")} />
             {/* Render Layout Rectangles & Clipping */}
             {/* We render the pure rects as interactive zones */}
             {rects.map(rect => (
               <g key={rect.id} onClick={(e) => { e.stopPropagation(); if (activeTool === 'select') setSelectedParcel(rect.id); }}>
                 {/* Visual Rect */}
                 <rect 
                   x={rect.x} y={rect.y} width={rect.w} height={rect.h}
                   className={cn(
                     "transition-all stroke-[0.5] stroke-slate-600/50 cursor-pointer",
                     selectedParcel === rect.id ? "fill-emerald-500/10 stroke-emerald-400" : "fill-slate-800/30 hover:fill-emerald-900/20",
                     rect.assignedTo ? (rect.color + " fill-opacity-80 stroke-white/20") : ""
                   )}
                 />
                 
                 {/* Assigned overlay text */}
                 {rect.assignedTo && (
                   <text x={rect.x + rect.w/2} y={rect.y + rect.h/2} textAnchor="middle" dominantBaseline="middle" className="text-[3px] font-black uppercase tracking-widest fill-white filter drop-shadow-md pointer-events-none">
                     {rect.assignedTo}
                   </text>
                 )}
                 {/* Area text */}
                 <text x={rect.x + rect.w/2} y={rect.y + rect.h/2 + (rect.assignedTo ? 4 : 0)} textAnchor="middle" dominantBaseline="middle" className={cn("text-[2.5px] font-mono font-bold pointer-events-none drop-shadow-md", rect.assignedTo ? "fill-white" : "fill-emerald-400")}>
                    {Math.round(totalArea * rect.areaRatio).toLocaleString()} m²
                 </text>
               </g>
             ))}

             {/* Render Dividers overlay for dragging and curving */}
             {divs.map(div => {
               const isV = div.dir === 'v';
               // Coordinate of split
               const linePos = isV ? div.x + div.w * (div.ratio/100) : div.y + div.h * (div.ratio/100);
               const curveX = isV ? Number(linePos) + Number(div.curveOffset) : Number(div.x) + Number(div.w) * (div.curvePos/100);
               const curveY = isV ? Number(div.y) + Number(div.h) * (div.curvePos/100) : Number(linePos) + Number(div.curveOffset);
               
               const startX = isV ? linePos : div.x;
               const startY = isV ? div.y : linePos;
               const endX = isV ? linePos : div.x + div.w;
               const endY = isV ? div.y + div.h : linePos;

               const pathD = `M ${startX} ${startY} Q ${curveX} ${curveY} ${endX} ${endY}`;

               return (
                 <g key={div.id}>
                   <path 
                     d={pathD}
                     fill="none"
                     className={cn("stroke-[0.8] stroke-blue-500", draggingDiv?.id === div.id && "stroke-[1.5] stroke-emerald-400")}
                   />
                   {/* Invisible wider path for easier grabbing */}
                   <path 
                     d={pathD} fill="none" stroke="transparent" strokeWidth={5}
                     className={isV ? 'cursor-col-resize' : 'cursor-row-resize'}
                     onMouseDown={(e) => { e.stopPropagation(); if (activeTool === 'select' || activeTool === 'split_v' || activeTool === 'split_h') setDraggingDiv({ id: div.id, dir: div.dir }); }}
                     onTouchStart={(e) => { e.stopPropagation(); if (activeTool === 'select') setDraggingDiv({ id: div.id, dir: div.dir }); }}
                   />
                   
                   {/* Curve Control handle */}
                   {activeTool === 'curve' && (
                     <circle 
                        cx={curveX} cy={curveY} r={1.5}
                        className="fill-amber-500 cursor-move hover:fill-amber-400 stroke-1 stroke-slate-900"
                        onMouseDown={(e) => {
                          e.stopPropagation();
                          const startX = e.clientX;
                          const startY = e.clientY;
                          const handleMove = (ev: MouseEvent) => {
                            const CTM = svgRef.current?.getScreenCTM();
                            if (!CTM) return;
                            const dx = (ev.clientX - startX) / CTM.a;
                            const dy = (ev.clientY - startY) / CTM.d;
                            handleCurveDrag(div.id, isV ? dx : dy);
                          };
                          const handleUp = () => {
                            window.removeEventListener('mousemove', handleMove);
                            window.removeEventListener('mouseup', handleUp);
                          };
                          window.addEventListener('mousemove', handleMove);
                          window.addEventListener('mouseup', handleUp);
                        }}
                     />
                   )}
                 </g>
               )
             })}

             {/* Roads */}
             {roads.map(r => (
                <path key={r.id} d={r.d} fill="none" className="stroke-slate-800/80 pointer-events-none" strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" />
             ))}
             {roads.map(r => (
                <path key={r.id + '-inner'} d={r.d} fill="none" className="stroke-slate-700/80 stroke-dashed pointer-events-none" strokeWidth={0.5} strokeDasharray="1,1" />
             ))}
             
             {/* Rivers */}
             {rivers.map(r => (
                <path key={r.id} d={r.d} fill="none" className="stroke-blue-500/60 pointer-events-none" strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" />
             ))}
             
             {/* Free Cuts */}
             {freecuts.map(c => (
                <path key={c.id} d={c.d} fill="none" className="stroke-rose-500 pointer-events-none stroke-dashed" strokeWidth={1} strokeDasharray="2,2" strokeLinecap="round" strokeLinejoin="round" />
             ))}
             
             {/* Trees */}
             {trees.map(t => (
               <g key={t.id} transform={`translate(${t.x}, ${t.y})`} className="pointer-events-none">
                 <circle r="2" fill="rgba(16, 185, 129, 0.4)" />
                 <circle r="1" fill="#10B981" />
               </g>
             ))}
             
             {/* Rulers */}
             {rulers.map(r => (
               <g key={r.id} className="pointer-events-none">
                 <path d={r.d} fill="none" className="stroke-indigo-400" strokeWidth={1} />
                 {/* Place text far up */}
                 <text x="50" y="5" className="text-[3px] fill-indigo-400 font-bold drop-shadow-md" textAnchor="middle">{Math.round(r.dist)}m</text>
               </g>
             ))}

             {/* Active Drawing Tool (Road, River, Cut) */}
             {drawingPts.length > 0 && (
               <path 
                 d={drawingPts.map((p, i) => `${i===0?'M':'L'} ${p.x} ${p.y}`).join(' ')} 
                 fill="none" 
                 strokeWidth={activeTool === 'road' ? 4 : activeTool === 'river' ? 5 : activeTool === 'ruler' ? 1 : 1.5}
                 className={cn(
                   "pointer-events-none strokeLinecap-round strokeLinejoin-round",
                   activeTool === 'road' ? "stroke-purple-500/50" :
                   activeTool === 'river' ? "stroke-blue-400/50" :
                   activeTool === 'ruler' ? "stroke-indigo-400" :
                   "stroke-rose-500/80 stroke-dashed" // freecut
                 )}
               />
             )}
                 </g>
              </SVGOverlay>
           </UniversalMap>
        </div>

        {/* Right Floating Panels Overlay */}
        <div className="absolute right-8 top-8 bottom-8 w-[400px] flex flex-col gap-6 z-30 pointer-events-none">
          
          {/* Selected Parcel Details */}
          <div className="bg-slate-900/80 backdrop-blur-2xl border border-slate-700/50 rounded-[2rem] p-6 shadow-2xl pointer-events-auto shrink-0 transition-all">
             <h3 className="font-black text-white text-lg tracking-tight mb-5 flex items-center gap-3">
               <Grid className="w-5 h-5 text-emerald-400" /> Detalhes da Parcela
             </h3>
             
             {!selectedParcel ? (
               <div className="text-center py-8 text-slate-400 font-medium border border-dashed border-slate-700 rounded-2xl bg-slate-800/30">
                 <MousePointer2 className="w-8 h-8 mx-auto mb-3 opacity-50" />
                 Selecione uma parcela no mapa interativo
               </div>
             ) : (
               <AnimatePresence mode="wait">
                 {(() => {
                   const parcel = rects.find(p => p.id === selectedParcel);
                   if (!parcel) return null;

                   return (
                     <motion.div key={parcel.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                        <div className="flex justify-between items-center mb-5 bg-slate-950/50 p-4 rounded-xl border border-slate-800">
                          <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Área Disponível</p>
                            <p className="text-3xl font-bold text-white font-mono leading-none">{Math.round(totalArea * parcel.areaRatio).toLocaleString()} <span className="text-base text-slate-500">m²</span></p>
                          </div>
                          {parcel.assignedTo && (
                            <button 
                              onClick={() => removeAssignment(parcel.id)}
                              className="w-10 h-10 rounded-full bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 flex items-center justify-center transition-colors border border-rose-500/20"
                              title="Remover Atribuição"
                            >
                              <Trash2 className="w-4.5 h-4.5" />
                            </button>
                          )}
                        </div>

                        {parcel.assignedTo ? (
                          <div className="p-5 rounded-2xl border border-emerald-500/30 bg-emerald-500/10">
                             <div className="flex items-center gap-2 text-emerald-400 font-black tracking-widest text-[10px] uppercase mb-2">
                               <Check className="w-4 h-4" /> Atribuído Oficialmente
                             </div>
                             <p className="font-mono text-lg font-bold text-white break-all">{parcel.assignedTo}</p>
                             <p className="text-sm font-medium text-slate-400 mt-1">{MOCK_REQUESTS.find(r => r.id === parcel.assignedTo)?.name}</p>
                          </div>
                        ) : (
                          <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
                             <p className="text-xs text-blue-400 font-medium leading-relaxed">
                               Para organizar a parcela, utilize as ferramentas de corte à esquerda ou clique em <strong>Atribuir</strong> num processo pendente estruturado abaixo.
                             </p>
                          </div>
                        )}
                     </motion.div>
                   )
                 })()}
               </AnimatePresence>
             )}
          </div>

          {/* Pending Process List */}
          <div className="bg-slate-900/80 backdrop-blur-2xl border border-slate-700/50 rounded-[2rem] shadow-2xl pointer-events-auto flex-1 flex flex-col min-h-0 overflow-hidden">
             <div className="p-6 border-b border-slate-800 shrink-0">
               <h3 className="font-black text-white text-lg tracking-tight mb-5 flex items-center gap-3">
                 <Users className="w-5 h-5 text-blue-400" /> Lista de Espera 
               </h3>
               <div className="relative">
                 <Search className="w-4 h-4 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
                 <input 
                   type="text" 
                   placeholder="Pesquisar..." 
                   className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-11 pr-4 py-3 text-sm text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none font-medium placeholder:text-slate-600"
                   value={searchProcess}
                   onChange={(e) => setSearchProcess(e.target.value)}
                 />
               </div>
             </div>

             <div className="flex-1 overflow-y-auto p-3 space-y-1 custom-scrollbar">
               {MOCK_REQUESTS
                 .filter(r => !rects.some(p => p.assignedTo === r.id))
                 .filter(r => r.name.toLowerCase().includes(searchProcess.toLowerCase()) || r.id.toLowerCase().includes(searchProcess.toLowerCase()))
                 .map(req => {
                   const parcel = selectedParcel ? rects.find(p => p.id === selectedParcel) : null;
                   const area = parcel ? totalArea * parcel.areaRatio : 0;
                   const canAssign = parcel && !parcel.assignedTo && area >= req.area;

                   return (
                     <div key={req.id} className="p-4 hover:bg-slate-800/60 rounded-2xl group transition-colors flex items-center justify-between border border-transparent hover:border-slate-700/50">
                        <div>
                          <p className="font-bold text-sm text-white group-hover:text-emerald-400 transition-colors">{req.name}</p>
                          <div className="flex items-center gap-2 mt-1.5">
                            <span className="text-[9px] font-mono font-bold text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">{req.id}</span>
                            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">{req.type}</span>
                          </div>
                        </div>
                        <div className="text-right flex flex-col items-end">
                          <p className={cn("text-xs font-bold font-mono tracking-wider mb-2", canAssign ? "text-emerald-400" : "text-slate-500")}>Req: {req.area.toLocaleString()} m²</p>
                          {canAssign ? (
                            <button 
                              onClick={() => assignProcess(req.id)}
                              className="text-[10px] bg-white text-slate-900 px-4 py-1.5 rounded-lg font-black uppercase tracking-widest hover:scale-105 transition-transform shadow-lg shadow-white/10"
                            >
                              Atribuir
                            </button>
                          ) : (
                            <span className="text-[9px] font-black tracking-widest uppercase text-rose-500/80 opacity-0 group-hover:opacity-100 transition-opacity">
                              {parcel && !parcel.assignedTo ? 'Área Insf.' : 'Sel. Lote'}
                            </span>
                          )}
                        </div>
                     </div>
                   );
               })}
               
               {MOCK_REQUESTS.filter(r => !rects.some(p => p.assignedTo === r.id)).length === 0 && (
                 <div className="text-center py-12 opacity-60">
                   <Check className="w-10 h-10 mx-auto mb-4 text-emerald-500" />
                   <p className="text-sm font-bold text-white uppercase tracking-widest">Todos Atribuídos!</p>
                 </div>
               )}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
