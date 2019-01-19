import * as Common      from '../../common';
import * as Utils       from '../../utils';

import * as pays        from '../../pays';
import * as db          from '../../db';

import * as Base        from '../base';

export class PaysApi extends Base.BaseApi {
    protected setupRouter(app: Base.ExpressApp): void {
        //支付相关回调
        app.post('/api/misc/wxpay/notify/:accountID/:orderID',  this.wxpayNotify);
        app.post('/api/misc/alipay/notify/:accountID/:orderID', this.alipayNotify);
        app.get ('/api/misc/alipay/return/:accountID/:orderID', this.alipayReturn);
    }

    //微信支付成功的回调通知
    public async wxpayNotify(req: any, res: Base.ExpressResponse): Promise<void> {
        let xmlString: string = '';

        req.on('data', (trunk) => {
            xmlString += trunk.toString();
        });

        req.on('end', async () => {
            Common.logger.log(Utils.MyTypes.logCats.HttpRequest, 'req.body:', xmlString);

            let return_code:    string = 'FAIL';
            let return_msg:     string = 'ERROR';
            try{
                //logger.log('wxpayNotify:', req.body);

                const accountID:    number  = Common.SysUtils.safeNumber(req.params.accountID);
                const orderID:      number  = Common.SysUtils.safeNumber(req.params.orderID);

                const wxpayConfigs: Utils.ApiTypes.WxpayConfigs = await db.settings.getWxpayConfigs();
                const data: any = await pays.wxpay.parseWxpayNotify(wxpayConfigs, xmlString);

                const orderInfo: Utils.ApiTypes.OrderInfo = await db.orders.getOrderInfo(accountID, orderID);
                if (!orderInfo){
                    const error = new Error('Order Not Found');
                    throw error;
                }

                if (orderInfo.out_trade_no !== data.out_trade_no){
                    const error = new Error('out_trade_no error');
                    throw error;
                }

                if (orderInfo.orderMoneyFen !== data.total_fee){
                    const error = new Error('total_fee error');
                    throw error;
                }

                if (orderInfo.orderStatus !== 1){
                    const transactionID = data.transaction_id;
                    const endDate = Common.DateUtils.now();

                    await db.orders.completeOrder(accountID, orderID, transactionID, endDate, 
                        orderInfo.orderMoneyFen);
                }

                return_code = 'SUCCESS';
                return_msg  = 'OK';
            }catch(err){
                return_msg = err.message;
            }

            const returnText: string = pays.wxpay.makeWxpayNotifyReturnText(return_code, return_msg);

            res.setHeader('content-type', 'application/xml; charset=utf-8');
            res.send(returnText);
        });
    }

    private async processAlipayReturnOrNotify(accountID: number, orderID: number, params: any): Promise<void> {
        const orderInfo: Utils.ApiTypes.OrderInfo = await db.orders.getOrderInfo(accountID, orderID);

        if (!orderInfo) {
            const error = new Error('订单没找到');
            throw error;
        }

        if (orderInfo.orderMoneyFen !== Math.round(parseFloat(params.total_amount) * 100)) {
            const error = new Error('total_amount 非法');
            throw error;
        }

        if (orderInfo.out_trade_no != params.out_trade_no) {
            const error = new Error('out_trade_no 非法');
            throw error;
        }

        const alipayConfigs: Utils.ApiTypes.AlipayConfigs = await db.settings.getAlipayConfigs();

        const bOk: boolean = pays.alipay.verify(alipayConfigs, params, false, params.sign, params.sign_type);
        if (!bOk){
            const error = new Error('验签失败');
            throw error;
        }

        if (orderInfo.orderStatus !== 1) {
            const endDate:          number = Common.DateUtils.now();
            const transaction_id:   string = params.trade_no;
            
            await db.orders.completeOrder(accountID, orderID, transaction_id, endDate, 
                orderInfo.orderMoneyFen);
        }
    }

    //阿里支付的return_url跳转
    public async alipayReturn(req: Base.ExpressRequest, res: Base.ExpressResponse): Promise<void> {
        Common.logger.log(Utils.MyTypes.logCats.HttpRequest, 'alipayReturn:', req.query);

        const accountID:    number  = Common.SysUtils.safeNumber(req.params.accountID);
        const orderID:      number  = Common.SysUtils.safeNumber(req.params.orderID);

        const params = req.query;

        await this.processAlipayReturnOrNotify(accountID, orderID, params);

        const orderInfo: Utils.ApiTypes.OrderInfo = await db.orders.getOrderInfo(accountID, orderID);
        res.redirect(orderInfo.return_url);
    }

    //阿里支付的通知回调
    public async alipayNotify(req: Base.ExpressRequest, res: Base.ExpressResponse): Promise<void> {
        try {
            Common.logger.log(Utils.MyTypes.logCats.HttpRequest, 'alipayNotify:', req.body);
        
            const accountID:    number  = Common.SysUtils.safeNumber(req.params.accountID);
            const orderID:      number  = Common.SysUtils.safeNumber(req.params.orderID);

            const params = req.body;

            await this.processAlipayReturnOrNotify(accountID, orderID, params);

            res.send('success');
        } catch(err) {
            Common.logger.error(err);
            res.send('fail');
        }
    }
}