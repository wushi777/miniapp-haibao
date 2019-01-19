import React                from 'react';
import { connect }          from 'react-redux';
import { Button, Input }    from 'antd';

import * as Common          from '../../../common';
import * as Utils           from '../../../utils';

import * as Actions         from './actions';
import * as ActionTypes     from './actionTypes';
import * as Reducer         from './reducer';
import * as Views           from './views';

import { view as WrappedShopCatDrawer } from '../../../drawers/ShopCatDrawer';

import './style.less';

interface ShopCatsEvents {
    onChangeState: (params: Reducer.ShopCatsChangeStates) => void;

    onQueryShopCatPageData: (
        q: string, 
        sort: string, 
        desc: boolean, 
        from: number, 
        count: number
    ) => void;

    onDeleteShopCat: (shopCatID: number) => void;
}

interface ShopCatsProps extends Reducer.ShopCatsStates, ShopCatsEvents {}

class ShopCatsPage extends React.PureComponent<ShopCatsProps, any> {
    constructor(props: ShopCatsProps) {
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

        if (this.props.deleteShopCatResult) {
            this.props.onChangeState({
                inited:             false,
                deleteShopCatResult: false
            });

            Utils.umessage.success('删除成功');
        }
    }

    public render(): React.ReactNode {
        return (
            <div className="shopCatPage">
                {/* 操作 */}
                <div className="shopCatTitle">
                    <Button type="primary" onClick={this.handleAddShopCat} className="addShopCat">添加</Button>
                    <Input.Search
                        placeholder="请输入关键字"
                        onSearch={this.handleSearch}
                        enterButton={true}
                    />
                </div>

                {/* 抽屉 */}
                {this.renderDrawerView()}
                
                {/* 表格 */}
                <Views.ShopCatsTable
                    queryLoading={this.props.queryShopCatPageDataPending}
                    deleteLoading={this.props.deleteShopCatPending}
                    current={Number(this.props.queryParams.current)}
                    pageSize={Number(this.props.queryParams.pageSize)}
                    total={this.props.queryShopCatPageDataResult ? this.props.queryShopCatPageDataResult.total : 0}
                    shopCatsList={this.props.queryShopCatPageDataResult ? this.props.queryShopCatPageDataResult.data : []}
                    onTableChange={this.handleTableChange}
                    onModify={this.handleModifyShopCat}
                    onDelete={this.handleDeleteShopCat}
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
    
            this.props.onQueryShopCatPageData(search, sort, desc, from, pageSize);
        }
    }

    // 搜索
    private handleSearch(value: string): void {
        const queryParams = {
            ...this.props.queryParams,
            search: value
        };

        const path: string = `${Utils.routerRootPath}${Utils.routerPaths.shopCats.path}`;
        Common.CommonFuncs.gotoPage(path, queryParams);
    }

    // 渲染抽屉视图
    private renderDrawerView(): React.ReactNode {
        if (this.props.showDrawer) {
            return (
                <WrappedShopCatDrawer 
                    onClose={this.handleCloseDrawer} 
                    drawerViewStatus={this.props.drawerViewStatus} 
                    shopCat={this.props.shopCat} 
                />
            );
        } else {
            return null;
        }
    }

    // 关闭抽屉视图
    private handleCloseDrawer(e: any, createdOrModified: boolean): void {
        const params: Reducer.ShopCatsChangeStates = {
            showDrawer: false
        };
        
        if (createdOrModified) {
            params.inited = false;
        }
        
        this.props.onChangeState(params);
    }

    // 新增用户
    private handleAddShopCat(): void {
        this.props.onChangeState({
            showDrawer: true,
            shopCat:  null
        });
    }

    // 切换表格页码
    private handleTableChange(current: number, pageSize: number): void {
        const queryParams = {
            ...this.props.queryParams,
            current,
            pageSize
        };

        const path: string = `${Utils.routerRootPath}${Utils.routerPaths.shopCats.path}`;
        Common.CommonFuncs.gotoPage(path, queryParams);
    }

    // 修改海报
    private handleModifyShopCat(shopCat: Utils.ApiTypes.ShopCatInfo): void {
        this.props.onChangeState({
            showDrawer: true,
            shopCat
        });
    }

    // 删除海报
    private handleDeleteShopCat(shopCat: Utils.ApiTypes.ShopCatInfo): void {
        this.props.onDeleteShopCat(shopCat.shopCatID);
    }
}

const mapStateToProps = (state: any) => {
    const props = Common.ReducerTool.Funcs.mapStateToProps(state, ActionTypes.stateKey);
    return props;
};

const mapDispatchToProps = (dispatch: any, ownProps: any) => {
    const events: ShopCatsEvents = {
        onChangeState: (params: any): void => {
            const action = Actions.changeState(params);
            dispatch(action);
        },

        onQueryShopCatPageData: (
            q:      string, 
            sort:   string, 
            desc:   boolean, 
            from:   number, 
            count:  number
        ): void => {
            const action = Actions.queryShopCatPageData(q, sort, desc, from, count);
            dispatch(action);
        },

        onDeleteShopCat: (shopCatID: number): void => {
            const action = Actions.deleteShopCat(shopCatID);
            dispatch(action);
        }
    };

    return events;
};

export default connect(mapStateToProps, mapDispatchToProps)(ShopCatsPage);