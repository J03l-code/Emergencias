export const INITIAL_CASES = [
  {
    id: 'EMG-1001',
    createdTime: new Date(Date.now() - 25 * 60 * 1000).toISOString(), // 25 min ago
    responders: 'Dr. Roberto Mendoza, Hno. Juan Pérez',
    zone: 'Zona Norte - Bloque B',
    dispatchTime: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
    hotel: 'Hotel Oro Verde - Centro Histórico',
    urgency: 'P1', // P1: Alta/Crítica, P2: Media, P3: Leve
    status: 'EN_CAMINO', // EN_CAMINO | EN_ATENCION | ATENDIDO_SEGUIMIENTO | RESUELTO
    arrivalTime: null,
    report: null,
  },
  {
    id: 'EMG-1002',
    createdTime: new Date(Date.now() - 50 * 60 * 1000).toISOString(), // 50 min ago
    responders: 'Dra. Elena Gómez, Hna. Sofia Ramírez',
    zone: 'Zona Centro - Sector Turístico',
    dispatchTime: new Date(Date.now() - 50 * 60 * 1000).toISOString(),
    hotel: 'Hotel Wyndham Grand',
    urgency: 'P2',
    status: 'EN_ATENCION',
    arrivalTime: new Date(Date.now() - 18 * 60 * 1000).toISOString(), // arrived 18 min ago
    report: null,
  },
  {
    id: 'EMG-1003',
    createdTime: new Date(Date.now() - 3.5 * 60 * 60 * 1000).toISOString(), // 3.5 hrs ago
    responders: 'Dr. Carlos Ruiz, Hno. David Torres',
    zone: 'Zona Sur - Perímetro A',
    dispatchTime: new Date(Date.now() - 3.5 * 60 * 60 * 1000).toISOString(),
    hotel: 'Hotel Radisson Royal',
    urgency: 'P2',
    status: 'ATENDIDO_SEGUIMIENTO',
    arrivalTime: new Date(Date.now() - 3.1 * 60 * 60 * 1000).toISOString(),
    report: {
      patientName: 'Hno. Mateo Alvarado',
      room: '408',
      vitals: 'PA: 135/85 mmHg, FC: 82 bpm, SpO2: 97%, Temp: 37.8°C',
      details: 'Presenta cuadro febril moderado y cefalea leve iniciada en horas de la mañana.',
      medication: 'Paracetamol 500mg (1 tab) vía oral + Suero de rehidratación oral',
      medicationReason: 'Control térmico y deshidratación leve por viaje',
      conclusion: 'Cefalea por fatiga de viaje con febrícula. Estable. Se recomienda reposo.',
      phone: '+593998765432',
      followUpRequired: true,
      followUpHours: 8,
      reportSubmittedAt: new Date(Date.now() - 2.5 * 60 * 60 * 1000).toISOString(),
      followUpDone: false,
    }
  },
  {
    id: 'EMG-1004',
    createdTime: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString(), // 10 hrs ago
    responders: 'Hno. Miguel Ángel, Dra. Lucía Fernández',
    zone: 'Zona Norte - Bloque C',
    dispatchTime: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString(),
    hotel: 'Hotel Marriott Executive',
    urgency: 'P3',
    status: 'RESUELTO',
    arrivalTime: new Date(Date.now() - 9.5 * 60 * 60 * 1000).toISOString(),
    report: {
      patientName: 'Hna. Carmen Benítez',
      room: '215',
      vitals: 'PA: 118/75 mmHg, FC: 70 bpm, SpO2: 99%, Temp: 36.4°C',
      details: 'Rozadura menor en tobillo derecho por caminata prolongada.',
      medication: 'Curación antiséptica local + Vendaje protector estéril',
      medicationReason: 'Prevención de infección y curación de abrasión leve',
      conclusion: 'Lesión superficial resuelta en sitio. Sin novedad.',
      phone: '+34612345678',
      followUpRequired: false,
      followUpHours: null,
      reportSubmittedAt: new Date(Date.now() - 9 * 60 * 60 * 1000).toISOString(),
      followUpDone: true,
    }
  }
];
