<?php
/**
 * Configuración de Conexión a Base de Datos MySQL (Hostinger)
 * 
 * En Hostinger hPanel:
 * 1. Ve a "Base de datos MySQL".
 * 2. Crea una nueva base de datos y usuario.
 * 3. Reemplaza los datos a continuación con los de tu Hostinger.
 */

define('DB_HOST', 'localhost');          // En Hostinger suele ser 'localhost'
define('DB_USER', 'u123456789_brigada'); // Tu usuario de MySQL en Hostinger
define('DB_PASS', 'TuPasswordSeguro123!');// Tu contraseña de MySQL en Hostinger
define('DB_NAME', 'u123456789_emergencias'); // El nombre de tu base de datos

/**
 * Función para obtener la conexión PDO a MySQL
 */
function getDBConnection() {
    try {
        $dsn = "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=utf8mb4";
        $options = [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES   => false,
        ];
        return new PDO($dsn, DB_USER, DB_PASS, $options);
    } catch (PDOException $e) {
        // Devuelve null si aún no se ha configurado la BD en Hostinger para activar respaldo JSON automático
        return null;
    }
}
