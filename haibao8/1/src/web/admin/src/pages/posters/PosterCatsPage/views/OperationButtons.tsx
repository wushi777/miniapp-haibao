import React        from 'react';

import * as Utils   from '../../../../utils';
import * as Common  from '../../../../common';

import { 
    Button, 
    Popconfirm 
} from 'antd';

interface OperationButtonsProps {
    posterCat:  Utils.ApiTypes.PosterCatInfo;

    onModify:   (posterCat: Utils.ApiTypes.PosterCatInfo) => void;
    onDelete:   (posterCat: Utils.ApiTypes.PosterCatInfo) => void;
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
                <Button type="primary" style={ButtonStyle} onClick={this.handleModify}>修改</Button>

                <Popconfirm 
                    title="您确定要删除这个分类吗？" 
                    onConfirm={this.handleDelete} 
                    okText="确定" 
                    cancelText="取消"
                >
                    <Button type="primary" style={ButtonStyle}>删除</Button>
                </Popconfirm>
            </div>
        );
    }

    // 修改
    private handleModify(): void {
        this.props.onModify(this.props.posterCat);
    }

    // 删除
    private handleDelete(): void {
        this.props.onDelete(this.props.posterCat);
    }
}

export default OperationButtons;