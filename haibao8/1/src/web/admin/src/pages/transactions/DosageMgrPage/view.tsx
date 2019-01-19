import React                    from 'react';
import { connect }              from 'react-redux';
import { RouteComponentProps }  from 'react-router';
import { FormComponentProps }   from 'antd/lib/form'; 
import { PaginationProps }      from 'antd/lib/pagination';

import * as Common              from '../../../common';
import * as Utils               from '../../../utils';

import * as Actions             from './actions';
import * as ActionTypes         from './actionTypes';
import * as Consts              from './consts';
import * as Reducer             from './reducer';
import * as Views               from './views';

import { 
    Form, 
    message, 
    Button, 
    Table 
} from 'antd';

import './style.less';

interface  DosageMgrEvents {
    onChangeState: (params: {}) => void; // 重置state

    onPromiseQueryDosageList: (
        accountID:  number, 
        startDate:  number, 
        endDate:    number, 
        from:       number, 
        count:      number,  
        sort:       string, 
        desc:       boolean
    ) => void;   // 获取消费记录列表
}

interface DosageMgrProps extends RouteComponentProps<any, any>, FormComponentProps, Reducer.DosageMgrStates, DosageMgrEvents {}

class DosageMarPage extends React.Component <DosageMgrProps, any> {
    private loading:    Utils.Interfaces.Loading    = { delay: 500 };
    private pagination: PaginationProps             = Utils.initPagination();

    // 定义表头信息
    private columns: any[];

    constructor (props: DosageMgrProps) {
        super(props);
       
        this.columns = [
            Consts.conDosageIDColumn,
            Consts.conAccountIDColumn,
            Consts.conDosageStartTimeColumn,
            Consts.conDosageEndTimeColumn,
            Consts.conDosageDurationColumn,
            Consts.conMoneyColumn,
            Consts.conOperateColumn            
        ];

        Consts.conDosageStartTimeColumn.render  = this.renderDosageTimeColumn.bind(this);
        Consts.conDosageEndTimeColumn.render    = this.renderDosageTimeColumn.bind(this);
        Consts.conMoneyColumn.render            = this.renderMoneyColumn.bind(this);
        Consts.conOperateColumn.render          = this.renderOperators.bind(this);

        Common.CommonFuncs.bindObjectHandleMethods(this);        
    }

    public componentDidMount() {
        this.checkOrInit(); 
    }

    public componentDidUpdate() {
        if (!this.props.inited) {
            this.checkOrInit();
            return;
        }

        if (this.props.error) {
            message.error(this.props.error.message);
            this.props.onChangeState({error: null});
            return;
        }

    }

    public render() {
        this.parseLoading();
        this.parsePagination();

        return (
            <div className="dosagemar">
                <div className="clearfix">
                <Button
                    type="primary"
                    title="刷新"
                    onClick={this.handleRefreshButtonClick}
                >刷新
                </Button>
                <div className="fr">
                        <Views.AccountSelect accountID={this.props.queryParams.accountID} onChangeAccount={this.handleChangeAccount} />
                        &nbsp;&nbsp;
                        <Common.MyTimerRadios
                            onClick={this.handleChangeTime}
                            timeType={this.props.queryParams.timeType}
                            startDate={this.props.queryParams.startDate}
                            endDate={this.props.queryParams.endDate}
                        />
                    </div>
                </div>

                <Table
                    dataSource={this.props.queryDosageListResult ? this.props.queryDosageListResult.data : []}
                    columns={this.columns}
                    loading={this.loading}
                    pagination={this.pagination}
                    onChange={this.handleTableChange}
                    rowKey={this.handleTableRowKey}
                />
                {/* 查看消费明细 */}                
                {this.renderDrawerView()}
            </div>
        );
    }

    // 渲染抽屉视图
    private renderDrawerView(): React.ReactNode {
        return null;
        // if (this.props.showDrawer) {
        //     return <WrappedDosageDetailDrawer onClose={this.handleCloseDrawer} dosage={this.props.dosage} />;
        // } else {
        //     return null;
        // }
    }

    // // 关闭抽屉视图
    // private handleCloseDrawer(): void {
    //     this.props.onChangeState({
    //         dosage:     null,
    //         showDrawer: false
    //     });
    // }
    
