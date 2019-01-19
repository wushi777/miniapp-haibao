import React                    from 'react';
import { connect }              from 'react-redux';
import { FormComponentProps }   from 'antd/lib/form';

import * as Common              from '../../../common';
import * as Utils               from '../../../utils';

import * as Actions             from './actions';
import * as Consts              from './consts';
import * as ActionTypes         from './actionTypes';
import * as Reducer             from './reducer';

import { 
    Form, 
    message, 
    Spin, 
    Input, 
    Radio, 
    Button 
} from 'antd';

import './style.less';

const FormItem      = Form.Item;
const RadioButton   = Radio.Button;
const RadioGroup    = Radio.Group;
const { TextArea }  = Input;

interface AlipaySettingsEvents {
    onChangeState:                  (params: any) => void;
    onPromiseGetAlipayConfigs:      () => void;
    onPromiseSetAlipayConfigs:      (params: Utils.ApiTypes.AlipayConfigs) => void;
}

interface AlipaySettingsProps extends FormComponentProps, Reducer.AlipaySettingsStates, AlipaySettingsEvents {}

class AlipaySettingsPage extends React.Component<AlipaySettingsProps, any> {
    constructor(props: AlipaySettingsProps) {
        super(props);

        Common.CommonFuncs.bindObjectHandleMethods(this);
    }

    public componentDidMount(): void {
        this.checkOrInit();
    }

    public componentDidUpdate(): void {
        this.checkOrInit();

        if (this.props.error) {
            message.error(this.props.error.message);
            this.props.onChangeState({error: null});
            return;
        }

        if (this.props.setAlipayConfigsPending) {
            message.success('保存成功');
            this.props.onChangeState({
                setAlipayConfigsPending: false
            });
        }
    }

    public render(): React.ReactNode {
        const loading = this.props.getAlipayConfigsPending;
        const { getFieldDecorator } = this.props.form;
        
        return (
            <div className="AlipaySettings">
                <Spin spinning={loading}>
                    <Form onSubmit={this.handleOk} className="AlipaySettings-form">
                        <FormItem label={Consts.AlipaySettings.AliAppID.label}>
                            {getFieldDecorator(Consts.AlipaySettings.AliAppID.name, { 
                                initialValue: this.props.getAlipayConfigsResult ? this.props.getAlipayConfigsResult.app_id : '',
                                rules: Consts.AlipaySettings.AliAppID.rules
                            })
                                (<Input placeholder={Consts.AlipaySettings.AliAppID.placeholder} />)}
                        </FormItem>

                        <FormItem  label={Consts.AlipaySettings.aliAppPrivateKey.label}>
                            {getFieldDecorator(Consts.AlipaySettings.aliAppPrivateKey.name, { 
                                initialValue: this.props.getAlipayConfigsResult ? this.props.getAlipayConfigsResult.app_private_key : '',
                                rules: Consts.AlipaySettings.aliAppPrivateKey.rules
                            })
                                (<TextArea rows={10} placeholder={Consts.AlipaySettings.aliAppPrivateKey.placeholder} />)}
                        </FormItem>

                        <FormItem  label={Consts.AlipaySettings.aliAppPublicKey.label}>
                            {getFieldDecorator(Consts.AlipaySettings.aliAppPublicKey.name, { 
                                initialValue: this.props.getAlipayConfigsResult ? this.props.getAlipayConfigsResult.alipay_public_key : '',
                                rules: Consts.AlipaySettings.aliAppPrivateKey.rules
                            })
                                (<TextArea rows={8} placeholder={Consts.AlipaySettings.aliAppPublicKey.name} />)}
                        </FormItem>

                        <FormItem  label={Consts.AlipaySettings.aliSignType.label}>
                            {getFieldDecorator(Consts.AlipaySettings.aliSignType.name, { 
                                initialValue: this.props.getAlipayConfigsResult ? this.props.getAlipayConfigsResult.sign_type : 'RSA'
                            })(
                                <RadioGroup>
                                    <RadioButton value="RSA">RSA</RadioButton>
                                    <RadioButton value="RSA2">RSA2</RadioButton>
                                </RadioGroup>
                            )}
                        </FormItem>

                        <FormItem  label={Consts.AlipaySettings.AlipayGateway.label}>
                            {getFieldDecorator(Consts.AlipaySettings.AlipayGateway.name, { 
                                initialValue: this.props.getAlipayConfigsResult ? this.props.getAlipayConfigsResult.alipay_gateway : '',
                                rules: Consts.AlipaySettings.AlipayGateway.rules
                            })
                                (<Input placeholder={Consts.AlipaySettings.AlipayGateway.placeholder} />)}
                        </FormItem>
                        <FormItem >
                            <Button
                                type="primary"
                                htmlType="submit"
                                icon="check"
                                title="保存"
                            >保存
                            </Button>
                        </FormItem>
                    </Form>
                </Spin>
            </div>
        );
    }

    private handleOk(e: any): void {
        e.preventDefault();
        const form = this.props.form;
        form.validateFields((err, values) => {
            if (!err) {
                const { app_id, app_private_key, alipay_public_key, sign_type, alipay_gateway } = values;
                const params: Utils.ApiTypes.AlipayConfigs = {
                    app_id,
                    app_private_key,
                    alipay_public_key,
                    sign_type,
                    alipay_gateway
                };
                this.props.onPromiseSetAlipayConfigs(params);
            }
        });
    }

    private checkOrInit(): void {
        if (!this.props.inited) {
            this.props.onPromiseGetAlipayConfigs();
            this.props.onChangeState({
                inited: true
            });
        }
    }
}

const mapStateToProps = (state) => {
    const props = Common.ReducerTool.Funcs.mapStateToProps(state, ActionTypes.stateKey);
    return props;
};

const mapDispatchToProps = (dispatch: any): AlipaySettingsEvents => {
    const events: AlipaySettingsEvents = {
        onChangeState: (params: any): void => {
            const action = Actions.changeState(params);
            dispatch(action);
        },

        onPromiseGetAlipayConfigs: () => {
            const action = Actions.promiseGetAlipayConfigs();
            dispatch(action);
        },

        onPromiseSetAlipayConfigs: (params: Utils.ApiTypes.AlipayConfigs) => {
            const action = Actions.promiseSetAlipayConfigs(params);
            dispatch(action);
        }

    };

    return events;
};

const WrappedAlipaySettings = Form.create()(AlipaySettingsPage);

export default connect(mapStateToProps, mapDispatchToProps)(WrappedAlipaySettings);