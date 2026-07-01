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
  "error": "El nombre debe ser un texto no vacío"
}
```

```json
{
  "error": "El email debe ser un texto no vacío"
}
```

```json
{
  "error": "La contraseña debe ser un texto no vacío"
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
  "error": "El nombre debe ser un texto no vacío"
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

## Validaciones básicas

La API valida manualmente los datos antes de crear o actualizar usuarios. De
este modo, una petición incorrecta devuelve un mensaje claro y no modifica el
array de usuarios.

Validaciones principales:

- `name` debe ser un texto no vacío.
- `email` debe ser un texto no vacío y contener `@` y un punto.
- `password` debe ser un texto no vacío de al menos 6 caracteres.
- `isActive`, cuando se envía en una actualización, debe ser booleano.
- `PATCH /api/users/:id` debe recibir al menos un campo modificable.

Antes de guardar un usuario, la API elimina los espacios exteriores de `name`
y `email`, y normaliza el email a minúsculas. Por ejemplo,
`" USUARIO@EMAIL.COM "` se almacena como `"usuario@email.com"`.

Ejemplo de error con código `400 Bad Request`:

```json
{
  "error": "El nombre debe ser un texto no vacío"
}
```

Un email duplicado no es un error de formato y devuelve `409 Conflict`.

## Validación de email y duplicados

La API normaliza los emails antes de validarlos, compararlos o guardarlos. El
proceso aplica:

- `trim()` para eliminar los espacios exteriores.
- `toLowerCase()` para convertir el valor a minúsculas.
- Una validación básica que exige `@` y un punto.
- Una comprobación de duplicados sobre el email normalizado.

Ejemplo de normalización:

```text
"  USUARIO@EMAIL.COM  " -> "usuario@email.com"
```

En `POST /api/users` se comprueba que el email no pertenezca a ningún usuario.
En `PATCH /api/users/:id` se ignora al usuario que se está editando, de modo que
puede conservar su propio email, pero no utilizar el de otra cuenta.

Si el formato básico no es válido, la API responde con `400 Bad Request`:

```json
{
  "error": "El email no tiene un formato válido"
}
```

Si el email normalizado ya está registrado, responde con `409 Conflict`:

```json
{
  "error": "El email ya está registrado"
}
```

## Códigos de estado utilizados

La API utiliza códigos HTTP para comunicar el resultado de cada petición. El
código y el cuerpo JSON deben describir siempre la misma situación.

| Código | Significado | Uso en el proyecto |
| ---: | --- | --- |
| 200 | OK | Consulta, actualización o desactivación correcta |
| 201 | Created | Usuario creado correctamente |
| 400 | Bad Request | ID, body o datos incorrectos |
| 404 | Not Found | Usuario no encontrado |
| 409 | Conflict | Email ya registrado |

Ejemplo de error `404 Not Found`:

```json
{
  "error": "Usuario no encontrado",
  "id": 999
}
```

Ejemplo de error `409 Conflict`:

```json
{
  "error": "El email ya está registrado"
}
```

Los códigos `401 Unauthorized` y `403 Forbidden` se utilizarán más adelante al
incorporar autenticación y permisos. Los errores inesperados del servidor se
representan con `500 Internal Server Error`.

## Gestión centralizada de errores

La API utiliza la clase `AppError` y un middleware global para devolver los
errores con un formato común. Las rutas delegan el error mediante
`next(new AppError(...))` y el middleware construye la respuesta HTTP.

Formato general:

```json
{
  "error": "El ID debe ser un número",
  "statusCode": 400,
  "details": {
    "received": "abc"
  },
  "path": "/api/users/abc",
  "method": "GET",
  "timestamp": "2026-01-01T10:00:00.000Z"
}
```

También existe un middleware específico para las rutas que no coinciden con
ningún endpoint. Por ejemplo:

```http
GET /api/ruta-inventada
```

devuelve `404 Not Found` con una respuesta JSON uniforme:

```json
{
  "error": "Ruta no encontrada",
  "statusCode": 404,
  "details": {
    "method": "GET",
    "path": "/api/ruta-inventada"
  },
  "path": "/api/ruta-inventada",
  "method": "GET",
  "timestamp": "2026-01-01T10:00:00.000Z"
}
```

Los middlewares se registran después de todas las rutas: primero el de rutas no
encontradas y finalmente el middleware global de errores.

## Persistencia

Hasta el día 15, la API trabaja con usuarios guardados en un array en memoria.
Esto permite practicar el CRUD, pero cualquier usuario creado, actualizado o
desactivado se pierde al reiniciar el servidor.

A partir de esta nueva fase prepararemos una base de datos para conservar los
usuarios de forma persistente. La tabla principal prevista es `users` y tendrá
los siguientes campos:

```text
id
name
email
password_hash
role
is_active
created_at
updated_at
```

El cambio de almacenamiento no modificará el contrato público de la API: el
cliente seguirá utilizando los mismos endpoints y recibiendo respuestas JSON.

## Base de datos con Docker Compose

El proyecto utiliza Docker Compose para levantar PostgreSQL y Adminer en
contenedores separados.

```text
postgres  -> Base de datos PostgreSQL (puerto 5432)
adminer   -> Interfaz web para consultar la base de datos (puerto 8080)
```

Arrancar los servicios:

```bash
docker compose up -d
```

Comprobar su estado:

```bash
docker compose ps
```

Parar los servicios sin borrar el volumen de datos:

```bash
docker compose down
```

Adminer está disponible en `http://localhost:8080` con estos datos de conexión:

```text
Sistema: PostgreSQL
Servidor: postgres
Usuario: usermanager
Contraseña: usermanager_password
Base de datos: usermanager_db
```

El volumen `postgres_data` conserva la información de PostgreSQL cuando los
contenedores se detienen o se recrean. El comando `docker compose down -v`
también elimina el volumen y debe utilizarse con cuidado.

## Modelo persistente User

El modelo principal del proyecto será `User`. Sus campos previstos son:

```text
id
name
email
passwordHash
role
isActive
createdAt
updatedAt
```

Reglas importantes del modelo:

- `email` será único y se guardará normalizado.
- La contraseña se transformará en `passwordHash` antes de persistirla.
- `passwordHash` nunca se devolverá al cliente.
- `role` tendrá `USER` como valor predeterminado.
- `isActive` tendrá `true` como valor predeterminado.
- `createdAt` y `updatedAt` se gestionarán automáticamente.

Este diseño conceptual servirá como base para crear más adelante el modelo
Prisma y su tabla en PostgreSQL.

## ORM y acceso a datos

El proyecto usará Prisma como ORM principal para comunicarse con PostgreSQL.
Se ha elegido porque:

- Encaja bien con TypeScript y genera un cliente tipado.
- Permite definir modelos de datos de forma clara.
- Incluye un sistema de migraciones.
- Reduce el SQL repetitivo de las operaciones habituales.
- Permite explorar los datos mediante Prisma Studio.

El flujo previsto para el acceso a datos es:

```text
API Express -> Repository -> Prisma -> PostgreSQL
```

SQL directo, TypeORM y Sequelize se han considerado como alternativas, pero no
serán el camino principal del reto. Prisma se instalará y configurará en la
siguiente fase.

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
- [Día 12 - Validación manual básica](docs/dia_12_validacion_manual_basica.md)
- [Día 13 - Validación de email y duplicados](docs/dia_13_validacion_email_duplicados.md)
- [Día 14 - Códigos de estado HTTP](docs/dia_14_codigos_estado_http.md)
- [Día 15 - Middleware centralizado de errores](docs/dia_15_middleware_errores.md)
- [Día 16 - Base de datos y persistencia](docs/dia_16_base_datos_persistencia.md)
- [Día 17 - PostgreSQL con Docker Compose](docs/dia_17_postgresql_docker_compose.md)
- [Día 18 - Diseño del modelo persistente User](docs/dia_18_diseno_modelo_persistente_user.md)
- [Día 19 - ORM o acceso a datos](docs/dia_19_orm_acceso_datos.md)
