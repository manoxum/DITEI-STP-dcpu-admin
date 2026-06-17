import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  ArrowLeft, 
  Download, 
  Printer, 
  MapPin, 
  Calendar, 
  Maximize2, 
  User, 
  ShieldCheck, 
  History,
  Award, 
  FileText, 
  FileDown,
  MoreVertical,
  ExternalLink,
  Archive,
  Clock,
  Building2,
  Check,
  FolderOpen,
  Info
} from 'lucide-react';
import { cn } from '../../lib/utils';

const RECORD_DETAILS = {
  id: 'TIT-2026-001',
  owner: 'Américo José da Silva',
  area: '150.20 m²',
  location: 'Lumbu-Lumbu, Água Grande',
  date: '12 Mai 2026',
  status: 'active',
  type: 'Aforamento',
  nif: '100234567',
  ownerId: 'OWN-101',
  titleId: 'TIT-STP-2026-001',
  address: 'Rua das Flores, nº 12, São Tomé',
  perimeter: '55 m',
  usage: 'Habitacional',
  documents: [
    { id: 'REC-001', name: 'Título de Aforamento Original', type: 'PDF', size: '3.2 MB', date: '12 Mai 2026', category: 'Official' },
    { id: 'REC-002', name: 'Planta de Implantação', type: 'PDF', size: '1.5 MB', date: '10 Mai 2026', category: 'Technical' },
    { id: 'REC-003', name: 'BI do Requerente', type: 'PDF', size: '800 KB', date: '05 Mai 2026', category: 'Identity' },
  ],
  history: [
    { event: 'Conversão para Formato Digital', date: '12 Mai 2026 10:00', user: 'Maria Silveira', type: 'system' },
    { event: 'Aprovação de Área', date: '10 Mai 2026 15:30', user: 'Bernardo Cruz', type: 'technical' },
    { event: 'Entrada de Processo Físico', date: '01 Mai 2026 09:00', user: 'Secretaria DSGC', type: 'intake' },
  ]
};

