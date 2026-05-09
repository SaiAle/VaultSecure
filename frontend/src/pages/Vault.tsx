import React, { useState } from 'react';
import { Plus, Search, Filter } from 'lucide-react';
import { useSecrets } from '../hooks/useSecrets';
import SecretCard from '../components/SecretCard';
import { SecretCategory } from '../types';

const CATEGORIES: SecretCategory[] = ['password', 'api_key', 'certificate', 'token', 'note', 'other'];

export default function Vault() {
  const [category, setCategory] = useState('');
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', category: 'password', value: '', expiresAt: '' });
  const { secrets, loading, reveal, create, remove } = useSecrets(category);

  const filtered = secrets.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()));

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    await create({ ...form, expiresAt: form.expiresAt || undefined });
    setForm({ name: '', category: 'password', value: '', expiresAt: '' });
    setShowForm(false);
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Secret Vault</h1>
        <button onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-vault-600 hover:bg-vault-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors">
          <Plus className="w-4 h-4" />
          New Secret
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="bg-gray-900 border border-gray-800 rounded-xl p-5 mb-6 space-y-4">
          <h2 className="text-white font-semibold">Add Secret</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-400 mb-1">Name</label>
              <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} required
                className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-vault-500" />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Category</label>
              <select value={form.category} onChange={e => setForm({...form, category: e.target.value})}
                className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-vault-500">
                {CATEGORIES.map(c => <option key={c} value={c}>{c.replace('_', ' ')}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">Secret Value</label>
            <input type="password" value={form.value} onChange={e => setForm({...form, value: e.target.value})} required
              className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:border-vault-500" />
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">Expires At (optional)</label>
            <input type="datetime-local" value={form.expiresAt} onChange={e => setForm({...form, expiresAt: e.target.value})}
              className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-vault-500" />
          </div>
          <div className="flex gap-3">
            <button type="submit" className="bg-vault-600 hover:bg-vault-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors">
              Save Secret
            </button>
            <button type="button" onClick={() => setShowForm(false)} className="text-gray-400 hover:text-white text-sm px-4 py-2">
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="flex gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-500" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search secrets..."
            className="w-full bg-gray-900 border border-gray-800 text-white rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:border-vault-500" />
        </div>
        <select value={category} onChange={e => setCategory(e.target.value)}
          className="bg-gray-900 border border-gray-800 text-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-vault-500">
          <option value="">All categories</option>
          {CATEGORIES.map(c => <option key={c} value={c}>{c.replace('_', ' ')}</option>)}
        </select>
      </div>

      {loading ? (
        <div className="text-center py-16 text-gray-500">Loading secrets...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-500">No secrets found</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map(s => (
            <SecretCard key={s.id} secret={s} onReveal={reveal} onDelete={remove} />
          ))}
        </div>
      )}
    </div>
  );
}
