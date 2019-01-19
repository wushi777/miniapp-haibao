import React                from 'react';
import { Table }            from 'antd';
import { PaginationProps }  from 'antd/lib/pagination';

import * as Common          from '../../../../common';
import * as Utils           from '../../../../utils';

import OperationButtons     from './OperationButtons';

interface PostersTableProps {
    queryLoading:       boolean;
    deleteLoading:      boolean;
    total:              number;
    current:            number;
    pageSize:           number;
    postersList:        Utils.ApiTypes.PosterInfo[];

    onModify:           (poster: Utils.ApiTypes.PosterInfo) => void;
    onDelete:           (poster: Utils.ApiTypes.PosterInfo) => void;
    onTableChange:      (current: number, pageSize: number) => void;
}

const PosterIDColumn = {
    title:      '海报ID', 
    dataIndex:  'posterID',   
    key:        'posterID',
    render:     null
};

const ThumbColumn = {
    title:      '海报缩略图', 
    dataIndex:  'posterUrl',   
    key:        'thumbUrl',
    render:     null
};

const PosterNameColumn = {
    title:      '海报名称', 
    dataIndex:  'posterName',   
    key:        'posterName',
    render:     null
};

const PosterCatNamesColumn = {
    title:      '所属分类', 
    dataIndex:  'posterCatNames',   
    key:        'posterCatNames',
    render:     null
};

const PosterUrlColumn = {
    title:      '海报地址',
    dataIndex:  'posterUrl',
    key:        'posterUrl',
    render:     null
};

const CreateDateColumn = {
    title:      '创建时间', 
    dataIndex:  'createDate',   
    key:        'createDate',
    render:     null
};

const OperationColumn = {
    title:      '操作', 
    dataIndex:  '',   
    key:        'operation',
    render:     null
};

class PostersTable extends React.PureComponent<PostersTableProps, any> {
    private columns:        any[]                       = [];     
    private loading:        Utils.Interfaces.Loading    = { delay: 500 };
    private pagination:     PaginationProps             = Utils.initPagination();

    constructor(props: PostersTableProps) {
        super(props);

        this.columns = [
            PosterIDColumn,
            ThumbColumn,
            PosterNameColumn,
            PosterCatNamesColumn,
            CreateDateColumn,
            OperationColumn
        ];

        ThumbColumn.render          = this.renderThumb.bind(this);
        PosterCatNamesColumn.render = this.renderPosterCatNames.bind(this);
        PosterUrlColumn.render      = this.renderPosterUrl.bind(this);
        OperationColumn.render      = this.renderOperationButtons.bind(this);
        CreateDateColumn.render     = this.renderFormattedCreateDate.bind(this);

        Common.CommonFuncs.bindObjectHandleMethods(this);
    }

    public render(): React.ReactNode {
        this.parseLoading();
        this.parsePagination();

        return (
            <Table
                dataSource={this.props.postersList}
                columns={this.columns}
                loading={this.loading}
                pagination={this.pagination}
                onChange={this.handleTableChange}
                rowKey={this.handleTableRowKey}
            />
        );
    }

    private renderThumb(posterUrl: string): React.ReactNode {
        const thumbUrl: string = Utils.ApiTypes.makeThumbUrl(posterUrl, 50);
        return (
            <img src={thumbUrl} width={50} height={100} />
        );
    }

    private renderPosterUrl(posterUrl: string): React.ReactNode {
        return (
            <a href={posterUrl} target="_blank">{posterUrl}</a>
        );
    }

    private renderPosterCatNames(posterCatNames: string[]): string {
        const x: string = posterCatNames.join(',');
        return x;
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
    private handleTableRowKey(poster: Utils.ApiTypes.PosterInfo): string {
        return String(poster.posterID);
    }

    // 切换页
    private handleTableChange(pagination: PaginationProps): void {
        const { current = 1, pageSize = 10 } = pagination;

        this.props.onTableChange(current, pageSize);
    }

    // 格式化时间显示
    private renderFormattedCreateDate(createDate: number): string {
        return Common.CommonFuncs.displayDateTime(createDate);
    }

    // 渲染操作按钮
    private renderOperationButtons(poster: Utils.ApiTypes.PosterInfo): React.ReactNode {
        return (
            <OperationButtons
                poster={poster}
                onModify={this.handleModify}
                onDelete={this.handleDelete}
            />
        );
    }

    // 修改海报
    private handleModify(poster: Utils.ApiTypes.PosterInfo): void {
        this.props.onModify(poster);
    }

    // 删除海报
    private handleDelete(poster: Utils.ApiTypes.PosterInfo): void {
        this.props.onDelete(poster);
    }
}

export default PostersTable;