export function RecordDetailsView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const data = RECORD_DETAILS; // Mock

  return (
    <div className="space-y-10 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-4">
          <button 
            onClick={() => navigate('/records')}
            className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-emerald-500 transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Voltar aos Registos
          </button>
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 rounded-[1.5rem] bg-slate-900 flex items-center justify-center text-white shadow-xl">
              <Archive className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-4xl font-display font-black tracking-tighter">{data.id}</h1>
                <div className={cn(
                  "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
                  data.status === 'active' ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" : "bg-slate-500/10 text-slate-600 dark:text-slate-400"
                )}>
                  {data.status === 'active' ? 'Registo Ativo' : 'Arquivado'}
                </div>
              </div>
              <p className="text-slate-500 dark:text-slate-400 font-medium">Histórico Consolidado • Digitalizado em {data.date}</p>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-6 py-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-bold text-sm hover:bg-slate-50 transition-all shadow-sm">
            <Printer className="w-4 h-4" /> Imprimir Ficha
          </button>
          <button className="flex items-center gap-2 px-6 py-4 rounded-2xl premium-gradient text-white font-bold text-sm shadow-xl shadow-emerald-500/20 hover:scale-105 transition-all">
            <Download className="w-4 h-4" /> Exportar Dados
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          
          {/* Information Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-[2.5rem] shadow-sm">
                <h3 className="font-display font-black text-xl tracking-tight mb-6 flex items-center gap-3">
                  <User className="w-5 h-5 text-blue-500" /> Identificação
               </h3>
               <div className="space-y-4 mb-8">
                  {[
                    { label: 'Proprietário', value: data.owner },
                    { label: 'NIF', value: data.nif },
                    { label: 'Morada de Registo', value: data.address },
                  ].map((item, i) => (
                    <div key={i}>
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1">{item.label}</span>
                      <p className="font-bold text-slate-900 dark:text-white">{item.value}</p>
                    </div>
                  ))}
               </div>
               <button 
                onClick={() => navigate(`/owners/${data.ownerId}`)}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-blue-50 dark:bg-blue-500/10 text-blue-600 font-bold text-xs hover:bg-blue-100 transition-all border border-blue-100 dark:border-blue-500/20"
               >
                 <User className="w-4 h-4" /> Ver Perfil do Titular
               </button>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-[2.5rem] shadow-sm">
                <h3 className="font-display font-black text-xl tracking-tight mb-6 flex items-center gap-3">
                  <Maximize2 className="w-5 h-5 text-emerald-500" /> Parcela Territorial
               </h3>
               <div className="space-y-4 mb-8">
                  {[
                    { label: 'Área Total', value: data.area },
                    { label: 'Uso Definido', value: data.usage },
                    { label: 'Localização', value: data.location },
                  ].map((item, i) => (
                    <div key={i}>
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1">{item.label}</span>
                      <p className="font-bold text-slate-900 dark:text-white">{item.value}</p>
                    </div>
                  ))}
               </div>
               <button 
                onClick={() => navigate(`/titles/${data.titleId}`)}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 font-bold text-xs hover:bg-emerald-100 transition-all border border-emerald-100 dark:border-emerald-500/20"
               >
                 <Award className="w-4 h-4" /> Ver Título de Propriedade
               </button>
            </div>
          </div>

          {/* Documents Section */}
          <div className="glass-card p-8 rounded-[2.5rem]">
            <div className="flex items-center justify-between mb-8">
              <h3 className="font-display font-black text-xl tracking-tight">Instrumentos de Suporte</h3>
              <FileText className="w-5 h-5 text-slate-400" />
            </div>
            <div className="space-y-3">
               {data.documents.map((doc) => (
                 <div key={doc.id} className="flex items-center justify-between p-4 rounded-2xl bg-white dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 hover:border-emerald-500/20 transition-all group">
                    <div className="flex items-center gap-4">
                       <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-black/20 flex items-center justify-center text-slate-400 group-hover:text-emerald-500 transition-colors">
                          <FileText className="w-5 h-5" />
                       </div>
                       <div>
                          <p className="font-bold text-sm">{doc.name}</p>
                          <p className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">{doc.category} • {doc.size}</p>
                       </div>
                    </div>
                    <button className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-emerald-500 hover:bg-emerald-500/10 transition-all">
                       <Download className="w-4 h-4" />
                    </button>
                 </div>
               ))}
            </div>
          </div>
        </div>

        <div className="space-y-8">
          {/* Summary Card */}
          <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden">
             <div className="relative z-10">
                <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mb-6 border border-white/20">
                   <Info className="w-6 h-6 text-emerald-400" />
                </div>
                <h3 className="text-xl font-display font-black tracking-tight mb-4">Natureza do Registo</h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-6">
                  Este registo é um asset histórico migrado para a base de dados digital SiGeT em conformidade com o Decreto-Lei nº 14/2026.
                </p>
                <div className="flex items-center gap-3 pt-6 border-t border-white/10">
                   <ShieldCheck className="w-5 h-5 text-emerald-500" />
                   <span className="text-xs font-black uppercase tracking-widest text-emerald-500">Autenticidade Validada</span>
                </div>
             </div>
             <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl opacity-50"></div>
          </div>

          {/* Activity Timeline */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-[2.5rem] shadow-sm">
             <h3 className="font-display font-black text-xl tracking-tight mb-8">Auditoria de Acessos</h3>
             <div className="space-y-6 relative before:absolute before:left-3 before:top-1 before:bottom-1 before:w-[1px] before:bg-slate-100 dark:before:bg-slate-800">
                {data.history.map((h, i) => (
                  <div key={i} className="relative pl-10">
                    <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 flex items-center justify-center">
                       <div className="w-1.5 h-1.5 rounded-full bg-slate-400"></div>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900 dark:text-white mb-0.5">{h.event}</p>
                      <p className="text-[10px] text-slate-400 font-medium">{h.date}</p>
                    </div>
                  </div>
                ))}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
