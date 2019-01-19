export const formItemLayout = {
    labelCol: {
        xs: { span: 24 },
        sm: { span: 3 },
    },
    wrapperCol: {
        xs: { span: 24 },
        sm: { span: 10 },
    },
};
export const tailFormItemLayout = {
    wrapperCol: {
        xs: {
            span: 24,
            offset: 0,
        },
        sm: {
            span: 16,
            offset: 3,
        },
    },
};

export const WxPaySetting = {
    wxPayAppid: {
        label:  'appid',
        name:   'appid',
        rules:  [
            {
                required:   false,
                message:    '请输入appid'
            }
        ],
        placeholder:    'appid'
    },

    wxPayMchID: {
        label:  '微信支付商户号',
        name:   'mch_id',
        rules:  [
            {
                required:   false,
                message:    '请输入微信支付商户号'
            }
        ],
        placeholder:    '微信支付商户号'
    },

    wxPayKey: {
        label:  'API秘钥',
        name:   'key',
        rules:  [
            {
                required:   false,
                message:    '请输入API秘钥'
            }
        ],
        placeholder:    'API秘钥'
    },

    wxPayPayee: {
        label:  '收款方名称',
        name:   'payee',
        rules:  [
            {
                required:   false,
                message:    '请输入收款方名称'
            }
        ],
        placeholder:    '收款方名称'
    }

};