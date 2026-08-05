import React from 'react';
import { detectCountryFromPhone, COUNTRY_CODES } from '../utils/countryUtils';
import { Phone, Globe, CheckCircle2 } from 'lucide-react';

export default function PhoneCountryDetector({ value, onChange, required = false }) {
  const detection = detectCountryFromPhone(value);

  const handleSelectCountry = (e) => {
    const selectedCode = e.target.value;
    if (!selectedCode) return;
    
    // Si ya tenía algo escrito después del código, conservarlo
    const currentCode = detection.code;
    let numberPart = value;
    if (currentCode && value.startsWith(currentCode)) {
      numberPart = value.substring(currentCode.length);
    } else if (value.startsWith('+')) {
      // quitar el primer segmento +
      const match = value.match(/^\+\d+/);
      if (match) {
        numberPart = value.substring(match[0].length);
      }
    }
    
    onChange(`${selectedCode}${numberPart.trim()}`);
  };

  return (
    <div className="phone-detector-container">
      <div className="phone-input-wrapper">
        <div className="phone-input-prefix">
          <Phone size={18} className="phone-icon" />
          <span className="flag-badge" title={detection.country}>
            {detection.flag}
          </span>
        </div>

        <input
          type="text"
          id="patientPhone"
          className="form-control phone-input-field"
          placeholder="Ej: +593998765432 ó +34612345678"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={required}
        />

        <div className="country-select-dropdown">
          <Globe size={16} />
          <select 
            value={detection.code || ''} 
            onChange={handleSelectCountry}
            className="country-picker"
            title="Seleccionar país manualmente"
          >
            <option value="">Seleccionar código...</option>
            {COUNTRY_CODES.map((item, idx) => (
              <option key={idx} value={item.code}>
                {item.flag} {item.country} ({item.code})
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="phone-detection-info">
        {value.startsWith('+') ? (
          detection.found ? (
            <span className="country-detected-badge success">
              <CheckCircle2 size={14} /> País detectado: <strong>{detection.flag} {detection.country}</strong> ({detection.code})
            </span>
          ) : (
            <span className="country-detected-badge info">
              🌍 Número internacional (Escriba prefijo como +593, +34, +1...)
            </span>
          )
        ) : (
          <span className="country-detected-badge hint">
            💡 Coloque el <strong>+</strong> al inicio (ej. <code>+593</code>) para auto-detectar el país.
          </span>
        )}
      </div>
    </div>
  );
}
