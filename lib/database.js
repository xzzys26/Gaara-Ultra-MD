import fs from 'fs';
import path from 'path';

const usersDbPath = path.resolve('./database/users.json');
const settingsDbPath = path.resolve('./database/groupSettings.json');

// --- Funciones de Directorio ---
function ensureDbDirectoryExists(dbPath) {
    const dir = path.dirname(dbPath);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
}

// --- Funciones para 'users.json' ---
export function readUsersDb() {
  try {
    if (!fs.existsSync(usersDbPath)) return {};
    const data = fs.readFileSync(usersDbPath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error("Error leyendo la base de datos de usuarios:", error);
    return {};
  }
}

export function writeUsersDb(data) {
  try {
    ensureDbDirectoryExists(usersDbPath);
    fs.writeFileSync(usersDbPath, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("Error escribiendo en la base de datos de usuarios:", error);
  }
}

// --- Funciones para 'groupSettings.json' ---
export function readSettingsDb() {
  try {
    if (!fs.existsSync(settingsDbPath)) return {};
    const data = fs.readFileSync(settingsDbPath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error("Error leyendo la base de datos de ajustes:", error);
    return {};
  }
}

export function writeSettingsDb(data) {
  try {
    ensureDbDirectoryExists(settingsDbPath);
    fs.writeFileSync(settingsDbPath, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("Error escribiendo en la base de datos de ajustes:", error);
  }
}

// --- Funciones para 'maintenance.json' ---
const maintenanceDbPath = path.resolve('./database/maintenance.json');

export function readMaintenanceDb() {
  try {
    if (!fs.existsSync(maintenanceDbPath)) return [];
    const data = fs.readFileSync(maintenanceDbPath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error("Error leyendo la base de datos de mantenimiento:", error);
    return [];
  }
}

export function writeMaintenanceDb(data) {
  try {
    ensureDbDirectoryExists(maintenanceDbPath);
    fs.writeFileSync(maintenanceDbPath, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("Error escribiendo en la base de datos de mantenimiento:", error);
  }
}
