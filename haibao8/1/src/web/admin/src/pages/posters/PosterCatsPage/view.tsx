import React                                from 'react';
import { connect }                          from 'react-redux';
import { Button, Input }                    from 'antd';

import * as Common                          from '../../../common';
import * as Utils                           from '../../../utils';

import * as Actions                         from './actions';
import * as ActionTypes                     from './actionTypes';
import * as Reducer                         from './reducer';
import * as Views                           from './views';

import { view as WrappedPosterCatDrawer }   from '../../../drawers/PosterCatDrawer';

import './style.less';

interface PosterCatsEvents {
    onChangeState: (params: Reducer.PosterCatsChangeStates) => void;

    onQueryPosterCatPageData: (
        q:      string, 
        sort:   string, 
        desc:   boolean, 
        from:   number, 
        count:  number
    ) => void;

    onDeletePosterCat: (posterCatID: number) => void;
}

interface PosterCatsProps extends Reducer.PosterCatsStates, PosterCatsEvents {}

class PosterCatsPage extends React.PureComponent<PosterCatsProps, any> {
    constructor(props: PosterCatsProps) {
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

        if (this.props.deletePosterCatResult) {
            this.props.onChangeState({
                inited:             false,
                deletePosterCatResult: false
            });

            Utils.umessage.success('删除成功');
        }
    }

    public render(): React.ReactNode {
        return (
            <div className="posterCatPage">
                {/* 操作 */}
                <div className="posterCatTitle">
                    <Button type="primary" onClick={this.handleAddPosterCat} className="addPosterCat">添加</Button>
                    <Input.Search
                        placeholder="请输入关键字"
                        onSearch={this.handleSearch}
                        enterButton={true}
                    />
                </div>

                {/* 抽屉 */}
                {this.renderDrawerView()}
                
                {/* 表格 */}
                <Views.PosterCatsTable
                    queryLoading={this.props.queryPosterCatPageDataPending}
                    deleteLoading={this.props.deletePosterCatPending}
                    current={Number(this.props.queryParams.current)}
                    pageSize={Number(this.props.queryParams.pageSize)}
                    total={this.props.queryPosterCatPageDataResult ? this.props.queryPosterCatPageDataResult.total : 0}
                    posterCatsList={this.props.queryPosterCatPageDataResult ? this.props.queryPosterCatPageDataResult.data : []}
                    onTableChange={this.handleTableChange}
                    onModify={this.handleModifyPosterCat}
                    onDelete={this.handleDeletePosterCat}
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
    
            this.props.onQueryPosterCatPageData(search, sort, desc, from, pageSize);
        }
    }

    // 搜索
    private handleSearch(value: string): void {
        const queryParams = {
            ...this.props.queryParams,
            search: value
        };

        const path: string = `${Utils.routerRootPath}${Utils.routerPaths.posterCats.path}`;
        Common.CommonFuncs.gotoPage(path, queryParams);
    }

    // 渲染抽屉视图
    private renderDrawerView(): React.ReactNode {
        if (this.props.showDrawer) {
            return (
                <WrappedPosterCatDrawer 
                    onClose={this.handleCloseDrawer} 
                    drawerViewStatus={this.props.drawerViewStatus} 
                    posterCat={this.props.posterCat} 
                />
            );
        } else {
            return null;
        }
    }

    // 关闭抽屉视图
    private handleCloseDrawer(e: any, createdOrModified: boolean): void {
        const params: Reducer.PosterCatsChangeStates = {
            showDrawer: false
        };
        
        if (createdOrModified) {
            params.inited = false;
        }
        
        this.props.onChangeState(params);
    }

    // 新增用户
    private handleAddPosterCat(): void {
        this.props.onChangeState({
            showDrawer: true,
            posterCat:  null
        });
    }

    // 切换表格页码
    private handleTableChange(current: number, pageSize: number): void {
        const queryParams = {
            ...this.props.queryParams,
            current,
            pageSize
        };

        const path: string = `${Utils.routerRootPath}${Utils.routerPaths.posterCats.path}`;
        Common.CommonFuncs.gotoPage(path, queryParams);
    }

    // 修改海报
    private handleModifyPosterCat(posterCat: Utils.ApiTypes.PosterCatInfo): void {
        this.props.onChangeState({
            showDrawer: true,
            posterCat
        });
    }

    // 删除海报
    private handleDeletePosterCat(posterCat: Utils.ApiTypes.PosterCatInfo): void {
        this.props.onDeletePosterCat(posterCat.posterCatID);
    }
}

const mapStateToProps = (state: any) => {
    const props = Common.ReducerTool.Funcs.mapStateToProps(state, ActionTypes.stateKey);
    return props;
};

const mapDispatchToProps = (dispatch: any, ownProps: any) => {
    const events: PosterCatsEvents = {
        onChangeState: (params: any): void => {
            const action = Actions.changeState(params);
            dispatch(action);
        },

        onQueryPosterCatPageData: (
            q:      string, 
            sort:   string, 
            desc:   boolean, 
            from:   number, 
            count:  number
        ): void => {
            const action = Actions.queryPosterCatPageData(q, sort, desc, from, count);
            dispatch(action);
        },

        onDeletePosterCat: (posterCatID: number): void => {
            const action = Actions.deletePosterCat(posterCatID);
            dispatch(action);
        }
    };

    return events;
};

export default connect(mapStateToProps, mapDispatchToProps)(PosterCatsPage);