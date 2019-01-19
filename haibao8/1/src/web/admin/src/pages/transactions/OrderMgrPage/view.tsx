import React                    from 'react';
import { connect }              from 'react-redux';
import { RouteComponentProps }  from 'react-router';
import { FormComponentProps }   from 'antd/lib/form'; 
import { PaginationProps }      from 'antd/lib/pagination';

import * as Common              from '../../../common';
import * as Utils               from '../../../utils';

import * as Actions             from './actions';
import { stateKey }             from './actionTypes';
import * as Consts              from './consts';
import * as Reducer             from './reducer';
import * as Views               from './views';

import { 
    message, 
    Table, 
    Button, 
    Form 
} from 'antd';

import './style.less';

interface OrderMgrEvents {
    onChangeState: (params: {}) => void;   // 重置state

    onPromiseQueryOrderList: (
        accountID:  number, 
        from:       number, 
        count:      number, 
        sort:       string, 
        desc:       boolean, 
        startDate:  number, 
        endDate:    number
    ) => void;   // 获取订单列表
}

interface OrderMgrProps extends RouteComponentProps<any, any>, FormComponentProps, Reducer.OrderMgrStates, OrderMgrEvents {}

class OrderMgrPage extends React.Component<OrderMgrProps, any> {
    private loading:    Utils.Interfaces.Loading    = { delay: 500 };
    private pagination: PaginationProps             = Utils.initPagination();
    private columns:    any[];

    constructor(props: OrderMgrProps) {
        super(props);

        this.columns = [
            Consts.conOrderIDColumn,
            Consts.conAccountIDColumn,
            Consts.conCreateDateColumn,
            Consts.conOrderMoneyFenColumn, 
            Consts.conOrderStatusColumn,
            Consts.conPayMethodColumn
        ];

        // 字段修改
        Consts.conCreateDateColumn.render       = this.renderCreateDateColumn.bind(this);
        Consts.conOrderMoneyFenColumn.render    = this.renderOrderMoneyFenColumn.bind(this);
        Consts.conOrderStatusColumn.render      = this.renderOrderStatusColumn.bind(this);
        Consts.conPayMethodColumn.render        = this.renderPayMethodColumn.bind(this);

        Common.CommonFuncs.bindObjectHandleMethods(this);
    }

    public componentDidMount() {
        this.checkOrInit();
    }

    public componentDidUpdate() {
        this.checkOrInit();        

        // 捕获error    
        if (this.props.error) {
            message.error(this.props.error.message);
            // 清空state
            this.props.onChangeState({
                error: null
            });
            return;
        }

    }

    public render() {
        this.parseLoading();
        this.parsePagination();
        return (
            <div className="ordermar">
                <div className="clearfix">
                    <Button 
                        type="primary" 
                        title="刷新" 
                        onClick={this.handleRefreshButtonClick}
                    >
                        刷新
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
                    dataSource={this.props.queryOrderListResult ? this.props.queryOrderListResult.data : []}
                    columns={this.columns}
                    loading={this.loading}
                    pagination={this.pagination}
                    onChange={this.handleTableChange}
                    rowKey={this.handleTableRowKey}
                />
            </div>
        );
    }

    private checkOrInit() {
        if (!this.props.inited) {
            this.props.onChangeState({
                inited: true
            });
    
            const { accountID, current, pageSize, sort, desc, startDate, endDate } = this.props.queryParams;
            const from: number = (current - 1) * pageSize;
            this.props.onPromiseQueryOrderList(accountID, from, pageSize, sort, desc, startDate, endDate);
        }
    }

    // 处理加载状态
    private parseLoading(): void {
        this.loading.spinning = this.props.queryOrderListPending;
    }

    // 处理分页
    private parsePagination(): void {
        if (this.props.queryOrderListResult) {
            this.pagination.total       = this.props.queryOrderListResult.total;
            this.pagination.current     = Number(this.props.queryParams.current);
            this.pagination.pageSize    = Number(this.props.queryParams.pageSize);
        }
    }

    // key
    private handleTableRowKey(order: Utils.ApiTypes.OrderInfo): string {
        return order.orderID.toString();
    }

    private handleTableChange(pagination: PaginationProps): void {
        const { current = 1, pageSize = 10 } = pagination;
        
        const queryParams = {
            ...this.props.queryParams,
            current,
            pageSize
        };

        const path: string = `${Utils.routerRootPath}${Utils.routerPaths.orderMgr.path}`;
        Common.CommonFuncs.gotoPage(path, queryParams);
    }

    private renderCreateDateColumn(createDate: number): string {
        const data = `${Common.CommonFuncs.displayDateTime(createDate)}`;
        return data;
    }

    private renderOrderMoneyFenColumn(orderMoneyFen: number): number {
        let data;
        if (Number(orderMoneyFen) <= 0) {
            data = <span style={{ color : 'red' }}>{( orderMoneyFen / 100 ).toFixed(2)}</span>;
        } else {
            data = <span>{( orderMoneyFen / 100 ).toFixed(2)}</span>;
        }
        return data;
    }

    private renderOrderStatusColumn(orderStatus: number): string {
        switch (orderStatus) {
            case 0:
                return '未支付';
                
            case 1:
                return '已支付';

            case 2:
                return '已取消';
                
            default:
                return '其他';
        }
    }

    private renderPayMethodColumn(order: Utils.ApiTypes.OrderInfo): string {
        if (order.orderStatus === 1) {
            switch (order.payMethod) {
                case 0:
                    return '未支付';
                    
                case 1:
                    return '微信支付';
                    
                case 2:
                    return '支付宝支付';
                    
                case 3:
                    return '系统赠送';
                    
                default:
                    return '其他';
            }
        }
        return  '-';
    }

    // 刷新
    private handleRefreshButtonClick() {
        const path: string = `${Utils.routerRootPath}${Utils.routerPaths.orderMgr.path}`;
        Common.CommonFuncs.gotoPage(path, this.props.queryParams);
    }

    private handleChangeAccount(accountID: number) {
        const queryParams = {
            ...this.props.queryParams,
            accountID
        };

        const path: string = `${Utils.routerRootPath}${Utils.routerPaths.orderMgr.path}`;
        Common.CommonFuncs.gotoPage(path, queryParams);
    }

    private handleChangeTime (startDate: number, endDate: number, timeNum: number, timeType: string) {
        const queryParams = {
            ...this.props.queryParams,
            startDate,
            endDate,
            timeNum,
            timeType,
            current: 1
        };

        if (timeNum) {
            const path: string = `${Utils.routerRootPath}${Utils.routerPaths.orderMgr.path}`;
            Common.CommonFuncs.gotoPage(path, queryParams);
        } else {
            this.props.onChangeState({
                queryParams
            });
        }
    }

}

const mapStateToProps = (state) => {
    const props = Common.ReducerTool.Funcs.mapStateToProps(state, stateKey);
    return props;
};

const mapDispatchToProps: any = (dispatch: any): OrderMgrEvents => {
    const events: OrderMgrEvents = {
        onChangeState: (params: any): void => {
            const action = Actions.changeState(params);
            dispatch(action);
        },

        onPromiseQueryOrderList: (
            accountID:  number, 
            from:       number, 
            count:      number, 
            sort:       string, 
            desc:       boolean, 
            startDate:  number, 
            endDate:    number
        ) => {
            const action = Actions.promiseQueryOrderList(
                accountID, from, count, sort, desc, startDate, endDate);
                
            dispatch(action);
        }
    };

    return events;
};

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(OrderMgrPage));