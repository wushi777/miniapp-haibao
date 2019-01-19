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

export const WxappSetting = {
    appid: {
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

    appsecret: {
        label:  'appsecret',
        name:   'appsecret',
        rules:  [
            {
                required:   false,
                message:    '请输入appsecret'
            }
        ],
        placeholder:    'appsecret'
    }
};