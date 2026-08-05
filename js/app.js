/**
 * BRIGADAS MÉDICAS - LÓGICA FRONTEND EN JAVASCRIPT VANILLA
 * Ultra-rápido, sin dependencias de Node.js, 100% compatible con Hostinger y PHP.
 */

// Base de datos de Códigos ISO y Banderas Telefónicas
const COUNTRY_CODES = [
  { code: '+593', country: 'Ecuador', flag: '🇪🇨' },
  { code: '+34', country: 'España', flag: '🇪🇸' },
  { code: '+1', country: 'EE.UU. / Canadá', flag: '🇺🇸' },
  { code: '+52', country: 'México', flag: '🇲🇽' },
  { code: '+57', country: 'Colombia', flag: '🇨🇴' },
  { code: '+51', country: 'Perú', flag: '🇵🇪' },
  { code: '+56', country: 'Chile', flag: '🇨🇱' },
  { code: '+54', country: 'Argentina', flag: '🇦🇷' },
  { code: '+502', country: 'Guatemala', flag: '🇬🇹' },
  { code: '+503', country: 'El Salvador', flag: '🇸🇻' },
  { code: '+504', country: 'Honduras', flag: '🇭🇳' },
  { code: '+505', country: 'Nicaragua', flag: '🇳🇮' },
  { code: '+506', country: 'Costa Rica', flag: '🇨🇷' },
  { code: '+507', country: 'Panamá', flag: '🇵🇦' },
  { code: '+58', country: 'Venezuela', flag: '🇻🇪' },
  { code: '+591', country: 'Bolivia', flag: '🇧🇴' },
  { code: '+595', country: 'Paraguay', flag: '🇵🇾' },
  { code: '+598', country: 'Uruguay', flag: '🇺🇾' },
  { code: '+55', country: 'Brasil', flag: '🇧🇷' },
  { code: '+39', country: 'Italia', flag: '🇮🇹' },
  { code: '+33', country: 'Francia', flag: '🇫🇷' },
  { code: '+49', country: 'Alemania', flag: '🇩🇪' },
  { code: '+44', country: 'Reino Unido', flag: '🇬🇧' },
];

let globalCases = [];
let currentTab = 'ACTIVE'; // 'ACTIVE' | 'DASHBOARD'
let kpiFilter = 'TODOS';
let selectedReportFollowUpRequired = true;
let selectedReportFollowUpHours = 8;

document.addEventListener('DOMContentLoaded', () => {
  // Inicializar reloj datetime-local predeterminado
  const nowISO = new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16);
  const timeInput = document.getElementById('dispatchTime');
  if (timeInput) timeInput.value = nowISO;

  fetchCases();
});

// Detectar país en vivo desde el número de teléfono con +
function detectPhoneCountryLive() {
  const phoneInput = document.getElementById('reportPhone');
  const flagBadge = document.getElementById('phoneFlagBadge');
  const textBadge = document.getElementById('phoneCountryBadgeText');
  
  const val = (phoneInput.value || '').trim();

  if (!val.startsWith('+')) {
    flagBadge.innerText = '📱';
    textBadge.className = 'country-detected-badge hint';
    textBadge.innerHTML = '💡 Inicie con <strong>+</strong> (ej. <code>+593</code>) para auto-detectar el país.';
    return;
  }

  // Ordenar por longitud de código de mayor a menor
  const sorted = [...COUNTRY_CODES].sort((a, b) => b.code.length - a.code.length);
  let found = null;

  for (const item of sorted) {
    if (val.startsWith(item.code)) {
      found = item;
      break;
    }
  }

  if (found) {
    flagBadge.innerText = found.flag;
    textBadge.className = 'country-detected-badge success';
    textBadge.innerHTML = `✅ País detectado: <strong>${found.flag} ${found.country}</strong> (${found.code})`;
  } else {
    flagBadge.innerText = '🌍';
    textBadge.className = 'country-detected-badge info';
    textBadge.innerHTML = '🌍 Número Internacional (Escriba código como +593, +34, +1)';
  }
}

