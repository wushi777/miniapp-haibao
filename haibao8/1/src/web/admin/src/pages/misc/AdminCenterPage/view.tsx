import React            from 'react';
import { connect }      from 'react-redux';
import { Form }         from 'antd';

import * as Common      from '../../../common';
import * as Utils       from '../../../utils';

import * as Actions     from './actions';
import * as ActionTypes from './actionTypes';
import * as Reducer     from './reducer';

import './style.less';

interface AdminCenterEvents {
    onChangeState:                  (params: any) => void;

    onPromiseGetAdminBaseInfo:      () => void;
    onPromiseQueryAccountPageData:  () => void;
    onPromiseQueryPosterPageData:   () => void;
    onPromiseQueryShopPageData:     () => void;
}

interface AdminCenterProps extends Reducer.AdminCenterStates, AdminCenterEvents {}

class AdminCenterPage extends React.PureComponent<AdminCenterProps, any> {
    // public adminInfo: Utils.ApiTypes.AdminInfo;
    
    constructor(props: AdminCenterProps) {
        super(props);
        
        // this.adminInfo = Utils.storage.adminInfo;
    }

    public componentDidMount(): void {
        this.checkOrInit();
    }

    public componentDidUpdate(): void {
        this.checkOrInit();

        if (this.props.error) {
            this.props.onChangeState({ error: null });

            Utils.umessage.error(this.props.error.message);
        }
    }

    public render(): React.ReactNode {
        const adminInfo: Utils.ApiTypes.AdminInfo | null = this.props.getAdminBaseInfoResult;
        const accountCount: string = this.props.queryAccountPageDataResult  ? `${this.props.queryAccountPageDataResult.total}`  : '正在计算...';
        const posterCount:  string = this.props.queryPosterPageDataResult   ? `${this.props.queryPosterPageDataResult.total}`   : '正在计算...';
        const shopCount:    string = this.props.queryShopPageDataResult     ? `${this.props.queryShopPageDataResult.total}`     : '正在计算...';

        return (
            <div className="account-center">
                <Form className="account-center-form">

                    <Form.Item label="管理员账号">
                        {adminInfo ? adminInfo.adminName : ''}                        
                    </Form.Item>
                    
                    <Form.Item label="登录次数">
                        {adminInfo ? adminInfo.loginTimes : ''}                        
                    </Form.Item>

                    <Form.Item  label="创建时间">
                        {adminInfo ? Common.CommonFuncs.displayDateTime(adminInfo.createDate) : ''}
                    </Form.Item>

                    <Form.Item label="最后登录时间">
                        {adminInfo ? Common.CommonFuncs.displayDateTime(adminInfo.lastLoginDate) : ''}
                    </Form.Item>

                    <Form.Item label="用户数量">
                        {accountCount}
                    </Form.Item>

                    <Form.Item label="海报数量">
                        {posterCount}
                    </Form.Item>

                    <Form.Item label="店铺数量">
                        {shopCount}
                    </Form.Item>

                </Form>
            </div>
        );
    }

    private checkOrInit(): void {
        if (!this.props.inited) {
            this.props.onChangeState({ inited: true });

            // 获取管理员基本信息
            this.props.onPromiseGetAdminBaseInfo();

            this.props.onPromiseQueryAccountPageData();

            this.props.onPromiseQueryPosterPageData();

            this.props.onPromiseQueryShopPageData();
        }
    }
}

const mapStateToProps = (state: any) => {
    const props = Common.ReducerTool.Funcs.mapStateToProps(state, ActionTypes.stateKey);
    return props;
};

const mapDispatchToProps = (dispatch: any, ownProps: any) => {
    const events: AdminCenterEvents = {
        onChangeState: (params: any): void => {
            const action = Actions.changeState(params);
            dispatch(action);
        },

        onPromiseGetAdminBaseInfo: () => {
            const action = Actions.promiseGetAdminBaseInfo();
            dispatch(action);
        },
        
        onPromiseQueryAccountPageData: () => {
            const action = Actions.promiseQueryAccountPageData();
            dispatch(action);
        },

        onPromiseQueryPosterPageData: () => {
            const action = Actions.promiseQueryPosterPageData();
            dispatch(action);
        },

        onPromiseQueryShopPageData: () => {
            const action = Actions.promiseQueryShopPageData();
            dispatch(action);
        }
        
    };

    return events;
};

export default connect(mapStateToProps, mapDispatchToProps)(AdminCenterPage);