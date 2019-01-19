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

interface OrderSubjectEvents {
    onChangeState:              (params: any) => void;
    onPromiseGetOrderSubject:  () => void;
    onPromiseSetOrderSubject:  (orderSubject: string) => void; 
}

interface OrderSubjectProps extends FormComponentProps, Reducer.OrderSubjectStates, OrderSubjectEvents {}

class OrderSubjectPage extends React.Component<OrderSubjectProps, any> {
    constructor(props: OrderSubjectProps) {
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

        if (this.props.setOrderSubjectResult) {
            message.success('保存成功');
            this.props.onChangeState({
                setOrderSubjectResult: false
            });
        }
    }

    public render() {
        const loading = this.props.getOrderSubjectPending;
        const { getFieldDecorator } = this.props.form;

        return (
            <div className="OrderSubject">
                <Spin spinning={loading}>
                    <Form onSubmit={this.handleOk} className="OrderSubject-form">
                        <FormItem label={Consts.OrderSubject.orderSubjectName.label}>
                            {getFieldDecorator(Consts.OrderSubject.orderSubjectName.name, { 
                                initialValue: this.props.getOrderSubjectResult ? this.props.getOrderSubjectResult : '',

                            })
                                (<Input placeholder={Consts.OrderSubject.orderSubjectName.placeholder} />)}
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
                const { orderSubject } = values;
                this.props.onPromiseSetOrderSubject(orderSubject);
            }
        });

    }

    private checkOrInit(): void {
        if (!this.props.inited) {
            this.props.onPromiseGetOrderSubject();
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

const mapDispatchToProps = (dispatch: any): OrderSubjectEvents => {
    const events: OrderSubjectEvents = {
        onChangeState: (params: any): void => {
            const action = Actions.changeState(params);
            dispatch(action);
        },

        onPromiseGetOrderSubject: () => {
            const action = Actions.promiseGetOrderSubject();
            dispatch(action);
        },

        onPromiseSetOrderSubject: (orderSubject: string) => {
            const action = Actions.promiseSetOrderSubject(orderSubject);
            dispatch(action);
        }

    };

    return events;
};

const WrappedOrderSubject = Form.create()(OrderSubjectPage);

export default connect(mapStateToProps, mapDispatchToProps)(WrappedOrderSubject);