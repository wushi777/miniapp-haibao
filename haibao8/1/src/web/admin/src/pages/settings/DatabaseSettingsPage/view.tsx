import React            from 'react';
import { connect }      from 'react-redux';
import { Spin, Form }   from 'antd';

import * as Common      from '../../../common';
import * as Utils       from '../../../utils';

import * as Actions     from './actions';
import * as ActionTypes from './actionTypes';
import * as Reducer     from './reducer';

import './style.less';

interface DatabaseSettingsEvents {
    onChangeState:                  (params: any) => void;
    onPromiseGetDatabaseSettings:   () => void;
}

interface DatabaseSettingsProps extends Reducer.DatabaseSettingsStates, DatabaseSettingsEvents {}

class DatabaseSettingsPage extends React.PureComponent<DatabaseSettingsProps, any> {
    constructor(props: DatabaseSettingsProps) {
        super(props);
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
        const mongodbInfo = this.props.getDBInfoResult ? this.props.getDBInfoResult.mongo : undefined;

        return (
            <div className="DatabaseSettings">
                <Spin spinning={this.props.getDBInfoPending}>
                    <Form className="DatabaseSettings-form">
                        <Form.Item  label="数据库类型">
                            {`MongoDB`}
                        </Form.Item>

                        <Form.Item label="服务器地址">
                            {mongodbInfo ? mongodbInfo.host : ''}
                        </Form.Item>

                        <Form.Item label="端口号">
                            {mongodbInfo ? mongodbInfo.port : ''}
                        </Form.Item>

                        <Form.Item label="数据库名">
                            {mongodbInfo ? mongodbInfo.database : ''}
                        </Form.Item>

                        <Form.Item  label="表前缀">
                            {mongodbInfo ? mongodbInfo.database : ''}                        
                        </Form.Item>
                    </Form>
                </Spin>
            </div>
        );
    }

    private checkOrInit(): void {
        if (!this.props.inited) {
            this.props.onPromiseGetDatabaseSettings();
            this.props.onChangeState({
                inited: true
            });
        }
    }
}

const mapStateToProps = (state: any) => {
    const props = Common.ReducerTool.Funcs.mapStateToProps(state, ActionTypes.stateKey);
    return props;
};

const mapDispatchToProps = (dispatch: any, ownProps: any) => {
    const events: DatabaseSettingsEvents = {
        onChangeState: (params: any): void => {
            const action = Actions.changeState(params);
            dispatch(action);
        },

        onPromiseGetDatabaseSettings: (): void => {
            const action = Actions.PromiseGetDatabaseSettings();
            dispatch(action);
        }
    };

    return events;
};

export default connect(mapStateToProps, mapDispatchToProps)(DatabaseSettingsPage);