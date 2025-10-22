export class ServerError extends Error {
  statusCode: number;
  constructor(message: string, statusCode: number = 1000) {
    super(message);
    this.name = 'ServerError';
    this.statusCode = statusCode;
  }
}
