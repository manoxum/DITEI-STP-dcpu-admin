import React from 'react';
import { motion } from 'motion/react';
import {
  ArrowRight,
  Map,
  ShieldCheck,
  Database,
  Globe,
  Layers,
  Search,
  FileCheck,
  ChevronRight,
  Landmark
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '../../lib/utils';
import { ThemeToggle } from '../AdminLayout';

const FEATURES = [
  {
    icon: Map,
    title: "Cadastro Digital 2.0",
    description: "Digitalização completa das parcelas territoriais com precisão centimétrica e integração de ortofotogrametria.",
    color: "emerald"
  },
  {
    icon: ShieldCheck,
    title: "Segurança Jurídica",
    description: "Registo imutável de títulos de propriedade, garantindo a proteção dos direitos de posse e uso da terra.",
    color: "blue"
  },
  {
    icon: Database,
    title: "Big Data Territorial",
    description: "Centralização de dados geográficos para apoio à decisão governamental e planeamento urbano.",
    color: "purple"
  }
];

const UTILITIES = [
  { title: "Transpasse de Propriedade", icon: Layers },
  { title: "Legalização de Terrenos", icon: FileCheck },
  { title: "Análise Topográfica", icon: Globe },
  { title: "Pesquisa Histórica", icon: Search }
];

export function LandingView() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-200 dark:bg-slate-950 font-sans overflow-x-hidden transition-colors duration-500">
      {/* Navigation */}
      <nav className="fixed top-0 inset-x-0 flex flex-col gap-4 px-4 py-4 sm:h-24 sm:flex-row sm:items-center sm:justify-between sm:px-6 md:px-20 z-50 backdrop-blur-xl bg-slate-200/90 dark:bg-slate-950/70 border-b border-slate-300/60 dark:border-slate-800/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl premium-gradient p-0.5 shadow-lg shadow-emerald-500/20">
            <div className="w-full h-full rounded-[0.6rem] bg-white dark:bg-slate-900 flex items-center justify-center">
              <Map className="w-5 h-5 text-emerald-500" />
            </div>
          </div>
          <div>
            <span className="text-xl font-display font-black tracking-tighter text-slate-900 dark:text-white uppercase transition-colors">SiGeT</span>
            <span className="text-[10px] font-black text-emerald-600 block leading-none tracking-[0.2em] -mt-1 uppercase opacity-80">STP</span>
          </div>
        </div>
        <div className="flex w-full items-center justify-between gap-3 sm:w-auto sm:justify-end">
          <ThemeToggle compact />
          <button
            onClick={() => navigate('/login')}
            className="px-5 sm:px-6 py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-sm tracking-widest uppercase hover:scale-105 transition-all shadow-md"
          >
            Entrar
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative pt-44 sm:pt-40 pb-20 sm:pb-32 px-4 sm:px-6 md:px-20 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-emerald-500/5 dark:bg-emerald-500/[0.03] blur-[120px] -z-10 rounded-full"></div>
        <div className="absolute -bottom-20 -left-20 w-1/3 h-1/2 bg-blue-500/5 dark:bg-blue-500/[0.03] blur-[100px] -z-10 rounded-full"></div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -30 }} 
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h1 className="text-4xl sm:text-6xl md:text-8xl font-display font-black tracking-tighter text-slate-900 dark:text-white leading-[0.9] mb-6 sm:mb-8">
              O Futuro da <br/>
              <span className="premium-gradient-text">Terra em STP</span>
            </h1>
            <p className="text-base sm:text-xl text-slate-500 dark:text-slate-400 font-medium max-w-lg mb-8 sm:mb-10 leading-relaxed transition-colors">
              Sistema Integrado de Gestão de Terras (SiGeT-STP). Uma plataforma robusta para a modernização da DSGC, promovendo transparência e soberania digital.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={() => navigate('/login')}
                className="px-10 py-5 rounded-2xl premium-gradient text-white font-black tracking-widest uppercase text-sm shadow-2xl shadow-emerald-500/30 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3 group"
              >
                Começar agora <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="px-10 py-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-black tracking-widest uppercase text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-all shadow-sm">
                Saber Mais
              </button>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }} 
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="relative"
          >
            <div className="relative aspect-square max-w-sm sm:max-w-lg mx-auto">
              {/* Decorative Rings */}
              <div className="absolute inset-0 border-[40px] border-emerald-500/5 dark:border-emerald-500/[0.02] rounded-[4rem] animate-[spin_20s_linear_infinite]"></div>
              <div className="absolute inset-[10%] border-[2px] border-dashed border-slate-200 dark:border-slate-800 rounded-[3.5rem] animate-[spin_30s_linear_infinite_reverse]"></div>
              
              {/* Interactive Card Elements */}
              <motion.div 
                animate={{ y: [0, -20, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-10 -left-3 sm:-left-10 bg-white dark:bg-slate-900 p-4 sm:p-6 rounded-3xl shadow-2xl shadow-slate-900/10 dark:shadow-black border border-slate-100 dark:border-slate-800 z-10 w-36 sm:w-48 transition-colors duration-500"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-4 text-emerald-500">
                  <Globe className="w-5 h-5" />
                </div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Precisão GIS</p>
                <p className="text-lg font-black text-slate-900 dark:text-white">99.9% Digital</p>
              </motion.div>

              <motion.div 
                animate={{ y: [0, 20, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute bottom-12 -right-3 sm:bottom-20 sm:-right-10 bg-white dark:bg-slate-900 p-4 sm:p-6 rounded-3xl shadow-2xl shadow-slate-900/10 dark:shadow-black border border-slate-100 dark:border-slate-800 z-10 w-36 sm:w-48 transition-colors duration-500"
              >
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center mb-4 text-blue-500">
                  <Database className="w-5 h-5" />
                </div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Base de Dados</p>
                <p className="text-lg font-black text-slate-900 dark:text-white">Centralizada</p>
              </motion.div>

              {/* Main Image Illustration Container */}
              <div className="absolute inset-[20%] rounded-[3rem] bg-slate-200 dark:bg-slate-800 overflow-hidden shadow-2xl border-4 border-white dark:border-slate-900 transition-colors duration-500">
                 <img 
                   src="https://images.unsplash.com/photo-1541462608141-ad6b3eb16995?auto=format&fit=crop&q=80&w=800" 
                   className="w-full h-full object-cover opacity-60 dark:opacity-40"
                   alt="São Tomé Terrain"
                   referrerPolicy="no-referrer"
                 />
                 <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent flex flex-col justify-end p-8">
                    <p className="text-white text-xl font-display font-black tracking-tight">Ilha de São Tomé</p>
                    <p className="text-emerald-400 text-[10px] font-black uppercase tracking-widest">DSGC Cadastre Map</p>
                 </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Pillars Section */}
      <section className="py-20 sm:py-32 px-4 sm:px-6 md:px-20 bg-white dark:bg-slate-900 transition-colors duration-500">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-24">
            <h2 className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.4em] mb-4">Pilares do Sistema</h2>
            <p className="text-4xl font-display font-black tracking-tighter text-slate-900 dark:text-white leading-tight">
              Uma fundação sólida para a Governação Territorial modernas.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {FEATURES.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="group p-8 rounded-[2rem] bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800/50 hover:border-emerald-500/30 hover:bg-white dark:hover:bg-slate-900 transition-all duration-500 shadow-sm hover:shadow-xl hover:shadow-emerald-500/5"
              >
                <div className={cn(
                  "w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-transform duration-500 group-hover:scale-110 shadow-lg",
                  feature.color === 'emerald' ? "bg-emerald-500 text-white shadow-emerald-500/20" :
                  feature.color === 'blue' ? "bg-blue-500 text-white shadow-blue-500/20" :
                  "bg-purple-500 text-white shadow-purple-500/20"
                )}>
                  <feature.icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-display font-black tracking-tight text-slate-900 dark:text-white mb-3">{feature.title}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed mb-6">
                  {feature.description}
                </p>
                <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-black text-[10px] uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                  Ver Mais <ChevronRight className="w-4 h-4" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats/Utility Section */}
      <section className="py-20 sm:py-32 px-4 sm:px-6 md:px-20 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="order-2 lg:order-1 grid grid-cols-1 sm:grid-cols-2 gap-6">
              {UTILITIES.map((u, i) => (
                <div key={i} className="p-6 rounded-[2rem] bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl border border-white dark:border-slate-800 flex flex-col items-center text-center group hover:bg-emerald-500 hover:text-white transition-all duration-500 cursor-default shadow-sm">
                  <u.icon className="w-6 h-6 text-emerald-500 group-hover:text-white mb-3 transition-colors" />
                  <p className="font-display font-black text-sm tracking-tight text-slate-900 dark:text-white group-hover:text-white transition-colors">{u.title}</p>
                </div>
              ))}
            </div>
            
            <div className="order-1 lg:order-2">
              <h2 className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.4em] mb-4">Utilidades & Propósito</h2>
              <p className="text-3xl sm:text-5xl font-display font-black tracking-tighter text-slate-900 dark:text-white mb-8 leading-[1.1]">
                Eficiência Operacional para a DSGC.
              </p>
              <div className="space-y-6">
                {[
                  "Emissão acelerada de Certidões de Registo",
                  "Redução de conflitos de posse em 70%",
                  "Interoperabilidade com o Registo Predial e Notariado",
                  "Controlo rigoroso de taxas e emolumentos"
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className="w-6 h-6 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
                      <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                    </div>
                    <p className="text-slate-600 dark:text-slate-400 font-bold">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[150%] bg-emerald-500/[0.02] -z-10 skew-y-6"></div>
      </section>

      {/* Footer / CTA */}
      <footer className="pt-20 sm:pt-32 pb-20 px-4 sm:px-6 md:px-20 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 transition-colors duration-500">
        <div className="max-w-7xl mx-auto">
          <div className="bg-slate-900 rounded-[2.5rem] sm:rounded-[4rem] p-8 sm:p-12 md:p-24 text-center relative overflow-hidden shadow-2xl mb-24">
             <div className="relative z-10">
                <Landmark className="w-16 h-16 text-emerald-400 mx-auto mb-10" />
                <h2 className="text-3xl md:text-6xl font-display font-black tracking-tighter text-white mb-10">
                  Pronto para transformar a <br className="hidden md:block" /> administração de terras?
                </h2>
                <button 
                  onClick={() => navigate('/login')}
                  className="w-full sm:w-auto px-10 sm:px-16 py-5 sm:py-6 rounded-2xl bg-white text-slate-900 font-black tracking-[0.2em] uppercase text-sm hover:scale-105 active:scale-95 transition-all shadow-xl"
                >
                  Entrar no Portal
                </button>
             </div>
             {/* Background graphics for CTA */}
             <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
             <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2"></div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center gap-10">
            <div className="flex items-center gap-3 grayscale opacity-60">
              <Map className="w-6 h-6 text-slate-900 dark:text-white" />
              <span className="font-display font-black text-slate-900 dark:text-white tracking-widest text-lg uppercase">SiGeT STP</span>
            </div>
            
            <div className="text-center opacity-40">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] mb-1">
                MINISTÉRIO DAS INFRAESTRUTURAS E RECURSOS NATURAIS
              </p>
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em]">
                DIRECÇÃO DOS SERVIÇOS GEOGRÁFICOS E CADASTRAIS (DSGC)
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-6 sm:gap-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">
               <a href="#" className="hover:text-emerald-500 transition-colors">Termos</a>
               <a href="#" className="hover:text-emerald-500 transition-colors">Privacidade</a>
               <a href="#" className="hover:text-emerald-500 transition-colors">Suporte</a>
            </div>
          </div>

          <div className="mt-20 pt-10 border-t border-slate-100 dark:border-slate-900 text-center">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
              © 2026 Governo da República Democrática de São Tomé e Príncipe • Todos os direitos reservados
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
