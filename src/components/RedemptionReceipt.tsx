import React from 'react';
import { X, Printer, Gift, Calendar, User, FileText, Star } from 'lucide-react';
import { Customer, PointMovement } from '../types';
import { useApp } from '../context/AppContext';

interface RedemptionReceiptProps {
  customer: Customer;
  movement: PointMovement;
  onClose: () => void;
}

const RedemptionReceipt: React.FC<RedemptionReceiptProps> = ({ customer, movement, onClose }) => {
  const { settings } = useApp();

  const getFullName = (customer: Customer): string => {
    return `${customer.firstName} ${customer.lastName}`.trim();
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handlePrint = () => {
    window.print();
  };

  const ReceiptContent = ({ viaNumber }: { viaNumber: number }) => (
    <div className="receipt-content bg-white p-6 border border-gray-300 rounded-lg mb-4">
      {/* Header */}
      <div className="text-center border-b border-gray-200 pb-4 mb-4">
        <div className="flex items-center justify-center mb-2">
          <Gift className="w-8 h-8 text-blue-600 mr-2" />
          <h1 className="text-2xl font-bold text-gray-900">{settings.company.name}</h1>
        </div>
        <p className="text-sm text-gray-600">{settings.program.name}</p>
        <p className="text-xs text-gray-500">{settings.company.website}</p>
        <div className="mt-2 text-xs text-gray-500">
          <strong>COMPROVANTE DE RESGATE - {viaNumber}ª VIA</strong>
        </div>
      </div>

      {/* Informações do Cliente */}
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-gray-900 mb-2 flex items-center">
          <User className="w-4 h-4 mr-1" />
          Dados do Cliente
        </h3>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div>
            <span className="font-medium">Nome:</span> {getFullName(customer)}
          </div>
          <div>
            <span className="font-medium">CPF:</span> {customer.document}
          </div>
          <div>
            <span className="font-medium">Email:</span> {customer.email}
          </div>
          <div>
            <span className="font-medium">Telefone:</span> {customer.phone}
          </div>
          <div>
            <span className="font-medium">Nível:</span> 
            <span 
              className="ml-1 px-2 py-0.5 rounded text-xs font-medium"
              style={{ 
                backgroundColor: customer.level.color + '20', 
                color: customer.level.color 
              }}
            >
              {customer.level.name}
            </span>
          </div>
          <div>
            <span className="font-medium">Pontos Disponíveis:</span> {customer.points.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Informações do Resgate */}
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-gray-900 mb-2 flex items-center">
          <Gift className="w-4 h-4 mr-1" />
          Detalhes do Resgate
        </h3>
        <div className="bg-gray-50 p-3 rounded">
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <span className="font-medium">Descrição:</span> {movement.description}
            </div>
            <div>
              <span className="font-medium">Pontos Resgatados:</span> 
              <span className="text-red-600 font-bold">{Math.abs(movement.points)} pontos</span>
            </div>
            <div>
              <span className="font-medium">Data/Hora:</span> {formatDate(movement.date)}
            </div>
            <div>
              <span className="font-medium">Referência:</span> {movement.reference || 'N/A'}
            </div>
            {movement.couponCode && (
              <div className="col-span-2">
                <span className="font-medium">Código do Cupom:</span> 
                <span className="ml-1 px-2 py-1 bg-blue-100 text-blue-800 rounded font-mono text-sm">
                  {movement.couponCode}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Saldo Atualizado */}
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-gray-900 mb-2 flex items-center">
          <Star className="w-4 h-4 mr-1" />
          Saldo Atualizado
        </h3>
        <div className="bg-blue-50 p-3 rounded">
          <div className="text-center">
            <div className="text-xs text-gray-600">Saldo atual de pontos:</div>
            <div className="text-lg font-bold text-blue-600">
              {(customer.points + movement.points).toLocaleString()} pontos
            </div>
          </div>
        </div>
      </div>

      {/* Informações Adicionais */}
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-gray-900 mb-2 flex items-center">
          <FileText className="w-4 h-4 mr-1" />
          Informações Importantes
        </h3>
        <div className="text-xs text-gray-600 space-y-1">
          <p>• Este comprovante é válido como prova de resgate de pontos</p>
          <p>• Guarde este comprovante para seus registros</p>
          <p>• Em caso de dúvidas, entre em contato conosco</p>
          {movement.couponCode && (
            <p>• O código do cupom deve ser apresentado no momento da compra</p>
          )}
          {settings.program.pointsExpiration.enabled && (
            <p>• Pontos expiram em {settings.program.pointsExpiration.days} dias</p>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-gray-200 pt-4 text-center">
        <div className="text-xs text-gray-500">
          <p>{settings.company.address}</p>
          <p className="mt-1">
            <span className="font-medium">Data de Emissão:</span> {formatDate(new Date().toISOString())}
          </p>
          <p className="mt-2 text-xs">
            <strong>Obrigado por participar do nosso programa de fidelidade!</strong>
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header do Modal - Não imprime */}
        <div className="no-print flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Comprovante de Resgate</h2>
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
            >
              <Printer className="w-4 h-4 mr-2" />
              Imprimir
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Conteúdo do Comprovante */}
        <div className="p-6">
          {/* 1ª Via */}
          <ReceiptContent viaNumber={1} />
          
          {/* Separador entre vias - Só aparece na impressão */}
          <div className="print-only border-t-2 border-dashed border-gray-400 my-4 page-break"></div>
          
          {/* 2ª Via */}
          <ReceiptContent viaNumber={2} />
        </div>
      </div>
    </div>
  );
};

export default RedemptionReceipt;