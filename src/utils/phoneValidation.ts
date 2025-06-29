// Códigos de países com DDI
export const countryCodes = [
  { code: '+55', country: 'Brasil', flag: '🇧🇷' },
  { code: '+1', country: 'Estados Unidos', flag: '🇺🇸' },
  { code: '+1', country: 'Canadá', flag: '🇨🇦' },
  { code: '+54', country: 'Argentina', flag: '🇦🇷' },
  { code: '+56', country: 'Chile', flag: '🇨🇱' },
  { code: '+57', country: 'Colômbia', flag: '🇨🇴' },
  { code: '+51', country: 'Peru', flag: '🇵🇪' },
  { code: '+598', country: 'Uruguai', flag: '🇺🇾' },
  { code: '+595', country: 'Paraguai', flag: '🇵🇾' },
  { code: '+591', country: 'Bolívia', flag: '🇧🇴' },
  { code: '+593', country: 'Equador', flag: '🇪🇨' },
  { code: '+58', country: 'Venezuela', flag: '🇻🇪' },
  { code: '+33', country: 'França', flag: '🇫🇷' },
  { code: '+49', country: 'Alemanha', flag: '🇩🇪' },
  { code: '+39', country: 'Itália', flag: '🇮🇹' },
  { code: '+34', country: 'Espanha', flag: '🇪🇸' },
  { code: '+351', country: 'Portugal', flag: '🇵🇹' },
  { code: '+44', country: 'Reino Unido', flag: '🇬🇧' },
  { code: '+81', country: 'Japão', flag: '🇯🇵' },
  { code: '+86', country: 'China', flag: '🇨🇳' },
  { code: '+91', country: 'Índia', flag: '🇮🇳' },
  { code: '+61', country: 'Austrália', flag: '🇦🇺' }
];

// DDDs válidos do Brasil por região
export const brazilAreaCodes = {
  'Norte': [
    { ddd: '68', city: 'Rio Branco', state: 'AC' },
    { ddd: '82', city: 'Maceió', state: 'AL' },
    { ddd: '96', city: 'Macapá', state: 'AP' },
    { ddd: '92', city: 'Manaus', state: 'AM' },
    { ddd: '97', city: 'Manaus Interior', state: 'AM' },
    { ddd: '71', city: 'Salvador', state: 'BA' },
    { ddd: '73', city: 'Ilhéus', state: 'BA' },
    { ddd: '74', city: 'Juazeiro', state: 'BA' },
    { ddd: '75', city: 'Feira de Santana', state: 'BA' },
    { ddd: '77', city: 'Barreiras', state: 'BA' },
    { ddd: '85', city: 'Fortaleza', state: 'CE' },
    { ddd: '88', city: 'Juazeiro do Norte', state: 'CE' },
    { ddd: '61', city: 'Brasília', state: 'DF' },
    { ddd: '27', city: 'Vitória', state: 'ES' },
    { ddd: '28', city: 'Cachoeiro de Itapemirim', state: 'ES' },
    { ddd: '62', city: 'Goiânia', state: 'GO' },
    { ddd: '64', city: 'Rio Verde', state: 'GO' },
    { ddd: '98', city: 'São Luís', state: 'MA' },
    { ddd: '99', city: 'Imperatriz', state: 'MA' },
    { ddd: '65', city: 'Cuiabá', state: 'MT' },
    { ddd: '66', city: 'Rondonópolis', state: 'MT' },
    { ddd: '67', city: 'Campo Grande', state: 'MS' },
    { ddd: '31', city: 'Belo Horizonte', state: 'MG' },
    { ddd: '32', city: 'Juiz de Fora', state: 'MG' },
    { ddd: '33', city: 'Governador Valadares', state: 'MG' },
    { ddd: '34', city: 'Uberlândia', state: 'MG' },
    { ddd: '35', city: 'Poços de Caldas', state: 'MG' },
    { ddd: '37', city: 'Divinópolis', state: 'MG' },
    { ddd: '38', city: 'Montes Claros', state: 'MG' },
    { ddd: '91', city: 'Belém', state: 'PA' },
    { ddd: '93', city: 'Santarém', state: 'PA' },
    { ddd: '94', city: 'Marabá', state: 'PA' },
    { ddd: '83', city: 'João Pessoa', state: 'PB' },
    { ddd: '81', city: 'Recife', state: 'PE' },
    { ddd: '87', city: 'Petrolina', state: 'PE' },
    { ddd: '86', city: 'Teresina', state: 'PI' },
    { ddd: '89', city: 'Picos', state: 'PI' },
    { ddd: '41', city: 'Curitiba', state: 'PR' },
    { ddd: '42', city: 'Ponta Grossa', state: 'PR' },
    { ddd: '43', city: 'Londrina', state: 'PR' },
    { ddd: '44', city: 'Maringá', state: 'PR' },
    { ddd: '45', city: 'Cascavel', state: 'PR' },
    { ddd: '46', city: 'Francisco Beltrão', state: 'PR' },
    { ddd: '21', city: 'Rio de Janeiro', state: 'RJ' },
    { ddd: '22', city: 'Campos dos Goytacazes', state: 'RJ' },
    { ddd: '24', city: 'Volta Redonda', state: 'RJ' },
    { ddd: '84', city: 'Natal', state: 'RN' },
    { ddd: '69', city: 'Porto Velho', state: 'RO' },
    { ddd: '95', city: 'Boa Vista', state: 'RR' },
    { ddd: '51', city: 'Porto Alegre', state: 'RS' },
    { ddd: '53', city: 'Pelotas', state: 'RS' },
    { ddd: '54', city: 'Caxias do Sul', state: 'RS' },
    { ddd: '55', city: 'Santa Maria', state: 'RS' },
    { ddd: '48', city: 'Florianópolis', state: 'SC' },
    { ddd: '47', city: 'Joinville', state: 'SC' },
    { ddd: '49', city: 'Chapecó', state: 'SC' },
    { ddd: '79', city: 'Aracaju', state: 'SE' },
    { ddd: '11', city: 'São Paulo', state: 'SP' },
    { ddd: '12', city: 'São José dos Campos', state: 'SP' },
    { ddd: '13', city: 'Santos', state: 'SP' },
    { ddd: '14', city: 'Bauru', state: 'SP' },
    { ddd: '15', city: 'Sorocaba', state: 'SP' },
    { ddd: '16', city: 'Ribeirão Preto', state: 'SP' },
    { ddd: '17', city: 'São José do Rio Preto', state: 'SP' },
    { ddd: '18', city: 'Presidente Prudente', state: 'SP' },
    { ddd: '19', city: 'Campinas', state: 'SP' },
    { ddd: '63', city: 'Palmas', state: 'TO' }
  ]
};

