import React                from 'react';
import { Table }            from 'antd';
import { PaginationProps }  from 'antd/lib/pagination';

import * as Utils           from '../../../../utils';
import * as Common          from '../../../../common';

import OperationButtons     from './OperationButtons';

interface PosterCatsTableProps {
    queryLoading:       boolean;
    deleteLoading:      boolean;
    total:              number;
    current:            number;
    pageSize:           number;
    posterCatsList:     Utils.ApiTypes.PosterCatInfo[];

    onModify:           (posterCat: Utils.ApiTypes.PosterCatInfo) => void;
    onDelete:           (posterCat: Utils.ApiTypes.PosterCatInfo) => void;
    onTableChange:      (current: number, pageSize: number) => void;
}

const PosterCatIDColumn = {
    title:      '分类ID',
    dataIndex:  'posterCatID',
    key:        'posterCatID',
    render:     null
};

const PosterCatNameColumn = {
    title:      '分类名称', 
    dataIndex:  'posterCatName',   
    key:        'posterCatName',
    render:     null
};

const PosterCatDescColumn = {
    title:      '分类描述', 
    dataIndex:  'posterCatDesc',   
    key:        'posterCatDesc',
    render:     null
};

const HotspotColumn = {
    title:      '在热点位置显示', 
    dataIndex:  'hotspot',   
    key:        'hotspot',
    render:     null
};

const OrderNumColumn = {
    title:      '排序',
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

class PosterCatsTable extends React.PureComponent<PosterCatsTableProps, any> {
    private columns:        any[]                       = [];     
    private loading:        Utils.Interfaces.Loading    = { delay: 500 };
    private pagination:     PaginationProps             = Utils.initPagination();

    constructor(props: PosterCatsTableProps) {
        super(props);

        this.columns = [
            PosterCatIDColumn,
            PosterCatNameColumn,
            PosterCatDescColumn,
            HotspotColumn,
            OrderNumColumn,
            OperationColumn
        ];

        HotspotColumn.render        = this.renderHotspotColumn.bind(this);
        OperationColumn.render      = this.renderOperationButtons.bind(this);

        Common.CommonFuncs.bindObjectHandleMethods(this);
    }

    public render(): React.ReactNode {
        this.parseLoading();
        this.parsePagination();

        return (
            <Table
                dataSource={this.props.posterCatsList}
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
    private handleTableRowKey(posterCat: Utils.ApiTypes.PosterCatInfo): string {
        return String(posterCat.posterCatID);
    }

    // 切换页
    private handleTableChange(pagination: PaginationProps): void {
        const { current = 1, pageSize = 10 } = pagination;

        this.props.onTableChange(current, pageSize);
    }

    // 渲染操作按钮
    private renderOperationButtons(posterCat: Utils.ApiTypes.PosterCatInfo): React.ReactNode {
        return (
            <OperationButtons
                posterCat={posterCat}
                onModify={this.handleModify}
                onDelete={this.handleDelete}
            />
        );
    }

    private renderHotspotColumn(hotspot: boolean): string {
        return hotspot ? '√' : '';
    }
    
    // 修改海报
    private handleModify(posterCat: Utils.ApiTypes.PosterCatInfo): void {
        this.props.onModify(posterCat);
    }

    // 删除海报
    private handleDelete(posterCat: Utils.ApiTypes.PosterCatInfo): void {
        this.props.onDelete(posterCat);
    }
}

export default PosterCatsTable;