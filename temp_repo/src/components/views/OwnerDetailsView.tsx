import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  ArrowLeft, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Briefcase, 
  Award, 
  Archive, 
  ExternalLink, 
  ShieldCheck, 
  History, 
  FileText,
  Download,
  MoreVertical,
  CheckCircle2
} from 'lucide-react';
import { cn } from '../../lib/utils';

const OWNERS_MAP: Record<string, any> = {
  'OWN-101': {
    id: 'OWN-101',
    name: 'António dos Santos',
    nif: '100234567',
    type: 'Física',
    email: 'antonio.santo@email.st',
    phone: '+239 990 1234',
    address: 'Avenida Marginal, São Tomé',
    status: 'Verificado',
    titles: [
      { id: 'TIT-STP-2026-001', area: '1,200 m²', location: 'Pantufo, Água Grande', date: '15 Mai 2026', usage: 'Habitacional Consolidado', status: 'Oficial' },
      { id: 'TIT-STP-2026-005', area: '900 m²', location: 'Guadalupe, Lobata', date: '05 Mai 2026', usage: 'Misto', status: 'Oficial' }
    ],
    history: [
      { event: 'Atualização de Contacto', date: '2026-05-20 11:30', user: 'Admin DSGC' },
      { event: 'Validação de Identidade', date: '2026-05-15 09:15', user: 'Dário Évora' },
      { event: 'Criação de Perfil Digital', date: '2026-04-10 14:00', user: 'Portal Cidadão' },
    ]
  },
  'OWN-102': {
    id: 'OWN-102',
    name: 'Maria da Silva',
    nif: '100554321',
    type: 'Física',
    email: 'maria.silva@email.st',
    phone: '+239 991 5566',
    address: 'Trindade, Mé-Zóchi',
    status: 'Pendente',
    titles: [
      { id: 'TIT-STP-2026-002', area: '850 m²', location: 'Trindade, Mé-Zóchi', date: '12 Mai 2026', usage: 'Residencial', status: 'Pendente' }
    ],
    history: [
      { event: 'Envio de Comprovativos', date: '2026-05-12 10:00', user: 'Portal Cidadão' },
      { event: 'Criação de Perfil Digital', date: '2026-05-12 09:30', user: 'Portal Cidadão' },
    ]
  },
  'OWN-103': {
    id: 'OWN-103',
    name: 'Companhia de Investimento Lda',
    nif: '500887766',
    type: 'Jurídica',
    email: 'contato@investimento.st',
    phone: '+239 224 4455',
    address: 'Zona Industrial de Neves, Lembá',
    status: 'Verificado',
    titles: [
      { id: 'TIT-STP-2026-003', area: '15,000 m²', location: 'Neves, Lembá', date: '10 Mai 2026', usage: 'Comercial / Industrial', status: 'Em Análise' }
    ],
    history: [
      { event: 'Certificação Fiscal Aprovada', date: '2026-05-09 16:00', user: 'Ministério Finanças' },
      { event: 'Submissão de Documentos', date: '2026-05-05 11:20', user: 'Bernardo Cruz' },
    ]
  },
  'OWN-104': {
    id: 'OWN-104',
    name: 'João Batista',
    nif: '100345678',
    type: 'Física',
    email: 'joao.batista@email.st',
    phone: '+239 995 9988',
    address: 'Santana, Cantagalo',
    status: 'Suspenso',
    titles: [
      { id: 'TIT-STP-2026-004', area: '450 m²', location: 'Santana, Cantagalo', date: '08 Mai 2026', usage: 'Agrícolao', status: 'Revogado' }
    ],
    history: [
      { event: 'Título Revogado', date: '2026-06-01 09:00', user: 'Direção Geral' },
      { event: 'Detetada Duplicidade de Cadastro', date: '2026-05-28 14:15', user: 'Sistema GIS' },
    ]
  }
};

