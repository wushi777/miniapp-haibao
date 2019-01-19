import React                    from 'react';
import { connect }              from 'react-redux';
import { FormComponentProps }   from 'antd/lib/form';

import * as Common              from '../../common';
import * as Utils               from '../../utils';

import * as Actions             from './actions';
import * as ActionTypes         from './actionTypes';
import * as Reducer             from './reducer';
import * as Consts              from './consts';

import { 
    Button, 
    Checkbox, 
    Col, 
    Form, 
    Input, 
    Row,
    Spin, 
    Tabs, 
    Icon 
} from 'antd';

import './style.less';
console.log(process.env);

interface InstallEvents {
    onChangeState: (params: any) => void;

    onPromiseNewInstall: (
        mongo:      Utils.ApiTypes.MongoInfo, 
        adminName:  string,
        password:   string,
        clearAll:   boolean
    ) => void;

    onPromiseAddToCluster: (
        serverUrl:  string, 
        adminName:  string, 
        password:   string
    ) => void;
}

interface InstallProps extends Reducer.InstallStates, InstallEvents {}

interface NewInstallFormProps extends FormComponentProps {
    clearAllData: boolean;

    onChangeState: (params: any) => void;

    onNewInstall: (
        mongo:      Utils.ApiTypes.MongoInfo, 
        adminName:  string,
        password:   string,
        clearAll:   boolean
    ) => void;
}

interface AddToClusterFormProps extends FormComponentProps {
    onAddToCluster: (serverUrl: string, adminName: string, password: string) => void;
}

// 全新安装Form
class NewInstallForm extends React.Component<NewInstallFormProps, any> {
    constructor(props: NewInstallFormProps) {
        super(props);
    
        Common.CommonFuncs.bindObjectHandleMethods(this);
    }

    public render(): React.ReactNode {
        const { getFieldDecorator } = this.props.form;

        return (
            <Form onSubmit={this.handleNewInstallSubmit}>
                {/* mongoDB */}
                <div className="setting-area">
                    <h2><Icon type="database" /> MongoDB服务器配置</h2>
                    <Form.Item {...Consts.formItemLayout} label={Consts.newInstallForm.mongo.host.label}>
                        {getFieldDecorator(Consts.newInstallForm.mongo.host.name, {
                            rules: Consts.newInstallForm.mongo.host.rules, initialValue: Consts.newInstallForm.mongo.host.initialValue
                        })(
                            <Input />
                        )}
                    </Form.Item>

                    <Form.Item {...Consts.formItemLayout} label={Consts.newInstallForm.mongo.port.label}>
                        {getFieldDecorator(Consts.newInstallForm.mongo.port.name, {
                            rules: Consts.newInstallForm.mongo.port.rules, initialValue: Consts.newInstallForm.mongo.port.initialValue
                        })(
                            <Input />
                        )}
                    </Form.Item>

                    <Form.Item {...Consts.formItemLayout} label={Consts.newInstallForm.mongo.database.label}>
                        {getFieldDecorator(Consts.newInstallForm.mongo.database.name, {
                            rules: Consts.newInstallForm.mongo.database.rules, initialValue: Consts.newInstallForm.mongo.database.initialValue
                        })(
                            <Input />
                        )}
                    </Form.Item>

                    <Form.Item {...Consts.formItemLayout} label={Consts.newInstallForm.mongo.user.label}>
                        {getFieldDecorator(Consts.newInstallForm.mongo.user.name, {})(
                            <Input placeholder={Consts.newInstallForm.mongo.user.placeholder} />
                        )}
                    </Form.Item>

                    <Form.Item {...Consts.formItemLayout} label={Consts.newInstallForm.mongo.password.label}>
                        {getFieldDecorator(Consts.newInstallForm.mongo.password.name, {})(
                            <Input type="password" placeholder={Consts.newInstallForm.mongo.password.placeholder} />
                        )}
                    </Form.Item>

                    <Form.Item {...Consts.formItemLayout} label={Consts.newInstallForm.mongo.tablePrefix.label}>
                        {getFieldDecorator(Consts.newInstallForm.mongo.tablePrefix.name, {
                            rules: Consts.newInstallForm.mongo.tablePrefix.rules, initialValue: Consts.newInstallForm.mongo.tablePrefix.initialValue
                        })(
                            <Input />
                        )}
                    </Form.Item>
                </div>

                {/* 管理员账号 */}
                <div className="setting-area">
                    <h2><Icon type="user" /> 管理员账号</h2>
                    <Form.Item {...Consts.formItemLayout} label={Consts.newInstallForm.admin.adminName.label}>
                        {getFieldDecorator(Consts.newInstallForm.admin.adminName.name, {
                            rules: Consts.newInstallForm.admin.adminName.rules, initialValue: Consts.newInstallForm.admin.adminName.initialValue
                        })(
                            <Input placeholder={Consts.newInstallForm.admin.adminName.placeholder} />
                        )}
                    </Form.Item>

                    <Form.Item {...Consts.formItemLayout} label={Consts.newInstallForm.admin.password.label}>
                        {getFieldDecorator(Consts.newInstallForm.admin.password.name, {
                            rules: Consts.newInstallForm.admin.password.rules
                        })(
                            <Input type="password" placeholder={Consts.newInstallForm.admin.password.placeholder} />
                        )}
                    </Form.Item>

                    <Form.Item {...Consts.formItemLayout} label={Consts.newInstallForm.admin.rePassword.label}>
                        {getFieldDecorator(Consts.newInstallForm.admin.rePassword.name, {
                            rules: [ { required: true, message: '请再输入一次密码' }, { validator: this.handleCompareToFirstPassword } ]
                        })(
                            <Input type="password" placeholder={Consts.newInstallForm.admin.rePassword.placeholder} />
                        )}
                    </Form.Item>
                </div>
                
                {/* 清空原数据 */}
                <Form.Item {...Consts.formItemClearAllDataLayout}>
                    <Checkbox checked={this.props.clearAllData} onChange={this.handleCheckChange}>
                        是否清空原数据
                    </Checkbox>
                </Form.Item>
     
                {/* 按钮 */}
                <Row>
                    <Col span={24} className="form-button">
                        <Button type="primary" htmlType="submit">提交</Button>
                        <Button onClick={this.handleNewInstallReset} className="form-reset">重置</Button>
                    </Col>
                </Row>
            </Form>
        );
    }

