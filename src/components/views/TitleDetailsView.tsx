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
  FileText, 
  FileDown,
  MoreVertical,
  ExternalLink,
  Share2,
  Trash2,
  AlertTriangle,
  Award,
  Clock,
  Building2,
  Check,
  FolderOpen
} from 'lucide-react';
import { cn } from '../../lib/utils';

// Mock data for a single title
const TITLE_DETAILS = {
  id: 'TIT-STP-2026-001',
  status: 'issued',
  issueDate: '15 Mai 2026',
  expiryDate: 'Permanente',
  utente: {
    name: 'António dos Santos',
    nif: '100234567',
    contact: '+239 990 1234',
    email: 'antonio.santo@email.st',
    address: 'Avenida Marginal, São Tomé'
  },
  parcel: {
    id: 'REC-2026-005',
    area: '1,200 m²',
    perimeter: '145 m',
    location: 'Pantufo, Água Grande',
    usage: 'Habitacional Consolidado',
    topography: 'Aprovada (Jun/2026)'
  },
  documents: [
    { id: 'DOC-001', name: 'Planta de Delimitação Georeferenciada', type: 'PDF', size: '2.4 MB', date: '08 Mai 2026', category: 'Technical' },
    { id: 'DOC-002', name: 'Certidão de Registo Predial (Cópia)', type: 'PDF', size: '1.1 MB', date: '12 Mai 2026', category: 'Legal' },
    { id: 'DOC-003', name: 'Comprovativo de Pagamento de Emolumentos', type: 'PNG', size: '450 KB', date: '10 Mai 2026', category: 'Financial' },
    { id: 'DOC-004', name: 'Termo de Anuência de Confrontantes', type: 'PDF', size: '1.8 MB', date: '07 Mai 2026', category: 'Legal' },
  ],
  history: [
    { event: 'Título Emitido', date: '2026-05-15 14:30', user: 'Admin DSGC', type: 'system' },
    { event: 'Aprovação Jurídica', date: '2026-05-12 10:15', user: 'Dário Évora', type: 'legal' },
    { event: 'Delimitação Concluída', date: '2026-05-08 16:45', user: 'Bernardo Cruz', type: 'field' },
    { event: 'Submissão de Processo', date: '2026-04-20 09:00', user: 'Portal do Cidadão', type: 'request' },
  ]
};

