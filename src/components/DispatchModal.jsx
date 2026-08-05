import React, { useState } from 'react';
import { X, Send, UserCheck, MapPin, Clock, Building, AlertTriangle } from 'lucide-react';

export default function DispatchModal({ isOpen, onClose, onSave }) {
  const nowStr = new Date().toISOString().slice(0, 16);

  const [formData, setFormData] = useState({
    patientName: '',
    responders: '',
    zone: 'Zona A',
    dispatchTime: nowStr,
    hotel: '',
    urgency: 'P2',
    notes: '',
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.patientName.trim() || !formData.responders.trim() || !formData.hotel.trim()) {
      alert('Por favor complete los campos obligatorios: Hermano a atender, Brigadistas y Hotel.');
      return;
    }

    const newCase = {
      id: `EMG-${Math.floor(Math.random() * 900 + 1).toString().padStart(3, '0')}`,
      createdTime: new Date().toISOString(),
      patientName: formData.patientName,
      responders: formData.responders,
      zone: formData.zone,
      dispatchTime: new Date(formData.dispatchTime).toISOString(),
      hotel: formData.hotel,
      urgency: formData.urgency,
      notes: formData.notes,
      status: 'EN_CAMINO',
      arrivalTime: null,
      report: null,
    };

    onSave(newCase);
    onClose();
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-card">
        <div className="modal-header dispatch-header">
          <div className="modal-title-group">
            <Send className="modal-icon text-amber" />
            <div>
              <h3>Asignar Nueva Emergencia Médica</h3>
              <p>Despacho de brigada móvil a hotel o sitio asignado</p>
            </div>
          </div>
          <button className="btn-icon-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body">
          {/* Hermano a atender */}
          <div className="form-group">
            <label htmlFor="dispatchPatientName" className="form-label required">
              Nombre del Hermano / Paciente a atender:
            </label>
            <input
              type="text"
              id="dispatchPatientName"
              className="form-control"
              placeholder="Ej: Gabriel Silva"
              value={formData.patientName}
              onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
              required
            />
          </div>
          {/* 1. Personas que asisten */}
          <div className="form-group">
            <label htmlFor="responders" className="form-label required">
              <UserCheck size={16} /> Personas que asisten (Brigadistas):
            </label>
            <input
              type="text"
              id="responders"
              className="form-control"
              placeholder="Ej: Roberto Mendoza, Juan Pérez"
              value={formData.responders}
              onChange={(e) => setFormData({ ...formData, responders: e.target.value })}
              required
            />
            <span className="field-hint">Escriba el nombre completo de los hermanos enviados.</span>
          </div>

          <div className="form-row-2">
            {/* 2. Zona */}
            <div className="form-group">
              <label htmlFor="zone" className="form-label required">
                <MapPin size={16} /> Zona asignada:
              </label>
              <select
                id="zone"
                className="form-control"
                value={formData.zone}
                onChange={(e) => setFormData({ ...formData, zone: e.target.value })}
                required
              >
                <option value="Zona A">Zona A</option>
                <option value="Zona B">Zona B</option>
                <option value="Zona C">Zona C</option>
                <option value="Otro">Otro</option>
              </select>
            </div>

            {/* 3. Hora en que se envía */}
            <div className="form-group">
              <label htmlFor="dispatchTime" className="form-label required">
                <Clock size={16} /> Hora de Envío / Salida:
              </label>
              <input
                type="datetime-local"
                id="dispatchTime"
                className="form-control"
                value={formData.dispatchTime}
                onChange={(e) => setFormData({ ...formData, dispatchTime: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="form-row-2">
            {/* 4. Hotel asignado */}
            <div className="form-group">
              <label htmlFor="hotel" className="form-label required">
                <Building size={16} /> Hotel de Destino:
              </label>
              <select
                id="hotel"
                className="form-control"
                value={formData.hotel || 'HOTEL AMBASSADOR'}
                onChange={(e) => setFormData({ ...formData, hotel: e.target.value })}
                required
              >
                {(hotels && hotels.length > 0 ? hotels : [
                  "HOTEL AMBASSADOR", "HOTEL DANN CARLTON", "LA QUINTA BY WYNDHAM", "HOTEL EMBASSY",
                  "GO QUITO HOTEL", "HOTEL FENIX", "HAMPTON BY HILTON QUITO", "HOLIDAY INN AIRPORT",
                  "HILTON COLON QUITO", "HOLIDAY INN EXPRESS QUITO", "HOTEL ZEN", "RIO AMAZONAS INTERNACIONAL",
                  "HOTEL IBIS", "HOTEL SAN JOSE DE PUEMBO", "MERCURE HOTEL ALAMEDA QUITO", "HOTEL MARRIOTT",
                  "NH COLLECTION ROYAL QUITO", "REINA ISABEL", "HOTEL SAVOY INN", "HOTEL QUITO"
                ]).map((h) => (
                  <option key={h} value={h}>{h}</option>
                ))}
              </select>
            </div>

            {/* Nivel de Urgencia */}
            <div className="form-group">
              <label htmlFor="urgency" className="form-label required">
                <AlertTriangle size={16} /> Nivel de Urgencia:
              </label>
              <select
                id="urgency"
                className="form-control urgency-select"
                value={formData.urgency}
                onChange={(e) => setFormData({ ...formData, urgency: e.target.value })}
              >
                <option value="P1">🔴 P1 - Emergencia Crítica (Prioridad Alta)</option>
                <option value="P2">🟠 P2 - Urgencia Moderada (Atención Rápida)</option>
                <option value="P3">🟢 P3 - Asistencia Menor / Consulta</option>
              </select>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary shadow-amber">
              <Send size={18} /> Enviar Brigada Móvil
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
