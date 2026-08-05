# 🚀 GUÍA DE INSTALACIÓN Y CONFIGURACIÓN EN HOSTINGER (PHP + MySQL + JS)

Esta versión de la aplicación está optimizada con **PHP nativo + MySQL (PDO) + JavaScript Vanilla**, lo que garantiza **compatibilidad del 100% en Hostinger** y elimina por completo las pantallas en blanco.

---

## 📁 PASO 1: Subir los Archivos a Hostinger

1. Entra a tu panel de Hostinger **hPanel**.
2. Ve a **Sitios Web** ➔ **Administrador de Archivos (File Manager)**.
3. Entra a la carpeta **`public_html`** (o a la subcarpeta de tu subdominio `emergencias.jiyanedesign.com`).
4. Sube todos los archivos del proyecto directamente dentro de esa carpeta:
   - `index.php`
   - `index.html`
   - `api.php`
   - `config.php`
   - `database.sql`
   - `js/app.js`
   - `css/style.css`

> 💡 **Nota Importante:** La aplicación cuenta con un sistema de respaldo inteligente. Si aún no has configurado MySQL, funcionará inmediatamente usando un archivo de respaldo de base de datos JSON local sin dar pantallas en blanco.

---

## 🗄️ PASO 2: Configurar la Base de Datos MySQL en Hostinger

1. En tu panel de Hostinger, busca la opción **Base de datos MySQL** (o *MySQL Databases*).
2. Crea una nueva base de datos y anota los siguientes 3 datos:
   - **Nombre de la Base de Datos** (ejemplo: `u123456789_emergencias`)
   - **Usuario de MySQL** (ejemplo: `u123456789_brigada`)
   - **Contraseña de MySQL** (ejemplo: `TuPassword123!`)
3. Haz clic en el botón **phpMyAdmin** para abrir la interfaz de administración de la base de datos recién creada.
4. En phpMyAdmin, ve a la pestaña **Importar** (Import).
5. Selecciona el archivo **`database.sql`** que viene en el proyecto y haz clic en **Continuar / Importar**.
   *(Esto creará la tabla `emergencias` e insertará los casos de prueba)*.

---

## ⚙️ PASO 3: Vincular `config.php` con tus datos de Hostinger

Abre el archivo **`config.php`** en el Administrador de Archivos de Hostinger y edita las siguientes líneas con tus datos reales:

```php
define('DB_HOST', 'localhost');          // En Hostinger se mantiene 'localhost'
define('DB_USER', 'u123456789_brigada'); // Tu usuario de Hostinger
define('DB_PASS', 'TuPassword123!');    // Tu contraseña de Hostinger
define('DB_NAME', 'u123456789_emergencias'); // Tu base de datos de Hostinger
```

¡Guarda los cambios en `config.php` y tu aplicación cambiará la insignia automáticamente a **🟢 MySQL Conectado**!

---

## 🌟 Ventajas de esta Arquitectura

- **Cero pantallas en blanco**: No depende de módulos cliente complejos de Node/Vite.
- **Acceso directo**: Carga ultra-rápida en cualquier dispositivo móvil o computadora.
- **Formulario Médico de 10 Campos**: Incluye el detector de banderas telefónicas por país (`+593` 🇪🇨, `+34` 🇪🇸, `+1` 🇺🇸, `+52` 🇲🇽, etc.).
- **Persistencia Real**: Todos los casos se guardan directamente en MySQL y se pueden auditar en phpMyAdmin.
- **Ficha Imprimible**: Generación de reportes clínicos listos para PDF o impresora.