// Cargar lista de casos desde la API PHP
async function fetchCases() {
  const badge = document.getElementById('dbStatusBadge');
  try {
    const res = await fetch('api.php?action=list');
    const json = await res.json();

    if (json.status === 'success') {
      globalCases = json.data || [];
      if (json.source === 'mysql') {
        badge.className = 'db-status-badge success';
        badge.innerHTML = '🟢 MySQL Conectado';
      } else {
        badge.className = 'db-status-badge warning';
        badge.innerHTML = '🟡 Respaldo Activo (JSON)';
      }
    } else {
      throw new Error(json.message);
    }
  } catch (err) {
    console.warn('API error, leyendo respaldo LocalStorage:', err);
    badge.className = 'db-status-badge warning';
    badge.innerHTML = '🟡 Respaldo Local';
    const local = localStorage.getItem('emergencias_local_v1');
    globalCases = local ? JSON.parse(local) : [];
  }

  renderAll();
}

function renderAll() {
  updateKPIs();
  renderActiveCasesGrid();
  renderDashboardTable();
  if (window.lucide) lucide.createIcons();
}

// Actualizar tarjetas de KPI
function updateKPIs() {
  const total = globalCases.length;
  const enCamino = globalCases.filter(c => c.status === 'EN_CAMINO').length;
  const enAtencion = globalCases.filter(c => c.status === 'EN_ATENCION').length;
  const seguimiento = globalCases.filter(c => c.status === 'ATENDIDO_SEGUIMIENTO' && (!c.report || !c.report.followUpDone)).length;
  const resueltos = globalCases.filter(c => c.status === 'RESUELTO' || (c.report && c.report.followUpDone)).length;

  document.getElementById('statTotal').innerText = total;
  document.getElementById('statEnCamino').innerText = enCamino;
  document.getElementById('statEnAtencion').innerText = enAtencion;
  document.getElementById('statSeguimiento').innerText = seguimiento;
  document.getElementById('statResueltos').innerText = resueltos;

  const activeCount = enCamino + enAtencion;
  document.getElementById('liveActiveCount').innerText = activeCount;
}

