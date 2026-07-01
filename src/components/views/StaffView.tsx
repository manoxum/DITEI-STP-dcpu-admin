import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, 
  Plus, 
  Building2, 
  Search, 
  Mail, 
  Phone, 
  Shield, 
  Globe, 
  MoreVertical,
  CheckCircle2,
  X,
  UserPlus,
  Landmark,
  Briefcase,
  Filter
} from 'lucide-react';
import { cn } from '../../lib/utils';

interface Institution {
  id: string;
  name: string;
  type: 'government' | 'municipal' | 'private';
  collaboratorsCount: number;
  status: 'active' | 'inactive';
}

interface StaffMember {
  id: string;
  name: string;
  institution: string;
  role: string;
  type: 'internal' | 'external';
  status: 'active' | 'inactive';
  email: string;
}

const INITIAL_INSTITUTIONS: Institution[] = [
  { id: '1', name: 'DSGC - Cadastre', type: 'government', collaboratorsCount: 24, status: 'active' },
  { id: '2', name: 'Conservatória do Registo Predial', type: 'government', collaboratorsCount: 5, status: 'active' },
  { id: '3', name: 'Cartório Notarial de São Tomé', type: 'government', collaboratorsCount: 3, status: 'active' },
  { id: '4', name: 'Câmara Municipal de Água Grande', type: 'municipal', collaboratorsCount: 8, status: 'active' },
];

const INITIAL_STAFF: StaffMember[] = [
  { id: '1', name: 'Alberto Costa', institution: 'DSGC - Cadastre', role: 'Diretor Técnico', type: 'internal', status: 'active', email: 'alberto@dsgc.gov.st' },
  { id: '2', name: 'Maria Silveira', institution: 'DSGC - Cadastre', role: 'Analista SIG', type: 'internal', status: 'active', email: 'maria@dsgc.gov.st' },
  { id: '3', name: 'Carlos Santos', institution: 'Conservatória do Registo Predial', role: 'Consultor Externo', type: 'external', status: 'active', email: 'carlos@registo.gov.st' },
  { id: '4', name: 'Daniela Ramos', institution: 'Cartório Notarial', role: 'Notária', type: 'external', status: 'active', email: 'daniela@notariado.gov.st' },
];

