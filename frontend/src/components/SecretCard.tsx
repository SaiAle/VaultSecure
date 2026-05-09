import React, { useState } from 'react';
import { Eye, EyeOff, Copy, Trash2, RefreshCw, Lock } from 'lucide-react';
import { Secret } from '../types';
import { formatDistanceToNow } from 'date-fns';
import clsx from 'clsx';

interface Props {
  secret: Secret;
  onReveal: (id: string) => Promise<string>;
  onDelete: (id: string) => void;
}

const categoryColors: Record<string, string> = {
  password:    'bg-blue-900 text-blue-300',
  api_key:     'bg-purple-900 text-purple-300',
  certificate: 'bg-orange-900 text-orange-300',
  token:       'bg-yellow-900 text-yellow-300',
  note:        'bg-gray-700 text-gray-300',
  other:       'bg-gray-700 text-gray-300',
};

export default function SecretCard({ secret, onReveal, onDelete }: Props) {
  const [revealed, setRevealed] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const toggle = async () => {
    if (revealed) { setRevealed(null); return; }
    setLoading(true);
    try { setRevealed(await onReveal(secret.id)); }
    finally { setLoading(false); }
  };

  const copy = async () => {
    if (!revealed) return;
    await navigator.clipboard.writeText(revealed);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const isExpired = secret.expiresAt && new Date(secret.expiresAt) < new Date();

  return (
    <div className={clsx('bg-gray-900 border rounded-xl p-4 space-y-3 transition-all',
      isExpired ? 'border-red-800 opacity-60' : 'border-gray-800 hover:border-gray-700')}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <Lock className="w-4 h-4 text-vault-500 shrink-0" />
          <span className="font-medium text-white truncate">{secret.name}</span>
        </div>
        <span className={clsx('text-xs px-2 py-0.5 rounded-full shrink-0',
          categoryColors[secret.category] ?? categoryColors.other)}>
          {secret.category}
        </span>
      </div>

      <div className="bg-gray-800 rounded-lg px-3 py-2 font-mono text-sm text-gray-300 min-h-9 flex items-center">
        {revealed ? revealed : '••••••••••••••••'}
      </div>

      <div className="flex items-center justify-between text-xs text-gray-500">
        <span>v{secret.version} · {formatDistanceToNow(new Date(secret.updatedAt), { addSuffix: true })}</span>
        {isExpired && <span className="text-red-400">Expired</span>}
      </div>

      <div className="flex gap-2">
        <button onClick={toggle} disabled={loading}
          className="flex-1 flex items-center justify-center gap-1.5 text-xs bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg py-1.5 transition-colors">
          {loading ? <RefreshCw className="w-3 h-3 animate-spin" /> :
            revealed ? <><EyeOff className="w-3 h-3" />Hide</> : <><Eye className="w-3 h-3" />Reveal</>}
        </button>
        {revealed && (
          <button onClick={copy}
            className="px-3 text-xs bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg py-1.5 transition-colors">
            {copied ? 'Copied!' : <Copy className="w-3 h-3" />}
          </button>
        )}
        <button onClick={() => onDelete(secret.id)}
          className="px-3 text-xs bg-gray-800 hover:bg-red-900 text-gray-400 hover:text-red-300 rounded-lg py-1.5 transition-colors">
          <Trash2 className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
}
