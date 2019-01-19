export const formItemLayout = {
    labelCol: {
        xs: { span: 12 },
        sm: { span: 3 },
    },
    wrapperCol: {
        xs: { span: 12 },
        sm: { span: 21 },
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

export const ExpMoneySettings = {
    experienceMoneyFen: {
        label:  '新用户体验金额',
        name:   'defGiveMoneyFen',
        rules:  [
            {
                required:   false,
                message:    '新用户体验金额'
            }
        ],
        addonAfter:     '元',
        placeholder:    '请输入新用户体验金额'
    }
};