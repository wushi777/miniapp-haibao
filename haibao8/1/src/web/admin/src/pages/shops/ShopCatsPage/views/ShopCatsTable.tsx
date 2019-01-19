import React                from 'react';
import { Table }            from 'antd';
import { PaginationProps }  from 'antd/lib/pagination';

import * as Utils           from '../../../../utils';
import * as Common          from '../../../../common';

import OperationButtons     from './OperationButtons';

interface ShopCatsTableProps {
    queryLoading:       boolean;
    deleteLoading:      boolean;
    total:              number;
    current:            number;
    pageSize:           number;
    shopCatsList:       Utils.ApiTypes.ShopCatInfo[];

    onModify:           (shopCat: Utils.ApiTypes.ShopCatInfo) => void;
    onDelete:           (shopCat: Utils.ApiTypes.ShopCatInfo) => void;
    onTableChange:      (current: number, pageSize: number) => void;
}

const ShopCatIDColumn = {
    title:      '分类ID',
    dataIndex:  'shopCatID',
    key:        'shopCatID',
    render:     null
};

const ShopCatNameColumn = {
    title:      '分类名称', 
    dataIndex:  'shopCatName',   
    key:        'shopCatName',
    render:     null
};

const ShopCatDescColumn = {
    title:      '分类描述', 
    dataIndex:  'shopCatDesc',   
    key:        'shopCatDesc',
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

class ShopCatsTable extends React.PureComponent<ShopCatsTableProps, any> {
    private columns:        any[]                       = [];     
    private loading:        Utils.Interfaces.Loading    = { delay: 500 };
    private pagination:     PaginationProps             = Utils.initPagination();

    constructor(props: ShopCatsTableProps) {
        super(props);

        this.columns = [
            ShopCatIDColumn,
            ShopCatNameColumn,
            ShopCatDescColumn,
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
                dataSource={this.props.shopCatsList}
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
    private handleTableRowKey(shopCat: Utils.ApiTypes.ShopCatInfo): string {
        return `${shopCat.shopCatID}`;
    }

    // 切换页
    private handleTableChange(pagination: PaginationProps): void {
        const { current = 1, pageSize = 10 } = pagination;

        this.props.onTableChange(current, pageSize);
    }

    // 渲染操作按钮
    private renderOperationButtons(shopCat: Utils.ApiTypes.ShopCatInfo): React.ReactNode {
        return (
            <OperationButtons
                shopCat={shopCat}
                onModify={this.handleModify}
                onDelete={this.handleDelete}
            />
        );
    }

    private renderHotspotColumn(hotspot: boolean): string {
        return hotspot ? '√' : '';
    }
    
    // 修改海报
    private handleModify(shopCat: Utils.ApiTypes.ShopCatInfo): void {
        this.props.onModify(shopCat);
    }

    // 删除海报
    private handleDelete(shopCat: Utils.ApiTypes.ShopCatInfo): void {
        this.props.onDelete(shopCat);
    }
}

export default ShopCatsTable;