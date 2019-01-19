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

interface TencentCosConfigsEvents {
    onChangeState:                  (params: any) => void;

    onPromiseGetTencentCosConfigs:  () => void;
    onPromiseSetTencentCosConfigs:  (params: Utils.ApiTypes.TencentCosConfigs) => void;
}

interface TencentCosConfigsProps extends FormComponentProps, Reducer.TencentCosConfigsStates, TencentCosConfigsEvents {}

class TencentCosConfigsPage extends React.Component<TencentCosConfigsProps, any> {
    constructor(props: TencentCosConfigsProps) {
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

        if (this.props.setTencentCosConfigsPending) {
            message.success('保存成功');
            this.props.onChangeState({
                setTencentCosConfigsPending: false
            });
        }
    }

    public render(): React.ReactNode {
        const loading = this.props.getTencentCosConfigsPending;
        const { getFieldDecorator } = this.props.form;
        
        return (
            <div className="TencentCosConfigs">
                <Spin spinning={loading}>
                    <Form onSubmit={this.handleOk} className="TencentCosConfigs-form">
                        <FormItem label={Consts.TencentCosSetting.appid.label}>
                            {getFieldDecorator(Consts.TencentCosSetting.appid.name, { initialValue: this.props.getTencentCosConfigsResult ? this.props.getTencentCosConfigsResult.appid : ''})
                            (<Input placeholder={Consts.TencentCosSetting.appid.placeholder} />)}
                        </FormItem>

                        <FormItem label={Consts.TencentCosSetting.secretid.label}>
                            {getFieldDecorator(Consts.TencentCosSetting.secretid.name, { initialValue: this.props.getTencentCosConfigsResult ? this.props.getTencentCosConfigsResult.secretid : ''})
                            (<Input placeholder={Consts.TencentCosSetting.secretid.placeholder} />)}
                        </FormItem>

                        <FormItem label={Consts.TencentCosSetting.secretkey.label}>
                            {getFieldDecorator(Consts.TencentCosSetting.secretkey.name, { initialValue: this.props.getTencentCosConfigsResult ? this.props.getTencentCosConfigsResult.secretkey : ''})
                            (<Input placeholder={Consts.TencentCosSetting.secretkey.placeholder} />)}
                        </FormItem>

                        <FormItem label={Consts.TencentCosSetting.bucket.label}>
                            {getFieldDecorator(Consts.TencentCosSetting.bucket.name, { initialValue: this.props.getTencentCosConfigsResult ? this.props.getTencentCosConfigsResult.bucket : ''})
                            (<Input placeholder={Consts.TencentCosSetting.bucket.placeholder} />)}
                        </FormItem>

                        <FormItem label={Consts.TencentCosSetting.region.label}>
                            {getFieldDecorator(Consts.TencentCosSetting.region.name, { initialValue: this.props.getTencentCosConfigsResult ? this.props.getTencentCosConfigsResult.region : ''})
                            (<Input placeholder={Consts.TencentCosSetting.region.placeholder} />)}
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
                const { appid, secretid, secretkey, bucket, region } = values;

                const params: Utils.ApiTypes.TencentCosConfigs = {
                    appid,
                    secretid,
                    secretkey,
                    bucket,
                    region
                };

                this.props.onPromiseSetTencentCosConfigs(params);
            }
        });
    }

    private checkOrInit(): void {
        if (!this.props.inited) {
            this.props.onPromiseGetTencentCosConfigs();
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

const mapDispatchToProps = (dispatch: any): TencentCosConfigsEvents => {
    const events: TencentCosConfigsEvents = {
        onChangeState: (params: any): void => {
            const action = Actions.changeState(params);
            dispatch(action);
        },

        onPromiseGetTencentCosConfigs: (): void => {
            const action = Actions.promiseGetTencentCosConfigs();
            dispatch(action);
        },

        onPromiseSetTencentCosConfigs: (params: Utils.ApiTypes.TencentCosConfigs): void => {
            const action = Actions.promiseSetTencentCosConfigs(params);
            dispatch(action);
        }

    };

    return events;
};

const WrappedTencentCosConfigs = Form.create()(TencentCosConfigsPage);

export default connect(mapStateToProps, mapDispatchToProps)(WrappedTencentCosConfigs);