import * as Common  from '../common';
import * as Utils   from '../utils';
import * as Pays    from '../pays';

import { BaseDB }   from './BaseDB';
import { DBConsts } from './DBConsts';
import settings     from './SettingsDB';
import accounts     from './AccountsDB';

class OrdersDB extends BaseDB {
    get tableName(): string {
        return DBConsts.tables.ordersTable;
    }

    get docKey(): string {
        return DBConsts.docKeys.orderID;
    }

    public async getOrderInfo(accountID: number, orderID: number): Promise<Utils.ApiTypes.OrderInfo> {
        const filter: any = {
            accountID,
            orderID
        };

        const info: Utils.ApiTypes.OrderInfo = await this.queryFindOne(filter);

        return info;
    }

    public async createOrder(accountID: number, orderMoneyFen: number): Promise<number> {
        const createDate:       number  = Common.DateUtils.now();
        const createDateObj:    Date    = new Date(createDate);
        const orderSubject:     string  = await settings.getOrderSubject();

        const doc: Utils.ApiTypes.OrderInfo = {
            orderID:        0,
            accountID,
            orderSubject,
            orderMoneyFen,
            out_trade_no:   '',
            transaction_id: '',
            createDate,
            createDateObj,
            endDate:        0,
            endDateObj:     new Date(0),
            orderStatus:    0,
            payMethod:      0,
            return_url:     ''
        };
        
        const orderID: number = await this.queryInsertOne(doc);

        return orderID;
    }

    public async changeOrderPayMethod(
        accountID:      number, 
        orderID:        number, 
        payMethod:      number, 
        out_trade_no:   string, 
        return_url:     string
    ): Promise<void> {
        const filter = {
            orderID,
            accountID
        };

        const update = {
            $set: {
                payMethod,
                out_trade_no,
                return_url
            }
        };

        await this.queryUpdate(filter, update);
    }

    public async completeOrder(
        accountID:      number, 
        orderID:        number, 
        transaction_id: string, 
        endDate:        number,
        orderMoneyFen:  number
    ): Promise<void> {
        await accounts.incAccountRemainMoneyFen(accountID, orderMoneyFen);

        const filter = {
            orderID,
            accountID,
        };

        const endDateObj: Date = new Date(endDate);

        const update = {
            $set: {
                orderStatus:    1,
                transaction_id,
                endDate,
                endDateObj
            }
        };

        await this.queryUpdate(filter, update);
    }

    public async cancelOrder(accountID: number, orderID: number, endDate: number): Promise<void> {
        const filter = {
            orderID,
            accountID
        };

        const endDateObj: Date = new Date(endDate);

        const update = {
            $set: {
                orderStatus: 2,
                endDate,
                endDateObj
            }
        };

        await this.queryUpdate(filter, update);
    }

    public async queryOrderPageData(
        accountID:              number, 
        sort:                   string, 
        desc:                   boolean,
        from:                   number, 
        count:                  number, 
        startDate:              number, 
        endDate:                number,
        needQueryAccountInfo:   boolean
    ): Promise<Utils.ApiTypes.OrderInfoPageData> {
        const filter: any = {};

        if (accountID){
            filter.accountID = accountID;
        }

        if (startDate || endDate) {
            filter.createDate = {};
            if (startDate) {
                filter.createDate['$gte']   = startDate;
            }

            if (endDate) {
                filter.createDate['$lte']   = endDate;
            }
        }

        const total: number = await this.queryCount(filter);
        const data: Utils.ApiTypes.OrderInfo[]   = await this.queryFindEx(filter, sort, desc, from, count);

        const result: Utils.ApiTypes.OrderInfoPageData = {
            total,
            data
        };

        if (needQueryAccountInfo) {
            const accountsMap: Map<number, Utils.ApiTypes.AccountInfo> = new Map();

            for (const item of result.data) {
                const accountID: number = item.accountID;

                let accountInfo: Utils.ApiTypes.AccountInfo = accountsMap.get(accountID);
                if (!accountInfo) {
                    accountInfo = await accounts.getAccountInfoByAccountID(accountID);
                    if (accountInfo) {
                        accountsMap.set(accountID, accountInfo);
                    }
                }

                // if (accountInfo) {
                //     item.accountName = accountInfo.accountName;
                //     item.companyName = accountInfo.companyName;
                // }
            }
        }

        return result;
    }

