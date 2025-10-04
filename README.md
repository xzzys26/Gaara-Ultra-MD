<!-- Banner -->
<h1 align="center">
  <img src="https://files.catbox.moe/dm5qgl.jpg" width="700" alt="Gaara Ultra MD Banner"/>
  <br>
  🌪️ GAARA ULTRA MD 🌪️
</h1>

<!-- GIF Neon Principal -->
<p align="center">
  <img src="https://github.com/BrayanOFC-Li/Lines-Neon-MB/raw/main/assets_MB/line-neon.gif" width="400"/>
</p>

<p align="center">
  <strong>Bot de WhatsApp multipropósito de última generación</strong><br>
  Basado en <a href="https://github.com/whiskeysockets/baileys">Baileys MD</a> con arquitectura modular<br>
  Inspirado en la estética y poder de Gaara 🦂⚡
</p>

<p align="center">
  <a href="https://wa.me/526641784469">
    <img src="https://img.shields.io/badge/Soporte-WhatsApp-25D366?style=for-the-badge&logo=whatsapp&logoColor=white"/>
  </a>
  <a href="https://wa.me/18493907272">
    <img src="https://img.shields.io/badge/Creador-Contacto-0088cc?style=for-the-badge&logo=whatsapp&logoColor=white"/>
  </a>
  <a href="https://whatsapp.com/channel/0029VbBQ5sf4NVioq39Efn0v">
    <img src="https://img.shields.io/badge/Canal-WhatsApp-7C3AED?style=for-the-badge&logo=whatsapp&logoColor=white"/>
  </a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-18+-339933?style=flat-square&logo=node.js&logoColor=white"/>
  <img src="https://img.shields.io/badge/Baileys-MD-25D366?style=flat-square&logo=whatsapp&logoColor=white"/>
  <img src="https://img.shields.io/badge/License-MIT-blue?style=flat-square"/>
  <img src="https://img.shields.io/badge/Status-Active-success?style=flat-square"/>
</p>

---

## 📖 Descripción

**Gaara Ultra MD** es un bot de WhatsApp de próxima generación que combina potencia, velocidad y personalización extrema. Con una **arquitectura modular** basada en plugins independientes, este bot te permite crear tu propia experiencia sin límites.

### 🎯 ¿Por qué Gaara Ultra MD?

- **Sistema modular avanzado**: Cada comando es un plugin independiente
- **Personalización total**: Añade, modifica o elimina funciones sin romper nada
- **Rendimiento optimizado**: Código limpio y eficiente
- **Diseño único**: Inspirado en Gaara con estética ninja
- **Comunidad activa**: Soporte constante y actualizaciones

---

## ✨ Características Principales

### 🧩 Sistema de Plugins Modular
plugins/ ├── owner-menu.js       → Comandos de administración ├── grupo-menu.js       → Gestión de grupos ├── descargas-menu.js   → Descarga de contenido ├── juegos-menu.js      → Entretenimiento └── ... y muchos más
### 🎮 Funcionalidades

#### **Gestión de Grupos**
- ✅ Antilink (YouTube, TikTok, Facebook, Instagram)
- 👥 Bienvenidas y despedidas personalizables
- 🔒 Detección de links
- 📢 Mencionar a todos (@everyone)
- 🚫 Sistema de advertencias
- 👑 Comandos de admin (kick, promote, demote)

#### **Descargas Multimedia**
- 🎵 YouTube (audio/video)
- 📸 Instagram (posts, stories, reels)
- 🎬 TikTok sin marca de agua
- 🎭 Facebook videos
- 🎶 Spotify tracks
- 📱 MediaFire archivos

#### **Entretenimiento**
- 🎮 Juegos (trivia, matemáticas, adivinanzas)
- 🎭 Stickers personalizados
- 🖼️ Generador de memes
- 🎨 Filtros y efectos de imagen
- 💬 Frases y chistes random

#### **Utilidades**
- 🔍 Búsquedas en Google
- 🌐 Traductor multiidioma
- ⏰ Clima en tiempo real
- 📊 Información de perfil
- 🔗 Acortador de links

#### **Sistema**
- 📊 Menú automático dinámico
- 🤖 Auto-respuestas configurables
- 💾 Base de datos SQLite
- 🔄 Auto-reinicio en errores
- 📝 Logs detallados

---

## 📦 Requisitos del Sistema

| Componente | Versión Mínima | Recomendado |
|------------|----------------|-------------|
| Node.js | 18.0.0 | 20.x LTS |
| NPM | 9.0.0 | Latest |
| RAM | 512 MB | 1 GB+ |
| Almacenamiento | 500 MB | 1 GB+ |
| Sistema Operativo | Linux/Android (Termux) | Ubuntu 20.04+ |

### 📋 Dependencias Principales

