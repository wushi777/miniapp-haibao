import React        from 'react';
import * as Utils   from '../../../../utils';

import { 
    Button, 
    Popconfirm 
} from 'antd';

interface OperationButtonsProps {
    poster:     Utils.ApiTypes.PosterInfo;

    onModify:   (poster: Utils.ApiTypes.PosterInfo) => void;
    onDelete:   (poster: Utils.ApiTypes.PosterInfo) => void;
}

const ButtonStyle = {
    marginRight: 8
};

class OperationButtons extends React.PureComponent<OperationButtonsProps> {
    constructor(props: OperationButtonsProps) {
        super(props);

        this.handleModify   = this.handleModify.bind(this);
        this.handleDelete   = this.handleDelete.bind(this);
    }

    public render(): React.ReactNode {
        return (
            <div>
                <Button type="primary" style={ButtonStyle} onClick={this.handleModify}>修改</Button>

                <Popconfirm 
                    title="您确定要删除这个海报吗？" 
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
        this.props.onModify(this.props.poster);
    }

    // 删除
    private handleDelete(): void {
        this.props.onDelete(this.props.poster);
    }
}

export default OperationButtons;