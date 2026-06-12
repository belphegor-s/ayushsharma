import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getSession, listKeys, createKey, revokeKey, getCsrfToken } from './api';
import { useState, useEffect } from 'react';

export function useSession() {
  const [csrf, setCsrf] = useState('');
  useEffect(() => {
    getCsrfToken().then(setCsrf);
  }, []);

  const q = useQuery({
    queryKey: ['session'],
    queryFn: getSession,
    staleTime: 30_000,
  });
  return { session: q.data, csrf, isLoading: q.isLoading };
}

export function useKeys(sessionId: string | undefined) {
  return useQuery({
    queryKey: ['keys', sessionId],
    queryFn: listKeys,
    enabled: !!sessionId,
  });
}

export function useCreateKey() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createKey,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['keys'] }),
  });
}

export function useRevokeKey() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: revokeKey,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['keys'] }),
  });
}
