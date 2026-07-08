# Día 21: Modelo Prisma User

## Objetivo del día

El objetivo del día 21 ha sido convertir el diseño conceptual del modelo
persistente `User` en un modelo real dentro de Prisma.

En el Día 20 instalamos y configuramos Prisma. Hoy hemos dado el siguiente paso:
añadir `enum Role` y `model User` en `prisma/schema.prisma`.

Todavía no se ha creado la tabla en PostgreSQL. Hoy solo definimos y validamos
la estructura del modelo. La migración llegará en el Día 22.

## Qué he hecho

- He abierto el archivo `prisma/schema.prisma`.
- He añadido el enum `Role`.
- He definido el modelo `User`.
- He marcado `id` como clave primaria.
- He marcado `email` como único.
- He añadido `passwordHash`.
- He definido `role` con valor por defecto `USER`.
- He definido `isActive` con valor por defecto `true`.
- He añadido `createdAt` y `updatedAt`.
- He dejado preparado el esquema para validarlo con Prisma.
- He dejado preparado el modelo para generar Prisma Client.

## Modelo definido

El modelo añadido en `prisma/schema.prisma` es:

```prisma
enum Role {
  USER
  ADMIN
}

model User {
  id           Int      @id @default(autoincrement())
  name         String
  email        String   @unique
  passwordHash String
  role         Role     @default(USER)
  isActive     Boolean  @default(true)
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
}
```

Este modelo representa cómo se guardarán los usuarios de UserManager API en la
base de datos.

## Explicación de campos

| Campo | Tipo | Explicación |
| --- | --- | --- |
| `id` | `Int` | Identificador único del usuario |
| `name` | `String` | Nombre visible del usuario |
| `email` | `String` | Email único del usuario |
| `passwordHash` | `String` | Hash de la contraseña |
| `role` | `Role` | Rol del usuario dentro de la aplicación |
| `isActive` | `Boolean` | Indica si la cuenta está activa |
| `createdAt` | `DateTime` | Fecha de creación del usuario |
| `updatedAt` | `DateTime` | Fecha de última modificación |

## `id`

```prisma
id Int @id @default(autoincrement())
```

El campo `id` es la clave primaria del modelo.

- `Int` indica que es un número entero.
- `@id` marca el campo como identificador principal.
- `@default(autoincrement())` hace que la base de datos genere el valor
  automáticamente.

Así, al crear un usuario no tendremos que enviar manualmente su identificador.

## `name`

```prisma
name String
```

El campo `name` guarda el nombre visible del usuario.

Como no lleva `?`, es obligatorio.

## `email`

```prisma
email String @unique
```

El campo `email` guarda el correo electrónico del usuario y no puede repetirse.

La restricción `@unique` es importante porque el email se usará para identificar
cuentas, evitar duplicados y facilitar el login.

## `passwordHash`

```prisma
passwordHash String
```

El modelo no guarda `password` en texto plano.

La API recibirá una contraseña durante el registro, pero antes de persistirla
deberá transformarla en un hash:

```text
password recibida -> bcrypt -> passwordHash -> base de datos
```

`passwordHash` existe en la base de datos porque será necesario para comprobar
credenciales, pero nunca deberá devolverse en las respuestas públicas de la API.

## Enum `Role`

```prisma
enum Role {
  USER
  ADMIN
}
```

El enum `Role` limita los valores permitidos para el campo `role`.

Podríamos haber usado:

```prisma
role String
```

Pero eso permitiría guardar valores libres como `ROOT`, `INVITADO`,
`SUPERADMIN` o cualquier texto escrito por error.

Con un enum, el modelo solo acepta los roles previstos:

- `USER`
- `ADMIN`

Esto hace que el modelo sea más claro y reduce errores en permisos y
autorización.

## `role`

```prisma
role Role @default(USER)
```

El campo `role` usa el enum `Role`.

Su valor por defecto es `USER`, por lo que un usuario nuevo será usuario normal
salvo que explícitamente se indique otro rol.

## `isActive`

```prisma
isActive Boolean @default(true)
```

`isActive` indica si la cuenta está activa.

