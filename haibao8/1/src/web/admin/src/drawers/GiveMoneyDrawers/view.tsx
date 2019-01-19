import React                    from 'react';
import { connect }              from 'react-redux';
import { FormComponentProps }   from 'antd/lib/form';

import { dynMountReducer }      from '../../store';
import * as Common              from '../../common';
import * as Utils               from '../../utils';

import * as Consts              from './consts';
import * as Actions             from './actions';
import * as ActionTypes         from './actionTypes';
import * as Reducer             from './reducer';

import { 
    Form, 
    message, 
    Input, 
    Drawer, 
    Button 
} from 'antd';

interface GiveMoneyDrawerProps extends FormComponentProps {
    account:    Utils.ApiTypes.AccountInfo;
    onClose:    (e?: any, giveMoneyFen?: boolean) => void;
}

interface GiveMoneyDrawerEvents {
    onChangeState:                  (params: any) => void;
    onPromiseGiveMoneyToAccount:    (accountID: number, orderMoneyFen: number) => void;
}

interface InnerGiveMoneyDrawerProps extends GiveMoneyDrawerProps, Reducer.GiveMoneyDrawerStates, GiveMoneyDrawerEvents {}

class GiveMoneyDrawer extends React.Component<InnerGiveMoneyDrawerProps, any> {
    constructor(props: InnerGiveMoneyDrawerProps) {
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

        if (this.props.giveMoneyToAccountResult) {
            message.success('充值成功');
            this.props.onChangeState({
                giveMoneyToAccountResult: false
            });

            if (this.props.onClose) {
                this.props.onClose(null, true);
            }
        }
    }

    public render() {
        const DrawerTitle   = '赠送使用金额';

        return (
            <Drawer
                title={DrawerTitle}
                width={720}
                placement="right"
                onClose={this.props.onClose}
                visible={true}
                maskClosable={false}
            >
                {this.renderContentView()}
            </Drawer>
        );
    }

    // 渲染界面内容
    private renderContentView(): React.ReactNode {
        const { getFieldDecorator } = this.props.form;

        return (
            <Form layout="vertical" onSubmit={this.handleDrawerOk}>
                <Form.Item {...Consts.formItemLayout} label="用户ID" key="accountID">
                        <Input value={this.props.account.accountID} disabled={true}/>
                    </Form.Item>

                    <Form.Item {...Consts.formItemLayout} label="用户昵称" key="accountNickname">
                        <Input value={this.props.account.userInfo.nickName} disabled={true}/>
                    </Form.Item>

                    <Form.Item {...Consts.formItemLayout} label="赠送金额(元)" key="orderMoneyFen">
                        {getFieldDecorator('orderMoneyFen', {rules: Consts.accountModelFormItemRules, initialValue: (100).toFixed(2) })
                        (<Input />)}
                    </Form.Item>
                <div className="buttons">
                    <Button type="primary" onClick={this.props.onClose}>取消</Button>
                    <Button type="primary" htmlType="submit" loading={this.props.giveMoneyToAccountPending}>提交</Button>
                </div>
            </Form>
        );
    }

    private checkOrInit(): void {
        if (!this.props.inited) {
            this.props.onChangeState({
                inited: true
            });
        }
    }

    private handleDrawerOk(e: any): void {
        e.preventDefault();

        this.props.form.validateFields((err: any, values: any) => {
            if (!err) {
                const { orderMoneyFen } = values;

                const realOrderMoneyFen = orderMoneyFen * 100;

                this.props.onPromiseGiveMoneyToAccount(this.props.account.accountID, realOrderMoneyFen);
            }
        });
    }

}

const mapStateToProps = (state, ownProps) => {
    const props = Common.ReducerTool.Funcs.mapStateToProps(state, ActionTypes.stateKey, ownProps);
    return props;
};

const mapDispatchToProps = (dispatch: any): GiveMoneyDrawerEvents => {
    const events: GiveMoneyDrawerEvents = {
        onChangeState: (params: any): void => {
            const action = Actions.changeState(params);
            dispatch(action);
        },

        onPromiseGiveMoneyToAccount: (accountID: number, orderMoneyFen: number): void => {
            const action = Actions.promiseGiveMoneyToAccount(accountID, orderMoneyFen);
            dispatch(action);
        }
    };

    return events;
};

const WrappedGiveMoneyDrawer = dynMountReducer(Form.create()(GiveMoneyDrawer), ActionTypes.stateKey, Reducer.reducer, Reducer.initialState);

export default connect(mapStateToProps, mapDispatchToProps)(WrappedGiveMoneyDrawer);