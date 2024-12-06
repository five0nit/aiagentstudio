import { useState, useEffect } from 'react';

// Moved interfaces to top for better organization
interface Tool {
  id: string;
  name: string;
  description: string;
  category: string;
}

interface ModelConfig {
  provider: string;
  model: string;
  temperature: number;
  maxTokens: number;
  topP: number;
  frequencyPenalty: number;
  presencePenalty: number;
}

interface InterfaceConfig {
  type: string;
  channels: string[];
  customization: {
    avatar?: string;
    voice?: string;
    personality?: string;
  };
}

interface ExternalConfig {
  emailClient?: string;
  emailAddress?: string;
  signature?: string;
  slackWorkspace?: string;
  slackChannel?: string;
  teamsChannel?: string;
  teamsTeam?: string;
  webhookUrl?: string;
  apiKey?: string;
}

// Consolidated configuration data
const MODEL_PROVIDERS = {
  openai: {
    name: 'OpenAI',
    models: ['gpt-4', 'gpt-4-turbo', 'gpt-3.5-turbo']
  },
  anthropic: {
    name: 'Anthropic',
    models: ['claude-2', 'claude-instant']
  },
  google: {
    name: 'Google AI',
    models: ['gemini-pro', 'gemini-ultra']
  },
  mistral: {
    name: 'Mistral AI',
    models: ['mistral-medium', 'mistral-large']
  }
};

const INTERFACE_TYPES = {
  chat: {
    name: 'Chat Interface',
    description: 'Interactive web-based chat interface',
    channels: ['Website Widget', 'Mobile App', 'Slack', 'Microsoft Teams']
  },
  voice: {
    name: 'Voice Interface',
    description: 'Voice-based interaction system',
    channels: ['Phone', 'Voice Assistant', 'Mobile App']
  },
  email: {
    name: 'Email Interface',
    description: 'Email-based communication system',
    channels: ['Email Client', 'CRM Integration']
  },
  api: {
    name: 'API Interface',
    description: 'Programmable REST API endpoints',
    channels: ['Custom API', 'Webhooks', 'SDK']
  }
};

// Consolidated tools list with categories
const TOOLS: Tool[] = [
  // Knowledge & Learning
  {
    id: 'knowledge-base',
    name: 'Knowledge Base',
    description: 'Access and manage custom knowledge repositories',
    category: 'Knowledge'
  },
  {
    id: 'learning-system',
    name: 'Learning System',
    description: 'Continuous learning from interactions',
    category: 'Knowledge'
  },
  
  // Communication
  {
    id: 'multi-language',
    name: 'Multi-language Support',
    description: 'Communicate in multiple languages',
    category: 'Communication'
  },
  {
    id: 'sentiment-analysis',
    name: 'Sentiment Analysis',
    description: 'Analyze and respond to user emotions',
    category: 'Communication'
  },
  
  // Task Automation
  {
    id: 'workflow-automation',
    name: 'Workflow Automation',
    description: 'Automate repetitive tasks and processes',
    category: 'Automation'
  },
  {
    id: 'scheduling',
    name: 'Smart Scheduling',
    description: 'Intelligent appointment and task scheduling',
    category: 'Automation'
  },
  
  // Integration
  {
    id: 'crm-integration',
    name: 'CRM Integration',
    description: 'Connect with popular CRM systems',
    category: 'Integration'
  },
  {
    id: 'api-connector',
    name: 'API Connector',
    description: 'Connect with external services via API',
    category: 'Integration'
  }
];

