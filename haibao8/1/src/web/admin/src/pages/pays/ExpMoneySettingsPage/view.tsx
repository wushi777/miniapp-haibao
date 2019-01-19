import React                    from 'react';
import { connect }              from 'react-redux';
import { FormComponentProps }   from 'antd/lib/form';

import * as Common              from '../../../common';

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

interface ExpMoneySettingsEvents {
    onChangeState:                  (params: any) => void;
    onPromiseGetDefGiveMoneyFen:    () => void;
    onPromiseSetDefGiveMoneyFen:    (moneyFen: number) => void;
}

interface ExpMoneySettingsProps extends FormComponentProps, Reducer.ExpMoneySettingsStates, ExpMoneySettingsEvents {}

class ExpMoneySettingsPage extends React.Component<ExpMoneySettingsProps, any> {
    constructor(props: ExpMoneySettingsProps) {
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

        if (this.props.setDefGiveMoneyFenPending) {
            message.success('保存成功');
            this.props.onChangeState({
                setDefGiveMoneyFenPending: false
            });
        }
    }

    public render() {
        const loading = this.props.getDefGiveMoneyFenPending;
        const { getFieldDecorator } = this.props.form;
        return (
            <div className="ExpMoneySettings">
                <Spin spinning={loading}>
                    <Form onSubmit={this.handleOk} className="ExpMoneySettings-form">
                        <FormItem label={Consts.ExpMoneySettings.experienceMoneyFen.label}>
                            {getFieldDecorator(Consts.ExpMoneySettings.experienceMoneyFen.name, { initialValue: `${(this.props.getDefGiveMoneyFenResult / 100).toFixed(2)}`})
                                (<Input addonAfter={Consts.ExpMoneySettings.experienceMoneyFen.addonAfter} placeholder={Consts.ExpMoneySettings.experienceMoneyFen.placeholder} />)}
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
                const { defGiveMoneyFen } = values;
                const realDefGiveMoneyFen = defGiveMoneyFen * 100;
                this.props.onPromiseSetDefGiveMoneyFen(realDefGiveMoneyFen);
            }
        });
    }

    private checkOrInit() {
        if (!this.props.inited) {
            this.props.onPromiseGetDefGiveMoneyFen();
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

const mapDispatchToProps = (dispatch: any): ExpMoneySettingsEvents => {
    const events: ExpMoneySettingsEvents = {
        onChangeState: (params: any): void => {
            const action = Actions.changeState(params);
            dispatch(action);
        },

        onPromiseGetDefGiveMoneyFen: (): void => {
            const action = Actions.promiseGetDefGiveMoneyFen();
            dispatch(action);
        },

        onPromiseSetDefGiveMoneyFen: (moneyFen: number): void => {
            const action = Actions.promiseSetDefGiveMoneyFen(moneyFen);
            dispatch(action);
        }
    };
    
    return events;
};

const WrappedExpMoneySettings = Form.create()(ExpMoneySettingsPage);

export default connect(mapStateToProps, mapDispatchToProps)(WrappedExpMoneySettings);