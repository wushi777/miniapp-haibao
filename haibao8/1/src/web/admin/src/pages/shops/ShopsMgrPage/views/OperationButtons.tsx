import React        from 'react';
import { Button }   from 'antd';

import * as Common  from '../../../../common';
import * as Utils   from '../../../../utils';

interface OperationButtonsProps {
    shop:       Utils.ApiTypes.ShopInfo;

    onReview:   (shop: Utils.ApiTypes.ShopInfo) => void;
}

const ButtonStyle = {
    marginRight: 8
};

class OperationButtons extends React.PureComponent<OperationButtonsProps> {
    constructor(props: OperationButtonsProps) {
        super(props);

        Common.CommonFuncs.bindObjectHandleMethods(this);
    }

    public render(): React.ReactNode {
        return (
            <div>
                {this.props.shop.reviewStatus === Utils.ApiTypes.ReviewStatusEnum.srsWait 
                    ? <Button type="primary" style={ButtonStyle} onClick={this.handleReview}>审核</Button>
                    : ''
                }

                {/* <Popconfirm 
                    title="您确定要删除这个海报吗？" 
                    onConfirm={this.handleDelete} 
                    okText="确定" 
                    cancelText="取消"
                >
                    <Button type="primary" style={ButtonStyle}>删除</Button>
                </Popconfirm> */}
            </div>
        );
    }

    // 修改
    private handleReview(): void {
        if (this.props.onReview) {
            this.props.onReview(this.props.shop);
        }
    }

    // // 删除
    // private handleDelete(): void {
    //     this.props.onDelete(this.props.shop);
    // }
}

export default OperationButtons;