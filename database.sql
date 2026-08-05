-- ==========================================================
-- SCRIPT SQL PARA CREAR LA BASE DE DATOS EN HOSTINGER (phpMyAdmin)
-- ==========================================================

CREATE TABLE IF NOT EXISTS `emergencias` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `code` VARCHAR(20) NOT NULL UNIQUE,
  `created_time` DATETIME NOT NULL,
  `responders` VARCHAR(255) NOT NULL,
  `zone` VARCHAR(100) NOT NULL,
  `dispatch_time` DATETIME NOT NULL,
  `hotel` VARCHAR(255) NOT NULL,
  `urgency` ENUM('P1', 'P2', 'P3') DEFAULT 'P2',
  `status` ENUM('EN_CAMINO', 'EN_ATENCION', 'ATENDIDO_SEGUIMIENTO', 'RESUELTO') DEFAULT 'EN_CAMINO',
  `arrival_time` DATETIME NULL,
  `notes` TEXT NULL,
  
  -- Campos del Reporte Médico Formulario (10 Campos + WhatsApp)
  `patient_name` VARCHAR(255) NULL,
  `room` VARCHAR(50) NULL,
  `vitals` TEXT NULL,
  `details` TEXT NULL,
  `medication` TEXT NULL,
  `medication_reason` TEXT NULL,
  `conclusion` TEXT NULL,
  `phone` VARCHAR(50) NULL,
  `has_whatsapp` TINYINT(1) DEFAULT 1,
  `follow_up_required` TINYINT(1) DEFAULT 0,
  `follow_up_hours` INT NULL,
  `report_submitted_at` DATETIME NULL,
  `follow_up_done` TINYINT(1) DEFAULT 0,
  
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insertar datos iniciales de demostración desde EMG-001
INSERT INTO `emergencias` 
(`code`, `created_time`, `responders`, `zone`, `dispatch_time`, `hotel`, `urgency`, `status`, `arrival_time`, `patient_name`, `room`, `vitals`, `details`, `medication`, `medication_reason`, `conclusion`, `phone`, `has_whatsapp`, `follow_up_required`, `follow_up_hours`, `report_submitted_at`, `follow_up_done`)
VALUES
('EMG-001', NOW() - INTERVAL 25 MINUTE, 'Roberto Mendoza, Juan Pérez', 'Zona A', NOW() - INTERVAL 25 MINUTE, 'Hotel Ibis', 'P1', 'EN_CAMINO', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, 0, NULL, NULL, 0),
('EMG-002', NOW() - INTERVAL 50 MINUTE, 'Elena Gómez, Sofia Ramírez', 'Zona B', NOW() - INTERVAL 50 MINUTE, 'Hotel Ibis', 'P2', 'EN_ATENCION', NOW() - INTERVAL 18 MINUTE, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, 0, NULL, NULL, 0),
('EMG-003', NOW() - INTERVAL 210 MINUTE, 'Carlos Ruiz, David Torres', 'Zona C', NOW() - INTERVAL 210 MINUTE, 'Hotel Ibis', 'P2', 'ATENDIDO_SEGUIMIENTO', NOW() - INTERVAL 180 MINUTE, 'Mateo Alvarado', '408', 'PA: 135/85 mmHg, FC: 82 bpm, SpO2: 97%, Temp: 37.8°C', 'Presenta cuadro febril moderado y cefalea leve iniciada en la mañana.', 'Paracetamol 500mg (1 tab) + Suero oral', 'Control térmico y deshidratación leve por viaje', 'Cefalea por fatiga de viaje con febrícula. Estable.', '+593998765432', 1, 1, 8, NOW() - INTERVAL 150 MINUTE, 0),
('EMG-004', NOW() - INTERVAL 600 MINUTE, 'Miguel Ángel, Lucía Fernández', 'Otro', NOW() - INTERVAL 600 MINUTE, 'Hotel Ibis', 'P3', 'RESUELTO', NOW() - INTERVAL 570 MINUTE, 'Carmen Benítez', '215', 'PA: 118/75 mmHg, FC: 70 bpm, SpO2: 99%, Temp: 36.4°C', 'Rozadura menor en tobillo derecho por caminata.', 'Curación antiséptica local + Vendaje estéril', 'Prevención de infección y curación de abrasión leve', 'Lesión superficial resuelta en sitio. Sin novedad.', '+34612345678', 1, 0, NULL, NOW() - INTERVAL 540 MINUTE, 1);
