import { Search, Filter, Download, FileText, Eye, MoreVertical, CheckCircle2, History } from "lucide-react";
import { cn } from "../../lib/utils";

const RECORDS = [
  { id: 'TIT-2026-001', owner: 'Américo José da Silva', area: '150.20 m²', location: 'Lumbu-Lumbu, Água Grande', date: '2026-05-12', status: 'active' },
  { id: 'TIT-2026-002', owner: 'Maria Filomena Graça', area: '450.00 m²', location: 'Pantufo, Água Grande', date: '2026-05-15', status: 'active' },
  { id: 'TIT-2026-003', owner: 'Sociedade Agrícola Lda', area: '12,450.00 m²', location: 'Porto Alegre, Caué', date: '2026-05-20', status: 'archived' },
  { id: 'TIT-2026-004', owner: 'Carlos Alberto Lima', area: '200.00 m²', location: 'Madre Deus, Água Grande', date: '2026-06-01', status: 'active' },
  { id: 'TIT-2026-005', owner: 'Direção de Estradas', area: '5,000.00 m²', location: 'Cantagalo', date: '2026-06-05', status: 'active' },
];

export function RecordsView() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold tracking-tight">Registos e Títulos</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Consultar histórico e registos de títulos emitidos.</p>
        </div>
        <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 font-bold text-sm hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors">
          <Download className="w-4 h-4" />
          Exportar Base de Dados
        </button>
      </div>

      <div className="glass-card p-4 rounded-2xl flex flex-wrap items-center gap-4">
        <div className="relative flex-1 min-w-[300px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Pesquisar por Título, Proprietário ou Localização..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all"
          />
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 font-semibold text-sm">
            <Filter className="w-4 h-4" />
            Distrito
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 font-semibold text-sm">
             <History className="w-4 h-4" />
             Ano
          </button>
        </div>
      </div>

      <div className="glass-card rounded-2xl overflow-hidden shadow-xl">
        <table className="w-full text-left">
          <thead className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800">
            <tr>
              <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider text-slate-400">ID Título</th>
              <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider text-slate-400">Proprietário</th>
              <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider text-slate-400">Localização</th>
              <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider text-slate-400">Área</th>
              <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider text-slate-400">Estado</th>
              <th className="px-6 py-4"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {RECORDS.map((record, i) => (
              <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                      <FileText className="w-5 h-5 text-emerald-500" />
                    </div>
                    <div>
                      <p className="font-bold text-sm tracking-tight">{record.id}</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase">{record.date}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="font-semibold text-sm">{record.owner}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm font-medium text-slate-500">{record.location}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{record.area}</span>
                </td>
                <td className="px-6 py-4">
                  <span className={cn(
                    "px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                    record.status === 'active' ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400" : "bg-slate-100 text-slate-500 dark:bg-slate-800"
                  )}>
                    {record.status === 'active' ? 'Ativo' : 'Arquivado'}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button className="p-2 hover:bg-emerald-50 dark:hover:bg-emerald-950 rounded-lg text-emerald-600 transition-colors" title="Visualizar">
                      <Eye className="w-5 h-5" />
                    </button>
                    <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-400 transition-colors">
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
  );
}
