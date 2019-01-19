import * as assert  from 'assert';

import * as Common  from '../../common';
import * as Utils   from '../../utils';
import * as db      from '../../db';

export interface ExpressRequest {
    query:      any;
    params:     any;
    body:       any;
    protocol:   string;
    headers:    string[];
    ip:         string;
}

export interface TokenCustomData {
    ip?:        string;
    userAgent?: string;
}

export interface ExpressResponse {
    sendData:       (data: any) => void;
    sendSuccess:    () => void;
    writeHead:      (statusCode: number, headers: Object) => void;
    end:            (buffer: Buffer) => void;
    setHeader:      (key: string, value: string) => void;
    send:           (text: string) => void;
    redirect:       (url: string) => void;
    json:           (data: any) => void;
}

export interface ExpressApp {
    get:    (path: string, cb: (req: ExpressRequest, res: ExpressResponse) => void) => void;
    post:   (path: string, cb: (req: ExpressRequest, res: ExpressResponse) => void) => void;
    put:    (path: string, cb: (req: ExpressRequest, res: ExpressResponse) => void) => void;
    delete: (path: string, cb: (req: ExpressRequest, res: ExpressResponse) => void) => void;
}

export class BaseApi {
    constructor(app: ExpressApp) {
        this.bindReqMethods();
        this.setupRouter(app);
    }

    protected setupRouter(app: ExpressApp): void {
        assert(app);
        // doNothing
    }

    private bindReqMethods() {
        for (const key of Object.getOwnPropertyNames(Object.getPrototypeOf(this))) {
            if (key === 'constructor') {
                continue;
            }

            if (typeof this[key] !== 'function') {
                continue;
            }

            const str: string = this[key].toString();

            if (str.includes(`${key}(req`)) {
               this[key] = this[key]['bind'](this);
            }
        }
    }
}


export class BaseTokenApi extends BaseApi {
    protected tokenPrefix: string = '';

    protected parseAccessToken(req: ExpressRequest): string {
        if (req.headers['accesstoken']) {
            const accessToken: string = Common.SysUtils.safeString(req.headers['accesstoken']);
            if (accessToken) {
                return accessToken;
            }
        }

        if (req.query) {
            const accessToken: string = Common.SysUtils.safeString(req.query.accessToken);
            if (accessToken){
                return accessToken;
            }
        }

        if (req.body) {
            const accessToken: string = Common.SysUtils.safeString(req.body.accessToken);
            if (accessToken) {
                return accessToken;
            }
        }

        if (req.params) {
            const accessToken: string = Common.SysUtils.safeString(req.params.accessToken);
            if (accessToken) {
                return accessToken;
            }
        }
        
        return '';
    }

    protected async getCurrentToken(req: ExpressRequest): Promise<TokenCustomData> {
        const accessToken: string = this.parseAccessToken(req);

        if (!accessToken){
            const error = Utils.myErrors.Param_accessToken_Error;
            throw error;
        }

        if (!Utils.configs.dbInfo.inited) {
            const error = new Error('系统尚未初始化');
            throw error;
        }

        const ip:           string = req.ip;
        const userAgent:    string = req.headers['user-agent'];


        const data: TokenCustomData = await db.tokens.getToken(this.tokenPrefix, accessToken);
        
        if (!data || data.ip !== ip || data.userAgent !== userAgent) {
            const error = Utils.myErrors.Param_accessToken_Error;
            throw error;
        }

        return data;
    }

    protected async setToken(accessToken: string, customData: TokenCustomData): Promise<void> {
        await db.tokens.setToken(this.tokenPrefix, accessToken, customData);
    }

    protected async deleteToken(req: ExpressRequest): Promise<void> {
        const accessToken: string = this.parseAccessToken(req);
        if (accessToken) {
            db.tokens.deleteToken(this.tokenPrefix, accessToken);
        }
    }
}

export class ApiFuncs {
    public static sendWebApiErrorResponse(
        res: ExpressResponse, 
        err: any
    ): void {
        const error: any = {};
        if (err.message !== undefined) {
            error.message = err.message;
        }

        if (err.code !== undefined) {
            error.code = err.code;
        }

        if (err.name !== undefined) {
            error.name = err.name;
        }
        
        const text = {
            status: 'ERROR',
            error
        };
        
        Common.logger.warn('', text);
        Common.logger.spaceRow('');
        
        res.json(text);
    }

    public static sendWebApiDataResponse(res: any, data: any): void {
        const text = {
            status: 'OK',
            result: data
        };

        res.json(text);
    }

    public static sendWebApiSuccessResponse(res: any): void {
        const text = {
            status: 'OK',
            result: 'success'
        };

        res.json(text);
    }
}


