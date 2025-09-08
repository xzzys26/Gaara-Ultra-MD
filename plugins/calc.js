const calcCommand = {
  name: "calc",
  category: "utilidades",
  description: "Calcula una expresión matemática.",

  async execute({ sock, msg, args }) {
    const expression = args.join(' ');
    if (!expression) {
      return sock.sendMessage(msg.key.remoteJid, { text: "Por favor, proporciona una expresión matemática. Ejemplo: `calc 2 * (3 + 5)`" }, { quoted: msg });
    }

    try {
      // Usamos el constructor de Function para una evaluación más segura que eval()
      // Se limita a operaciones matemáticas básicas.
      const sanitizedExpression = expression.replace(/[^-()\d/*+.]/g, '');
      const result = new Function(`return ${sanitizedExpression}`)();

      if (isNaN(result) || !isFinite(result)) {
        throw new Error("Expresión inválida");
      }

      await sock.sendMessage(msg.key.remoteJid, { text: `🧮 *Resultado:*\n${expression} = ${result}` }, { quoted: msg });

    } catch (e) {
      console.error("Error en el comando calc:", e);
      await sock.sendMessage(msg.key.remoteJid, { text: "No se pudo calcular la expresión. Asegúrate de que sea matemáticamente correcta." }, { quoted: msg });
    }
  }
};

export default calcCommand;
