import * as crypto      from 'crypto';
import * as path        from 'path';
import * as Cos         from 'cos-nodejs-sdk-v5';

import * as Weixin      from '.';
import * as Common      from '../common';
import * as Utils       from '../utils';

export class WeixinFuncs {
    private appid:          string = '';
    private appsecret:      string = '';
    private accessToken:    string = '';

    private reset(appid: string, appsecret: string): void {
        if (appid !== this.appid || appsecret !== this.appsecret) {
            this.accessToken    = '';
            this.appid          = appid;
            this.appsecret      = appsecret;
        }
    }

    private async getAccessToken(): Promise<string> {
        if (!this.accessToken) {
            const url: string  = 'https://api.weixin.qq.com/cgi-bin/token';

            const params = {
                grant_type: 'client_credential',
                appid:      this.appid,
                secret:     this.appsecret
            };

            const res: any = await Common.JsonHttp.get(url, params);

            if (res.errcode) {
                const error = new Error(res.errmsg);
                throw error;
            }

            this.accessToken = res.access_token;
        }

        return this.accessToken;
    }

    public verifySignature(rawData: string, signature: string, session_key: string): boolean {
        const sha1: crypto.Hash = crypto.createHash('sha1');
        sha1.update(`${rawData}${session_key}`);
        const signature2: string = sha1.digest('hex');

        const bOk: boolean = signature2 === signature;
        return bOk;
    }

    public decryptData(encryptedData: string, iv: string, session_key: string): any {
        // 校验加密数据
        const sessionKeyBuffer      = new Buffer(session_key,   'base64');
        const encryptedDataBuffer   = new Buffer(encryptedData, 'base64');
        const ivBuffer              = new Buffer(iv,            'base64');

        const decipher: crypto.Decipher = crypto.createDecipheriv('aes-128-cbc', 
            sessionKeyBuffer, ivBuffer);

        decipher.setAutoPadding(true);

        let decoded: string = decipher.update(encryptedDataBuffer, 'binary', 'utf8');

        decoded += decipher.final('utf8');

        const result: any = Common.StrUtils.jsonParse(decoded);

        return result;
    }

    public async jscode2session(
        appid:      string,
        appsecret:  string,
        js_code:    string
    ): Promise<Weixin.WeixinTypes.WxSessionInfo> {
        this.reset(appid, appsecret);

        const url: string  = 'https://api.weixin.qq.com/sns/jscode2session';

        const params = {
            appid,
            secret:     appsecret,
            js_code,
            grant_type: 'authorization_code'
        };

        const res: any = await Common.JsonHttp.get(url, params);

        if (res.errcode) {
            const error = new Error(res.errmsg);
            throw error;
        }
        
        const result: Weixin.WeixinTypes.WxSessionInfo = {
            openid:         res.openid,
            session_key:    res.session_key,
            unionid:        res.unionid
        };

        return result;
    }

    public async getWXACodeUnlimit(
        appid:          string,
        appsecret:      string,
        scene:          string,
        page:           string,
        width:          number,
        auto_color:     boolean,
        line_color:     {r: number; g: number, b: number},
        is_hyaline:     boolean
    ): Promise<any> {
        this.reset(appid, appsecret);
        const accessToken = await this.getAccessToken();

        const url = `https://api.weixin.qq.com/wxa/getwxacodeunlimit?access_token=${accessToken}`;

        const params = {
            scene,
            page,
            width,
            auto_color, 
            line_color,
            is_hyaline
        };

        const result: any = await Common.JsonHttp.post(url, params, false);

        let x: any;
        try {
            x = Common.StrUtils.jsonParse(result);
        } catch (err) {
            return result;
        }

        if (x.errcode === 42001) {
            this.accessToken = '';

            const result: any = await this.getWXACodeUnlimit(
                appid, appsecret, scene, page, width, auto_color, line_color, is_hyaline);
                
            return result;
        }
        
        const error = new Error(result);
        throw error;
    }

    public async uploadFileToCos(
        cosConfigs: Utils.ApiTypes.TencentCosConfigs,
        fileName:   string
    ): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            const cos = new Cos({
                AppId:      cosConfigs.appid,
                SecretId:   cosConfigs.secretid,
                SecretKey:  cosConfigs.secretkey
            });

            const now = new Date();

            const year: number  = now.getFullYear();
            let month:  any     = now.getMonth() + 1;
            let day:    any     = now.getDate();

            if (month < 10){
                month = '0' + month.toString();
            }

            if (day < 10){
                day = '0' + day.toString();
            }

            const dateFolder: string = `${year}${month}${day}`; 

            const ext: string = path.extname(fileName);
            const uuid: string = Common.StrUtils.uuid(Utils.configs.serverUrl);

            // 分片上传
            cos.sliceUploadFile({
                Bucket:     cosConfigs.bucket,
                Region:     cosConfigs.region,
                Key:        `${dateFolder}/${uuid}${ext}`,
                FilePath:   fileName
            }, function (err, data) {
                if (err) {
                    reject(err);
                };

                //console.log(err, data);
                const result: string = `https://${data.Location}`;
                resolve(result);
            });
        });
    }
}

export const weixinFuncs = new WeixinFuncs();
