import React                    from 'react';
import { FormComponentProps }   from 'antd/lib/form';

import * as Utils               from '../../../../utils';
import * as Common              from '../../../../common';

import { 
    Button, 
    Form, 
    Icon, 
    Input 
} from 'antd';

interface LoginFormProps extends FormComponentProps {
    onLogin?:   (adminName: string, password: string) => void;    // 登录
    loading:    boolean;
}

interface FormValues {
    adminName:  string;
    password:   string;
}

// 定义组件用到的常量
const Constant: any = {
    UserPrefix: <Icon type="user" />,

    PassPrefix: <Icon type="lock" />,

    UserRules: [ { required: true, message: '请输入管理员名' } ],

    PassRules: [ { required: false, message: '请输入密码' } ]
};

class LoginForm extends React.PureComponent<LoginFormProps, any> {
    constructor(props: LoginFormProps) {
        super(props);

        Common.CommonFuncs.bindObjectHandleMethods(this);
    }

    public render(): React.ReactNode {
        const { getFieldDecorator } = this.props.form;

        return (
            <Form onSubmit={this.handleSubmit} className="login-form">
                <Form.Item>
                    {getFieldDecorator('adminName', {
                        rules:          Constant.UserRules,
                        initialValue:   Utils.storage.adminName
                    })(
                        <Input prefix={Constant.UserPrefix} placeholder="管理员名" />
                    )}
                </Form.Item>

                <Form.Item>
                    {getFieldDecorator('password', {
                        rules: Constant.PassRules
                    })(
                        <Input prefix={Constant.PassPrefix} type="password" placeholder="密码" />
                    )}
                </Form.Item>
                
                <Form.Item>
                    <Button type="primary" htmlType="submit" loading={this.props.loading} className="login-form-button">
                        登录
                    </Button>
                </Form.Item>
            </Form>
        );
    }

    // 登录
    private handleSubmit(e: any): void {
        e.preventDefault();

        this.props.form.validateFields((err: any, values: FormValues) => {
            if (!err) {
                Utils.storage.adminName = values.adminName;

                const { adminName, password } = values;

                if (this.props.onLogin) {
                    this.props.onLogin(adminName, password);
                }
            }
        });
    }
}

const WrappedLoginForm = Form.create()(LoginForm);

export default WrappedLoginForm;