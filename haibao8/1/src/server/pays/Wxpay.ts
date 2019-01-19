import * as https   from 'https';
import * as xmljs   from 'xml-js';

import * as Utils   from '../utils';
import * as Common  from '../common';

class Wxpay {
    //生成随机字符串
    private makeNonceString(): string {
        const now:      number  = Common.DateUtils.now();
        const time:     string  = `${now}${Utils.configs.serverUrl}`;
        const result:   string  = Common.StrUtils.md5(time);
        return result;
    }

    //签名
    public makeSign(wxpayConfigs: Utils.ApiTypes.WxpayConfigs, params: Object): string {
        const keys: string[] = Object.keys(params).sort();

        let arr = [];
        for (const k of keys){
            if (!params[k]){
                continue;
            }

            if (k === 'sign'){
                continue;
            }

            arr.push(`${k}=${params[k]}`);
        }

        arr.push(`key=${wxpayConfigs.key}`);

        const stringA: string = arr.join('&');

        const sign: string = Common.StrUtils.md5(stringA).toUpperCase();
        return sign;
    }

    //将微信的返回的 XML 数据转化为 JavaScript 对象
    private wxpayResponseDataToObject(wxpayConfigs: Utils.ApiTypes.WxpayConfigs, data: string): any {
        const xml2jsOptions = {
            compact:    true,
            nativeType: true
        };

        const x:    any = xmljs.xml2js(data, xml2jsOptions);
        const xml:  any = x.xml;

        const info: any = {};
        for (const key in xml){
            if (xml.hasOwnProperty(key)){
                if (xml[key].hasOwnProperty('_cdata')){
                    info[key] = xml[key]._cdata;
                }else if (xml[key].hasOwnProperty('_text')){
                    info[key] = xml[key]._text;
                }
            }
        }

        //验签
        const sign: string = this.makeSign(wxpayConfigs, info);
        if (info.sign !== sign){
            const error = new Error('sign error');
            throw error;
        }

        if (info.return_code !== 'SUCCESS'){
            const error = new Error(info.return_msg);
            throw error;
        }

        if (info.result_code !== 'SUCCESS') {
            const error: any = new Error(info.err_code_des);
            error.code = info.err_code;
            throw error;
        }

        delete info.return_code;
        delete info.return_msg;
        delete info.result_code;
        delete info.err_code;
        delete info.err_code_des;

        return info;
    }

    //调用微信支付API
    private async callWxpayAPI(
        wxpayConfigs:   Utils.ApiTypes.WxpayConfigs, 
        params:         any, 
        apiName:        string
    ): Promise<any> {
        return new Promise<string>((resolve, reject) => {
            //设置公共参数
            params.appid        = wxpayConfigs.appid;
            params.mch_id       = wxpayConfigs.mch_id;
            params.nonce_str    = this.makeNonceString();
            params.sign_type    = 'MD5';
            params.sign         = '';

            //签名
            const sign: string = this.makeSign(wxpayConfigs, params);
            params.sign = sign;

            //生成请求数据(XML)
            let kvs: string = '';
            for (const k in params){
                kvs = kvs + `<${k}>${params[k]}</${k}>`;
            }
            const data: string = `<xml>${kvs}</xml>`;

            const content: Buffer = new Buffer(data);

            //发送请求
            var options = {
                host:                   'api.mch.weixin.qq.com',
                path:                   apiName,
                method:                 'POST',
                rejectUnauthorized:     false,

                headers: {
                    'Content-Type':     'text/xml;charset=utf8',
                    'Content-Length':   content.length
                }
            }

            let responseData: string = '';
        
            const req = https.request(options, (res) => {
                res.setEncoding('utf8');

                res.on('data', (data) => {
                    responseData += data;
                });

                res.on('end', () => {
                    try{
                        const info: any = this.wxpayResponseDataToObject(wxpayConfigs, responseData);
                        return resolve(info);
                    }catch(err){
                        return reject(err);
                    }
                });
            });

            req.on('error', (err) => {
                return reject(err);
            });

            req.write(content);
            req.end();
        });
    }

    //统一下单
    public async unifiedOrder(
        wxpayConfigs:   Utils.ApiTypes.WxpayConfigs, 
        body:           string, 
        out_trade_no:   string, 
        product_id:     string, 
        total_fee:      number, 
        notify_url:     string
    ): Promise<string> {
        //生成请求数据对象
        const params = {        
            notify_url,
            body:               body,                       //商品描述
            out_trade_no:       out_trade_no,               //商户订单号
            product_id:         product_id,                 //商品ID
            spbill_create_ip:   Utils.configs.serverHost,   //终端IP
            total_fee:          total_fee,                  //标价金额(分)
            trade_type:         'NATIVE',
            sign:               ''
        }

        const info: any = await this.callWxpayAPI(wxpayConfigs, params, '/pay/unifiedorder');

        /*
        <xml>
            <return_code><![CDATA[SUCCESS]]></return_code>
            <return_msg><![CDATA[OK]]></return_msg>
            <appid><![CDATA[wxf1b91b73501952f0]]></appid>
            <mch_id><![CDATA[1312964101]]></mch_id>
            <nonce_str><![CDATA[test]]></nonce_str>
            <sign><![CDATA[8E39DB3FFBC62BC91A5E0F087531289E]]></sign>
            <result_code><![CDATA[SUCCESS]]></result_code>
            <prepay_id><![CDATA[wx2018032917455829faa81b240047528598]]></prepay_id>
            <trade_type><![CDATA[NATIVE]]></trade_type>
            <code_url><![CDATA[weixin://wxpay/test?pr=HFd6hOb]]></code_url>
        </xml>
        */

        return info.code_url;
    }

