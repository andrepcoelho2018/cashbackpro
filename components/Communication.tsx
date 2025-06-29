import React, { useState } from 'react';
import { Mail, MessageSquare, Smartphone, Calendar, Plus, Edit, Trash2, Send } from 'lucide-react';

const Communication: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'campaigns' | 'templates' | 'automation'>('campaigns');
  const [showModal, setShowModal] = useState(false);

  const campaigns = [
    {
      id: '1',
      name: 'Boas-vindas Novos Clientes',
      type: 'welcome',
      status: 'active',
      sent: 150,
      opened: 120,
      clicked: 45
    },
    {
      id: '2',
      name: 'Pontos Prestes a Expirar',
      type: 'expiration',
      status: 'active',
      sent: 89,
      opened: 67,
      clicked: 23
    }
  ];

  const templates = [
    {
      id: '1',
      name: 'Boas-vindas',
      channel: 'email',
      subject: 'Bem-vindo ao nosso programa de fidelidade!',
      preview: 'Olá {nome}, seja bem-vindo ao nosso programa...'
    },
    {
      id: '2',
      name: 'Pontos Expiração',
      channel: 'whatsapp',
      subject: 'Seus pontos vão expirar em breve',
      preview: 'Oi {nome}! Você tem {pontos} pontos que expiram em {dias} dias...'
    }
  ];

  const automationRules = [
    {
      id: '1',
      name: 'Novo Cliente Cadastrado',
      trigger: 'customer_registered',
      action: 'send_welcome_email',
      status: 'active'
    },
    {
      id: '2',
      name: 'Pontos Próximos ao Vencimento',
      trigger: 'points_expiring_soon',
      action: 'send_expiration_warning',
      status: 'active'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Comunicação</h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nova Campanha
        </button>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
        <button
          onClick={() => setActiveTab('campaigns')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'campaigns'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Campanhas
        </button>
        <button
          onClick={() => setActiveTab('templates')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'templates'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Templates
        </button>
        <button
          onClick={() => setActiveTab('automation')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'automation'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Automação
        </button>
      </div>

      {activeTab === 'campaigns' && (
        <div className="space-y-6">
          {/* Campaign Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <Send className="w-5 h-5 text-blue-600" />
                  </div>
                </div>
                <div className="ml-5">
                  <p className="text-sm font-medium text-gray-500">Enviadas</p>
                  <p className="text-2xl font-semibold text-gray-900">239</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <Mail className="w-5 h-5 text-green-600" />
                  </div>
                </div>
                <div className="ml-5">
                  <p className="text-sm font-medium text-gray-500">Abertas</p>
                  <p className="text-2xl font-semibold text-gray-900">187</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <MessageSquare className="w-5 h-5 text-purple-600" />
                  </div>
                </div>
                <div className="ml-5">
                  <p className="text-sm font-medium text-gray-500">Cliques</p>
                  <p className="text-2xl font-semibold text-gray-900">68</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-yellow-600" />
                  </div>
                </div>
                <div className="ml-5">
                  <p className="text-sm font-medium text-gray-500">Taxa de Abertura</p>
                  <p className="text-2xl font-semibold text-gray-900">78%</p>
                </div>
              </div>
            </div>
          </div>

          {/* Campaigns List */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Campanhas Ativas</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nome
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tipo
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Enviadas
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Abertas
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cliques
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {campaigns.map((campaign) => (
                    <tr key={campaign.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{campaign.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {campaign.type === 'welcome' ? 'Boas-vindas' : 'Expiração'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          campaign.status === 'active' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {campaign.status === 'active' ? 'Ativa' : 'Inativa'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {campaign.sent}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {campaign.opened}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {campaign.clicked}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button className="text-blue-600 hover:text-blue-900 mr-4">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="text-red-600 hover:text-red-900">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'templates' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Templates de Mensagem</h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {templates.map((template) => (
                  <div key={template.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-lg font-medium text-gray-900">{template.name}</h3>
                      <div className="flex items-center space-x-2">
                        {template.channel === 'email' && <Mail className="w-4 h-4 text-blue-600" />}
                        {template.channel === 'whatsapp' && <MessageSquare className="w-4 h-4 text-green-600" />}
                        {template.channel === 'sms' && <Smartphone className="w-4 h-4 text-purple-600" />}
                        <button className="text-blue-600 hover:text-blue-900">
                          <Edit className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div>
                        <span className="text-sm font-medium text-gray-700">Assunto:</span>
                        <p className="text-sm text-gray-600">{template.subject}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-700">Preview:</span>
                        <p className="text-sm text-gray-600">{template.preview}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'automation' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Régua de Comunicação</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {automationRules.map((rule) => (
                  <div key={rule.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">{rule.name}</h3>
                      <p className="text-sm text-gray-500">
                        Quando: {rule.trigger === 'customer_registered' ? 'Cliente se cadastra' : 'Pontos próximos ao vencimento'}
                      </p>
                      <p className="text-sm text-gray-500">
                        Ação: {rule.action === 'send_welcome_email' ? 'Enviar email de boas-vindas' : 'Enviar aviso de expiração'}
                      </p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        rule.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {rule.status === 'active' ? 'Ativa' : 'Inativa'}
                      </span>
                      <button className="text-blue-600 hover:text-blue-900">
                        <Edit className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Communication;