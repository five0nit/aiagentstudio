import { useState, useCallback } from 'react';
import { api } from '../utils/api';
import { API_ENDPOINTS } from '../types/api';
import type { AgentCreate, AgentResponse } from '../types/api';

export function useAgents() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const getAgents = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get<AgentResponse[]>(API_ENDPOINTS.agents.list);
      return response.data;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch agents'));
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const createAgent = useCallback(async (agent: AgentCreate) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post<AgentResponse>(API_ENDPOINTS.agents.create, agent);
      return response.data;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to create agent'));
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateAgent = useCallback(async (id: string, updates: Partial<AgentCreate>) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.patch<AgentResponse>(API_ENDPOINTS.agents.update(id), updates);
      return response.data;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to update agent'));
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteAgent = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await api.delete(API_ENDPOINTS.agents.delete(id));
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to delete agent'));
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const toggleAgent = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post<AgentResponse>(API_ENDPOINTS.agents.toggle(id));
      return response.data;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to toggle agent'));
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    getAgents,
    createAgent,
    updateAgent,
    deleteAgent,
    toggleAgent,
  };
}
