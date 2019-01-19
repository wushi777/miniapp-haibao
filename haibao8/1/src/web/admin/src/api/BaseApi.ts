import { HttpRequest } from '../common';

export class BaseApi {
    protected http: HttpRequest;

    constructor(httpRequest: HttpRequest) {
        this.http = httpRequest;
    }
}