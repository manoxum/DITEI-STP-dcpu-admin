import { 
  BarChart3, 
  Files, 
  Map as MapIcon, 
  Users, 
  FileCheck, 
  ClipboardList, 
  Settings, 
  LogOut, 
  Home, 
  Briefcase,
  LayoutDashboard,
  Database,
  PieChart
} from "lucide-react";

export type AdminSection = 
  | 'login' 
  | 'home' 
  | 'dashboard' 
  | 'services' 
  | 'processes' 
  | 'delimitation' 
  | 'titles' 
  | 'records' 
  | 'staff' 
  | 'reports';

export interface NavItem {
  id: AdminSection;
  label: string;
  icon: any;
  description?: string;
}

export const NAV_ITEMS: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, description: 'Visão geral do estado do DSGC' },
  { id: 'services', label: 'Serviços', icon: Briefcase, description: 'Gestão de entrada de pedidos' },
  { id: 'processes', label: 'Processos', icon: ClipboardList, description: 'Fluxo de trabalho administrativo' },
  { id: 'delimitation', label: 'Revisão e Delimitação', icon: MapIcon, description: 'Aprovação de terrenos e levantamentos' },
  { id: 'titles', label: 'Títulos', icon: FileCheck, description: 'Análise e emissão de propriedade' },
  { id: 'records', label: 'Registos', icon: Database, description: 'Consulta de títulos emitidos' },
  { id: 'staff', label: 'Staff', icon: Users, description: 'Gestão de técnicos internos e externos' },
  { id: 'reports', label: 'Relatórios', icon: PieChart, description: 'Auditorias e métricas de desempenho' },
];

export interface Process {
  id: string;
  title: string;
  status: 'pending' | 'in_review' | 'approved' | 'rejected';
  applicant: string;
  date: string;
  category: string;
}

export interface TitleRecord {
  id: string;
  owner: string;
  location: string;
  area: string;
  issueDate: string;
  status: 'active' | 'archived';
}
