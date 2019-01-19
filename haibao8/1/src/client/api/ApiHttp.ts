import * as wxapi       from '../wxapi/index';

// 此处主机域名修改成腾讯云解决方案分配的域名
// const apiRootUrl: string = 'https://yaaaiikr.qcloud.la';
const apiRootUrl: string = 'https://www.113006.com';

export class ApiHttp {
    public static async get(path: string, params: Object): Promise<any> {
        const url: string = `${apiRootUrl}${path}`;
        const res: wxapi.WxTypes.WxHttpRequestResponse = await wxapi.WxHttp.get(url, params);

        if (res.data.error) {
            throw res.data.error;
        } else {
            return res.data.result;
        }
    }

    public static async post(path: string, params: Object): Promise<any> {
        const url: string = `${apiRootUrl}${path}`;
        const res: wxapi.WxTypes.WxHttpRequestResponse = await wxapi.WxHttp.post(url, params);

        console.log(res);

        if (res.data.error) {
            throw res.data.error;
        } else {
            if (res.data.result) {
                return res.data.result
            } else {
                return res.data;
            }
        }
    }

    public static async put(path: string, params: Object): Promise<any> {
        const url: string = `${apiRootUrl}${path}`;
        const res: wxapi.WxTypes.WxHttpRequestResponse = await wxapi.WxHttp.put(url, params);

        if (res.data.error) {
            throw res.data.error;
        } else {
            return res.data.result;
        }
    }

    public static async delete(path: string, params: Object): Promise<any> {
        const url: string = `${apiRootUrl}${path}`;
        const res: wxapi.WxTypes.WxHttpRequestResponse = await wxapi.WxHttp.delete(url, params);

        if (res.data.error) {
            throw res.data.error;
        } else {
            return res.data.result;
        }
    }
}