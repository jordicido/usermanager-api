# Día 14: Códigos de estado HTTP

## Objetivo del día

El objetivo del día 14 ha sido revisar los códigos de estado de UserManager API
y comprobar que cada respuesta comunica de forma coherente el resultado de la
petición.

## Qué he hecho

- He revisado los códigos HTTP utilizados por todos los endpoints de usuarios.
- He probado consultas, actualizaciones y desactivaciones con `200 OK`.
- He probado la creación de recursos con `201 Created`.
- He probado errores de validación con `400 Bad Request`.
- He probado recursos inexistentes con `404 Not Found`.
- He probado emails duplicados con `409 Conflict`.
- He comprobado que el código HTTP coincide con el mensaje JSON.
- He preparado una colección de peticiones reproducibles en `requests.http`.

## Qué es un código de estado HTTP

Un código de estado es un número incluido en la respuesta HTTP que resume qué
ha ocurrido. El cliente puede interpretarlo sin depender del texto exacto del
JSON.

Las familias principales son:

| Familia | Significado general | Ejemplos |
| ---: | --- | --- |
| 2xx | La petición se procesó correctamente | 200, 201 |
| 3xx | Redirección | 301, 302 |
| 4xx | La petición del cliente no se puede completar | 400, 404, 409 |
| 5xx | Ocurrió un error en el servidor | 500 |

## Códigos utilizados

| Código | Significado | Cuándo se usa |
| ---: | --- | --- |
| 200 | OK | Consulta, actualización o desactivación correcta |
| 201 | Created | Creación correcta de un usuario |
| 400 | Bad Request | ID, body o datos con formato incorrecto |
| 404 | Not Found | El usuario solicitado no existe |
| 409 | Conflict | El email ya pertenece a otro usuario |

### 200 OK

Indica que una operación se completó correctamente sin crear un recurso nuevo.
La API lo utiliza en `GET`, `PATCH` y `DELETE` cuando la operación tiene éxito.

### 201 Created

Indica que se ha creado un recurso. `POST /api/users` lo devuelve únicamente
después de añadir el nuevo usuario al array.

### 400 Bad Request

Indica que la ruta existe, pero algún dato de la petición no cumple el contrato
de la API. Por ejemplo: un ID no numérico, un nombre vacío, un email con formato
incorrecto o un `PATCH` sin campos modificables.

### 404 Not Found

Indica que el recurso solicitado no existe. La API lo devuelve cuando el ID es
válido, pero no corresponde a ningún usuario.

### 409 Conflict

Indica que la petición está bien formada, pero entra en conflicto con los datos
actuales. En este proyecto ocurre al crear o actualizar un usuario con un email
que ya está registrado.

## Casos probados

Las peticiones del Día 14 están en `requests.http`. La columna de código
obtenido refleja el comportamiento revisado en la implementación.

| Petición | Caso | Esperado | Obtenido | ¿Correcto? |
| --- | --- | ---: | ---: | :---: |
| `GET /api/health` | Estado de la API | 200 | 200 | Sí |
| `GET /api/users` | Listado | 200 | 200 | Sí |
| `GET /api/users/1` | Usuario existente | 200 | 200 | Sí |
| `GET /api/users/999` | Usuario inexistente | 404 | 404 | Sí |
| `GET /api/users/abc` | ID no válido | 400 | 400 | Sí |
| `POST /api/users` | Creación correcta | 201 | 201 | Sí |
| `POST /api/users` | Datos incorrectos | 400 | 400 | Sí |
| `POST /api/users` | Email duplicado | 409 | 409 | Sí |
| `PATCH /api/users/1` | Actualización correcta | 200 | 200 | Sí |
| `PATCH /api/users/abc` | ID no válido | 400 | 400 | Sí |
| `PATCH /api/users/999` | Usuario inexistente | 404 | 404 | Sí |
| `PATCH /api/users/2` | Email duplicado | 409 | 409 | Sí |
| `DELETE /api/users/1` | Desactivación correcta | 200 | 200 | Sí |
| `DELETE /api/users/abc` | ID no válido | 400 | 400 | Sí |
| `DELETE /api/users/999` | Usuario inexistente | 404 | 404 | Sí |

## Coherencia entre código y respuesta

El código HTTP y el JSON deben contar la misma historia. Esta respuesta sería
incoherente:

```http
200 OK
```

```json
{
  "error": "Usuario no encontrado"
}
```

Si el usuario no existe, la respuesta correcta debe ser `404 Not Found`:

```json
{
  "error": "Usuario no encontrado",
  "id": 999
}
```

## Cómo decido qué código usar

| Situación | Código | Motivo |
| --- | ---: | --- |
| Usuario creado correctamente | 201 | Se ha creado un recurso nuevo |
| Usuario consultado correctamente | 200 | La consulta se completó |
| Usuario actualizado correctamente | 200 | La modificación se completó |
| Usuario desactivado correctamente | 200 | La desactivación se completó |
| ID no numérico | 400 | El dato recibido no tiene el formato esperado |
| Falta un campo obligatorio | 400 | La petición no cumple el contrato |
| Usuario no encontrado | 404 | El recurso solicitado no existe |
| Email duplicado | 409 | El valor entra en conflicto con otro usuario |

## Diferencia entre 400, 404 y 409

- `400 Bad Request` significa que los datos enviados no son válidos. Por
  ejemplo, `GET /api/users/abc` recibe un ID que no se puede interpretar como
  número.
- `404 Not Found` significa que la petición tiene un formato válido, pero el
  recurso no existe. Por ejemplo, no hay un usuario con ID `999`.
- `409 Conflict` significa que la petición y su formato son válidos, pero la
  operación choca con el estado actual. Por ejemplo, el email ya está ocupado.

## Diferencia entre 401 y 403

Estos códigos todavía no se utilizan en el CRUD actual, pero serán necesarios
al incorporar seguridad:

- `401 Unauthorized` indica que no existe una autenticación válida. Puede
  faltar el token o ser incorrecto.
- `403 Forbidden` indica que el usuario sí está autenticado, pero no tiene
  permisos para realizar la acción.

En resumen: `401` significa que la API no puede validar quién eres; `403`
significa que sabe quién eres, pero no te permite realizar esa operación.

## 500 Internal Server Error

El código `500` representa un fallo inesperado del servidor, como una excepción
no controlada o una base de datos que no responde. No debe utilizarse para
errores de validación provocados por el cliente.

## Explicación personal

Los códigos de estado permiten que cualquier cliente entienda rápidamente el
resultado de una petición. El JSON aporta detalles para una persona, mientras
que el código proporciona una señal estándar que una aplicación puede procesar
de forma automática.

Elegir el código adecuado forma parte del contrato de la API. Un error no debe
devolverse como `200`, del mismo modo que una creación correcta se expresa mejor
con `201` que con un código genérico.

## Resumen

En el día 14 se han revisado los principales códigos HTTP del proyecto. Las
operaciones correctas usan `200` o `201`, los datos incorrectos usan `400`, los
usuarios inexistentes usan `404` y los emails duplicados usan `409`. Esto hace
que las respuestas sean previsibles y coherentes para cualquier cliente.
