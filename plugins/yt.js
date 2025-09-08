import playCommand from './play.js';

const ytCommand = {
  ...playCommand, // Copia toda la funcionalidad de play.js
  name: "yt", // Pero con un nombre diferente
  description: "Alias para el comando `play`." // Y una descripción diferente
};

export default ytCommand;
