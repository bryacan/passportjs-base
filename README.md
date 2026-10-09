# 🛡️ Sistema de Autenticación Seguro JWT (Node.js & Passport)

Un sistema backend robusto, seguro y escalable construido con **Node.js, Express, Passport.js y MongoDB**. Este repositorio incluye una API RESTful completa y un frontend SPA (Single Page Application) en Vanilla JS para demostrar la autenticación sin estado (stateless) y la gestión de tokens en un entorno real.

## 🚀 Tecnologías

*   **Backend:** Node.js, Express.js
*   **Base de Datos:** MongoDB, Mongoose (ODM)
*   **Seguridad y Autenticación:** Passport.js (Estrategia JWT), JSON Web Tokens (JWT), Bcrypt (Encriptación de contraseñas)
*   **Frontend:** Vanilla JavaScript (Módulos ES6), HTML5, CSS3

## ✨ Características Técnicas Principales

*   **Autenticación Stateless:** Implementación de JSON Web Tokens (JWT) para sesiones de usuario seguras y escalables sin almacenar estado en el servidor.
*   **Encriptación Segura:** Las contraseñas se encriptan utilizando `bcrypt` antes de guardarse en la base de datos.
*   **Protección de Rutas:** Los endpoints privados de la API (ej. ver o modificar perfiles) están protegidos mediante el middleware JWT de Passport.
*   **Lógica basada en Roles:** Diferenciación entre roles de 'Cliente' y 'Administrador' para el enrutamiento y control de acceso a los datos.
*   **Gestión de Tokens en el Frontend:** La SPA almacena de forma segura el JWT en `sessionStorage` y lo envía como token `Bearer` en la cabecera `Authorization` para todas las peticiones protegidas, utilizando un patrón Proxy en JS.
*   **Expiración de Tokens:** Los JWT están configurados con un tiempo de expiración estricto de 60 segundos para maximizar la seguridad.

## ⚙️ Arquitectura y Endpoints de la API

El sistema sigue una arquitectura Modelo-Vista-Presentador (MVP) en el frontend y un patrón similar a MVC en el backend.

**Endpoints Públicos:**
*   `POST /api/usuarios` - Registro de nuevos usuarios (Signup).
*   `POST /api/autenticar` - Inicio de sesión, verificación de contraseña y generación del JWT (Signin).
*   `GET /api/libros` - Obtención de datos del catálogo público.

**Endpoints Privados (Requieren token JWT Bearer):**
*   `GET /api/usuarios/actual` - Obtiene el perfil del usuario autenticado actualmente.
*   `GET /api/usuarios/:id` - Obtiene los datos de un usuario específico.
*   `PUT /api/usuarios/:id` - Actualiza la información del perfil del usuario.

## 🛠️ Instalación y Uso

1. **Clonar el repositorio:**
   ```bash
   git clone [https://github.com/bryacan/passportjs-base.git](https://github.com/bryacan/passportjs-base.git)
   cd passportjs-base
