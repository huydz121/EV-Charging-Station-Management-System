const EventEmitter = require('events');
const fs = require('fs');
const path = require('path');

class SystemLogger extends EventEmitter {
  constructor() {
    super();
    this.logFile = path.join(__dirname, '../public/uploads/app.log');
    
    
    // Listen to self event
    this.on('error_login', (data) => {
      this.writeLog('LOGIN_ERROR', `Email: ${data.email} | IP: ${data.ip} | Message: ${data.message}`);
    });

    this.on('system_error', (data) => {
      this.writeLog('SYSTEM_ERROR', `Error: ${data.message}`);
    });
  }

  writeLog(type, message) {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] [${type}] ${message}\n`;
    
    fs.appendFile(this.logFile, logMessage, (err) => {
      if (err) console.error('Error writing to log file:', err);
    });
  }
}

// Export a singleton instance
module.exports = new SystemLogger();