    // 验证两次密码输入是否一致
    private handleCompareToFirstPassword(rule: any, value: any, callback: Function): void {
        const form = this.props.form;

        if (value && value !== form.getFieldValue('adminPassword')) {
            callback('两次密码输入不一致');
        } else {
            callback();
        }
    }

    // 提交(全新安装)
    private handleNewInstallSubmit(e: any): void {
        e.preventDefault();

        this.props.form.validateFields((err: any, values: any) => {
            if (!err) {
                const mongo: Utils.ApiTypes.MongoInfo = {
                    host:           values.mongoHost,
                    port:           values.mongoPort,
                    database:       values.mongoDatabase,
                    user:           values.mongoUser,
                    password:       values.mongoPassword,
                    tablePrefix:    values.mongoTablePrefix
                };

                const adminName:    string = values.adminName;
                const password:     string = values.adminPassword;

                const clearAll: boolean = this.props.clearAllData;

                this.props.onNewInstall(mongo, adminName, password, clearAll);
            }
        });
    }

    // 重置(全新安装)
    private handleNewInstallReset(): void {
        this.props.form.resetFields();
    }

    // 切换是否清空原数据
    private handleCheckChange(e: any): void {
        this.props.onChangeState({ clearAllData: e.target.checked });
    }
}

// 添加到集群Form
class AddToClusterForm extends React.Component<AddToClusterFormProps, any> {
    constructor(props: AddToClusterFormProps) {
        super(props);
    
        Common.CommonFuncs.bindObjectHandleMethods(this);
    }

    public render(): React.ReactNode {
        const { getFieldDecorator } = this.props.form;

        return (
            <Form onSubmit={this.handleAddToClusterSubmit} className="form-addCluster">
                <Form.Item {...Consts.formItemLayout} label={Consts.addToCluster.url.label}>
                    {getFieldDecorator(Consts.addToCluster.url.name, {
                        rules: Consts.addToCluster.url.rules
                    })(
                        <Input placeholder={Consts.addToCluster.url.placeholder} />
                    )}
                </Form.Item>

                <Form.Item {...Consts.formItemLayout} label={Consts.addToCluster.adminName.label}>
                    {getFieldDecorator(Consts.addToCluster.adminName.name, {
                        rules: Consts.addToCluster.adminName.rules
                    })(
                        <Input placeholder={Consts.addToCluster.adminName.placeholder} />
                    )}
                </Form.Item>

                <Form.Item {...Consts.formItemLayout} label={Consts.addToCluster.password.label}>
                    {getFieldDecorator(Consts.addToCluster.password.name, {
                        rules: Consts.addToCluster.password.rules
                    })(
                        <Input placeholder={Consts.addToCluster.password.placeholder} />
                    )}
                </Form.Item>
                
                <Form.Item {...Consts.formItemClearAllDataLayout} className="form-addClusterButton">
                    <Button type="primary" htmlType="submit">提交</Button>
                    <Button onClick={this.handleAddToClusterReset} className="form-reset">重置</Button>
                </Form.Item>
            </Form>
        );
    }

