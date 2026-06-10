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

Endpoints temporales creados para practicar métodos HTTP. Todavía no usan base
de datos; devuelven respuestas simuladas.

#### Listar usuarios

```http
GET /api/users
```

Respuesta esperada:

```json
{
  "message": "Listado de usuarios",
  "data": []
}
```

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
  "message": "Detalle de usuario",
  "id": "1"
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

## Documentación del reto

- [Día 1 - Diseño inicial](docs/dia_01_diseno_inicial.md)
- [Día 2 - Preparación del proyecto](docs/dia_02_preparacion_proyecto.md)
- [Día 3 - Primer endpoint](docs/dia_03_primer_endpoint.md)
- [Día 4 - Métodos HTTP](docs/dia_04_metodos_http.md)
