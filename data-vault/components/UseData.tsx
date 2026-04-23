
import React, { useState, useEffect, useRef } from 'react';
import { NetworkType, SpeedTier, DataBalances } from '../types';
import { SPEED_TIERS } from '../constants';
import { Wifi, Zap, Pause, Play, AlertTriangle, Activity } from 'lucide-react';

interface UseDataProps {
  balances: DataBalances;
  onUpdateBalances: (balances: DataBalances) => void;
}

const UseData: React.FC<UseDataProps> = ({ balances, onUpdateBalances }) => {
  const [networkType, setNetworkType] = useState<NetworkType>('4G');
  const [speedTier, setSpeedTier] = useState<SpeedTier>(80);
  const [isActive, setIsActive] = useState(false);
  const [sessionUsed, setSessionUsed] = useState(0); // in MB
  const [remainingLocal, setRemainingLocal] = useState(0); // in MB
  
  // Fix: Use ReturnType<typeof setInterval> instead of NodeJS.Timeout for browser compatibility
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    setRemainingLocal(networkType === '4G' ? balances.fourG : balances.fiveG);
  }, [networkType, balances]);

  const toggleSession = () => {
    if (isActive) {
      stopSession();
    } else {
      if (remainingLocal <= 0) return;
      startSession();
    }
  };

  const startSession = () => {
    setIsActive(true);
    timerRef.current = setInterval(() => {
      setRemainingLocal(prev => {
        // Mbps to MB/s: speed / 8
        const consumptionPerSec = speedTier / 8;
        const nextValue = prev - consumptionPerSec;
        
        if (nextValue <= 0) {
          stopSession();
          return 0;
        }
        
        setSessionUsed(s => s + consumptionPerSec);
        return nextValue;
      });
    }, 1000);
  };

  const stopSession = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setIsActive(false);
    
    // Sync back to central state
    const currentMB = remainingLocal;
    if (networkType === '4G') {
      onUpdateBalances({ ...balances, fourG: currentMB });
    } else {
      onUpdateBalances({ ...balances, fiveG: currentMB });
    }
    setSessionUsed(0);
  };

  const formatDisplay = (mb: number) => {
    if (mb >= 1024) return `${(mb / 1024).toFixed(3)} GB`;
    return `${mb.toFixed(2)} MB`;
  };

  return (
    <div className="p-6 space-y-6">
      <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl">
        {/* Background Visuals */}
        <div className="absolute top-0 right-0 p-10 opacity-10 animate-pulse">
          <Activity className="w-40 h-40" />
        </div>

        <div className="relative z-10 space-y-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.2em] mb-1">Status</p>
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-emerald-400 animate-ping' : 'bg-slate-500'}`} />
                <span className={`text-sm font-bold ${isActive ? 'text-emerald-400' : 'text-slate-500'}`}>
                  {isActive ? 'SESSION ACTIVE' : 'INACTIVE'}
                </span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.2em] mb-1">Network</p>
              <span className="text-lg font-black">{networkType}</span>
            </div>
          </div>

          <div className="py-6 text-center">
            <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.2em] mb-3">Remaining Balance</p>
            <h2 className="text-5xl font-black tracking-tight">{formatDisplay(remainingLocal)}</h2>
          </div>

          {isActive && (
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 flex justify-between items-center border border-white/10">
              <div>
                <p className="text-[10px] text-white/50 font-bold uppercase">Simulated Speed</p>
                <p className="text-xl font-black text-blue-400">{speedTier} <span className="text-xs">Mbps</span></p>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-white/50 font-bold uppercase">Used This Session</p>
                <p className="text-xl font-black">{sessionUsed.toFixed(1)} <span className="text-xs">MB</span></p>
              </div>
            </div>
          )}
        </div>
      </div>

      {!isActive ? (
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xl shadow-slate-200/50 space-y-8">
          <div className="space-y-4">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Choose Network Mode</label>
            <div className="grid grid-cols-2 gap-3">
              {(['4G', '5G'] as NetworkType[]).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setNetworkType(mode)}
                  className={`py-4 rounded-2xl font-bold transition-all border-2 ${
                    networkType === mode 
                    ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-100' 
                    : 'bg-white border-slate-100 text-slate-400 hover:border-slate-200'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Select Speed Tier</label>
            <div className="grid grid-cols-3 gap-2">
              {SPEED_TIERS.map((tier) => (
                <button
                  key={tier}
                  onClick={() => setSpeedTier(tier)}
                  className={`py-3 rounded-xl text-sm font-bold transition-all border-2 ${
                    speedTier === tier 
                    ? 'bg-slate-900 border-slate-900 text-white' 
                    : 'bg-slate-50 border-transparent text-slate-500 hover:bg-slate-100'
                  }`}
                >
                  {tier} Mb
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={toggleSession}
            disabled={remainingLocal <= 0}
            className={`w-full flex items-center justify-center gap-3 py-5 rounded-[1.5rem] font-black text-lg transition-all shadow-xl active:scale-[0.98] ${
              remainingLocal <= 0 
              ? 'bg-slate-100 text-slate-400' 
              : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-200'
            }`}
          >
            {remainingLocal <= 0 ? (
              <>
                <AlertTriangle className="w-6 h-6" /> NO DATA STORED
              </>
            ) : (
              <>
                <Play className="w-6 h-6 fill-current" /> ACTIVATE VAULT
              </>
            )}
          </button>
        </div>
      ) : (
        <button
          onClick={toggleSession}
          className="w-full flex items-center justify-center gap-3 py-6 rounded-[1.5rem] font-black text-lg bg-rose-500 hover:bg-rose-600 text-white shadow-xl shadow-rose-200 active:scale-[0.98] transition-all"
        >
          <Pause className="w-6 h-6 fill-current" /> STOP SIMULATION
        </button>
      )}

      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 border-dashed">
        <div className="flex gap-3">
          <Zap className="text-amber-500 w-5 h-5 shrink-0" />
          <p className="text-[11px] text-slate-500 leading-tight italic">
            Speed control is simulated by metering throughput relative to time. Real network performance depends on local infrastructure.
          </p>
        </div>
      </div>
    </div>
  );
};

export default UseData;
