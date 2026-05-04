# ETAPA 1: Cache de capas para dependencias (Workspaces)
# Node 22 es requisito para Vite 8 y las APIs de React 19
FROM node:22-alpine AS deps
WORKDIR /app

# Copia selectiva de manifests para evitar invalidar caché por cambios en el código
COPY package*.json ./
COPY apps/portal-publico/package*.json ./apps/portal-publico/
COPY apps/panel-de-administracion/package*.json ./apps/panel-de-administracion/
COPY packages/shared-ui/package*.json ./packages/shared-ui/

# Instalación de dependencias del monorepo (Genera symlinks internos)
RUN npm install

# ETAPA 2: Build del binario estático
FROM node:22-alpine AS builder
WORKDIR /app

# Importar node_modules ya resueltas
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Inyectado por docker-compose para definir el target del build
ARG PORTAL_DIR

# Re-linking de paquetes locales (Previene el error 'module not found' en el build)
RUN npm install --include=dev --ignore-scripts

# Build de producción saltando chequeos de tipos de TSC (Vite puro)
RUN cd ${PORTAL_DIR} && npx vite build

# ETAPA 3: Runtime ligero (Nginx)
FROM nginx:stable-alpine AS runner
ARG PORTAL_DIR

# Configuración personalizada (Manejo de rutas SPA y Anti-Caché)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Transferencia de artefactos finales; se descarta el resto para minimizar imagen
COPY --from=builder /app/${PORTAL_DIR}/dist /usr/share/nginx/html

EXPOSE 80