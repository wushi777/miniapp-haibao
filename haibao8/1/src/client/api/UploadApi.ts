import { ApiHttp }  from './ApiHttp';
import * as wxapi   from '../wxapi/index';

export class UploadApi {
    // 上传一个文件, 返回文件的下载地址
    public static async uploadFile(
        accessToken:    string,
        filePath:       string
    ): Promise<string> {
        const params = {
            accessToken
        };

        const uploadFileUrl: string = await ApiHttp.get('/api/account/uploadfileurl', params);

        return new Promise<string>((resolve, reject) => {
            const name: string = 'myFile';
            const upload = new wxapi.WxUploadFile(uploadFileUrl, filePath, name);

            upload.onSuccess = (data: string) => {
                const res: any = JSON.parse(data);
                if (res.error) {
                    return reject(res.error);
                }

                const downloadUrl: string = res.result[name][0].path;
                resolve(downloadUrl);
            }

            upload.onFail = (err: any) => {
                reject(err);
            }

            upload.upload();
        });
    }
}