// Função para validar DDD brasileiro
export const isValidBrazilAreaCode = (ddd: string): boolean => {
  const allDDDs = brazilAreaCodes.Norte.map(area => area.ddd);
  return allDDDs.includes(ddd);
};

// Função para obter informações do DDD
export const getBrazilAreaCodeInfo = (ddd: string) => {
  return brazilAreaCodes.Norte.find(area => area.ddd === ddd);
};

// Função para validar número de celular brasileiro (9 dígitos)
export const isValidBrazilMobileNumber = (number: string): boolean => {
  const cleanNumber = number.replace(/[^\d]/g, '');
  // Celular brasileiro: 9 dígitos, começando com 9
  return cleanNumber.length === 9 && cleanNumber.startsWith('9');
};

// Função para formatar telefone brasileiro
export const formatBrazilPhone = (ddi: string, ddd: string, number: string): string => {
  const cleanNumber = number.replace(/[^\d]/g, '');
  if (cleanNumber.length === 9) {
    return `${ddi} ${ddd} ${cleanNumber.substring(0, 5)}-${cleanNumber.substring(5)}`;
  } else if (cleanNumber.length === 8) {
    return `${ddi} ${ddd} ${cleanNumber.substring(0, 4)}-${cleanNumber.substring(4)}`;
  }
  return `${ddi} ${ddd} ${cleanNumber}`;
};

// Função principal de validação de telefone
export const validatePhone = (ddi: string, ddd: string, number: string) => {
  const cleanNumber = number.replace(/[^\d]/g, '');
  
  if (ddi === '+55') {
    // Validação para Brasil
    const isDDDValid = isValidBrazilAreaCode(ddd);
    const isMobileValid = isValidBrazilMobileNumber(cleanNumber);
    const areaInfo = getBrazilAreaCodeInfo(ddd);
    
    return {
      isValid: isDDDValid && isMobileValid,
      formatted: isDDDValid && isMobileValid ? formatBrazilPhone(ddi, ddd, cleanNumber) : '',
      errors: {
        invalidDDD: !isDDDValid,
        invalidMobile: !isMobileValid,
        requiresNineDigits: cleanNumber.length !== 9,
        mustStartWithNine: !cleanNumber.startsWith('9')
      },
      areaInfo
    };
  } else {
    // Validação básica para outros países
    const isValidLength = cleanNumber.length >= 8 && cleanNumber.length <= 15;
    
    return {
      isValid: isValidLength,
      formatted: isValidLength ? `${ddi} ${cleanNumber}` : '',
      errors: {
        invalidLength: !isValidLength
      },
      areaInfo: null
    };
  }
};

// Função para extrair partes do telefone de uma string formatada
export const parsePhone = (phoneString: string) => {
  const match = phoneString.match(/^(\+\d{1,4})\s(\d{2})\s(\d{4,5})-?(\d{4})$/);
  if (match) {
    return {
      ddi: match[1],
      ddd: match[2],
      number: match[3] + match[4]
    };
  }
  return null;
};