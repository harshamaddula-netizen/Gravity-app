import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Shield, History, Info, RefreshCw } from 'lucide-react';
import { api } from '../services/api';
import { HealthResponse } from '../types/verification';

export const Header: React.FC = () => {
  const location = useLocation();
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [isHealthy, setIsHealthy] = useState<boolean | null>(null);

  useEffect(() => {
    let mounted = true;
    const checkHealth = async () => {
      try {
        const data = await api.getHealth();
        if (mounted) {
          setHealth(data);
          setIsHealthy(true);
        }
      } catch {
        if (mounted) {
          setIsHealthy(false);
        }
      }
    };

    checkHealth();
    const interval = setInterval(checkHealth, 30000);
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  return (
    <header className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-brand-500/10 border border-brand-500/30 flex items-center justify-center text-brand-400 group-hover:bg-brand-500/20 transition-all">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg text-white tracking-tight">TruthLens<span className="text-brand-400">AI</span></span>
              {health?.demo_mode && (
                <span className="text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-slate-300">
                  Demo Mode
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">Verify before you trust or share</p>
          </div>
        </Link>

        {/* Navigation & System Status */}
        <div className="flex items-center gap-4 sm:gap-6">
          <nav className="flex items-center gap-1 sm:gap-2">
            <Link
              to="/"
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                location.pathname === '/' 
                  ? 'bg-slate-800 text-brand-400 border border-slate-700' 
                  : 'text-slate-300 hover:text-white hover:bg-slate-900'
              }`}
            >
              Verify Claim
            </Link>
            <Link
              to="/history"
              className={`px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-1.5 transition-colors ${
                location.pathname === '/history' 
                  ? 'bg-slate-800 text-brand-400 border border-slate-700' 
                  : 'text-slate-300 hover:text-white hover:bg-slate-900'
              }`}
            >
              <History className="w-4 h-4" />
              <span>History</span>
            </Link>
            <Link
              to="/about"
              className={`px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-1.5 transition-colors ${
                location.pathname === '/about' 
                  ? 'bg-slate-800 text-brand-400 border border-slate-700' 
                  : 'text-slate-300 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Info className="w-4 h-4" />
              <span className="hidden md:inline">Methodology</span>
            </Link>
          </nav>

          {/* Backend Status indicator */}
          <div className="hidden lg:flex items-center gap-2 pl-3 border-l border-slate-800 text-xs">
            {isHealthy === true ? (
              <span className="flex items-center gap-1.5 text-emerald-400 font-mono">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>API Online ({health?.total_indexed_documents} docs)</span>
              </span>
            ) : isHealthy === false ? (
              <span className="flex items-center gap-1.5 text-rose-400 font-mono">
                <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                <span>API Offline</span>
              </span>
            ) : (
              <span className="flex items-center gap-1.5 text-slate-400 font-mono">
                <RefreshCw className="w-3 h-3 animate-spin text-slate-500" />
                <span>Connecting...</span>
              </span>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
