"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logger = void 0;
class Logger {
    constructor(namespace) {
        this.namespace = namespace;
    }
    info(message, object) {
        if (object) {
            console.info(`[${this.currentTime}] [INFO] [${this.namespace}] ${message}`, object);
        }
        else {
            console.info(`[${this.currentTime}] [INFO] [${this.namespace}] ${message}`);
        }
    }
    error(message, object) {
        if (object) {
            console.error(`[${this.currentTime}] [ERROR] [${this.namespace}] ${message}`, object);
        }
        else {
            console.error(`[${this.currentTime}] [ERROR] [${this.namespace}] ${message}`);
        }
    }
    get currentTime() {
        return new Date().toISOString();
    }
}
exports.Logger = Logger;
