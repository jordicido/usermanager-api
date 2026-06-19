# UserManager API

Reto opcional de construcción de una API REST de gestión de usuarios.

## Descripción

Este proyecto tiene como objetivo construir paso a paso una API REST capaz de
gestionar usuarios, autenticación, roles, seguridad, base de datos e integración
con un frontend.

## Instalación

Instalar dependencias:

```bash
npm install
```

Arrancar en modo desarrollo:

```bash
npm run dev
```

La API se ejecutará inicialmente en:

```text
http://localhost:3000
```

## Endpoints disponibles

### Inicio

```http
GET /
```

Respuesta esperada:

```json
{
  "message": "UserManager API"
}
```

### Health

```http
GET /api/health
```

Respuesta esperada:

```json
{
  "status": "ok",
  "message": "UserManager API funcionando",
  "timestamp": "2026-01-01T10:00:00.000Z"
}
```

### Usuarios

Endpoints creados para practicar métodos HTTP. El listado, el detalle, la
creación, la actualización y la desactivación de usuarios ya trabajan con datos
cargados en memoria.

#### Listar usuarios

```http
GET /api/users
```

Respuesta esperada:

```json
{
  "message": "Listado de usuarios",
  "total": 3,
  "data": [
    {
      "id": 1,
      "name": "Ana García",
      "email": "ana@email.com",
      "role": "USER",
      "isActive": true,
      "createdAt": "2026-01-01T10:00:00.000Z",
      "updatedAt": "2026-01-01T10:00:00.000Z"
    }
  ]
}
```

Las fechas pueden cambiar porque se generan al arrancar el servidor.

#### Ver detalle de usuario

```http
GET /api/users/:id
```

Ejemplo:

```http
GET /api/users/1
```

Respuesta esperada:

```json
{
  "message": "Usuario encontrado",
  "data": {
    "id": 1,
    "name": "Ana García",
    "email": "ana@email.com",
    "role": "USER",
    "isActive": true,
    "createdAt": "2026-01-01T10:00:00.000Z",
    "updatedAt": "2026-01-01T10:00:00.000Z"
  }
}
```

Posibles errores:

```json
{
  "error": "El ID debe ser un número",
  "received": "abc"
}
```

```json
{
  "error": "Usuario no encontrado",
  "id": 999
}
```

#### Listar usuarios activos

```http
GET /api/users/active
```

Respuesta esperada:

```json
{
  "message": "Listado de usuarios activos",
  "total": 2,
  "data": [
    {
      "id": 1,
      "name": "Ana García",
      "email": "ana@email.com",
      "role": "USER",
      "isActive": true,
      "createdAt": "2026-01-01T10:00:00.000Z",
      "updatedAt": "2026-01-01T10:00:00.000Z"
    }
  ]
}
```

#### Crear usuario

```http
POST /api/users
```

Body de ejemplo:

```json
{
  "name": "María López",
  "email": "maria@email.com",
  "password": "123456"
}
```

Respuesta esperada:

```json
{
  "message": "Usuario creado correctamente",
  "data": {
    "id": 4,
    "name": "María López",
    "email": "maria@email.com",
    "role": "USER",
    "isActive": true,
    "createdAt": "2026-01-01T10:00:00.000Z",
    "updatedAt": "2026-01-01T10:00:00.000Z"
  }
}
```

La respuesta usa el código `201 Created`. El usuario se añade al array
`users`, por lo que aparecerá en las siguientes consultas mientras el servidor
continúe encendido. La contraseña recibida se valida, pero no se guarda ni se
devuelve.

Posibles errores:

```json
{
  "error": "name, email y password son obligatorios"
}
```

```json
{
  "error": "La contraseña debe tener al menos 6 caracteres"
}
```

```json
{
  "error": "El email ya está registrado"
}
```

Los datos incompletos o una contraseña corta devuelven `400 Bad Request`. Un
email ya registrado devuelve `409 Conflict`.

#### Actualizar usuario

```http
PATCH /api/users/:id
```

Permite modificar parcialmente un usuario existente. Los campos admitidos son
`name`, `email` e `isActive`; los demás campos se mantienen sin cambios.

Ejemplo:

```http
PATCH /api/users/1
```

Body de ejemplo:

```json
{
  "name": "Ana Martínez"
}
```

Respuesta esperada:

