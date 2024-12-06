import { useState } from 'react';

interface Agent {
  id: string;
  name: string;
  purpose: string;
  description: string;
  isActive: boolean;
  modelConfig: {
    provider: string;
    model: string;
    temperature: number;
  };
  interfaceConfig: {
    type: string;
    channels: string[];
  };
  tools: string[];
  externalConfig: Record<string, any>;
}

const MyAgents = () => {
  const [expandedAgent, setExpandedAgent] = useState<string | null>(null);
  const [agents, setAgents] = useState<Agent[]>([
    {
      id: '1',
      name: 'Email Assistant',
      purpose: 'customer-support',
      description: 'Handles customer support emails with automated responses and ticket categorization',
      isActive: true,
      modelConfig: {
        provider: 'openai',
        model: 'gpt-4',
        temperature: 0.7
      },
      interfaceConfig: {
        type: 'email',
        channels: ['Email Client']
      },
      tools: ['sentiment-analysis', 'multi-language', 'ticket-routing'],
      externalConfig: {
        emailClient: '',
        emailAddress: '',
        signature: ''
      }
    },
    {
      id: '2',
      name: 'Code Review Assistant',
      purpose: 'development',
      description: 'Reviews pull requests, suggests improvements, and checks for security vulnerabilities',
      isActive: false,
      modelConfig: {
        provider: 'openai',
        model: 'gpt-4',
        temperature: 0.3
      },
      interfaceConfig: {
        type: 'github',
        channels: ['Pull Requests', 'Issues']
      },
      tools: ['code-analysis', 'security-scan', 'best-practices'],
      externalConfig: {
        githubToken: '',
        repositories: []
      }
    },
    {
      id: '3',
      name: 'Social Media Manager',
      purpose: 'marketing',
      description: 'Creates and schedules social media content across multiple platforms',
      isActive: true,
      modelConfig: {
        provider: 'anthropic',
        model: 'claude-2',
        temperature: 0.8
      },
      interfaceConfig: {
        type: 'social',
        channels: ['Twitter', 'LinkedIn', 'Instagram']
      },
      tools: ['content-generation', 'image-analysis', 'trend-analysis', 'scheduling'],
      externalConfig: {
        platforms: {},
        postingSchedule: {}
      }
    },
    {
      id: '4',
      name: 'Data Analysis Assistant',
      purpose: 'analytics',
      description: 'Processes and analyzes data, generates reports, and provides insights',
      isActive: false,
      modelConfig: {
        provider: 'openai',
        model: 'gpt-4',
        temperature: 0.2
      },
      interfaceConfig: {
        type: 'data',
        channels: ['CSV', 'SQL', 'API']
      },
      tools: ['data-visualization', 'statistical-analysis', 'report-generation'],
      externalConfig: {
        dataSources: [],
        reportTemplates: {}
      }
    }
  ]);

  const toggleAgentStatus = (agentId: string) => {
    setAgents(agents.map(agent => {
      if (agent.id === agentId) {
        // Simulate starting/stopping the agent
        console.log(`${agent.isActive ? 'Stopping' : 'Starting'} agent: ${agent.name}`);
        return { ...agent, isActive: !agent.isActive };
      }
      return agent;
    }));
  };

  const renderExternalConfigFields = (agent: Agent) => {
    if (agent.interfaceConfig.type === 'email' && agent.interfaceConfig.channels.includes('Email Client')) {
      return (
        <div className="mt-4 space-y-4 border-t pt-4">
          <h4 className="text-lg font-medium text-gray-900">Email Configuration</h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Email Client</label>
              <select
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                value={agent.externalConfig.emailClient}
                onChange={() => {}}
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
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                value={agent.externalConfig.emailAddress}
                onChange={() => {}}
                placeholder="agent@example.com"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700">Email Signature</label>
              <textarea
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                rows={3}
                value={agent.externalConfig.signature}
                onChange={() => {}}
                placeholder="Best regards,&#10;AI Assistant"
              />
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">My Agents</h1>
      <div className="grid gap-6">
        {agents.map((agent) => (
          <div key={agent.id} className="bg-white shadow rounded-lg overflow-hidden">
            <div className="p-6">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-4">
                  <h2 className="text-xl font-semibold text-gray-900">{agent.name}</h2>
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${
                      agent.isActive ? 'bg-green-500 animate-pulse' : 'bg-gray-400'
                    }`} />
                    <span className={`text-sm font-medium ${
                      agent.isActive ? 'text-green-600' : 'text-gray-500'
                    }`}>
                      {agent.isActive ? 'Running' : 'Stopped'}
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => toggleAgentStatus(agent.id)}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                      agent.isActive
                        ? 'bg-red-100 text-red-700 hover:bg-red-200'
                        : 'bg-green-100 text-green-700 hover:bg-green-200'
                    }`}
                  >
                    {agent.isActive ? 'Stop Agent' : 'Start Agent'}
                  </button>
                  <button
                    onClick={() => setExpandedAgent(expandedAgent === agent.id ? null : agent.id)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    {expandedAgent === agent.id ? 'Collapse' : 'Expand'}
                  </button>
                </div>
              </div>
              <p className="mt-2 text-gray-600">{agent.description}</p>
              <div className="mt-2 flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-500">Type:</span>
                <span className="text-sm text-gray-900">{agent.interfaceConfig.type}</span>
              </div>
            </div>
            
            {expandedAgent === agent.id && (
              <div className="border-t border-gray-200 p-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Model Configuration</h3>
                    <dl className="grid grid-cols-2 gap-x-4 gap-y-2">
                      <dt className="text-sm font-medium text-gray-500">Provider</dt>
                      <dd className="text-sm text-gray-900">{agent.modelConfig.provider}</dd>
                      <dt className="text-sm font-medium text-gray-500">Model</dt>
                      <dd className="text-sm text-gray-900">{agent.modelConfig.model}</dd>
                      <dt className="text-sm font-medium text-gray-500">Temperature</dt>
                      <dd className="text-sm text-gray-900">{agent.modelConfig.temperature}</dd>
                    </dl>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Interface Configuration</h3>
                    <dl className="grid grid-cols-2 gap-x-4 gap-y-2">
                      <dt className="text-sm font-medium text-gray-500">Type</dt>
                      <dd className="text-sm text-gray-900">{agent.interfaceConfig.type}</dd>
                      <dt className="text-sm font-medium text-gray-500">Channels</dt>
                      <dd className="text-sm text-gray-900">{agent.interfaceConfig.channels.join(', ')}</dd>
                    </dl>
                  </div>
                </div>
                
                <div className="mt-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Tools</h3>
                  <div className="flex flex-wrap gap-2">
                    {agent.tools.map((tool) => (
                      <span
                        key={tool}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                      >
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>

                {renderExternalConfigFields(agent)}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyAgents;