```json
{
  "@whiskeysockets/baileys": "^6.7.8",
  "pino": "^9.4.0",
  "chalk": "^4.1.2",
  "axios": "^1.7.7",
  "cheerio": "^1.0.0",
  "moment-timezone": "^0.5.45"
}
🚀 Instalación Completa
📱 Método 1: Termux (Android)
�
￼ 


Paso 1: Configuración Inicial
# Otorgar permisos de almacenamiento
termux-setup-storage
# Actualizar repositorios
pkg update && pkg upgrade -y
Paso 2: Instalar Dependencias
# Instalar herramientas necesarias
pkg install git nodejs ffmpeg imagemagick yarn -y
Paso 3: Clonar el Repositorio
# Clonar Gaara Ultra MD
git clone https://github.com/xzzys26/Gaara-Ultra-MD
# Entrar al directorio
cd Gaara-Ultra-MD
Paso 4: Instalar Node Modules
# Instalar dependencias del proyecto
npm install
Paso 5: Iniciar el Bot
# Ejecutar el bot
npm start
📱 Escanear QR
Abre WhatsApp en tu teléfono
Ve a Configuración → Dispositivos vinculados
Toca Vincular un dispositivo
Escanea el código QR que aparece en la terminal
💻 Método 2: VPS/Servidor (Ubuntu/Debian)
# Actualizar sistema
sudo apt update && sudo apt upgrade -y

# Instalar Node.js 20.x
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Instalar dependencias del sistema
sudo apt install -y git ffmpeg imagemagick

# Clonar repositorio
git clone https://github.com/xzzys26/Gaara-Ultra-MD
cd Gaara-Ultra-MD

# Instalar dependencias
npm install

# Ejecutar con PM2 (mantener activo 24/7)
npm install -g pm2
pm2 start npm --name "gaara-bot" -- start
pm2 save
pm2 startup
⚙️ Configuración
📝 Archivo config.js
global.owner = [
  ['18493907272', 'xzzys 👑', true], // Número, nombre, es desarrollador
  ['526641784469'] // Solo número
]

global.mods = [] // Moderadores
global.prems = [] // Usuarios premium

// Información del bot
global.packname = '🌪️ Gaara Ultra MD'
global.author = '@xzzys26'
global.wm = '🦂 Gaara Bot - Ultra MD'

// Límites y restricciones
global.maxwarn = '3' // Advertencias antes de eliminar
global.multiplier = 69 // Multiplicador de experiencia

// APIs (opcional)
global.APIs = {
  nrtm: 'https://fg-nrtm.ddns.net',
  fgmods: 'https://api.fgmods.xyz'
}
📚 Uso y Comandos
🎯 Comandos Básicos
Comando
Descripción
Ejemplo
.menu
Menú principal
.menu
.help
Ayuda general
.help
.ping
Velocidad del bot
.ping
.owner
Contacto del creador
.owner
👑 Comandos de Owner
Comando
Descripción
Uso
.broadcast
Difusión masiva
.bc Mensaje
.update
Actualizar bot
.update
.restart
Reiniciar bot
.restart
.getplugin
Ver código de plugin
.getplugin menu
👥 Comandos de Grupo
Comando
Descripción
Uso
.kick
Eliminar usuario
.kick @user
.promote
Dar admin
.promote @user
.demote
Quitar admin
.demote @user
.group
Abrir/cerrar grupo
.group close
.link
Link del grupo
.link
🎵 Descargas
Comando
Descripción
Uso
.play
YouTube audio
.play Shape of You
.ytv
YouTube video
.ytv URL
.tiktok
TikTok video
.tiktok URL
.ig
Instagram
.ig URL
🔧 Desarrollo de Plugins
📁 Estructura de un Plugin
// plugins/ejemplo-comando.js

let handler = async (m, { conn, text, usedPrefix, command }) => {
  // Validar input
  if (!text) throw `✳️ *Uso correcto:* ${usedPrefix + command} <texto>`
  
  // Lógica del comando
  let respuesta = `🌪️ Procesando: ${text}`
  
  // Enviar respuesta
  await conn.reply(m.chat, respuesta, m)
}

// Configuración del comando
handler.help = ['ejemplo <texto>']
handler.tags = ['herramientas']
handler.command = ['ejemplo', 'ej']

export default handler
🎨 Categorías de Plugins
owner → Comandos exclusivos del propietario
grupo → Gestión de grupos
descargas → Descarga de contenido
juegos → Entretenimiento
herramientas → Utilidades generales
info → Información y estadísticas
🛡️ Solución de Problemas
❌ Error: "Cannot find module"
# Reinstalar dependencias
rm -rf node_modules package-lock.json
npm install
❌ Error: "Connection closed"
# Eliminar sesión y reconectar
rm -rf GaaraBotSession
npm start
❌ Bot lento o caído
# Reiniciar con PM2
pm2 restart gaara-bot
pm2 logs gaara-bot
🌟 Roadmap
[x] Sistema de plugins modular
[x] Descargas multimedia
[x] Gestión de grupos
[ ] Panel web de administración
[ ] API REST para control externo
[ ] Sistema de economía virtual
[ ] Integración con IA (ChatGPT)
[ ] Multi-dispositivo mejorado
🤝 Contribuir
¡Las contribuciones son bienvenidas! Si quieres mejorar Gaara Ultra MD:
Fork el proyecto
Crea una rama (git checkout -b feature/nueva-funcion)
Commit tus cambios (git commit -m 'Añadir nueva función')
Push a la rama (git push origin feature/nueva-funcion)
Abre un Pull Request
👥 Créditos y Reconocimientos
�
￼
xzzys26
🥷 Creador Principal ￼
BrayanOFC
👑 Colaborador Base 
🙏 Agradecimientos Especiales
Baileys - Librería base de WhatsApp
Comunidad de desarrolladores de bots de WhatsApp
Todos los usuarios que reportan bugs y sugieren mejoras
📄 Licencia
Este proyecto está bajo la Licencia MIT. Consulta el archivo LICENSE para más detalles.
MIT License - Copyright (c) 2025 xzzys26
📞 Soporte y Contacto
�
￼ ￼ ￼ ￼ 


�
￼ 


�
Hecho con 🦂 por la comunidad de Gaara Ultra MD
© 2025 - Todos los derechos reservados 


�
￼ ￼ ￼ 


�
⭐ Si te gusta el proyecto, no olvides darle una estrella ⭐

```