import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import StatsOverview from './components/StatsOverview';
import ActiveCasesView from './components/ActiveCasesView';
import DashboardView from './components/DashboardView';
import DispatchModal from './components/DispatchModal';
import MedicalReportModal from './components/MedicalReportModal';
import CaseDetailModal from './components/CaseDetailModal';
import { getStoredCases, saveCases, exportDatabaseJSON, resetDatabase } from './utils/storage';
import './index.css';

export default function App() {
  const [cases, setCases] = useState(() => getStoredCases());
  const [activeTab, setActiveTab] = useState('ACTIVE'); // 'ACTIVE' | 'DASHBOARD'
  const [activeFilter, setActiveFilter] = useState('TODOS');

  // Modales
  const [isDispatchModalOpen, setIsDispatchModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedCase, setSelectedCase] = useState(null);

  // Persistir en LocalStorage cada vez que cambien los casos
  useEffect(() => {
    saveCases(cases);
  }, [cases]);

  // 1. Asignar Nueva Emergencia (Despacho)
  const handleSaveNewCase = (newCase) => {
    const updated = [newCase, ...cases];
    setCases(updated);
    // Mostrar notificación o toast si se desea
  };

  // 2. Marcar Llegada en Hotel (Requisito 2)
  const handleMarkArrival = (caseId) => {
    const updated = cases.map((item) => {
      if (item.id === caseId) {
        return {
          ...item,
          status: 'EN_ATENCION',
          arrivalTime: new Date().toISOString(),
        };
      }
      return item;
    });
    setCases(updated);
  };

  // 3. Enviar Reporte Médico (Requisito 3 - 10 Campos)
  const handleSubmitReport = (caseId, reportData) => {
    const updated = cases.map((item) => {
      if (item.id === caseId) {
        const nextStatus = reportData.followUpRequired ? 'ATENDIDO_SEGUIMIENTO' : 'RESUELTO';
        return {
          ...item,
          status: nextStatus,
          report: reportData,
        };
      }
      return item;
    });
    setCases(updated);
  };

  // 4. Marcar seguimiento médico como realizado
  const handleMarkFollowUpDone = (caseId) => {
    const updated = cases.map((item) => {
      if (item.id === caseId) {
        return {
          ...item,
          status: 'RESUELTO',
          report: {
            ...item.report,
            followUpDone: true,
          },
        };
      }
      return item;
    });
    setCases(updated);
  };

  // 5. Finalizar y Cerrar caso directamente
  const handleCloseCase = (caseId) => {
    const updated = cases.map((item) => {
      if (item.id === caseId) {
        return {
          ...item,
          status: 'RESUELTO',
          report: item.report ? { ...item.report, followUpDone: true } : null,
        };
      }
      return item;
    });
    setCases(updated);
  };

  // 6. Eliminar caso
  const handleDeleteCase = (caseId) => {
    if (window.confirm(`¿Está seguro de que desea eliminar el incidente ${caseId}?`)) {
      const updated = cases.filter((c) => c.id !== caseId);
      setCases(updated);
    }
  };

  // Restablecer base de datos
  const handleResetDB = () => {
    if (window.confirm('¿Desea restablecer los casos a los datos de prueba iniciales?')) {
      const initial = resetDatabase();
      setCases(initial);
    }
  };

  // Abrir Modal de Reporte Médico para un caso específico
  const handleOpenReportModal = (caseItem) => {
    setSelectedCase(caseItem);
    setIsReportModalOpen(true);
  };

  // Abrir Ficha Detallada
  const handleViewDetails = (caseItem) => {
    setSelectedCase(caseItem);
    setIsDetailModalOpen(true);
  };

  return (
    <div className="app-layout">
      {/* Encabezado Principal */}
      <Navbar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onOpenDispatchModal={() => setIsDispatchModalOpen(true)}
        onExportJSON={() => exportDatabaseJSON(cases)}
        onResetDB={handleResetDB}
      />

      {/* Contenido Principal */}
      <main className="main-content">
        {/* Tarjetas de Estadísticas KPI */}
        <StatsOverview
          cases={cases}
          activeFilter={activeFilter}
          onSelectFilter={(filter) => {
            setActiveFilter(filter);
            setActiveTab('DASHBOARD'); // Cambiar a vista dashboard al hacer clic en KPI
          }}
        />

        {/* Vista por Pestaña */}
        {activeTab === 'ACTIVE' ? (
          <ActiveCasesView
            cases={cases}
            onMarkArrival={handleMarkArrival}
            onOpenReportModal={handleOpenReportModal}
            onViewDetails={handleViewDetails}
          />
        ) : (
          <DashboardView
            cases={cases}
            activeFilter={activeFilter}
            onSelectFilter={setActiveFilter}
            onViewDetails={handleViewDetails}
            onMarkFollowUpDone={handleMarkFollowUpDone}
            onCloseCase={handleCloseCase}
            onDeleteCase={handleDeleteCase}
          />
        )}
      </main>

      {/* Modal 1: Asignar Emergencia (Despacho) */}
      <DispatchModal
        isOpen={isDispatchModalOpen}
        onClose={() => setIsDispatchModalOpen(false)}
        onSave={handleSaveNewCase}
      />

      {/* Modal 2: Reporte Médico Formulario (10 Campos) */}
      <MedicalReportModal
        isOpen={isReportModalOpen}
        caseData={selectedCase}
        onClose={() => setIsReportModalOpen(false)}
        onSubmitReport={handleSubmitReport}
      />

      {/* Modal 3: Ficha Clínica e Imprimir */}
      <CaseDetailModal
        isOpen={isDetailModalOpen}
        caseData={selectedCase}
        onClose={() => setIsDetailModalOpen(false)}
        onMarkFollowUpDone={handleMarkFollowUpDone}
        onCloseCase={handleCloseCase}
      />
    </div>
  );
}