export function StaffView() {
  const [activeTab, setActiveTab] = useState<'staff' | 'institutions'>('staff');
  const [viewMode, setViewMode] = useState<'card' | 'table'>('card');
  const [showMemberModal, setShowMemberModal] = useState(false);
  const [showInstModal, setShowInstModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
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

  const filteredStaff = INITIAL_STAFF.filter(member => 
    member.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    member.role.toLowerCase().includes(searchQuery.toLowerCase()) || 
    member.institution.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredInst = INITIAL_INSTITUTIONS.filter(inst => 
    inst.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    inst.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 relative pb-20">
      {/* HEADER SECTION */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-display font-black tracking-tighter">Gestão de Colaboradores</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium">Controlo de acessos internos e cooperação inter-institucional.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200/40 dark:border-slate-700/40">
            <button 
              onClick={() => setActiveTab('staff')}
              className={cn(
                "px-3.5 py-2.5 rounded-lg transition-all text-xs font-black uppercase tracking-wider flex items-center gap-1.5",
                activeTab === 'staff' ? "bg-white dark:bg-slate-700 shadow-sm text-slate-800 dark:text-white" : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-350"
              )}
            >
              <Users className="w-3.5 h-3.5" /> Membros
            </button>
            <button 
              onClick={() => setActiveTab('institutions')}
              className={cn(
                "px-3.5 py-2.5 rounded-lg transition-all text-xs font-black uppercase tracking-wider flex items-center gap-1.5",
                activeTab === 'institutions' ? "bg-white dark:bg-slate-700 shadow-sm text-slate-800 dark:text-white" : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-350"
              )}
            >
              <Landmark className="w-3.5 h-3.5" /> Instituições
            </button>
          </div>

          <div className={cn("bg-slate-100 dark:bg-slate-800 p-1 rounded-xl", isMobile ? "hidden" : "flex")}>
            <button 
              onClick={() => setViewMode('card')}
              title="Visualização em Cartões"
              className={cn("px-3.5 py-2.5 rounded-lg transition-all flex items-center gap-2 text-xs font-black uppercase tracking-wider", viewMode === 'card' ? "bg-white dark:bg-slate-700 shadow-sm text-emerald-600 dark:text-emerald-400" : "text-slate-400")}
            >
              <Briefcase className="w-4 h-4" />
              <span>Cartões</span>
            </button>
            <button 
              onClick={() => setViewMode('table')}
              title="Visualização em Tabela"
              className={cn("px-3.5 py-2.5 rounded-lg transition-all flex items-center gap-2 text-xs font-black uppercase tracking-wider", viewMode === 'table' ? "bg-white dark:bg-slate-700 shadow-sm text-emerald-600 dark:text-emerald-400" : "text-slate-400")}
            >
              <Users className="w-4 h-4" />
              <span>Lista</span>
            </button>
          </div>

          <button 
            onClick={() => activeTab === 'staff' ? setShowMemberModal(true) : setShowInstModal(true)}
            className="premium-gradient text-white px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-emerald-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <Plus className="w-4 h-4" />
            {activeTab === 'staff' ? 'Novo Colaborador' : 'Registar Instituição'}
          </button>
        </div>
      </div>

      {/* SEARCH AND FILTERS BAR */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-3xl flex flex-wrap items-center justify-between gap-4 shadow-sm">
        <div className="relative flex-1 min-w-[300px]">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder={activeTab === 'staff' ? "Pesquisar membros..." : "Pesquisar instituições..."}
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
            <Filter className="w-4 h-4" /> Filtros Avançados
          </button>
          <div className="px-4 py-2.5 bg-slate-100 dark:bg-slate-950 border border-slate-100 dark:border-slate-850 rounded-xl text-xs font-black uppercase tracking-wider text-slate-500 flex items-center gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            <span>Resultados: {activeTab === 'staff' ? filteredStaff.length : filteredInst.length}</span>
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Cargo / Função</label>
                <select className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 px-4 py-2.5 rounded-xl text-sm font-medium focus:outline-none focus:border-emerald-500">
                  <option value="">Todas as Funções</option>
                  <option value="director">Diretor / Chefia</option>
                  <option value="technician">Técnico Superior</option>
                  <option value="notary">Notário</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Estado de Conta</label>
                <select className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 px-4 py-2.5 rounded-xl text-sm font-medium focus:outline-none focus:border-emerald-500">
                  <option value="">Todos os Estados</option>
                  <option value="active">Activo</option>
                  <option value="inactive">Inactivo</option>
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

      <AnimatePresence mode="wait">
        {activeTab === 'staff' ? (
          <motion.div 
            key={`staff-${viewMode}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            {viewMode === 'card' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                {filteredStaff.map((member) => (
                  <div key={member.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-3xl shadow-sm hover:shadow-md hover:border-emerald-500/30 transition-all duration-300 group flex flex-col justify-between">
                    <div className="flex flex-col">
                      <div className="flex items-start justify-between mb-3">
                        <div className={cn(
                          "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors duration-300",
                          member.type === 'internal' ? "bg-emerald-500/10 text-emerald-500" : "bg-blue-500/10 text-blue-500"
                        )}>
                          <Users className="w-5 h-5" />
                        </div>
                        <div className={cn(
                          "px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider shrink-0",
                          member.type === 'internal' ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600" : "bg-blue-50 dark:bg-blue-500/10 text-blue-600"
                        )}>
                          {member.type}
                        </div>
                      </div>
                      
                      <div className="mb-3">
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white truncate">{member.name}</h3>
                        <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest truncate">{member.role}</p>
                      </div>
                    </div>

                    <div className="space-y-1.5 mb-4 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-700/30">
                      <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                        <Building2 className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                        <span className="text-[11px] font-medium truncate">{member.institution}</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                        <Mail className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                        <span className="text-[11px] font-medium truncate">{member.email}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-auto">
                       <div className="flex items-center gap-1.5">
                         <div className="relative flex h-1.5 w-1.5">
                           <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                           <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                         </div>
                         <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">Ativo</span>
                       </div>
                       <button className="text-[10px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 hover:text-emerald-600 transition-colors bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 py-1.5 rounded-lg shadow-sm hover:border-emerald-500/30">
                         Ver Detalhes
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
                        <th className="pl-8 pr-4 py-4.5 font-bold text-xs uppercase tracking-wider text-slate-400">Nome</th>
                        <th className="px-6 py-4.5 font-bold text-xs uppercase tracking-wider text-slate-400">Papel</th>
                        <th className="px-6 py-4.5 font-bold text-xs uppercase tracking-wider text-slate-400">Instituição</th>
                        <th className="px-6 py-4.5 font-bold text-xs uppercase tracking-wider text-slate-400">Email</th>
                        <th className="px-6 py-4.5 font-bold text-xs uppercase tracking-wider text-slate-400">Tipo</th>
                        <th className="pr-8 pl-4 py-4.5 text-right font-bold text-xs uppercase tracking-wider text-slate-400">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {filteredStaff.map((member) => (
                        <tr key={member.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-950/60 transition-all cursor-pointer group">
                          <td className="pl-8 pr-4 py-4">
                            <div className="flex items-center gap-3">
                              <div className={cn("w-8 h-8 rounded-xl flex items-center justify-center shrink-0", member.type === 'internal' ? "bg-emerald-500/10 text-emerald-500" : "bg-blue-500/10 text-blue-500")}>
                                <Users className="w-4 h-4" />
                              </div>
                              <span className="font-bold text-sm tracking-tight text-slate-800 dark:text-slate-100">{member.name}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm font-semibold text-slate-600 dark:text-slate-300">
                            {member.role}
                          </td>
                          <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400">
                            {member.institution}
                          </td>
                          <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400">
                            {member.email}
                          </td>
                          <td className="px-6 py-4">
                             <div className={cn(
                               "px-2.5 py-1 rounded inline-block text-[10px] font-black uppercase tracking-wider",
                               member.type === 'internal' ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600" : "bg-blue-50 dark:bg-blue-500/10 text-blue-600"
                             )}>
                               {member.type}
                             </div>
                          </td>
                          <td className="pr-8 pl-4 py-4 text-right">
                            <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                              <MoreVertical className="w-5 h-5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div 
            key="inst-list"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 rounded-3xl overflow-hidden shadow-sm mt-4"
          >
             <div className="hidden md:block overflow-x-auto">
               <table className="w-full min-w-[720px] text-left border-collapse">
                 <thead className="bg-slate-50 dark:bg-slate-950 border-b border-slate-100 dark:border-slate-850">
                   <tr>
                     <th className="pl-8 pr-4 py-4.5 font-bold text-xs uppercase tracking-wider text-slate-400">Instituição</th>
                     <th className="px-6 py-4.5 font-bold text-xs uppercase tracking-wider text-slate-400">Tipo</th>
                     <th className="px-6 py-4.5 font-bold text-xs uppercase tracking-wider text-slate-400">Utilizadores</th>
                     <th className="px-6 py-4.5 font-bold text-xs uppercase tracking-wider text-slate-400">Status</th>
                     <th className="pr-8 pl-4 py-4.5 text-right font-bold text-xs uppercase tracking-wider text-slate-400">Ações</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                   {filteredInst.map((inst) => (
                     <tr key={inst.id} className="group hover:bg-slate-50/80 dark:hover:bg-slate-950/60 transition-colors">
                       <td className="pl-8 pr-4 py-5.5">
                         <div className="flex items-center gap-4">
                           <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 group-hover:bg-emerald-500/10 group-hover:text-emerald-500 transition-all">
                             <Landmark className="w-5 h-5" />
                           </div>
                           <p className="font-bold tracking-tight text-slate-900 dark:text-white">{inst.name}</p>
                         </div>
                       </td>
                       <td className="px-6 py-5.5">
                         <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">{inst.type}</span>
                       </td>
                       <td className="px-6 py-5.5">
                         <div className="flex items-center gap-2">
                           <Users className="w-3.5 h-3.5 text-slate-400" />
                           <span className="text-sm font-bold">{inst.collaboratorsCount}</span>
                         </div>
                       </td>
                       <td className="px-6 py-5.5">
                          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 text-[10px] font-black uppercase tracking-widest">
                            <CheckCircle2 className="w-3 h-3" /> Ligação Ativa
                          </div>
                       </td>
                       <td className="pr-8 pl-4 py-5.5 text-right">
                         <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                            <MoreVertical className="w-5 h-5" />
                         </button>
                       </td>
                     </tr>
                   ))}
                 </tbody>
               </table>
             </div>
             
             <div className="grid grid-cols-1 gap-4 p-4 md:hidden">
               {filteredInst.map((inst) => (
                 <div key={inst.id} className="rounded-2xl border border-slate-100 dark:border-slate-850 bg-slate-50/50 dark:bg-slate-950/25 p-5 hover:bg-slate-50 dark:hover:bg-slate-950/40">
                   <div className="flex items-start justify-between gap-4">
                     <div className="flex items-center gap-3 min-w-0">
                       <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 shrink-0">
                         <Landmark className="w-5 h-5" />
                       </div>
                       <div className="min-w-0">
                         <p className="font-bold tracking-tight text-slate-900 dark:text-white truncate">{inst.name}</p>
                         <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1">{inst.type}</p>
                       </div>
                     </div>
                     <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors shrink-0">
                       <MoreVertical className="w-5 h-5" />
                     </button>
                   </div>
                   <div className="mt-4 space-y-3">
                     <div className="flex items-center justify-between gap-3">
                       <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Utilizadores</span>
                       <div className="flex items-center gap-2">
                         <Users className="w-3.5 h-3.5 text-slate-400" />
                         <span className="text-sm font-bold">{inst.collaboratorsCount}</span>
                       </div>
                     </div>
                     <div className="flex items-center justify-between gap-3">
                       <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Status</span>
                       <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 text-[10px] font-black uppercase tracking-widest">
                         <CheckCircle2 className="w-3 h-3" /> Ligação Ativa
                       </div>
                     </div>
                   </div>
                 </div>
               ))}
             </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Simplified Modal Simulation */}
      {(showMemberModal || showInstModal) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8 lg:p-24 overflow-y-auto">
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" 
            onClick={() => { setShowMemberModal(false); setShowInstModal(false); }}
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="relative bg-white dark:bg-slate-900 rounded-[2.5rem] sm:rounded-[3rem] w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl p-6 sm:p-10 md:p-16"
          >
             <button 
               onClick={() => { setShowMemberModal(false); setShowInstModal(false); }}
               className="absolute top-4 right-4 sm:top-8 sm:right-8 p-3 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-2xl transition-colors"
             >
               <X className="w-6 h-6" />
             </button>

             <h2 className="text-3xl font-display font-black tracking-tight mb-4">
               {showMemberModal ? 'Novo Colaborador' : 'Registar Nova Instituição'}
             </h2>
             <p className="text-slate-500 mb-10 font-medium leading-relaxed">
               {showMemberModal 
                 ? 'Adicione um novo membro à equipe interna ou convide um especialista externo.' 
                 : 'Estabeleça uma nova parceria para consulta e integração de dados geográficos.'}
             </p>

             <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); setShowMemberModal(false); setShowInstModal(false); }}>
               {showMemberModal ? (
                 <>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Nome Completo</label>
                       <input type="text" className="w-full px-6 py-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 font-medium transition-all" required />
                     </div>
                     <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Tipo de ACESSO</label>
                       <select className="w-full px-6 py-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 font-medium transition-all">
                         <option>Interno (DSGC - Completo)</option>
                         <option>Externo (Consulta Apenas)</option>
                       </select>
                     </div>
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Instituição</label>
                      <select className="w-full px-6 py-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 font-medium transition-all">
                        {INITIAL_INSTITUTIONS.map(i => <option key={i.id}>{i.name}</option>)}
                      </select>
                   </div>
                 </>
               ) : (
                 <>
                   <div className="space-y-2">
                     <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Nome da Instituição</label>
                     <input type="text" className="w-full px-6 py-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 font-medium transition-all" required />
                   </div>
                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Tipo Legal</label>
                        <select className="w-full px-6 py-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 font-medium transition-all">
                          <option>Governamental</option>
                          <option>Municipal</option>
                          <option>Privada</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Nível de Integração</label>
                        <select className="w-full px-6 py-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 font-medium transition-all">
                          <option>Consulta de Títulos</option>
                          <option>Validação de NIF</option>
                          <option>Notariado Digital</option>
                        </select>
                      </div>
                   </div>
                 </>
               )}

               <button type="submit" className="w-full py-5 premium-gradient text-white rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl shadow-emerald-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all mt-10">
                 {showMemberModal ? 'Confirmar Registo Colaborador' : 'Registar Parceria'}
               </button>
             </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
