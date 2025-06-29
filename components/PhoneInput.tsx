import React, { useState, useEffect } from 'react';
import { ChevronDown, Check, AlertCircle } from 'lucide-react';
import { countryCodes, validatePhone, getBrazilAreaCodeInfo } from '../utils/phoneValidation';

interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  placeholder?: string;
  className?: string;
}

const PhoneInput: React.FC<PhoneInputProps> = ({
  value,
  onChange,
  error,
  placeholder = "+55 11 99999-9999",
  className = ""
}) => {
  const [selectedCountry, setSelectedCountry] = useState(countryCodes[0]); // Brasil por padrão
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [ddd, setDdd] = useState('');
  const [number, setNumber] = useState('');
  const [validation, setValidation] = useState<any>(null);

  // Extrair partes do telefone do valor inicial
  useEffect(() => {
    if (value) {
      const match = value.match(/^(\+\d{1,4})\s(\d{2})\s(.+)$/);
      if (match) {
        const [, ddi, extractedDdd, extractedNumber] = match;
        const country = countryCodes.find(c => c.code === ddi);
        if (country) {
          setSelectedCountry(country);
          setDdd(extractedDdd);
          setNumber(extractedNumber.replace(/[^\d]/g, ''));
        }
      }
    }
  }, []);

  // Validar telefone quando houver mudanças
  useEffect(() => {
    if (ddd && number) {
      const result = validatePhone(selectedCountry.code, ddd, number);
      setValidation(result);
      
      if (result.isValid) {
        onChange(result.formatted);
      }
    }
  }, [selectedCountry, ddd, number, onChange]);

  const handleDDDChange = (value: string) => {
    const cleanValue = value.replace(/[^\d]/g, '').substring(0, 2);
    setDdd(cleanValue);
  };

  const handleNumberChange = (value: string) => {
    let cleanValue = value.replace(/[^\d]/g, '');
    
    if (selectedCountry.code === '+55') {
      // Para Brasil, limitar a 9 dígitos
      cleanValue = cleanValue.substring(0, 9);
    } else {
      // Para outros países, limitar a 15 dígitos
      cleanValue = cleanValue.substring(0, 15);
    }
    
    setNumber(cleanValue);
  };

  const formatNumberDisplay = (num: string) => {
    if (selectedCountry.code === '+55' && num.length >= 5) {
      // Formato brasileiro: 99999-9999
      return `${num.substring(0, 5)}-${num.substring(5)}`;
    }
    return num;
  };

  const getAreaCodeInfo = () => {
    if (selectedCountry.code === '+55' && ddd) {
      return getBrazilAreaCodeInfo(ddd);
    }
    return null;
  };

  const areaInfo = getAreaCodeInfo();

  return (
    <div className={`relative ${className}`}>
      <div className="flex">
        {/* Country Code Selector */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowCountryDropdown(!showCountryDropdown)}
            className="flex items-center px-3 py-2 border border-r-0 border-gray-300 rounded-l-lg bg-gray-50 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <span className="mr-2">{selectedCountry.flag}</span>
            <span className="text-sm font-medium">{selectedCountry.code}</span>
            <ChevronDown className="w-4 h-4 ml-1 text-gray-400" />
          </button>

          {showCountryDropdown && (
            <div className="absolute top-full left-0 z-50 w-64 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
              {countryCodes.map((country) => (
                <button
                  key={`${country.code}-${country.country}`}
                  type="button"
                  onClick={() => {
                    setSelectedCountry(country);
                    setShowCountryDropdown(false);
                    setDdd('');
                    setNumber('');
                  }}
                  className="flex items-center w-full px-3 py-2 text-left hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
                >
                  <span className="mr-3">{country.flag}</span>
                  <div className="flex-1">
                    <div className="text-sm font-medium">{country.country}</div>
                    <div className="text-xs text-gray-500">{country.code}</div>
                  </div>
                  {selectedCountry.code === country.code && selectedCountry.country === country.country && (
                    <Check className="w-4 h-4 text-blue-600" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* DDD Input (only for Brazil) */}
        {selectedCountry.code === '+55' && (
          <input
            type="text"
            value={ddd}
            onChange={(e) => handleDDDChange(e.target.value)}
            placeholder="11"
            maxLength={2}
            className={`w-16 px-2 py-2 border-t border-b border-gray-300 text-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              validation?.errors?.invalidDDD ? 'border-red-300 bg-red-50' : ''
            }`}
          />
        )}

        {/* Phone Number Input */}
        <input
          type="text"
          value={formatNumberDisplay(number)}
          onChange={(e) => handleNumberChange(e.target.value)}
          placeholder={selectedCountry.code === '+55' ? '99999-9999' : '999999999'}
          className={`flex-1 px-3 py-2 border border-gray-300 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
            validation && !validation.isValid ? 'border-red-300 bg-red-50' : ''
          }`}
        />
      </div>

      {/* Area Code Info for Brazil */}
      {areaInfo && (
        <div className="mt-1 text-xs text-green-600 flex items-center">
          <Check className="w-3 h-3 mr-1" />
          {areaInfo.city} - {areaInfo.state}
        </div>
      )}

      {/* Validation Errors */}
      {validation && !validation.isValid && (
        <div className="mt-1 text-xs text-red-600">
          <div className="flex items-center">
            <AlertCircle className="w-3 h-3 mr-1" />
            <span>
              {selectedCountry.code === '+55' ? (
                <>
                  {validation.errors.invalidDDD && 'DDD inválido. '}
                  {validation.errors.requiresNineDigits && 'Celular deve ter 9 dígitos. '}
                  {validation.errors.mustStartWithNine && 'Celular deve começar com 9. '}
                </>
              ) : (
                validation.errors.invalidLength && 'Número deve ter entre 8 e 15 dígitos.'
              )}
            </span>
          </div>
        </div>
      )}

      {/* Success Message */}
      {validation?.isValid && (
        <div className="mt-1 text-xs text-green-600 flex items-center">
          <Check className="w-3 h-3 mr-1" />
          Número válido: {validation.formatted}
        </div>
      )}

      {/* External Error */}
      {error && (
        <div className="mt-1 text-xs text-red-600 flex items-center">
          <AlertCircle className="w-3 h-3 mr-1" />
          {error}
        </div>
      )}

      {/* Click outside to close dropdown */}
      {showCountryDropdown && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowCountryDropdown(false)}
        />
      )}
    </div>
  );
};

export default PhoneInput;