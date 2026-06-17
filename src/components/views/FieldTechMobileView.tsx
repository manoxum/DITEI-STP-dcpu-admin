import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Map, 
  MapPin, 
  Camera, 
  WifiOff, 
  CloudOff, 
  UploadCloud, 
  CheckCircle2, 
  Navigation,
  FileSignature,
  FileText,
  AlertTriangle,
  LogOut,
  ListTodo,
  ShieldAlert,
  ClipboardCheck,
  MoreVertical,
  Activity,
  Layers,
  Scissors
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { useNavigate } from 'react-router-dom';

const TASK_REQUIREMENTS = {
  demarcacao: {
    points: ['Marco Norte (M1)', 'Marco Sul (M2)', 'Marco Este (M3)', 'Marco Oeste (M4)'],
    photos: ['Marco Norte', 'Marco Sul', 'Fachada Principal', 'Via de Acesso']
  },
  auditoria: {
    points: ['Ponto de Conflito A', 'Ponto de Conflito B'],
    photos: ['Elemento em Disputa (Muro/Limites)', 'Vista Geral do Terreno']
  },
  inspecao: {
    points: ['Ponto Central do Lote'],
    photos: ['Uso Atual', 'Benfeitorias Visíveis']
  },
  notificacao: {
    points: ['Local da Infração'],
    photos: ['Evidência da Irregularidade', 'Placa de Embargo (Opcional)']
  },
  assinaturas: {
    points: [],
    photos: ['Cópia do Documento de Identidade']
  }
};

const MOCK_TASKS = [
  { id: 'T-001', type: 'Vistoria & Demarcação', client: 'João Manuel', location: 'Bobô-Forro', status: 'pending', date: 'Hoje, 14:00', coords: '0.3421, 6.7412', taskType: 'demarcacao' },
  { id: 'T-002', type: 'Auditoria de Conflito', client: 'Isabel Rocha', location: 'Água Grande', status: 'pending', date: 'Amanhã, 09:00', coords: '0.3214, 6.7222', taskType: 'auditoria' },
  { id: 'T-004', type: 'Inspeção Cadastral', client: 'Câmara Municipal', location: 'Trindade', status: 'pending', date: 'Hoje, 16:30', coords: '0.3012, 6.6912', taskType: 'inspecao' },
  { id: 'T-005', type: 'Notificação de Irregularidade', client: 'Desconhecido', location: 'Praia Melão', status: 'pending', date: 'Hoje, 10:00', coords: '0.3121, 6.7511', taskType: 'notificacao' },
  { id: 'T-003', type: 'Recolha de Assinaturas', client: 'António Silva', location: 'Trindade', status: 'completed', date: 'Ontem', coords: '0.3012, 6.6912', taskType: 'assinaturas' },
];

