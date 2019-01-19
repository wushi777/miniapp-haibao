import React        from 'react';
import { Button }   from 'antd';

import * as Common  from '../../../../common';
import * as Utils   from '../../../../utils';

export interface OperateButtonsProps {
    dosage:     Utils.ApiTypes.DosageInfo;

    onDetail:   (dosage: Utils.ApiTypes.DosageInfo) => void;
}

// 渲染表格中的三个操作按钮
export class OperateButtons extends React.Component<OperateButtonsProps, any> {
    constructor(props: OperateButtonsProps) {
        super(props);

        Common.CommonFuncs.bindObjectHandleMethods(this);
    }

    public render() {
        return (
            <div>
                <Button
                    title="详单"
                    type="primary"
                    key="pay-circle-o"
                    onClick={this.handleDetail}
                >详单
                </Button>
            </div>
        );
    }

    // 查看
    private handleDetail(): void {
        this.props.onDetail(this.props.dosage);
    }
}