import React from 'react';
import { Truck, Stethoscope, Clock, CheckCircle2, AlertTriangle } from 'lucide-react';

export default function StatsOverview({ cases, activeFilter, onSelectFilter }) {
  const total = cases.length;
  const enCamino = cases.filter((c) => c.status === 'EN_CAMINO').length;
  const enAtencion = cases.filter((c) => c.status === 'EN_ATENCION').length;
  const requierenSeguimiento = cases.filter(
    (c) => c.status === 'ATENDIDO_SEGUIMIENTO' && !c.report?.followUpDone
  ).length;
  const resueltos = cases.filter((c) => c.status === 'RESUELTO' || c.report?.followUpDone).length;

  return (
    <div className="stats-grid">
      {/* 1. Todos */}
      <div
        className={`stat-card ${activeFilter === 'TODOS' ? 'active' : ''}`}
        onClick={() => onSelectFilter('TODOS')}
      >
        <div className="stat-header">
          <span className="stat-title">Total Casos</span>
          <span className="stat-icon-wrapper icon-blue">📊</span>
        </div>
        <div className="stat-value">{total}</div>
        <span className="stat-subtext">Histórico cargado</span>
      </div>

      {/* 2. En Camino */}
      <div
        className={`stat-card stat-amber ${activeFilter === 'EN_CAMINO' ? 'active' : ''}`}
        onClick={() => onSelectFilter('EN_CAMINO')}
      >
        <div className="stat-header">
          <span className="stat-title">En Desplazamiento</span>
          <span className="stat-icon-wrapper icon-amber">
            <Truck size={20} />
          </span>
        </div>
        <div className="stat-value text-amber">{enCamino}</div>
        <span className="stat-subtext">Brigadas en tránsito a hotel</span>
      </div>

      {/* 3. En Atención */}
      <div
        className={`stat-card stat-cyan ${activeFilter === 'EN_ATENCION' ? 'active' : ''}`}
        onClick={() => onSelectFilter('EN_ATENCION')}
      >
        <div className="stat-header">
          <span className="stat-title">En Atención Médica</span>
          <span className="stat-icon-wrapper icon-cyan">
            <Stethoscope size={20} />
          </span>
        </div>
        <div className="stat-value text-cyan">{enAtencion}</div>
        <span className="stat-subtext">Llegaron al sitio (En progreso)</span>
      </div>

      {/* 4. Requieren Seguimiento */}
      <div
        className={`stat-card stat-purple ${activeFilter === 'SEGUIMIENTO' ? 'active' : ''}`}
        onClick={() => onSelectFilter('SEGUIMIENTO')}
      >
        <div className="stat-header">
          <span className="stat-title">Requieren Seguimiento</span>
          <span className="stat-icon-wrapper icon-purple">
            <Clock size={20} />
          </span>
        </div>
        <div className="stat-value text-purple">{requierenSeguimiento}</div>
        <span className="stat-subtext">Programados (8h / 12h / 24h)</span>
      </div>

      {/* 5. Resueltos */}
      <div
        className={`stat-card stat-emerald ${activeFilter === 'RESUELTO' ? 'active' : ''}`}
        onClick={() => onSelectFilter('RESUELTO')}
      >
        <div className="stat-header">
          <span className="stat-title">Resueltos / Cerrados</span>
          <span className="stat-icon-wrapper icon-emerald">
            <CheckCircle2 size={20} />
          </span>
        </div>
        <div className="stat-value text-emerald">{resueltos}</div>
        <span className="stat-subtext">Atención finalizada</span>
      </div>
    </div>
  );
}
