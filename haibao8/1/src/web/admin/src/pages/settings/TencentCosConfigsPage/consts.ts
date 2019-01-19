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

export const TencentCosSetting = {
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

    secretid: {
        label:  'secretid',
        name:   'secretid',
        rules:  [
            {
                required:   false,
                message:    '请输入secretid'
            }
        ],
        placeholder:    'secretid'
    },

    secretkey: {
        label:  'secretkey',
        name:   'secretkey',
        rules:  [
            {
                required:   false,
                message:    '请输入 secretkey'
            }
        ],
        placeholder:    'secretkey'
    },

    bucket: {
        label:  'bucket',
        name:   'bucket',
        rules:  [
            {
                required:   false,
                message:    '请输入 bucket'
            }
        ],
        placeholder:    'bucket'
    },

    region: {
        label:  'region',
        name:   'region',
        rules:  [
            {
                required:   false,
                message:    '请输入 region'
            }
        ],
        placeholder:    'region'
    }
};