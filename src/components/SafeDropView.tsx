import React, { useState, useEffect } from 'react';
import { 
  Lock, 
  Unlock, 
  Eye, 
  EyeOff, 
  Trash2, 
  Plus, 
  Settings, 
  Download, 
  AlertTriangle, 
  CheckCircle,
  HelpCircle,
  Shield,
  Sliders,
  Database,
  Cpu
} from 'lucide-react';
import { VaultItem } from '../types';

interface SafeDropViewProps {
  sessionId: string;
}

export default function SafeDropView({ sessionId }: SafeDropViewProps) {
  const [activeSubTab, setActiveSubTab] = useState<'vault' | 'parameters' | 'data'>('vault');
  
  // Vault States
  const [vaultItems, setVaultItems] = useState<VaultItem[]>([]);
  const [masterPassword, setMasterPassword] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [decryptedValues, setDecryptedValues] = useState<{ [id: string]: string }>({});
  const [revealTimers, setRevealTimers] = useState<{ [id: string]: number }>({});

  // Storing state
  const [keyName, setKeyName] = useState('');
  const [plainValue, setPlainValue] = useState('');
  const [itemType, setItemType] = useState<VaultItem['itemType']>('api_key');

  // AI config state
  const [activeModel, setActiveModel] = useState('gemini-3.5-flash');
  const [availableModels, setAvailableModels] = useState<{ id: string; name: string }[]>([]);

  // Feedback notifications
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    fetchVaultItems();
    fetchModelConfig();
  }, []);

  // Countdown timer handler for revealed items
  useEffect(() => {
    const interval = setInterval(() => {
      setRevealTimers(prevTimers => {
        const nextTimers = { ...prevTimers };
        let updatedDecrypted = { ...decryptedValues };
        let changed = false;

        Object.keys(nextTimers).forEach(id => {
          if (nextTimers[id] <= 1) {
            delete nextTimers[id];
            delete updatedDecrypted[id];
            changed = true;
          } else {
            nextTimers[id] -= 1;
          }
        });

        if (changed) {
          setDecryptedValues(updatedDecrypted);
        }
        return nextTimers;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [decryptedValues]);

  const showSuccess = (msg: string) => {
    setSuccessMsg(msg);
    setErrorMsg('');
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  const showError = (msg: string) => {
    setErrorMsg(msg);
    setSuccessMsg('');
    setTimeout(() => setErrorMsg(''), 4000);
  };

  const fetchVaultItems = async () => {
    try {
      const res = await fetch('/api/vault');
      const data = await res.json();
      setVaultItems(data);
    } catch (err) {
      console.error('Failed to fetch vault items:', err);
    }
  };

  const fetchModelConfig = async () => {
    try {
      const res = await fetch('/api/settings/config');
      const data = await res.json();
      setActiveModel(data.activeModel);
      setAvailableModels(data.availableModels);
    } catch (err) {
      console.error('Failed to fetch model config:', err);
    }
  };

  const handleUnlockVault = (e: React.FormEvent) => {
    e.preventDefault();
    if (masterPassword.length < 4) {
      showError('Master Password must be at least 4 characters long.');
      return;
    }
    setIsUnlocked(true);
    showSuccess('SafeDrop Vault successfully unlocked.');
  };

  const handleLockVault = () => {
    setIsUnlocked(false);
    setMasterPassword('');
    setDecryptedValues({});
    setRevealTimers({});
  };

  const handleAddVaultItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!keyName || !plainValue) {
      showError('Key Name and Plain Value are required.');
      return;
    }

    try {
      const res = await fetch('/api/vault/store', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          keyName,
          value: plainValue,
          itemType,
          masterPassword,
          sessionId
        })
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);

      setKeyName('');
      setPlainValue('');
      setItemType('api_key');
      fetchVaultItems();
      showSuccess(`Credential "${keyName}" stored and encrypted successfully.`);
    } catch (err: any) {
      showError(err.message || 'Storage failed.');
    }
  };

  const handleRetrieveVaultItem = async (id: string) => {
    try {
      const res = await fetch('/api/vault/retrieve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id,
          masterPassword,
          sessionId
        })
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);

      // Save decrypted value and initiate 10s timer
      setDecryptedValues(prev => ({ ...prev, [id]: data.decryptedValue }));
      setRevealTimers(prev => ({ ...prev, [id]: 10 }));
    } catch (err: any) {
      showError(err.message || 'Decryption failed.');
    }
  };

  const handleDeleteVaultItem = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this secret permanently?')) return;
    try {
      const res = await fetch(`/api/vault/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId })
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);

      fetchVaultItems();
      showSuccess('Secret removed successfully from Vault.');
    } catch (err: any) {
      showError(err.message || 'Deletion failed.');
    }
  };

  const handleSaveModelConfig = async (modelId: string) => {
    try {
      const res = await fetch('/api/settings/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ model: modelId, sessionId })
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);

      setActiveModel(modelId);
      showSuccess(`Active model changed successfully to ${modelId}`);
    } catch (err: any) {
      showError(err.message || 'Failed to update model.');
    }
  };

  const handleExportBackup = async () => {
    try {
      const res = await fetch('/api/settings/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ format: 'json', sessionId })
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);

      // Create downloadable file
      const blob = new Blob([data.data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `mamta-ai-backup-${Date.now()}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      showSuccess('JSON backup package compiled and downloaded successfully.');
    } catch (err: any) {
      showError(err.message || 'Backup export failed.');
    }
  };

  return (
    <div id="safedrop_core_pane" className="flex flex-col lg:flex-row gap-4 h-full w-full">
      
      {/* LEFT COLUMN: Sub navigation and parameters panel */}
      <div className="w-full lg:w-56 flex flex-col gap-1 shrink-0">
        <button
          id="safedrop_subtab_vault_btn"
          onClick={() => setActiveSubTab('vault')}
          className={`w-full text-left py-2 px-3 rounded-lg text-xs font-semibold flex items-center gap-2.5 transition-all cursor-pointer ${
            activeSubTab === 'vault'
              ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold'
              : 'text-slate-400 hover:bg-slate-800/40 hover:text-slate-200 border border-transparent'
          }`}
        >
          <Shield className="w-3.5 h-3.5" />
          <span>Encrypted Locker</span>
        </button>

        <button
          id="safedrop_subtab_params_btn"
          onClick={() => setActiveSubTab('parameters')}
          className={`w-full text-left py-2 px-3 rounded-lg text-xs font-semibold flex items-center gap-2.5 transition-all cursor-pointer ${
            activeSubTab === 'parameters'
              ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold'
              : 'text-slate-400 hover:bg-slate-800/40 hover:text-slate-200 border border-transparent'
          }`}
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>AI Model Parameters</span>
        </button>

        <button
          id="safedrop_subtab_data_btn"
          onClick={() => setActiveSubTab('data')}
          className={`w-full text-left py-2 px-3 rounded-lg text-xs font-semibold flex items-center gap-2.5 transition-all cursor-pointer ${
            activeSubTab === 'data'
              ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold'
              : 'text-slate-400 hover:bg-slate-800/40 hover:text-slate-200 border border-transparent'
          }`}
        >
          <Database className="w-3.5 h-3.5" />
          <span>Data Portability</span>
        </button>

        {/* Locked state indicator */}
        <div className="mt-4 p-3 rounded-lg bg-slate-900/40 border border-slate-800/85 text-[11px] text-slate-500 space-y-1">
          <p className="font-semibold text-slate-400 flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-emerald-400" />
            Locker Status
          </p>
          <p className="leading-relaxed">
            SafeDrop encrypts credentials on disk. Access is locked unless a correct master password is saved.
          </p>
        </div>
      </div>

      {/* RIGHT DISPLAY: Sub tab rendering */}
      <div className="flex-1 bg-slate-900/60 border border-slate-800 rounded-xl p-4 lg:p-4.5 backdrop-blur-md shadow-xl min-h-[380px]">
        
        {/* Alerts Banner */}
        {successMsg && (
          <div className="mb-3.5 p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2 font-medium">
            <CheckCircle className="w-3.5 h-3.5 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}
        {errorMsg && (
          <div className="mb-3.5 p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2 font-medium">
            <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {activeSubTab === 'vault' && (
          <div className="space-y-4">
            
            {/* Locked screen interface */}
            {!isUnlocked ? (
              <div className="flex flex-col items-center justify-center py-10 text-center max-w-xs mx-auto space-y-3.5">
                <div className="w-12 h-12 rounded-xl bg-slate-850 border border-slate-800 flex items-center justify-center text-emerald-400 shadow-inner">
                  <Lock className="w-6 h-6" />
                </div>
                
                <div>
                  <h4 className="text-sm font-semibold text-slate-100 font-sans">Unlock SafeDrop Vault</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-normal">
                    Enter your Master Password to unlock encrypted keys, access tokens, and credentials.
                  </p>
                </div>

                <form onSubmit={handleUnlockVault} className="w-full flex items-center gap-1.5">
                  <input
                    id="vault_unlock_password_field"
                    type="password"
                    required
                    value={masterPassword}
                    onChange={(e) => setMasterPassword(e.target.value)}
                    placeholder="Enter Master Password..."
                    className="flex-1 bg-slate-800 border border-slate-800 focus:border-emerald-500/40 rounded-lg px-2.5 py-1.5 text-xs text-slate-100 focus:outline-none"
                  />
                  <button
                    id="vault_unlock_submit_btn"
                    type="submit"
                    className="py-1.5 px-3 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-slate-900 font-bold text-xs shadow-md transition-all cursor-pointer"
                  >
                    Unlock
                  </button>
                </form>
              </div>
            ) : (
              /* UNLOCKED: Credentials list and add form */
              <div className="space-y-4">
                
                {/* Vault Header controls */}
                <div className="flex items-center justify-between pb-1.5 border-b border-slate-800 mb-2">
                  <div>
                    <h4 className="text-sm font-semibold text-slate-200">Active Encrypted Locker</h4>
                    <p className="text-[10px] text-slate-500 mt-0.5">Secrets are encrypted using AES-250-CBC symmetric cryptosystems.</p>
                  </div>
                  
                  <button
                    id="vault_lock_btn"
                    onClick={handleLockVault}
                    className="py-1 px-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-100 transition-all text-[11px] font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <Unlock className="w-3 h-3 text-emerald-400" />
                    <span>Lock Vault</span>
                  </button>
                </div>

                {/* Grid layout for store form and items table */}
                <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
                  
                  {/* Store form (Left Column - 4/12) */}
                  <form onSubmit={handleAddVaultItem} className="xl:col-span-4 space-y-2.5 bg-slate-950/20 border border-slate-850 p-3.5 rounded-lg">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block border-b border-slate-850 pb-1">Add New Secret</span>
                    
                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-400 font-bold block">Key/Title Name</label>
                      <input
                        id="new_vault_key_input"
                        type="text"
                        required
                        value={keyName}
                        onChange={(e) => setKeyName(e.target.value)}
                        placeholder="e.g. GITHUB_ACCESS_TOKEN"
                        className="w-full bg-slate-800 border border-slate-800 focus:border-emerald-500/45 rounded-md px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-400 font-bold block">Plain Value</label>
                      <input
                        id="new_vault_value_input"
                        type="password"
                        required
                        value={plainValue}
                        onChange={(e) => setPlainValue(e.target.value)}
                        placeholder="Plain text credential value..."
                        className="w-full bg-slate-800 border border-slate-800 focus:border-emerald-500/45 rounded-md px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-400 font-bold block">Secret Category</label>
                      <select
                        id="new_vault_type_select"
                        value={itemType}
                        onChange={(e) => setItemType(e.target.value as any)}
                        className="w-full bg-slate-800 border border-slate-800 rounded-md px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none cursor-pointer"
                      >
                        <option value="api_key">API Key</option>
                        <option value="token">Access Token</option>
                        <option value="password">Password</option>
                        <option value="secret">Secret String</option>
                        <option value="note">Secure Memo</option>
                      </select>
                    </div>

                    <button
                      id="save_vault_item_submit"
                      type="submit"
                      className="w-full py-1.5 rounded-md bg-emerald-500 hover:bg-emerald-600 text-slate-900 font-bold text-xs transition-all shadow cursor-pointer flex items-center justify-center gap-1 mt-1.5"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Encrypt & Store</span>
                    </button>
                  </form>

                  {/* Vault items display table (Right Column - 8/12) */}
                  <div className="xl:col-span-8 overflow-x-auto border border-slate-800 bg-slate-950/10 rounded-lg">
                    <table className="w-full border-collapse text-left text-xs text-slate-400">
                      <thead className="bg-slate-900/40 text-slate-500 font-bold border-b border-slate-800">
                        <tr>
                          <th className="p-2.5">Title/Name</th>
                          <th className="p-2.5">Category</th>
                          <th className="p-2.5">Secure Value</th>
                          <th className="p-2.5 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-850">
                        {vaultItems.length === 0 ? (
                          <tr>
                            <td colSpan={4} className="p-6 text-center text-slate-500 italic">No credentials stored. Populate using the left panel.</td>
                          </tr>
                        ) : (
                          vaultItems.map(item => {
                            const isRevealed = decryptedValues[item.id] !== undefined;
                            const countdown = revealTimers[item.id] || 0;
                            return (
                              <tr key={item.id} className="hover:bg-slate-800/10">
                                <td className="p-2.5 font-semibold text-slate-200">{item.keyName}</td>
                                <td className="p-2.5">
                                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-750">
                                    {item.itemType}
                                  </span>
                                </td>
                                <td className="p-2.5 font-mono">
                                  {isRevealed ? (
                                    <div className="flex items-center gap-2">
                                      <span className="text-emerald-400 bg-emerald-500/5 px-2 py-0.5 rounded border border-emerald-500/10">{decryptedValues[item.id]}</span>
                                      <span className="text-[9px] text-amber-500 font-bold uppercase bg-amber-500/10 px-1.5 py-0.2 rounded animate-pulse">{countdown}s left</span>
                                    </div>
                                  ) : (
                                    <span className="text-slate-600">••••••••••••••••</span>
                                  )}
                                </td>
                                <td className="p-2.5 text-right">
                                  <div className="flex items-center justify-end gap-1.5">
                                    <button
                                      onClick={() => isRevealed ? null : handleRetrieveVaultItem(item.id)}
                                      disabled={isRevealed}
                                      className={`p-1.5 rounded transition-all cursor-pointer ${
                                        isRevealed ? 'bg-slate-800 text-slate-600' : 'bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-100'
                                      }`}
                                      title="Reveal Secret"
                                    >
                                      {isRevealed ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                                    </button>
                                    <button
                                      onClick={() => handleDeleteVaultItem(item.id)}
                                      className="p-1.5 rounded bg-slate-800 hover:bg-rose-950/40 text-slate-400 hover:text-rose-400 transition-all cursor-pointer"
                                      title="Delete secret"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  </div>

                </div>

              </div>
            )}

          </div>
        )}

        {/* AI MODEL SELECTION Sub Tab */}
        {activeSubTab === 'parameters' && (
          <div className="space-y-4">
            <div className="pb-2 border-b border-slate-800 mb-1.5">
              <h4 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                <Sliders className="w-4 h-4 text-emerald-400" />
                Active Brain Config (Google AI Studio Models)
              </h4>
              <p className="text-[10px] text-slate-500 mt-0.5">Configure active models used for chat queries and planning generators.</p>
            </div>

            <div className="max-w-xl space-y-3">
              <div className="space-y-1">
                <label className="text-xs text-slate-400 font-semibold block">Select Gemini Core Model</label>
                <select
                  id="gemini_active_model_dropdown"
                  value={activeModel}
                  onChange={(e) => handleSaveModelConfig(e.target.value)}
                  className="w-full bg-slate-850 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500/40 cursor-pointer"
                >
                  {availableModels.map(m => (
                    <option key={m.id} value={m.id}>{m.name}</option>
                  ))}
                </select>
                <p className="text-[10px] text-slate-500 leading-relaxed mt-1">
                  - **Gemini 3.5 Flash**: Default model. Offers exceptional bilingual translation speed and prompt replies.<br />
                  - **Gemini 3.1 Pro Preview**: Deep reasoning model. Highly recommended for multi-task code generation.
                </p>
              </div>

              <div className="p-3 rounded-lg bg-slate-950/20 border border-slate-850 text-xs text-slate-400 leading-relaxed space-y-1.5">
                <p className="font-semibold text-slate-300 flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5 text-emerald-400" />
                  Bilingual Prompts Tuning
                </p>
                <p className="text-[10px]">
                  MAMTA AI is customized to accept Hindi-English hybrid instructions ("Hinglish") and naturally responds with correct bilingual context, keeping templates structured and execution parameters precise.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* DATA PORTABILITY Sub Tab */}
        {activeSubTab === 'data' && (
          <div className="space-y-4">
            <div className="pb-2 border-b border-slate-800 mb-1.5">
              <h4 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                <Database className="w-4 h-4 text-emerald-400" />
                Data Portability & Porting Backups
              </h4>
              <p className="text-[10px] text-slate-500 mt-0.5">Manage platform database exports and backups securely.</p>
            </div>

            <div className="max-w-xl space-y-4">
              <div className="p-4 rounded-lg bg-slate-950/20 border border-slate-850 space-y-3">
                <div className="flex items-start gap-2.5">
                  <Download className="w-3.5 h-3.5 text-emerald-400 mt-0.5" />
                  <div>
                    <h5 className="text-xs font-semibold text-slate-200">Export Local Database Backup</h5>
                    <p className="text-[10px] text-slate-500 mt-0.5 leading-relaxed">
                      Download a complete structured JSON copy of all plans, task lists, conversations, activity timeline feeds, and wiki articles. Sensitive vault details will be masked for export.
                    </p>
                  </div>
                </div>

                <button
                  id="export_db_backup_btn"
                  onClick={handleExportBackup}
                  className="py-1.5 px-3 bg-emerald-500 hover:bg-emerald-600 text-slate-900 font-bold rounded-lg text-xs transition-all shadow cursor-pointer flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download JSON Package</span>
                </button>
              </div>

              {/* Danger zone panel */}
              <div className="p-4 rounded-lg bg-rose-500/5 border border-rose-500/10 space-y-3">
                <div className="flex items-start gap-2.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-400 mt-0.5" />
                  <div>
                    <h5 className="text-xs font-semibold text-rose-400">Danger Zone</h5>
                    <p className="text-[10px] text-slate-500 mt-0.5 leading-relaxed">
                      Erase all conversation feeds, formulated master plans, checklists, and system timeline history. This cannot be undone.
                    </p>
                  </div>
                </div>

                <button
                  id="reset_database_danger_btn"
                  onClick={async () => {
                    if (window.prompt('TYPE "ERASE" TO RESET PLATFORM DATABASE HISTORY:') === 'ERASE') {
                      try {
                        const res = await fetch('/api/chats/clear', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ sessionId })
                        });
                        showSuccess('System database conversation history reset complete.');
                      } catch {
                        showError('Reset failed.');
                      }
                    }
                  }}
                  className="py-1.5 px-3 bg-rose-500/10 border border-rose-500/20 hover:bg-rose-500/20 text-rose-400 font-bold rounded-lg text-xs transition-all cursor-pointer"
                >
                  Execute System Factory Reset
                </button>
              </div>

            </div>
          </div>
        )}

      </div>

    </div>
  );
}
