# siscomat-frontend

[![Deploy](https://github.com/siscomat/siscomat-frontend/actions/workflows/deploy.yml/badge.svg?branch=main)](https://github.com/siscomat/siscomat-frontend/actions/workflows/deploy.yml)
[![Docs](https://github.com/siscomat/siscomat-frontend/actions/workflows/docs.yml/badge.svg?branch=main)](https://github.com/siscomat/siscomat-frontend/actions/workflows/docs.yml)

Monorepo que contiene las dos interfaces de usuario de SISCOMAT:

- **panel-de-administracion:** interfaz para gestores autenticados.
- **portal-publico:** interfaz pública para participantes y validadores.

## Índice

- [Requisitos](#requisitos)
- [Estructura del repositorio](#estructura-del-repositorio)
- [Configuración](#configuraci%C3%B3n)
- [Ejecución local](#ejecuci%C3%B3n-local)
- [Ejecución con Docker Compose](#ejecuci%C3%B3n-con-docker-compose)
- [Documentación](#documentaci%C3%B3n)
- [GitHub Actions](#github-actions)
- [Contribuidores](#contribuidores)

## Requisitos

- [Git](https://git-scm.com/)
- [Node.js 24](https://nodejs.org/)

> Si no se requiere ejecutar este proyecto de forma nativa, ver [Ejecución con Docker Compose](#ejecuci%C3%B3n-con-docker-compose).

## Estructura del repositorio

```
siscomat-frontend/
├── apps/
│   ├── panel-de-administracion/   # Interfaz para gestores autenticados
│   │   ├── src/                   # Código fuente
│   │   └── .env                   # Variables de entorno (crear manualmente)
│   └── portal-publico/            # Interfaz pública para participantes y validadores
│       ├── src/                   # Código fuente
│       └── .env                   # Variables de entorno (crear manualmente)
├── packages/                      # Paquetes compartidos entre apps
├── docker-compose.yml             # Configuración de Docker para desarrollo
├── Dockerfile                     # Imagen de Docker
├── nginx.conf                     # Archivo auxiliar usado por Dockerfile
└── package.json                   # Dependencias y scripts del monorepo
```

## Configuración

### 1. Clonar el repositorio

```bash
git clone https://github.com/siscomat/siscomat-frontend.git
cd siscomat-frontend
```

### 2. Crear archivos de variables de entorno

Cada aplicación requiere un archivo `.env` en su directorio. Estos archivos **no están incluidos en el repositorio** y deben crearse manualmente antes de levantar el proyecto.

En `apps/panel-de-administracion/`, crear `.env`:

```
VITE_BACKEND_URL=http://localhost:8086/api
```

En `apps/portal-publico/`, crear `.env`:

```
VITE_API_URL=http://localhost:8086
```

## Ejecución local

> Se asume que Node.js 24 está instalado.

Desde la raíz del repositorio, instalar las dependencias:

```bash
npm install
```

Luego ingresar al directorio de la app a desarrollar y levantarla:

**Panel de administración:**
```bash
cd apps/panel-de-administracion
npm run dev
```

**Portal público:**
```bash
cd apps/portal-publico
npm run dev
```

| Servicio | URL |
|---|---|
| Portal público | http://localhost:5173 |
| Panel de administración | http://localhost:5174 |

> Las funciones que dependan del backend o del microservicio no estarán disponibles hasta que dichos componentes estén corriendo. Ver [siscomat-backend](https://github.com/siscomat/siscomat-backend) y [siscomat-microservicio](https://github.com/siscomat/siscomat-microservicio).

### Pruebas automatizadas

El proyecto cuenta con pruebas en Vitest para ambas aplicaciones. Ejecutarlas desde el directorio de la app correspondiente:

**Panel de administración:**
```bash
cd apps/panel-de-administracion
npm run test:run
```

**Portal público:**
```bash
cd apps/portal-publico
npm run test:run
```

> Las pruebas también se ejecutan automáticamente en cada push o pull request a `main`.

## Ejecución con Docker Compose

Útil cuando se necesita el frontend disponible sin trabajar activamente en él, por ejemplo para probar integración con el backend, sin instalar Node.js de forma nativa.

**Requisito:** tener [Docker Desktop](https://www.docker.com/products/docker-desktop/) instalado y corriendo.

```bash
docker compose up --build
```

| Servicio | URL |
|---|---|
| Portal público | http://localhost:5173 |
| Panel de administración | http://localhost:5174 |

> Para desarrollo activo se recomienda la ejecución local, ya que permite acceder a los logs, el linter, el autocompletado y el recargado automático.

## Documentación

La documentación está disponible únicamente para el panel de administración.

Documentación en línea: https://siscomat.github.io/siscomat-frontend/panel-admin-docs/

Para generarla localmente:

```bash
cd apps/panel-de-administracion
npx typedoc --entryPointStrategy expand ./src
```

La documentación se generará en `apps/panel-de-administracion/docs/` y también se actualiza automáticamente al hacer push a `main` con cambios en `apps/panel-de-administracion`.

## GitHub Actions

### `deploy.yml` — Deploy frontend

Se ejecuta en cada push o pull request a `main`. Corre las pruebas de Vitest para ambas aplicaciones en paralelo y, si todas pasan, despliega al servidor de producción mediante SSH.

### `docs.yml` — Generar y Publicar Documentacion

Se ejecuta cuando hay cambios en `apps/panel-de-administracion` en `main`. Genera la documentación con TypeDoc y la publica en GitHub Pages.

## Contribuidores

[![Contribuidores](https://contrib.rocks/image?repo=siscomat/siscomat-frontend)](https://github.com/siscomat/siscomat-frontend/graphs/contributors)
