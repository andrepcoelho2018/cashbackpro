import React, { useState } from 'react';
import { Settings as SettingsIcon, Palette, Bell, FileText, Store, Save, Shield } from 'lucide-react';
import { useApp } from '../context/AppContext';

const Settings: React.FC = () => {
  const { settings, updateSettings } = useApp();
  const [activeTab, setActiveTab] = useState<'company' | 'program' | 'validation' | 'notifications' | 'terms'>('company');
  const [formData, setFormData] = useState(settings);
  const [customPrimaryColor, setCustomPrimaryColor] = useState('');
  const [customSecondaryColor, setCustomSecondaryColor] = useState('');

  const handleSave = () => {
    updateSettings(formData);
    // Show success message
  };

  const colorOptions = [
    '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4',
    '#84CC16', '#F97316', '#EC4899', '#6366F1', '#FFD700', '#CD7F32',
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD',
    '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9', '#F8C471', '#82E0AA'
  ];

  const fontOptions = [
    'Inter', 'Roboto', 'Open Sans', 'Lato', 'Montserrat', 'Poppins'
  ];

  const handleCustomColorChange = (type: 'primary' | 'secondary', color: string) => {
    // Validar formato HEX
    const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
    if (hexRegex.test(color) || color === '') {
      if (type === 'primary') {
        setCustomPrimaryColor(color);
        if (hexRegex.test(color)) {
          setFormData({
            ...formData,
            program: { ...formData.program, primaryColor: color }
          });
        }
      } else {
        setCustomSecondaryColor(color);
        if (hexRegex.test(color)) {
          setFormData({
            ...formData,
            program: { ...formData.program, secondaryColor: color }
          });
        }
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Personalização</h1>
        <button
          onClick={handleSave}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
        >
          <Save className="w-4 h-4 mr-2" />
          Salvar Alterações
        </button>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
        <button
          onClick={() => setActiveTab('company')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors flex items-center justify-center ${
            activeTab === 'company'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <Store className="w-4 h-4 mr-2" />
          Empresa
        </button>
        <button
          onClick={() => setActiveTab('program')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors flex items-center justify-center ${
            activeTab === 'program'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <Palette className="w-4 h-4 mr-2" />
          Programa
        </button>
        <button
          onClick={() => setActiveTab('validation')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors flex items-center justify-center ${
            activeTab === 'validation'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <Shield className="w-4 h-4 mr-2" />
          Validação
        </button>
        <button
          onClick={() => setActiveTab('notifications')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors flex items-center justify-center ${
            activeTab === 'notifications'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <Bell className="w-4 h-4 mr-2" />
          Notificações
        </button>
        <button
          onClick={() => setActiveTab('terms')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors flex items-center justify-center ${
            activeTab === 'terms'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <FileText className="w-4 h-4 mr-2" />
          Regulamento
        </button>
      </div>

      {activeTab === 'company' && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Informações da Empresa</h2>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nome da Empresa</label>
              <input
                type="text"
                value={formData.company.name}
                onChange={(e) => setFormData({
                  ...formData,
                  company: { ...formData.company, name: e.target.value }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
              <input
                type="url"
                value={formData.company.website}
                onChange={(e) => setFormData({
                  ...formData,
                  company: { ...formData.company, website: e.target.value }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Endereço</label>
              <textarea
                value={formData.company.address}
                onChange={(e) => setFormData({
                  ...formData,
                  company: { ...formData.company, address: e.target.value }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                rows={3}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Logo da Empresa</label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                <div className="space-y-1 text-center">
                  <SettingsIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="flex text-sm text-gray-600">
                    <label className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500">
                      <span>Upload um arquivo</span>
                      <input type="file" className="sr-only" accept="image/*" />
                    </label>
                    <p className="pl-1">ou arraste e solte</p>
                  </div>
                  <p className="text-xs text-gray-500">PNG, JPG, GIF até 10MB</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'program' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Configurações do Programa</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nome do Programa</label>
                <input
                  type="text"
                  value={formData.program.name}
                  onChange={(e) => setFormData({
                    ...formData,
                    program: { ...formData.program, name: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Pontos por Real (R$)</label>
                  <input
                    type="number"
                    value={formData.program.pointsPerReal}
                    onChange={(e) => setFormData({
                      ...formData,
                      program: { ...formData.program, pointsPerReal: Number(e.target.value) }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Valor Mínimo de Compra (R$)</label>
                  <input
                    type="number"
                    value={formData.program.minPurchaseValue}
                    onChange={(e) => setFormData({
                      ...formData,
                      program: { ...formData.program, minPurchaseValue: Number(e.target.value) }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Fonte</label>
                <select
                  value={formData.program.font}
                  onChange={(e) => setFormData({
                    ...formData,
                    program: { ...formData.program, font: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  {fontOptions.map(font => (
                    <option key={font} value={font}>{font}</option>
                  ))}
                </select>
              </div>

              {/* Cor Primária */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Cor Primária</label>
                
                {/* Paleta de Cores */}
                <div className="mb-4">
                  <p className="text-xs text-gray-500 mb-2">Selecione uma cor da paleta:</p>
                  <div className="flex flex-wrap gap-2">
                    {colorOptions.map(color => (
                      <button
                        key={color}
                        onClick={() => setFormData({
                          ...formData,
                          program: { ...formData.program, primaryColor: color }
                        })}
                        className={`w-10 h-10 rounded-lg border-2 transition-all hover:scale-110 ${
                          formData.program.primaryColor === color ? 'border-gray-800 shadow-lg' : 'border-gray-300'
                        }`}
                        style={{ backgroundColor: color }}
                        title={color}
                      />
                    ))}
                  </div>
                </div>

                {/* Input HEX Personalizado */}
                <div>
                  <p className="text-xs text-gray-500 mb-2">Ou digite um código HEX personalizado:</p>
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center">
                      <span className="text-sm text-gray-700 mr-2">#</span>
                      <input
                        type="text"
                        value={customPrimaryColor.replace('#', '')}
                        onChange={(e) => handleCustomColorChange('primary', '#' + e.target.value)}
                        placeholder="3B82F6"
                        maxLength={6}
                        className="w-24 px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 text-sm font-mono"
                      />
                    </div>
                    <div 
                      className="w-8 h-8 rounded border-2 border-gray-300"
                      style={{ backgroundColor: formData.program.primaryColor }}
                    />
                    <span className="text-sm text-gray-600 font-mono">{formData.program.primaryColor}</span>
                  </div>
                </div>
              </div>

              {/* Cor Secundária */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Cor Secundária</label>
                
                {/* Paleta de Cores */}
                <div className="mb-4">
                  <p className="text-xs text-gray-500 mb-2">Selecione uma cor da paleta:</p>
                  <div className="flex flex-wrap gap-2">
                    {colorOptions.map(color => (
                      <button
                        key={color}
                        onClick={() => setFormData({
                          ...formData,
                          program: { ...formData.program, secondaryColor: color }
                        })}
                        className={`w-10 h-10 rounded-lg border-2 transition-all hover:scale-110 ${
                          formData.program.secondaryColor === color ? 'border-gray-800 shadow-lg' : 'border-gray-300'
                        }`}
                        style={{ backgroundColor: color }}
                        title={color}
                      />
                    ))}
                  </div>
                </div>

                {/* Input HEX Personalizado */}
                <div>
                  <p className="text-xs text-gray-500 mb-2">Ou digite um código HEX personalizado:</p>
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center">
                      <span className="text-sm text-gray-700 mr-2">#</span>
                      <input
                        type="text"
                        value={customSecondaryColor.replace('#', '')}
                        onChange={(e) => handleCustomColorChange('secondary', '#' + e.target.value)}
                        placeholder="10B981"
                        maxLength={6}
                        className="w-24 px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 text-sm font-mono"
                      />
                    </div>
                    <div 
                      className="w-8 h-8 rounded border-2 border-gray-300"
                      style={{ backgroundColor: formData.program.secondaryColor }}
                    />
                    <span className="text-sm text-gray-600 font-mono">{formData.program.secondaryColor}</span>
                  </div>
                </div>
              </div>

              {/* Preview das Cores */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-sm font-medium text-gray-900 mb-3">Preview das Cores</h3>
                <div className="flex space-x-4">
                  <div className="flex-1">
                    <div 
                      className="h-16 rounded-lg flex items-center justify-center text-white font-medium"
                      style={{ backgroundColor: formData.program.primaryColor }}
                    >
                      Cor Primária
                    </div>
                    <p className="text-xs text-center mt-1 font-mono">{formData.program.primaryColor}</p>
                  </div>
                  <div className="flex-1">
                    <div 
                      className="h-16 rounded-lg flex items-center justify-center text-white font-medium"
                      style={{ backgroundColor: formData.program.secondaryColor }}
                    >
                      Cor Secundária
                    </div>
                    <p className="text-xs text-center mt-1 font-mono">{formData.program.secondaryColor}</p>
                  </div>
                  <div className="flex-1">
                    <div 
                      className="h-16 rounded-lg flex items-center justify-center text-white font-medium"
                      style={{ 
                        background: `linear-gradient(45deg, ${formData.program.primaryColor}, ${formData.program.secondaryColor})`
                      }}
                    >
                      Gradiente
                    </div>
                    <p className="text-xs text-center mt-1">Combinação</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Expiração de Pontos</h2>
            
            <div className="space-y-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="pointsExpiration"
                  checked={formData.program.pointsExpiration.enabled}
                  onChange={(e) => setFormData({
                    ...formData,
                    program: {
                      ...formData.program,
                      pointsExpiration: {
                        ...formData.program.pointsExpiration,
                        enabled: e.target.checked
                      }
                    }
                  })}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="pointsExpiration" className="ml-2 block text-sm text-gray-900">
                  Ativar expiração de pontos
                </label>
              </div>

              {formData.program.pointsExpiration.enabled && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Período de Expiração (dias)</label>
                    <input
                      type="number"
                      value={formData.program.pointsExpiration.days}
                      onChange={(e) => setFormData({
                        ...formData,
                        program: {
                          ...formData.program,
                          pointsExpiration: {
                            ...formData.program.pointsExpiration,
                            days: Number(e.target.value)
                          }
                        }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Notificar antes (dias)</label>
                    <input
                      type="number"
                      value={formData.program.pointsExpiration.notifyDaysBefore}
                      onChange={(e) => setFormData({
                        ...formData,
                        program: {
                          ...formData.program,
                          pointsExpiration: {
                            ...formData.program.pointsExpiration,
                            notifyDaysBefore: Number(e.target.value)
                          }
                        }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'validation' && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Configurações de Validação</h2>
          
          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="text-sm font-medium text-blue-800 mb-2">Sistema de Chaves</h3>
              <p className="text-sm text-blue-700">
                <strong>Chave Primária:</strong> CPF - Identificador único obrigatório<br/>
                <strong>Chaves Secundárias:</strong> Email e Telefone - Para comunicação e indicações
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Validação de CPF</h3>
                  <p className="text-sm text-gray-500">Verificar se o CPF é válido matematicamente</p>
                </div>
                <input
                  type="checkbox"
                  checked={formData.validation.requireCpfValidation}
                  onChange={(e) => setFormData({
                    ...formData,
                    validation: { ...formData.validation, requireCpfValidation: e.target.checked }
                  })}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
              </div>

              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Verificação de Email</h3>
                  <p className="text-sm text-gray-500">Exigir verificação por email antes de ativar conta</p>
                </div>
                <input
                  type="checkbox"
                  checked={formData.validation.requireEmailVerification}
                  onChange={(e) => setFormData({
                    ...formData,
                    validation: { ...formData.validation, requireEmailVerification: e.target.checked }
                  })}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
              </div>

              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Verificação de Telefone</h3>
                  <p className="text-sm text-gray-500">Exigir verificação por SMS antes de ativar conta</p>
                </div>
                <input
                  type="checkbox"
                  checked={formData.validation.requirePhoneVerification}
                  onChange={(e) => setFormData({
                    ...formData,
                    validation: { ...formData.validation, requirePhoneVerification: e.target.checked }
                  })}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
              </div>

              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Permitir Email Duplicado</h3>
                  <p className="text-sm text-gray-500">Permitir que o mesmo email seja usado por CPFs diferentes</p>
                </div>
                <input
                  type="checkbox"
                  checked={formData.validation.allowDuplicateEmail}
                  onChange={(e) => setFormData({
                    ...formData,
                    validation: { ...formData.validation, allowDuplicateEmail: e.target.checked }
                  })}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
              </div>

              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Permitir Telefone Duplicado</h3>
                  <p className="text-sm text-gray-500">Permitir que o mesmo telefone seja usado por CPFs diferentes</p>
                </div>
                <input
                  type="checkbox"
                  checked={formData.validation.allowDuplicatePhone}
                  onChange={(e) => setFormData({
                    ...formData,
                    validation: { ...formData.validation, allowDuplicatePhone: e.target.checked }
                  })}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h3 className="text-sm font-medium text-yellow-800 mb-2">Importante</h3>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>• O CPF sempre será único no sistema (chave primária)</li>
                <li>• Email e telefone podem ser usados para indicações mesmo se duplicados</li>
                <li>• Recomendamos manter email único para melhor experiência do usuário</li>
                <li>• Telefone duplicado é comum em famílias que compartilham números</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'notifications' && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Configurações de Notificação</h2>
          
          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <h3 className="text-sm font-medium text-gray-900">Email</h3>
                <p className="text-sm text-gray-500">Enviar notificações por email</p>
              </div>
              <input
                type="checkbox"
                checked={formData.notifications.email}
                onChange={(e) => setFormData({
                  ...formData,
                  notifications: { ...formData.notifications, email: e.target.checked }
                })}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
            </div>

            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <h3 className="text-sm font-medium text-gray-900">WhatsApp</h3>
                <p className="text-sm text-gray-500">Enviar notificações por WhatsApp</p>
              </div>
              <input
                type="checkbox"
                checked={formData.notifications.whatsapp}
                onChange={(e) => setFormData({
                  ...formData,
                  notifications: { ...formData.notifications, whatsapp: e.target.checked }
                })}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
            </div>

            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <h3 className="text-sm font-medium text-gray-900">SMS</h3>
                <p className="text-sm text-gray-500">Enviar notificações por SMS</p>
              </div>
              <input
                type="checkbox"
                checked={formData.notifications.sms}
                onChange={(e) => setFormData({
                  ...formData,
                  notifications: { ...formData.notifications, sms: e.target.checked }
                })}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
            </div>
          </div>
        </div>
      )}

      {activeTab === 'terms' && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Regulamento do Programa</h2>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Termos e Condições
            </label>
            <textarea
              value={formData.terms}
              onChange={(e) => setFormData({
                ...formData,
                terms: e.target.value
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              rows={15}
              placeholder="Digite aqui os termos e condições do seu programa de fidelidade..."
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;