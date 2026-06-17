import React, { useState } from 'react';
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
  Trash2
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

// Mock data for requests
const MOCK_REQUESTS = [
  { id: 'PROC-2023-001', name: 'João Manuel Silva', area: 500, type: 'Habitação' },
  { id: 'PROC-2023-042', name: 'Maria Santos', area: 1200, type: 'Agricultura' },
  { id: 'PROC-2023-089', name: 'Carlos Ferreira', area: 450, type: 'Habitação' },
  { id: 'PROC-2023-112', name: 'Ana Rodrigues', area: 800, type: 'Misto' },
  { id: 'PROC-2023-156', name: 'Rui Costa', area: 600, type: 'Comércio' },
];

type Parcel = {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  assignedTo?: string;
  color?: string;
};

export function LandPlanningView() {
  const [activeProject, setActiveProject] = useState('PROJ-ZSO-001');
  const [totalArea, setTotalArea] = useState(10000); // 10,000 sqm
  const [parcels, setParcels] = useState<Parcel[]>([
    { id: 'parcel-root', x: 0, y: 0, width: 100, height: 100 }
  ]);
  const [selectedParcel, setSelectedParcel] = useState<string | null>('parcel-root');
  const [splitRatio, setSplitRatio] = useState(50);
  const [searchProcess, setSearchProcess] = useState('');
  
  const handleSplit = (direction: 'horizontal' | 'vertical') => {
    if (!selectedParcel) return;
    
    const parcelToSplit = parcels.find(p => p.id === selectedParcel);
    if (!parcelToSplit) return;
    
    const remainingParcels = parcels.filter(p => p.id !== selectedParcel);
    
    const ratio = splitRatio / 100;
    const newId1 = `parcel-${Date.now()}-1`;
    const newId2 = `parcel-${Date.now()}-2`;
    
    let p1, p2;
    
    if (direction === 'horizontal') {
      p1 = { ...parcelToSplit, id: newId1, height: parcelToSplit.height * ratio };
      p2 = { ...parcelToSplit, id: newId2, y: parcelToSplit.y + (parcelToSplit.height * ratio), height: parcelToSplit.height * (1 - ratio) };
    } else {
      p1 = { ...parcelToSplit, id: newId1, width: parcelToSplit.width * ratio };
      p2 = { ...parcelToSplit, id: newId2, x: parcelToSplit.x + (parcelToSplit.width * ratio), width: parcelToSplit.width * (1 - ratio) };
    }
    
    setParcels([...remainingParcels, p1, p2]);
    setSelectedParcel(null);
  };

  const handleReset = () => {
    setParcels([{ id: 'parcel-root', x: 0, y: 0, width: 100, height: 100 }]);
    setSelectedParcel('parcel-root');
  };

  const assignProcess = (processId: string) => {
    if (!selectedParcel) return;
    const colors = ['bg-blue-500', 'bg-emerald-500', 'bg-purple-500', 'bg-amber-500', 'bg-rose-500', 'bg-cyan-500'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    
    setParcels(prev => prev.map(p => 
      p.id === selectedParcel ? { ...p, assignedTo: processId, color: randomColor } : p
    ));
    setSelectedParcel(null);
  };

  const removeAssignment = (id: string) => {
    setParcels(prev => prev.map(p => 
      p.id === id ? { ...p, assignedTo: undefined, color: undefined } : p
    ));
  };

  const getArea = (parcel: Parcel) => {
    const percentage = (parcel.width * parcel.height) / 10000; // 100x100 = 10000 total grid units
    return Math.round(totalArea * percentage);
  };

  const assignedArea = parcels.filter(p => p.assignedTo).reduce((acc, p) => acc + getArea(p), 0);
  const freeArea = totalArea - assignedArea;

  return (
    <div className="h-[calc(100vh-6rem)] flex flex-col">
      <div className="mb-6 flex items-end justify-between shrink-0">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 dark:text-white mb-2">Planeamento de Loteamento</h1>
          <p className="text-slate-500 dark:text-slate-400">Divida grandes talhões e atribua a processos pendentes.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-4 py-2 flex items-center gap-4">
             <div>
               <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-0.5">Área Total</p>
               <p className="font-bold text-slate-800 dark:text-white">{totalArea.toLocaleString()} m²</p>
             </div>
             <div className="w-px h-8 bg-slate-200 dark:bg-slate-800"></div>
             <div>
               <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-0.5">Área Livre</p>
               <p className="font-bold text-emerald-600 dark:text-emerald-400">{freeArea.toLocaleString()} m²</p>
             </div>
          </div>
          <button className="px-5 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-sm font-bold rounded-lg hover:bg-slate-800 dark:hover:bg-slate-100 flex items-center gap-2">
            <Save className="w-4 h-4" /> Finalizar Projeto
          </button>
        </div>
      </div>

      <div className="flex-1 min-h-0 flex gap-6">
        {/* Workspace Canvas */}
        <div className="flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col overflow-hidden relative shadow-sm">
          {/* Toolbar */}
          <div className="h-14 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 bg-slate-50 dark:bg-slate-900/50">
             <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-slate-800 dark:text-white mr-4">Zona Sul, Lote 42A</span>
                <button onClick={handleReset} className="p-2 text-slate-500 hover:text-slate-800 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 rounded-md transition-colors tooltip-trigger" title="Reiniciar Desenho">
                  <Undo className="w-4 h-4" />
                </button>
             </div>
             
             {selectedParcel && !parcels.find(p => p.id === selectedParcel)?.assignedTo && (
               <div className="flex items-center gap-3 bg-slate-200/50 dark:bg-slate-800/50 p-1 rounded-lg border border-slate-200 dark:border-slate-700">
                  <div className="px-3 flex items-center gap-2 border-r border-slate-300 dark:border-slate-600">
                    <span className="text-xs font-bold text-slate-500">Divisão: {splitRatio}% / {100-splitRatio}%</span>
                    <input 
                      type="range" 
                      min="10" max="90" step="5"
                      value={splitRatio}
                      onChange={(e) => setSplitRatio(Number(e.target.value))}
                      className="w-24 accent-slate-800 dark:accent-white"
                    />
                  </div>
                  <button 
                    onClick={() => handleSplit('vertical')}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-slate-700 text-slate-700 dark:text-white rounded text-xs font-bold shadow-sm hover:ring-2 hover:ring-blue-500"
                  >
                    <SplitSquareVertical className="w-4 h-4" /> Cortar Vert.
                  </button>
                  <button 
                    onClick={() => handleSplit('horizontal')}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-slate-700 text-slate-700 dark:text-white rounded text-xs font-bold shadow-sm hover:ring-2 hover:ring-blue-500"
                  >
                    <SplitSquareHorizontal className="w-4 h-4" /> Cortar Horiz.
                  </button>
               </div>
             )}

             <div className="flex items-center gap-2">
                <button className="p-2 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-md"><ZoomOut className="w-4 h-4" /></button>
                <button className="p-2 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-md"><ZoomIn className="w-4 h-4" /></button>
             </div>
          </div>

          {/* Interactive Canvas */}
          <div className="flex-1 bg-slate-100 dark:bg-slate-950 p-8 overflow-auto relative flex items-center justify-center pattern-grid-lg">
             <div className="w-[600px] h-[600px] bg-white dark:bg-slate-800 shadow-2xl border-4 border-slate-300 dark:border-slate-600 relative overflow-hidden ring-4 ring-black/5 dark:ring-white/5">
                {parcels.map(parcel => (
                  <motion.div
                    key={parcel.id}
                    layout
                    onClick={() => setSelectedParcel(parcel.id)}
                    className={cn(
                      "absolute border-2 transition-colors cursor-pointer flex flex-col items-center justify-center overflow-hidden",
                      selectedParcel === parcel.id ? "border-blue-500 z-10 shadow-[0_0_20px_rgba(59,130,246,0.5)] ring-4 ring-blue-500/20" : "border-slate-400 dark:border-slate-600 hover:border-slate-500 dark:hover:border-slate-400",
                      parcel.assignedTo ? (parcel.color + " border-white/20") : "bg-emerald-50/50 dark:bg-emerald-900/20 hover:bg-emerald-100/50 dark:hover:bg-emerald-800/30",
                    )}
                    style={{
                      left: `${parcel.x}%`,
                      top: `${parcel.y}%`,
                      width: `${parcel.width}%`,
                      height: `${parcel.height}%`,
                    }}
                  >
                    {/* Measurement labels roughly simulating area visually */}
                    <span className={cn(
                      "font-mono font-bold tracking-widest",
                      parcel.assignedTo ? "text-white text-lg" : "text-slate-500 dark:text-slate-400 text-sm",
                      parcel.width < 20 || parcel.height < 20 ? "scale-75" : ""
                    )}>
                      {getArea(parcel)}m²
                    </span>
                    
                    {parcel.assignedTo && (
                      <span className="text-[10px] font-black uppercase tracking-widest text-white/80 mt-1 bg-black/20 px-2 py-0.5 rounded backdrop-blur-sm truncate max-w-[90%]">
                        {parcel.assignedTo}
                      </span>
                    )}

                    {/* Split line preview */}
                    {selectedParcel === parcel.id && !parcel.assignedTo && (
                      <>
                         {/* Vertical preview */}
                         <div className="absolute top-0 bottom-0 border-l-2 border-dashed border-blue-500/50 pointer-events-none" style={{ left: `${splitRatio}%` }}></div>
                         {/* Horizontal preview */}
                         <div className="absolute left-0 right-0 border-t-2 border-dashed border-blue-500/50 pointer-events-none" style={{ top: `${splitRatio}%` }}></div>
                         
                         {/* Corner handles purely visual */}
                         <div className="absolute top-0 left-0 w-2 h-2 bg-blue-500 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
                         <div className="absolute top-0 right-0 w-2 h-2 bg-blue-500 rounded-full translate-x-1/2 -translate-y-1/2"></div>
                         <div className="absolute bottom-0 left-0 w-2 h-2 bg-blue-500 rounded-full -translate-x-1/2 translate-y-1/2"></div>
                         <div className="absolute bottom-0 right-0 w-2 h-2 bg-blue-500 rounded-full translate-x-1/2 translate-y-1/2"></div>
                      </>
                    )}
                  </motion.div>
                ))}
             </div>
          </div>
        </div>

        {/* Right Panel - Assignment & Processes */}
        <div className="w-[380px] shrink-0 flex flex-col gap-6">
          
          {/* Selected Parcel Actions */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm shrink-0">
             <h3 className="font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
               <Grid className="w-5 h-5 text-blue-500" /> Parcela Selecionada
             </h3>
             
             {!selectedParcel ? (
               <div className="text-center py-6 text-slate-500 text-sm">
                 <p>Selecione uma parcela no mapa para ver as opções.</p>
               </div>
             ) : (
               <AnimatePresence mode="wait">
                 {(() => {
                   const parcel = parcels.find(p => p.id === selectedParcel);
                   if (!parcel) return null;

                   return (
                     <motion.div
                       key={parcel.id}
                       initial={{ opacity: 0, y: 10 }}
                       animate={{ opacity: 1, y: 0 }}
                       exit={{ opacity: 0, y: -10 }}
                     >
                        <div className="flex justify-between items-end mb-4 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-700">
                          <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Área Disponível</p>
                            <p className="text-2xl font-bold text-slate-800 dark:text-white font-mono">{getArea(parcel)} <span className="text-sm text-slate-500">m²</span></p>
                          </div>
                          {parcel.assignedTo && (
                            <button 
                              onClick={() => removeAssignment(parcel.id)}
                              className="w-8 h-8 rounded-full bg-rose-50 text-rose-500 hover:bg-rose-100 flex items-center justify-center transition-colors"
                              title="Remover Atribuição"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>

                        {parcel.assignedTo ? (
                          <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50 dark:bg-emerald-500/10 dark:border-emerald-500/20">
                             <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold mb-2">
                               <Check className="w-4 h-4" /> Atribuído a
                             </div>
                             <p className="font-mono text-sm font-bold text-slate-800 dark:text-white">{parcel.assignedTo}</p>
                             <p className="text-sm text-slate-600 dark:text-slate-400">{MOCK_REQUESTS.find(r => r.id === parcel.assignedTo)?.name}</p>
                          </div>
                        ) : (
                          <p className="text-xs text-slate-500 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 p-3 rounded-lg border border-blue-100 dark:border-blue-500/20">
                            Pode cortar esta parcela usando os controlos no mapa ou atribuí-la diretamente a um processo abaixo.
                          </p>
                        )}
                     </motion.div>
                   )
                 })()}
               </AnimatePresence>
             )}
          </div>

          {/* Pending Process List */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm flex-1 flex flex-col min-h-0 overflow-hidden">
             <div className="p-5 border-b border-slate-200 dark:border-slate-800 shrink-0">
               <h3 className="font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                 <Users className="w-5 h-5 text-slate-400" /> Processos Pendentes
               </h3>
               <div className="relative">
                 <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                 <input 
                   type="text" 
                   placeholder="Procurar processo ou nome..." 
                   className="w-full bg-slate-50 dark:bg-slate-800 border box-border border-slate-200 dark:border-slate-700 rounded-lg pl-9 pr-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                   value={searchProcess}
                   onChange={(e) => setSearchProcess(e.target.value)}
                 />
               </div>
             </div>

             <div className="flex-1 overflow-y-auto p-2 space-y-1">
               {MOCK_REQUESTS
                 .filter(r => !parcels.some(p => p.assignedTo === r.id))
                 .filter(r => r.name.toLowerCase().includes(searchProcess.toLowerCase()) || r.id.toLowerCase().includes(searchProcess.toLowerCase()))
                 .map(req => {
                   const parcel = selectedParcel ? parcels.find(p => p.id === selectedParcel) : null;
                   const canAssign = parcel && !parcel.assignedTo && getArea(parcel) >= req.area;

                   return (
                     <div key={req.id} className="p-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-xl group transition-colors flex items-center justify-between border border-transparent hover:border-slate-100 dark:hover:border-slate-700">
                        <div>
                          <p className="font-bold text-sm text-slate-800 dark:text-white">{req.name}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[10px] font-mono text-slate-500 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">{req.id}</span>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{req.type}</span>
                          </div>
                        </div>
                        <div className="text-right flex flex-col items-end">
                          <p className={cn("text-sm font-bold font-mono mb-1", canAssign ? "text-emerald-600" : "text-slate-500")}>Reg: {req.area}m²</p>
                          {canAssign ? (
                            <button 
                              onClick={() => assignProcess(req.id)}
                              className="text-[10px] bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-3 py-1.5 rounded-lg font-bold uppercase tracking-widest hover:scale-105 transition-transform"
                            >
                              Atribuir
                            </button>
                          ) : (
                            <span className="text-[10px] font-bold text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity">
                              {parcel && !parcel.assignedTo ? 'Área Insuficiente' : 'Selecione Lote'}
                            </span>
                          )}
                        </div>
                     </div>
                   );
               })}
               
               {MOCK_REQUESTS.filter(r => !parcels.some(p => p.assignedTo === r.id)).length === 0 && (
                 <div className="text-center py-8 opacity-50">
                   <Check className="w-8 h-8 mx-auto mb-2 text-emerald-500" />
                   <p className="text-sm font-bold">Todos os processos atribuídos!</p>
                 </div>
               )}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
