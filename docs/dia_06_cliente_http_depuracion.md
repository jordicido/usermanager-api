# Día 6: Cliente HTTP y depuración

## Objetivo del día

El objetivo del día 6 ha sido aprender a probar la API con un cliente HTTP,
organizar peticiones y depurar errores habituales siguiendo un orden.

Cuando una API no responde como esperamos, el problema no siempre está en el
código. También puede estar en la URL, el método HTTP, el body, los headers, el
puerto, el servidor apagado o el formato JSON.

## Qué he hecho

- He organizado una colección de pruebas de la API.
- He probado rutas básicas.
- He probado peticiones con body.
- He probado peticiones con params, query params y headers.
- He creado una ruta temporal de depuración.
- He añadido un `console.log` temporal para ver el body en la terminal.
- He provocado errores controlados para entender qué ocurre.
- He revisado respuestas y códigos de estado.
- He documentado las pruebas realizadas.

## Colección creada

Nombre de la colección:

```text
UserManager API
```

Organización propuesta:

```text
UserManager API
  Día 3 - Primer endpoint
  Día 4 - Métodos HTTP
  Día 5 - Body params headers
  Día 6 - Depuración
```

## Qué es un cliente HTTP

Un cliente HTTP es una herramienta que permite enviar peticiones a una API y
analizar la respuesta.

Durante el desarrollo se puede usar el navegador para peticiones `GET`
sencillas, pero herramientas como Thunder Client o Postman permiten probar
peticiones más completas con métodos, headers y body JSON.

## Ruta temporal de depuración

Se ha creado esta ruta:

```http
POST /api/debug/request
```

Sirve para ver en una sola respuesta la información principal de la petición:

```json
{
  "message": "Información completa de la petición",
  "method": "POST",
  "path": "/api/debug/request",
  "params": {},
  "query": {
    "source": "thunder"
  },
  "headers": {
    "...": "..."
  },
  "body": {
    "example": "datos de prueba"
  }
}
```

No hace falta memorizar todos los headers. Lo importante es saber que llegan al
servidor y se pueden leer desde `req.headers`.

## Log temporal en el servidor

En la ruta `POST /api/users` se ha añadido un log temporal:

```ts
console.log("Body recibido en POST /api/users:", userData);
```

Esto permite comprobar en la terminal qué body está llegando realmente al
servidor cuando se crea un usuario.

## Pruebas realizadas

| Petición | Qué prueba | Código esperado | Código obtenido | Observaciones |
| --- | --- | ---: | ---: | --- |
| `GET /api/health` | Health endpoint | 200 | 200 | Devuelve el estado `ok` y un `timestamp` |
| `GET /api/users` | Listado simulado | 200 | 200 | Devuelve un array vacío |
| `POST /api/users` | Body JSON | 201 | 201 | Devuelve los datos enviados |
| `PATCH /api/users/1` | Params + body | 200 | 200 | Devuelve el `id` y los cambios |
| `POST /api/debug/request?source=thunder` | Request completa | 200 | 200 | Devuelve método, ruta, query, headers y body |
| `GET /api/ruta-inventada` | Ruta inexistente | 404 | 404 | Express responde que no encuentra la ruta |
| `POST /api/health` | Método incorrecto | 404 | 404 | Existe `GET /api/health`, pero no `POST /api/health` |

## Errores provocados

| Error provocado | Petición | Resultado | Qué significa |
| --- | --- | --- | --- |
| Ruta inexistente | `GET /api/ruta-inventada` | 404 | La ruta no existe en el servidor |
| Método incorrecto | `POST /api/health` | 404 | La ruta existe para otro método, pero no para `POST` |
| JSON mal formado | `POST /api/users` con una coma final | 400 | Express no puede interpretar el body como JSON válido |

El error de JSON mal formado sirve para recordar que no basta con que el body se
parezca a JSON. Tiene que ser JSON válido y enviarse con
`Content-Type: application/json`.

## Header personalizado

Prueba libre:

```http
POST /api/debug/request
x-student-name: Jordi
Content-Type: application/json
```

```json
{
  "message": "Probando headers personalizados"
}
```

El header `x-student-name` aparece dentro de la propiedad `headers` de la
respuesta. En Express se puede leer desde:

```ts
req.headers["x-student-name"]
```

## Actualización completa

Prueba libre:

```http
PATCH /api/users/5
Content-Type: application/json
```

```json
{
  "name": "Usuario Modificado",
  "email": "modificado@email.com",
  "isActive": false
}
```

En esta petición:

| Dato | Dónde viaja |
| --- | --- |
| `5` | En params, como `req.params.id` |
| `name`, `email`, `isActive` | En body, como `req.body` |

La API devuelve el ID recibido y los cambios enviados:

```json
{
  "message": "Usuario recibido para actualizar",
  "id": "5",
  "changes": {
    "name": "Usuario Modificado",
    "email": "modificado@email.com",
    "isActive": false
  }
}
```

## Mi guía para depurar una petición

1. Comprobar que el servidor está arrancado con `npm run dev`.
2. Revisar que estoy usando el puerto correcto, en este caso `3000`.
3. Revisar el método HTTP.
4. Revisar la URL exacta.
5. Comprobar si la ruta existe en `src/server.ts`.
6. Revisar que el body está escrito como JSON válido.
7. Revisar que se envía `Content-Type: application/json` cuando hay body JSON.
8. Revisar los headers necesarios.
9. Mirar el status code de la respuesta.
10. Leer el body de la respuesta.
11. Mirar la terminal por si aparece un error o un `console.log`.
12. Cambiar una sola cosa cada vez y volver a probar.

## Navegador frente a cliente HTTP

| Herramienta | Ventajas | Limitaciones |
| --- | --- | --- |
| Navegador | Es rápido para probar rutas `GET` sencillas y no requiere configurar nada | No es cómodo para enviar `POST`, `PATCH`, `DELETE`, body JSON o headers personalizados |
| Thunder Client/Postman | Permite guardar colecciones, enviar métodos distintos, configurar headers, body JSON y revisar status codes | Hay que crear y organizar las peticiones manualmente |

## Resumen

En el día 6 no se ha añadido una gran funcionalidad de producto, pero se ha
trabajado una habilidad fundamental para backend: probar y depurar peticiones
HTTP de forma ordenada.

Antes de construir funcionalidades más complejas conviene saber comprobar qué
está pasando cuando una petición falla: método, URL, body, headers, status code,
respuesta y terminal.
