import React                from 'react';
import { Table }            from 'antd';
import { PaginationProps }  from 'antd/lib/pagination';

import * as Utils           from '../../../../utils';
import * as Common          from '../../../../common';

import OperationButtons     from './OperationButtons';

interface PosterSlidesTableProps {
    queryLoading:       boolean;
    deleteLoading:      boolean;
    total:              number;
    current:            number;
    pageSize:           number;
    posterSlidesList:     Utils.ApiTypes.PosterSlideInfo[];

    onModify:           (posterSlide: Utils.ApiTypes.PosterSlideInfo) => void;
    onDelete:           (posterSlide: Utils.ApiTypes.PosterSlideInfo) => void;
    onTableChange:      (current: number, pageSize: number) => void;
}

const PosterSlideIDColumn = {
    title:      '轮播ID',
    dataIndex:  'posterSlideID',
    key:        'posterSlideID',
    render:     null
};

const PosterSlideUrlColumn = {
    title:      '图片',
    dataIndex:  'posterSlideUrl',
    key:        'posterSlideUrl',
    render:     null
};

const PosterSlideNameColumn = {
    title:      '轮播名称', 
    dataIndex:  'posterSlideName',   
    key:        'posterSlideName',
    render:     null
};

const PosterSlideDescColumn = {
    title:      '轮播描述', 
    dataIndex:  'posterSlideDesc',   
    key:        'posterSlideDesc',
    render:     null
};

const PosterSlideLinkColumn = {
    title:      '链接地址',
    dataIndex:  'posterSlideLink',
    key:        'posterSlideLink',
    render:     null
};

const OrderNumColumn = {
    title:      '排序数',
    dataIndex:  'orderNum',
    key:        'orderNum',
    render:     null
};

const OperationColumn = {
    title:      '操作', 
    dataIndex:  '',   
    key:        'operation',
    render:     null
};

class PosterSlidesTable extends React.PureComponent<PosterSlidesTableProps, any> {
    private columns:        any[]                       = [];     
    private loading:        Utils.Interfaces.Loading    = { delay: 500 };
    private pagination:     PaginationProps             = Utils.initPagination();

    constructor(props: PosterSlidesTableProps) {
        super(props);

        this.columns = [
            PosterSlideIDColumn,
            PosterSlideUrlColumn,
            PosterSlideNameColumn,
            PosterSlideDescColumn,
            PosterSlideLinkColumn,
            OrderNumColumn,
            OperationColumn
        ];

        PosterSlideUrlColumn.render     = this.renderPosterSlideUrl.bind(this);
        PosterSlideLinkColumn.render    = this.renderPosterSlideLink.bind(this);
        OperationColumn.render          = this.renderOperationButtons.bind(this);

        Common.CommonFuncs.bindObjectHandleMethods(this);
    }

    public render(): React.ReactNode {
        this.parseLoading();
        this.parsePagination();

        return (
            <Table
                dataSource={this.props.posterSlidesList}
                columns={this.columns}
                loading={this.loading}
                pagination={this.pagination}
                onChange={this.handleTableChange}
                rowKey={this.handleTableRowKey}
            />
        );
    }

    // 处理加载状态显示信息
    private parseLoading(): void {
        this.loading.spinning   = this.props.queryLoading || this.props.deleteLoading;

        if (this.props.queryLoading) {
            this.loading.tip = '正在加载...';
        }

        if (this.props.deleteLoading) {
            this.loading.tip = '正在删除...';
        }
    }

    // 处理分页信息
    private parsePagination(): void {
        this.pagination.total       = this.props.total;
        this.pagination.current     = this.props.current;
        this.pagination.pageSize    = this.props.pageSize;
    }

    // 处理表格key
    private handleTableRowKey(posterSlide: Utils.ApiTypes.PosterSlideInfo): string {
        return String(posterSlide.posterSlideID);
    }

    // 切换页
    private handleTableChange(pagination: PaginationProps): void {
        const { current = 1, pageSize = 10 } = pagination;

        this.props.onTableChange(current, pageSize);
    }

    // 渲染操作按钮
    private renderOperationButtons(posterSlide: Utils.ApiTypes.PosterSlideInfo): React.ReactNode {
        return (
            <OperationButtons
                posterSlide={posterSlide}
                onModify={this.handleModify}
                onDelete={this.handleDelete}
            />
        );
    }

    private renderPosterSlideUrl(posterSlideUrl: string): React.ReactNode {
        return (
            <img src={posterSlideUrl} width={200} height={100}/>
        );
    }

    private renderPosterSlideLink(posterSlideLink: string): React.ReactNode {
        return (
            <a href={posterSlideLink} target="_blank">{posterSlideLink}</a>
        );
    }

    // 修改海报
    private handleModify(posterSlide: Utils.ApiTypes.PosterSlideInfo): void {
        this.props.onModify(posterSlide);
    }

    // 删除海报
    private handleDelete(posterSlide: Utils.ApiTypes.PosterSlideInfo): void {
        this.props.onDelete(posterSlide);
    }
}

export default PosterSlidesTable;