
import React, { useState } from 'react';
import { NetworkType, DataUnit, DataBalances } from '../types';
import { Database, PlusCircle, Info, CheckCircle2, AlertCircle } from 'lucide-react';

interface StoreDataProps {
  balances: DataBalances;
  onUpdateBalances: (balances: DataBalances) => void;
}

const StoreData: React.FC<StoreDataProps> = ({ balances, onUpdateBalances }) => {
  const [val4G, setVal4G] = useState<string>('');
  const [unit4G, setUnit4G] = useState<DataUnit>('GB');
  const [val5G, setVal5G] = useState<string>('');
  const [unit5G, setUnit5G] = useState<DataUnit>('GB');
  const [showConfirm, setShowConfirm] = useState(false);

  const calculateMB = (value: string, unit: DataUnit) => {
    const num = parseFloat(value) || 0;
    return unit === 'GB' ? num * 1024 : num;
  };

  const handleStore = () => {
    if (!val4G && !val5G) return;
    setShowConfirm(true);
  };

  const confirmStore = () => {
    const add4G = calculateMB(val4G, unit4G);
    const add5G = calculateMB(val5G, unit5G);
    
    onUpdateBalances({
      fourG: balances.fourG + add4G,
      fiveG: balances.fiveG + add5G
    });
    
    setVal4G('');
    setVal5G('');
    setShowConfirm(false);
  };

  const formatDisplay = (mb: number) => {
    if (mb >= 1024) return `${(mb / 1024).toFixed(2)} GB`;
    return `${Math.round(mb)} MB`;
  };

  return (
    <div className="p-6 space-y-6">
      {/* Balance Cards */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:scale-125 transition-transform">
            <Database className="w-12 h-12" />
          </div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Stored 4G</p>
          <p className="text-xl font-bold text-slate-800">{formatDisplay(balances.fourG)}</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:scale-125 transition-transform">
            <Database className="w-12 h-12 text-blue-600" />
          </div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Stored 5G</p>
          <p className="text-xl font-bold text-blue-600">{formatDisplay(balances.fiveG)}</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50 space-y-6">
        <h3 className="font-bold text-slate-800 flex items-center gap-2">
          <PlusCircle className="text-blue-600 w-5 h-5" /> Allocate Data
        </h3>

        {/* 4G Input */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">4G Data Amount</label>
          <div className="flex gap-2">
            <input 
              type="number" 
              placeholder="0.00"
              value={val4G}
              onChange={(e) => setVal4G(e.target.value)}
              className="flex-grow bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
            <select 
              value={unit4G}
              onChange={(e) => setUnit4G(e.target.value as DataUnit)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-3 text-slate-600 font-bold focus:outline-none"
            >
              <option>GB</option>
              <option>MB</option>
            </select>
          </div>
        </div>

        {/* 5G Input */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">5G Data Amount</label>
          <div className="flex gap-2">
            <input 
              type="number" 
              placeholder="0.00"
              value={val5G}
              onChange={(e) => setVal5G(e.target.value)}
              className="flex-grow bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
            <select 
              value={unit5G}
              onChange={(e) => setUnit5G(e.target.value as DataUnit)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-3 text-slate-600 font-bold focus:outline-none"
            >
              <option>GB</option>
              <option>MB</option>
            </select>
          </div>
        </div>

        <button 
          onClick={handleStore}
          disabled={!val4G && !val5G}
          className="w-full bg-slate-900 hover:bg-slate-800 disabled:bg-slate-200 text-white font-bold py-4 rounded-2xl transition-all shadow-lg active:scale-[0.98]"
        >
          Secure Data to Vault
        </button>

        <div className="bg-amber-50 border border-amber-100 p-3 rounded-xl flex gap-3">
          <Info className="w-5 h-5 text-amber-500 shrink-0" />
          <p className="text-[11px] text-amber-700 leading-tight">
            Allocating data marks it as "stored" within the app's local tracker. Ensure you have corresponding plan balance before proceeding.
          </p>
        </div>
      </div>

      {/* Confirmation Dialog */}
      {showConfirm && (
        <div className="fixed inset-0 z-[60] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-6">
          <div className="bg-white rounded-3xl w-full max-w-sm p-8 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-6 mx-auto">
              <AlertCircle className="text-blue-600 w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 text-center mb-4">Confirm Storage</h2>
            <div className="space-y-2 mb-8 bg-slate-50 p-4 rounded-2xl">
              {val4G && (
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">4G Amount:</span>
                  <span className="font-bold text-slate-900">{val4G} {unit4G}</span>
                </div>
              )}
              {val5G && (
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">5G Amount:</span>
                  <span className="font-bold text-slate-900">{val5G} {unit5G}</span>
                </div>
              )}
            </div>
            <div className="flex gap-3">
              <button 
                onClick={() => setShowConfirm(false)}
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold py-4 rounded-2xl transition-all"
              >
                No
              </button>
              <button 
                onClick={confirmStore}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-blue-100"
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StoreData;
