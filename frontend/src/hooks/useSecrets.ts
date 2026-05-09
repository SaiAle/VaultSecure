import { useState, useEffect, useCallback } from 'react';
import { Secret } from '../types';
import * as api from '../api/secrets';

export function useSecrets(category?: string) {
  const [secrets, setSecrets] = useState<Secret[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.listSecrets(category);
      setSecrets(data);
      setError(null);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [category]);

  useEffect(() => { fetch(); }, [fetch]);

  const reveal = async (id: string): Promise<string> => {
    const s = await api.getSecret(id);
    return s.value ?? '';
  };

  const create = async (data: Parameters<typeof api.createSecret>[0]) => {
    await api.createSecret(data);
    await fetch();
  };

  const remove = async (id: string) => {
    await api.deleteSecret(id);
    setSecrets((prev) => prev.filter((s) => s.id !== id));
  };

  return { secrets, loading, error, reveal, create, remove, refresh: fetch };
}
