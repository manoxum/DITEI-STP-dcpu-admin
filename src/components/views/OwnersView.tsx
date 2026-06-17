import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
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

  const filteredOwners = OWNERS_DATA.filter(owner => 
    owner.name.toLowerCase().includes(search.toLowerCase()) ||
    owner.id.toLowerCase().includes(search.toLowerCase()) ||
    owner.nif.includes(search)
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold tracking-tight">Titulares de Terras</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Gestão de pessoas físicas e jurídicas com direitos territoriais.</p>
        </div>
        <button className="premium-gradient text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-emerald-500/20 hover:scale-105 transition-all">
          <UserPlus className="w-5 h-5" /> Novo Titular
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 bg-white dark:bg-slate-900/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Pesquisar por nome, NIF ou ID..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-semibold hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors">
            <Filter className="w-4 h-4" /> Filtros
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-semibold hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors">
            <Download className="w-4 h-4" /> Exportar
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
                <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">ID / Nome</th>
                <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">NIF</th>
                <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">Tipo</th>
                <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">Património</th>
                <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">Status</th>
                <th className="px-6 py-4 text-right text-[10px] font-black uppercase tracking-widest text-slate-400">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredOwners.map((owner) => (
                <tr 
                  key={owner.id} 
                  onClick={() => navigate(`/owners/${owner.id}`)}
                  className="hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors group cursor-pointer"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                        <User className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-bold text-sm leading-none mb-1">{owner.name}</p>
                        <p className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">{owner.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-mono text-slate-500">{owner.nif}</td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-[10px] font-black uppercase tracking-widest text-slate-500">
                      {owner.type}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5 font-bold text-sm">
                      <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                      {owner.assets} {owner.assets === 1 ? 'Propriedade' : 'Propriedades'}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className={cn(
                      "inline-flex items-center gap-1.5 px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest",
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
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                         onClick={(e) => { e.stopPropagation(); navigate(`/owners/${owner.id}`); }}
                        className="p-2 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg text-blue-600 transition-colors"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                      <button 
                        onClick={(e) => e.stopPropagation()}
                        className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-400">
                        <MoreVertical className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
