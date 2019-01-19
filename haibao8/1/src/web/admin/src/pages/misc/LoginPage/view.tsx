import React                    from 'react';
import { connect }              from 'react-redux';
import { browserHistory }       from 'react-router';
import { Form }                 from 'antd';
import { FormComponentProps }   from 'antd/lib/form';

import * as Common              from '../../../common';
import * as Utils               from '../../../utils';

import * as Actions             from './actions';
import * as ActionTypes         from './actionTypes';
import * as Reducer             from './reducer';
import * as Views               from './views';

import './style.less';

interface LoginEvents {
    onChangeState:  (params: Reducer.LoginChangeState) => void;
    onLogin:        (adminName: string, password: string) => void;
}

interface LoginProps extends FormComponentProps, Reducer.LoginStates, LoginEvents {}

class LoginPage extends React.PureComponent<LoginProps, any> {
    constructor(props: LoginProps) {
        super(props);

        Common.CommonFuncs.bindObjectHandleMethods(this);
    }

    public componentDidUpdate(): void {
        if (this.props.error) {
            this.props.onChangeState({ error: null });

            Utils.umessage.error(this.props.error.message);
        }

        // 登录成功
        if (this.props.loginResult) {
            Utils.storage.adminAccessToken  = this.props.loginResult.accessToken;
            Utils.storage.adminName         = this.props.loginResult.adminInfo.adminName;

            this.props.onChangeState({ loginResult: null });

            browserHistory.push(`${Utils.routerRootPath}${Utils.routerPaths.adminCenter.path}`);
        }
    }

    public render(): React.ReactNode {
        return (
            <div className="login-register-form">
                <Views.WrappedLoginForm onLogin={this.handleLogin} loading={this.props.loginPending} />
            </div>
        );
    }

    // 登录
    private handleLogin(adminName: string, password: string): void {
        this.props.onLogin(adminName, password);
    }
}

const mapStateToProps = (state: any) => {
    const props = Common.ReducerTool.Funcs.mapStateToProps(state, ActionTypes.stateKey);
    return props;
};

const mapDispatchToProps = (dispatch: any, ownProps: any) => {
    const events: LoginEvents = {
        onChangeState: (params: any): void => {
            const action = Actions.changeState(params);
            dispatch(action);
        },

        onLogin: (adminName: string, password: string): void => {
            const action = Actions.login(adminName, password);
            dispatch(action);
        }
    };

    return events;
};

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(LoginPage));