```json
{
  "message": "Usuario actualizado correctamente",
  "data": {
    "id": 1,
    "name": "Ana Martínez",
    "email": "ana@email.com",
    "role": "USER",
    "isActive": true,
    "createdAt": "2026-01-01T10:00:00.000Z",
    "updatedAt": "2026-01-01T11:00:00.000Z"
  }
}
```

La API localiza el usuario, conserva los campos que no se han enviado y
actualiza automáticamente `updatedAt`.

Posibles errores:

```json
{
  "error": "El ID debe ser un número",
  "received": "abc"
}
```

```json
{
  "error": "Usuario no encontrado",
  "id": 999
}
```

```json
{
  "error": "Debes enviar al menos un campo para actualizar"
}
```

```json
{
  "error": "El nombre no puede estar vacío"
}
```

```json
{
  "error": "El email no tiene un formato válido"
}
```

```json
{
  "error": "El email ya está registrado"
}
```

```json
{
  "error": "isActive debe ser true o false"
}
```

Los datos incorrectos devuelven `400 Bad Request`, un usuario inexistente
devuelve `404 Not Found` y un email utilizado por otro usuario devuelve
`409 Conflict`.

#### Eliminar o desactivar usuario

```http
DELETE /api/users/:id
```

Esta ruta aplica un borrado lógico: el usuario no se elimina del array, sino que
se conserva con `isActive: false`. También se actualiza automáticamente
`updatedAt`.

Ejemplo:

```http
DELETE /api/users/1
```

Respuesta esperada:

```json
{
  "message": "Usuario desactivado correctamente",
  "data": {
    "id": 1,
    "name": "Ana García",
    "email": "ana@email.com",
    "role": "USER",
    "isActive": false,
    "createdAt": "2026-01-01T10:00:00.000Z",
    "updatedAt": "2026-01-01T12:00:00.000Z"
  }
}
```

El usuario sigue apareciendo en `GET /api/users` y se puede consultar por ID,
pero deja de aparecer en `GET /api/users/active`.

Posibles errores:

```json
{
  "error": "El ID debe ser un número",
  "received": "abc"
}
```

```json
{
  "error": "Usuario no encontrado",
  "id": 999
}
```

Un ID incorrecto devuelve `400 Bad Request` y un usuario inexistente devuelve
`404 Not Found`.

### Rutas temporales de debug

Rutas creadas para practicar cómo leer datos de una petición HTTP desde
Express. No forman parte de la API final.

```http
POST /api/debug/body
GET /api/debug/params/:id
GET /api/debug/query
GET /api/debug/headers
PATCH /api/debug/users/:id
POST /api/debug/request
```

#### Probar body

```http
POST /api/debug/body
```

Body de ejemplo:

```json
{
  "name": "Ana Garcia",
  "email": "ana@email.com"
}
```

#### Probar params

```http
GET /api/debug/params/25
```

#### Probar query params

```http
GET /api/debug/query?role=ADMIN&isActive=true
```

#### Probar headers

```http
GET /api/debug/headers
Authorization: Bearer token-de-prueba
```

#### Probar datos combinados

```http
PATCH /api/debug/users/7?notify=true
Authorization: Bearer token-de-prueba
```

Body de ejemplo:

```json
{
  "name": "Nombre actualizado"
}
```

#### Probar request completa

```http
POST /api/debug/request?source=thunder
x-client-name: thunder-client
```

Body de ejemplo:

```json
{
  "example": "datos de prueba"
}
```

## Documentación del reto

- [Día 1 - Diseño inicial](docs/dia_01_diseno_inicial.md)
- [Día 2 - Preparación del proyecto](docs/dia_02_preparacion_proyecto.md)
- [Día 3 - Primer endpoint](docs/dia_03_primer_endpoint.md)
- [Día 4 - Métodos HTTP](docs/dia_04_metodos_http.md)
- [Día 5 - JSON, body, params y headers](docs/dia_05_json_body_params_headers.md)
- [Día 6 - Cliente HTTP y depuración](docs/dia_06_cliente_http_depuracion.md)
- [Día 7 - Listado de usuarios en memoria](docs/dia_07_listado_usuarios.md)
- [Día 8 - Consultar usuario por ID](docs/dia_08_consultar_usuario_id.md)
- [Día 9 - Crear usuarios en memoria](docs/dia_09_crear_usuarios.md)
- [Día 10 - Actualizar usuarios en memoria](docs/dia_10_actualizar_usuarios.md)
- [Día 11 - Eliminar o desactivar usuarios en memoria](docs/dia_11_eliminar_desactivar_usuarios.md)
