/**
 * Formatea fechas a un estilo amigable en español
 */
export function formatDate(isoString) {
  if (!isoString) return '--:--';
  const date = new Date(isoString);
  if (isNaN(date.getTime())) return isoString;
  
  return new Intl.DateTimeFormat('es-ES', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  }).format(date);
}

/**
 * Formatea solo la hora
 */
export function formatTimeOnly(isoString) {
  if (!isoString) return '--:--';
  const date = new Date(isoString);
  if (isNaN(date.getTime())) return isoString;

  return date.toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
}

/**
 * Calcula tiempo transcurrido desde una fecha determinada (ej: tiempo en camino o tiempo en atención)
 */
export function getElapsedTime(startDateString) {
  if (!startDateString) return '0 min';
  const start = new Date(startDateString).getTime();
  const now = new Date().getTime();
  const diffMs = Math.max(0, now - start);

  const totalMinutes = Math.floor(diffMs / (1000 * 60));
  const hours = Math.floor(totalMinutes / 60);
  const mins = totalMinutes % 60;

  if (hours > 0) {
    return `${hours}h ${mins}m`;
  }
  return `${mins} min`;
}

/**
 * Calcula la cuenta regresiva para el siguiente seguimiento (8h, 12h, 24h)
 * @param {string} reportDateIso 
 * @param {number} followUpHours 
 */
export function getFollowUpCountdown(reportDateIso, followUpHours) {
  if (!reportDateIso || !followUpHours) return { status: 'none', text: 'No programado' };

  const reportTime = new Date(reportDateIso).getTime();
  const targetTime = reportTime + (followUpHours * 60 * 60 * 1000);
  const now = new Date().getTime();
  const diffMs = targetTime - now;

  const targetDateStr = formatDate(new Date(targetTime).toISOString());

  if (diffMs <= 0) {
    const overdueMinutes = Math.floor(Math.abs(diffMs) / (1000 * 60));
    const overdueHours = Math.floor(overdueMinutes / 60);
    const mins = overdueMinutes % 60;
    const timeOverdueText = overdueHours > 0 ? `${overdueHours}h ${mins}m` : `${mins} min`;

    return {
      status: 'overdue',
      text: `⚠️ VENCIDO (hace ${timeOverdueText})`,
      targetTimeFormatted: targetDateStr,
      diffMs
    };
  }

  const remainingMinutes = Math.floor(diffMs / (1000 * 60));
  const hours = Math.floor(remainingMinutes / 60);
  const mins = remainingMinutes % 60;

  const isUrgent = hours < 2;

  return {
    status: isUrgent ? 'urgent' : 'pending',
    text: `⏱️ En ${hours}h ${mins}m`,
    targetTimeFormatted: targetDateStr,
    diffMs
  };
}
