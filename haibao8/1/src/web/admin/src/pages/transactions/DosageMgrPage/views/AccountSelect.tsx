import React        from 'react';

import * as Common  from '../../../../common';
import * as Utils   from '../../../../utils';

import { MySelect } from './MySelect';

interface AccountSelectProps {
    accountID?:         number;                         // 默认选中
    disabled?:          boolean;                        // 是否禁用
    onChangeAccount?:   (accountID: number) => void;    // 切换Account回调函数
}

interface AccountSelectStates {
    accountList:    any;
}

const selectOptions: any = {
    key:                'accountID',
    name:               'accountName',
    placeholder:        '请选择企业',
    notFoundContent:    '暂无企业',
    style: {
        width:          '200px'
    }
};

export class AccountSelect extends React.Component<AccountSelectProps, AccountSelectStates> {
    constructor(props: AccountSelectProps) {
        super(props);

        this.state = {
            accountList: null
        };

        Common.CommonFuncs.bindObjectHandleMethods(this);
    }
    
    public async componentDidMount(): Promise<void> {
        const accountList: Utils.ApiTypes.AccountInfoPageData = await Utils.http.accountsApi.queryAccountPageData(
            '', 'accountID', false, 0, 0);

        if (accountList) {
            accountList.data.forEach((item) => {
                // item.accountName = `${item.accountID} - ${item.accountName}`;
                return item;
            });
        }

        this.setState({
            accountList
        });
    }

    public render() {
        return (
            <MySelect
                data={this.state.accountList ? this.state.accountList.data : []}
                selectOptions={selectOptions}
                onChange={this.handleChangeAccount}
                allowClear={true}
                disabled={this.props.disabled}
                value={Number(this.props.accountID) ? String(this.props.accountID) : undefined}
            />
        );
    }

    private handleChangeAccount(accountID: any) {
        if (this.props.onChangeAccount) {
            this.props.onChangeAccount(accountID);
        }
    }
}