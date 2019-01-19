import * as assert          from 'assert';
import * as querystring     from 'querystring';

import * as Common          from '../../common';
import * as Utils           from '../../utils';
import * as db              from '../../db';

import * as Base            from '../base';
import { BaseAccountApi }   from './BaseAccountApi';


export class OrdersApi extends BaseAccountApi {
    protected setupRouter(app: Base.ExpressApp): void {
        //创建订单
        app.post('/api/account/orders',                         this.createOrder);

        //取消未支付的订单
        app.put('/api/account/orders/:orderID/cancel',          this.cancelOrder);

        //获取微信支付CodeUrl
        app.get('/api/account/orders/:orderID/wxpay/codeurl',   this.getOrderWxpayCodeUrl);

        //获取支付宝支付PayUrl
        app.get('/api/account/orders/:orderID/alipay/payurl',   this.getOrderAlipayPayUrl);

        //获取指定的订单详细信息
        app.get('/api/account/orders/:orderID',                 this.getOrderInfo);

        //获取订单列表
        app.get('/api/account/orders',                          this.queryOrderPageData);

        // 获取微信支付的收款方名称
        app.get('/api/account/wxpay/payee',                     this.getWxpayPayee);
    }

    //POST 创建订单
    private async createOrder(req: Base.ExpressRequest, res: Base.ExpressResponse): Promise<void> {
        const token: Utils.ApiTypes.AccountInfo = await this.getCurrentToken(req);
        assert(token);

        const accountID:        number = token.accountID;
        const orderMoneyFen:    number = Common.SysUtils.safeNumber(req.body.orderMoneyFen);

        if ((!orderMoneyFen) || (orderMoneyFen < 0)) {
            const error = new Error('充值金额错误');
            throw error;
        }

        const orderID: number = await db.orders.createOrder(accountID, orderMoneyFen);
        res.sendData(orderID);
    }

    //GET 获取订单的微信支付二维码地址
    private async getOrderWxpayCodeUrl(req: Base.ExpressRequest, res: Base.ExpressResponse): Promise<void> {
        const token: Utils.ApiTypes.AccountInfo = await this.getCurrentToken(req);
        assert(token);

        const accountID:    number  = token.accountID;
        const orderID:      number  = Common.SysUtils.safeNumber(req.params.orderID);

        if (!orderID){
            const error = new Error('订单号错误');
            throw error;
        }

        const result: string = await db.orders.getOrderWxpayCodeUrl(accountID, orderID);
        res.sendData(result);
    }

    //GET 获取订单的支付宝支付链接
    private async getOrderAlipayPayUrl(req: Base.ExpressRequest, res: Base.ExpressResponse): Promise<void> {
        const token: Utils.ApiTypes.AccountInfo = await this.getCurrentToken(req);
        assert(token);

        const accountID:    number  = token.accountID;
        const orderID:      number  = Common.SysUtils.safeNumber(req.params.orderID);
        const return_url:   string  = Common.SysUtils.safeString(req.query.return_url);

        if (!orderID){
            const error = new Error('订单号错误');
            throw error;
        }

        if (!return_url){
            const error = new Error('return_url 错误');
            throw error;
        }

        const orderInfo: Utils.ApiTypes.OrderInfo = await db.orders.getOrderInfo(accountID, orderID);
        if (!orderInfo) {
            const error = new Error('订单号错误');
            throw error;
        }

        if (orderInfo.orderStatus !== 0) {
            const error = new Error('订单号错误');
            throw error;
        }

        if (req.query.sessionID) {
            const result: string = await db.orders.getOrderAlipayPayUrl(accountID, orderID, return_url);

            //直接重定向
            res.redirect(result);
        } else {
            const params = {
                return_url,
                accessToken:    this.parseAccessToken(req),
                sessionID:      Common.StrUtils.uuid('')
            };

            const query:    string = querystring.stringify(params);
            const url:      string = `${Utils.configs.serverUrl}/api/account/orders/${orderID}/alipay/payurl?${query}`;
            res.sendData(url);
        }
    }

    //PUT 取消一个订单
    private async cancelOrder(req: Base.ExpressRequest, res: Base.ExpressResponse): Promise<void> {
        const token: Utils.ApiTypes.AccountInfo = await this.getCurrentToken(req);
        assert(token);

        const accountID:    number  = token.accountID;
        const orderID:      number  = Common.SysUtils.safeNumber(req.params.orderID);

        if (!orderID) {
            const error = new Error('订单号错误');
            throw error;
        }

        const endDate: number = Common.DateUtils.now();
        await db.orders.cancelOrder(accountID, orderID, endDate);
        res.sendSuccess();
    }

    //GET 获取一个订单信息
    private async getOrderInfo(req: Base.ExpressRequest, res: Base.ExpressResponse): Promise<void> {
        const token: Utils.ApiTypes.AccountInfo = await this.getCurrentToken(req);
        assert(token);

        const accountID:    number  = token.accountID;
        const orderID:      number  = Common.SysUtils.safeNumber(req.params.orderID);

        if (!orderID) {
            const error = new Error('订单号错误');
            throw error;
        }

        const info: Utils.ApiTypes.OrderInfo = await db.orders.getOrderInfo(accountID, orderID);
        res.sendData(info);
    }


    //GET 获取订单列表
    private async queryOrderPageData(req: Base.ExpressRequest, res: Base.ExpressResponse): Promise<void> {
        const token: Utils.ApiTypes.AccountInfo = await this.getCurrentToken(req);
        assert(token);

        const accountID:    number  = token.accountID;

        const sort:         string  = Common.SysUtils.safeString(req.query.sort);
        const desc:         boolean = Common.SysUtils.safeBoolean(req.query.desc);
        const from:         number  = Common.SysUtils.safeNumber(req.query.from);
        const count:        number  = Common.SysUtils.safeNumber(req.query.count);
        const startDate:    number  = Common.SysUtils.safeNumber(req.query.startDate);
        const endDate:      number  = Common.SysUtils.safeNumber(req.query.endDate);

        const result: Utils.ApiTypes.OrderInfoPageData = await db.orders.queryOrderPageData(
            accountID, sort, desc, from, count, startDate, endDate, true);

        res.sendData(result);
    }

    //获取微信支付的收款方名称
    private async getWxpayPayee(req: Base.ExpressRequest, res: Base.ExpressResponse): Promise<void> {
        const token: Utils.ApiTypes.AccountInfo = await this.getCurrentToken(req);
        assert(token);

        const accountID:    number  = token.accountID;

        const wxpayConfigs: Utils.ApiTypes.WxpayConfigs = await db.settings.getWxpayConfigs();
        
        if (!wxpayConfigs) {
            const error = new Error('尚未配置微信支付');
            throw error;
        }

        const data: string = wxpayConfigs.payee;
        res.sendData(data);
    }
}
