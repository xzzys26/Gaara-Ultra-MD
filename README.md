# Bot de WhatsApp con Baileys y Sistema de Plugins

¡Bienvenido! Este es un bot de WhatsApp modular y fácil de expandir, construido con `@whiskeysockets/baileys`. La principal característica es su sistema de comandos basado en plugins, donde cada comando es un archivo independiente en la carpeta `plugins`.

## Características

- **Sin Prefijos:** El bot responde a comandos directos (ej. `menu` en lugar de `!menu`).
- **Sistema de Plugins:** Cada comando es un módulo en la carpeta `plugins`, lo que facilita añadir o quitar funcionalidades.
- **Menú Automático:** El comando `menu` se genera dinámicamente a partir de los plugins existentes, agrupándolos por categoría.
- **Comandos Interactivos:** Ejemplo de uso de botones con el comando `play`.
- **Configuración Sencilla:** Personaliza el nombre del bot y del propietario en `config.js`.
- **Descargas Multimedia:** El comando `play` permite descargar audio y video de YouTube.

## Requisitos

- Node.js (versión 18 o superior recomendada)

## Instalación

1.  **Clona o descarga este repositorio.**
2.  **Abre una terminal en la carpeta del proyecto.**
3.  **Instala las dependencias:**
    ```bash
    npm install
    ```

## Cómo Ejecutar el Bot

1.  **Configura tus datos:** Abre el archivo `config.js` y modifica los valores de `botName` y `ownerName`.
2.  **Inicia el bot:**
    ```bash
    node index.js
    ```
3.  **Escanea el QR:** La primera vez que lo ejecutes, aparecerá un código QR en tu terminal. Escanéalo con tu teléfono desde WhatsApp (en `Dispositivos Vinculados`).
4.  **¡Listo!** Una vez escaneado, el bot estará en línea. Se creará una carpeta `auth_info_baileys` para guardar tu sesión y no tener que escanear el QR cada vez.

---

## Cómo Crear un Nuevo Comando

Crear tus propios comandos es muy fácil. Solo tienes que añadir un nuevo archivo `.js` en la carpeta `plugins`.

**Estructura básica de un comando:**

Cada archivo de comando debe exportar un objeto con la siguiente estructura:

```javascript
const miComando = {
  // El nombre con el que se llamará al comando (obligatorio)
  name: "nombrecomando",

  // La categoría a la que pertenece (para el menú automático)
  category: "categoría",

  // Una breve descripción de lo que hace el comando
  description: "Esto es lo que hace mi comando.",

  // La función que se ejecutará (obligatorio)
  async execute({ sock, msg, args, commands, config }) {
    // sock: La instancia del socket de Baileys para enviar mensajes.
    // msg: El objeto del mensaje completo que activó el comando.
    // args: Un array con los argumentos del comando. (ej. para "play cancion", args sería ["cancion"]).
    // commands: El mapa con todos los comandos cargados (útil para alias o menús).
    // config: El objeto de configuración de config.js.

    // Aquí va la lógica de tu comando.
    await sock.sendMessage(msg.key.remoteJid, { text: "¡Mi nuevo comando funciona!" }, { quoted: msg });
  }
};

export default miComando;
```

### Ejemplo: Un comando `saludo`

1.  **Crea el archivo `plugins/saludo.js`**.
2.  **Añade el siguiente código:**

    ```javascript
    const saludoCommand = {
      name: "saludo",
      category: "diversion",
      description: "Saluda al usuario de forma personalizada.",

      async execute({ sock, msg }) {
        // msg.pushName contiene el nombre del usuario que envió el mensaje.
        const nombreUsuario = msg.pushName || "amigo";
        const saludoTexto = `¡Hola, ${nombreUsuario}! Un gusto saludarte.`;

        await sock.sendMessage(msg.key.remoteJid, { text: saludoTexto }, { quoted: msg });
      }
    };

    export default saludoCommand;
    ```

3.  **Reinicia el bot.** ¡Y listo! El nuevo comando `saludo` estará activo y aparecerá automáticamente en el menú bajo la categoría "diversion".
