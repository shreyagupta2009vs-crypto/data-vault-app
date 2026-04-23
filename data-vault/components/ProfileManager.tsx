
import React, { useState } from 'react';
import { UserProfile } from '../types';
import { 
  UserPlus, 
  Trash2, 
  Edit2, 
  Check, 
  X, 
  User as UserIcon, 
  CircleDot,
  Plus,
  ArrowLeft
} from 'lucide-react';

interface ProfileManagerProps {
  profiles: UserProfile[];
  activeProfileId: string;
  onProfilesChange: (profiles: UserProfile[]) => void;
  onSwitchProfile: (id: string) => void;
}

const ProfileManager: React.FC<ProfileManagerProps> = ({ 
  profiles, 
  activeProfileId, 
  onProfilesChange, 
  onSwitchProfile 
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newName, setNewName] = useState('');
  const [editName, setEditName] = useState('');

  const handleCreate = () => {
    if (!newName.trim()) return;
    const newProfile: UserProfile = {
      id: crypto.randomUUID(),
      name: newName.trim(),
      balances: { fourG: 0, fiveG: 0 }
    };
    onProfilesChange([...profiles, newProfile]);
    setNewName('');
    setIsAdding(false);
  };

  const handleUpdate = (id: string) => {
    if (!editName.trim()) return;
    const updated = profiles.map(p => 
      p.id === id ? { ...p, name: editName.trim() } : p
    );
    onProfilesChange(updated);
    setEditingId(null);
  };

  const handleDelete = (id: string) => {
    if (profiles.length <= 1) return;
    const updated = profiles.filter(p => p.id !== id);
    onProfilesChange(updated);
    if (id === activeProfileId) {
      onSwitchProfile(updated[0].id);
    }
  };

  const startEdit = (profile: UserProfile) => {
    setEditingId(profile.id);
    setEditName(profile.name);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <UserIcon className="text-blue-600" /> User Profiles
        </h2>
        <button 
          onClick={() => setIsAdding(true)}
          className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 shadow-md transition-all active:scale-90"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>

      <div className="space-y-4">
        {isAdding && (
          <div className="bg-white p-4 rounded-2xl border-2 border-blue-100 shadow-sm flex gap-2 items-center animate-in slide-in-from-top-4 duration-200">
            <input 
              autoFocus
              type="text"
              placeholder="Profile Name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="flex-grow bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-blue-500"
              onKeyPress={(e) => e.key === 'Enter' && handleCreate()}
            />
            <button onClick={handleCreate} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
              <Check className="w-5 h-5" />
            </button>
            <button onClick={() => setIsAdding(false)} className="p-2 text-slate-400 hover:bg-slate-50 rounded-lg">
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        {profiles.map((profile) => (
          <div 
            key={profile.id}
            className={`group relative bg-white p-4 rounded-2xl border-2 transition-all cursor-pointer ${
              activeProfileId === profile.id 
                ? 'border-blue-600 shadow-md shadow-blue-50' 
                : 'border-slate-100 hover:border-slate-200'
            }`}
            onClick={() => editingId !== profile.id && onSwitchProfile(profile.id)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 overflow-hidden">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                  activeProfileId === profile.id ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400'
                }`}>
                  <UserIcon className="w-5 h-5" />
                </div>
                
                {editingId === profile.id ? (
                  <input 
                    autoFocus
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                    className="bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-sm focus:outline-none w-32"
                    onKeyPress={(e) => e.key === 'Enter' && handleUpdate(profile.id)}
                  />
                ) : (
                  <div className="overflow-hidden">
                    <p className={`font-bold text-sm truncate ${activeProfileId === profile.id ? 'text-slate-900' : 'text-slate-600'}`}>
                      {profile.name}
                    </p>
                    <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                      {(profile.balances.fourG + profile.balances.fiveG).toFixed(0)} MB stored
                    </p>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-1">
                {editingId === profile.id ? (
                  <>
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleUpdate(profile.id); }}
                      className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); setEditingId(null); }}
                      className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </>
                ) : (
                  <>
                    {activeProfileId === profile.id && (
                      <CircleDot className="w-4 h-4 text-blue-600 mr-2" />
                    )}
                    <button 
                      onClick={(e) => { e.stopPropagation(); startEdit(profile); }}
                      className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    {profiles.length > 1 && (
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleDelete(profile.id); }}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 bg-blue-50 p-4 rounded-2xl">
        <h4 className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-2">Profile Tip</h4>
        <p className="text-xs text-blue-700 leading-relaxed">
          Each profile maintains its own independent data vault. Use different profiles for testing various usage scenarios or for different theoretical devices.
        </p>
      </div>
    </div>
  );
};

export default ProfileManager;