    // 渲染操作按钮
    private renderOperators(dosage: Utils.ApiTypes.DosageInfo): React.ReactNode {
        return <Views.OperateButtons dosage={dosage} onDetail={this.handleDetail} />;
    }

    // 查看消费明细
    private handleDetail(dosage: Utils.ApiTypes.DosageInfo): void {
        this.props.onChangeState({
            dosage,
            showDrawer: true
        });
    }

    // 修改时间回调函数
    private handleChangeTime(
        startDate:  number, 
        endDate:    number, 
        timeNum:    number, 
        timeType:   string
    ): void {
        const queryParams = {
            ...this.props.queryParams,
            startDate,
            endDate,
            timeNum,
            timeType,
            current: 1
        };

        if (timeNum) {
            const path: string = `${Utils.routerRootPath}${Utils.routerPaths.dosageMgr.path}`;
            Common.CommonFuncs.gotoPage(path, queryParams);
        } else {
            this.props.onChangeState({
                queryParams
            });
        }
    }

    private checkOrInit(): void {
        if (!this.props.inited) {
            const from = (this.props.queryParams.current - 1) * this.props.queryParams.pageSize;

            const { accountID, pageSize, sort, desc, startDate, endDate } = this.props.queryParams;
            this.props.onPromiseQueryDosageList(accountID, startDate, endDate, from, pageSize, sort, desc);
    
            this.props.onChangeState({
                inited:     true
            });
        }
    }

    // 处理加载状态
    private parseLoading(): void {
        this.loading.spinning = this.props.queryDosageListPending;
    }

    // 处理分页
    private parsePagination(): void {
        if (this.props.queryDosageListResult) {
            this.pagination.total       = this.props.queryDosageListResult.total;
            this.pagination.current     = Number(this.props.queryParams.current);
            this.pagination.pageSize    = Number(this.props.queryParams.pageSize);
        }
    }
    
    // 时间转换
    private renderDosageTimeColumn(startDate: number): string {
        const data = `${Common.CommonFuncs.displayDateTime(startDate)}`;
        return data;
    }

    // 消费金额
    private renderMoneyColumn(incByFen: number): string {
        const data = Math.abs((incByFen / 100)).toFixed(2);
        return data;
    }
    
    // key
    private handleTableRowKey(dosage: Utils.ApiTypes.DosageInfo): string {
        return String(dosage.dosageID);
    }

    // 改变时调用
    private handleTableChange(pagination: PaginationProps): void {
        const { current = 1, pageSize = 10 } = pagination;
        
        const queryParams = {
            ...this.props.queryParams,
            current,
            pageSize
        };

        const path: string = `${Utils.routerRootPath}${Utils.routerPaths.dosageMgr.path}`;
        Common.CommonFuncs.gotoPage(path, queryParams);
    }

    // 刷新
    private handleRefreshButtonClick(): void {
        const path: string = `${Utils.routerRootPath}${Utils.routerPaths.dosageMgr.path}`;
        Common.CommonFuncs.gotoPage(path, this.props.queryParams);
    }

    private handleChangeAccount(accountID: number): void {
        const queryParams = {
            ...this.props.queryParams,
            accountID
        };

        const path: string = `${Utils.routerRootPath}${Utils.routerPaths.dosageMgr.path}`;
        Common.CommonFuncs.gotoPage(path, queryParams);
    }
}

const mapStateToProps = (state) => {
    const props = Common.ReducerTool.Funcs.mapStateToProps(state, ActionTypes.stateKey);
    return props;
};

const mapDispatchToProps = (dispatch: any): DosageMgrEvents => {
    const events: DosageMgrEvents = {
        onChangeState: (params: any): void => {
            const action = Actions.changeState(params);
            dispatch(action);
        },

        onPromiseQueryDosageList: (
            accountID:  number, 
            startDate:  number, 
            endDate:    number, 
            from:       number, 
            count:      number,  
            sort:       string, 
            desc:       boolean
        ) => {
            const action = Actions.promiseQueryDosageList(
                accountID, startDate, endDate, from, count, sort, desc);

            dispatch(action);
        },
    };

    return events;
};

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(DosageMarPage));