Por defecto todo usuario nuevo se crea activo. Más adelante este campo permitirá
implementar borrado lógico:

```text
isActive = true  -> usuario activo
isActive = false -> usuario desactivado
```

Así podremos desactivar usuarios sin eliminarlos físicamente de la base de
datos.

## `createdAt`

```prisma
createdAt DateTime @default(now())
```

`createdAt` guarda la fecha de creación del usuario.

`@default(now())` indica que Prisma asignará automáticamente el momento actual
cuando se cree el registro.

## `updatedAt`

```prisma
updatedAt DateTime @updatedAt
```

`updatedAt` guarda la fecha de última modificación.

El atributo `@updatedAt` indica a Prisma que actualice este campo cuando cambie
el registro.

## Atributos usados en el modelo

| Atributo | Significado |
| --- | --- |
| `@id` | Marca un campo como clave primaria |
| `@default(...)` | Define el valor por defecto de un campo |
| `@unique` | Impide valores repetidos en ese campo |
| `@updatedAt` | Actualiza automáticamente la fecha al modificar el registro |

## Relación entre reglas de negocio y Prisma

| Regla de negocio | Campo o atributo Prisma relacionado |
| --- | --- |
| El email no se puede repetir | `email String @unique` |
| Todo usuario tiene un identificador único | `id Int @id` |
| Todo usuario empieza activo | `isActive Boolean @default(true)` |
| El rol por defecto es `USER` | `role Role @default(USER)` |
| La fecha de creación se asigna automáticamente | `createdAt DateTime @default(now())` |
| La fecha de modificación se actualiza al cambiar el usuario | `updatedAt DateTime @updatedAt` |
| La contraseña no se guarda en texto plano | `passwordHash String` |

## Campo opcional futuro

Más adelante podríamos añadir campos opcionales si el producto lo necesita.

Por ejemplo, para registrar el último inicio de sesión:

```prisma
lastLoginAt DateTime?
```

El símbolo `?` indica que el campo es opcional. Un usuario recién creado podría
no tener todavía ningún valor en `lastLoginAt`.

Otros campos opcionales posibles:

```prisma
avatarUrl String?
phone     String?
bio       String?
```

No los añadimos ahora para mantener el modelo inicial pequeño y centrado en las
necesidades del reto: registro, login, JWT, roles, CRUD y activación o
desactivación de usuarios.

## Comandos del día

Validar el esquema:

```bash
npx prisma validate
```

Generar Prisma Client:

```bash
npx prisma generate
```

Después de modificar `schema.prisma`, validar el esquema ayuda a comprobar que
Prisma entiende correctamente el modelo.

Generar Prisma Client actualiza el cliente TypeScript para que conozca los
modelos definidos en el esquema.

## Por qué no ejecutamos migraciones hoy

Hoy no ejecutamos:

```bash
npx prisma migrate dev
```

La razón es separar el trabajo en dos fases:

```text
Día 21 -> Definir y entender el modelo
Día 22 -> Crear y aplicar la migración
```

Primero queremos asegurarnos de que el modelo `User` está bien diseñado y que
Prisma puede validarlo. Después convertiremos ese modelo en una tabla real de
PostgreSQL mediante una migración.

Esta separación ayuda a entender mejor qué hace cada paso:

- `schema.prisma` describe la estructura deseada.
- La migración aplica esa estructura en la base de datos.
- Prisma Client permite usar esa estructura desde TypeScript.

## Flujo completo

El trabajo de persistencia seguirá este camino:

```text
Diseño conceptual User
-> Modelo User en schema.prisma
-> Migración Prisma
-> Tabla User en PostgreSQL
-> Prisma Client
-> API Express
```

Hoy hemos completado el segundo paso: el modelo ya existe en Prisma.

## Resumen

El Día 21 convierte el diseño persistente de `User` en un modelo Prisma real.

El proyecto ya tiene:

- `enum Role`
- `model User`
- `id` autoincremental
- `email` único
- `passwordHash`
- `role` con valor por defecto `USER`
- `isActive` con valor por defecto `true`
- `createdAt` automático
- `updatedAt` automático al modificar

El siguiente paso será crear la primera migración para llevar este modelo a
PostgreSQL.