export function FieldTechMobileView() {
  const navigate = useNavigate();
  const [isOffline, setIsOffline] = useState(false);
  const [activeTab, setActiveTab] = useState('tasks'); // tasks, map, sync
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [actionStep, setActionStep] = useState(0); // 0 = view, 1 = photo/points, 2 = signature
  const [syncQueue, setSyncQueue] = useState(2);
  const [points, setPoints] = useState<Record<string, {lat: string, lng: string}>>({});
  const [photos, setPhotos] = useState<Record<string, string>>({});
  const [currentCollectionItem, setCurrentCollectionItem] = useState<{type: 'photo' | 'point', id: string} | null>(null);
  const [showCameraModal, setShowCameraModal] = useState(false);
  const [showMapModal, setShowMapModal] = useState(false);
  const [tasks, setTasks] = useState(MOCK_TASKS);
  const [notes, setNotes] = useState('');

  // Simulate offline status toggling
  useEffect(() => {
    const toggleOffline = setInterval(() => {
      setIsOffline(prev => !prev);
    }, 15000); // toggle every 15s for demo
    return () => clearInterval(toggleOffline);
  }, []);

  const handleCompleteTask = () => {
    setSyncQueue(prev => prev + 1);
    
    // Update task status locally
    if (selectedTask) {
      setTasks(prev => prev.map(t => 
        t.id === selectedTask.id ? { ...t, status: 'completed' } : t
      ));
    }

    setSelectedTask(null);
    setActionStep(0);
    setActiveTab('tasks');
    setPoints({});
    setPhotos({});
    setNotes('');
  };

  const handleSelectTask = (task: any) => {
    setSelectedTask(task);
    setPoints({});
    setPhotos({});
    setNotes('');
    setActionStep(task.status === 'completed' ? 0 : 0);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col font-sans max-w-md mx-auto shadow-2xl relative overflow-hidden">
      
      {/* App Header */}
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 p-4 sticky top-0 z-40">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
             <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
                <MapPin className="w-4 h-4 text-white" />
             </div>
             <div>
               <h1 className="font-black text-slate-800 dark:text-white tracking-tight leading-none">SINC<span className="text-emerald-600 truncate">.Mobile</span></h1>
               <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Técnico de Terreno</p>
             </div>
          </div>
          <button onClick={() => navigate('/login')} className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:text-rose-500 transition-colors">
            <LogOut className="w-4 h-4" />
          </button>
        </div>

        {/* Offline Banner indicator */}
        <AnimatePresence>
          {isOffline && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-xl p-2.5 flex items-center gap-2 overflow-hidden"
            >
              <WifiOff className="w-4 h-4 text-amber-600 shrink-0" />
              <p className="text-xs font-bold text-amber-700 dark:text-amber-500">Modo Offline Ativo. Trabalhando localmente.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Main Content Area */}
      <main className={cn("flex-1 overflow-y-auto", activeTab === 'map' ? "p-0 flex flex-col" : "pb-24 p-4")}>
        
        {/* VIEW: TASKS LIST */}
        {activeTab === 'tasks' && !selectedTask && (
          <div className="space-y-6">
            
            {/* Tech Stats Overview */}
            <div className="bg-slate-900 rounded-2xl p-5 flex items-center justify-between shadow-lg">
              <div className="text-white">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Progresso Diário</p>
                <div className="flex items-end gap-2">
                  <span className="text-3xl font-black leading-none">{tasks.filter(t => t.status === 'completed' && t.date.includes('Hoje')).length}</span>
                  <span className="text-sm font-bold text-slate-400 mb-0.5">/ {tasks.filter(t => t.date.includes('Hoje')).length} Tarefas</span>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="text-center">
                  <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-emerald-400 mb-1">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">12km</span>
                </div>
                <div className="text-center">
                  <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-blue-400 mb-1">
                    <Activity className="w-4 h-4" />
                  </div>
                  <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">Ativo</span>
                </div>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-end mb-4">
                <h2 className="text-lg font-black text-slate-800 dark:text-white">Tarefas Pendentes</h2>
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded-md">{tasks.filter(t => t.status === 'pending').length}</span>
              </div>
              <div className="space-y-3">
                {tasks.filter(t => t.status === 'pending').map(task => (
                  <div 
                    key={task.id} 
                    onClick={() => handleSelectTask(task)}
                    className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm active:scale-[0.98] transition-transform cursor-pointer relative overflow-hidden"
                  >
                    <div className={cn("absolute top-0 left-0 w-1 h-full", 
                      task.taskType === 'notificacao' ? 'bg-amber-500' :
                      task.taskType === 'inspecao' ? 'bg-blue-500' :
                      'bg-emerald-500'
                    )}></div>
                    <div className="flex justify-between items-start mb-3 pl-2">
                      <span className={cn("text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md",
                        task.taskType === 'notificacao' ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400' :
                        task.taskType === 'inspecao' ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400' :
                        'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                      )}>
                        {task.type}
                      </span>
                      <span className="text-xs font-bold text-slate-400">{task.date}</span>
                    </div>
                    <h3 className="font-bold text-base text-slate-800 dark:text-white leading-tight mb-1 pl-2">{task.client}</h3>
                    <p className="text-sm font-medium text-slate-500 flex items-center gap-1 pl-2">
                       <MapPin className="w-3 h-3" />
                       {task.location} • <span className="font-mono text-[10px]">{task.id}</span>
                    </p>
                  </div>
                ))}
                
                {tasks.filter(t => t.status === 'pending').length === 0 && (
                  <div className="text-center py-6">
                    <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2 opacity-50" />
                    <p className="text-sm font-bold text-slate-500">Nenhuma tarefa pendente!</p>
                  </div>
                )}
              </div>
            </div>

            {tasks.filter(t => t.status === 'completed').length > 0 && (
              <div>
                <h2 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-4">Tarefas Concluídas</h2>
                <div className="space-y-3 opacity-60 hover:opacity-100 transition-opacity">
                  {tasks.filter(t => t.status === 'completed').map(task => (
                    <div 
                      key={task.id} 
                      onClick={() => handleSelectTask(task)}
                      className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 cursor-pointer"
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="font-bold text-slate-800 dark:text-white line-through decoration-slate-400">{task.type}</h3>
                          <p className="text-xs text-slate-500">{task.client}</p>
                        </div>
                        <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div>
              <h2 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-4">Em Fila de Sincronização</h2>
              <div className="bg-slate-100 dark:bg-slate-800/50 rounded-2xl p-6 text-center border border-slate-200 dark:border-slate-700 border-dashed relative overflow-hidden">
                 <CloudOff className="w-8 h-8 text-slate-400 mx-auto mb-2 opacity-50" />
                 <p className="text-sm font-bold text-slate-500">{syncQueue} tarefas aguardando upload</p>
                 <button onClick={() => setActiveTab('sync')} className="mt-3 text-xs font-black uppercase tracking-widest text-emerald-600">Ver Fila</button>
              </div>
            </div>
          </div>
        )}

        {/* VIEW: TASK DETAILS & ACTIONS */}
        {activeTab === 'tasks' && selectedTask && (
          <div className="space-y-6">
            <button 
              onClick={() => { setSelectedTask(null); setActionStep(0); }}
              className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs font-bold text-slate-500 w-fit"
            >
              ← Voltar à lista
            </button>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
              <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-1">{selectedTask.type}</h2>
              <p className="text-sm text-slate-500 mb-6">{selectedTask.client} • {selectedTask.location}</p>

              {/* Step indicator */}
              <div className="flex gap-2 mb-6">
                 {[0, 1, 2].map(s => (
                   <div key={s} className={cn("h-1.5 flex-1 rounded-full", actionStep >= s ? "bg-emerald-500" : "bg-slate-100 dark:bg-slate-800")}></div>
                 ))}
              </div>

              {actionStep === 0 && (
                <div className="space-y-4">
                  <div className="h-40 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center relative overflow-hidden">
                     <Map className="w-10 h-10 text-slate-300 absolute" />
                     <div className="absolute inset-0 bg-emerald-500/5"></div>
                     <div className="px-4 py-2 bg-white/90 dark:bg-slate-900/90 backdrop-blur rounded-lg shadow-sm z-10 flex items-center gap-2">
                       <MapPin className="w-4 h-4 text-emerald-600" />
                       <span className="text-xs font-mono font-bold">{selectedTask.coords}</span>
                     </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700">
                       <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Duração Est.</p>
                       <p className="font-bold text-slate-800 dark:text-white text-sm">45 min</p>
                    </div>
                    <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700">
                       <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Prioridade</p>
                       <p className="font-bold text-slate-800 dark:text-white text-sm">
                         {selectedTask.taskType === 'notificacao' ? 'Alta' : 'Normal'}
                       </p>
                    </div>
                  </div>

                  {selectedTask.status === 'completed' ? (
                    <div className="p-4 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 rounded-xl text-center">
                      <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                      <p className="font-bold text-emerald-800 dark:text-emerald-400">Tarefa Concluída e Sincronizada</p>
                      <button onClick={() => setSelectedTask(null)} className="mt-2 text-xs font-bold text-emerald-600 uppercase tracking-widest">Voltar</button>
                    </div>
                  ) : (
                    <button 
                      onClick={() => setActionStep(1)} 
                      className={cn(
                        "w-full py-4 text-white rounded-xl font-bold uppercase tracking-widest text-xs shadow-lg active:scale-[0.98] transition-transform",
                        selectedTask.taskType === 'notificacao' ? 'bg-amber-500 shadow-amber-500/20' : 'bg-emerald-500 shadow-emerald-500/20'
                      )}
                    >
                      {selectedTask.taskType === 'notificacao' ? 'Iniciar Notificação' : 
                       selectedTask.taskType === 'inspecao' ? 'Iniciar Inspeção' :
                       'Iniciar Vistoria'}
                    </button>
                  )}
                </div>
              )}

              {actionStep === 1 && selectedTask && (
                <div className="space-y-6">
                  <h3 className="font-bold text-slate-800 dark:text-white pb-2 border-b border-slate-200 dark:border-slate-800">
                    Obrigações da Tarefa
                  </h3>
                  
                  {(() => {
                    const reqs = TASK_REQUIREMENTS[selectedTask.taskType as keyof typeof TASK_REQUIREMENTS] || { points: [], photos: [] };
                    const allPhotosDone = reqs.photos.every(r => photos[r]);
                    const allPointsDone = reqs.points.every(r => points[r]);
                    const canProceed = allPhotosDone && allPointsDone;

                    return (
                      <>
                        {/* Requirement List */}
                        <div className="space-y-4">
                           {reqs.photos.map(req => (
                             <div key={`photo-${req}`} className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                               <div className="flex items-center gap-3">
                                 <div className={cn("w-10 h-10 rounded-full flex items-center justify-center", photos[req] ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400" : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-400")}>
                                   {photos[req] ? <CheckCircle2 className="w-5 h-5" /> : <Camera className="w-5 h-5" />}
                                 </div>
                                 <div>
                                   <p className="font-bold text-sm text-slate-800 dark:text-white flex items-center gap-2">
                                     {req} {photos[req] && <span className="text-[10px] uppercase font-black tracking-widest text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded-full">Ok</span>}
                                   </p>
                                   <p className="text-xs text-slate-500">Fotografia Obrigatória</p>
                                 </div>
                               </div>
                               {!photos[req] ? (
                                 <button 
                                   onClick={() => {
                                     setCurrentCollectionItem({ type: 'photo', id: req });
                                     setShowCameraModal(true);
                                   }}
                                   className="px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold uppercase tracking-widest rounded-lg active:scale-95 transition-transform"
                                 >
                                    Capturar
                                 </button>
                               ) : (
                                 <div className="w-12 h-12 rounded-lg bg-cover bg-center border border-slate-200 dark:border-slate-700" style={{ backgroundImage: `url(${photos[req]})` }}></div>
                               )}
                             </div>
                           ))}

                           {reqs.points.map(req => (
                             <div key={`point-${req}`} className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                               <div className="flex items-center gap-3 shrink-0">
                                 <div className={cn("w-10 h-10 rounded-full flex items-center justify-center", points[req] ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400" : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-400")}>
                                   {points[req] ? <CheckCircle2 className="w-5 h-5" /> : <Navigation className="w-5 h-5" />}
                                 </div>
                                 <div>
                                   <p className="font-bold text-sm text-slate-800 dark:text-white flex items-center gap-2">
                                     {req} {points[req] && <span className="text-[10px] uppercase font-black tracking-widest text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded-full">Ok</span>}
                                   </p>
                                   {points[req] ? (
                                     <p className="text-xs text-emerald-600/70 font-mono">Lat: {points[req].lat}</p>
                                   ) : (
                                     <p className="text-xs text-slate-500">Coord. Obrigatória</p>
                                   )}
                                 </div>
                               </div>
                               {!points[req] && (
                                 <button 
                                   onClick={() => {
                                     setCurrentCollectionItem({ type: 'point', id: req });
                                     setShowMapModal(true);
                                   }}
                                   className="px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold uppercase tracking-widest rounded-lg active:scale-95 transition-transform shrink-0"
                                 >
                                    Registar
                                 </button>
                               )}
                             </div>
                           ))}

                           {/* Notes option */}
                           <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-400 flex items-center justify-center">
                                    <ClipboardCheck className="w-5 h-5" />
                                  </div>
                                  <div>
                                    <p className="font-bold text-sm text-slate-800 dark:text-white">Observações</p>
                                    <p className="text-xs text-slate-500">Opcional</p>
                                  </div>
                                </div>
                                <button 
                                  onClick={() => {
                                    const note = prompt('Inserir observações:');
                                    if(note) setNotes(note);
                                  }}
                                  className="px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-white text-xs font-bold uppercase tracking-widest rounded-lg active:scale-95 transition-transform"
                                >
                                   {notes ? 'Editar Notas' : 'Adicionar Notas'}
                                </button>
                              </div>
                              {notes && (
                                <p className="text-sm text-slate-700 dark:text-slate-300 mt-3 pt-3 border-t border-slate-200 dark:border-slate-700">{notes}</p>
                              )}
                           </div>
                        </div>

                        <button 
                          onClick={() => setActionStep(2)} 
                          disabled={!canProceed}
                          className="w-full py-4 mt-6 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-bold uppercase tracking-widest text-xs active:scale-[0.98] transition-transform disabled:opacity-50"
                        >
                          {canProceed ? 'Avançar para Assinaturas' : 'Complete os requisitos'}
                        </button>
                      </>
                    )
                  })()}
                </div>
              )}

              {actionStep === 2 && (
                <div className="space-y-4">
                  <h3 className="font-bold text-slate-800 dark:text-white">
                    {selectedTask.taskType === 'notificacao' ? 'Assinatura do Infrator/Recetor' : 'Assinaturados Conformantes'}
                  </h3>
                  
                  <div className="w-full h-32 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl flex items-center justify-center relative overflow-hidden group">
                     <span className="text-sm font-medium text-slate-400 opacity-50 absolute pointer-events-none">Área para assinar com o dedo</span>
                     <svg className="w-full h-full relative z-10 cursor-crosshair opacity-0 group-hover:opacity-100 transition-opacity" viewBox="0 0 400 150">
                        {/* Mock signature path that 'appears' */}
                        <path d="M 50 100 C 50 80, 80 50, 100 80 C 120 110, 150 100, 160 70 C 170 40, 200 60, 220 90 C 240 120, 280 110, 300 80 C 320 50, 350 70, 360 100" stroke="currentColor" strokeWidth="3" fill="transparent" className="text-emerald-500" strokeLinecap="round" />
                     </svg>
                  </div>

                  {selectedTask.taskType === 'notificacao' && (
                    <div className="flex items-center gap-2 mt-4 text-sm text-slate-500">
                      <input type="checkbox" id="refused" className="rounded text-emerald-500 focus:ring-emerald-500" />
                      <label htmlFor="refused">Recusou-se a assinar (testemunhado)</label>
                    </div>
                  )}

                  <button 
                    onClick={handleCompleteTask} 
                    className={cn(
                      "w-full py-4 mt-6 text-white rounded-xl font-bold uppercase tracking-widest text-xs shadow-lg active:scale-[0.98] transition-transform flex items-center justify-center gap-2",
                      selectedTask.taskType === 'notificacao' ? 'bg-amber-500 shadow-amber-500/20' : 'bg-emerald-500 shadow-emerald-500/20'
                    )}
                  >
                    <FileSignature className="w-4 h-4" /> Finalizar e Guardar Localmente
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* VIEW: MAP / TERRENO */}
        {activeTab === 'map' && (
          <div className="flex-1 flex flex-col relative pb-20">
            {/* Full screen map simulation */}
            <div className="flex-1 bg-slate-200 dark:bg-slate-800 relative z-0">
               <div className="absolute inset-0 opacity-60 bg-[url('https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=1000')] bg-cover bg-center"></div>
               
               {/* Search overlay */}
               <div className="absolute top-4 left-4 right-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur rounded-xl p-3 shadow-lg flex items-center gap-3">
                 <MapPin className="w-5 h-5 text-slate-400" />
                 <input type="text" placeholder="Buscar parcela ou lote..." className="bg-transparent border-none outline-none flex-1 font-medium text-sm text-slate-800 dark:text-white placeholder:text-slate-400" />
               </div>

               {/* Map Markers */}
               {tasks.filter(t => t.status === 'pending').map((task, i) => (
                 <div 
                   key={task.id}
                   className="absolute cursor-pointer group"
                   style={{ 
                     top: `${30 + (i * 15)}%`, 
                     left: `${20 + (i * 25)}%`,
                     zIndex: 10
                   }}
                   onClick={() => handleSelectTask(task)}
                 >
                   <div className="relative">
                      <div className={cn("absolute -inset-2 rounded-full animate-ping opacity-20", 
                        task.taskType === 'notificacao' ? 'bg-amber-500' :
                        task.taskType === 'inspecao' ? 'bg-blue-500' :
                        'bg-emerald-500'
                      )}></div>
                      <div className={cn("w-8 h-8 rounded-full border-2 border-white dark:border-slate-800 shadow-lg flex items-center justify-center text-white",
                        task.taskType === 'notificacao' ? 'bg-amber-500' :
                        task.taskType === 'inspecao' ? 'bg-blue-500' :
                        'bg-emerald-500',
                        selectedTask?.id === task.id ? 'ring-4 ring-white/50 dark:ring-slate-900/50 scale-110' : ''
                      )}>
                        {task.taskType === 'notificacao' ? <AlertTriangle className="w-4 h-4" /> :
                         task.taskType === 'inspecao' ? <Activity className="w-4 h-4" /> :
                         <MapPin className="w-4 h-4" />}
                      </div>
                      
                      {/* Tooltip */}
                      <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-white dark:bg-slate-900 rounded-lg shadow-xl px-3 py-2 scale-0 group-hover:scale-100 transition-transform origin-top z-20 w-max border border-slate-100 dark:border-slate-800">
                        <p className="font-bold text-slate-800 dark:text-white text-xs">{task.client}</p>
                        <p className="text-[10px] text-slate-500">{task.type}</p>
                      </div>
                   </div>
                 </div>
               ))}

               {/* Current Location FAB */}
               <button className="absolute bottom-6 right-4 w-12 h-12 bg-white dark:bg-slate-900 rounded-full shadow-xl flex items-center justify-center text-slate-800 dark:text-white border border-slate-100 dark:border-slate-800">
                 <Navigation className="w-5 h-5 text-blue-500" />
               </button>
            </div>
            
            {/* Map Bottom Sheet Info */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-t-3xl shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)] relative z-10 transition-all">
              <div className="w-12 h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full mx-auto mb-4"></div>
              
              {selectedTask ? (
                <div>
                   <div className="flex justify-between items-start mb-3">
                      <span className={cn("text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md",
                        selectedTask.taskType === 'notificacao' ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400' :
                        selectedTask.taskType === 'inspecao' ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400' :
                        'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                      )}>
                        {selectedTask.type}
                      </span>
                      <span className="text-xs font-bold text-slate-400 bg-slate-50 dark:bg-slate-800 px-2 py-1 rounded flex items-center gap-1 border border-slate-100 dark:border-slate-700">
                        <Navigation className="w-3 h-3 text-blue-500" /> {(Math.random() * 5).toFixed(1)} km
                      </span>
                   </div>
                   <h3 className="font-bold text-lg text-slate-800 dark:text-white leading-tight mb-1">{selectedTask.client}</h3>
                   <p className="text-sm font-medium text-slate-500 flex items-center gap-1 mb-6">
                     <MapPin className="w-3 h-3" />
                     {selectedTask.location} • <span className="font-mono text-[10px]">{selectedTask.id}</span>
                   </p>
                   <div className="flex gap-2">
                     <button 
                       onClick={() => setSelectedTask(null)}
                       className="p-3 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl text-slate-500 font-bold active:scale-95 transition-transform"
                     >
                       ✕
                     </button>
                     <button 
                       onClick={() => setActiveTab('tasks')}
                       className="flex-1 py-3 text-white rounded-xl font-bold uppercase tracking-widest text-xs shadow-lg active:scale-[0.98] transition-transform bg-emerald-500 shadow-emerald-500/20"
                     >
                       Abrir Tarefa
                     </button>
                   </div>
                </div>
              ) : (
                <>
                  <h3 className="font-bold text-slate-800 dark:text-white mb-2">Visão Geral do Terreno</h3>
                  <p className="text-sm text-slate-500 mb-4 flex items-center justify-between">
                    <span>{tasks.filter(t => t.status === 'pending').length} Tarefas nas proximidades</span>
                    <span className="font-mono text-xs bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">Raio: 5km</span>
                  </p>
                  <div className="flex gap-2 text-xs overflow-x-auto pb-1 -mx-2 px-2 scrollbar-none">
                    <span className="shrink-0 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400 font-bold border border-emerald-100 dark:border-emerald-500/20">Demarcações</span>
                    <span className="shrink-0 px-3 py-1.5 rounded-full bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400 font-bold border border-blue-100 dark:border-blue-500/20">Inspeções</span>
                    <span className="shrink-0 px-3 py-1.5 rounded-full bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400 font-bold border border-amber-100 dark:border-amber-500/20">Notificações</span>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* VIEW: SYNC */}
        {activeTab === 'sync' && (
          <div className="space-y-6">
            <h2 className="text-lg font-black text-slate-800 dark:text-white mb-4">Sincronização Cloud</h2>
            
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm text-center">
               <div className="w-20 h-20 mx-auto bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4 relative">
                 {isOffline ? (
                    <CloudOff className="w-8 h-8 text-amber-500" />
                 ) : (
                    <UploadCloud className="w-8 h-8 text-blue-500" />
                 )}
                 {syncQueue > 0 && (
                   <span className="absolute top-0 right-0 w-6 h-6 bg-rose-500 text-white text-xs font-bold rounded-full flex items-center justify-center border-2 border-white dark:border-slate-900">
                     {syncQueue}
                   </span>
                 )}
               </div>
               
               <h3 className="font-bold text-slate-800 dark:text-white text-lg">Estado da Conexão</h3>
               <p className={cn("text-sm font-bold mt-1", isOffline ? "text-amber-500" : "text-emerald-500")}>
                 {isOffline ? "Offline. Sem ligação à Internet." : "Online. Ligado ao servidor DSGC."}
               </p>

               <button 
                 disabled={isOffline || syncQueue === 0}
                 onClick={() => {
                   if (!isOffline && syncQueue > 0) {
                     setSyncQueue(0);
                   }
                 }}
                 className="w-full py-4 mt-6 bg-blue-500 text-white rounded-xl font-bold uppercase tracking-widest text-xs shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
               >
                 {syncQueue === 0 ? 'Tudo Sincronizado' : 'Sincronizar Dados Agora'}
               </button>
            </div>

            <div className="space-y-3">
              <p className="text-xs font-black uppercase tracking-widest text-slate-400">Log de Operações</p>
              {[...Array(syncQueue)].map((_, i) => (
                <div key={i} className="flex items-center gap-3 p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                  <div>
                    <p className="text-xs font-bold text-slate-800 dark:text-white">Dados de Vistoria {i+1}</p>
                    <p className="text-[10px] text-slate-500">Aguardando Wi-Fi para upload</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VIEW: PLANNING / LOTEAMENTO */}
        {activeTab === 'planning' && (
          <div className="space-y-6 h-full flex flex-col">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-lg font-black text-slate-800 dark:text-white">Distribuição de Lotes</h2>
            </div>
            
            {/* Visualizer for Large Plot */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm w-full">
               <div className="flex justify-between items-center mb-4">
                 <div>
                   <p className="text-xs font-black uppercase tracking-widest text-slate-400">Talhão Original</p>
                   <p className="font-bold text-slate-800 dark:text-white">Gleba B - Trindade</p>
                 </div>
                 <span className="px-2 py-1 text-xs font-bold text-slate-600 bg-slate-100 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">10.000 m²</span>
               </div>
               
               <div className="w-full aspect-[4/3] bg-slate-100 dark:bg-slate-800 rounded-xl relative overflow-hidden border border-slate-300 dark:border-slate-700">
                 {/* Main plot shape area */}
                 <div className="absolute inset-4 bg-emerald-100 dark:bg-emerald-900/30 border-2 border-emerald-500 border-dashed rounded relative flex flex-wrap content-start overflow-hidden">
                    {/* Simulated splits */}
                    <div className="w-1/2 h-1/2 border-r-2 border-b-2 border-emerald-500 dark:border-emerald-500 hover:bg-emerald-200 dark:hover:bg-emerald-800/50 flex flex-col items-center justify-center transition-colors cursor-pointer group">
                      <span className="text-emerald-700 dark:text-emerald-400 font-black text-sm">Lote 1</span>
                      <span className="text-emerald-600/70 dark:text-emerald-500/70 text-[10px] font-bold">2.500 m²</span>
                    </div>
                    <div className="w-1/2 h-1/2 border-b-2 border-emerald-500 dark:border-emerald-500 hover:bg-emerald-200 dark:hover:bg-emerald-800/50 flex flex-col items-center justify-center transition-colors cursor-pointer group">
                      <span className="text-emerald-700 dark:text-emerald-400 font-black text-sm">Lote 2</span>
                      <span className="text-emerald-600/70 dark:text-emerald-500/70 text-[10px] font-bold">2.500 m²</span>
                    </div>
                    <div className="w-full h-1/2 hover:bg-emerald-200 dark:hover:bg-emerald-800/50 flex flex-col items-center justify-center transition-colors cursor-pointer group">
                      <span className="text-emerald-700 dark:text-emerald-400 font-black text-sm uppercase tracking-widest">+ Adicionar Divisão</span>
                      <span className="text-emerald-600/70 dark:text-emerald-500/70 text-[10px] font-bold">Área Livre: 5.000 m²</span>
                    </div>
                 </div>
               </div>

               <div className="mt-4 grid grid-cols-2 gap-3">
                 <button className="flex items-center justify-center gap-2 py-3 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-white rounded-xl font-bold text-sm active:scale-95 transition-transform">
                   <Scissors className="w-4 h-4" /> Dividir Gleba
                 </button>
                 <button className="flex items-center justify-center gap-2 py-3 bg-emerald-500 text-white rounded-xl font-bold text-sm shadow-lg shadow-emerald-500/20 active:scale-[0.98] transition-transform">
                   Atribuir Lote
                 </button>
               </div>
            </div>

            <div className="space-y-3">
               <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">Lotes Gerados</h3>
               <div className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl flex items-center justify-between">
                 <div className="flex items-center gap-3">
                   <div className="w-10 h-10 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-bold">L1</div>
                   <div>
                     <p className="font-bold text-sm text-slate-800 dark:text-white">Lote 1 - 2.500 m²</p>
                     <p className="text-xs text-slate-500">Atribuído a: Sr. Silva</p>
                   </div>
                 </div>
                 <button className="p-2 text-slate-400 hover:text-slate-600"><MoreVertical className="w-4 h-4" /></button>
               </div>
               <div className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl flex items-center justify-between opacity-70">
                 <div className="flex items-center gap-3">
                   <div className="w-10 h-10 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-bold">L2</div>
                   <div>
                     <p className="font-bold text-sm text-slate-800 dark:text-white">Lote 2 - 2.500 m²</p>
                     <p className="text-xs text-slate-500">Disponível</p>
                   </div>
                 </div>
                 <button className="text-xs font-bold text-blue-500 uppercase tracking-widest bg-blue-50 dark:bg-blue-500/10 px-3 py-1.5 rounded-lg border border-blue-100 dark:border-blue-500/20">Atribuir</button>
               </div>
            </div>
          </div>
        )}
      </main>

      {/* Bottom Navigation */}
      <nav className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 p-2 pb-6 fixed bottom-0 w-full max-w-md z-40 flex">
        <button 
          onClick={() => setActiveTab('tasks')}
          className={cn(
            "flex-1 flex flex-col items-center justify-center py-2 gap-1 rounded-xl transition-colors",
            activeTab === 'tasks' ? "text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10" : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
          )}
        >
          <ListTodo className="w-6 h-6" />
          <span className="text-[10px] font-bold">Tarefas</span>
        </button>
        <button 
          onClick={() => setActiveTab('map')}
          className={cn(
            "flex-1 flex flex-col items-center justify-center py-2 gap-1 rounded-xl transition-colors",
            activeTab === 'map' ? "text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10" : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
          )}
        >
          <Map className="w-6 h-6" />
          <span className="text-[10px] font-bold">Terreno</span>
        </button>
        <button 
          onClick={() => setActiveTab('planning')}
          className={cn(
            "flex-1 flex flex-col items-center justify-center py-2 gap-1 rounded-xl transition-colors",
            activeTab === 'planning' ? "text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10" : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
          )}
        >
          <Layers className="w-6 h-6" />
          <span className="text-[10px] font-bold">Loteamento</span>
        </button>
        <button 
          onClick={() => setActiveTab('sync')}
          className={cn(
            "flex-1 flex flex-col items-center justify-center py-2 gap-1 rounded-xl transition-colors relative",
            activeTab === 'sync' ? "text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10" : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
          )}
        >
          {syncQueue > 0 && <span className="absolute top-1 right-8 w-2 h-2 bg-rose-500 rounded-full"></span>}
          <UploadCloud className="w-6 h-6" />
          <span className="text-[10px] font-bold">Sincronizar</span>
        </button>
      </nav>

    {/* Camera Modal Overlay */}
    <AnimatePresence>
      {showCameraModal && (
        <motion.div 
          initial={{ opacity: 0, y: "100%" }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: "100%" }}
          className="fixed inset-0 z-50 bg-slate-900 flex flex-col pt-12"
        >
          <div className="flex justify-between items-center px-6 py-4 absolute top-0 w-full z-10 bg-gradient-to-b from-slate-900 to-transparent">
             <span className="text-white font-bold tracking-widest text-sm uppercase shadow-sm">Modo Captura</span>
             <button 
               onClick={() => setShowCameraModal(false)}
               className="text-white bg-slate-800/50 hover:bg-slate-700/50 rounded-full w-10 h-10 flex items-center justify-center p-2 backdrop-blur-md"
             >
               ✕
             </button>
          </div>

          <div className="flex-1 relative flex items-center justify-center overflow-hidden">
             {/* Fake Camera Viewfinder */}
             <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&q=80&w=1000')] bg-cover bg-center brightness-75"></div>
             
             {/* Viewfinder crosshairs */}
             <div className="relative z-10 w-64 h-64 border-2 border-white/30 flex items-center justify-center">
                <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-emerald-500"></div>
                <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-emerald-500"></div>
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-emerald-500"></div>
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-emerald-500"></div>
                <div className="w-2 h-2 rounded-full bg-emerald-500/50"></div>
             </div>
          </div>

          <div className="h-40 bg-black flex items-center justify-center gap-12 pb-8">
             <div className="w-12 h-12 rounded-full bg-slate-800 border-2 border-slate-700"></div>
             <button 
               onClick={() => {
                 if (currentCollectionItem?.type === 'photo') {
                   setPhotos(prev => ({...prev, [currentCollectionItem.id]: `https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&q=80&w=1000&auto=format&fit=crop&q=80&w=400&h=400&timestamp=${Date.now()}`}));
                 }
                 setShowCameraModal(false);
               }}
               className="w-20 h-20 rounded-full bg-white border-4 border-slate-300 flex items-center justify-center active:scale-95 transition-transform"
             >
               <div className="w-16 h-16 rounded-full bg-white border border-slate-200 shadow-sm"></div>
             </button>
             <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-white border-2 border-slate-700"><Camera className="w-5 h-5"/></div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>

    {/* Map/GPS Modal Overlay */}
    <AnimatePresence>
      {showMapModal && (
        <motion.div 
          initial={{ opacity: 0, y: "100%" }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: "100%" }}
          className="fixed inset-0 z-50 bg-slate-50 dark:bg-slate-900 flex flex-col pt-12"
        >
          <div className="flex justify-between items-center px-6 py-4 absolute top-0 w-full z-10 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
             <span className="text-slate-800 dark:text-white font-bold tracking-widest text-sm uppercase">Registar Ponto</span>
             <button 
               onClick={() => setShowMapModal(false)}
               className="text-slate-500 hover:text-slate-800 dark:hover:text-white bg-slate-100 dark:bg-slate-800 w-10 h-10 flex items-center justify-center rounded-full"
             >
               ✕
             </button>
          </div>

          <div className="flex-1 relative flex items-center justify-center overflow-hidden">
             {/* Fake Map View */}
             <div className="absolute inset-0 bg-[#e5e5e5] dark:bg-slate-800">
               <div className="absolute inset-0 opacity-40 bg-[url('https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=1000')] bg-cover bg-center"></div>
             </div>
             
             {/* Device Location Reticle */}
             <div className="relative z-10 w-16 h-16 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full bg-emerald-500/20 animate-ping"></div>
                <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center shadow-lg">
                  <div className="w-4 h-4 rounded-full bg-emerald-500"></div>
                </div>
             </div>

             {/* Mock GPS coordinates floating panel */}
             <div className="absolute top-20 left-4 right-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-xl p-4 shadow-lg border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Precisão Estimada</p>
                  <p className="text-sm font-bold text-emerald-600">± 2.4 Metros (DGNSS)</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Satélites</p>
                  <p className="text-sm font-bold text-slate-800 dark:text-white">12 Fixos</p>
                </div>
             </div>
          </div>

          <div className="p-6 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 pb-12">
            <button 
               onClick={() => {
                 if (currentCollectionItem?.type === 'point') {
                   setPoints(prev => ({...prev, [currentCollectionItem.id]: {
                     lat: (0.34000 + Math.random() * 0.00500).toFixed(5),
                     lng: (6.74000 + Math.random() * 0.00500).toFixed(5)
                   }}));
                 }
                 setShowMapModal(false);
               }}
               className="w-full py-4 bg-emerald-500 text-white rounded-xl font-bold uppercase tracking-widest text-sm shadow-lg shadow-emerald-500/20 active:scale-[0.98] transition-transform flex items-center justify-center gap-2"
             >
               <MapPin className="w-5 h-5" /> Adicionar Ponto de Medição
             </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>

    </div>
  );
}
