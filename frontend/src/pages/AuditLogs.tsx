import React, { useEffect, useState } from 'react';
import { ScrollText } from 'lucide-react';
import { AuditLog } from '../types';
import { getAuditLogs } from '../api/audit';
import { formatDistanceToNow } from 'date-fns';
import clsx from 'clsx';

const EVENT_COLORS: Record<string, string> = {
  CREATE_SECRET: 'text-vault-400 bg-vault-900',
  READ_SECRET:   'text-blue-400 bg-blue-900',
  UPDATE_SECRET: 'text-yellow-400 bg-yellow-900',
  DELETE_SECRET: 'text-red-400 bg-red-900',
  SECRET_EXPIRED:'text-orange-400 bg-orange-900',
};

export default function AuditLogs() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getAuditLogs(page, 20).then(data => {
      setLogs(data.content);
      setTotal(data.totalPages);
    }).finally(() => setLoading(false));
  }, [page]);

  return (
    <div className="p-8">
      <div className="flex items-center gap-3 mb-6">
        <ScrollText className="text-vault-500 w-5 h-5" />
        <h1 className="text-2xl font-bold text-white">Audit Log</h1>
        <span className="text-sm text-gray-500">Immutable activity trail</span>
      </div>

      {loading ? (
        <div className="text-center py-16 text-gray-500">Loading...</div>
      ) : (
        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-800 text-gray-400 text-xs uppercase tracking-wide">
                <th className="text-left px-4 py-3">Event</th>
                <th className="text-left px-4 py-3">User</th>
                <th className="text-left px-4 py-3">Description</th>
                <th className="text-left px-4 py-3">When</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {logs.map(log => (
                <tr key={log.id} className="hover:bg-gray-800 transition-colors">
                  <td className="px-4 py-3">
                    <span className={clsx('text-xs px-2 py-0.5 rounded-full font-medium',
                      EVENT_COLORS[log.eventType] ?? 'text-gray-400 bg-gray-800')}>
                      {log.eventType.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-300">{log.username}</td>
                  <td className="px-4 py-3 text-gray-400">{log.description}</td>
                  <td className="px-4 py-3 text-gray-500">
                    {formatDistanceToNow(new Date(log.createdAt), { addSuffix: true })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {total > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          {Array.from({ length: total }, (_, i) => (
            <button key={i} onClick={() => setPage(i)}
              className={clsx('w-8 h-8 rounded-lg text-sm transition-colors',
                page === i ? 'bg-vault-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700')}>
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
