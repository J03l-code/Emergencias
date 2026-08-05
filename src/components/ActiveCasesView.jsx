import React from 'react';
import { MapPin, Clock, Building, User, AlertTriangle, CheckCircle, ClipboardCheck, ArrowRight } from 'lucide-react';
import { formatDate, getElapsedTime } from '../utils/formatters';

export default function ActiveCasesView({ cases, onMarkArrival, onOpenReportModal, onViewDetails }) {
  // Filtrar solo los casos activos (En camino o En atención)
  const activeCases = cases.filter((c) => c.status === 'EN_CAMINO' || c.status === 'EN_ATENCION');

  if (activeCases.length === 0) {
    return (
      <div className="empty-state-box">
        <CheckCircle size={48} className="text-emerald" />
        <h3>Sin Emergencias Activas en Desplazamiento</h3>
        <p>Todas las brigadas están disponibles. Puede asignar una nueva emergencia desde el botón de despacho.</p>
      </div>
    );
  }

  return (
    <div className="active-cases-container">
      <div className="section-header-row">
        <div>
          <h2>🚨 Casos Activos y En Desplazamiento</h2>
          <p>Supervisión en tiempo real de brigadas en camino y atención médica iniciada</p>
        </div>
        <span className="live-pill">🔴 EN VIVO ({activeCases.length})</span>
      </div>

      <div className="active-cards-grid">
        {activeCases.map((item) => {
          const isEnCamino = item.status === 'EN_CAMINO';
          const isEnAtencion = item.status === 'EN_ATENCION';

          return (
            <div key={item.id} className={`active-case-card urgency-border-${item.urgency}`}>
              <div className="card-top">
                <div className="card-id-group">
                  <span className="case-badge">{item.id}</span>
                  <span className={`urgency-tag tag-${item.urgency}`}>
                    {item.urgency === 'P1' && '🔴 P1 CRÍTICA'}
                    {item.urgency === 'P2' && '🟠 P2 URGENTE'}
                    {item.urgency === 'P3' && '🟢 P3 LEVE'}
                  </span>
                </div>
                <span className={`status-pill ${isEnCamino ? 'pill-en-camino' : 'pill-en-atencion'}`}>
                  {isEnCamino ? '🚚 En Camino' : '🩺 En Atención en Hotel'}
                </span>
              </div>

              <div className="card-main-info">
                <div className="info-row highlight-hotel">
                  <Building size={20} className="text-amber" />
                  <div>
                    <span className="info-label">Hotel de Destino:</span>
                    <h3 className="hotel-title">{item.hotel}</h3>
                  </div>
                </div>

                <div className="info-row">
                  <User size={18} className="text-cyan" />
                  <div>
                    <span className="info-label">Brigadistas / Personas que Asisten:</span>
                    <strong className="responders-names">{item.responders}</strong>
                  </div>
                </div>

                <div className="info-grid-2">
                  <div className="info-sub-item">
                    <MapPin size={16} />
                    <span>Zona: <strong>{item.zone}</strong></span>
                  </div>
                  <div className="info-sub-item">
                    <Clock size={16} />
                    <span>Hora Envío: <strong>{formatDate(item.dispatchTime)}</strong></span>
                  </div>
                </div>

                {isEnCamino ? (
                  <div className="timer-banner banner-warning">
                    ⏱️ Tiempo en tránsito: <strong>{getElapsedTime(item.dispatchTime)}</strong>
                  </div>
                ) : (
                  <div className="timer-banner banner-cyan">
                    📍 Arribó a las <strong>{formatDate(item.arrivalTime)}</strong> (Atendiendo hace {getElapsedTime(item.arrivalTime)})
                  </div>
                )}
              </div>

              {/* BOTONES DE ACCIÓN PRINCIPALES EXIGIDOS EN LOS REQUISITOS 2 Y 3 */}
              <div className="card-actions-area">
                {isEnCamino && (
                  <button
                    className="btn btn-arrival-giant shadow-amber"
                    onClick={() => onMarkArrival(item.id)}
                  >
                    📍 ¡MARCAR LLEGADA EN HOTEL!
                    <small>Confirma el arribo e inicia la atención médica</small>
                  </button>
                )}

                {isEnAtencion && (
                  <button
                    className="btn btn-report-giant shadow-emerald"
                    onClick={() => onOpenReportModal(item)}
                  >
                    📋 ENVIAR REPORTE MÉDICO (10 Campos)
                    <small>Registrar signos vitales, medicación y conclusión</small>
                  </button>
                )}

                <button className="btn btn-subtle mt-2" onClick={() => onViewDetails(item)}>
                  Ver Detalles Ficha <ArrowRight size={14} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