// Renderizar cuadrícula de casos activos (Modo Campo)
function renderActiveCasesGrid() {
  const grid = document.getElementById('activeCardsGrid');
  const activeCases = globalCases.filter(c => c.status === 'EN_CAMINO' || c.status === 'EN_ATENCION');

  if (activeCases.length === 0) {
    grid.innerHTML = `
      <div class="empty-state-box">
        <i data-lucide="check-circle" style="width:48px; height:48px; color:var(--color-emerald)"></i>
        <h3>Sin Emergencias Activas en Desplazamiento</h3>
        <p>Todas las brigadas móviles están disponibles. Puede asignar una nueva emergencia.</p>
      </div>
    `;
    return;
  }

  grid.innerHTML = activeCases.map(item => {
    const isEnCamino = item.status === 'EN_CAMINO';
    const urgencyLabel = item.urgency === 'P1' ? '🔴 P1 CRÍTICA' : item.urgency === 'P2' ? '🟠 P2 URGENTE' : '🟢 P3 LEVE';
    const timeElapsed = getElapsedTime(isEnCamino ? item.dispatchTime : item.arrivalTime);

    return `
      <div class="active-case-card urgency-border-${item.urgency}">
        <div class="card-top">
          <div class="card-id-group">
            <span class="case-badge">${item.id}</span>
            <span class="urgency-tag tag-${item.urgency}">${urgencyLabel}</span>
          </div>
          <span class="status-pill ${isEnCamino ? 'pill-en-camino' : 'pill-en-atencion'}">
            ${isEnCamino ? '🚚 En Camino' : '🩺 En Atención en Hotel'}
          </span>
        </div>

        <div class="card-main-info">
          <div class="info-row highlight-hotel">
            <i data-lucide="building" class="text-amber"></i>
            <div>
              <span class="info-label">Hotel de Destino:</span>
              <h3 class="hotel-title">${escapeHtml(item.hotel)}</h3>
            </div>
          </div>

          <div class="info-row">
            <i data-lucide="user" class="text-cyan"></i>
            <div>
              <span class="info-label">Brigadistas Enviados:</span>
              <strong class="responders-names">${escapeHtml(item.responders)}</strong>
            </div>
          </div>

          <div class="info-grid-2">
            <div class="info-sub-item"><i data-lucide="map-pin"></i> Zona: <strong>${escapeHtml(item.zone)}</strong></div>
            <div class="info-sub-item"><i data-lucide="clock"></i> Envío: <strong>${formatDateStr(item.dispatchTime)}</strong></div>
          </div>

          <div class="timer-banner ${isEnCamino ? 'banner-warning' : 'banner-cyan'}">
            ${isEnCamino ? `⏱️ Tiempo en tránsito: <strong>${timeElapsed}</strong>` : `📍 Arribó a las <strong>${formatDateStr(item.arrivalTime)}</strong> (Atendiendo hace ${timeElapsed})`}
          </div>
        </div>

        <div class="card-actions-area">
          ${isEnCamino ? `
            <button class="btn btn-arrival-giant shadow-amber" onclick="markArrival('${item.id}')">
              📍 ¡MARCAR LLEGADA EN HOTEL!
              <small>Confirma arribo e inicia la atención médica</small>
            </button>
          ` : `
            <button class="btn btn-report-giant shadow-emerald" onclick="openReportModal('${item.id}')">
              📋 ENVIAR REPORTE MÉDICO (10 Campos)
              <small>Registrar signos vitales, medicación y conclusión</small>
            </button>
          `}
          <button class="btn btn-subtle mt-2" onclick="openDetailModal('${item.id}')">
            Ver Ficha Imprimible ➔
          </button>
        </div>
      </div>
    `;
  }).join('');
}

