import React from 'react';
import { X, Printer, CheckCircle, Clock, MapPin, Building, User, Phone, Pill, Activity, AlertCircle } from 'lucide-react';
import { formatDate, getElapsedTime, getFollowUpCountdown } from '../utils/formatters';
import { detectCountryFromPhone } from '../utils/countryUtils';

export default function CaseDetailModal({ isOpen, caseData, onClose, onMarkFollowUpDone, onCloseCase }) {
  if (!isOpen || !caseData) return null;

  const phoneInfo = caseData.report?.phone ? detectCountryFromPhone(caseData.report.phone) : null;
  const countdown = caseData.report?.followUpRequired
    ? getFollowUpCountdown(caseData.report.reportSubmittedAt, caseData.report.followUpHours)
    : null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-card modal-large print-container">
        <div className="modal-header detail-header no-print">
          <div className="modal-title-group">
            <Activity className="modal-icon text-cyan" />
            <div>
              <h3>Ficha Clínica y Reporte de Emergencia</h3>
              <p>Caso: <strong>{caseData.id}</strong> | Nivel: <span className={`badge badge-urgency-${caseData.urgency}`}>{caseData.urgency}</span></p>
            </div>
          </div>
          <div className="header-actions-row">
            <button className="btn btn-outline" onClick={handlePrint}>
              <Printer size={16} /> Imprimir / PDF
            </button>
            <button className="btn-icon-close" onClick={onClose}>
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="modal-body printable-area">
          {/* Encabezado Imprimible Médicos */}
          <div className="print-header-brand">
            <div className="brand-logo-text">
              <h2>🚑 BRIGADAS MÓVILES DE EMERGENCIAS MÉDICAS</h2>
              <p>Ficha de Atención en Sitio y Seguimiento de Paciente</p>
            </div>
            <div className="case-id-tag">
              <span>Nº CASO: <strong>{caseData.id}</strong></span>
              <small>Fecha: {formatDate(caseData.createdTime)}</small>
            </div>
          </div>

          {/* Bloque 1: Datos del Despacho y Sitio */}
          <div className="detail-section">
            <h4 className="section-title">📍 Informes del Despacho y Ubicación</h4>
            <div className="detail-grid-3">
              <div className="detail-item">
                <span className="label"><User size={14} /> Brigadistas Enviados:</span>
                <span className="value font-semibold">{caseData.responders}</span>
              </div>
              <div className="detail-item">
                <span className="label"><MapPin size={14} /> Zona:</span>
                <span className="value">{caseData.zone}</span>
              </div>
              <div className="detail-item">
                <span className="label"><Building size={14} /> Hotel de Destino:</span>
                <span className="value font-bold text-amber">{caseData.hotel}</span>
              </div>
              <div className="detail-item">
                <span className="label"><Clock size={14} /> Hora de Salida/Envío:</span>
                <span className="value">{formatDate(caseData.dispatchTime)}</span>
              </div>
              <div className="detail-item">
                <span className="label">📍 Hora de Arribo al Hotel:</span>
                <span className="value">
                  {caseData.arrivalTime ? formatDate(caseData.arrivalTime) : 'No registrada'}
                </span>
              </div>
              <div className="detail-item">
                <span className="label">⏱️ Tiempo de Respuesta en Sitio:</span>
                <span className="value">
                  {caseData.arrivalTime ? getElapsedTime(caseData.dispatchTime) : 'En camino...'}
                </span>
              </div>
            </div>
          </div>

          {/* Bloque 2: Formulario de Atención Médica (10 Campos) */}
          {caseData.report ? (
            <div className="detail-section highlight-card">
              <h4 className="section-title">🩺 Reporte Médico de Atención (10 Campos)</h4>

              <div className="detail-grid-2">
                <div className="detail-item">
                  <span className="label">1. Hermano Atendido:</span>
                  <span className="value text-lg font-bold text-cyan">{caseData.report.patientName}</span>
                </div>
                <div className="detail-item">
                  <span className="label">2. Habitación (Numérico):</span>
                  <span className="value text-lg font-bold text-amber">Hab. {caseData.report.room}</span>
                </div>
              </div>

              <div className="detail-item full-width mt-2">
                <span className="label">3. Signos Vitales (Alfanumérico):</span>
                <div className="vitals-banner">
                  <Activity size={18} className="text-emerald" />
                  <strong>{caseData.report.vitals}</strong>
                </div>
              </div>

              <div className="detail-grid-2 mt-3">
                <div className="detail-item">
                  <span className="label">4. Detalles Adicionales:</span>
                  <p className="value-box">{caseData.report.details}</p>
                </div>
                <div className="detail-item">
                  <span className="label">5. Medicación Usada:</span>
                  <p className="value-box highlight-med"><Pill size={14} /> {caseData.report.medication}</p>
                </div>
              </div>

              <div className="detail-grid-2 mt-2">
                <div className="detail-item">
                  <span className="label">6. ¿Por qué de la Medicación?:</span>
                  <p className="value-box">{caseData.report.medicationReason}</p>
                </div>
                <div className="detail-item">
                  <span className="label">7. Conclusión / Diagnóstico:</span>
                  <p className="value-box text-emerald-bright">{caseData.report.conclusion}</p>
                </div>
              </div>

              <div className="detail-grid-2 mt-3">
                <div className="detail-item">
                  <span className="label">8. Teléfono (Detección de País):</span>
                  <div className="phone-badge-result">
                    <Phone size={16} />
                    <span className="phone-number">{caseData.report.phone}</span>
                    {phoneInfo && (
                      <span className="country-tag">
                        {phoneInfo.flag} {phoneInfo.country} ({phoneInfo.code})
                      </span>
                    )}
                  </div>
                </div>

                <div className="detail-item">
                  <span className="label">9 & 10. Seguimiento Programado:</span>
                  <div className="follow-up-info-badge">
                    {caseData.report.followUpRequired ? (
                      caseData.report.followUpDone ? (
                        <span className="badge badge-success">
                          <CheckCircle size={14} /> Seguimiento Completado de {caseData.report.followUpHours}h
                        </span>
                      ) : (
                        <span className={`badge ${countdown?.status === 'overdue' ? 'badge-danger' : 'badge-warning'}`}>
                          {countdown?.text} (Frecuencia: {caseData.report.followUpHours} hrs)
                        </span>
                      )
                    ) : (
                      <span className="badge badge-secondary">❌ Sin seguimiento requerido</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="empty-report-warning">
              <AlertCircle size={24} className="text-amber" />
              <p>La brigada móvil aún no ha completado el formulario de reporte médico.</p>
            </div>
          )}

          {/* Acciones de Seguimiento (No visibles al imprimir) */}
          <div className="modal-footer no-print mt-4">
            {caseData.report?.followUpRequired && !caseData.report?.followUpDone && (
              <button
                className="btn btn-emerald"
                onClick={() => {
                  onMarkFollowUpDone(caseData.id);
                  onClose();
                }}
              >
                <CheckCircle size={18} /> Marcar Seguimiento Realizado
              </button>
            )}

            {caseData.status !== 'RESUELTO' && (
              <button
                className="btn btn-primary"
                onClick={() => {
                  onCloseCase(caseData.id);
                  onClose();
                }}
              >
                ✅ Finalizar & Cerrar Caso
              </button>
            )}

            <button className="btn btn-secondary" onClick={onClose}>
              Cerrar Vista
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
