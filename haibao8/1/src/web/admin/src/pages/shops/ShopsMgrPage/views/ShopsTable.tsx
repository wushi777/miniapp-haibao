import React                from 'react';
import { Table }            from 'antd';
import { PaginationProps }  from 'antd/lib/pagination';

import * as Common          from '../../../../common';
import * as Utils           from '../../../../utils';

import OperationButtons     from './OperationButtons';

interface ShopsTableProps {
    queryLoading:       boolean;
    // deleteLoading:      boolean;
    total:              number;
    current:            number;
    pageSize:           number;
    shopsList:          Utils.ApiTypes.ShopInfo[];

    onReview:           (shop: Utils.ApiTypes.ShopInfo) => void;
    // onDelete:           (shop: Utils.ApiTypes.ShopInfo) => void;
    onTableChange:      (current: number, pageSize: number) => void;
}

const ShopIDColumn = {
    title:      '店铺ID', 
    dataIndex:  'shopID',   
    key:        'shopID',
    render:     null
};

const AccountNickNameColumn = {
    title:      '所属用户',
    dataIndex:  'accountNickName',
    key:        'accountNickName',
    render:     null
};

const LogoUrlColumn = {
    title:      '店铺Logo', 
    dataIndex:  'logoUrl',   
    key:        'logoUrl',
    render:     null
};

const ShopNameColumn = {
    title:      '店铺名称', 
    dataIndex:  'shopName',   
    key:        'shopName',
    render:     null
};

const ShopDescColumn = {
    title:      '店铺描述',
    dataIndex:  'shopDesc',
    key:        'shopDesc',
    render:     null
};

const ShopAddressColumn = {
    title:      '店铺地址',
    dataIndex:  'shopAddress',
    key:        'shopAddress',
    render:     null
};

const CreateDateColumn = {
    title:      '创建时间', 
    dataIndex:  'createDate',   
    key:        'createDate',
    render:     null
};

const ModifyDateColumn = {
    title:      '修改时间', 
    dataIndex:  'modifyDate',   
    key:        'modifyDate',
    render:     null
};

const ReviewStatusColumn = {
    title:      '审核状态', 
    dataIndex:  'reviewStatus',   
    key:        'reviewStatus',
    render:     null
};

const OperationColumn = {
    title:      '操作', 
    dataIndex:  '',   
    key:        'operation',
    render:     null
};

class ShopsTable extends React.PureComponent<ShopsTableProps, any> {
    private columns:        any[]                       = [];     
    private loading:        Utils.Interfaces.Loading    = { delay: 500 };
    private pagination:     PaginationProps             = Utils.initPagination();

    constructor(props: ShopsTableProps) {
        super(props);

        this.columns = [
            ShopIDColumn,
            LogoUrlColumn,
            AccountNickNameColumn,
            ShopNameColumn,
            ShopDescColumn,
            ShopAddressColumn,
            CreateDateColumn,
            ModifyDateColumn,
            ReviewStatusColumn,
            OperationColumn
        ];

        LogoUrlColumn.render        = this.renderLogoUrl.bind(this);
        OperationColumn.render      = this.renderOperationButtons.bind(this);
        CreateDateColumn.render     = this.renderDateColumn.bind(this);
        ModifyDateColumn.render     = this.renderDateColumn.bind(this);
        ReviewStatusColumn.render   = this.renderReviewStatusColumn.bind(this);

        Common.CommonFuncs.bindObjectHandleMethods(this);
    }

    public render(): React.ReactNode {
        this.parseLoading();
        this.parsePagination();

        return (
            <Table
                dataSource={this.props.shopsList}
                columns={this.columns}
                loading={this.loading}
                pagination={this.pagination}
                onChange={this.handleTableChange}
                rowKey={this.handleTableRowKey}
            />
        );
    }

    private renderLogoUrl(logoUrl: string): React.ReactNode {
        const thumbUrl: string = Utils.ApiTypes.makeThumbUrl(logoUrl, 100);
        return (
            <img src={thumbUrl} /* width={50} height={100} */ />
        );
    }

    // 处理加载状态显示信息
    private parseLoading(): void {
        this.loading.spinning   = this.props.queryLoading;

        if (this.props.queryLoading) {
            this.loading.tip = '正在加载...';
        }
    }

    // 处理分页信息
    private parsePagination(): void {
        this.pagination.total       = this.props.total;
        this.pagination.current     = this.props.current;
        this.pagination.pageSize    = this.props.pageSize;
    }

    // 处理表格key
    private handleTableRowKey(shop: Utils.ApiTypes.ShopInfo): string {
        return String(shop.shopID);
    }

    // 切换页
    private handleTableChange(pagination: PaginationProps) {
        const { current = 1, pageSize = 10 } = pagination;

        this.props.onTableChange(current, pageSize);
    }

    // 格式化时间显示
    private renderDateColumn(date: number): string {
        return Common.CommonFuncs.displayDateTime(date);
    }

    private renderReviewStatusColumn(reviewStatus: Utils.ApiTypes.ReviewStatusEnum): string {
        switch (reviewStatus) {
            case Utils.ApiTypes.ReviewStatusEnum.srsReject: 
                return '已拒绝';

            case Utils.ApiTypes.ReviewStatusEnum.srsSuccess:
                return '已通过';

            default:
                return '待审核';
        }
    }

    // 渲染操作按钮
    private renderOperationButtons(shop: Utils.ApiTypes.ShopInfo): React.ReactNode {
        return (
            <OperationButtons
                shop={shop}
                onReview={this.handleReview}
                // onDelete={this.handleDelete}
            />
        );
    }

    // 审核店铺
    private handleReview(shop: Utils.ApiTypes.ShopInfo): void {
        if (this.props.onReview) {
            this.props.onReview(shop);
        }
    }

    // // 删除店铺
    // private handleDelete(shop: Utils.ApiTypes.ShopInfo): void {
    //     this.props.onDelete(shop);
    // }
}

export default ShopsTable;