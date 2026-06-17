import React, { useState } from 'react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';
import { Shield, Mail, Lock, ArrowRight } from 'lucide-react';
import { ThemeToggle } from './AdminLayout';

interface LoginViewProps {
  onLogin: () => void;
}

export function LoginView({ onLogin }: LoginViewProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLogin();
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-slate-200 dark:bg-slate-950 transition-colors duration-700">
      <div className="absolute top-8 right-8 flex gap-4">
        <ThemeToggle />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-[440px]"
      >
        <div className="text-center mb-10">
          <div className="w-20 h-20 premium-gradient rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-emerald-500/30">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-display font-bold tracking-tight text-slate-900 dark:text-white">
            DSGC Admin
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-3 font-sans font-medium">
            Direção dos Serviços Geográficos e Cadastrais
          </p>
        </div>

        <div className="glass-card p-10 rounded-[2.5rem] bg-white dark:bg-slate-900 shadow-2xl dark:shadow-[0_0_50px_rgba(0,0,0,0.3)] border-slate-100 dark:border-slate-800/50">
          <form onSubmit={handleSubmit} className="space-y-7">
            <div className="space-y-2.5">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1 uppercase tracking-wider">Acesso Institucional</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="utilizador@dsgc.st"
                  className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 font-medium transition-all text-slate-900 dark:text-slate-100 placeholder:text-slate-400"
                />
              </div>
            </div>

            <div className="space-y-2.5">
              <div className="flex justify-between items-center px-1">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Identificador Seguro</label>
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 font-medium transition-all text-slate-900 dark:text-slate-100 placeholder:text-slate-400"
                />
              </div>
            </div>

            <button
              disabled={isLoading}
              className="w-full py-4.5 rounded-2xl premium-gradient text-white font-bold text-lg flex items-center justify-center gap-3 hover:shadow-xl hover:shadow-emerald-500/20 active:scale-[0.98] transition-all disabled:opacity-50"
            >
              {isLoading ? (
                <div className="w-6 h-6 border-3 border-white/20 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Autenticar no Portal
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-slate-100 dark:border-slate-800/60 text-center">
            <button className="text-sm text-emerald-600 dark:text-emerald-400 hover:text-emerald-500 transition-colors font-bold uppercase tracking-wide">
              Solicitar Assistência Técnica
            </button>
          </div>
        </div>

        <p className="text-center mt-8 text-xs text-slate-400 uppercase tracking-widest font-semibold">
          © 2026 DSGC São Tomé e Príncipe
        </p>
      </motion.div>
    </div>
  );
}
