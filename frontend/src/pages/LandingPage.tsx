import React, { useState } from 'react';
import { api, ApiError } from '../services/api';
import { VerifyResponse } from '../types/verification';
import { ResultView } from './ResultView';
import { LoadingSteps } from '../components/LoadingSteps';
import { DemoClaimsSelector } from '../components/DemoClaimsSelector';
import { DisclaimerBanner } from '../components/DisclaimerBanner';
import { Sparkles, AlertCircle, RefreshCw, X } from 'lucide-react';

export const LandingPage: React.FC = () => {
  const [claim, setClaim] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<VerifyResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleVerify = async (claimToVerify?: string) => {
    const textToVerify = (claimToVerify !== undefined ? claimToVerify : claim).trim();

    // Validation
    if (!textToVerify) {
      setValidationError('Please enter a factual claim or headline to verify.');
      return;
    }
    if (textToVerify.length < 5) {
      setValidationError('Claim is too short. Please provide a complete statement (minimum 5 characters).');
      return;
    }
    if (textToVerify.length > 1000) {
      setValidationError('Claim cannot exceed 1000 characters.');
      return;
    }

    setValidationError(null);
    setError(null);
    setLoading(true);

    try {
      const response = await api.verifyClaim(textToVerify);
      setResult(response);
    } catch (err: any) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred while communicating with the verification service.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSelectDemoClaim = (demoText: string) => {
    setClaim(demoText);
    setValidationError(null);
    setError(null);
    handleVerify(demoText);
  };

  const handleClear = () => {
    setClaim('');
    setValidationError(null);
    setError(null);
  };

  if (result) {
    return (
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <ResultView 
          data={result} 
          onReset={() => {
            setResult(null);
            setClaim('');
          }} 
        />
      </main>
    );
  }

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      {/* Hero Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-300 text-xs font-semibold uppercase tracking-wider mb-4">
          <Sparkles className="w-3.5 h-3.5 text-brand-400" />
          <span>Evidence-First Misinformation Verification</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-4 leading-tight">
          Verify before you trust or share.
        </h1>

        <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
          TruthLens analyzes a claim against available evidence and explains what the evidence supports, contradicts, or leaves uncertain.
        </p>
      </div>

      {/* Main Verification Input Form */}
      <div className="glass-panel rounded-2xl p-6 sm:p-8 shadow-2xl border border-slate-800 relative">
        <form onSubmit={(e) => { e.preventDefault(); handleVerify(); }}>
          <div className="flex items-center justify-between mb-2">
            <label htmlFor="claim-input" className="text-xs uppercase tracking-wider font-semibold text-slate-300">
              Paste a claim or headline below
            </label>
            <div className="flex items-center gap-3">
              {claim && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="text-xs text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
                >
                  <X className="w-3 h-3" />
                  <span>Clear</span>
                </button>
              )}
              <span className={`text-xs font-mono ${claim.length > 900 ? 'text-amber-400' : 'text-slate-500'}`}>
                {claim.length}/1000
              </span>
            </div>
          </div>

          <textarea
            id="claim-input"
            rows={4}
            value={claim}
            onChange={(e) => {
              setClaim(e.target.value);
              if (validationError) setValidationError(null);
            }}
            placeholder="e.g. Water boils at 100 degrees Celsius under standard atmospheric pressure..."
            disabled={loading}
            className="w-full bg-slate-900/90 text-white placeholder-slate-500 border border-slate-700/80 rounded-xl p-4 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all resize-y min-h-[110px]"
          />

          {/* Validation Error */}
          {validationError && (
            <div className="mt-2.5 flex items-center gap-2 text-rose-400 text-xs bg-rose-500/10 border border-rose-500/20 p-2.5 rounded-lg">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{validationError}</span>
            </div>
          )}

          {/* Backend / Network Error */}
          {error && (
            <div className="mt-3 flex items-start justify-between gap-3 text-rose-300 text-xs bg-rose-500/10 border border-rose-500/30 p-3.5 rounded-xl">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-rose-200">Verification Request Failed</p>
                  <p className="text-rose-300/90 mt-0.5">{error}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleVerify()}
                className="shrink-0 flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 font-semibold border border-rose-500/40 transition-colors"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Retry</span>
              </button>
            </div>
          )}

          {/* Action Button */}
          <div className="mt-5 flex justify-end">
            <button
              id="verify-claim-btn"
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto px-7 py-3 rounded-xl bg-brand-500 hover:bg-brand-600 disabled:bg-slate-800 disabled:text-slate-500 disabled:cursor-not-allowed text-white font-semibold text-sm sm:text-base shadow-lg shadow-brand-500/20 hover:shadow-brand-500/30 active:scale-[0.99] transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Verifying Evidence...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Verify Claim</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Dynamic Loading State Indicator */}
        {loading && (
          <div className="mt-8">
            <LoadingSteps isVerifying={loading} />
          </div>
        )}

        {/* Demo Claims */}
        {!loading && (
          <DemoClaimsSelector 
            onSelectClaim={handleSelectDemoClaim}
            disabled={loading}
          />
        )}
      </div>

      <DisclaimerBanner />
    </main>
  );
};
