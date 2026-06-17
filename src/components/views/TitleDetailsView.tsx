import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import QRCode from 'react-qr-code';
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
  AlertTriangle,
  Award,
  Clock,
  Check,
  FolderOpen,
  XCircle,
  FileSignature,
  FileCheck2,
  Info
} from 'lucide-react';
import { cn } from '../../lib/utils';

// Unified simulation map for Titles with the requested 4 states:
// 1. Emitido (issued)
// 2. Pendente (pending)
// 3. Em Revisão (review)
// 4. Revogado (revoked)
const TITLES_MAP: Record<string, any> = {
  'TIT-STP-2026-001': {
    id: 'TIT-STP-2026-001',
    status: 'issued',
    issueDate: '15 Mai 2026',
    expiryDate: 'Permanente',
    ownerId: 'OWN-101',
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
      { id: 'DOC-003', name: 'Comprovativo de Emolumentos', type: 'PNG', size: '450 KB', date: '10 Mai 2026', category: 'Financial' }
    ],
    history: [
      { event: 'Título Emitido Oficialmente', date: '2026-05-15 14:30', user: 'Direção Geral DSGC', type: 'system', details: 'Assinatura digital qualificada aplicada com sucesso.' },
      { event: 'Aprovação Jurídica', date: '2026-05-12 10:15', user: 'Dário Évora (Jurista)', type: 'legal', details: 'Preenchimento de requisitos regulamentares de ocupação.' },
      { event: 'Levantamento de Campo Concluído', date: '2026-05-08 16:45', user: 'Bernardo Cruz (Técnico)', type: 'field', details: 'Delimitação por coordenadas GPS homologada.' }
    ]
  },
  'TIT-STP-2026-002': {
    id: 'TIT-STP-2026-002',
    status: 'pending',
    issueDate: 'Pendente de Assinatura',
    expiryDate: 'Sob Emissão',
    ownerId: 'OWN-102',
    utente: {
      name: 'Maria da Silva',
      nif: '100554321',
      contact: '+239 991 5566',
      email: 'maria.silva@email.st',
      address: 'Trindade, Mé-Zóchi'
    },
    parcel: {
      id: 'REC-2026-012',
      area: '850 m²',
      perimeter: '118 m',
      location: 'Trindade, Mé-Zóchi',
      usage: 'Residencial',
      topography: 'Aprovada (Mai/2026)'
    },
    documents: [
      { id: 'DOC-010', name: 'Delimitação por Coordenadas (Polígono)', type: 'PDF', size: '1.9 MB', date: '10 Mai 2026', category: 'Technical' },
      { id: 'DOC-011', name: 'BI e Passaporte Registado', type: 'PDF', size: '890 KB', date: '05 Mai 2026', category: 'Legal' }
    ],
    history: [
      { event: 'Processo Aguarda Validação de Assinatura', date: '2026-05-12 11:00', user: 'Secretaria DSGC', type: 'system', details: 'Todos os emolumentos pagos. Aguardando ato administrativo.' },
      { event: 'Conformidade Técnica Aprovada', date: '2026-05-11 14:20', user: 'Equipa de Geomática', type: 'field', details: 'Análise de não-sobreposição de parcelas validada com sucesso.' }
    ]
  },
  'TIT-STP-2026-003': {
    id: 'TIT-STP-2026-003',
    status: 'review',
    issueDate: 'Sob Auditoria Cadastral',
    expiryDate: 'Em Análise',
    ownerId: 'OWN-103',
    utente: {
      name: 'Companhia de Investimento Lda',
      nif: '500887766',
      contact: '+239 224 4455',
      email: 'contato@investimento.st',
      address: 'Zona Industrial de Neves, Lembá'
    },
    parcel: {
      id: 'REC-2026-022',
      area: '15,000 m²',
      perimeter: '520 m',
      location: 'Neves, Lembá',
      usage: 'Comercial / Industrial',
      topography: 'Requer Inspeção In-Loco'
    },
    documents: [
      { id: 'DOC-021', name: 'Plano Geral de Localização de Neves', type: 'PDF', size: '5.2 MB', date: '09 Mai 2026', category: 'Technical' },
      { id: 'DOC-022', name: 'Contrato de Parceria com Ministério de Fomento', type: 'PDF', size: '3.1 MB', date: '04 Mai 2026', category: 'Legal' }
    ],
    history: [
      { event: 'Revisão Técnica Iniciada', date: '2026-05-10 16:30', user: 'Bernardo Cruz (Técnico)', type: 'system', details: 'Verificação visual por sobrevoo detetou inconformidade ligeira no muro Norte.' },
      { event: 'Entrada de Processo Administrativo', date: '2026-05-04 09:12', user: 'Portal Governamental', type: 'request', details: 'Solicitação de concessão em regime industrial.' }
    ]
  },
  'TIT-STP-2026-004': {
    id: 'TIT-STP-2026-004',
    status: 'revoked',
    issueDate: '08 Mai 2026',
    expiryDate: 'REVOGADO (01 Jun 2026)',
    ownerId: 'OWN-104',
    utente: {
      name: 'João Batista',
      nif: '100345678',
      contact: '+239 995 9988',
      email: 'joao.batista@email.st',
      address: 'Santana, Cantagalo'
    },
    parcel: {
      id: 'REC-2026-041',
      area: '450 m²',
      perimeter: '88 m',
      location: 'Santana, Cantagalo',
      usage: 'Agrícola',
      topography: 'Cancelada'
    },
    documents: [
      { id: 'DOC-041', name: 'Planta de Delimitação Cancelada', type: 'PDF', size: '1.2 MB', date: '01 Mai 2026', category: 'Technical' },
      { id: 'DOC-042', name: 'Despacho de Revogação de Concessão', type: 'PDF', size: '920 KB', date: '01 Jun 2026', category: 'Legal' }
    ],
    history: [
      { event: 'Título Cancelado e Revogado', date: '2026-06-01 09:00', user: 'Direção Geral DSGC', type: 'system', details: 'Decreto Ministerial decretou sobreposição ilegal com Reserva Ecológica Marinha.' },
      { event: 'Auditoria de Fronteira Identificada', date: '2026-05-25 15:45', user: 'Comissão de Parques STP', type: 'legal', details: 'Parcela entra 40 metros adentro na área protegida de manguezais costeiros.' },
      { event: 'Título Emitido (Uso Comum)', date: '2026-05-08 11:30', user: 'Secretaria Geral', type: 'system', details: 'Emissão provisória anterior cancelada juridicamente nesta data.' }
    ]
  },
  'TIT-STP-2026-005': {
    id: 'TIT-STP-2026-005',
    status: 'issued',
    issueDate: '05 Mai 2026',
    expiryDate: 'Permanente',
    ownerId: 'OWN-101',
    utente: {
      name: 'António dos Santos',
      nif: '100234567',
      contact: '+239 990 1234',
      email: 'antonio.santo@email.st',
      address: 'Avenida Marginal, São Tomé'
    },
    parcel: {
      id: 'REC-2026-009',
      area: '900 m²',
      perimeter: '120 m',
      location: 'Guadalupe, Lobata',
      usage: 'Misto',
      topography: 'Aprovada (Mai/2026)'
    },
    documents: [
      { id: 'DOC-051', name: 'Desenho de Planta Aprovado', type: 'PDF', size: '1.4 MB', date: '02 Mai 2026', category: 'Technical' }
    ],
    history: [
      { event: 'Homologação Concluída', date: '2026-05-05 10:10', user: 'Direção Geral DSGC', type: 'system', details: 'Emitido a título integral de posse perpétua.' }
    ]
  }
};

