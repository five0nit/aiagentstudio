import { useState, useCallback } from 'react';
import { api } from '../utils/api';
import { API_ENDPOINTS } from '../types/api';
import type { MarketplaceAgent } from '../types/api';

export function useMarketplace() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const getMarketplaceAgents = useCallback(async (params?: {
    category?: string;
    search?: string;
    sort?: 'popular' | 'recent' | 'rating';
    page?: number;
    limit?: number;
  }) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get<{
        agents: MarketplaceAgent[];
        total: number;
        page: number;
        totalPages: number;
      }>(API_ENDPOINTS.marketplace.list, {
        params: params as Record<string, string>
      });
      return response.data;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch marketplace agents'));
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getMarketplaceAgent = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get<MarketplaceAgent>(API_ENDPOINTS.marketplace.get(id));
      return response.data;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch marketplace agent'));
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const installMarketplaceAgent = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post<{ success: boolean; agentId: string }>(
        API_ENDPOINTS.marketplace.install(id)
      );
      return response.data;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to install marketplace agent'));
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    getMarketplaceAgents,
    getMarketplaceAgent,
    installMarketplaceAgent,
  };
}
