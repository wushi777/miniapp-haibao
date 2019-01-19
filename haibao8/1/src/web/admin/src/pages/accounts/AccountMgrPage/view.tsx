import React                from 'react';
import { connect }          from 'react-redux';
import { PaginationProps }  from 'antd/lib/pagination';

import * as Common          from '../../../common';
import * as Utils           from '../../../utils';
import * as GiveMoneyDrawer from '../../../drawers/GiveMoneyDrawers';

import * as Actions         from './actions';
import * as ActionTypes     from './actionTypes';
import * as Consts          from './consts';
import * as Reducer         from './reducer';
import * as Views           from './views';

import { 
    Table, 
    Input, 
    Icon, 
    Button 
} from 'antd';

import './style.less';

interface CompanyMgrEvents {
    onChangeState: (params: Reducer.CompanyMgrChangState) => void;

    onPromiseQueryAccountList: (
        search: string, 
        sort:   string, 
        desc:   boolean, 
        from:   number, 
        count:  number
    ) => void;
}

interface CompanyMgrProps extends Reducer.CompanyMgrStates, CompanyMgrEvents {}

class CompanyMgrPage extends React.PureComponent<CompanyMgrProps, any> {
    private pagination: PaginationProps = Utils.initPagination();
    private columns:    any[];

    constructor(props: CompanyMgrProps) {
        super(props);
        this.columns = [
            Consts.conAccountAvatarColumn,
            Consts.conAccountIDColumn,
            // Consts.conAccountNameColumn,
            Consts.conNickNameColumn,
            Consts.conGenderColumn,
            Consts.conCountryColumn,
            Consts.conProvinceColumn,
            Consts.conCityColumn,
            Consts.conLanguageColumn,
            Consts.conCreateDateColumn,
            Consts.conLastLoginDateColumn,
            Consts.conLoginTimesColumn,
            // Consts.conRemainMoneyFenColumn,
            Consts.conOperateColumn
        ];

        Consts.conGenderColumn.render               = this.renderGenderColumn.bind(this);
        Consts.conAccountAvatarColumn.render        = this.renderAvatarColumn.bind(this);
        Consts.conCreateDateColumn.render           = this.renderDateFormatColumn.bind(this);
        Consts.conLastLoginDateColumn.render        = this.renderDateFormatColumn.bind(this);
        Consts.conOperateColumn.render              = this.renderOperateButtonsColumn.bind(this);
        // Consts.conRemainMoneyFenColumn.render       = this.conMoneyColumn.bind(this);

        Common.CommonFuncs.bindObjectHandleMethods(this);
    }

    public componentDidMount(): void {
        this.checkOrInit();
    }

    public componentDidUpdate(): void {
        if (this.props.error) {
            this.props.onChangeState({ error: null });

            Utils.umessage.error(this.props.error.message);
        }

        this.checkOrInit();
    }

    public render(): React.ReactNode {
        this.parsePagination();

        return (
            <div>
                <div>
                    <Input
                        value={this.props.queryParams.search}
                        placeholder="请输入关键字"
                        prefix={<Icon type="search"/>}
                        onChange={this.handleSearchChange}
                        onPressEnter={this.handleSearchButton}
                        maxLength={100}
                    />
                    <Button
                        type="primary"
                        onClick={this.handleSearchButton}
                    > 查询
                    </Button>
                </div>

                <Table
                    dataSource={this.props.queryAccountListResult ? this.props.queryAccountListResult.data : []}
                    columns={this.columns}
                    loading={false}
                    pagination={this.pagination}
                    onChange={this.handleTableChange}
                    rowKey={this.handleTableRowKey}
                />
                
                {this.renderGiveMoneyDrawer()}
            </div>
        );
    }

    // 获取账户列表以及数量
    private checkOrInit(): void {
        if (!this.props.inited) {
            this.props.onChangeState({ inited: true });

            const { current, pageSize, sort, desc, search } = this.props.queryParams;
            const from: number = (current - 1) * pageSize;

            this.props.onPromiseQueryAccountList(search, sort, desc, from, pageSize);
        }
    }

