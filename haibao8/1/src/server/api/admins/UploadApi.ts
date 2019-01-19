import * as assert      from 'assert';

import * as Utils       from '../../utils';

import { UploadFile }   from '../upload';

import * as Base        from '../base';
import { BaseAdminApi } from './BaseAdminApi';

export class UploadApi extends BaseAdminApi {
    protected setupRouter(app: Base.ExpressApp): void {
        // 获取上传文件网关
        app.get('/api/admin/uploadfileurl', this.getUploadFileUrl);
        app.post('/api/admin/uploadfile',   this.uploadFile);
    }

    // 获取上传文件网关    
    private async getUploadFileUrl(req: Base.ExpressRequest, res: Base.ExpressResponse): Promise<void> {
        const token: Utils.ApiTypes.AdminInfo = await this.getCurrentToken(req);
        assert(token);

        const accessToken: string = this.parseAccessToken(req);
        const result: string = `/api/admin/uploadfile?accessToken=${accessToken}`;
        res.sendData(result);
    }

    // 上传文件 
    private async uploadFile(req: Base.ExpressRequest, res: Base.ExpressResponse): Promise<void> {
        const token = await this.getCurrentToken(req);
        if (!token) {
            const error = new Error('accessToken 错误');
            throw error;
        }

        const files: any = await UploadFile.uploadFile(req);
        res.sendData(files);
    }
}