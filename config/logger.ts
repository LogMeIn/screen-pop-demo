export class Logger {
  private namespace: string;

  constructor(namespace: string) {
    this.namespace = namespace;
  }

  public error(message: string, object?: any) {
    if (object) {
      console.error(
        `[${this.currentTime}] [ERROR] [${this.namespace}] ${message}`,
        object,
      );
    } else {
      console.error(
        `[${this.currentTime}] [ERROR] [${this.namespace}] ${message}`,
      );
    }
  }

  public info(message: string, object?: any) {
    if (object) {
      console.info(
        `[${this.currentTime}] [INFO] [${this.namespace}] ${message}`,
        object,
      );
    } else {
      console.info(
        `[${this.currentTime}] [INFO] [${this.namespace}] ${message}`,
      );
    }
  }

  public debug(message: string, object?: any) {
    if (
      typeof process.env.SHOW_DEBUG_LOGS === "undefined" ||
      process.env.SHOW_DEBUG_LOGS === "false"
    ) {
      return;
    }
    if (object) {
      console.debug(
        `[${this.currentTime}] [DEBUG] [${this.namespace}] ${message}`,
        object,
      );
    } else {
      console.debug(
        `[${this.currentTime}] [DEBUG] [${this.namespace}] ${message}`,
      );
    }
  }

  private get currentTime(): string {
    return new Date().toISOString();
  }
}
