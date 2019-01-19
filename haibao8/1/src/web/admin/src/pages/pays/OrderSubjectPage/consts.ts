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

export const OrderSubject = {
    orderSubjectName:   {
        label:  '商品名称',
        name:   'orderSubject',
        rules: [
            {   
                required:   false,
                message:    '请输入商品名称'
            }
        ],
        placeholder:    '商品名称'
    }

};