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

interface WxappConfigsEvents {
    onChangeState:              (params: any) => void;

    onPromiseGetWxappConfigs:   () => void;
    onPromiseSetWxappConfigs:   (params: Utils.ApiTypes.WxappConfigs) => void;
}

interface WxappConfigsProps extends FormComponentProps, Reducer.WxappConfigsStates, WxappConfigsEvents {}

class WxappConfigsPage extends React.Component<WxappConfigsProps, any> {
    constructor(props: WxappConfigsProps) {
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

        if (this.props.setWxappConfigsPending) {
            message.success('保存成功');
            this.props.onChangeState({
                setWxappConfigsPending: false
            });
        }
    }

    public render(): React.ReactNode {
        const loading = this.props.getWxappConfigsPending;
        const { getFieldDecorator } = this.props.form;
        
        return (
            <div className="WxappConfigs">
                <Spin spinning={loading}>
                    <Form onSubmit={this.handleOk} className="WxappConfigs-form">
                        <FormItem label={Consts.WxappSetting.appid.label}>
                            {getFieldDecorator(Consts.WxappSetting.appid.name, { initialValue: this.props.getWxappConfigsResult ? this.props.getWxappConfigsResult.appid : ''})
                            (<Input placeholder={Consts.WxappSetting.appid.placeholder} />)}
                        </FormItem>

                        <FormItem label={Consts.WxappSetting.appsecret.label}>
                            {getFieldDecorator(Consts.WxappSetting.appsecret.name, { initialValue: this.props.getWxappConfigsResult ? this.props.getWxappConfigsResult.appsecret : ''})
                            (<Input placeholder={Consts.WxappSetting.appsecret.placeholder} />)}
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
                const { appid, appsecret } = values;

                const params: Utils.ApiTypes.WxappConfigs = {
                    appid,
                    appsecret
                };

                this.props.onPromiseSetWxappConfigs(params);
            }
        });
    }

    private checkOrInit(): void {
        if (!this.props.inited) {
            this.props.onPromiseGetWxappConfigs();
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

const mapDispatchToProps = (dispatch: any): WxappConfigsEvents => {
    const events: WxappConfigsEvents = {
        onChangeState: (params: any): void => {
            const action = Actions.changeState(params);
            dispatch(action);
        },

        onPromiseGetWxappConfigs: (): void => {
            const action = Actions.promiseGetWxappConfigs();
            dispatch(action);
        },

        onPromiseSetWxappConfigs: (params: Utils.ApiTypes.WxappConfigs): void => {
            const action = Actions.promiseSetWxappConfigs(params);
            dispatch(action);
        }
    };

    return events;
};

const WrappedWxappConfigs = Form.create()(WxappConfigsPage);

export default connect(mapStateToProps, mapDispatchToProps)(WrappedWxappConfigs);