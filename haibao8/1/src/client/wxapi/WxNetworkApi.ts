import * as WxTypes from './WxTypes';

declare const wx;

///////////////////////////////////////////////////////////////

// interface ErrorNode {
//     name:       string;
//     message:    string;
//     code?:      number;
// }

// interface JsonResponse {
//     status: string;
//     error?: ErrorNode;
//     result: any;
// }

export class WxHttp {
    public static async request(
        url:    string,
        data:   Object,
        method: string
    ): Promise<WxTypes.WxHttpRequestResponse> {
        return new Promise<WxTypes.WxHttpRequestResponse>((resolve, reject) => {
            wx.request({
                url,
                data,
                method,
                
                success: (res: WxTypes.WxHttpRequestResponse) => {
                    resolve(res);
                    // try {
                    //     console.log(res);

                    //     const response: JsonResponse = res.data;

                    //     if (response.error) {
                    //         reject(response.error);
                    //     } else {
                    //         resolve(response.result);
                    //     }
                    // } catch (err) {
                    //     reject(err);
                    // }
                },

                fail: (err) => {
                    reject(err);
                }
            })
        });
    }

    public static async get(url: string, data: Object): Promise<any> {
        const result: any = await this.request(url, data, 'get');
        return result;
    }

    public static async post(url: string, data: Object): Promise<any> {
        const result: any = await this.request(url, data, 'post');
        return result;
    }

    public static async put(url: string, data: Object): Promise<any> {
        const result: any = await this.request(url, data, 'put');
        return result;
    }

    public static async delete(url: string, data: Object): Promise<any> {
        const result: any = await this.request(url, data, 'delete');
        return result;
    }
}

/////////////////////////////////////////////////////////////////////////////////////////////////

type UploadFileProgress = (
    progress:                   number, 
    totalBytesSent:             number, 
    totalBytesExpectedToSend:   number
) => void;

type UploadFileSuccess  = (data: string) => void;
type UploadFileFail     = (error: any) => void;

interface WxUploadFileResponse {
    data:       string; // 开发者服务器返回的数据
    statusCode: number; // 开发者服务器返回的 HTTP 状态码
}

interface WxUploadTask {
    onProgressUpdate:   UploadFileProgress;
    abort:              () => void;
}

export class WxUploadFile {
    private task: WxUploadTask = null;

    public onProgress:  UploadFileProgress  = null;
    public onSuccess:   UploadFileSuccess   = null;
    public onFail:      UploadFileFail      = null;

    constructor(
        public url:         string, 
        public filePath:    string, 
        public name:        string
    ) {}

    public upload() {
        this.task = wx.uploadFile({
            url:        this.url,
            filePath:   this.filePath,
            name:       this.name,

            success: (res: WxUploadFileResponse) => {
                if (this.onSuccess) {
                    this.onSuccess(res.data);
                }
            },

            fail: (err: any) => {
                if (this.onFail) {
                    this.onFail(err);
                }
            }
        });

        this.task.onProgressUpdate = (
            progress:                   number, 
            totalBytesSent:             number, 
            totalBytesExpectedToSend:   number
        ) => {
            if (this.onProgress) {
                this.onProgress(progress, totalBytesSent, totalBytesExpectedToSend);
            }
        }
    }

    public abort() {
        if (this.task) {
            this.task.abort();
        }
    }
}

//////////////////////////////////////////////////////////////////////////////////////////////

type DownloadFileProgress = (
    progress:                   number, 
    totalBytesWritten:          number, 
    totalBytesExpectedToWrite:  number
) => void;

type DownloadFileSuccess  = (tempFilePath: string) => void;
type DownloadFileFail     = (error: any) => void;

interface WxDownloadTask {
    onProgressUpdate:   DownloadFileProgress;
    abort:              () => void;
}

interface WxDownloadFileResponse {
    tempFilePath:   string;
    statusCode:     number;
}

export class WxDownloadFile {
    private task: WxDownloadTask = null;

    public onProgress:  DownloadFileProgress    = null;
    public onSuccess:   DownloadFileSuccess     = null;
    public onFail:      DownloadFileFail        = null;

    constructor(
        public url: string
    ) {}

    public download() {
        this.task = wx.downloadFile({
            url: this.url,

            success: (res: WxDownloadFileResponse) => {
                if (this.onSuccess) {
                    this.onSuccess(res.tempFilePath);
                }
            },

            fail: (err: any) => {
                if (this.onFail) {
                    this.onFail(err);
                }
            }
        });

        this.task.onProgressUpdate = (
            progress:                   number, 
            totalBytesWritten:          number, 
            totalBytesExpectedToWrite:  number
        ) => {
            if (this.onProgress) {
                this.onProgress(progress, totalBytesWritten, totalBytesExpectedToWrite);
            }
        }
    }

    public abort() {
        if (this.task) {
            this.task.abort();
        }
    }
}