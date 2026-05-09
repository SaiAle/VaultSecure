import React from 'react';
import { Key, Shield, AlertTriangle, Clock } from 'lucide-react';
import { useSecrets } from '../hooks/useSecrets';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { useAuthStore } from '../store/authStore';

const COLORS = ['#22c55e', '#3b82f6', '#a855f7', '#f59e0b', '#ef4444', '#6b7280'];

export default function Dashboard() {
  const { secrets, loading } = useSecrets();
  const { username } = useAuthStore();

  const now = new Date();
  const expired = secrets.filter(s => s.expiresAt && new Date(s.expiresAt) < now);
  const expiringSoon = secrets.filter(s => {
    if (!s.expiresAt) return false;
    const diff = new Date(s.expiresAt).getTime() - now.getTime();
    return diff > 0 && diff < 7 * 86400_000;
  });

  const byCategory = Object.entries(
    secrets.reduce((acc, s) => {
      acc[s.category] = (acc[s.category] ?? 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  ).map(([name, count]) => ({ name, count }));

  const stats = [
    { label: 'Total Secrets',   value: secrets.length, icon: Key,           color: 'text-vault-400' },
    { label: 'Active',          value: secrets.filter(s => s.active).length, icon: Shield, color: 'text-blue-400' },
    { label: 'Expiring Soon',   value: expiringSoon.length, icon: Clock,     color: 'text-yellow-400' },
    { label: 'Expired',         value: expired.length, icon: AlertTriangle,  color: 'text-red-400' },
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Welcome back, {username}</h1>
        <p className="text-gray-400 text-sm mt-1">Your secrets are encrypted and secure</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-gray-900 border border-gray-800 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-sm">{label}</span>
              <Icon className={`w-4 h-4 ${color}`} />
            </div>
            <div className={`text-3xl font-bold ${color}`}>
              {loading ? '—' : value}
            </div>
          </div>
        ))}
      </div>

      {byCategory.length > 0 && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h2 className="text-white font-semibold mb-4">Secrets by Category</h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={byCategory}>
              <XAxis dataKey="name" tick={{ fill: '#9ca3af', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#9ca3af', fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ backgroundColor: '#111827', border: '1px solid #374151', borderRadius: 8 }}
                       labelStyle={{ color: '#fff' }} itemStyle={{ color: '#9ca3af' }} />
              <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                {byCategory.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
