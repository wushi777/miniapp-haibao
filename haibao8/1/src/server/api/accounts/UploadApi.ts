import * as assert          from 'assert';

import * as Utils           from '../../utils';

import { UploadFile }       from '../upload';

import * as Base            from '../base';
import { BaseAccountApi }   from './BaseAccountApi';

export class UploadApi extends BaseAccountApi {
    protected setupRouter(app: Base.ExpressApp): void {
        // 上传文件相关
        app.get('/api/account/uploadfileurl',   this.getUploadFileUrl);
        app.post('/api/account/uploadfile',     this.uploadFile);
    }

    // 获取上传文件网关    
    private async getUploadFileUrl(req: Base.ExpressRequest, res: Base.ExpressResponse): Promise<void> {
        const token: Utils.ApiTypes.AccountInfo = await this.getCurrentToken(req);
        assert(token);

        const accessToken: string = this.parseAccessToken(req);

        const root:     string = `${req.protocol}://${req.headers['host']}`;
        const result:   string = `${root}/api/account/uploadfile?accessToken=${accessToken}`;
        res.sendData(result);
    }

     // 上传文件 
     private async uploadFile(req: Base.ExpressRequest, res: Base.ExpressResponse): Promise<void> {
        const token: Utils.ApiTypes.AccountInfo = await this.getCurrentToken(req);
        if (!token) {
            const error = new Error('accessToken 错误');
            throw error;
        }

        const files: any = await UploadFile.uploadFile(req);
        res.sendData(files);
    }
}
