export const formItemLayout = {
    labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
    },

    wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
    }
};

export const fields = {
    oldPassword: {
        label: '旧密码',
        name: 'oldPassword',
        rules: [
            {
                required: true,
                message: '请输入密码'
            }
        ],

        type: 'password',
        placeholder: '请输入旧密码'
    },

    newPassword: {
        label: '新密码',
        name: 'newPassword',
        rules: [
            {
                required: true,
                message: '请输入新密码'
            }
        ],
        type: 'password',
        placeholder: '请输入新密码'
    },

    confirmPassword: {
        label: '确认新密码',
        name: 'confirmPassword',
        rules: [
            {
                required: true,
                message: '请再输入一次新密码'
            }
        ],
        type: 'password',
        placeholder: '请再输入一次新密码'
    }
};