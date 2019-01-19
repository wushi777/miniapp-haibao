import React            from 'react';
import { connect }      from 'react-redux';

import * as Common      from '../../../common';
import * as Utils       from '../../../utils';

import * as Actions     from './actions';
import * as ActionTypes from './actionTypes';
import * as Reducer     from './reducer';
import * as Views       from './views';

import { 
    view as WrappedShopDrawer 
} from '../../../drawers/ShopDrawer';

import { 
    Input 
} from 'antd';

import './style.less';

interface ShopsMgrEvents {
    onChangeState: (params: Reducer.ShopMgrChangeStates) => void;

    onQueryShopPageData:    (
        q:      string, 
        sort:   string, 
        desc:   boolean, 
        from:   number, 
        count:  number
    ) => void;
}

interface ShopsMgrProps extends Reducer.ShopsMgrStates, ShopsMgrEvents {}

class ShopsMgrPage extends React.PureComponent<ShopsMgrProps, any> {
    constructor(props: ShopsMgrProps) {
        super(props);

        Common.CommonFuncs.bindObjectHandleMethods(this);
    }

    public componentDidMount(): void {
        this.init();
    }

    public componentDidUpdate(): void {
        this.init();

        if (this.props.error) {
            this.props.onChangeState({ error: null });

            Utils.umessage.error(this.props.error.message);
        }

        // if (this.props.deleteShopResult) {
        //     this.props.onChangeState({
        //         inited:             false,
        //         deleteShopResult: false
        //     });

        //     Utils.umessage.success('删除成功');
        // }
    }

    public render(): React.ReactNode {
        return (
            <div className="shopPage">
                {/* 操作 */}
                <div className="shopTitle">
                    {/* <Button type="primary" onClick={this.handleAddShop} className="addShop">添加</Button> */}
                    <Input.Search
                        placeholder="请输入关键字"
                        onSearch={this.handleSearch}
                        enterButton={true}
                    />
                </div>

                {/* 抽屉 */}
                {this.renderDrawerView()}
                
                {/* 表格 */}
                <Views.ShopsTable
                    queryLoading={this.props.queryShopPageDataPending}
                    // deleteLoading={this.props.deleteShopPending}
                    current={Number(this.props.queryParams.current)}
                    pageSize={Number(this.props.queryParams.pageSize)}
                    total={this.props.queryShopPageDataResult ? this.props.queryShopPageDataResult.total : 0}
                    shopsList={this.props.queryShopPageDataResult ? this.props.queryShopPageDataResult.data : []}
                    onTableChange={this.handleTableChange}
                    onReview={this.handleReviewShop}
                    // onDelete={this.handleDeleteShop}
                />
            </div>
        );
    }

    // 初始化页面
    private init(): void {
        if (!this.props.inited) {
            this.props.onChangeState({ 
                inited: true
            });

            const { search, current, pageSize, sort, desc } = this.props.queryParams;
            const from = (current - 1) * pageSize;
    
            this.props.onQueryShopPageData(search, sort, desc, from, pageSize);
        }
    }

    // 搜索
    private handleSearch(value: string): void {
        const queryParams = {
            ...this.props.queryParams,
            search: value
        };

        const path: string = `${Utils.routerRootPath}${Utils.routerPaths.shopsMgr.path}`;
        Common.CommonFuncs.gotoPage(path, queryParams);
    }

    // 渲染抽屉视图
    private renderDrawerView(): React.ReactNode {
        if (this.props.showDrawer) {
            return (
                <WrappedShopDrawer 
                    onClose={this.handleCloseDrawer} 
                    // drawerViewStatus={this.props.drawerViewStatus} 
                    shop={this.props.shop} 
                />
            );
        } else {
            return null;
        }
    }

    // 关闭抽屉视图
    private handleCloseDrawer(e: any, createdOrModified: boolean): void {
        const params: Reducer.ShopMgrChangeStates = {
            showDrawer: false
        };
        
        if (createdOrModified) {
            params.inited = false;
        }
        
        this.props.onChangeState(params);
    }

    // 切换表格页码
    private handleTableChange(current: number, pageSize: number): void {
        const queryParams = {
            ...this.props.queryParams,
            current,
            pageSize
        };

        const path: string = `${Utils.routerRootPath}${Utils.routerPaths.shopsMgr.path}`;
        Common.CommonFuncs.gotoPage(path, queryParams);
    }

    // 修改海报
    private handleReviewShop(shop: Utils.ApiTypes.ShopInfo): void {
        this.props.onChangeState({
            showDrawer: true,
            shop
        });
    }

    // // 删除海报
    // private handleDeleteShop(shop: Utils.ApiTypes.ShopInfo): void {
    //     this.props.onDeleteShop(shop.shopID);
    // }
}

const mapStateToProps = (state: any) => {
    const props = Common.ReducerTool.Funcs.mapStateToProps(state, ActionTypes.stateKey);
    return props;
};

const mapDispatchToProps = (dispatch: any, ownProps: any) => {
    const events: ShopsMgrEvents = {
        onChangeState: (params: any): void => {
            const action = Actions.changeState(params);
            dispatch(action);
        },

        onQueryShopPageData: (
            q:      string, 
            sort:   string, 
            desc:   boolean, 
            from:   number, 
            count:  number
        ): void => {
            const action = Actions.queryShopPageData(q, sort, desc, from, count);
            dispatch(action);
        },

        // onDeleteShop: (shopID: number): void => {
        //     const action = Actions.deleteShop(shopID);
        //     dispatch(action);
        // }
    };

    return events;
};

export default connect(mapStateToProps, mapDispatchToProps)(ShopsMgrPage);