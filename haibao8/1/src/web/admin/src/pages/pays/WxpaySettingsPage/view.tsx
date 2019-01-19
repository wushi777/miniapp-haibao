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
    Button 
} from 'antd';

import './style.less';

const FormItem = Form.Item;

interface WxpaySettingsEvents {
    onChangeState:                  (params: any) => void;

    onPromiseGetWeChatPayConfigs:   () => void;
    onPromiseSetWeChatPayConfigs:   (params: Utils.ApiTypes.WxpayConfigs) => void;
}

interface WxpaySettingsProps extends FormComponentProps, Reducer.WxpaySettingsStates, WxpaySettingsEvents {}

class WxpaySettingsPage extends React.Component<WxpaySettingsProps, any> {
    constructor(props: WxpaySettingsProps) {
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

        if (this.props.setWeChatPayConfigsPending) {
            message.success('保存成功');
            this.props.onChangeState({
                setWeChatPayConfigsPending: false
            });
        }
    }

    public render(): React.ReactNode {
        const loading = this.props.getWeChatPayConfigsPending;
        const { getFieldDecorator } = this.props.form;

        return (
            <div className="WxpaySettings">
                <Spin spinning={loading}>
                    <Form onSubmit={this.handleOk} className="WxpaySettings-form">
                        <FormItem label={Consts.WxPaySetting.wxPayAppid.label}>
                            {getFieldDecorator(Consts.WxPaySetting.wxPayAppid.name, { initialValue: this.props.getWeChatPayConfigsResult ? this.props.getWeChatPayConfigsResult.appid : ''})
                            (<Input placeholder={Consts.WxPaySetting.wxPayAppid.placeholder} />)}
                        </FormItem>

                        <FormItem label={Consts.WxPaySetting.wxPayMchID.label}>
                            {getFieldDecorator(Consts.WxPaySetting.wxPayMchID.name, { initialValue: this.props.getWeChatPayConfigsResult ? this.props.getWeChatPayConfigsResult.mch_id : ''})
                            (<Input placeholder={Consts.WxPaySetting.wxPayMchID.placeholder} />)}
                        </FormItem>

                        <FormItem  label={Consts.WxPaySetting.wxPayKey.label}>
                            {getFieldDecorator(Consts.WxPaySetting.wxPayKey.name, { initialValue: this.props.getWeChatPayConfigsResult ? this.props.getWeChatPayConfigsResult.key : ''})
                            (<Input placeholder={Consts.WxPaySetting.wxPayKey.placeholder} />)}
                        </FormItem>

                        <FormItem label={Consts.WxPaySetting.wxPayPayee.label}>
                            {getFieldDecorator(Consts.WxPaySetting.wxPayPayee.name, { initialValue: this.props.getWeChatPayConfigsResult ? this.props.getWeChatPayConfigsResult.payee : ''})
                            (<Input placeholder={Consts.WxPaySetting.wxPayPayee.placeholder}/>)}
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
                const { appid, mch_id, key, payee } = values;

                const params: Utils.ApiTypes.WxpayConfigs = {
                    appid,
                    mch_id,
                    key,
                    payee
                };

                this.props.onPromiseSetWeChatPayConfigs(params);
            }
        });
    }

    private checkOrInit(): void {
        if (!this.props.inited) {
            this.props.onPromiseGetWeChatPayConfigs();
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

const mapDispatchToProps = (dispatch: any): WxpaySettingsEvents => {
    const events: WxpaySettingsEvents = {
        onChangeState: (params: any): void => {
            const action = Actions.changeState(params);
            dispatch(action);
        },

        onPromiseGetWeChatPayConfigs: (): void => {
            const action = Actions.promiseGetWeChatPayConfigs();
            dispatch(action);
        },

        onPromiseSetWeChatPayConfigs: (params: Utils.ApiTypes.WxpayConfigs): void => {
            const action = Actions.promiseSetWeChatPayConfigs(params);
            dispatch(action);
        }
    };

    return events;
};

const WrappedWxpaySettings = Form.create()(WxpaySettingsPage);

export default connect(mapStateToProps, mapDispatchToProps)(WrappedWxpaySettings);