// Renderizar tabla del Dashboard de Seguimiento
function renderDashboardTable() {
  const tbody = document.getElementById('dashboardTableBody');
  const search = (document.getElementById('searchInput')?.value || '').toLowerCase().trim();
  const selectedZone = document.getElementById('zoneSelectFilter')?.value || 'ALL';

  // Poblar filtro de zonas
  const zoneSelect = document.getElementById('zoneSelectFilter');
  if (zoneSelect) {
    const uniqueZones = Array.from(new Set(globalCases.map(c => c.zone)));
    const current = zoneSelect.value;
    zoneSelect.innerHTML = `<option value="ALL">Todas las Zonas</option>` + 
      uniqueZones.map(z => `<option value="${escapeHtml(z)}" ${z === current ? 'selected' : ''}>${escapeHtml(z)}</option>`).join('');
  }

  const filtered = globalCases.filter(item => {
    if (kpiFilter === 'EN_CAMINO' && item.status !== 'EN_CAMINO') return false;
    if (kpiFilter === 'EN_ATENCION' && item.status !== 'EN_ATENCION') return false;
    if (kpiFilter === 'SEGUIMIENTO' && (item.status !== 'ATENDIDO_SEGUIMIENTO' || (item.report && item.report.followUpDone))) return false;
    if (kpiFilter === 'RESUELTO' && item.status !== 'RESUELTO' && (!item.report || !item.report.followUpDone)) return false;

    if (selectedZone !== 'ALL' && item.zone !== selectedZone) return false;

    if (search !== '') {
      const matchId = item.id.toLowerCase().includes(search);
      const matchHotel = item.hotel.toLowerCase().includes(search);
      const matchResp = item.responders.toLowerCase().includes(search);
      const matchPatient = item.report?.patientName?.toLowerCase().includes(search) || false;
      const matchRoom = item.report?.room?.toString().includes(search) || false;
      const matchPhone = item.report?.phone?.toLowerCase().includes(search) || false;
      return matchId || matchHotel || matchResp || matchPatient || matchRoom || matchPhone;
    }

    return true;
  });

  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="8" class="empty-table-cell">🔍 No se encontraron incidentes con los filtros seleccionados.</td></tr>`;
    return;
  }

  tbody.innerHTML = filtered.map(item => {
    const phoneInfo = item.report?.phone ? detectCountryFromPhone(item.report.phone) : null;
    const countdown = item.report?.followUpRequired
      ? getFollowUpCountdown(item.report.reportSubmittedAt, item.report.followUpHours)
      : null;

    return `
      <tr class="${countdown?.status === 'overdue' ? 'row-overdue' : ''}">
        <td>
          <div class="table-id-cell">
            <strong>${item.id}</strong>
            <span class="badge badge-urgency-${item.urgency}">${item.urgency}</span>
          </div>
        </td>
        <td>
          ${item.report?.patientName ? `
            <div>
              <strong class="text-cyan">${escapeHtml(item.report.patientName)}</strong>
              <div class="small-subtext">Diagnóstico: ${escapeHtml(item.report.conclusion)}</div>
            </div>
          ` : `<span class="text-muted">Pendiente de reporte</span>`}
        </td>
        <td>
          <div>
            <strong>${escapeHtml(item.hotel)}</strong>
            ${item.report?.room ? `<span class="room-chip">Hab. ${escapeHtml(item.report.room)}</span>` : ''}
            <div class="small-subtext">Zona: ${escapeHtml(item.zone)}</div>
          </div>
        </td>
        <td>
          <span class="responders-text">${escapeHtml(item.responders)}</span>
          <div class="small-subtext">Envío: ${formatDateStr(item.dispatchTime)}</div>
        </td>
        <td>
          ${item.report?.phone ? `
            <div class="phone-table-cell">
              <span class="flag-icon">${phoneInfo.flag}</span>
              <span class="phone-num">${escapeHtml(item.report.phone)}</span>
              <small class="country-sub">${phoneInfo.country}</small>
            </div>
          ` : `<span class="text-muted">--</span>`}
        </td>
        <td>
          ${item.status === 'EN_CAMINO' ? `<span class="badge badge-warning">🚚 En Camino</span>` : ''}
          ${item.status === 'EN_ATENCION' ? `<span class="badge badge-info">🩺 En Atención</span>` : ''}
          ${item.status === 'ATENDIDO_SEGUIMIENTO' && (!item.report || !item.report.followUpDone) ? `<span class="badge badge-purple">⏰ En Seguimiento</span>` : ''}
          ${item.status === 'RESUELTO' || item.report?.followUpDone ? `<span class="badge badge-success">✅ Resuelto</span>` : ''}
        </td>
        <td>
          ${item.report?.followUpRequired ? (
            item.report.followUpDone ? `<span class="text-emerald font-semibold">✅ Realizado</span>` : `
              <div class="countdown-cell">
                <span class="countdown-badge ${countdown.status}">${countdown.text}</span>
                <small class="target-time">Revisar: ${countdown.targetTimeFormatted}</small>
              </div>
            `
          ) : `<span class="text-muted text-xs">Sin seguimiento</span>`}
        </td>
        <td class="text-right">
          <div class="table-actions">
            <button class="btn-icon btn-action-view" title="Ver Ficha Clínica Imprimible" onclick="openDetailModal('${item.id}')"><i data-lucide="eye"></i></button>
            ${item.report?.followUpRequired && !item.report?.followUpDone ? `
              <button class="btn-icon btn-action-check" title="Marcar Seguimiento Realizado" onclick="markFollowUpDone('${item.id}')"><i data-lucide="check-circle"></i></button>
            ` : ''}
            ${item.status !== 'RESUELTO' ? `
              <button class="btn-icon btn-action-close" title="Finalizar y Cerrar Caso" onclick="closeCase('${item.id}')"><i data-lucide="check-circle-2"></i></button>
            ` : ''}
            <button class="btn-icon btn-action-delete" title="Eliminar Incidente" onclick="deleteCase('${item.id}')"><i data-lucide="trash-2"></i></button>
          </div>
        </td>
      </tr>
    `;
  }).join('');

  if (window.lucide) lucide.createIcons();
}

// ----------------------------------------------------
// ACCIONES CRUD Y MANEJADORES DE EVENTOS
// ----------------------------------------------------

async function markArrival(code) {
  const arrivalTime = new Date().toISOString();
  try {
    await fetch('api.php?action=mark_arrival', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: code, arrivalTime })
    });
  } catch (e) {
    console.warn('API error:', e);
  }

  // Actualización local para velocidad inmediata
  globalCases = globalCases.map(c => c.id === code ? { ...c, status: 'EN_ATENCION', arrivalTime } : c);
  localStorage.setItem('emergencias_local_v1', JSON.stringify(globalCases));
  renderAll();
}

async function handleDispatchSubmit(e) {
  e.preventDefault();
  const responders = document.getElementById('dispatchResponders').value.trim();
  const zone = document.getElementById('dispatchZone').value;
  const dispatchTime = document.getElementById('dispatchTime').value;
  const hotel = document.getElementById('dispatchHotel').value.trim();
  const urgency = document.getElementById('dispatchUrgency').value;

  if (!responders || !hotel) {
    alert('Complete los campos requeridos.');
    return;
  }

  const payload = { responders, zone, dispatchTime, hotel, urgency };

  try {
    await fetch('api.php?action=create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
  } catch (err) {
    console.warn('API fallback create:', err);
  }

  closeModal('modalDispatch');
  await fetchCases();
}

function openReportModal(code) {
  const item = globalCases.find(c => c.id === code);
  if (!item) return;

  document.getElementById('reportCaseCode').value = code;
  document.getElementById('reportModalSubhead').innerText = `Caso: ${code} | Hotel: ${item.hotel}`;
  document.getElementById('reportPatientName').value = item.report?.patientName || '';
  document.getElementById('reportRoom').value = item.report?.room || '';
  document.getElementById('reportVitals').value = item.report?.vitals || 'PA: 120/80 mmHg, FC: 75 bpm, SpO2: 98%, Temp: 36.5°C';
  document.getElementById('reportDetails').value = item.report?.details || '';
  document.getElementById('reportMedication').value = item.report?.medication || '';
  document.getElementById('reportMedReason').value = item.report?.medicationReason || '';
  document.getElementById('reportConclusion').value = item.report?.conclusion || '';
  document.getElementById('reportPhone').value = item.report?.phone || '+593';

  detectPhoneCountryLive();
  openModal('modalReport');
}

async function handleReportSubmit(e) {
  e.preventDefault();
  const code = document.getElementById('reportCaseCode').value;
  const patientName = document.getElementById('reportPatientName').value.trim();
  const room = document.getElementById('reportRoom').value;
  const vitals = document.getElementById('reportVitals').value.trim();
  const details = document.getElementById('reportDetails').value.trim();
  const medication = document.getElementById('reportMedication').value.trim();
  const medicationReason = document.getElementById('reportMedReason').value.trim();
  const conclusion = document.getElementById('reportConclusion').value.trim();
  const phone = document.getElementById('reportPhone').value.trim();

  const report = {
    patientName,
    room: Number(room) || room,
    vitals,
    details,
    medication,
    medicationReason,
    conclusion,
    phone,
    followUpRequired: selectedReportFollowUpRequired,
    followUpHours: selectedReportFollowUpHours,
  };

  try {
    await fetch('api.php?action=submit_report', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: code, report })
    });
  } catch (err) {
    console.warn('API error:', err);
  }

  closeModal('modalReport');
  await fetchCases();
}

async function markFollowUpDone(code) {
  try {
    await fetch('api.php?action=mark_followup_done', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: code })
    });
  } catch (err) {}
  await fetchCases();
}

async function closeCase(code) {
  try {
    await fetch('api.php?action=mark_followup_done', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: code })
    });
  } catch (err) {}
  await fetchCases();
}

async function deleteCase(code) {
  if (!confirm(`¿Eliminar el incidente ${code}?`)) return;
  try {
    await fetch('api.php?action=delete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: code })
    });
  } catch (err) {}
  await fetchCases();
}

function openDetailModal(code) {
  const item = globalCases.find(c => c.id === code);
  if (!item) return;

  const phoneInfo = item.report?.phone ? detectCountryFromPhone(item.report.phone) : null;
  const countdown = item.report?.followUpRequired
    ? getFollowUpCountdown(item.report.reportSubmittedAt, item.report.followUpHours)
    : null;

  document.getElementById('detailModalSubhead').innerText = `Caso: ${item.id} | Hotel: ${item.hotel}`;
  const container = document.getElementById('detailPrintContent');

  container.innerHTML = `
    <div class="print-header-brand">
      <div class="brand-logo-text">
        <h2>🚑 BRIGADAS MÓVILES DE EMERGENCIAS MÉDICAS</h2>
        <p>Ficha de Atención en Sitio y Seguimiento de Paciente</p>
      </div>
      <div class="case-id-tag">
        <span>Nº CASO: <strong>${item.id}</strong></span>
        <small>Fecha: ${formatDateStr(item.createdTime)}</small>
      </div>
    </div>

    <div class="detail-section">
      <h4 class="section-title">📍 Informes del Despacho y Ubicación</h4>
      <div class="detail-grid-3">
        <div class="detail-item"><span class="label">Brigadistas Enviados:</span><span class="value font-semibold">${escapeHtml(item.responders)}</span></div>
        <div class="detail-item"><span class="label">Zona:</span><span class="value">${escapeHtml(item.zone)}</span></div>
        <div class="detail-item"><span class="label">Hotel Destino:</span><span class="value font-bold text-amber">${escapeHtml(item.hotel)}</span></div>
        <div class="detail-item"><span class="label">Hora Envío:</span><span class="value">${formatDateStr(item.dispatchTime)}</span></div>
        <div class="detail-item"><span class="label">Hora Arribo:</span><span class="value">${item.arrivalTime ? formatDateStr(item.arrivalTime) : 'No registrada'}</span></div>
        <div class="detail-item"><span class="label">Tiempo Respuesta:</span><span class="value">${item.arrivalTime ? getElapsedTime(item.dispatchTime) : 'En tránsito'}</span></div>
      </div>
    </div>

    ${item.report ? `
      <div class="detail-section highlight-card">
        <h4 class="section-title">🩺 Reporte Médico Formulario (10 Campos)</h4>
        <div class="detail-grid-2">
          <div class="detail-item"><span class="label">1. Hermano Atendido:</span><span class="value text-lg font-bold text-cyan">${escapeHtml(item.report.patientName)}</span></div>
          <div class="detail-item"><span class="label">2. Habitación:</span><span class="value text-lg font-bold text-amber">Hab. ${escapeHtml(item.report.room)}</span></div>
        </div>

        <div class="detail-item full-width mt-2">
          <span class="label">3. Signos Vitales:</span>
          <div class="vitals-banner"><strong>${escapeHtml(item.report.vitals)}</strong></div>
        </div>

        <div class="detail-grid-2 mt-3">
          <div class="detail-item"><span class="label">4. Detalles Adicionales:</span><p class="value-box">${escapeHtml(item.report.details)}</p></div>
          <div class="detail-item"><span class="label">5. Medicación Usada:</span><p class="value-box highlight-med">💊 ${escapeHtml(item.report.medication)}</p></div>
        </div>

        <div class="detail-grid-2 mt-2">
          <div class="detail-item"><span class="label">6. ¿Por qué de la Medicación?:</span><p class="value-box">${escapeHtml(item.report.medicationReason)}</p></div>
          <div class="detail-item"><span class="label">7. Conclusión / Diagnóstico:</span><p class="value-box text-emerald-bright">${escapeHtml(item.report.conclusion)}</p></div>
        </div>

        <div class="detail-grid-2 mt-3">
          <div class="detail-item">
            <span class="label">8. Teléfono Contacto:</span>
            <div class="phone-badge-result">
              <span>${item.report.phone}</span>
              ${phoneInfo ? `<span class="country-tag">${phoneInfo.flag} ${phoneInfo.country}</span>` : ''}
            </div>
          </div>
          <div class="detail-item">
            <span class="label">9 & 10. Seguimiento Programado:</span>
            <div>
              ${item.report.followUpRequired ? (
                item.report.followUpDone ? `<span class="badge badge-success">✅ Seguimiento Completado</span>` : `<span class="badge badge-warning">${countdown.text} (${item.report.followUpHours}h)</span>`
              ) : `<span class="badge badge-secondary">❌ Sin seguimiento requerido</span>`}
            </div>
          </div>
        </div>
      </div>
    ` : `<div class="empty-report-warning"><p>Pendiente de llenar el formulario médico por la brigada.</p></div>`}
  `;

  openModal('modalDetail');
}

// ----------------------------------------------------
// NAVEGACIÓN DE PESTAÑAS, AUTENTICACIÓN (PIN: 2026) Y MODALES
// ----------------------------------------------------

let isDashboardUnlocked = false;
let pendingTabTarget = null;

function switchTab(tab) {
  if (tab === 'DASHBOARD' && !isDashboardUnlocked) {
    pendingTabTarget = 'DASHBOARD';
    openPinModal();
    return;
  }

  currentTab = tab;
  document.getElementById('btnTabActive').className = `nav-tab ${tab === 'ACTIVE' ? 'active' : ''}`;
  document.getElementById('btnTabDashboard').className = `nav-tab ${tab === 'DASHBOARD' ? 'active' : ''}`;

  document.getElementById('viewActiveCases').classList.toggle('hidden', tab !== 'ACTIVE');
  document.getElementById('viewDashboard').classList.toggle('hidden', tab !== 'DASHBOARD');
}

function openPinModal() {
  const pinInput = document.getElementById('pinInputCode');
  if (pinInput) pinInput.value = '';
  const errorText = document.getElementById('pinErrorMsg');
  if (errorText) errorText.classList.add('hidden');
  openModal('modalPin');
  setTimeout(() => { if (pinInput) pinInput.focus(); }, 150);
}

function verifyPinSubmit(e) {
  if (e) e.preventDefault();
  const input = document.getElementById('pinInputCode')?.value.trim();
  const errorText = document.getElementById('pinErrorMsg');

  if (input === '2026') {
    isDashboardUnlocked = true;
    closeModal('modalPin');
    if (pendingTabTarget === 'DASHBOARD') {
      pendingTabTarget = null;
      switchTab('DASHBOARD');
    }
  } else {
    if (errorText) {
      errorText.innerText = '❌ Clave incorrecta. Intente nuevamente.';
      errorText.classList.remove('hidden');
    } else {
      alert('❌ Clave incorrecta. Acceso denegado.');
    }
  }
}

function setKpiFilter(filter) {
  kpiFilter = filter;
  if (!isDashboardUnlocked) {
    pendingTabTarget = 'DASHBOARD';
    openPinModal();
    return;
  }
  switchTab('DASHBOARD');
  renderDashboardTable();
}

function openDispatchModal() {
  openModal('modalDispatch');
}

function openModal(id) {
  document.getElementById(id).classList.remove('hidden');
}

function closeModal(id) {
  document.getElementById(id).classList.add('hidden');
}

function setVitalPreset(text) {
  document.getElementById('reportVitals').value = text;
}

function setFollowUpToggle(val) {
  selectedReportFollowUpRequired = val;
  document.getElementById('btnFollowUpYes').className = `btn-toggle ${val ? 'active-yes' : ''}`;
  document.getElementById('btnFollowUpNo').className = `btn-toggle ${!val ? 'active-no' : ''}`;
  document.getElementById('followUpHoursGroup').style.display = val ? 'flex' : 'none';
}

function setTimerChip(hours, btn) {
  selectedReportFollowUpHours = hours;
  document.querySelectorAll('.btn-timer-chip').forEach(b => b.classList.remove('selected'));
  btn.classList.add('selected');
}

function exportJSONBackup() {
  const jsonStr = JSON.stringify(globalCases, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `respaldo_emergencias_brigadas_${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

// ----------------------------------------------------
// AUXILIARES UTILITARIOS
// ----------------------------------------------------

function detectCountryFromPhone(phone) {
  if (!phone || typeof phone !== 'string') return { country: 'Desconocido', flag: '🌐' };
  const clean = phone.trim();
  if (!clean.startsWith('+')) return { country: 'Local', flag: '📱' };

  const sorted = [...COUNTRY_CODES].sort((a, b) => b.code.length - a.code.length);
  for (const item of sorted) {
    if (clean.startsWith(item.code)) return item;
  }
  return { country: 'Internacional', flag: '🌍' };
}

function formatDateStr(isoStr) {
  if (!isoStr) return '--:--';
  let cleanStr = String(isoStr).trim();
  if (cleanStr.includes(' ') && !cleanStr.includes('T')) {
    cleanStr = cleanStr.replace(' ', 'T');
  }
  const d = new Date(cleanStr);
  if (isNaN(d.getTime())) return isoStr;
  return d.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', hour12: true });
}

function getElapsedTime(isoStr) {
  if (!isoStr) return '0 min';
  let cleanStr = String(isoStr).trim();
  if (cleanStr.includes(' ') && !cleanStr.includes('T')) {
    cleanStr = cleanStr.replace(' ', 'T');
  }
  const start = new Date(cleanStr).getTime();
  if (isNaN(start)) return '0 min';
  const diffMs = Math.max(0, Date.now() - start);
  const totalMins = Math.floor(diffMs / 60000);
  const hrs = Math.floor(totalMins / 60);
  const mins = totalMins % 60;
  return hrs > 0 ? `${hrs}h ${mins}m` : `${mins} min`;
}

function getFollowUpCountdown(reportIsoStr, hours) {
  if (!reportIsoStr || !hours) return { status: 'none', text: 'No programado' };
  const target = new Date(reportIsoStr).getTime() + (hours * 3600000);
  const diffMs = target - Date.now();
  const targetDateStr = formatDateStr(new Date(target).toISOString());

  if (diffMs <= 0) {
    const overdueMins = Math.floor(Math.abs(diffMs) / 60000);
    const hrs = Math.floor(overdueMins / 60);
    const mins = overdueMins % 60;
    return {
      status: 'overdue',
      text: `⚠️ VENCIDO (hace ${hrs > 0 ? hrs + 'h ' + mins + 'm' : mins + ' min'})`,
      targetTimeFormatted: targetDateStr
    };
  }

  const remMins = Math.floor(diffMs / 60000);
  const hrs = Math.floor(remMins / 60);
  const mins = remMins % 60;
  return {
    status: hrs < 2 ? 'urgent' : 'pending',
    text: `⏱️ En ${hrs}h ${mins}m`,
    targetTimeFormatted: targetDateStr
  };
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str).replace(/[&<>"']/g, function(m) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[m];
  });
}
