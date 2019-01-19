export const formItemLayout = {
    labelCol: {
        xs: { span: 24 },
        sm: { span: 2 },
    },
    wrapperCol: {
        xs: { span: 24 },
        sm: { span: 22 },
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
            offset: 2,
        },
    },
};

export const PriceSettings = {
    fenPerRoomUser:   {
        label:  '计费标准',
        name:   'fenPerRoomUser',
        rules: [
            {   
                required:   false,
                message:    '请输入计费标准'
            }
        ],
        addonAfter:     '元 / 用户分钟',
        placeholder:    '计费标准'
    }

};