export function TitleDetailsView() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [showPinModal, setShowPinModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [pinValue, setPinValue] = useState('');
  const [pinError, setPinError] = useState(false);
  const [isSigning, setIsSigning] = useState(false);

  // Load unified database from localStorage or fallback
  const [db, setDb] = useState<Record<string, any>>(() => {
    const cached = localStorage.getItem('STP_TITLES_DB');
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch (e) {}
    }
    return TITLES_MAP;
  });

  const currentId = id && db[id] ? id : 'TIT-STP-2026-001';
  const data = db[currentId];
  
  // URL for validation QR Code
  const validateUrl = `${window.location.origin}/validate/${currentId}`;

  const handleSignSubmit = () => {
    if (pinValue === '1234') { // Mock PIN
      setIsSigning(true);
      setPinError(false);
      setTimeout(() => {
        handleTransitionState('issued', 'Assinatura Eletrónica Concedida', 'O título foi validado e assinado digitalmente por autoridade delegada. Passagem para estado Ativo.');
        setIsSigning(false);
        setShowPinModal(false);
        setPinValue('');
        setShowSuccessModal(true);
      }, 1500);
    } else {
      setPinError(true);
      setPinValue('');
    }
  };

  // Handle dynamic local simulations & save to main DB copy
  const handleTransitionState = (newStatus: string, eventName: string, detailText: string) => {
    const updatedHistory = [
      {
        event: eventName,
        date: new Date().toISOString().substring(0, 16).replace('T', ' '),
        user: 'Administrador (Simulado)',
        type: 'system',
        details: detailText
      },
      ...data.history
    ];
    const updatedTitleObj = {
      ...data,
      status: newStatus,
      history: updatedHistory
    };
    const newDb = {
      ...db,
      [currentId]: updatedTitleObj
    };
    setDb(newDb);
    localStorage.setItem('STP_TITLES_DB', JSON.stringify(newDb));
  };

  // Resolve status-specific labels and styles
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'issued':
        return {
          label: 'Título Emitido (Oficial)',
          class: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20',
          gradient: 'from-emerald-500 to-teal-600',
          desc: 'Este título de propriedade é oficial, válido e possui integridade registada na infraestrutura cadastral nacional.'
        };
      case 'pending':
        return {
          label: 'Emissão Pendente de Assinatura',
          class: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20',
          gradient: 'from-amber-400 to-orange-500',
          desc: 'O processo técnico de delimitação georreferenciada concluiu com sucesso, aguardando validação legal e assinatura digital.'
        };
      case 'review':
        return {
          label: 'Sob Auditoria e Revisão',
          class: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20',
          gradient: 'from-blue-500 to-indigo-600',
          desc: 'A parcela e a documentação jurídica encontram-se em análise rigorosa pela equipa de fiscalização e conservação territorial.'
        };
      case 'revoked':
        return {
          label: 'Título Revogado / Cancelado',
          class: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20',
          gradient: 'from-rose-500 to-red-600',
          desc: 'Este instrumento perdeu eficácia legal. Certificação cancelada administrativamente por decisão governamental ou judicial.'
        };
      default:
        return {
          label: 'Estado Desconhecido',
          class: 'bg-slate-500/10 text-slate-500 border border-slate-500/20',
          gradient: 'from-slate-500 to-slate-600',
          desc: 'Sem dados suficientes sobre este estado.'
        };
    }
  };

  const statusConfig = getStatusConfig(data.status);

  return (
    <div className="space-y-10 pb-20">
      {/* Alert Header for Critical States */}
      {data.status === 'revoked' && (
        <div className="p-6 rounded-3xl bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/30 flex items-start gap-4">
          <AlertTriangle className="w-8 h-8 text-rose-500 shrink-0 mt-0.5 animate-bounce" />
          <div>
            <h3 className="font-display font-black text-rose-850 dark:text-rose-400 text-lg leading-tight uppercase tracking-tight">Instrumento Sem Valor Legal</h3>
            <p className="text-sm font-medium text-rose-700 dark:text-rose-400/80 mt-1 leading-relaxed">
              Conselho de Estado determinou o cancelamento em <strong>01 de Junho de 2026</strong>. Todo e qualquer ato de transação, hipoteca ou arrendamento sobre esta área com base neste título é juridicamente nulo.
            </p>
          </div>
        </div>
      )}

      {data.status === 'pending' && (
        <div className="p-6 rounded-3xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/30 flex items-start gap-4">
          <Clock className="w-8 h-8 text-amber-500 shrink-0 mt-0.5" />
          <div className="flex-1 md:flex md:items-center md:justify-between gap-6">
            <div>
              <h3 className="font-display font-black text-amber-850 dark:text-amber-400 text-lg leading-tight uppercase tracking-tight">Aguardando Aval Administrativo</h3>
              <p className="text-sm font-medium text-amber-700 dark:text-amber-400/80 mt-1 leading-relaxed">
                As plantas geométricas foram verificadas. Para oficializar a posse e emitir o registo digital permanente, assine o documento.
              </p>
            </div>
            <button 
              onClick={() => setShowPinModal(true)}
              className="mt-3 md:mt-0 shrink-0 px-6 py-3 rounded-2xl bg-amber-500 text-white font-bold text-xs uppercase tracking-widest hover:bg-amber-600 transition-all shadow-lg shadow-amber-500/20 flex items-center gap-2"
            >
              <FileSignature className="w-4 h-4" /> Assinar e Emitir
            </button>
          </div>
        </div>
      )}

      {data.status === 'review' && (
        <div className="p-6 rounded-3xl bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/30 flex items-start gap-4">
          <Info className="w-8 h-8 text-blue-500 shrink-0 mt-0.5" />
          <div className="flex-1 md:flex md:items-center md:justify-between gap-6">
            <div>
              <h3 className="font-display font-black text-blue-850 dark:text-blue-400 text-lg leading-tight uppercase tracking-tight">Processo Sob Auditoria Especial</h3>
              <p className="text-sm font-medium text-blue-700 dark:text-blue-400/80 mt-1 leading-relaxed">
                A caraterística industrial e a área do polígono do terreno (<strong>{data.parcel.area}</strong>) impõem vistoria obrigatória contra interferências.
              </p>
            </div>
            <div className="flex gap-2 mt-3 md:mt-0 shrink-0">
              <button 
                onClick={() => handleTransitionState('pending', 'Auditoria Fiscalizada', 'Delimitações aceitáveis no terreno de Neves. Encaminhado para recolha de assinaturas.')}
                className="px-4 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-[11px] uppercase tracking-widest hover:bg-blue-700 transition-all shadow-md"
              >
                Homologar Delimitação
              </button>
              <button 
                onClick={() => handleTransitionState('revoked', 'Revisão Reprovada por Desconformidade', 'Sobreposição grave em vias públicas estruturantes detetada. Título considerado indefereível.')}
                className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-bold text-[11px] uppercase tracking-widest hover:bg-red-500 hover:text-white dark:hover:bg-red-500/20 transition-all"
              >
                Rejeitar Proposta
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header Info */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-4">
          <button 
            onClick={() => navigate('/titles')}
            className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-emerald-500 transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Voltar à Lista
          </button>
          <div className="flex items-center gap-6">
            <div className={cn(
              "w-16 h-16 rounded-[1.5rem] flex items-center justify-center text-white shadow-xl transition-all duration-500 bg-gradient-to-br",
              statusConfig.gradient
            )}>
              <Award className="w-8 h-8 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-4xl font-display font-black tracking-tighter">{data.id}</h1>
                <div className={cn("px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest leading-none", statusConfig.class)}>
                  {statusConfig.label}
                </div>
              </div>
              <p className="text-slate-500 dark:text-slate-400 font-medium">{data.utente.name} • Autuação: {data.issueDate}</p>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <button 
            disabled={data.status === 'revoked'}
            className="flex items-center gap-2 px-6 py-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-bold text-sm hover:bg-slate-50 dark:hover:bg-slate-950 transition-all shadow-sm disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Printer className="w-4 h-4" /> Imprimir Original
          </button>
          <button 
            disabled={data.status === 'revoked'}
            className={cn(
              "flex items-center gap-2 px-6 py-4 rounded-2xl text-white font-bold text-sm transition-all shadow-xl disabled:opacity-40 disabled:cursor-not-allowed bg-gradient-to-r",
              statusConfig.gradient
            )}
          >
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
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-10 rounded-[2.5rem] shadow-sm flex flex-col justify-between">
              <div>
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
              </div>
              <button 
                onClick={() => navigate(`/owners/${data.ownerId}`)}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-blue-50 dark:bg-blue-500/10 text-blue-600 font-bold text-xs hover:bg-blue-100 transition-all border border-blue-100 dark:border-blue-500/20"
              >
                <User className="w-4 h-4" /> Ver Ficha do Titular
              </button>
            </div>

            {/* Parcel Info */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-10 rounded-[2.5rem] shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                    <Maximize2 className="w-6 h-6" />
                  </div>
                  <h3 className="font-display font-black text-xl tracking-tight">Detalhes do Imóvel</h3>
                </div>
                <div className="space-y-6">
                  {[
                    { label: 'Identificador Cadastral', value: data.parcel.id },
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
              </div>
            </div>
          </div>

          {/* Map Preview */}
          <div className="bg-slate-900 dark:bg-slate-950 rounded-[3rem] h-[450px] relative overflow-hidden group shadow-2xl">
             <div className="absolute inset-0 opacity-40 bg-[url('https://images.unsplash.com/photo-1541462608141-ad6b3eb16995?auto=format&fit=crop&q=80&w=2000')] bg-cover bg-center"></div>
             <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>
             
             {data.status !== 'revoked' ? (
               <svg className="absolute inset-0 w-full h-full p-20" viewBox="0 0 1000 600">
                  <path 
                    d="M 300 200 L 500 150 L 700 250 L 650 450 L 350 500 Z" 
                    fill={data.status === 'review' ? "rgba(59, 130, 246, 0.2)" : "rgba(16, 185, 129, 0.2)"} 
                    stroke={data.status === 'review' ? "#3b82f6" : "#10b981"} 
                    strokeWidth="4"
                    strokeDasharray="12 8"
                    className="animate-[dash_20s_linear_infinite]"
                  />
               </svg>
             ) : (
               <div className="absolute inset-0 flex items-center justify-center">
                 <div className="w-[400px] h-[300px] border-4 border-dashed border-rose-500/55 rounded-[2rem] bg-rose-950/15 backdrop-blur-sm flex flex-col items-center justify-center p-8 text-center text-white">
                   <XCircle className="w-16 h-16 text-rose-500 mb-4 animate-bounce" />
                   <h4 className="font-display font-black text-lg uppercase tracking-wider">Georreferenciação Cancelada</h4>
                   <p className="text-xs text-slate-300 mt-2">Esta delimitação geométrica no SIG governamental foi dada de baixa do sistema e não consta como área aproveitada legítima.</p>
                 </div>
               </div>
             )}

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
              <button className="px-5 py-2 rounded-xl border border-slate-100 dark:border-slate-800 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-950 transition-all">
                Digitalizar Novo
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.documents.map((doc: any) => (
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
          
          {/* Status Box (Inviolabilidade ou Outras Ações Administrativas) */}
          {data.status === 'issued' ? (
            <div className="bg-white dark:bg-slate-900 border border-emerald-200 dark:border-slate-700 p-10 rounded-[2.5rem] relative overflow-hidden shadow-sm flex flex-col items-center text-center">
               <div className="relative z-10 w-full flex flex-col items-center">
                 <div className="w-16 h-16 bg-emerald-500/10 dark:bg-emerald-500/20 rounded-2xl flex items-center justify-center mb-6 border border-emerald-500/20 dark:border-emerald-500/30">
                   <ShieldCheck className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
                 </div>
                 <h3 className="font-display font-black text-2xl tracking-tight mb-4 text-slate-900 dark:text-white">Certificação Digital Ativa</h3>
                 <p className="text-slate-500 dark:text-slate-400 text-sm font-medium leading-relaxed mb-8">
                   Este documento possui assinatura eletrónica criptográfica qualificada e está homologado na rede oficial do Estado Santomense.
                 </p>
                 
                 <div className="bg-white p-4 rounded-3xl shadow-xl shadow-emerald-500/10 border border-slate-100 dark:border-slate-800 mb-8 w-48 h-48 flex items-center justify-center relative group overflow-hidden">
                    <QRCode
                      value={validateUrl}
                      size={160}
                      className="opacity-90 transition-opacity group-hover:opacity-100"
                      viewBox={`0 0 256 256`}
                    />
                    <div className="absolute inset-0 bg-emerald-900/0 group-hover:bg-emerald-900/5 transition-colors pointer-events-none rounded-3xl"></div>
                 </div>

                 <div className="w-full flex items-center justify-center gap-4 p-4 rounded-2xl bg-emerald-50 dark:bg-white/5 border border-emerald-100 dark:border-white/10">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/20 flex items-center justify-center shrink-0">
                      <Check className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div className="text-left">
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Documento Válido</p>
                      <p className="text-xs font-bold text-slate-900 dark:text-white">QR Code Autenticado</p>
                    </div>
                 </div>
               </div>
               <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-500/10 rounded-full blur-[80px] translate-y-[-50px] translate-x-[50px]"></div>
            </div>
          ) : data.status === 'revoked' ? (
            <div className="bg-rose-950/20 dark:bg-rose-950/10 p-10 rounded-[2.5rem] border border-rose-200/40 dark:border-rose-900/40 relative overflow-hidden">
               <div className="relative z-10">
                 <div className="w-16 h-16 bg-rose-500/10 rounded-2xl flex items-center justify-center mb-8 border border-rose-500/20">
                   <XCircle className="w-8 h-8 text-rose-500" />
                 </div>
                 <h3 className="font-display font-black text-2xl tracking-tight text-rose-600 dark:text-rose-450 mb-3 uppercase leading-none">Registo Bloqueado</h3>
                 <p className="text-slate-500 dark:text-slate-400 text-xs font-medium leading-relaxed mb-8">
                   Identidade ou direito real cessado. Os dados históricos continuam retidos nos servidores centrais para efeitos de auditoria do Ministério das Obras Públicas, Infraestruturas, Recursos Naturais e Ambiente.
                 </p>
                 <div className="p-4 rounded-2xl bg-rose-500/5 border border-rose-500/10 flex items-center gap-3">
                   <AlertTriangle className="w-5 h-5 text-rose-500 shrink-0" />
                   <p className="text-[10px] font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider">Acesso Fiduciário Cessado</p>
                 </div>
               </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-slate-950 border border-blue-200 dark:border-slate-800 p-10 rounded-[2.5rem] relative overflow-hidden shadow-sm">
               <div className="relative z-10">
                 <div className="w-16 h-16 bg-blue-500/10 dark:bg-blue-500/20 rounded-2xl flex items-center justify-center mb-8 border border-blue-500/20 dark:border-blue-500/30">
                   <Clock className="w-8 h-8 text-blue-500 dark:text-blue-400" />
                 </div>
                 <h3 className="font-display font-black text-2xl tracking-tight mb-4 text-slate-900 dark:text-white">Etapa de Fiscalização</h3>
                 <p className="text-slate-500 dark:text-slate-400 text-sm font-medium leading-relaxed mb-10">
                   Requerimento em processamento. Sujeito às normas legais santomenses aplicáveis à concessão territorial.
                 </p>
                 <div className="space-y-3">
                    <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10">
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                      <p className="text-xs font-bold text-slate-800 dark:text-white">Levantamento SIG Terminado</p>
                    </div>
                    <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 opacity-60">
                      <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                      <p className="text-xs font-bold text-slate-800 dark:text-white">Aguardando Aval da Conservatória</p>
                    </div>
                 </div>
               </div>
            </div>
          )}

          {/* Timeline / History */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-10 rounded-[2.5rem] shadow-sm">
            <h3 className="font-display font-black text-xl tracking-tight mb-8 flex items-center gap-3">
              <History className="w-5 h-5 text-slate-400" /> Histórico Operacional
            </h3>
            <div className="space-y-8 relative before:absolute before:left-3.5 before:top-2 before:bottom-2 before:w-[1px] before:bg-slate-100 dark:before:bg-slate-800">
               {data.history.map((item: any, i: number) => (
                 <div key={i} className="relative pl-12">
                   <div className={cn(
                     "absolute left-0 top-1.5 w-7 h-7 rounded-full border-4 border-white dark:border-slate-900 z-10 flex items-center justify-center",
                     i === 0 
                       ? data.status === 'revoked' ? "bg-rose-500" : data.status === 'pending' ? "bg-amber-500" : "bg-emerald-500"
                       : "bg-slate-200 dark:bg-slate-800"
                   )}>
                     {i === 0 && <Check className="w-3 h-3 text-white" />}
                   </div>
                   <div className="bg-slate-50/50 dark:bg-slate-950/30 p-5 rounded-2xl border border-slate-100 dark:border-slate-800/50">
                     <p className="text-xs font-bold text-slate-900 dark:text-white leading-tight mb-1">{item.event}</p>
                     <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight mb-2">{item.details}</p>
                     <div className="flex items-center justify-between gap-2 border-t border-slate-100 dark:border-slate-800/60 pt-2 mt-2">
                       <p className="text-[10px] font-medium text-slate-400">{item.date}</p>
                       <p className="text-[10px] font-black uppercase tracking-widest text-slate-450">{item.user}</p>
                     </div>
                   </div>
                 </div>
               ))}
            </div>
          </div>

          {/* Quick Actions / Simulations */}
          <div className="space-y-4">
             <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 px-1">Simular Outros Estágios (Para Demo)</div>
             <div className="grid grid-cols-2 gap-3">
               <button 
                 onClick={() => handleTransitionState('issued', 'Revisão Oficial Deferida', 'O título passou com distinção em auditoria e foi decretado Ativo.')}
                 className="px-4 py-3 text-[10px] font-black uppercase tracking-widest rounded-2xl border border-emerald-100 dark:border-emerald-500/20 bg-emerald-50/10 text-emerald-600 hover:bg-emerald-500 hover:text-white transition-all text-center"
               >
                 Tornar Oficial
               </button>
               <button 
                 onClick={() => handleTransitionState('review', 'Revisão Solicitada', 'Processo marcado para vistoria e retificação georeferencial.')}
                 className="px-4 py-3 text-[10px] font-black uppercase tracking-widest rounded-2xl border border-blue-100 dark:border-blue-500/20 bg-blue-50/10 text-blue-600 hover:bg-blue-500 hover:text-white transition-all text-center"
               >
                 Marcar Revisão
               </button>
               <button 
                 onClick={() => handleTransitionState('pending', 'Aguarda Homologação', 'Título em fase final esperando ação de autoridade assinante.')}
                 className="px-4 py-3 text-[10px] font-black uppercase tracking-widest rounded-2xl border border-amber-100 dark:border-amber-500/20 bg-amber-50/10 text-amber-600 hover:bg-amber-500 hover:text-white transition-all text-center"
               >
                 Pendente
               </button>
               <button 
                 onClick={() => handleTransitionState('revoked', 'Título Revogado Provisoriamente', 'Decretada suspensão do título para auditoria especial urgente.')}
                 className="px-4 py-3 text-[10px] font-black uppercase tracking-widest rounded-2xl border border-rose-100 dark:border-rose-500/20 bg-rose-50/10 text-rose-600 hover:bg-rose-500 hover:text-white transition-all text-center"
               >
                 Revogar Título
               </button>
             </div>
          </div>

        </div>
      </div>

      {/* PIN Verification Modal */}
      {showPinModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            onClick={() => !isSigning && setShowPinModal(false)}
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="relative w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-2xl border border-slate-200 dark:border-slate-800"
          >
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-amber-100 dark:bg-amber-900/30 rounded-2xl flex items-center justify-center mb-6">
                <ShieldCheck className="w-8 h-8 text-amber-600 dark:text-amber-400" />
              </div>
              <h3 className="text-xl font-display font-black text-slate-800 dark:text-white mb-2">Assinatura Digital</h3>
              <p className="text-sm font-medium text-slate-500 mb-8">
                Insira o seu PIN de 4 dígitos para assinar e emitir oficialmente este título de propriedade.
              </p>

              <div className="w-full space-y-4">
                <div>
                  <input
                    type="password"
                    maxLength={4}
                    value={pinValue}
                    onChange={(e) => {
                      setPinValue(e.target.value.replace(/\D/g, ''));
                      setPinError(false);
                    }}
                    placeholder="••••"
                    className={cn(
                      "w-2/3 mx-auto block text-center text-3xl tracking-[0.5em] font-black font-mono py-4 rounded-xl border bg-slate-50 dark:bg-slate-950 focus:outline-none focus:ring-4 transition-all",
                      pinError 
                        ? "border-rose-500 focus:ring-rose-500/20 text-rose-600" 
                        : "border-slate-200 dark:border-slate-800 focus:border-amber-500 focus:ring-amber-500/20 text-slate-800 dark:text-white"
                    )}
                  />
                  {pinError && (
                    <p className="text-xs font-bold text-rose-500 mt-2">PIN incorreto. Tente novamente.</p>
                  )}
                </div>

                <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-xl mt-4">
                  <div className="flex items-start gap-3">
                    <Info className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                    <p className="text-xs font-medium text-blue-700 dark:text-blue-400 text-left">
                      Para efeitos de demonstração, o <strong>PIN correto é 1234</strong>.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => {
                      setShowPinModal(false);
                      setPinValue('');
                      setPinError(false);
                    }}
                    disabled={isSigning}
                    className="flex-1 py-3 px-4 rounded-xl font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleSignSubmit}
                    disabled={pinValue.length !== 4 || isSigning}
                    className="flex-1 py-3 px-4 rounded-xl font-bold bg-amber-500 hover:bg-amber-600 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2"
                  >
                    {isSigning ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        A Assinar...
                      </>
                    ) : (
                      'Confirmar'
                    )}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
            onClick={() => setShowSuccessModal(false)}
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-[2.5rem] p-10 shadow-2xl border border-emerald-200 dark:border-emerald-900/50 text-center overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-[80px] translate-y-[-100px] translate-x-[100px]"></div>
            
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-24 h-24 bg-emerald-500/10 dark:bg-emerald-500/20 rounded-full flex items-center justify-center mb-6 shadow-xl shadow-emerald-500/10 border border-emerald-500/20 relative">
                <Check className="w-12 h-12 text-emerald-600 dark:text-emerald-400 relative z-10" />
                <div className="absolute inset-0 border-[4px] border-emerald-500 border-dashed rounded-full animate-[spin_10s_linear_infinite] opacity-30"></div>
              </div>
              
              <h3 className="text-3xl font-display font-black text-slate-800 dark:text-white mb-3">Título Emitido!</h3>
              <p className="text-base font-medium text-emerald-700 dark:text-emerald-400 mb-8 max-w-[280px]">
                O Título de Propriedade foi assinado digitalmente e está agora ativo no Sistema Nacional.
              </p>

              <div className="bg-slate-50 dark:bg-slate-950 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 w-full mb-8 relative group">
                <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4">Código de Verificação QR</p>
                <div className="bg-white p-3 rounded-2xl w-32 h-32 mx-auto shadow-sm border border-slate-200 dark:border-slate-800 relative z-10 hover:scale-105 transition-transform cursor-pointer" onClick={() => window.open(validateUrl, '_blank')}>
                   <QRCode
                      value={validateUrl}
                      size={102}
                      className="opacity-90"
                      viewBox={`0 0 256 256`}
                    />
                </div>
                <p className="text-[10px] uppercase font-bold tracking-widest text-slate-500 mt-4">Clique para testar verificação</p>
              </div>

              <button
                onClick={() => setShowSuccessModal(false)}
                className="w-full py-4 rounded-2xl font-black uppercase tracking-widest bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/20 transition-all active:scale-[0.98]"
              >
                Concluir
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
