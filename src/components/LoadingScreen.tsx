import React from 'react';
import { Loader2 } from 'lucide-react';
import { useApp } from '../context/AppContext';

const LoadingScreen: React.FC = () => {
  const { loading, error } = useApp();

  if (error) {
    return (
      <div className="fixed inset-0 bg-white bg-opacity-90 flex items-center justify-center z-50">
        <div className="text-center">
          <div className="text-red-600 text-xl font-semibold mb-2">Erro ao carregar dados</div>
          <div className="text-gray-600 text-sm">{error}</div>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  if (!loading) return null;

  return (
    <div className="fixed inset-0 bg-white bg-opacity-90 flex items-center justify-center z-50">
      <div className="text-center">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
        <div className="text-gray-600 text-lg font-medium">Carregando dados...</div>
        <div className="text-gray-500 text-sm mt-2">Conectando ao banco de dados</div>
      </div>
    </div>
  );
};

export default LoadingScreen;