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
  Briefcase
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
  const [showMemberModal, setShowMemberModal] = useState(false);
  const [showInstModal, setShowInstModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="space-y-10 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-display font-black tracking-tighter">Gestão de Colaboradores</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">Controlo de acessos internos e cooperação inter-institucional.</p>
        </div>
        
        <div className="flex w-full md:w-auto bg-slate-100 dark:bg-slate-900 p-1.5 rounded-2xl gap-1">
          <button 
            onClick={() => setActiveTab('staff')}
            className={cn(
              "flex-1 md:flex-none px-4 sm:px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all",
              activeTab === 'staff' ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm" : "text-slate-500 hover:text-slate-700"
            )}
          >
            Membros
          </button>
          <button 
            onClick={() => setActiveTab('institutions')}
            className={cn(
              "flex-1 md:flex-none px-4 sm:px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all",
              activeTab === 'institutions' ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm" : "text-slate-500 hover:text-slate-700"
            )}
          >
            Instituições
          </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="relative group flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
          <input 
            type="text" 
            placeholder={activeTab === 'staff' ? "Pesquisar membros..." : "Pesquisar instituições..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 font-medium transition-all"
          />
        </div>
        
        <button 
          onClick={() => activeTab === 'staff' ? setShowMemberModal(true) : setShowInstModal(true)}
          className="w-full md:w-auto px-6 sm:px-8 py-4 premium-gradient text-white font-black tracking-widest uppercase text-xs rounded-2xl shadow-xl shadow-emerald-500/20 hover:scale-105 transition-all flex items-center justify-center gap-3"
        >
          {activeTab === 'staff' ? (
            <><UserPlus className="w-4 h-4" /> Novo Colaborador</>
          ) : (
            <><Landmark className="w-4 h-4" /> Registar Instituição</>
          )}
        </button>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'staff' ? (
          <motion.div 
            key="staff-grid"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
          >
            {INITIAL_STAFF.map((member) => (
              <div key={member.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-[2.5rem] shadow-sm hover:shadow-xl hover:border-emerald-500/30 transition-all duration-500 group">
                <div className="flex justify-between items-start mb-6">
                  <div className={cn(
                    "w-14 h-14 rounded-2xl flex items-center justify-center transition-colors duration-500",
                    member.type === 'internal' ? "bg-emerald-500/10 text-emerald-500" : "bg-blue-500/10 text-blue-500"
                  )}>
                    <Users className="w-8 h-8" />
                  </div>
                  <div className={cn(
                    "px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest",
                    member.type === 'internal' ? "bg-emerald-500 text-white" : "bg-blue-500 text-white"
                  )}>
                    {member.type}
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="text-xl font-display font-black tracking-tight leading-tight mb-1">{member.name}</h3>
                  <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">{member.role}</p>
                </div>

                <div className="space-y-3 mb-8">
                  <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400">
                    <Building2 className="w-4 h-4" />
                    <span className="text-xs font-medium">{member.institution}</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400 text-xs">
                    <Mail className="w-4 h-4" />
                    <span className="truncate">{member.email}</span>
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-50 dark:border-slate-800 flex items-center justify-between">
                   <div className="flex items-center gap-2">
                     <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                     <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Ativo</span>
                   </div>
                   <button className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-emerald-500 transition-colors">Gerir Acessos</button>
                </div>
              </div>
            ))}
          </motion.div>
        ) : (
          <motion.div 
            key="inst-list"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] shadow-sm overflow-hidden"
          >
             <div className="hidden md:block overflow-x-auto">
               <table className="w-full min-w-[720px]">
                 <thead>
                   <tr className="border-b border-slate-50 dark:border-slate-800">
                     <th className="px-8 py-6 text-left text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Instituição</th>
                     <th className="px-8 py-6 text-left text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Tipo</th>
                     <th className="px-8 py-6 text-left text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Utilizadores</th>
                     <th className="px-8 py-6 text-left text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Status</th>
                     <th className="px-8 py-6 text-right text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Ações</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                   {INITIAL_INSTITUTIONS.map((inst) => (
                     <tr key={inst.id} className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                       <td className="px-8 py-6">
                         <div className="flex items-center gap-4">
                           <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 group-hover:bg-emerald-500/10 group-hover:text-emerald-500 transition-all">
                             <Landmark className="w-5 h-5" />
                           </div>
                           <p className="font-bold tracking-tight text-slate-900 dark:text-white">{inst.name}</p>
                         </div>
                       </td>
                       <td className="px-8 py-6">
                         <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">{inst.type}</span>
                       </td>
                       <td className="px-8 py-6">
                         <div className="flex items-center gap-2">
                           <Users className="w-3.5 h-3.5 text-slate-400" />
                           <span className="text-sm font-bold">{inst.collaboratorsCount}</span>
                         </div>
                       </td>
                       <td className="px-8 py-6">
                          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 text-[10px] font-black uppercase tracking-widest">
                            <CheckCircle2 className="w-3 h-3" /> Ligação Ativa
                          </div>
                       </td>
                       <td className="px-8 py-6 text-right">
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
               {INITIAL_INSTITUTIONS.map((inst) => (
                 <div key={inst.id} className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/30 p-5">
                   <div className="flex items-start justify-between gap-4">
                     <div className="flex items-center gap-3 min-w-0">
                       <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 shrink-0">
                         <Landmark className="w-5 h-5" />
                       </div>
                       <div className="min-w-0">
                         <p className="font-bold tracking-tight text-slate-900 dark:text-white">{inst.name}</p>
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