export function TitleDetailsView() {
  const { id } = useParams();
  const navigate = useNavigate();

  // In a real app, you would fetch by id
  const data = TITLE_DETAILS;

  return (
    <div className="space-y-10 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-4">
          <button 
            onClick={() => navigate('/titles')}
            className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-emerald-500 transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Voltar à Lista
          </button>
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 rounded-[1.5rem] premium-gradient flex items-center justify-center text-white shadow-xl shadow-emerald-500/20">
              <Award className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-4xl font-display font-black tracking-tighter">{data.id}</h1>
                <div className={cn(
                  "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
                  data.status === 'issued' ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" : "bg-amber-500/10 text-amber-600"
                )}>
                  {data.status === 'issued' ? 'Título Oficial' : 'Em Análise'}
                </div>
              </div>
              <p className="text-slate-500 dark:text-slate-400 font-medium">{data.utente.name} • Registado em {data.issueDate}</p>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-6 py-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-bold text-sm hover:bg-slate-50 transition-all shadow-sm">
            <Printer className="w-4 h-4" /> Imprimir Original
          </button>
          <button className="flex items-center gap-2 px-6 py-4 rounded-2xl premium-gradient text-white font-bold text-sm shadow-xl shadow-emerald-500/20 hover:scale-105 transition-all">
            <Download className="w-4 h-4" /> Exportar PDF
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Left Column - Details */}
        <div className="xl:col-span-2 space-y-8">
          
          {/* Main Info Card */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Utente Info */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-10 rounded-[2.5rem] shadow-sm">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                  <User className="w-6 h-6" />
                </div>
                <h3 className="font-display font-black text-xl tracking-tight">Informação do Titular</h3>
              </div>
              <div className="space-y-6 mb-8">
                {[
                  { label: 'Nome Completo', value: data.utente.name },
                  { label: 'NIF / Identificação', value: data.utente.nif },
                  { label: 'Contacto Direto', value: data.utente.contact },
                  { label: 'Endereço Fiscal', value: data.utente.address },
                ].map((item, i) => (
                  <div key={i} className="space-y-1">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 leading-none">{item.label}</p>
                    <p className="font-bold text-slate-900 dark:text-white">{item.value}</p>
                  </div>
                ))}
              </div>
              <button 
                onClick={() => navigate(`/owners/OWN-101`)}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-blue-50 dark:bg-blue-500/10 text-blue-600 font-bold text-xs hover:bg-blue-100 transition-all border border-blue-100 dark:border-blue-500/20"
              >
                <User className="w-4 h-4" /> Ver Ficha do Titular
              </button>
            </div>

            {/* Parcel Info */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-10 rounded-[2.5rem] shadow-sm">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                  <Maximize2 className="w-6 h-6" />
                </div>
                <h3 className="font-display font-black text-xl tracking-tight">Detalhes do Imóvel</h3>
              </div>
              <div className="space-y-6 mb-8">
                {[
                  { label: 'Área da Parcela', value: data.parcel.area },
                  { label: 'Perímetro Total', value: data.parcel.perimeter },
                  { label: 'Uso Predominante', value: data.parcel.usage },
                  { label: 'Localização Administrativa', value: data.parcel.location },
                ].map((item, i) => (
                  <div key={i} className="space-y-1">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 leading-none">{item.label}</p>
                    <p className="font-bold text-slate-900 dark:text-white">{item.value}</p>
                  </div>
                ))}
              </div>
              <button 
                onClick={() => navigate(`/records/${data.parcel.id}`)}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 font-bold text-xs hover:bg-emerald-100 transition-all border border-emerald-100 dark:border-emerald-500/20"
              >
                <FolderOpen className="w-4 h-4" /> Ver Histórico do Registo
              </button>
            </div>
          </div>

          {/* Map Preview */}
          <div className="bg-slate-950 rounded-[3rem] h-[500px] relative overflow-hidden group shadow-2xl">
             <div className="absolute inset-0 opacity-40 bg-[url('https://images.unsplash.com/photo-1541462608141-ad6b3eb16995?auto=format&fit=crop&q=80&w=2000')] bg-cover bg-center"></div>
             <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>
             
             <svg className="absolute inset-0 w-full h-full p-20" viewBox="0 0 1000 600">
                <path 
                  d="M 300 200 L 500 150 L 700 250 L 650 450 L 350 500 Z" 
                  fill="rgba(16, 185, 129, 0.2)" 
                  stroke="#10b981" 
                  strokeWidth="4"
                  strokeDasharray="12 8"
                  className="animate-[dash_20s_linear_infinite]"
                />
             </svg>

             <div className="absolute bottom-10 left-10 right-10 flex justify-between items-end">
                <div>
                   <p className="text-emerald-400 text-xs font-black uppercase tracking-[0.3em] mb-2">Visão por Satélite • DSGC GIS</p>
                   <h4 className="text-white text-2xl font-display font-black tracking-tight">{data.parcel.location}</h4>
                </div>
                <button className="p-5 rounded-2xl bg-white/10 backdrop-blur-md text-white border border-white/20 hover:bg-white/20 transition-all group">
                   <ExternalLink className="w-6 h-6 group-hover:scale-110 transition-transform" />
                </button>
             </div>
          </div>

          {/* Associated Documents Section */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-10 rounded-[2.5rem] shadow-sm">
            <div className="flex items-center justify-between mb-10">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500">
                  <FolderOpen className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-display font-black text-xl tracking-tight">Arquivo Digital</h3>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Instrumentos Legais Associados</p>
                </div>
              </div>
              <button className="px-5 py-2 rounded-xl border border-slate-100 dark:border-slate-800 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:bg-slate-50 transition-all">
                Digitalizar Novo
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.documents.map((doc) => (
                <div key={doc.id} className="group p-6 rounded-[2rem] bg-slate-50/50 dark:bg-slate-950/30 border border-slate-100 dark:border-slate-800/50 hover:border-emerald-500/20 hover:bg-white dark:hover:bg-slate-900 transition-all flex items-center justify-between">
                  <div className="flex items-center gap-5">
                    <div className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-800 flex items-center justify-center shadow-sm text-slate-400 group-hover:text-emerald-500 transition-colors">
                      <FileText className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white leading-tight mb-1">{doc.name}</p>
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500/60 bg-emerald-500/5 px-2 py-0.5 rounded-full">{doc.category}</span>
                        <span className="text-[10px] font-medium text-slate-400">{doc.date} • {doc.size}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="p-3 hover:bg-emerald-500/10 rounded-xl text-slate-400 hover:text-emerald-500 transition-all group/btn">
                      <FileDown className="w-5 h-5 group-hover/btn:scale-110 transition-transform" />
                    </button>
                    <button className="p-3 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all">
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column - Status & History */}
        <div className="space-y-8">
          {/* Official Seal / Signature Status */}
          <div className="bg-slate-900 dark:bg-black p-10 rounded-[2.5rem] text-white relative overflow-hidden shadow-2xl">
             <div className="relative z-10">
               <div className="w-16 h-16 bg-emerald-500/20 rounded-2xl flex items-center justify-center mb-8 border border-emerald-500/30">
                 <ShieldCheck className="w-8 h-8 text-emerald-400" />
               </div>
               <h3 className="font-display font-black text-2xl tracking-tight mb-4">Certificação Digital</h3>
               <p className="text-slate-400 text-sm font-medium leading-relaxed mb-10">
                 Este documento possui assinatura digital qualificada e está registado na rede segura do Estado Santomense.
               </p>
               <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Integridade</p>
                    <p className="text-xs font-bold">Documento Inviolável</p>
                  </div>
               </div>
             </div>
             <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-500/10 rounded-full blur-[80px] translate-y--20 translate-x-20"></div>
          </div>

          {/* Timeline / History */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-10 rounded-[2.5rem] shadow-sm">
            <h3 className="font-display font-black text-xl tracking-tight mb-8 flex items-center gap-3">
              <History className="w-5 h-5 text-slate-400" /> Histórico do Título
            </h3>
            <div className="space-y-8 relative before:absolute before:left-3.5 before:top-2 before:bottom-2 before:w-[1px] before:bg-slate-100 dark:before:bg-slate-800">
               {data.history.map((item, i) => (
                 <div key={i} className="relative pl-12">
                   <div className={cn(
                     "absolute left-0 top-1.5 w-7 h-7 rounded-full border-4 border-white dark:border-slate-900 z-10 flex items-center justify-center",
                     i === 0 ? "bg-emerald-500" : "bg-slate-200 dark:bg-slate-800"
                   )}>
                     {i === 0 && <Check className="w-3 h-3 text-white" />}
                   </div>
                   <div className="bg-slate-50/50 dark:bg-slate-950/30 p-5 rounded-2xl border border-slate-100 dark:border-slate-800/50">
                     <p className="text-xs font-bold text-slate-900 dark:text-white leading-tight mb-1">{item.event}</p>
                     <div className="flex items-center justify-between gap-2">
                       <p className="text-[10px] font-medium text-slate-400">{item.date}</p>
                       <p className="text-[10px] font-black uppercase tracking-widest text-emerald-500/60">{item.user}</p>
                     </div>
                   </div>
                 </div>
               ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-4">
             <button className="flex flex-col items-center justify-center p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 transition-all gap-3 group shadow-sm">
               <Share2 className="w-6 h-6 text-slate-400 group-hover:text-emerald-500 transition-colors" />
               <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Partilhar</span>
             </button>
             <button className="flex flex-col items-center justify-center p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-red-50 hover:border-red-100 transition-all gap-3 group shadow-sm">
               <AlertTriangle className="w-6 h-6 text-slate-400 group-hover:text-red-500 transition-colors" />
               <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Revogar</span>
             </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function CheckCircle2(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  )
}
