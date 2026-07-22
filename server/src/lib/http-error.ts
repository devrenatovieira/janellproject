export class HttpError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
    this.name = 'HttpError';
  }

  static badRequest(message: string) {
    return new HttpError(400, message);
  }
  static unauthorized(message = 'Não autorizado') {
    return new HttpError(401, message);
  }
  static forbidden(message = 'Proibido') {
    return new HttpError(403, message);
  }
  static notFound(message = 'Não encontrado') {
    return new HttpError(404, message);
  }
}
