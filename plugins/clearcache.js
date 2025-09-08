const clearCacheCommand = {
  name: "clearcache",
  category: "propietario",
  description: "Limpia la caché de descargas del comando 'test'.",

  async execute({ sock, msg, config, testCache }) {
    const senderId = msg.key.participant || msg.key.remoteJid;
    const senderNumber = senderId.split('@')[0];

    if (!config.ownerNumbers.includes(senderNumber)) {
      return sock.sendMessage(msg.key.remoteJid, { text: "Este comando solo puede ser utilizado por el propietario del bot." }, { quoted: msg });
    }

    try {
      const cacheSize = testCache.size;
      testCache.clear();
      await sock.sendMessage(msg.key.remoteJid, { text: `✅ Caché de descargas limpiado. Se eliminaron ${cacheSize} entradas.` }, { quoted: msg });
    } catch (e) {
      console.error("Error en el comando clearcache:", e);
      await sock.sendMessage(msg.key.remoteJid, { text: "Ocurrió un error al limpiar la caché." }, { quoted: msg });
    }
  }
};

export default clearCacheCommand;
