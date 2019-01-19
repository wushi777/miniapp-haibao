import React                                from 'react';
import { connect }                          from 'react-redux';
import { Button, Input }                    from 'antd';

import * as Common                          from '../../../common';
import * as Utils                           from '../../../utils';

import * as Actions                         from './actions';
import * as ActionTypes                     from './actionTypes';
import * as Reducer                         from './reducer';
import * as Views                           from './views';

import { view as WrappedPosterSlideDrawer } from '../../../drawers/PosterSlideDrawer';

import './style.less';

interface PosterSlidesEvents {
    onChangeState: (params: Reducer.PosterSlidesChangeStates) => void;

    onQueryPosterSlidePageData: (
        q:      string, 
        sort:   string, 
        desc:   boolean, 
        from:   number, 
        count:  number
    ) => void;

    onDeletePosterSlide: (posterSlideID: number) => void;
}

interface PosterSlidesProps extends Reducer.PosterSlidesStates, PosterSlidesEvents {}

class PosterSlidesPage extends React.PureComponent<PosterSlidesProps, any> {
    constructor(props: PosterSlidesProps) {
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

        if (this.props.deletePosterSlideResult) {
            this.props.onChangeState({
                inited:             false,
                deletePosterSlideResult: false
            });

            Utils.umessage.success('删除成功');
        }
    }

    public render(): React.ReactNode {
        return (
            <div className="posterSlidePage">
                {/* 操作 */}
                <div className="posterSlideTitle">
                    <Button 
                        type="primary" 
                        onClick={this.handleAddPosterSlide} 
                        className="addPosterSlide"
                    >
                        添加
                    </Button>
                    
                    <Input.Search
                        placeholder="请输入关键字"
                        onSearch={this.handleSearch}
                        enterButton={true}
                    />
                </div>

                {/* 抽屉 */}
                {this.renderDrawerView()}
                
                {/* 表格 */}
                <Views.PosterSlidesTable
                    queryLoading={this.props.queryPosterSlidePageDataPending}
                    deleteLoading={this.props.deletePosterSlidePending}
                    current={Number(this.props.queryParams.current)}
                    pageSize={Number(this.props.queryParams.pageSize)}
                    total={this.props.queryPosterSlidePageDataResult ? this.props.queryPosterSlidePageDataResult.total : 0}
                    posterSlidesList={this.props.queryPosterSlidePageDataResult ? this.props.queryPosterSlidePageDataResult.data : []}
                    onTableChange={this.handleTableChange}
                    onModify={this.handleModifyPosterSlide}
                    onDelete={this.handleDeletePosterSlide}
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
    
            this.props.onQueryPosterSlidePageData(search, sort, desc, from, pageSize);
        }
    }

    // 搜索
    private handleSearch(value: string): void {
        const queryParams = {
            ...this.props.queryParams,
            search: value
        };

        const path: string = `${Utils.routerRootPath}${Utils.routerPaths.posterSlides.path}`;
        Common.CommonFuncs.gotoPage(path, queryParams);
    }

    // 渲染抽屉视图
    private renderDrawerView(): React.ReactNode {
        if (this.props.showDrawer) {
            return (
                <WrappedPosterSlideDrawer 
                    onClose={this.handleCloseDrawer} 
                    drawerViewStatus={this.props.drawerViewStatus} 
                    posterSlide={this.props.posterSlide} 
                />
            );
        } else {
            return null;
        }
    }

    // 关闭抽屉视图
    private handleCloseDrawer(e: any, createdOrModified: boolean): void {
        const params: Reducer.PosterSlidesChangeStates = {
            showDrawer: false
        };
        
        if (createdOrModified) {
            params.inited = false;
        }
        
        this.props.onChangeState(params);
    }

    // 新增用户
    private handleAddPosterSlide(): void {
        this.props.onChangeState({
            showDrawer:     true,
            posterSlide:    null
        });
    }

    // 切换表格页码
    private handleTableChange(current: number, pageSize: number): void {
        const queryParams = {
            ...this.props.queryParams,
            current,
            pageSize
        };

        const path: string = `${Utils.routerRootPath}${Utils.routerPaths.posterSlides.path}`;
        Common.CommonFuncs.gotoPage(path, queryParams);
    }

    // 修改海报
    private handleModifyPosterSlide(posterSlide: Utils.ApiTypes.PosterSlideInfo): void {
        this.props.onChangeState({
            showDrawer: true,
            posterSlide
        });
    }

    // 删除海报
    private handleDeletePosterSlide(posterSlide: Utils.ApiTypes.PosterSlideInfo): void {
        this.props.onDeletePosterSlide(posterSlide.posterSlideID);
    }
}

const mapStateToProps = (state: any) => {
    const props = Common.ReducerTool.Funcs.mapStateToProps(state, ActionTypes.stateKey);
    return props;
};

const mapDispatchToProps = (dispatch: any, ownProps: any) => {
    const events: PosterSlidesEvents = {
        onChangeState: (params: any): void => {
            const action = Actions.changeState(params);
            dispatch(action);
        },

        onQueryPosterSlidePageData: (
            q:      string, 
            sort:   string, 
            desc:   boolean, 
            from:   number, 
            count:  number
        ): void => {
            const action = Actions.queryPosterSlidePageData(q, sort, desc, from, count);
            dispatch(action);
        },

        onDeletePosterSlide: (posterSlideID: number): void => {
            const action = Actions.deletePosterSlide(posterSlideID);
            dispatch(action);
        }
    };

    return events;
};

export default connect(mapStateToProps, mapDispatchToProps)(PosterSlidesPage);