    //使用 out_trade_no 查询订单
    public async orderQuery(wxpayConfigs: Utils.ApiTypes.WxpayConfigs, out_trade_no: string): Promise<any> {
        const params = {
            out_trade_no
        };

        const info: any = await this.callWxpayAPI(wxpayConfigs, params, '/pay/orderquery');

        const data = {
            trade_state:    info.trade_state,
            transaction_id: info.transaction_id
        }
        return data;
    }

    //使用 transaction_id 查询订单
    public async orderQueryByTransactionID(
        wxpayConfigs:   Utils.ApiTypes.WxpayConfigs, 
        transaction_id: string
    ): Promise<any> {
        const params = {
            transaction_id
        };

        const info: any = await this.callWxpayAPI(wxpayConfigs, params, '/pay/orderquery');

        const data = {
            trade_state:    info.trade_state,
            transaction_id: info.transaction_id
        }
    }

    //关闭订单
    public async closeOrder(
        wxpayConfigs: Utils.ApiTypes.WxpayConfigs, 
        out_trade_no: string
    ): Promise<any> {
        const params = {
            out_trade_no
        };

        const info: any = await this.callWxpayAPI(wxpayConfigs, params, '/pay/closeorder');

        const data = {
            result_msg: info.result_msg
        }
    }

    //生成微信通知回调的回应数据
    public makeWxpayNotifyReturnText(return_code: string, return_msg: string): string {
        const data: string =    `<xml>` + 
                                    `<return_code><![CDATA[${return_code}]]></return_code>` + 
                                    `<return_msg><![CDATA[${return_msg}]]></return_msg>` + 
                                `</xml>`;

        return data;
    }

    //解析微信支付的通知数据
    public async parseWxpayNotify(
        wxpayConfigs:   Utils.ApiTypes.WxpayConfigs, 
        notifyXml:      string
    ): Promise<any> {
        /*
        <xml>
            <appid><![CDATA[wx2421b1c4370ec43b]]></appid>
            <attach><![CDATA[支付测试]]></attach>
            <bank_type><![CDATA[CFT]]></bank_type>
            <fee_type><![CDATA[CNY]]></fee_type>
            <is_subscribe><![CDATA[Y]]></is_subscribe>
            <mch_id><![CDATA[10000100]]></mch_id>
            <nonce_str><![CDATA[5d2b6c2a8db53831f7eda20af46e531c]]></nonce_str>
            <openid><![CDATA[test]]></openid>
            <out_trade_no><![CDATA[1409811653]]></out_trade_no>
            <result_code><![CDATA[SUCCESS]]></result_code>
            <return_code><![CDATA[SUCCESS]]></return_code>
            <sign><![CDATA[B552ED6B279343CB493C5DD0D78AB241]]></sign>
            <sub_mch_id><![CDATA[10000100]]></sub_mch_id>
            <time_end><![CDATA[20140903131540]]></time_end>
            <total_fee>1</total_fee>
            <coupon_fee><![CDATA[10]]></coupon_fee>
            <coupon_count><![CDATA[1]]></coupon_count>
            <coupon_type><![CDATA[CASH]]></coupon_type>
            <coupon_id><![CDATA[10000]]></coupon_id>
            <coupon_fee><![CDATA[100]]></coupon_fee>
            <trade_type><![CDATA[JSAPI]]></trade_type>
            <transaction_id><![CDATA[1004400740201409030005092168]]></transaction_id>
        </xml>
        */

        const info: any = this.wxpayResponseDataToObject(wxpayConfigs, notifyXml);

        /*
        const sign = this.makeSign(wxpayConfigs, info);

        if (info.sign !== sign){
            const error = new Error('sign error');
            throw error;
        }
        */

        if (info.appid !== wxpayConfigs.appid){
            const error = new Error('appid Error');
            throw error;
        }

        if (info.mch_id !== wxpayConfigs.mch_id){
            const error = new Error('mch_id Error');
            throw error;
        }

        const data = {
            out_trade_no:   info.out_trade_no,
            total_fee:      info.total_fee,
            transaction_id: info.transaction_id
        };

        return data;
    }

    public async testParseNotifyData(wxpayConfigs: Utils.ApiTypes.WxpayConfigs) {
        const xmlString = `<xml><appid><![CDATA[wxf1b91b73501952f0]]></appid>
            <bank_type><![CDATA[CFT]]></bank_type>
            <cash_fee><![CDATA[1]]></cash_fee>
            <fee_type><![CDATA[CNY]]></fee_type>
            <is_subscribe><![CDATA[Y]]></is_subscribe>
            <mch_id><![CDATA[1312964101]]></mch_id>
            <nonce_str><![CDATA[879251a9627929f1704e96064854b649]]></nonce_str>
            <openid><![CDATA[olb_0wY4kkAA14sfoDZoNv2aR_0w]]></openid>
            <out_trade_no><![CDATA[20180409035524155217]]></out_trade_no>
            <result_code><![CDATA[SUCCESS]]></result_code>
            <return_code><![CDATA[SUCCESS]]></return_code>
            <sign><![CDATA[52B42039485A5F3137989B65EB8C2A07]]></sign>
            <time_end><![CDATA[20180409115532]]></time_end>
            <total_fee>1</total_fee>
            <trade_type><![CDATA[NATIVE]]></trade_type>
            <transaction_id><![CDATA[4200000052201804095158594767]]></transaction_id>
            </xml>`;

        const data: any = await this.parseWxpayNotify(wxpayConfigs, xmlString);
        console.log(data);
    }
}

export default new Wxpay();