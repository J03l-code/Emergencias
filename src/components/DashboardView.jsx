import React, { useState } from 'react';
import { Search, Filter, Phone, CheckCircle, Clock, MapPin, Building, User, Eye, Trash2, CheckCircle2, RotateCcw, AlertTriangle } from 'lucide-react';
import { formatDate, getFollowUpCountdown, getElapsedTime } from '../utils/formatters';
import { detectCountryFromPhone } from '../utils/countryUtils';

export default function DashboardView({
  cases,
  activeFilter,
  onSelectFilter,
  onViewDetails,
  onMarkFollowUpDone,
  onCloseCase,
  onDeleteCase,
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [zoneFilter, setZoneFilter] = useState('ALL');

  // Filtrado de casos
  const filteredCases = cases.filter((item) => {
    // 1. Filtro por estado
    if (activeFilter === 'EN_CAMINO' && item.status !== 'EN_CAMINO') return false;
    if (activeFilter === 'EN_ATENCION' && item.status !== 'EN_ATENCION') return false;
    if (activeFilter === 'SEGUIMIENTO' && (item.status !== 'ATENDIDO_SEGUIMIENTO' || item.report?.followUpDone)) return false;
    if (activeFilter === 'RESUELTO' && item.status !== 'RESUELTO' && !item.report?.followUpDone) return false;

    // 2. Filtro por zona
    if (zoneFilter !== 'ALL' && item.zone !== zoneFilter) return false;

    // 3. Búsqueda por texto (Nombre paciente, hotel, habitación, brigadistas, id, teléfono)
    if (searchTerm.trim() !== '') {
      const query = searchTerm.toLowerCase();
      const matchId = item.id.toLowerCase().includes(query);
      const matchHotel = item.hotel.toLowerCase().includes(query);
      const matchResponders = item.responders.toLowerCase().includes(query);
      const matchPatient = item.report?.patientName?.toLowerCase().includes(query) || false;
      const matchRoom = item.report?.room?.toString().includes(query) || false;
      const matchPhone = item.report?.phone?.toLowerCase().includes(query) || false;

      return matchId || matchHotel || matchResponders || matchPatient || matchRoom || matchPhone;
    }

    return true;
  });

  const uniqueZones = Array.from(new Set(cases.map((c) => c.zone)));

  return (
    <div className="dashboard-container">
      {/* Barra de Filtros y Búsqueda */}
      <div className="dashboard-controls-card">
        <div className="search-input-group">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Buscar por hermano atendido, hotel, habitación, teléfono o brigadista..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button className="btn-clear-search" onClick={() => setSearchTerm('')}>
              ✕
            </button>
          )}
        </div>

        <div className="filter-controls">
          <div className="filter-item">
            <Filter size={16} />
            <span>Zona:</span>
            <select
              className="select-filter"
              value={zoneFilter}
              onChange={(e) => setZoneFilter(e.target.value)}
            >
              <option value="ALL">Todas las Zonas</option>
              {uniqueZones.map((z, idx) => (
                <option key={idx} value={z}>{z}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Tabla / Lista de Casos */}
      <div className="table-responsive-card">
        <table className="custom-table">
          <thead>
            <tr>
              <th>ID & Urgencia</th>
              <th>Hermano / Paciente</th>
              <th>Hotel & Habitación</th>
              <th>Brigadistas Enviados</th>
              <th>Contacto Teléfono</th>
              <th>Estado del Incidente</th>
              <th>Seguimiento Próximo</th>
              <th className="text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredCases.length === 0 ? (
              <tr>
                <td colSpan="8" className="empty-table-cell">
                  🔍 No se encontraron incidentes con los filtros aplicados.
                </td>
              </tr>
            ) : (
              filteredCases.map((item) => {
                const phoneInfo = item.report?.phone ? detectCountryFromPhone(item.report.phone) : null;
                const countdown = item.report?.followUpRequired
                  ? getFollowUpCountdown(item.report.reportSubmittedAt, item.report.followUpHours)
                  : null;

                const isOverdue = countdown?.status === 'overdue';

                return (
                  <tr key={item.id} className={isOverdue ? 'row-overdue' : ''}>
                    {/* ID & Urgencia */}
                    <td>
                      <div className="table-id-cell">
                        <strong>{item.id}</strong>
                        <span className={`badge badge-urgency-${item.urgency}`}>{item.urgency}</span>
                      </div>
                    </td>

                    {/* Hermano / Paciente */}
                    <td>
                      {item.report?.patientName ? (
                        <div>
                          <strong className="text-cyan">{item.report.patientName}</strong>
                          <div className="small-subtext">Diagnóstico: {item.report.conclusion}</div>
                        </div>
                      ) : (
                        <span className="text-muted">Pendiente de reporte</span>
                      )}
                    </td>

                    {/* Hotel & Habitación */}
                    <td>
                      <div>
                        <strong>{item.hotel}</strong>
                        {item.report?.room && (
                          <span className="room-chip">Hab. {item.report.room}</span>
                        )}
                        <div className="small-subtext">Zona: {item.zone}</div>
                      </div>
                    </td>

                    {/* Brigadistas */}
                    <td>
                      <span className="responders-text">{item.responders}</span>
                      <div className="small-subtext">Envío: {formatDate(item.dispatchTime)}</div>
                    </td>

                    {/* Teléfono */}
                    <td>
                      {item.report?.phone ? (
                        <div className="phone-table-cell">
                          <span className="flag-icon">{phoneInfo?.flag}</span>
                          <span className="phone-num">{item.report.phone}</span>
                          <small className="country-sub">{phoneInfo?.country}</small>
                        </div>
                      ) : (
                        <span className="text-muted">--</span>
                      )}
                    </td>

                    {/* Estado del Incidente */}
                    <td>
                      {item.status === 'EN_CAMINO' && (
                        <span className="badge badge-warning">🚚 En Camino</span>
                      )}
                      {item.status === 'EN_ATENCION' && (
                        <span className="badge badge-info">🩺 En Atención</span>
                      )}
                      {item.status === 'ATENDIDO_SEGUIMIENTO' && !item.report?.followUpDone && (
                        <span className="badge badge-purple">⏰ En Seguimiento</span>
                      )}
                      {(item.status === 'RESUELTO' || item.report?.followUpDone) && (
                        <span className="badge badge-success">✅ Resuelto / Cerrado</span>
                      )}
                    </td>

                    {/* Seguimiento Próximo */}
                    <td>
                      {item.report?.followUpRequired ? (
                        item.report?.followUpDone ? (
                          <span className="text-emerald text-sm font-semibold">
                            <CheckCircle2 size={14} /> Realizado
                          </span>
                        ) : (
                          <div className="countdown-cell">
                            <span className={`countdown-badge ${countdown?.status}`}>
                              {countdown?.text}
                            </span>
                            <small className="target-time">Revisar: {countdown?.targetTimeFormatted}</small>
                          </div>
                        )
                      ) : (
                        <span className="text-muted text-xs">Sin seguimiento</span>
                      )}
                    </td>

                    {/* Acciones */}
                    <td className="text-right">
                      <div className="table-actions">
                        <button
                          className="btn-icon btn-action-view"
                          title="Ver Ficha Clínica Imprimible"
                          onClick={() => onViewDetails(item)}
                        >
                          <Eye size={16} />
                        </button>

                        {item.report?.followUpRequired && !item.report?.followUpDone && (
                          <button
                            className="btn-icon btn-action-check"
                            title="Marcar Seguimiento Médico Realizado"
                            onClick={() => onMarkFollowUpDone(item.id)}
                          >
                            <CheckCircle size={16} />
                          </button>
                        )}

                        {item.status !== 'RESUELTO' && (
                          <button
                            className="btn-icon btn-action-close"
                            title="Finalizar y Cerrar Caso"
                            onClick={() => onCloseCase(item.id)}
                          >
                            <CheckCircle2 size={16} />
                          </button>
                        )}

                        <button
                          className="btn-icon btn-action-delete"
                          title="Eliminar Incidente"
                          onClick={() => onDeleteCase(item.id)}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
