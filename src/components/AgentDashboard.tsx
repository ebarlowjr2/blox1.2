import React from 'react';

interface Tool {
  name: string;
  icon: string;
  connected: boolean;
}

interface Integration {
  category: string;
  tools: Tool[];
}

const AgentDashboard: React.FC = () => {
  const integrations: Integration[] = [
    {
      category: 'Communication',
      tools: [
        { name: 'Gmail', icon: '📧', connected: true },
        { name: 'Google Drive', icon: '📁', connected: true },
        { name: 'Google Search', icon: '🔍', connected: true },
        { name: 'Twilio SMS', icon: '💬', connected: true },
        { name: 'HubSpot CRM', icon: '🎯', connected: true },
      ]
    },
  ];

  return (
    <div className="agent-dashboard">
      <h2>Agent Integrations</h2>
      {integrations.map((integration, index) => (
        <div key={index} className="integration-category">
          <h3>{integration.category}</h3>
          <div className="tools-grid">
            {integration.tools.map((tool, toolIndex) => (
              <div key={toolIndex} className={`tool-card ${tool.connected ? 'connected' : 'disconnected'}`}>
                <span className="tool-icon">{tool.icon}</span>
                <span className="tool-name">{tool.name}</span>
                <span className={`status ${tool.connected ? 'connected' : 'disconnected'}`}>
                  {tool.connected ? '✅' : '❌'}
                </span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default AgentDashboard;
