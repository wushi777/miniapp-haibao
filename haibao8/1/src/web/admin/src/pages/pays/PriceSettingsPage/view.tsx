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

interface PriceSettingsEvents {
    onChangeState:              (params: any) => void;
    onPromiseGetPriceSettings:  () => void;
    onPromiseSetPriceSettings:  (params: Utils.ApiTypes.DosageUnitPrice) => void; 
}

interface PriceSettingsProps extends FormComponentProps, Reducer.PriceSettingsStates, PriceSettingsEvents {}

class PriceSettingsPage extends React.Component<PriceSettingsProps, any> {
    constructor(props: PriceSettingsProps) {
        super(props);

        Common.CommonFuncs.bindObjectHandleMethods(this);
    }

    public componentDidMount() {
        this.checkOrInit();
    }

    public componentDidUpdate(): void {
        this.checkOrInit();

        if (this.props.error) {
            message.error(this.props.error.message);
            this.props.onChangeState({error: null});
            return;
        }

        if (this.props.setPriceSettingsResult) {
            message.success('保存成功');
            this.props.onChangeState({
                setPriceSettingsResult: false
            });
        }
    }

    public render() {
        const loading = this.props.getPriceSettingsPending;
        const { getFieldDecorator } = this.props.form;

        return (
            <div className="PriceSettings">
                <Spin spinning={loading}>
                    <Form onSubmit={this.handleOk} className="PriceSettings-form">
                        <FormItem label={Consts.PriceSettings.fenPerRoomUser.label}>
                            {getFieldDecorator(Consts.PriceSettings.fenPerRoomUser.name, { 
                                initialValue: this.props.getPriceSettingsResult ? this.props.getPriceSettingsResult.fenPerRoomUser / 100 : 50,

                            })
                                (<Input addonAfter={Consts.PriceSettings.fenPerRoomUser.addonAfter} placeholder={Consts.PriceSettings.fenPerRoomUser.placeholder} />)}
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
                const { fenPerRoomUser } = values;

                const params: Utils.ApiTypes.DosageUnitPrice = {
                    fenPerRoomUser: Number(fenPerRoomUser) * 100
                };

                this.props.onPromiseSetPriceSettings(params);
            }
        });

    }

    private checkOrInit(): void {
        if (!this.props.inited) {
            this.props.onPromiseGetPriceSettings();
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

const mapDispatchToProps = (dispatch: any): PriceSettingsEvents => {
    const events: PriceSettingsEvents = {
        onChangeState: (params: any): void => {
            const action = Actions.changeState(params);
            dispatch(action);
        },

        onPromiseGetPriceSettings: () => {
            const action = Actions.promiseGetPriceSettings();
            dispatch(action);
        },

        onPromiseSetPriceSettings: (params: Utils.ApiTypes.DosageUnitPrice) => {
            const action = Actions.promiseSetPriceSettings(params);
            dispatch(action);
        }

    };

    return events;
};

const WrappedPriceSettings = Form.create()(PriceSettingsPage);

export default connect(mapStateToProps, mapDispatchToProps)(WrappedPriceSettings);