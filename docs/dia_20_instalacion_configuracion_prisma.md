# Día 20: Instalación y configuración inicial de Prisma

## Objetivo del día

El objetivo del día 20 ha sido preparar el proyecto para usar Prisma como ORM
principal de UserManager API.

En el Día 19 se tomó la decisión técnica de usar Prisma para acceder a
PostgreSQL. Hoy esa decisión empieza a convertirse en configuración real del
proyecto: dependencias instaladas, carpeta `prisma/`, esquema inicial, variable
`DATABASE_URL` documentada y scripts básicos disponibles.

Todavía no se ha definido el modelo `User` ni se ha creado ninguna migración.
Eso llegará en los siguientes días.

## Qué he hecho

- He instalado Prisma CLI como dependencia de desarrollo.
- He instalado Prisma Client como dependencia del proyecto.
- He inicializado Prisma con PostgreSQL como proveedor.
- He creado la carpeta `prisma/`.
- He revisado el archivo `prisma/schema.prisma`.
- He revisado el archivo `prisma.config.ts` generado por Prisma.
- He configurado la variable `DATABASE_URL` en `.env.example`.
- He comprobado que `.env` queda fuera del control de versiones.
- He añadido scripts útiles para validar, generar y abrir Prisma Studio.
- He dejado el proyecto preparado para definir el modelo `User`.

## Dependencias instaladas

Prisma se compone de dos piezas principales:

| Paquete | Tipo | Para qué sirve |
| --- | --- | --- |
| `prisma` | dependencia de desarrollo | Aporta la CLI de Prisma |
| `@prisma/client` | dependencia de ejecución | Aporta el cliente que usará TypeScript |

La CLI permite ejecutar comandos como:

```bash
npx prisma --version
npx prisma validate
npx prisma generate
npx prisma studio
```

Prisma Client será la herramienta que más adelante permitirá consultar modelos
desde TypeScript con código similar a:

```ts
const users = await prisma.user.findMany();
```

Ese código todavía no está disponible porque el modelo `User` aún no existe en
`schema.prisma`.

## Archivos creados o modificados

La configuración inicial de Prisma afecta a estos archivos:

```text
package.json
package-lock.json
prisma/schema.prisma
prisma.config.ts
.env
.env.example
.gitignore
```

La carpeta principal es:

```text
prisma/
  schema.prisma
```

Más adelante, cuando se cree la primera migración, Prisma añadirá una carpeta
`prisma/migrations/`.

## Scripts añadidos

Para facilitar el trabajo, el proyecto incluye estos scripts en `package.json`:

```json
{
  "prisma:validate": "prisma validate",
  "prisma:generate": "prisma generate",
  "prisma:studio": "prisma studio"
}
```

Uso:

```bash
npm run prisma:validate
npm run prisma:generate
npm run prisma:studio
```

## `schema.prisma` inicial

El archivo `prisma/schema.prisma` es el centro del modelo de datos de Prisma.

En la configuración actual, el esquema define el generador del cliente y el
proveedor de base de datos:

```prisma
generator client {
  provider = "prisma-client"
  output   = "../src/generated/prisma"
}

datasource db {
  provider = "postgresql"
}
```

La parte `generator client` indica que Prisma generará un cliente para usarlo
desde TypeScript.

La parte `datasource db` indica que la base de datos será PostgreSQL.

## `prisma.config.ts`

En esta versión de Prisma, la URL de conexión se configura desde
`prisma.config.ts`:

```ts
import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: process.env["DATABASE_URL"],
  },
});
```

Esto separa dos responsabilidades:

- `schema.prisma` describe el proveedor y los modelos.
- `prisma.config.ts` indica dónde está el esquema, dónde vivirán las
  migraciones y cómo leer la conexión.

## `DATABASE_URL`

`DATABASE_URL` es la variable de entorno que Prisma usará para conectarse a
PostgreSQL.

Para el entorno local con Docker Compose:

```env
DATABASE_URL="postgresql://usermanager:usermanager_password@localhost:5432/usermanager_db"
```

Descomposición de la URL:

| Parte | Valor |
| --- | --- |
| Protocolo | `postgresql://` |
| Usuario | `usermanager` |
| Contraseña | `usermanager_password` |
| Host | `localhost` |
| Puerto | `5432` |
| Base de datos | `usermanager_db` |

La API y Prisma se ejecutan desde el proyecto local, por eso usan
`localhost:5432`.

Adminer, al estar dentro de Docker Compose, usa `postgres` como nombre de
servidor interno.

## `.env` y `.env.example`

El archivo `.env` contiene valores reales del entorno local y no debe subirse al
repositorio.

Ejemplo local:

```env
PORT=3000
DATABASE_URL="postgresql://usermanager:usermanager_password@localhost:5432/usermanager_db"
JWT_SECRET="super_secret_key"
```

El archivo `.env.example` sí se sube al repositorio porque funciona como
plantilla:

```env
PORT=3000
DATABASE_URL="postgresql://usermanager:usermanager_password@localhost:5432/usermanager_db"
JWT_SECRET="change_me"
```

Así, otra persona puede copiarlo a `.env` y adaptar los valores locales.

## `.gitignore`

El proyecto debe evitar subir archivos generados o sensibles:

```gitignore
node_modules
.env
dist/
/src/generated/prisma
```

`/src/generated/prisma` se ignora porque Prisma Client se puede regenerar desde
el esquema.

## Comandos importantes

Instalar Prisma CLI:

```bash
npm install -D prisma
```

Instalar Prisma Client:

```bash
npm install @prisma/client
```

Inicializar Prisma con PostgreSQL:

```bash
npx prisma init --datasource-provider postgresql
```

Validar el esquema:

```bash
npx prisma validate
```

Generar Prisma Client:

```bash
npx prisma generate
```

Abrir Prisma Studio:

```bash
npx prisma studio
```

## Relación con Docker Compose

Prisma se conectará al PostgreSQL definido en `docker-compose.yml`.

Los valores de `DATABASE_URL` deben coincidir con:

```text
POSTGRES_USER=usermanager
POSTGRES_PASSWORD=usermanager_password
POSTGRES_DB=usermanager_db
ports: 5432:5432
```

Antes de validar Prisma o generar el cliente, conviene tener PostgreSQL
arrancado:

```bash
docker compose up -d
docker compose ps
```

## Qué queda pendiente

Hoy se ha preparado la herramienta, pero todavía no se ha modelado la base de
datos.

Los próximos pasos serán:

1. Añadir el enum `Role`.
2. Definir el modelo `User` en `schema.prisma`.
3. Crear la primera migración.
4. Aplicar la migración sobre PostgreSQL.
5. Generar Prisma Client con el modelo `User`.
6. Empezar a conectar la API con datos persistentes.

## Resumen

Prisma ya está instalado y configurado de forma inicial. El proyecto tiene la
estructura necesaria para empezar a describir modelos persistentes y convertir
ese diseño en migraciones de PostgreSQL.

El Día 20 deja preparado el terreno: el Día 21 podrá centrarse en definir
`User` dentro de `schema.prisma`.
