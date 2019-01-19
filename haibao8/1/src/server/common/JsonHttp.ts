import * as rp          from 'request-promise';

import { StrUtils }     from './StrUtils';

export class JsonHttp {
    private static acceptLanguage: string = 'zh-CN';

    private static async request(
        method:     string,
        uri:        string, 
        params:     Object,
        returnJson: boolean = true
    ): Promise<any> {
        const options: rp.RequestPromiseOptions = {
            method,

            headers: {
                'Content-Type':     'application/json',
                'Accept-Language':  this.acceptLanguage
            },

            encoding: returnJson ? 'utf8' : null,

            rejectUnauthorized: false
        };

        switch (method) {
            case 'GET':
            case 'DELETE':
                options.qs = params;
                break;

            case 'POST':
            case 'PUT':
                options.json = true;
                options.body = params;
                break;
        }

        const body: any = await rp(uri, options);

        if (returnJson) {
            if (typeof body === 'string') {
                const result: any = StrUtils.jsonParse(body);
                return result;
            } else {
                return body;
            }
        }

        return body;
    }

    public static setAcceptLanguage(value: string) {
        this.acceptLanguage = value;
    }

    public static async get(
        uri:        string, 
        params:     Object,
        returnJson: boolean = true
    ): Promise<any> {
        const result: any = await this.request('GET', uri, params, returnJson);
        return result;
    }

    public static async delete(
        uri:        string, 
        params:     Object,
        returnJson: boolean = true
    ): Promise<any> {
        const result: any = await this.request('DELETE', uri, params, returnJson);
        return result;
    }

    public static async post(
        uri:        string, 
        params:     Object, 
        returnJson: boolean = true
    ): Promise<any> {
        const result: any = await this.request('POST', uri, params, returnJson);
        return result;
    }

    public static async put(
        uri:        string, 
        params:     Object, 
        returnJson: boolean = true
    ): Promise<any> {
        const result: any = await this.request('PUT', uri, params, returnJson);
        return result;
    }
}