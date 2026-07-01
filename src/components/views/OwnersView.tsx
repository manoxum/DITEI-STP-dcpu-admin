import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User, 
  Search, 
  Filter, 
  Download, 
  MoreVertical, 
  Eye, 
  Briefcase, 
  MapPin, 
  FileText,
  UserPlus
} from 'lucide-react';
import { cn } from '../../lib/utils';

const OWNERS_DATA = [
  { id: 'OWN-101', name: 'António dos Santos', nif: '100234567', type: 'Física', assets: 2, status: 'Verificado', email: 'antonio.santo@email.st' },
  { id: 'OWN-102', name: 'Maria da Silva', nif: '100554321', type: 'Física', assets: 1, status: 'Pendente', email: 'maria.silva@email.st' },
  { id: 'OWN-103', name: 'Companhia de Investimento Lda', nif: '500887766', type: 'Jurídica', assets: 1, status: 'Verificado', email: 'contato@investimento.st' },
  { id: 'OWN-104', name: 'João Batista', nif: '100345678', type: 'Física', assets: 1, status: 'Suspenso', email: 'joao.batista@email.st' },
];

export function OwnersView() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'card' | 'list'>('card');
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

  const filteredOwners = OWNERS_DATA.filter(owner => 
    owner.name.toLowerCase().includes(search.toLowerCase()) ||
    owner.id.toLowerCase().includes(search.toLowerCase()) ||
    owner.nif.includes(search)
  );

  return (
    <div className="space-y-6 relative pb-20">
      {/* HEADER SECTION */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-display font-black tracking-tighter">Titulares de Terras</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium">Gestão de pessoas físicas e jurídicas com direitos territoriais.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3 shrink-0">
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
              onClick={() => setViewMode('list')}
              title="Visualização em Lista"
              className={cn("px-3.5 py-2.5 rounded-lg transition-all flex items-center gap-2 text-xs font-black uppercase tracking-wider", viewMode === 'list' ? "bg-white dark:bg-slate-700 shadow-sm text-emerald-600 dark:text-emerald-400" : "text-slate-400")}
            >
              <User className="w-4 h-4" />
              <span>Lista</span>
            </button>
          </div>
          <button className="premium-gradient text-white px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-emerald-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all">
            <UserPlus className="w-4 h-4" />
            Novo Titular
          </button>
        </div>
      </div>

      {/* SEARCH AND FILTERS BAR */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-3xl flex flex-wrap items-center justify-between gap-4 shadow-sm">
        <div className="relative flex-1 min-w-[300px]">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Pesquisar por nome, NIF ou ID..."
            className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-855 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500/50 transition-all font-medium"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button 
              onClick={() => setSearch('')}
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
            Resultados: {filteredOwners.length}
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
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Tipo de Entidade</label>
                <select className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 px-4 py-2.5 rounded-xl text-sm font-medium focus:outline-none focus:border-emerald-500">
                  <option value="">Todos os Tipos</option>
                  <option value="individual">Singular</option>
                  <option value="corporate">Empresa</option>
                  <option value="cooperative">Cooperativa</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Estado</label>
                <select className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 px-4 py-2.5 rounded-xl text-sm font-medium focus:outline-none focus:border-emerald-500">
                  <option value="">Qualquer Estado</option>
                  <option value="active">Activo</option>
                  <option value="inactive">Inactivo</option>
                  <option value="pending">Pendente Registo</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Data de Registo</label>
                <input type="date" className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 px-4 py-2.5 rounded-xl text-sm font-medium focus:outline-none focus:border-emerald-500" />
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

      <div>
        {viewMode === 'card' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            {filteredOwners.map((owner) => (
              <div
                key={owner.id}
                onClick={() => navigate(`/owners/${owner.id}`)}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-3xl shadow-sm hover:shadow-md hover:border-emerald-500/30 transition-all duration-300 group cursor-pointer flex flex-col justify-between"
              >
                <div className="flex flex-col">
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-blue-500/10 text-blue-500">
                      <User className="w-5 h-5" />
                    </div>
                    <div className={cn(
                      "px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider shrink-0",
                      owner.status === 'Verificado' ? "text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10" : 
                      owner.status === 'Pendente' ? "text-amber-600 bg-amber-50 dark:bg-amber-500/10" : "text-rose-600 bg-rose-50 dark:bg-rose-500/10"
                    )}>
                      {owner.status}
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white truncate">{owner.name}</h3>
                    <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest truncate">{owner.id} • NIF: {owner.nif}</p>
                  </div>
                </div>

                <div className="space-y-1.5 mb-4 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-700/30">
                  <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                    <Briefcase className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                    <span className="text-[11px] font-medium truncate">{owner.assets} {owner.assets === 1 ? 'Propriedade' : 'Propriedades'}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-auto">
                   <span className="px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-[9px] font-black uppercase tracking-widest text-slate-500">
                     {owner.type}
                   </span>
                   <button className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 hover:text-emerald-500 transition-colors bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 px-3 py-1.5 rounded-lg shadow-sm hover:bg-emerald-100 dark:hover:bg-emerald-500/20">
                     Abrir
                   </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 rounded-3xl overflow-hidden shadow-sm mt-4">
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-50 dark:bg-slate-950 border-b border-slate-100 dark:border-slate-850">
                  <tr>
                    <th className="pl-8 pr-4 py-4.5 font-bold text-xs uppercase tracking-wider text-slate-400">ID / Nome</th>
                    <th className="px-6 py-4.5 font-bold text-xs uppercase tracking-wider text-slate-400">NIF</th>
                    <th className="px-6 py-4.5 font-bold text-xs uppercase tracking-wider text-slate-400">Tipo</th>
                    <th className="px-6 py-4.5 font-bold text-xs uppercase tracking-wider text-slate-400">Património</th>
                    <th className="px-6 py-4.5 font-bold text-xs uppercase tracking-wider text-slate-400">Status</th>
                    <th className="pr-8 pl-4 py-4.5 text-right font-bold text-xs uppercase tracking-wider text-slate-400">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredOwners.map((owner) => (
                    <tr 
                      key={owner.id} 
                      onClick={() => navigate(`/owners/${owner.id}`)}
                      className="hover:bg-slate-50/80 dark:hover:bg-slate-950/60 transition-all cursor-pointer group"
                    >
                      <td className="pl-8 pr-4 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                            <User className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="font-bold text-sm tracking-tight text-slate-800 dark:text-slate-100">{owner.name}</p>
                            <p className="text-[10px] font-semibold text-slate-450 opacity-70 uppercase tracking-widest">{owner.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm font-mono text-slate-500">{owner.nif}</td>
                      <td className="px-6 py-4">
                        <span className="px-2.5 py-1 rounded inline-block bg-slate-100 dark:bg-slate-800 text-[10px] font-black uppercase tracking-wider text-slate-500">
                          {owner.type}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5 font-bold text-sm text-slate-600 dark:text-slate-300">
                          <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                          {owner.assets} {owner.assets === 1 ? 'Propriedade' : 'Propriedades'}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className={cn(
                          "inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-[10px] font-black uppercase tracking-wider",
                          owner.status === 'Verificado' ? "text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10" : 
                          owner.status === 'Pendente' ? "text-amber-600 bg-amber-50 dark:bg-amber-500/10" : "text-rose-600 bg-rose-50 dark:bg-rose-500/10"
                        )}>
                          <div className={cn(
                            "w-1.5 h-1.5 rounded-full", 
                            owner.status === 'Verificado' ? "bg-emerald-500" : 
                            owner.status === 'Pendente' ? "bg-amber-500" : "bg-rose-500"
                          )} />
                          {owner.status}
                        </div>
                      </td>
                      <td className="pr-8 pl-4 py-4 text-right">
                        <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                          <Eye className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="grid grid-cols-1 gap-4 p-4 md:hidden">
              {filteredOwners.map((owner) => (
                <div
                  key={owner.id}
                  onClick={() => navigate(`/owners/${owner.id}`)}
                  className="bg-slate-50/50 dark:bg-slate-950/25 p-5 rounded-2xl border border-slate-100/80 dark:border-slate-850 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between gap-4 group hover:bg-slate-50 dark:hover:bg-slate-950/40"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500 shrink-0">
                        <User className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-sm tracking-tight text-slate-800 dark:text-slate-100 truncate">{owner.name}</p>
                        <p className="text-[10px] font-semibold text-slate-450 uppercase tracking-widest mt-1">{owner.id}</p>
                      </div>
                    </div>
                    <div className={cn(
                      "inline-flex items-center gap-1.5 px-2 py-1 rounded text-[9px] font-black uppercase tracking-wider shrink-0",
                      owner.status === 'Verificado' ? "text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10" :
                      owner.status === 'Pendente' ? "text-amber-600 bg-amber-50 dark:bg-amber-500/10" : "text-rose-600 bg-rose-50 dark:bg-rose-500/10"
                    )}>
                      <div className={cn(
                        "w-1.5 h-1.5 rounded-full",
                        owner.status === 'Verificado' ? "bg-emerald-500" :
                        owner.status === 'Pendente' ? "bg-amber-500" : "bg-rose-500"
                      )} />
                      {owner.status}
                    </div>
                  </div>

                  <div className="mt-4 space-y-3 text-sm">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">NIF</span>
                      <span className="font-mono text-slate-500 text-xs">{owner.nif}</span>
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Tipo</span>
                      <span className="px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 text-[10px] font-black uppercase tracking-wider text-slate-500">
                        {owner.type}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Património</span>
                      <div className="flex items-center gap-1.5 font-bold text-sm text-slate-600 dark:text-slate-300">
                        <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                        {owner.assets} {owner.assets === 1 ? 'Propriedade' : 'Propriedades'}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
