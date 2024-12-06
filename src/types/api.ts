// API Response Types
export interface ApiResponse<T> {
  data: T;
  error?: string;
  status: number;
}

// Error Types
export interface ApiError {
  message: string;
  code: string;
  status: number;
}

// Agent Types for API
export interface AgentCreate {
  name: string;
  purpose: string;
  description: string;
  modelConfig: {
    provider: string;
    model: string;
    temperature: number;
    maxTokens: number;
    topP: number;
    frequencyPenalty: number;
    presencePenalty: number;
  };
  interfaceConfig: {
    type: string;
    channels: string[];
    customization?: {
      avatar?: string;
      voice?: string;
      personality?: string;
    };
  };
  tools: string[];
  externalConfig: Record<string, any>;
}

export interface AgentResponse {
  id: string;
  createdAt: string;
  updatedAt: string;
  status: 'active' | 'inactive' | 'error';
  stats: {
    totalInteractions: number;
    successRate: number;
    lastActive: string;
  };
}

// Marketplace Types
export interface MarketplaceAgent {
  id: string;
  name: string;
  description: string;
  category: string;
  rating: number;
  downloads: number;
  price: number | 'free';
  author: {
    id: string;
    name: string;
    verified: boolean;
  };
}

// API Endpoints
export const API_ENDPOINTS = {
  agents: {
    list: '/api/agents',
    create: '/api/agents',
    get: (id: string) => `/api/agents/${id}`,
    update: (id: string) => `/api/agents/${id}`,
    delete: (id: string) => `/api/agents/${id}`,
    toggle: (id: string) => `/api/agents/${id}/toggle`,
  },
  marketplace: {
    list: '/api/marketplace',
    get: (id: string) => `/api/marketplace/${id}`,
    install: (id: string) => `/api/marketplace/${id}/install`,
  },
} as const;
