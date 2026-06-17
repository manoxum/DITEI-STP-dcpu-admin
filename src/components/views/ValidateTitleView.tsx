import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle2, XCircle, ShieldCheck, FileText, Download, Building2, MapPin } from 'lucide-react';

export function ValidateTitleView() {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    // Simulating API call to validate title
    const timer = setTimeout(() => {
      const db = JSON.parse(localStorage.getItem('STP_TITLES_DB') || '{}');
      if (id && db[id] && db[id].status === 'issued') {
        setData(db[id]);
      }
      setLoading(false);
    }, 1200);

    return () => clearTimeout(timer);
  }, [id]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center py-12 px-4 sm:px-6">
      <div className="mb-10 text-center">
        <div className="flex justify-center items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-emerald-600 rounded-xl flex items-center justify-center">
            <ShieldCheck className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-3xl font-display font-black text-slate-800 dark:text-white tracking-tight">SINC<span className="text-emerald-600">.</span></h1>
        </div>
        <h2 className="text-lg font-bold text-slate-600 dark:text-slate-400">Verificação de Autenticidade Cadastral</h2>
      </div>

      <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        {loading ? (
          <div className="p-16 flex flex-col items-center justify-center">
            <div className="w-12 h-12 border-4 border-slate-200 border-t-emerald-500 rounded-full animate-spin mb-6"></div>
            <p className="text-emerald-600 font-bold uppercase tracking-widest text-sm">A Validar Documento...</p>
          </div>
        ) : data ? (
          <div>
            <div className="bg-emerald-500/10 p-8 text-center border-b border-emerald-500/10">
              <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-500/30">
                <CheckCircle2 className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mb-2">Título Autêntico e Válido</h3>
              <p className="text-emerald-700/80 dark:text-emerald-500/80 font-medium">Este documento emitido pelo DSGC foi verificado criptograficamente e encontra-se ativo.</p>
            </div>

            <div className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">N.º do Título</p>
                  <p className="text-lg font-mono font-black text-slate-800 dark:text-white px-3 py-1.5 bg-slate-50 dark:bg-slate-800/50 rounded-lg inline-block">{data.id}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Data de Emissão</p>
                  <p className="text-lg font-bold text-slate-800 dark:text-white">{data.issueDate}</p>
                </div>
              </div>

              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Titular(es)</p>
                <div className="flex items-center gap-3 mt-2">
                  <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5 text-blue-500" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-800 dark:text-white">{data.owner}</p>
                    <p className="text-sm text-slate-500 font-mono">NIF: {data.nif}</p>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Localização e Propriedade</p>
                <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl space-y-3 mt-2">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
                    <p className="font-medium text-slate-700 dark:text-slate-300">{data.location}</p>
                  </div>
                  <div className="flex gap-6 pt-3 border-t border-slate-200 dark:border-slate-700">
                    <div>
                      <p className="text-xs text-slate-500 mb-0.5">Área</p>
                      <p className="font-bold text-slate-800 dark:text-white">{data.area}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 mb-0.5">Uso</p>
                      <p className="font-bold text-slate-800 dark:text-white">{data.type}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 p-6 flex justify-between items-center text-sm text-slate-500">
               <span>Ministério das Infraestruturas e Recursos Naturais</span>
               <span className="font-mono bg-slate-200 dark:bg-slate-800 px-2 py-1 rounded">DSGC-AO</span>
            </div>
          </div>
        ) : (
          <div className="p-16 text-center">
            <div className="w-20 h-20 bg-rose-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <XCircle className="w-10 h-10 text-rose-500" />
            </div>
            <h3 className="text-2xl font-black text-slate-800 dark:text-white mb-3">Título Não Encontrado</h3>
            <p className="text-slate-500 mb-8 max-w-sm mx-auto">Não foi possível validar este título. O número pode estar incorreto, ter sido revogado ou não ter sido ainda emitido oficialmente.</p>
            <Link to="/" className="inline-flex items-center gap-2 px-6 py-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-white font-bold rounded-xl transition-colors">
              Voltar ao Início
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
