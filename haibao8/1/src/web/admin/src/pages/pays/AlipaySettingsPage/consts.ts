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

export const AlipaySettings = {
    AliAppID: {
        label:  'appID',
        name:   'app_id',
        rules:  [
            {
                required:   false,
                message:    '请输入appID'
            }
        ],
        placeholder:    'appID'
    },

    aliAppPrivateKey: {
        label:  '商户私钥',
        name:   'app_private_key',
        rules:  [
            {
                required:   false,
                message:    '请输入商户私钥'
            }
        ],
        placeholder:    '商户私钥'
    },

    aliAppPublicKey:    {
        label:  '商户公钥',
        name:   'alipay_public_key',
        rules:  [
            {
                required:   false,
                message:    '请输入商户公钥',
            }
        ],
        placeholder:    '商户公钥'
    },

    aliSignType: {
        label:  '加密方式',
        name:   'sign_type',
        rules:  [
            {
                required:   false,
                message:    '请选择加密方式',
            }
        ],
    },

    AlipayGateway: {
        label:  '支付宝网关',
        name:   'alipay_gateway',
        rules:  [
            {
                required:   false,
                message:    '请输入支付宝网关'
            }
        ],
        placeholder:    '支付宝网关'
    }
};