import loveCommand from './love.js';

const shipCommand = {
  ...loveCommand,
  name: "ship",
  description: "Alias para el comando `love`.",
  aliases: [], // Para evitar duplicados
};

export default shipCommand;
