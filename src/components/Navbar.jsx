import React from 'react';
import { Plus, Download, RefreshCw, Stethoscope, LayoutDashboard, ShieldAlert } from 'lucide-react';

export default function Navbar({
  activeTab,
  onTabChange,
  onOpenDispatchModal,
  onExportJSON,
  onResetDB,
}) {
  return (
    <header className="navbar-container">
      <div className="navbar-left">
        <div className="brand-badge">
          <ShieldAlert size={24} className="brand-icon" />
          <div>
            <h1 className="brand-title">Brigadas Médicas</h1>
            <span className="brand-subtitle">Gestión de Emergencias y Seguimiento</span>
          </div>
        </div>

        <nav className="nav-tabs">
          <button
            className={`nav-tab ${activeTab === 'ACTIVE' ? 'active' : ''}`}
            onClick={() => onTabChange('ACTIVE')}
          >
            <Stethoscope size={18} />
            <span>🚨 Modo Campo (Brigadas)</span>
          </button>
          <button
            className={`nav-tab ${activeTab === 'DASHBOARD' ? 'active' : ''}`}
            onClick={() => onTabChange('DASHBOARD')}
          >
            <LayoutDashboard size={18} />
            <span>📊 Dashboard Seguimiento</span>
          </button>
        </nav>
      </div>

      <div className="navbar-right">
        <button
          className="btn btn-secondary btn-sm"
          title="Descargar respaldo en JSON"
          onClick={onExportJSON}
        >
          <Download size={16} /> Exportar BD
        </button>

        <button
          className="btn btn-secondary btn-sm"
          title="Restablecer datos de demostración"
          onClick={onResetDB}
        >
          <RefreshCw size={16} /> Reset
        </button>

        <button
          className="btn btn-primary shadow-amber btn-dispatch-action"
          onClick={onOpenDispatchModal}
        >
          <Plus size={18} /> Asignar Emergencia
        </button>
      </div>
    </header>
  );
}
