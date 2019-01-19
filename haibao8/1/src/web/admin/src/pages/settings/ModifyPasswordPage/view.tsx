import React                    from 'react';
import { connect }              from 'react-redux';
import { FormComponentProps }   from 'antd/lib/form';

import * as Common              from '../../../common';

import * as Actions             from './actions';
import * as ActionTypes         from './actionTypes';
import * as Consts              from './consts';
import * as Reducer             from './reducer';

import { 
    Button, 
    message, 
    Input, 
    Form 
} from 'antd';

import './style.less';

const FormItem = Form.Item;

interface ModifyPasswordEvents {
    onChangeState: (params: any) => void;

    onPromiseModifyPassword: (
        oldPassword: string, 
        newPassword: string
    ) => void;
}

interface ModifyPasswordProps extends FormComponentProps, Reducer.ModifyPasswordStates, ModifyPasswordEvents {}

class ModifyPasswordPage extends React.Component< ModifyPasswordProps, any> {
    constructor(props:  ModifyPasswordProps) {
        super(props);

        Common.CommonFuncs.bindObjectHandleMethods(this);
    }
    
    // 更新
    public componentDidUpdate(): void {
        if (this.props.modifyPasswordResult) {
            message.success('更改密码成功');

            // 重置state
            this.props.onChangeState({
                modifyPasswordResult: null
            });

            // 重置表单
            this.props.form.resetFields();
        }
        
        if (this.props.error) {
            message.error(this.props.error.message);
            this.props.onChangeState({error: null});
            return;
        }         
    }

    public render(): React.ReactNode {
        const { getFieldDecorator } = this.props.form;
        
        return (
            <div className="modify-password">
                <Form onSubmit={this.handleSubmit} className="modify-password-form">
                    <FormItem label={Consts.fields.oldPassword.label}>
                        {
                            getFieldDecorator(Consts.fields.oldPassword.name, {
                                rules: Consts.fields.oldPassword.rules
                            })(
                                <Input 
                                    type={Consts.fields.oldPassword.type}  
                                    placeholder={Consts.fields.oldPassword.placeholder}
                                />
                            )
                        }
                    </FormItem>

                    <FormItem label={Consts.fields.newPassword.label}>
                        {
                            getFieldDecorator(Consts.fields.newPassword.name, {
                                rules: [
                                    Consts.fields.newPassword.rules[0], 
                                    { validator: this.handleValidateNewPassword }
                                ]
                            })(
                                <Input 
                                    type={Consts.fields.newPassword.type}  
                                    placeholder={Consts.fields.newPassword.placeholder}
                                />
                            )
                        }
                    </FormItem>

                    <FormItem  label={Consts.fields.confirmPassword.label}>
                        {
                            getFieldDecorator(Consts.fields.confirmPassword.name, {
                                rules: [
                                    Consts.fields.confirmPassword.rules[0], 
                                    { validator: this.handleValidateReNewPassword }
                                ]
                            })(
                                <Input 
                                    type={Consts.fields.confirmPassword.type} 
                                    placeholder={Consts.fields.confirmPassword.placeholder}
                                />
                            )
                        }
                    </FormItem>

                    <FormItem>
                        <Button 
                            className="confirmBtn" 
                            type="primary" 
                            htmlType="submit"
                        >
                            确认修改
                        </Button>
                    </FormItem>
                </Form>
            </div>
        );
    }

    // 处理表单提交
    private handleSubmit = (e): void => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                const { oldPassword, newPassword } = values;
                this.props.onPromiseModifyPassword(oldPassword, newPassword);
            }
        });
    }
    
    // 验证新密码
    private handleValidateNewPassword(rule: any, value: string, callback: Function): void {
        const confirmPassword: string = this.props.form.getFieldValue('confirmPassword');

        if (value && confirmPassword) {
            if (value !== confirmPassword) {
                callback('两次密码输入不一致');
            } else {
                this.props.form.setFieldsValue({
                    confirmPassword
                });
                
                callback();
            }
        } else {
            callback();
        }
    }

    // 验证重复输入的新密码
    private handleValidateReNewPassword(rule: any, value: string, callback: Function): void {
        const newPassword: string = this.props.form.getFieldValue('newPassword');

        if (value && newPassword) {
            if (value !== newPassword) {
                callback('两次密码输入不一致');
            } else {
                this.props.form.setFieldsValue({
                    newPassword
                });
                
                callback();
            }
        } else {
            callback();
        }
    }
}

const mapStateToProps = (state: Reducer.ModifyPasswordStates) => {
    const props = Common.ReducerTool.Funcs.mapStateToProps(state, ActionTypes.stateKey);
    return props;
};

const mapDispatchToProps = (dispatch: any, ownProps:  ModifyPasswordProps) => {
    const events: ModifyPasswordEvents = {
        onChangeState: (params: any): void => {
            const action = Actions.changeState(params);
            dispatch(action);
        },

        onPromiseModifyPassword: (oldPassword: string, newPassword: string): void => {
            const action = Actions.promiseModifyPassword(oldPassword, newPassword);
            dispatch(action);
        }

    };
    return events;
};

const WrappedModifyPassword = Form.create()(ModifyPasswordPage);
export default connect(mapStateToProps, mapDispatchToProps)(WrappedModifyPassword);