
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  Database, 
  Wifi, 
  HelpCircle, 
  MoreVertical, 
  BookOpen, 
  FileText, 
  Info,
  User as UserIcon,
  Users,
  Settings
} from 'lucide-react';
import { NetworkType, DataBalances, UserProfile } from './types';
import { STORAGE_KEYS, APP_RULES, MANUAL_STEPS } from './constants';
import StoreData from './components/StoreData';
import UseData from './components/UseData';
import HelpCenter from './components/HelpCenter';
import ProfileManager from './components/ProfileManager';

type View = 'store' | 'use' | 'help' | 'rules' | 'manual' | 'profiles';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('store');
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [activeProfileId, setActiveProfileId] = useState<string>('');
  const [hasConsent, setHasConsent] = useState<boolean>(false);
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [showConsentModal, setShowConsentModal] = useState<boolean>(false);

  // Load and Init Profiles
  useEffect(() => {
    const storedProfiles = localStorage.getItem(STORAGE_KEYS.PROFILES);
    const storedActiveId = localStorage.getItem(STORAGE_KEYS.ACTIVE_PROFILE_ID);
    const storedConsent = localStorage.getItem(STORAGE_KEYS.CONSENT);

    let parsedProfiles: UserProfile[] = [];
    if (storedProfiles) {
      parsedProfiles = JSON.parse(storedProfiles);
    }

    if (parsedProfiles.length === 0) {
      // Create default profile if none exists
      const defaultProfile: UserProfile = {
        id: crypto.randomUUID(),
        name: 'Default User',
        balances: { fourG: 0, fiveG: 0 }
      };
      parsedProfiles = [defaultProfile];
      localStorage.setItem(STORAGE_KEYS.PROFILES, JSON.stringify(parsedProfiles));
    }

    setProfiles(parsedProfiles);

    const activeId = storedActiveId && parsedProfiles.find(p => p.id === storedActiveId)
      ? storedActiveId
      : parsedProfiles[0].id;

    setActiveProfileId(activeId);
    localStorage.setItem(STORAGE_KEYS.ACTIVE_PROFILE_ID, activeId);
    
    if (storedConsent === 'true') {
      setHasConsent(true);
    } else {
      setShowConsentModal(true);
    }
  }, []);

  const activeProfile = useMemo(() => 
    profiles.find(p => p.id === activeProfileId) || profiles[0]
  , [profiles, activeProfileId]);

  // Persist Profiles helper
  const saveProfiles = useCallback((updatedProfiles: UserProfile[]) => {
    setProfiles(updatedProfiles);
    localStorage.setItem(STORAGE_KEYS.PROFILES, JSON.stringify(updatedProfiles));
  }, []);

  const updateActiveBalances = useCallback((newBalances: DataBalances) => {
    const updatedProfiles = profiles.map(p => 
      p.id === activeProfileId ? { ...p, balances: newBalances } : p
    );
    saveProfiles(updatedProfiles);
  }, [profiles, activeProfileId, saveProfiles]);

  const handleConsent = () => {
    localStorage.setItem(STORAGE_KEYS.CONSENT, 'true');
    setHasConsent(true);
    setShowConsentModal(false);
  };

  const handleSwitchProfile = (id: string) => {
    setActiveProfileId(id);
    localStorage.setItem(STORAGE_KEYS.ACTIVE_PROFILE_ID, id);
    setIsMenuOpen(false);
  };

  const renderContent = () => {
    if (!activeProfile) return null;

    switch (currentView) {
      case 'store':
        return <StoreData balances={activeProfile.balances} onUpdateBalances={updateActiveBalances} />;
      case 'use':
        return <UseData balances={activeProfile.balances} onUpdateBalances={updateActiveBalances} />;
      case 'help':
        return <HelpCenter />;
      case 'profiles':
        return (
          <ProfileManager 
            profiles={profiles} 
            activeProfileId={activeProfileId}
            onProfilesChange={saveProfiles}
            onSwitchProfile={handleSwitchProfile}
          />
        );
      case 'rules':
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-6 text-slate-800 flex items-center gap-2">
              <FileText className="text-blue-600" /> App Rules
            </h2>
            <div className="space-y-6">
              {APP_RULES.map((rule, i) => (
                <div key={i} className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                  <h3 className="font-semibold text-slate-900 mb-2">{rule.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{rule.content}</p>
                </div>
              ))}
            </div>
          </div>
        );
      case 'manual':
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-6 text-slate-800 flex items-center gap-2">
              <BookOpen className="text-blue-600" /> How to Use
            </h2>
            <div className="space-y-4">
              {MANUAL_STEPS.map((step, i) => (
                <div key={i} className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                    {i + 1}
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">{step.title}</h3>
                    <p className="text-sm text-slate-600 mt-1">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      default:
        return <StoreData balances={activeProfile.balances} onUpdateBalances={updateActiveBalances} />;
    }
  };

  return (
    <div className="max-w-md mx-auto min-h-screen bg-slate-50 relative flex flex-col shadow-2xl border-x border-slate-200">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-100 p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200">
            <Database className="text-white w-6 h-6" />
          </div>
          <div>
            <h1 className="font-bold text-slate-900 leading-tight">Data Vault</h1>
            <p className="text-[10px] text-slate-400 font-medium tracking-widest uppercase">
              {activeProfile?.name || 'Loading...'}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-1">
          <button 
            onClick={() => setCurrentView('profiles')}
            className={`p-2 rounded-full transition-colors ${currentView === 'profiles' ? 'bg-blue-100 text-blue-600' : 'hover:bg-slate-100 text-slate-600'}`}
          >
            <UserIcon className="w-5 h-5" />
          </button>
          <div className="relative">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 hover:bg-slate-100 rounded-full transition-colors"
            >
              <MoreVertical className="text-slate-600 w-5 h-5" />
            </button>
            
            {isMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden py-1 z-50">
                <button 
                  onClick={() => { setCurrentView('profiles'); setIsMenuOpen(false); }}
                  className="w-full text-left px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-3"
                >
                  <Users className="w-4 h-4" /> Manage Profiles
                </button>
                <div className="border-t border-slate-50 my-1"></div>
                <button 
                  onClick={() => { setCurrentView('rules'); setIsMenuOpen(false); }}
                  className="w-full text-left px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-3"
                >
                  <FileText className="w-4 h-4" /> App Rules
                </button>
                <button 
                  onClick={() => { setCurrentView('manual'); setIsMenuOpen(false); }}
                  className="w-full text-left px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-3"
                >
                  <BookOpen className="w-4 h-4" /> How to Use
                </button>
                <button 
                  onClick={() => { setCurrentView('help'); setIsMenuOpen(false); }}
                  className="w-full text-left px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-3"
                >
                  <HelpCircle className="w-4 h-4" /> Help Center
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-grow overflow-y-auto pb-24">
        {renderContent()}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white border-t border-slate-100 p-3 flex justify-around items-center shadow-[0_-4px_20px_-5px_rgba(0,0,0,0.1)] z-40">
        <button 
          onClick={() => setCurrentView('store')}
          className={`flex flex-col items-center gap-1 px-4 py-1 rounded-xl transition-all ${currentView === 'store' ? 'text-blue-600 scale-110' : 'text-slate-400 hover:text-slate-600'}`}
        >
          <Database className="w-6 h-6" />
          <span className="text-[10px] font-bold">STORE</span>
        </button>
        <button 
          onClick={() => setCurrentView('use')}
          className={`flex flex-col items-center gap-1 px-4 py-1 rounded-xl transition-all ${currentView === 'use' ? 'text-blue-600 scale-110' : 'text-slate-400 hover:text-slate-600'}`}
        >
          <Wifi className="w-6 h-6" />
          <span className="text-[10px] font-bold">USE DATA</span>
        </button>
        <button 
          onClick={() => setCurrentView('help')}
          className={`flex flex-col items-center gap-1 px-4 py-1 rounded-xl transition-all ${currentView === 'help' ? 'text-blue-600 scale-110' : 'text-slate-400 hover:text-slate-600'}`}
        >
          <HelpCircle className="w-6 h-6" />
          <span className="text-[10px] font-bold">HELP</span>
        </button>
      </nav>

      {/* Consent Modal */}
      {showConsentModal && (
        <div className="fixed inset-0 z-[100] bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-6">
          <div className="bg-white rounded-3xl w-full max-w-sm p-8 shadow-2xl">
            <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-6 mx-auto">
              <Info className="text-blue-600 w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 text-center mb-2">User Consent Required</h2>
            <p className="text-slate-600 text-center text-sm mb-8 leading-relaxed">
              To proceed, we need your permission to manage simulated data balances. No actual data will be transmitted or stored on external servers.
            </p>
            <div className="space-y-3">
              <button 
                onClick={handleConsent}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-blue-200 active:scale-95"
              >
                Allow & Proceed
              </button>
              <button 
                className="w-full text-slate-400 text-sm font-medium py-2 hover:text-slate-600 transition-colors"
                onClick={() => window.close()}
              >
                Exit App
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
