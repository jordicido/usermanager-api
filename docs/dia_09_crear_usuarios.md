# Día 9: Crear usuarios en memoria

## Objetivo del día

El objetivo del día 9 ha sido completar la operación de creación del CRUD de
usuarios.

El endpoint `POST /api/users` ya no se limita a devolver el body recibido.
Ahora valida los datos, comprueba que el email no esté registrado, genera un ID
y añade el nuevo usuario al array `users`.

## Qué he hecho

- He actualizado el endpoint `POST /api/users`.
- He leído `name`, `email` y `password` desde `req.body`.
- He validado que los tres campos obligatorios estén presentes.
- He validado que la contraseña tenga al menos 6 caracteres.
- He comprobado que el email no esté registrado.
- He generado un nuevo ID a partir del ID más alto.
- He creado un objeto del tipo `User`.
- He añadido el usuario al array con `push`.
- He devuelto `201 Created` cuando la creación es correcta.
- He evitado guardar o devolver la contraseña.

## Endpoint trabajado

```http
POST /api/users
```

## Body de ejemplo

```json
{
  "name": "María López",
  "email": "maria@email.com",
  "password": "123456"
}
```

## Funcionamiento

La ruta sigue estos pasos:

1. Lee los datos enviados en `req.body`.
2. Comprueba que `name`, `email` y `password` estén presentes.
3. Comprueba que la contraseña tenga al menos 6 caracteres.
4. Busca si ya existe un usuario con el mismo email.
5. Calcula un ID nuevo a partir del ID más alto.
6. Crea el objeto `newUser` con valores iniciales seguros.
7. Añade el usuario al array `users`.
8. Devuelve el usuario creado con el código `201`.

## Código trabajado

```ts
app.post("/api/users", (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({
      error: "name, email y password son obligatorios"
    });
  }

  if (password.length < 6) {
    return res.status(400).json({
      error: "La contraseña debe tener al menos 6 caracteres"
    });
  }

  const existingUser = users.find((user) => user.email === email);

  if (existingUser) {
    return res.status(409).json({
      error: "El email ya está registrado"
    });
  }

  const newId = users.length > 0
    ? Math.max(...users.map((user) => user.id)) + 1
    : 1;

  const newUser: User = {
    id: newId,
    name,
    email,
    role: "USER",
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  users.push(newUser);

  return res.status(201).json({
    message: "Usuario creado correctamente",
    data: newUser
  });
});
```

## Respuesta correcta

La creación devuelve `201 Created`:

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

Las fechas reales cambian porque se generan en el momento de crear el usuario.

## Casos probados

| Caso | Código esperado | Resultado |
| --- | ---: | --- |
| Usuario correcto | 201 | Crea el usuario y lo añade al listado |
| Faltan campos | 400 | Indica que los campos son obligatorios |
| Contraseña corta | 400 | Exige un mínimo de 6 caracteres |
| Email duplicado | 409 | Impide crear otro usuario con el mismo email |
| Consultar listado | 200 | Muestra el usuario recién creado |

## Errores controlados

Si falta algún campo obligatorio:

```json
{
  "error": "name, email y password son obligatorios"
}
```

Si la contraseña tiene menos de 6 caracteres:

```json
{
  "error": "La contraseña debe tener al menos 6 caracteres"
}
```

Si el email ya pertenece a otro usuario:

```json
{
  "error": "El email ya está registrado"
}
```

## Generación del ID

El ID se calcula buscando el valor más alto del array y sumando uno:

```ts
const newId = users.length > 0
  ? Math.max(...users.map((user) => user.id)) + 1
  : 1;
```

Este método evita repetir un ID si el array no tiene una secuencia perfecta.
Si no hay usuarios, el primer ID será `1`.

## Datos sensibles

La contraseña se recibe porque es necesaria para validar la petición, pero no
se incluye en el objeto `newUser`. Por eso no se guarda en memoria ni aparece
en la respuesta.

Una API nunca debería devolver contraseñas. Más adelante, cuando se implemente
la seguridad, la contraseña deberá transformarse en un hash antes de guardarla.
El valor original no debe almacenarse ni exponerse.

## Persistencia en memoria

El usuario creado permanece disponible mientras el servidor siga encendido.
Después de crearlo, se puede consultar `GET /api/users` y comprobar que el
usuario aparece en `data` y que el valor de `total` ha aumentado.

Al reiniciar el servidor, el array vuelve a su estado inicial. Esta limitación
desaparecerá cuando los usuarios se almacenen en una base de datos.

## Explicación personal

Para crear un usuario se leen primero los datos de `req.body` y se validan antes
de modificar el array. Si los datos son correctos y el email está disponible,
se genera el siguiente ID, se construye un objeto `User` con valores iniciales
y se añade a `users` mediante `push`.

El código `201 Created` permite distinguir una creación correcta de una
respuesta normal con `200 OK`. Los errores `400` indican que los datos enviados
no son válidos y el error `409` indica que el email entra en conflicto con un
usuario existente.

## Resumen

En el día 9 se ha implementado la creación real de usuarios en memoria. La API
ya puede validar una petición, evitar emails duplicados, generar IDs y añadir
usuarios al listado sin exponer la contraseña.
