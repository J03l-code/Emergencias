import React, { useState } from 'react';
import { X, ClipboardCheck, User, DoorClosed, Activity, FileText, Pill, HelpCircle, CheckCircle2, Clock, RotateCcw } from 'lucide-react';
import PhoneCountryDetector from './PhoneCountryDetector';

export default function MedicalReportModal({ isOpen, caseData, onClose, onSubmitReport }) {
  if (!isOpen || !caseData) return null;

  const [formData, setFormData] = useState({
    patientName: caseData.report?.patientName || '',
    room: caseData.report?.room || '',
    vitals: caseData.report?.vitals || 'PA: 120/80 mmHg, FC: 75 bpm, SpO2: 98%, Temp: 36.5°C',
    details: caseData.report?.details || '',
    medication: caseData.report?.medication || '',
    medicationReason: caseData.report?.medicationReason || '',
    conclusion: caseData.report?.conclusion || '',
    phone: caseData.report?.phone || '+593',
    followUpRequired: caseData.report?.followUpRequired ?? true,
    followUpHours: caseData.report?.followUpHours || 8,
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.patientName.trim()) {
      alert('Por favor ingrese el nombre del hermano atendido.');
      return;
    }
    if (!formData.room.toString().trim()) {
      alert('Por favor ingrese el número de habitación.');
      return;
    }

    const reportData = {
      ...formData,
      room: Number(formData.room) || formData.room,
      reportSubmittedAt: new Date().toISOString(),
      followUpDone: false,
    };

    onSubmitReport(caseData.id, reportData);
    onClose();
  };

  const applyVitalPreset = (preset) => {
    setFormData((prev) => ({ ...prev, vitals: preset }));
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-card modal-large">
        <div className="modal-header report-header">
          <div className="modal-title-group">
            <ClipboardCheck className="modal-icon text-emerald" />
            <div>
              <h3>Reporte Formulario de Atención Médica</h3>
              <p>Caso: <strong>{caseData.id}</strong> | Hotel: <strong>{caseData.hotel}</strong> ({caseData.responders})</p>
            </div>
          </div>
          <button className="btn-icon-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body">
          <div className="form-grid-2">
            {/* 1. Nombre del hermano atendido */}
            <div className="form-group">
              <label htmlFor="patientName" className="form-label required">
                <User size={16} /> 1. Nombre del Hermano Atendido:
              </label>
              <input
                type="text"
                id="patientName"
                className="form-control"
                placeholder="Nombre y apellido completo"
                value={formData.patientName}
                onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
                required
              />
            </div>

            {/* 2. Habitación (Numérico) */}
            <div className="form-group">
              <label htmlFor="room" className="form-label required">
                <DoorClosed size={16} /> 2. Habitación (Campo numérico):
              </label>
              <input
                type="number"
                id="room"
                className="form-control"
                placeholder="Ej: 304"
                value={formData.room}
                onChange={(e) => setFormData({ ...formData, room: e.target.value })}
                required
              />
            </div>
          </div>

          {/* 3. Signos vitales (Alfanumérico + botones de acceso rápido) */}
          <div className="form-group">
            <label htmlFor="vitals" className="form-label required">
              <Activity size={16} /> 3. Signos Vitales (PA, FC, SpO2, Temp...):
            </label>
            <input
              type="text"
              id="vitals"
              className="form-control"
              placeholder="Ej: PA: 120/80 mmHg, FC: 72 bpm, SpO2: 98%, Temp: 36.6°C"
              value={formData.vitals}
              onChange={(e) => setFormData({ ...formData, vitals: e.target.value })}
              required
            />
            <div className="quick-presets">
              <span className="preset-label">Atajos rápidos:</span>
              <button
                type="button"
                className="btn-preset"
                onClick={() => applyVitalPreset('PA: 120/80, FC: 75 bpm, SpO2: 98%, Temp: 36.5°C')}
              >
                Normal Standard
              </button>
              <button
                type="button"
                className="btn-preset warning"
                onClick={() => applyVitalPreset('PA: 135/85, FC: 88 bpm, SpO2: 96%, Temp: 38.2°C (Fiebre)')}
              >
                Fiebre / Febrícula
              </button>
              <button
                type="button"
                className="btn-preset alert"
                onClick={() => applyVitalPreset('PA: 145/95 (Elevada), FC: 95 bpm, SpO2: 97%, Temp: 36.8°C')}
              >
                Hipertensión
              </button>
            </div>
          </div>

          <div className="form-grid-2">
            {/* 4. Detalles adicionales */}
            <div className="form-group">
              <label htmlFor="details" className="form-label required">
                <FileText size={16} /> 4. Detalles Adicionales:
              </label>
              <textarea
                id="details"
                className="form-control textarea"
                rows="3"
                placeholder="Síntomas iniciales, tiempo de evolución, antecedentes..."
                value={formData.details}
                onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                required
              ></textarea>
            </div>

            {/* 5. Medicación usada */}
            <div className="form-group">
              <label htmlFor="medication" className="form-label required">
                <Pill size={16} /> 5. Medicación Usada:
              </label>
              <textarea
                id="medication"
                className="form-control textarea"
                rows="3"
                placeholder="Medicamentos suministrados o aplicados (ej. Paracetamol 500mg, Suero oral)"
                value={formData.medication}
                onChange={(e) => setFormData({ ...formData, medication: e.target.value })}
                required
              ></textarea>
            </div>
          </div>

          <div className="form-grid-2">
            {/* 6. Por qué de la medicación */}
            <div className="form-group">
              <label htmlFor="medicationReason" className="form-label required">
                <HelpCircle size={16} /> 6. ¿Por qué de la Medicación?:
              </label>
              <input
                type="text"
                id="medicationReason"
                className="form-control"
                placeholder="Indicación médica o razón de administración"
                value={formData.medicationReason}
                onChange={(e) => setFormData({ ...formData, medicationReason: e.target.value })}
                required
              />
            </div>

            {/* 7. Conclusión */}
            <div className="form-group">
              <label htmlFor="conclusion" className="form-label required">
                <CheckCircle2 size={16} /> 7. Conclusión / Diagnóstico:
              </label>
              <input
                type="text"
                id="conclusion"
                className="form-control"
                placeholder="Estado actual del paciente al finalizar la atención"
                value={formData.conclusion}
                onChange={(e) => setFormData({ ...formData, conclusion: e.target.value })}
                required
              />
            </div>
          </div>

          {/* 8. Número telefónico con detector automático de país */}
          <div className="form-group highlight-box">
            <label htmlFor="patientPhone" className="form-label required">
              📞 8. Número Telefónico de Contacto (con autodetección de País por <code>+</code>):
            </label>
            <PhoneCountryDetector
              value={formData.phone}
              onChange={(newPhone) => setFormData({ ...formData, phone: newPhone })}
              required={true}
            />
          </div>

          <div className="form-grid-2 follow-up-section">
            {/* 9. Seguimiento (Sí/No) */}
            <div className="form-group">
              <label className="form-label required">
                <RotateCcw size={16} /> 9. ¿Requiere Seguimiento Posterior?:
              </label>
              <div className="radio-toggle-group">
                <button
                  type="button"
                  className={`btn-toggle ${formData.followUpRequired ? 'active-yes' : ''}`}
                  onClick={() => setFormData({ ...formData, followUpRequired: true })}
                >
                  ✅ SÍ Requiere Seguimiento
                </button>
                <button
                  type="button"
                  className={`btn-toggle ${!formData.followUpRequired ? 'active-no' : ''}`}
                  onClick={() => setFormData({ ...formData, followUpRequired: false })}
                >
                  ❌ NO Requiere (Cerrar caso)
                </button>
              </div>
            </div>

            {/* 10. Tiempo de volver a verificar estado (8 / 12 / 24 hrs) */}
            {formData.followUpRequired && (
              <div className="form-group">
                <label className="form-label required">
                  <Clock size={16} /> 10. Tiempo para Volver a Verificar Estado:
                </label>
                <div className="timer-options">
                  {[8, 12, 24].map((hours) => (
                    <button
                      key={hours}
                      type="button"
                      className={`btn-timer-chip ${formData.followUpHours === hours ? 'selected' : ''}`}
                      onClick={() => setFormData({ ...formData, followUpHours: hours })}
                    >
                      ⏱️ {hours} Horas
                    </button>
                  ))}
                </div>
                <span className="field-hint">
                  El sistema alertará en el Dashboard cuando hayan transcurrido las {formData.followUpHours} horas.
                </span>
              </div>
            )}
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-emerald shadow-emerald">
              <ClipboardCheck size={18} /> Enviar Reporte al Dashboard
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
