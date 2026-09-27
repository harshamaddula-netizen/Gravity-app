import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { HistoryItem, VerifyResponse } from '../types/verification';
import { AssessmentBadge } from '../components/AssessmentBadge';
import { ResultView } from './ResultView';
import { History, Trash2, ArrowRight, Clock, RefreshCw, AlertCircle } from 'lucide-react';

export const HistoryPage: React.FC = () => {
  const [items, setItems] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedResult, setSelectedResult] = useState<VerifyResponse | null>(null);
  const [loadingItem, setLoadingItem] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>('ALL');

  const loadHistory = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getHistory();
      setItems(data.items);
    } catch (err: any) {
      setError(err.message || 'Failed to load verification history.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const handleOpenItem = async (id: string) => {
    if (loadingItem) return;
    setLoadingItem(true);
    setError(null);
    try {
      const fullRecord = await api.getHistoryItem(id);
      setSelectedResult(fullRecord);
    } catch (err: any) {
      setError(err.message || 'Could not load verification details.');
    } finally {
      setLoadingItem(false);
    }
  };

  const handleDeleteItem = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (!window.confirm('Delete this verification record from local history?')) return;

    try {
      await api.deleteHistoryItem(id);
      setItems((prev) => prev.filter((item) => item.id !== id));
      if (selectedResult?.id === id) {
        setSelectedResult(null);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to delete record.');
    }
  };


  if (selectedResult) {
    return (
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <ResultView 
          data={selectedResult} 
          onReset={() => setSelectedResult(null)} 
        />
      </main>
    );
  }

  if (loadingItem) {
    return (
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <RefreshCw className="w-8 h-8 animate-spin text-brand-400 mx-auto mb-3" />
        <p className="text-sm text-slate-300">Loading full verification report...</p>
      </main>
    );
  }

  const filteredItems = items.filter((item) => {
    if (filter === 'ALL') return true;
    return item.assessment === filter;
  });

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <History className="w-5 h-5 text-brand-400" />
            <h1 className="text-2xl font-bold text-white tracking-tight">Verification History</h1>
          </div>
          <p className="text-xs text-slate-400">
            Audit trail of verified statements stored in the local SQLite database
          </p>
        </div>

        <button
          onClick={loadHistory}
          disabled={loading}
          className="self-start sm:self-auto flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 text-xs font-semibold transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 mb-6">
        {[
          { key: 'ALL', label: 'All Records' },
          { key: 'SUPPORTED', label: 'Supported' },
          { key: 'CONTRADICTED', label: 'Contradicted' },
          { key: 'MIXED', label: 'Mixed Evidence' },
          { key: 'INSUFFICIENT_EVIDENCE', label: 'Insufficient' }
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
              filter === tab.key
                ? 'bg-brand-500 text-white shadow-sm'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Error state */}
      {error && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm flex items-center gap-2 mb-6">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
          <span>{error}</span>
        </div>
      )}

      {/* Loading state */}
      {loading ? (
        <div className="py-16 text-center text-slate-400 flex flex-col items-center justify-center gap-3">
          <RefreshCw className="w-6 h-6 animate-spin text-brand-400" />
          <span className="text-sm">Loading verification history...</span>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="text-center py-16 glass-card rounded-2xl border border-slate-800 text-slate-400">
          <p className="text-base font-semibold text-slate-300 mb-1">No verification records found</p>
          <p className="text-xs text-slate-500">
            {filter === 'ALL' 
              ? 'Submit a claim on the home page to start building your verification history.'
              : `No items found matching the filter "${filter}".`}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => handleOpenItem(item.id)}
              className="glass-card hover:bg-slate-900/80 p-4 sm:p-5 rounded-xl border border-slate-800/80 hover:border-slate-700 transition-all cursor-pointer group flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm"
            >
              <div className="space-y-2 max-w-2xl min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2.5">
                  <AssessmentBadge assessment={item.assessment} size="sm" />
                  <span className="text-xs font-mono text-slate-400 font-medium">
                    {Math.round(item.assessment_confidence * 100)}% conf
                  </span>
                  <span className="text-slate-600 text-xs">•</span>
                  <span className="text-xs text-slate-500 font-mono">
                    {item.evidence_count} sources
                  </span>
                </div>

                <h3 className="text-sm sm:text-base font-semibold text-white group-hover:text-brand-300 transition-colors leading-snug line-clamp-2 break-words">
                  "{item.claim}"
                </h3>

                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed break-words">
                  {item.explanation}
                </p>
              </div>

              {/* Action buttons & date */}
              <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 shrink-0 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-800/80">
                <div className="flex items-center gap-1 text-[11px] text-slate-500 font-mono">
                  <Clock className="w-3 h-3 text-slate-600" />
                  <span>{new Date(item.created_at).toLocaleDateString()}</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    title="Delete record"
                    onClick={(e) => handleDeleteItem(e, item.id)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <div className="flex items-center gap-1 text-xs font-medium text-brand-400 group-hover:translate-x-1 transition-transform">
                    <span>View Analysis</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
};