    // 处理分页
    private parsePagination(): void {
        if (this.props.queryAccountListResult) {
            this.pagination.total       = this.props.queryAccountListResult.total;
            this.pagination.current     = Number(this.props.queryParams.current);
            this.pagination.pageSize    = Number(this.props.queryParams.pageSize);
        }
    }

    // 搜索search
    private handleSearchChange(e: any): void {
        const queryParams = {
            ...this.props.queryParams,
            search: e.target.value
        };

        this.props.onChangeState({
            queryParams
        });
    }

    private renderGiveMoneyDrawer(): React.ReactNode {
        if (this.props.showGiveMoneyDrawer) {
            return (
                <GiveMoneyDrawer.view
                    account={this.props.operatingAccount}
                    onClose={this.handleDrawerOk}
                    onCancel={this.handleDrawerCancel}
                />
            );
        } else {
            return null;
        }
    }

    // 查询Button
    private handleSearchButton(): void {
        const search = this.props.queryParams.search || '';
        const queryParams = {
            ...this.props.queryParams,
            search,
            current: 1
        };

        const path: string = `${Utils.routerRootPath}${Utils.routerPaths.accountsMgr.path}`;
        Common.CommonFuncs.gotoPage(path, queryParams);
    }

    // rowKey
    private handleTableRowKey(account: Utils.ApiTypes.AccountInfo): string {
        return `${account.accountID}`;
    }
    
    // table改变事件
    private handleTableChange(pagination: PaginationProps): void {
        // const { current, pageSize } = pagination;

        // const queryParams = {
        //     ...this.props.queryParams,
        //     current,
        //     pageSize
        // };

        // Common.CommonFuncs.gotoPage(`${Utils.routerRootPath}${Utils.routerPaths.company.path}`, queryParams);
    }

    private renderGenderColumn(gender: number): string {
        switch (gender) {
            case 1:
                return '男';
                
            default:
                return `${gender}`;
        }
    }

    private renderAvatarColumn(avatarUrl: string): React.ReactNode {
        return (
            <img className="avatar" src={avatarUrl}/>
        );
    }

    // 时间转换
    private renderDateFormatColumn(createDate: number): string {
        const data = `${Common.CommonFuncs.displayDateTime(createDate)}`;
        return data;
    }

     // 渲染表格中的操作按钮
     private renderOperateButtonsColumn(account: Utils.ApiTypes.AccountInfo): React.ReactNode {
        return (
            <Views.OperateButtons
                account={account}
                onGivenMoney={this.handleOperateButtonGivenMoney}
            />
        );
    }

    private openGiveMoneyDrawer(operatingAccount: Utils.ApiTypes.AccountInfo): void {
        this.props.onChangeState({
            showGiveMoneyDrawer: true,
            operatingAccount
        });
    }

    private handleOperateButtonGivenMoney(account: Utils.ApiTypes.AccountInfo): void {
        this.openGiveMoneyDrawer(account);
    }
    
    private handleDrawerOk(e: any, giveMoneyFen: boolean): void {
        const params: any = {
            showGiveMoneyDrawer: false
        };
        
        if (giveMoneyFen) {
            params.inited = false;
        }
        
        this.props.onChangeState(params);
    }

    private handleDrawerCancel(): void {
        this.props.onChangeState({
            showGiveMoneyDrawer: false
        });
    }

    // // 余额
    // private conMoneyColumn(incByFen: number): string {
    //     if (incByFen) {
    //         return (incByFen / 100).toFixed(2);
    //     }
    //     return '0.00';
    // }
}

const mapStateToProps = (state: any) => {
    const props = Common.ReducerTool.Funcs.mapStateToProps(state, ActionTypes.stateKey);
    return props;
};

const mapDispatchToProps = (dispatch: any, ownProps: any) => {
    const events: CompanyMgrEvents = {
        onChangeState: (params: any): void => {
            const action = Actions.changeState(params);
            dispatch(action);
        },

        onPromiseQueryAccountList: (
            search: string, 
            sort:   string, 
            desc:   boolean, 
            from:   number, 
            count:  number
        ) => {
            const action = Actions.promiseQueryAccountList(search, sort, desc, from, count);
            dispatch(action);
        }
    };

    return events;
};

export default connect(mapStateToProps, mapDispatchToProps)(CompanyMgrPage);