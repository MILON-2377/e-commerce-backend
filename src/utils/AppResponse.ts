export default class AppResponse<T = unknown> {
  public readonly statusCode: number;
  public readonly success: boolean;
  public readonly data?: T;
  public readonly message?: string;

  private constructor(statusCode: number, data?: T, message?: string) {
    this.statusCode = statusCode;
    this.success = statusCode >= 200 && statusCode < 300;
    this.data = data;
    this.message = message;
  }

  static ok<T>(data?: T, message = "Success") {
    return new AppResponse<T>(200, data, message);
  }

  static created<T>(data?: T, message = "Resource created") {
    return new AppResponse<T>(201, data, message);
  }

  static noContent() {
    return new AppResponse<null>(204);
  }
}
