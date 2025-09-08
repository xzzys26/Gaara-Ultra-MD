import menuCommand from './menu.js';

const infoCommand = {
  ...menuCommand, // Copia toda la funcionalidad de menu.js
  name: "info", // Pero con un nombre diferente
  category: "general", // Aseguramos que esté en la categoría correcta
  description: "Alias para el comando `menu`." // Y una descripción diferente
};

export default infoCommand;
