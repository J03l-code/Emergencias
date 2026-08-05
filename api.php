<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once __DIR__ . '/config.php';
date_default_timezone_set('America/Guayaquil');

$db = getDBConnection();
$jsonFile = __DIR__ . '/database.json';

// Inicializar datos JSON si MySQL aún no está configurado
function getJsonData($jsonFile) {
    if (!file_exists($jsonFile)) {
        $initial = [
            [
                'id' => 'EMG-1001',
                'code' => 'EMG-1001',
                'createdTime' => date('Y-m-d H:i:s', strtotime('-25 minutes')),
                'responders' => 'Roberto Mendoza, Juan Pérez',
                'zone' => 'Zona A',
                'dispatchTime' => date('Y-m-d H:i:s', strtotime('-25 minutes')),
                'hotel' => 'Hotel Ibis',
                'urgency' => 'P1',
                'status' => 'EN_CAMINO',
                'arrivalTime' => null,
                'report' => null
            ],
            [
                'id' => 'EMG-1002',
                'code' => 'EMG-1002',
                'createdTime' => date('Y-m-d H:i:s', strtotime('-50 minutes')),
                'responders' => 'Elena Gómez, Sofia Ramírez',
                'zone' => 'Zona B',
                'dispatchTime' => date('Y-m-d H:i:s', strtotime('-50 minutes')),
                'hotel' => 'Hotel Ibis',
                'urgency' => 'P2',
                'status' => 'EN_ATENCION',
                'arrivalTime' => date('Y-m-d H:i:s', strtotime('-18 minutes')),
                'report' => null
            ],
            [
                'id' => 'EMG-1003',
                'code' => 'EMG-1003',
                'createdTime' => date('Y-m-d H:i:s', strtotime('-3.5 hours')),
                'responders' => 'Carlos Ruiz, David Torres',
                'zone' => 'Zona C',
                'dispatchTime' => date('Y-m-d H:i:s', strtotime('-3.5 hours')),
                'hotel' => 'Hotel Ibis',
                'urgency' => 'P2',
                'status' => 'ATENDIDO_SEGUIMIENTO',
                'arrivalTime' => date('Y-m-d H:i:s', strtotime('-3.1 hours')),
                'report' => [
                    'patientName' => 'Mateo Alvarado',
                    'room' => '408',
                    'vitals' => 'PA: 135/85 mmHg, FC: 82 bpm, SpO2: 97%, Temp: 37.8°C',
                    'details' => 'Presenta cuadro febril moderado y cefalea leve iniciada en horas de la mañana.',
                    'medication' => 'Paracetamol 500mg (1 tab) + Suero oral',
                    'medicationReason' => 'Control térmico y deshidratación leve por viaje',
                    'conclusion' => 'Cefalea por fatiga de viaje con febrícula. Estable.',
                    'phone' => '+593998765432',
                    'followUpRequired' => true,
                    'followUpHours' => 8,
                    'reportSubmittedAt' => date('Y-m-d H:i:s', strtotime('-2.5 hours')),
                    'followUpDone' => false
                ]
            ]
        ];
        file_put_contents($jsonFile, json_encode($initial, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
        return $initial;
    }
    $content = file_get_contents($jsonFile);
    return json_decode($content, true) ?: [];
}

function saveJsonData($jsonFile, $data) {
    file_put_contents($jsonFile, json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
}

$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? 'list';

try {
    if ($method === 'GET' && $action === 'list') {
        if ($db) {
            $stmt = $db->query("SELECT * FROM emergencias ORDER BY id DESC");
            $rows = $stmt->fetchAll();
            $cases = [];
            foreach ($rows as $row) {
                $report = null;
                if (!empty($row['patient_name'])) {
                    $report = [
                        'patientName' => $row['patient_name'],
                        'room' => $row['room'],
                        'vitals' => $row['vitals'],
                        'details' => $row['details'],
                        'medication' => $row['medication'],
                        'medicationReason' => $row['medication_reason'],
                        'conclusion' => $row['conclusion'],
                        'phone' => $row['phone'],
                        'followUpRequired' => (bool)$row['follow_up_required'],
                        'followUpHours' => (int)$row['follow_up_hours'],
                        'reportSubmittedAt' => $row['report_submitted_at'],
                        'followUpDone' => (bool)$row['follow_up_done'],
                    ];
                }
                $cases[] = [
                    'id' => $row['code'],
                    'db_id' => $row['id'],
                    'createdTime' => $row['created_time'],
                    'responders' => $row['responders'],
                    'zone' => $row['zone'],
                    'dispatchTime' => $row['dispatch_time'],
                    'hotel' => $row['hotel'],
                    'urgency' => $row['urgency'],
                    'status' => $row['status'],
                    'arrivalTime' => $row['arrival_time'],
                    'notes' => $row['notes'],
                    'report' => $report
                ];
            }
            echo json_encode(['status' => 'success', 'source' => 'mysql', 'data' => $cases]);
        } else {
            $cases = getJsonData($jsonFile);
            echo json_encode(['status' => 'success', 'source' => 'json_fallback', 'data' => $cases]);
        }
        exit();
    }

    $input = json_decode(file_get_contents('php://input'), true);

    if ($method === 'POST' && $action === 'create') {
        $code = 'EMG-' . rand(1000, 9999);
        $createdTime = date('Y-m-d H:i:s');
        $responders = $input['responders'] ?? '';
        $zone = $input['zone'] ?? '';
        $dispatchTime = $input['dispatchTime'] ?? $createdTime;
        $hotel = $input['hotel'] ?? '';
        $urgency = $input['urgency'] ?? 'P2';
        $status = 'EN_CAMINO';

        if ($db) {
            $stmt = $db->prepare("INSERT INTO emergencias (code, created_time, responders, zone, dispatch_time, hotel, urgency, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
            $stmt->execute([$code, $createdTime, $responders, $zone, $dispatchTime, $hotel, $urgency, $status]);
        } else {
            $cases = getJsonData($jsonFile);
            $newCase = [
                'id' => $code,
                'code' => $code,
                'createdTime' => $createdTime,
                'responders' => $responders,
                'zone' => $zone,
                'dispatchTime' => $dispatchTime,
                'hotel' => $hotel,
                'urgency' => $urgency,
                'status' => $status,
                'arrivalTime' => null,
                'report' => null
            ];
            array_unshift($cases, $newCase);
            saveJsonData($jsonFile, $cases);
        }
        echo json_encode(['status' => 'success', 'message' => 'Emergencia despachada']);
        exit();
    }

    if ($method === 'POST' && $action === 'mark_arrival') {
        $code = $input['id'] ?? '';
        $arrivalTime = !empty($input['arrivalTime']) ? $input['arrivalTime'] : date('Y-m-d H:i:s');

        if ($db) {
            $stmt = $db->prepare("UPDATE emergencias SET status = 'EN_ATENCION', arrival_time = ? WHERE code = ?");
            $stmt->execute([$arrivalTime, $code]);
        } else {
            $cases = getJsonData($jsonFile);
            foreach ($cases as &$item) {
                if ($item['id'] === $code) {
                    $item['status'] = 'EN_ATENCION';
                    $item['arrivalTime'] = $arrivalTime;
                }
            }
            saveJsonData($jsonFile, $cases);
        }
        echo json_encode(['status' => 'success', 'message' => 'Llegada registrada']);
        exit();
    }

    if ($method === 'POST' && $action === 'submit_report') {
        $code = $input['id'] ?? '';
        $report = $input['report'] ?? [];
        $submittedAt = date('Y-m-d H:i:s');
        $followUpReq = !empty($report['followUpRequired']) ? 1 : 0;
        $nextStatus = $followUpReq ? 'ATENDIDO_SEGUIMIENTO' : 'RESUELTO';

        if ($db) {
            $stmt = $db->prepare("UPDATE emergencias SET 
                status = ?,
                patient_name = ?,
                room = ?,
                vitals = ?,
                details = ?,
                medication = ?,
                medication_reason = ?,
                conclusion = ?,
                phone = ?,
                follow_up_required = ?,
                follow_up_hours = ?,
                report_submitted_at = ?,
                follow_up_done = 0
                WHERE code = ?");
            $stmt->execute([
                $nextStatus,
                $report['patientName'] ?? '',
                $report['room'] ?? '',
                $report['vitals'] ?? '',
                $report['details'] ?? '',
                $report['medication'] ?? '',
                $report['medicationReason'] ?? '',
                $report['conclusion'] ?? '',
                $report['phone'] ?? '',
                $followUpReq,
                $report['followUpHours'] ?? null,
                $submittedAt,
                $code
            ]);
        } else {
            $cases = getJsonData($jsonFile);
            foreach ($cases as &$item) {
                if ($item['id'] === $code) {
                    $item['status'] = $nextStatus;
                    $item['report'] = array_merge($report, [
                        'reportSubmittedAt' => $submittedAt,
                        'followUpDone' => false
                    ]);
                }
            }
            saveJsonData($jsonFile, $cases);
        }
        echo json_encode(['status' => 'success', 'message' => 'Reporte médico enviado']);
        exit();
    }

    if ($method === 'POST' && $action === 'mark_followup_done') {
        $code = $input['id'] ?? '';

        if ($db) {
            $stmt = $db->prepare("UPDATE emergencias SET status = 'RESUELTO', follow_up_done = 1 WHERE code = ?");
            $stmt->execute([$code]);
        } else {
            $cases = getJsonData($jsonFile);
            foreach ($cases as &$item) {
                if ($item['id'] === $code) {
                    $item['status'] = 'RESUELTO';
                    if (isset($item['report'])) {
                        $item['report']['followUpDone'] = true;
                    }
                }
            }
            saveJsonData($jsonFile, $cases);
        }
        echo json_encode(['status' => 'success', 'message' => 'Seguimiento completado']);
        exit();
    }

    if ($method === 'POST' && $action === 'delete') {
        $code = $input['id'] ?? '';

        if ($db) {
            $stmt = $db->prepare("DELETE FROM emergencias WHERE code = ?");
            $stmt->execute([$code]);
        } else {
            $cases = getJsonData($jsonFile);
            $cases = array_values(array_filter($cases, function($c) use ($code) {
                return $c['id'] !== $code;
            }));
            saveJsonData($jsonFile, $cases);
        }
        echo json_encode(['status' => 'success', 'message' => 'Caso eliminado']);
        exit();
    }

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
}
