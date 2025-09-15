#!/bin/bash

# --- Script de Inicio y Auto-Actualización Robusto ---
# Este script se asegura de que el bot siempre esté ejecutando la última versión del código desde GitHub,
# descartando cualquier cambio local que pueda causar conflictos.

echo ">>> [Paso 1/3] Forzando actualización desde GitHub..."
# Obtener el nombre de la rama actual para asegurar que se actualice la rama correcta.
BRANCH=$(git rev-parse --abbrev-ref HEAD)

# Descargar los últimos cambios del origen sin intentar fusionar.
git fetch origin

# Forzar el reseteo de la rama local a la versión exacta del origen.
# Esto descarta cambios locales y previene errores de "overwrite".
git reset --hard origin/$BRANCH

# Limpiar cualquier archivo o directorio no rastreado que pueda interferir.
git clean -df

echo ">>> [Paso 2/3] Instalando/actualizando dependencias de Node.js..."
npm install --silent

echo ">>> [Paso 3/3] Iniciando el bot..."
node index.js