    //获取微信支付URL
    public async getOrderWxpayCodeUrl(accountID: number, orderID: number): Promise<string> {
        const orderInfo: Utils.ApiTypes.OrderInfo = await this.getOrderInfo(accountID, orderID);
        if (!orderInfo){
            const error = new Error('orderID 错误');
            throw error;
        }

        if (orderInfo.orderStatus === 1){
            const error = new Error('订单已支付');
            throw error;
        } else if (orderInfo.orderStatus === 2){
            const error = new Error('订单已取消');
            throw error;
        }

        // const extendInfo = {
        //     accountID,
        //     orderID
        // };

        const body:         string  = orderInfo.orderSubject;
        const out_trade_no: string  = Pays.PayUtils.makeOutTradeNo();
        const product_id:   string  = '1';
        const total_fee:    number  = orderInfo.orderMoneyFen;
        const notify_url:   string  = `${Utils.configs.serverUrl}/api/misc/wxpay/notify/${accountID}/${orderID}`;

        const wxpayConfigs: Utils.ApiTypes.WxpayConfigs = await settings.getWxpayConfigs();

        //调用微信的统一下单
        const code_url: string = await Pays.wxpay.unifiedOrder(wxpayConfigs, body, 
            out_trade_no, product_id, total_fee, notify_url);
        
        //设置订单的支付方式为微信支付
        this.changeOrderPayMethod(accountID, orderID, 1, out_trade_no, '');

        const url: string = `${Utils.configs.serverUrl}/api/misc/qrcode?url=${code_url}`;
        return url;
    }

    //获取支付宝支付URL
    public async getOrderAlipayPayUrl(accountID: number, orderID: number, return_url: string): Promise<string> {
        const orderInfo: Utils.ApiTypes.OrderInfo = await this.getOrderInfo(accountID, orderID);
        if (!orderInfo) {
            const error = new Error('orderID 错误');
            throw error;
        }

        if (orderInfo.orderStatus === 1){
            const error = new Error('订单已支付');
            throw error;
        } else if (orderInfo.orderStatus === 2){
            const error = new Error('订单已取消');
            throw error;
        }

        const out_trade_no: string  = Pays.PayUtils.makeOutTradeNo();         //订单号
        const total_amount: number  = orderInfo.orderMoneyFen / 100; //金额(元)
        const subject:      string  = orderInfo.orderSubject;

        const passback_params = {
            accountID,
            orderID
        };

        const notify_url:       string  = `${Utils.configs.serverUrl}/api/misc/alipay/notify/${accountID}/${orderID}`;
        const real_return_url:  string  = `${Utils.configs.serverUrl}/api/misc/alipay/return/${accountID}/${orderID}`;

        const alipayConfigs: Utils.ApiTypes.AlipayConfigs = await settings.getAlipayConfigs(); 

        //调用支付宝的电脑支付
        const result: string = await Pays.alipay.pagePay(
            alipayConfigs, 
            out_trade_no, 
            total_amount, 
            subject, 
            passback_params, 
            notify_url, 
            real_return_url
        );

        //调用支付宝的预下单接口获取支付链接,用以生成二维码(当面付)
        //const result = await alipay.precreate(alipayConfigs, out_trade_no, total_amount, subject, notify_url);

        //设置订单的支付方式为支付宝支付
        this.changeOrderPayMethod(accountID, orderID, 2, out_trade_no, return_url);

        return result;
    } 

    //给指定的帐号赠送金钱
    async giveMoneyToAccount(accountID: number, orderMoneyFen: number): Promise<void> {
        //为该帐号创建一个订单
        const orderID: number = await this.createOrder(accountID, orderMoneyFen);

        const orderInfo: Utils.ApiTypes.OrderInfo = await this.getOrderInfo(accountID, orderID);

        //修改该订单的支付方式为赠送
        await this.changeOrderPayMethod(accountID, orderInfo.orderID, 3, '', '');

        //完成该订单
        const endDate: number = Common.DateUtils.now();
        await this.completeOrder(accountID, orderInfo.orderID, '', endDate, orderInfo.orderMoneyFen);
    }
}

export default new OrdersDB();