const CreateAgent = () => {
  // Form state
  const [agentName, setAgentName] = useState('');
  const [description, setDescription] = useState('');
  const [purpose, setPurpose] = useState('');
  
  // Configuration state
  const [modelConfig, setModelConfig] = useState<ModelConfig>({
    provider: 'openai',
    model: 'gpt-4',
    temperature: 0.7,
    maxTokens: 2048,
    topP: 1,
    frequencyPenalty: 0,
    presencePenalty: 0
  });

  const [interfaceConfig, setInterfaceConfig] = useState<InterfaceConfig>({
    type: 'chat',
    channels: [],
    customization: {}
  });

  const [externalConfig, setExternalConfig] = useState<ExternalConfig>({});
  const [selectedTools, setSelectedTools] = useState<string[]>([]);

  // Effect to reset external config when interface type or channels change
  useEffect(() => {
    setExternalConfig({});
  }, [interfaceConfig.type, interfaceConfig.channels]);

  // Handlers
  const handleToolSelection = (toolId: string) => {
    setSelectedTools(prev =>
      prev.includes(toolId)
        ? prev.filter(id => id !== toolId)
        : [...prev, toolId]
    );
  };

  const handleInterfaceTypeChange = (type: string) => {
    setInterfaceConfig(prev => ({
      ...prev,
      type,
      channels: [] // Reset channels when type changes
    }));
  };

  const handleChannelToggle = (channel: string) => {
    setInterfaceConfig(prev => ({
      ...prev,
      channels: prev.channels.includes(channel)
        ? prev.channels.filter(c => c !== channel)
        : [...prev.channels, channel]
    }));
  };

  const handleExternalConfigChange = (field: keyof ExternalConfig, value: string) => {
    setExternalConfig(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({
      basicInfo: {
        agentName,
        description,
        purpose
      },
      modelConfig,
      interfaceConfig,
      externalConfig,
      selectedTools
    });
  };

  // Reusable components
  const FormSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <section className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 space-y-4 mb-6">
      <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
      {children}
    </section>
  );

  const renderExternalConfigFields = () => {
    const fields = [];

    if (interfaceConfig.type === 'email' && interfaceConfig.channels.includes('Email Client')) {
      fields.push(
        <div key="email" className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">Email Configuration</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Email Client</label>
              <select
                value={externalConfig.emailClient || ''}
                onChange={(e) => handleExternalConfigChange('emailClient', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              >
                <option value="">Select Email Client</option>
                <option value="gmail">Gmail</option>
                <option value="outlook">Outlook</option>
                <option value="custom">Custom SMTP</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email Address</label>
              <input
                type="email"
                value={externalConfig.emailAddress || ''}
                onChange={(e) => handleExternalConfigChange('emailAddress', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                placeholder="agent@example.com"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700">Email Signature</label>
              <textarea
                value={externalConfig.signature || ''}
                onChange={(e) => handleExternalConfigChange('signature', e.target.value)}
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                placeholder="Best regards,&#10;AI Assistant"
              />
            </div>
          </div>
        </div>
      );
    }

    if (interfaceConfig.type === 'chat') {
      if (interfaceConfig.channels.includes('Slack')) {
        fields.push(
          <div key="slack" className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Slack Configuration</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Workspace</label>
                <input
                  type="text"
                  value={externalConfig.slackWorkspace || ''}
                  onChange={(e) => handleExternalConfigChange('slackWorkspace', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  placeholder="workspace.slack.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Channel</label>
                <input
                  type="text"
                  value={externalConfig.slackChannel || ''}
                  onChange={(e) => handleExternalConfigChange('slackChannel', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  placeholder="#channel-name"
                />
              </div>
            </div>
          </div>
        );
      }

      if (interfaceConfig.channels.includes('Microsoft Teams')) {
        fields.push(
          <div key="teams" className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Microsoft Teams Configuration</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Team</label>
                <input
                  type="text"
                  value={externalConfig.teamsTeam || ''}
                  onChange={(e) => handleExternalConfigChange('teamsTeam', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  placeholder="Team Name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Channel</label>
                <input
                  type="text"
                  value={externalConfig.teamsChannel || ''}
                  onChange={(e) => handleExternalConfigChange('teamsChannel', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  placeholder="Channel Name"
                />
              </div>
            </div>
          </div>
        );
      }
    }

    if (interfaceConfig.type === 'api') {
      fields.push(
        <div key="api" className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">API Configuration</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700">Webhook URL</label>
              <input
                type="url"
                value={externalConfig.webhookUrl || ''}
                onChange={(e) => handleExternalConfigChange('webhookUrl', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                placeholder="https://api.example.com/webhook"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700">API Key</label>
              <input
                type="password"
                value={externalConfig.apiKey || ''}
                onChange={(e) => handleExternalConfigChange('apiKey', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                placeholder="Enter API Key"
              />
            </div>
          </div>
        </div>
      );
    }

    return fields.length > 0 ? (
      <FormSection title="External Service Configuration">
        <div className="space-y-6">
          {fields}
        </div>
      </FormSection>
    ) : null;
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Create Your AI Agent</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <FormSection title="Agent Purpose & Identity">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Agent Name</label>
              <input
                type="text"
                value={agentName}
                onChange={(e) => setAgentName(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                placeholder="Give your agent a name"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Primary Purpose</label>
              <select
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              >
                <option value="">Select a purpose</option>
                <option value="customer-support">Customer Support</option>
                <option value="sales">Sales & Lead Generation</option>
                <option value="personal-assistant">Personal Assistant</option>
                <option value="research">Research & Analysis</option>
                <option value="custom">Custom Purpose</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                placeholder="Describe what your agent will do and how it will help users"
              />
            </div>
          </div>
        </FormSection>

        <FormSection title="AI Model Configuration">
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Provider</label>
                <select
                  value={modelConfig.provider}
                  onChange={(e) => setModelConfig({...modelConfig, provider: e.target.value, model: MODEL_PROVIDERS[e.target.value as keyof typeof MODEL_PROVIDERS].models[0]})}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                >
                  {Object.entries(MODEL_PROVIDERS).map(([key, { name }]) => (
                    <option key={key} value={key}>{name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Model</label>
                <select
                  value={modelConfig.model}
                  onChange={(e) => setModelConfig({...modelConfig, model: e.target.value})}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                >
                  {MODEL_PROVIDERS[modelConfig.provider as keyof typeof MODEL_PROVIDERS].models.map(model => (
                    <option key={model} value={model}>{model}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Creativity (Temperature: {modelConfig.temperature})
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={modelConfig.temperature}
                onChange={(e) => setModelConfig({...modelConfig, temperature: parseFloat(e.target.value)})}
                className="mt-1 block w-full"
              />
              <div className="mt-1 flex justify-between text-xs text-gray-500">
                <span>More Focused</span>
                <span>More Creative</span>
              </div>
            </div>
          </div>
        </FormSection>

        <FormSection title="Interface & Interaction">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Interface Type</h3>
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(INTERFACE_TYPES).map(([type, config]) => (
                  <div
                    key={type}
                    className={`relative rounded-lg border p-4 cursor-pointer ${
                      interfaceConfig.type === type
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                    onClick={() => handleInterfaceTypeChange(type)}
                  >
                    <h4 className="text-sm font-medium text-gray-900">{config.name}</h4>
                    <p className="mt-1 text-sm text-gray-500">{config.description}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Available Channels</h3>
              <div className="grid grid-cols-2 gap-4">
                {INTERFACE_TYPES[interfaceConfig.type as keyof typeof INTERFACE_TYPES].channels.map((channel) => (
                  <div key={channel} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={interfaceConfig.channels.includes(channel)}
                      onChange={() => handleChannelToggle(channel)}
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label className="ml-2 text-sm text-gray-700">{channel}</label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </FormSection>

        {renderExternalConfigFields()}

        <FormSection title="Tools & Capabilities">
          <div className="space-y-6">
            <div className="flex gap-2 flex-wrap">
              {Array.from(new Set(TOOLS.map(tool => tool.category))).map((category) => (
                <button
                  key={category}
                  type="button"
                  className="px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200"
                >
                  {category}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-4">
              {TOOLS.map((tool) => (
                <div
                  key={tool.id}
                  className={`relative rounded-lg border p-4 cursor-pointer ${
                    selectedTools.includes(tool.id)
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                  onClick={() => handleToolSelection(tool.id)}
                >
                  <h3 className="text-sm font-medium text-gray-900">{tool.name}</h3>
                  <p className="mt-1 text-sm text-gray-500">{tool.description}</p>
                  <span className="mt-2 inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
                    {tool.category}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </FormSection>

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            Create Agent
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateAgent;
