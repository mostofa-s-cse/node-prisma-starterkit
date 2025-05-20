import fs from 'fs';
import path from 'path';

const logDir = path.join(process.cwd(), 'logs');

// Ensure logs directory exists
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

export const logToFile = (service: string, message: string, error?: any) => {
  const timestamp = new Date().toISOString();
  const logFilePath = path.join(logDir, `${service}.log`);
  const logMessage = `[${timestamp}] ${message}${error ? ` - Error: ${error.message}` : ''}\n`;
  
  fs.appendFileSync(logFilePath, logMessage);
}; 