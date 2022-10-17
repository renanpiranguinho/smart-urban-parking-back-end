import { NestResponse } from './nestResponse';

export class NestResponseBuilder {
  private response: NestResponse = {
    status: 200,
    headers: {},
    body: {},
  };

  setStatus(status: number): NestResponseBuilder {
    this.response.status = status;
    return this;
  }

  setHeaders(headers: any): NestResponseBuilder {
    this.response.headers = headers;
    return this;
  }

  setBody(body: any): NestResponseBuilder {
    this.response.body = body;
    return this;
  }

  build(): NestResponse {
    return new NestResponse(this.response);
  }
}