    // 提交(添加到集群)
    private handleAddToClusterSubmit(e: any): void {
        e.preventDefault();

        this.props.form.validateFields((err: any, values: any) => {
            if (!err) {
                this.props.onAddToCluster(values.InstallServerUrl, values.adminName, values.password);
            }
        });
    }

    // 重置(添加到集群)
    private handleAddToClusterReset(): void {
        this.props.form.resetFields();
    }
}

const NewInstallFormWrap    = Form.create()(NewInstallForm);
const AddToClusterFormWrap  = Form.create()(AddToClusterForm);

class InstallPage extends React.Component<InstallProps, any> {
    constructor(props: InstallProps) {
        super(props);

        Common.CommonFuncs.bindObjectHandleMethods(this);
    }

    public componentDidUpdate(): void {
        if (this.props.error) {
            Utils.umessage.error(this.props.error.message);

            this.props.onChangeState({error: null});
            
            return;
        }

        // 处理安装结果
        if (this.props.newInstallResult || this.props.addToClusterResult) {
            this.props.onChangeState({
                newInstallResult:   null,
                addToClusterResult: null
            });
            
            location.href = `${location.origin}`;
        }
    }

    public render(): React.ReactNode {
        return (
            <div className="installBox">
                <h1><Icon type="setting" /> 配置</h1>
                <div className="install">
                    <Tabs activeKey={this.props.activeTabKey} onChange={this.handleChangeTab}>
                        <Tabs.TabPane tab={Consts.Tabs.newInstall.title} key={Consts.Tabs.newInstall.key}>
                            <Spin spinning={this.props.newInstallPending} tip="正在安装...">
                                <NewInstallFormWrap 
                                    clearAllData={this.props.clearAllData} 
                                    onChangeState={this.handleChangeState} 
                                    onNewInstall={this.handleNewInstall} 
                                />
                            </Spin>
                        </Tabs.TabPane>
                        
                        <Tabs.TabPane tab={Consts.Tabs.addToCluster.title} key={Consts.Tabs.addToCluster.key}>
                            <Spin spinning={this.props.addToClusterPending} tip="正在安装...">
                                <AddToClusterFormWrap onAddToCluster={this.handleAddToCluster} />
                            </Spin>
                        </Tabs.TabPane>
                    </Tabs>
                </div>
            </div>
        );
    }

    // 切换tab事件
    private handleChangeTab(activeTabKey: string): void {
        this.props.onChangeState({ activeTabKey });
    }

    // 修改组件状态
    private handleChangeState(params: any): void {
        this.props.onChangeState(params);
    }

    // 提交(全新安装)
    private handleNewInstall(
        mongo:      Utils.ApiTypes.MongoInfo, 
        adminName:  string,
        password:   string,
        clearAll:   boolean
    ): void {
        this.props.onPromiseNewInstall(mongo, adminName, password, clearAll);
    }

    // 提交(添加到集群)
    private handleAddToCluster(InstallServerUrl: string, adminName: string, password: string): void {
        this.props.onPromiseAddToCluster(InstallServerUrl, adminName, password);
    }

    // // 切换是否清空原数据
    // private handleCheckChange(e: any): void {
    //     this.props.onChangeState({ clearAllData: e.target.checked });
    // }
}

const mapStateToProps = (state: Reducer.InstallStates) => {
    const props = Common.ReducerTool.Funcs.mapStateToProps(state, ActionTypes.stateKey);
    return props;
};

const mapDispatchToProps = (dispatch: any, ownProps: InstallProps) => {
    const events: InstallEvents = {
        onChangeState: (params: any): void => {
            const action = Actions.changeState(params);
            dispatch(action);
        },

        onPromiseNewInstall: (
            mongo:      Utils.ApiTypes.MongoInfo, 
            adminName:  string,
            password:   string,
            clearAll:   boolean
        ): void => {
            const action = Actions.promiseNewInstall(mongo, adminName, password, clearAll);
            dispatch(action);
        },

        onPromiseAddToCluster: (serverUrl: string, adminName: string, password: string): void => {
            const action = Actions.promiseAddToCluster(serverUrl, adminName, password);
            dispatch(action);
        }
    };

    return events;
};

export default connect(mapStateToProps, mapDispatchToProps)(InstallPage);