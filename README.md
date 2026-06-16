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

Endpoints temporales creados para practicar métodos HTTP. El listado de
usuarios ya devuelve datos cargados en memoria; el resto de rutas siguen siendo
simuladas.

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
  "name": "Laura Martínez",
  "email": "laura@email.com",
  "password": "123456"
}
```

Respuesta esperada:

```json
{
  "message": "Usuario recibido para crear",
  "data": {
    "name": "Laura Martínez",
    "email": "laura@email.com",
    "password": "123456"
  }
}
```

#### Actualizar usuario

```http
PATCH /api/users/:id
```

Ejemplo:

```http
PATCH /api/users/1
```

Body de ejemplo:

```json
{
  "name": "Laura García"
}
```

Respuesta esperada:

```json
{
  "message": "Usuario recibido para actualizar",
  "id": "1",
  "changes": {
    "name": "Laura García"
  }
}
```

#### Eliminar o desactivar usuario

```http
DELETE /api/users/:id
```

Ejemplo:

```http
DELETE /api/users/1
```

Respuesta esperada:

```json
{
  "message": "Usuario recibido para eliminar o desactivar",
  "id": "1"
}
```

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
