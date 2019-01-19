import fly  from 'flyio';

export interface HttpRequestConfig {
    needNoTokenAPIs:        Array<string>;
    onNeedAccessToken?:     () => string;
    onAccessTokenError?:    () => void;
}

let httpRequestConfig: HttpRequestConfig;

// 全局设置
fly.config.timeout = 30000; // 超时设置 30s
fly.config.baseURL = '';    // 请求基地址
fly.config.headers['max-age'] = 30 * 24 * 60 * 1000;

// request请求拦截器
// 如果不需要验证token，直接return;
// 如果token存在，set 进 request.headers.accesstoken;
// 不存在，跳转/login页面
fly.interceptors.request.use((request: any) => {
    const url: string = request.url;

    const config = httpRequestConfig;

    const needNoToken: boolean = config.needNoTokenAPIs.some((api: string) => (api === url));

    if (needNoToken) {
        return request;
    }

    if (!config.onNeedAccessToken) {
        return request;
    }

    const token = config.onNeedAccessToken();
    if (token) {
        // 将 AccessToken 塞到 headers里
        request.headers.accesstoken = token;
    }

    return request;
});

// response相应拦截器
fly.interceptors.response.use(
    response => {
        let data;
        try {
            if (typeof response.data === 'string') {
                data = JSON.parse(response.data);
            } else {
                data = response.data;
            }
        } catch (err) {
            console.error(response);
            throw err;
        }

        if (data.error && data.error.name === 'Param_accessToken_Error') {
            const config = httpRequestConfig;

            if (config.onAccessTokenError) {
                config.onAccessTokenError();
            }
            
            throw data.error;            
        }
        return response;
    },

    error => {
        return Promise.reject(error);
    }
);

export class HttpRequest {
    public init(config: HttpRequestConfig) {
        httpRequestConfig = config;
    }

    public async get(url: string, params: any, options: any = {}): Promise<any> {
        const response  = await fly.get(url, params, options);
        const result    = this.parseResponse(response);
        return result;
    }

    public async post(url: string, params: any, options: any = {}): Promise<any> {
        const response  = await fly.post(url, params, options);
        const result    = this.parseResponse(response);
        return result;
    }

    public async put(url: string, params: any, options: any = {}): Promise<any> {
        const response  = await fly.put(url, params, options);
        const result    = this.parseResponse(response);
        return result;
    }

    public async delete(url: string, params: any, options: any = {}): Promise<any> {
        const response  = await fly.delete(url, params, options);
        const result    = this.parseResponse(response);
        return result;
    }

    private parseResponse(response: any): any {
        let data;
        if (typeof response.data === 'string') {
            data = JSON.parse(response.data);
        } else {
            data = response.data; 
        }

        if (data) {
            if (data.result) {
                return data.result;
            }

            if (data.error) {
                throw data.error;
            }
        }

        return null;
    }
}