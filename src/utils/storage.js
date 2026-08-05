import { INITIAL_CASES } from '../data/initialMockData';

const STORAGE_KEY = 'brigadas_medicas_emergencias_v1';

/**
 * Obtiene los casos almacenados en LocalStorage o inicializa con datos de demostración
 */
export function getStoredCases() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_CASES));
      return INITIAL_CASES;
    }
    return JSON.parse(data);
  } catch (error) {
    console.error('Error al leer LocalStorage:', error);
    return INITIAL_CASES;
  }
}

/**
 * Guarda el arreglo de casos en LocalStorage
 */
export function saveCases(cases) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cases));
  } catch (error) {
    console.error('Error al guardar en LocalStorage:', error);
  }
}

/**
 * Descarga una copia de respaldo en formato JSON de la base de datos de casos
 */
export function exportDatabaseJSON(cases) {
  const jsonString = JSON.stringify(cases, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const timestamp = new Date().toISOString().slice(0, 10);
  const link = document.createElement('a');
  link.href = url;
  link.download = `respaldo_emergencias_brigadas_${timestamp}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Restablece la base de datos a los casos de demostración iniciales
 */
export function resetDatabase() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_CASES));
  return INITIAL_CASES;
}
