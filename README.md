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

## Documentación del reto

- [Día 1 - Diseño inicial](docs/dia_01_diseno_inicial.md)
- [Día 2 - Preparación del proyecto](docs/dia_02_preparacion_proyecto.md)
- [Día 3 - Primer endpoint](docs/dia_03_primer_endpoint.md)
