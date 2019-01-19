import * as qrImage from 'qr-image';

import * as Base    from '../base';

export class MiscApi extends Base.BaseApi {
    protected setupRouter(app: Base.ExpressApp): void {
        // 获取二维码
        app.get('/api/misc/qrcode', this.makeQrCode);
    }

    // GET 生成二维码
    private async makeQrCode(req: Base.ExpressRequest, res: any): Promise<void> {
        const url: string = req.query.url;

        const img = qrImage.image(url, {
            size: 10
        });

        res.writeHead(200, {
            'Content-Type': 'image/png'
        });

        img.pipe(res);
    }
}
