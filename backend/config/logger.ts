export class Logger {
  private namespace: string;

  constructor(namespace: string) {
    this.namespace = namespace;
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

  private get currentTime(): string {
    return new Date().toISOString();
  }
}
