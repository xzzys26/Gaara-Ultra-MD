/*
* Este es el archivo de configuración principal del bot.
* Modifica los valores según tus necesidades.
*/

const config = {
  // El nombre que mostrará el bot en los menús y mensajes.
  botName: "𝗜𝘁𝘀𝘂𝗸𝗶 𝗨𝗹𝘁𝗿𝗮-𝗠𝗗 🪷",

  // El nombre del propietario del bot.
  ownerName: "ᴇʀᴇɴxɪᴛᴏ",

  // Tasa de impuestos para la economía (ej. 0.10 para 10%)
  taxRate: 0.10,

  // Números de los propietarios del bot (en formato de WhatsApp, ej: '18493907272').
  // El bot puede tener funcionalidades exclusivas para estos números.
  // Se añade el LID del propietario para asegurar el reconocimiento.
  ownerNumbers: ["18493907272", "176742836768966"],

  // APIs (si las tienes, si no, déjalas como están)
  // No es necesario modificar estas si usas las APIs públicas de Adonix.
  api: {
    ytmp3: "https://myapiadonix.vercel.app/api/ytmp3",
    ytmp4: "https://myapiadonix.vercel.app/api/ytmp4",
    gemini: "AIzaSyDEww4IKqba9tgfb8ndMDBOoLkl-nSy4tw" // Tu API Key de Gemini
  },

  
  authDir: 'Itsuki Session'
};

export default config;