export function OwnerDetailsView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const data = (id && OWNERS_MAP[id]) ? OWNERS_MAP[id] : OWNERS_MAP['OWN-101'];

  return (
    <div className="space-y-10 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-4">
          <button 
            onClick={() => navigate('/owners')}
            className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-emerald-500 transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Voltar à Lista
          </button>
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 rounded-[1.5rem] bg-blue-500 flex items-center justify-center text-white shadow-xl shadow-blue-500/20">
              <User className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-4xl font-display font-black tracking-tighter">{data.name}</h1>
                <div className={cn(
                  "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
                  data.status === 'Verificado' ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" :
                  data.status === 'Pendente' ? "bg-amber-500/10 text-amber-600 dark:text-amber-400" : "bg-rose-500/10 text-rose-600 dark:text-rose-400"
                )}>
                  Status: {data.status}
                </div>
              </div>
              <p className="text-slate-500 dark:text-slate-400 font-medium">NIF: {data.nif} • {data.type}</p>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-6 py-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-bold text-sm hover:bg-slate-50 transition-all shadow-sm">
            Editar Perfil
          </button>
          <button className="flex items-center gap-2 px-6 py-4 rounded-2xl premium-gradient text-white font-bold text-sm shadow-xl shadow-emerald-500/20 hover:scale-105 transition-all">
            <Download className="w-4 h-4" /> Exportar Ficha
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 space-y-8">
          {/* Detailed Info Card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-10 rounded-[2.5rem] shadow-sm">
            <h3 className="font-display font-black text-xl tracking-tight mb-8">Informação de Contacto</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                { icon: Mail, label: 'Email', value: data.email },
                { icon: Phone, label: 'Telefone', value: data.phone },
                { icon: MapPin, label: 'Morada Principal', value: data.address },
                { icon: ShieldCheck, label: 'Verificação', value: 'Documentação Validada em 2026' },
              ].map((item, i) => (
                <div key={i} className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-950 flex items-center justify-center text-slate-400 shrink-0">
                    <item.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-0.5">{item.label}</p>
                    <p className="font-bold text-slate-900 dark:text-white">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Unified holdings section */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-10 rounded-[2.5rem] shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="font-display font-black text-xl tracking-tight">Património Territorial Associado</h3>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Imóveis registados em nome deste titular</p>
              </div>
              <Briefcase className="w-6 h-6 text-slate-400" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {data.titles.map((title) => (
                <div 
                  key={title.id}
                  onClick={() => navigate(`/titles/${title.id}`)}
                  className="p-6 rounded-[2rem] bg-slate-50/50 dark:bg-slate-950/30 border border-slate-100 dark:border-slate-800/50 hover:border-emerald-500/20 hover:bg-white dark:hover:bg-slate-900 transition-all cursor-pointer group flex flex-col justify-between min-h-[160px]"
                >
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                        <Award className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-bold text-sm tracking-tight text-slate-900 dark:text-white leading-none group-hover:text-emerald-500 transition-colors uppercase">{title.id}</p>
                        <p className="text-[10px] font-medium text-slate-400 uppercase tracking-widest mt-1">{title.date}</p>
                      </div>
                    </div>
                    <span className={cn(
                      "px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest leading-none",
                      title.status === 'Oficial' ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" : "bg-amber-500/10 text-amber-600"
                    )}>
                      {title.status}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 block">Localização & Tipo</span>
                    <p className="font-bold text-slate-900 dark:text-white text-sm leading-tight">{title.location}</p>
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400">{title.area} • Uso {title.usage}</p>
                  </div>

                  <div className="flex items-center justify-end border-t border-slate-100 dark:border-slate-850 pt-3 mt-4 text-[10px] font-black uppercase tracking-widest text-emerald-500 gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    Detalhes do Título <ExternalLink className="w-3.5 h-3.5" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Audit Log column */}
        <div className="space-y-8">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-10 rounded-[2.5rem] shadow-sm">
            <h3 className="font-display font-black text-xl tracking-tight mb-8">Atividade de Conta</h3>
            <div className="space-y-8 relative before:absolute before:left-3.5 before:top-2 before:bottom-2 before:w-[1px] before:bg-slate-100 dark:before:bg-slate-800">
               {data.history.map((h, i) => (
                 <div key={i} className="relative pl-12">
                   <div className="absolute left-0 top-1.5 w-7 h-7 rounded-full bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 flex items-center justify-center">
                     <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                   </div>
                   <div className="bg-slate-50/50 dark:bg-slate-950/30 p-5 rounded-2xl border border-slate-100 dark:border-slate-800/50">
                     <p className="text-xs font-bold text-slate-900 dark:text-white leading-tight mb-1">{h.event}</p>
                     <div className="flex items-center justify-between gap-2">
                       <p className="text-[10px] font-medium text-slate-400">{h.date}</p>
                       <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{h.user}</p>
                     </div>
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
