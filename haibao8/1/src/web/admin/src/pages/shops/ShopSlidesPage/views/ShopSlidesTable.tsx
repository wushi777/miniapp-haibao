import React                from 'react';
import { Table }            from 'antd';
import { PaginationProps }  from 'antd/lib/pagination';

import * as Common          from '../../../../common';
import * as Utils           from '../../../../utils';

import OperationButtons     from './OperationButtons';

interface ShopSlidesTableProps {
    queryLoading:       boolean;
    deleteLoading:      boolean;
    total:              number;
    current:            number;
    pageSize:           number;
    shopSlidesList:     Utils.ApiTypes.ShopSlideInfo[];

    onModify:           (shopSlide: Utils.ApiTypes.ShopSlideInfo) => void;
    onDelete:           (shopSlide: Utils.ApiTypes.ShopSlideInfo) => void;
    onTableChange:      (current: number, pageSize: number) => void;
}

const ShopSlideIDColumn = {
    title:      '轮播ID',
    dataIndex:  'shopSlideID',
    key:        'shopSlideID',
    render:     null
};

const ShopSlideUrlColumn = {
    title:      '图片',
    dataIndex:  'shopSlideUrl',
    key:        'shopSlideUrl',
    render:     null
};

const ShopSlideNameColumn = {
    title:      '轮播名称', 
    dataIndex:  'shopSlideName',   
    key:        'shopSlideName',
    render:     null
};

const ShopSlideDescColumn = {
    title:      '轮播描述', 
    dataIndex:  'shopSlideDesc',   
    key:        'shopSlideDesc',
    render:     null
};

const ShopSlideLinkColumn = {
    title:      '链接地址',
    dataIndex:  'shopSlideLink',
    key:        'shopSlideLink',
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

class ShopSlidesTable extends React.PureComponent<ShopSlidesTableProps, any> {
    private columns:        any[]                       = [];     
    private loading:        Utils.Interfaces.Loading    = { delay: 500 };
    private pagination:     PaginationProps             = Utils.initPagination();

    constructor(props: ShopSlidesTableProps) {
        super(props);

        this.columns = [
            ShopSlideIDColumn,
            ShopSlideUrlColumn,
            ShopSlideNameColumn,
            ShopSlideDescColumn,
            ShopSlideLinkColumn,
            OrderNumColumn,
            OperationColumn
        ];

        ShopSlideUrlColumn.render   = this.renderShopSlideUrl.bind(this);
        ShopSlideLinkColumn.render  = this.renderShopSlideLink.bind(this);
        OperationColumn.render      = this.renderOperationButtons.bind(this);

        Common.CommonFuncs.bindObjectHandleMethods(this);
    }

    public render(): React.ReactNode {
        this.parseLoading();
        this.parsePagination();

        return (
            <Table
                dataSource={this.props.shopSlidesList}
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
    private handleTableRowKey(shopSlide: Utils.ApiTypes.ShopSlideInfo): string {
        return String(shopSlide.shopSlideID);
    }

    // 切换页
    private handleTableChange(pagination: PaginationProps): void {
        const { current = 1, pageSize = 10 } = pagination;

        this.props.onTableChange(current, pageSize);
    }

    private renderShopSlideUrl(shopSlideUrl: string): React.ReactNode {
        return (
            <img src={shopSlideUrl} width={200} height={100}/>
        );
    }

    private renderShopSlideLink(shopSlideLink: string): React.ReactNode {
        return (
            <a href={shopSlideLink} target="_blank">{shopSlideLink}</a>
        );
        
    }

    // 渲染操作按钮
    private renderOperationButtons(shopSlide: Utils.ApiTypes.ShopSlideInfo): React.ReactNode {
        return (
            <OperationButtons
                shopSlide={shopSlide}
                onModify={this.handleModify}
                onDelete={this.handleDelete}
            />
        );
    }

    // 修改海报
    private handleModify(shopSlide: Utils.ApiTypes.ShopSlideInfo): void {
        this.props.onModify(shopSlide);
    }

    // 删除海报
    private handleDelete(shopSlide: Utils.ApiTypes.ShopSlideInfo): void {
        this.props.onDelete(shopSlide);
    }
}

export default ShopSlidesTable;