import React                from 'react';
import { connect }          from 'react-redux';
import { Button, Input }    from 'antd';

import * as Common          from '../../../common';
import * as Utils           from '../../../utils';

import * as Actions         from './actions';
import * as ActionTypes     from './actionTypes';
import * as Reducer         from './reducer';
import * as Views           from './views';

import { 
    view as WrappedShopSlideDrawer 
} from '../../../drawers/ShopSlideDrawer';

import './style.less';

interface ShopSlidesEvents {
    onChangeState: (params: Reducer.ShopSlidesChangeStates) => void;

    onQueryShopSlidePageData: (
        q:      string, 
        sort:   string, 
        desc:   boolean, 
        from:   number, 
        count:  number
    ) => void;

    onDeleteShopSlide: (shopSlideID: number) => void;
}

interface ShopSlidesProps extends Reducer.ShopSlidesStates, ShopSlidesEvents {}

class ShopSlidesPage extends React.PureComponent<ShopSlidesProps, any> {
    constructor(props: ShopSlidesProps) {
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

        if (this.props.deleteShopSlideResult) {
            this.props.onChangeState({
                inited:             false,
                deleteShopSlideResult: false
            });

            Utils.umessage.success('删除成功');
        }
    }

    public render(): React.ReactNode {
        return (
            <div className="shopSlidePage">
                {/* 操作 */}
                <div className="shopSlideTitle">
                    <Button type="primary" onClick={this.handleAddShopSlide} className="addShopSlide">添加</Button>
                    <Input.Search
                        placeholder="请输入关键字"
                        onSearch={this.handleSearch}
                        enterButton={true}
                    />
                </div>

                {/* 抽屉 */}
                {this.renderDrawerView()}
                
                {/* 表格 */}
                <Views.ShopSlidesTable
                    queryLoading={this.props.queryShopSlidePageDataPending}
                    deleteLoading={this.props.deleteShopSlidePending}
                    current={Number(this.props.queryParams.current)}
                    pageSize={Number(this.props.queryParams.pageSize)}
                    total={this.props.queryShopSlidePageDataResult ? this.props.queryShopSlidePageDataResult.total : 0}
                    shopSlidesList={this.props.queryShopSlidePageDataResult ? this.props.queryShopSlidePageDataResult.data : []}
                    onTableChange={this.handleTableChange}
                    onModify={this.handleModifyShopSlide}
                    onDelete={this.handleDeleteShopSlide}
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
    
            this.props.onQueryShopSlidePageData(search, sort, desc, from, pageSize);
        }
    }

    // 搜索
    private handleSearch(value: string): void {
        const queryParams = {
            ...this.props.queryParams,
            search: value
        };

        const path: string = `${Utils.routerRootPath}${Utils.routerPaths.shopSlides.path}`;
        Common.CommonFuncs.gotoPage(path, queryParams);
    }

    // 渲染抽屉视图
    private renderDrawerView(): React.ReactNode {
        if (this.props.showDrawer) {
            return (
                <WrappedShopSlideDrawer 
                    onClose={this.handleCloseDrawer} 
                    drawerViewStatus={this.props.drawerViewStatus} 
                    shopSlide={this.props.shopSlide} 
                />
            );
        } else {
            return null;
        }
    }

    // 关闭抽屉视图
    private handleCloseDrawer(e: any, createdOrModified: boolean): void {
        const params: Reducer.ShopSlidesChangeStates = {
            showDrawer: false
        };
        
        if (createdOrModified) {
            params.inited = false;
        }
        
        this.props.onChangeState(params);
    }

    // 新增用户
    private handleAddShopSlide(): void {
        this.props.onChangeState({
            showDrawer: true,
            shopSlide:  null
        });
    }

    // 切换表格页码
    private handleTableChange(current: number, pageSize: number): void {
        const queryParams = {
            ...this.props.queryParams,
            current,
            pageSize
        };

        const path: string = `${Utils.routerRootPath}${Utils.routerPaths.shopSlides.path}`;
        Common.CommonFuncs.gotoPage(path, queryParams);
    }

    // 修改海报
    private handleModifyShopSlide(shopSlide: Utils.ApiTypes.ShopSlideInfo): void {
        this.props.onChangeState({
            showDrawer: true,
            shopSlide
        });
    }

    // 删除海报
    private handleDeleteShopSlide(shopSlide: Utils.ApiTypes.ShopSlideInfo): void {
        this.props.onDeleteShopSlide(shopSlide.shopSlideID);
    }
}

const mapStateToProps = (state: any) => {
    const props = Common.ReducerTool.Funcs.mapStateToProps(state, ActionTypes.stateKey);
    return props;
};

const mapDispatchToProps = (dispatch: any, ownProps: any) => {
    const events: ShopSlidesEvents = {
        onChangeState: (params: any): void => {
            const action = Actions.changeState(params);
            dispatch(action);
        },

        onQueryShopSlidePageData: (
            q:      string, 
            sort:   string, 
            desc:   boolean, 
            from:   number, 
            count:  number
        ): void => {
            const action = Actions.queryShopSlidePageData(q, sort, desc, from, count);
            dispatch(action);
        },

        onDeleteShopSlide: (shopSlideID: number): void => {
            const action = Actions.deleteShopSlide(shopSlideID);
            dispatch(action);
        }
    };

    return events;
};

export default connect(mapStateToProps, mapDispatchToProps)(ShopSlidesPage);