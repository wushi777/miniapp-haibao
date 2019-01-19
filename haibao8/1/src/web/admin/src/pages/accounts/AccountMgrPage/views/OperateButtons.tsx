import React        from 'react';
// import { Button }   from 'antd';
import * as Common  from '../../../../common';
import * as Utils   from '../../../../utils';

export interface OperateButtonsProps {
    account:        Utils.ApiTypes.AccountInfo;

    onGivenMoney?:  (account: Utils.ApiTypes.AccountInfo) => void;
}

// 渲染表格中的三个操作按钮
export class OperateButtons extends React.Component<OperateButtonsProps, any> {
    constructor(props: OperateButtonsProps) {
        super(props);

        Common.CommonFuncs.bindObjectHandleMethods(this);
    }

    public render() {
        return null;
        // return (
        //     <div>
        //         <Button
        //             title="赠送金额"
        //             icon="pay-circle-o"
        //             type="primary"
        //             key="pay-circle-o"
        //             size="small"
        //             onClick={this.handleEditButtonClick}
        //         >赠送金额
        //         </Button>
        //     </div>
        // );
    }

    // // 修改按钮的点击事件
    // private handleEditButtonClick() {
    //     if (this.props.onGivenMoney) {
    //         this.props.onGivenMoney(this.props.account);
    //     }
    // }
}