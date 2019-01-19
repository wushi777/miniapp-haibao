import * as qs      from 'querystring';
import * as crypto  from "crypto";

import * as Common  from '../common';
import * as Utils   from '../utils';

const AlipaySignTypes = {
    RSA:    'RSA-SHA1',
    RSA2:   'RSA-SHA256'
};

class Alipay {
    //生成时间戳
    private timestamp(date: Date): string {
        date = date || new Date;
        const MM: number    = date.getMonth() + 1;
        const dd: number    = date.getDate();
        const hh: number    = date.getHours();
        const mm: number    = date.getMinutes();
        const ss: number    = date.getSeconds();

        return [
            date.getFullYear(),
            (MM > 9 ? '' : '0') + MM,
            (dd > 9 ? '' : '0') + dd
        ].join('-') + ' ' + [
            (hh > 9 ? '' : '0') + hh,
            (mm > 9 ? '' : '0') + mm,
            (ss > 9 ? '' : '0') + ss
        ].join(':');
    }

    //签名
    private createSignatureWithRSA(alipayConfigs: any, content: string, charset: any): string 
    {
        const signType: string          = alipayConfigs.sign_type || 'RSA2';
        const rsa:      crypto.Signer   = crypto.createSign(AlipaySignTypes[signType]);

        rsa.update(content, charset);

        const data: string = rsa.sign(alipayConfigs.app_private_key, 'base64');
        return data;
    }

    //验签
    public verify(alipayConfigs: any, params: any, isJson: boolean, sign: string, sign_type: string): boolean {
        delete params.sign;
        delete params.sign_type;

        let content: string;
        if (isJson){
            content = JSON.stringify(params); //主动请求时返回的数据是Json格式
        }else{
            content = this.stringify(params); //notify_url 和 return_url 回调的数据是query字符串格式如:a=x&b=y&c=z......
        }
        content = content.replace(/\//g, "\\/");
        
        const rsa: crypto.Verify = crypto.createVerify(AlipaySignTypes[sign_type]);

        const charset: crypto.Utf8AsciiLatin1Encoding = params.charset || 'utf-8';

        rsa.update(content, charset);

        const bOk: boolean = rsa.verify(alipayConfigs.alipay_public_key, sign, 'base64');

        return bOk;
    }

    //将所有参数拼接成一个字符串
    private stringify(params: any): string {
        //生成一个键名称数组
        let arr: string[] = Object.keys(params);
        
        //过滤sign字段和空字段
        arr = arr.filter((key: string): boolean => {
            if (key === 'sign') {
                return false;
            }
            
            if (!params[key]) {
                return false;
            }

            return true;
        });
        
        //将数组按字母顺序排序
        arr = arr.sort();

        //将数组中的每个元素改为 k=v 格式
        arr = arr.map((key: string): string => {
            const data = [key, params[key]].join('=');
            return data;
        });

        //拼接成查询字符串
        const result: string = arr.join('&');
        return result;
    }

    //创建请求参数
    private createParams(
        alipayConfigs:  any, 
        method:         string, 
        biz_content:    Object, 
        notify_url:     string, 
        return_url:     string
    ): Object {
        const data: any = {
            app_id:         alipayConfigs.app_id, 
            method,
            format:         'JSON', 
            charset:        'utf-8', 
            sign_type:      alipayConfigs.sign_type || 'RSA2', 
            timestamp:      this.timestamp(new Date()),
            version:        '1.0',
            biz_content:    JSON.stringify(biz_content)
        };

        if (notify_url){
            data.notify_url = notify_url;
        }

        if (return_url){
            data.return_url = return_url;
        }

        return data;
    };

    //生成请求URL
    private makeAlipayRequestUrl(
        alipayConfigs:  any, 
        method:         string, 
        biz_content:    any, 
        notify_url:     string, 
        return_url:     string
    ): string {
        const params: any = this.createParams(alipayConfigs, method, biz_content, notify_url, return_url);
    
        const content: string = this.stringify(params);
        
        params.sign = this.createSignatureWithRSA(alipayConfigs, content, params.charset);

        const url: string = `${alipayConfigs.alipay_gateway}?${qs.stringify(params)}`;

        return url;
    }

    //执行一个请求
    private async execute(
        alipayConfigs:  Utils.ApiTypes.AlipayConfigs, 
        method:         string, 
        biz_content:    Object, 
        notify_url:     string = ''
    ): Promise<any> {
        const url: string = this.makeAlipayRequestUrl(alipayConfigs, method, biz_content, notify_url, '');

        const response:     any     = await Common.JsonHttp.get(url, {});
        const rootNodeName: string  = method.replace(/\./g, "_") + "_response";
        const result:       any     = response[rootNodeName];

        if (this.verify(alipayConfigs, result, true, response.sign, alipayConfigs.sign_type)) {
            return result;
        } else {
            const error = new Error('verify signature fail:' + response);
            throw error;
        }

        // return new Promise<any>((resolve, reject) => {
        //     let buffer: string = '';
        //     const req = https.get(url, (res) => {
        //         res.setEncoding('utf8');

        //         res.on('error', (error) => {
        //             return reject(error);
        //         }).on('data', (chunk) => {
        //             buffer += chunk;
        //         }).on('end', () => {
        //             const response: any = Common.StrUtils.jsonParse(buffer);
        //             const rootNodeName: string = method.replace(/\./g, "_") + "_response";
        //             const result = response[rootNodeName];

        //             if (this.verify(alipayConfigs, result, true, response.sign, alipayConfigs.sign_type)) {
        //                 resolve(result);
        //             } else {
        //                 reject(new Error('verify signature fail:' + response));
        //             }
        //         });
        //     });

        //     req.on('error',(err) => {  
        //         console.error(err);  
        //     });

        //     req.end();
        // });
    }

    //电脑网站支付, 返回一个请求 URL 供 Web 服务器重定向或前端跳转即可
    public async pagePay(
        alipayConfigs:      Utils.ApiTypes.AlipayConfigs, 
        out_trade_no:       string, 
        total_amount:       number, 
        subject:            string, 
        passback_params:    any, 
        notify_url:         string, 
        return_url:         string
    ): Promise<string> {
        const biz_content = {
            out_trade_no,
            product_code: 'FAST_INSTANT_TRADE_PAY',
            total_amount,
            subject,
            passback_params: JSON.stringify(passback_params)
        };

        const data: string = await this.makeAlipayRequestUrl(
            alipayConfigs, 
            'alipay.trade.page.pay', 
            biz_content, 
            notify_url, 
            return_url
        );

        return data;
    }

    //扫码支付, 返回二维码的code_url, 需在支付宝里签约当面付
    public async precreate(
        alipayConfigs:  Utils.ApiTypes.AlipayConfigs, 
        out_trade_no:   string, 
        total_amount:   number, 
        subject:        string,
        notify_url:     string
    ): Promise<any> {
        const biz_content = {
            out_trade_no,
            total_amount,
            subject
        };

        const data: any = await this.execute(
            alipayConfigs, 
            'alipay.trade.precreate', 
            biz_content, 
            notify_url
        );

        return data;
    }

    //查询订单
    public async orderQuery(
        alipayConfigs:  Utils.ApiTypes.AlipayConfigs, 
        out_trade_no:   string
    ): Promise<any> {
        const biz_content = {
            out_trade_no
        };

        const data: any = await this.execute(
            alipayConfigs, 
            'alipay.trade.query', 
            biz_content
        );
        
        return data;
    };
}

export default new Alipay();