# 🚑 Sistema de Gestión de Emergencias Médicas y Brigadas Móviles

Aplicación web profesional para la gestión de despacho, atención en sitio por brigadas móviles en hoteles y seguimiento médico continuo de pacientes.

---

## 🌟 Características Principales

### 1. 🚨 Asignación y Despacho de Emergencias
- Registro de brigadistas asignados.
- Definición de zona/bloque asignado.
- Captura de hora de envío y hotel de destino.
- Clasificación por nivel de urgencia (`🔴 P1 Crítica`, `🟠 P2 Urgente`, `🟢 P3 Leve`).

### 2. 📍 Registro de Arribo en Hotel ("¡Ya Llegamos!")
- Botón táctil de alta visibilidad para marcar llegada inmediata en sitio.
- Registro de fecha y hora exacta de arribo.
- Contador de tiempo de respuesta y atención transcurrido en vivo.

### 3. 🩺 Formulario Médica de Atención (10 Campos Requeridos)
1. **Nombre del hermano atendido** (Texto)
2. **Habitación** (Campo numérico)
3. **Signos vitales** (Alfanumérico con atajos de acceso rápido)
4. **Detalles adicionales** (Observaciones clínicas)
5. **Medicación usada** (Medicamentos suministrados)
6. **Por qué de la medicación** (Indicación médica)
7. **Conclusión** (Diagnóstico y estado al finalizar)
8. **Número telefónico** (Con autodetección automática de País y Bandera al usar `+`, ej: `+593` 🇪🇨 Ecuador, `+34` 🇪🇸 España, `+1` 🇺🇸 EEUU, `+52` 🇲🇽 México, `+57` 🇨🇴 Colombia, etc.)
9. **Seguimiento** (Selección Sí / No)
10. **Tiempo para volver a verificar estado** (Temporizadores de 8h / 12h / 24h)

### 4. 📊 Dashboard de Seguimiento y Base de Datos
- Vista en tiempo real para coordinadores médicos.
- Filtros por estado: *En Camino, En Atención, Requiere Seguimiento, Resuelto*.
- Búsqueda por hermano atendido, hotel, habitación, brigadista o teléfono.
- Temporizadores de cuenta regresiva para re-evaluación del paciente.
- Exportación e Importación de Base de Datos completa en formato JSON.
- Ficha clínica imprimible en formato médico oficial (`Ctrl + P` / Imprimir a PDF).

---

## 🚀 Instalación y Ejecución Local

```bash
# 1. Clonar el repositorio
git clone https://github.com/J03l-code/Emergencias.git
cd Emergencias

# 2. Instalar dependencias
npm install

# 3. Iniciar el servidor de desarrollo
npm run dev

# 4. Compilar para producción
npm run build
```

---

## 🛠️ Tecnologías Utilizadas

- **React 19** + **Vite 6**
- **Lucide React** (Iconografía clínica)
- **Vanilla CSS Tokens** (Tema oscuro médico, glassmorphic badges y soporte responsive)
- **LocalStorage API** (Persistencia de base de datos)
