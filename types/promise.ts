export class CustomPromise<T> extends Promise<T> {
  private resolve_: ((value?: T) => void) | undefined;
  private reject_: ((reason?: any) => void) | undefined;

  constructor(
    executor: (
      resolve: (value?: any) => void,
      reject: (reason?: any) => void,
    ) => void,
  ) {
    let resolve_: ((value?: any) => void) | undefined;
    let reject_: ((reason?: any) => void) | undefined;

    super((resolve, reject) => {
      resolve_ = resolve;
      reject_ = reject;
      executor(resolve, reject);
    });

    this.resolve_ = resolve_;
    this.reject_ = reject_;
  }

  public resolve(value?: T): CustomPromise<T> {
    if (this.resolve_) {
      value === undefined ? this.resolve_() : this.resolve_(value);
    }
    return this;
  }

  public reject(reason?: any): CustomPromise<T> {
    if (this.reject_) {
      reason === undefined ? this.reject_() : this.reject_(reason);
    }
    return this;
  }
}
