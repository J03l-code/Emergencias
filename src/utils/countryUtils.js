// Base de datos de códigos de país y banderas ISO para números telefónicos internacionales
export const COUNTRY_CODES = [
  { code: '+593', country: 'Ecuador', flag: '🇪🇨', iso: 'EC' },
  { code: '+34', country: 'España', flag: '🇪🇸', iso: 'ES' },
  { code: '+1', country: 'EE.UU. / Canadá', flag: '🇺🇸', iso: 'US' },
  { code: '+52', country: 'México', flag: '🇲🇽', iso: 'MX' },
  { code: '+57', country: 'Colombia', flag: '🇨🇴', iso: 'CO' },
  { code: '+51', country: 'Perú', flag: '🇵🇪', iso: 'PE' },
  { code: '+56', country: 'Chile', flag: '🇨🇱', iso: 'CL' },
  { code: '+54', country: 'Argentina', flag: '🇦🇷', iso: 'AR' },
  { code: '+502', country: 'Guatemala', flag: '🇬🇹', iso: 'GT' },
  { code: '+503', country: 'El Salvador', flag: '🇸🇻', iso: 'SV' },
  { code: '+504', country: 'Honduras', flag: '🇭🇳', iso: 'HN' },
  { code: '+505', country: 'Nicaragua', flag: '🇳🇮', iso: 'NI' },
  { code: '+506', country: 'Costa Rica', flag: '🇨🇷', iso: 'CR' },
  { code: '+507', country: 'Panamá', flag: '🇵🇦', iso: 'PA' },
  { code: '+58', country: 'Venezuela', flag: '🇻🇪', iso: 'VE' },
  { code: '+591', country: 'Bolivia', flag: '🇧🇴', iso: 'BO' },
  { code: '+595', country: 'Paraguay', flag: '🇵🇾', iso: 'PY' },
  { code: '+598', country: 'Uruguay', flag: '🇺🇾', iso: 'UY' },
  { code: '+55', country: 'Brasil', flag: '🇧🇷', iso: 'BR' },
  { code: '+509', country: 'Haití', flag: '🇭🇹', iso: 'HT' },
  { code: '+1-787', country: 'Puerto Rico', flag: '🇵🇷', iso: 'PR' },
  { code: '+1-939', country: 'Puerto Rico', flag: '🇵🇷', iso: 'PR' },
  { code: '+53', country: 'Cuba', flag: '🇨🇺', iso: 'CU' },
  { code: '+1-809', country: 'Rep. Dominicana', flag: '🇩🇴', iso: 'DO' },
  { code: '+39', country: 'Italia', flag: '🇮🇹', iso: 'IT' },
  { code: '+33', country: 'Francia', flag: '🇫🇷', iso: 'FR' },
  { code: '+49', country: 'Alemania', flag: '🇩🇪', iso: 'DE' },
  { code: '+44', country: 'Reino Unido', flag: '🇬🇧', iso: 'GB' },
  { code: '+351', country: 'Portugal', flag: '🇵🇹', iso: 'PT' },
  { code: '+41', country: 'Suiza', flag: '🇨🇭', iso: 'CH' },
  { code: '+81', country: 'Japón', flag: '🇯🇵', iso: 'JP' },
  { code: '+86', country: 'China', flag: '🇨🇳', iso: 'CN' },
  { code: '+61', country: 'Australia', flag: '🇦🇺', iso: 'AU' },
  { code: '+64', country: 'Nueva Zelanda', flag: '🇳🇿', iso: 'NZ' },
];

/**
 * Detecta el país a partir de una cadena de texto telefónico que empiece con "+"
 * @param {string} phone 
 * @returns {{ found: boolean, country: string, flag: string, code: string }}
 */
export function detectCountryFromPhone(phone) {
  if (!phone || typeof phone !== 'string') {
    return { found: false, country: 'Desconocido', flag: '🌐', code: '' };
  }

  const clean = phone.trim();

  if (!clean.startsWith('+')) {
    return { found: false, country: 'Formato local sin +', flag: '📱', code: '' };
  }

  // Ordenar los códigos de más largo a más corto para prevenir coincidencias parciales (+1 vs +1-787)
  const sortedCodes = [...COUNTRY_CODES].sort((a, b) => b.code.length - a.code.length);

  for (const item of sortedCodes) {
    if (clean.startsWith(item.code)) {
      return {
        found: true,
        country: item.country,
        flag: item.flag,
        code: item.code,
        iso: item.iso
      };
    }
  }

  return { found: false, country: 'Internacional (+)', flag: '🌍', code: '+' };
}
