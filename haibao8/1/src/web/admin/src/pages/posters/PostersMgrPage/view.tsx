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
    view as WrappedPosterDrawer 
} from '../../../drawers/PosterDrawer';

import './style.less';

interface PostersMgrEvents {
    onChangeState: (params: Reducer.PosterMgrChangeStates) => void;

    onQueryPosterPageData: (
        q:      string, 
        sort:   string, 
        desc:   boolean, 
        from:   number, 
        count:  number
    ) => void;

    onDeletePoster: (posterID: number) => void;
}

interface PostersMgrProps extends Reducer.PostersMgrStates, PostersMgrEvents {}

class PostersMgrPage extends React.PureComponent<PostersMgrProps, any> {
    constructor(props: PostersMgrProps) {
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

        if (this.props.deletePosterResult) {
            this.props.onChangeState({
                inited:             false,
                deletePosterResult: false
            });

            Utils.umessage.success('删除成功');
        }
    }

    public render(): React.ReactNode {
        return (
            <div className="posterPage">
                {/* 操作 */}
                <div className="posterTitle">
                    <Button type="primary" onClick={this.handleAddPoster} className="addPoster">添加</Button>
                    <Input.Search
                        placeholder="请输入关键字"
                        onSearch={this.handleSearch}
                        enterButton={true}
                    />
                </div>

                {/* 抽屉 */}
                {this.renderDrawerView()}
                
                {/* 表格 */}
                <Views.PostersTable
                    queryLoading={this.props.queryPosterPageDataPending}
                    deleteLoading={this.props.deletePosterPending}
                    current={Number(this.props.queryParams.current)}
                    pageSize={Number(this.props.queryParams.pageSize)}
                    total={this.props.queryPosterPageDataResult ? this.props.queryPosterPageDataResult.total : 0}
                    postersList={this.props.queryPosterPageDataResult ? this.props.queryPosterPageDataResult.data : []}
                    onTableChange={this.handleTableChange}
                    onModify={this.handleModifyPoster}
                    onDelete={this.handleDeletePoster}
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
    
            this.props.onQueryPosterPageData(search, sort, desc, from, pageSize);
        }
    }

    // 搜索
    private handleSearch(value: string): void {
        const queryParams = {
            ...this.props.queryParams,
            search: value
        };

        const path: string = `${Utils.routerRootPath}${Utils.routerPaths.postersMgr.path}`;
        Common.CommonFuncs.gotoPage(path, queryParams);
    }

    // 渲染抽屉视图
    private renderDrawerView(): React.ReactNode {
        if (this.props.showDrawer) {
            return (
                <WrappedPosterDrawer 
                    onClose={this.handleCloseDrawer} 
                    drawerViewStatus={this.props.drawerViewStatus} 
                    poster={this.props.poster} 
                />
            );
        } else {
            return null;
        }
    }

    // 关闭抽屉视图
    private handleCloseDrawer(e: any, createdOrModified: boolean): void {
        const params: Reducer.PosterMgrChangeStates = {
            showDrawer: false
        };
        
        if (createdOrModified) {
            params.inited = false;
        }
        
        this.props.onChangeState(params);
    }

    // 新增用户
    private handleAddPoster(): void {
        this.props.onChangeState({
            showDrawer: true,
            poster:     null
        });
    }

    // 切换表格页码
    private handleTableChange(current: number, pageSize: number): void {
        const queryParams = {
            ...this.props.queryParams,
            current,
            pageSize
        };

        const path: string = `${Utils.routerRootPath}${Utils.routerPaths.postersMgr.path}`;
        Common.CommonFuncs.gotoPage(path, queryParams);
    }

    // 修改海报
    private handleModifyPoster(poster: Utils.ApiTypes.PosterInfo): void {
        this.props.onChangeState({
            showDrawer: true,
            poster
        });
    }

    // 删除海报
    private handleDeletePoster(poster: Utils.ApiTypes.PosterInfo): void {
        this.props.onDeletePoster(poster.posterID);
    }
}

const mapStateToProps = (state: any) => {
    const props = Common.ReducerTool.Funcs.mapStateToProps(state, ActionTypes.stateKey);
    return props;
};

const mapDispatchToProps = (dispatch: any, ownProps: any) => {
    const events: PostersMgrEvents = {
        onChangeState: (params: any): void => {
            const action = Actions.changeState(params);
            dispatch(action);
        },

        onQueryPosterPageData: (
            q:      string, 
            sort:   string, 
            desc:   boolean, 
            from:   number, 
            count:  number
        ): void => {
            const action = Actions.queryPosterPageData(q, sort, desc, from, count);
            dispatch(action);
        },

        onDeletePoster: (posterID: number): void => {
            const action = Actions.deletePoster(posterID);
            dispatch(action);
        }
    };

    return events;
};

export default connect(mapStateToProps, mapDispatchToProps)(PostersMgrPage);