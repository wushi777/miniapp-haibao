import React            from 'react';
import { Select }       from 'antd';
import { SelectValue }  from 'antd/lib/select';

import * as Common      from '../../../../common';

interface MySelectProps {
    data:               any[];              // 数据源
    selectOptions:      any;                // 参数
    allowClear?:        boolean;            // 是否允许清空
    value?:             SelectValue;
    disabled?:          boolean;            // 是否禁用
    onChange?:          (value: string | number) => void;   // 切换App回调函数
}

const Option = Select.Option;

export class MySelect extends React.Component<MySelectProps, any> {
    constructor(props: MySelectProps) {
        super(props);

        Common.CommonFuncs.bindObjectHandleMethods(this);
    }

    public render() {
        return (
            <span>
                {this.renderSelect()}
            </span>
        );
    }

    private renderSelect() {
        const options = this.props.data.map((d: any) => {
            return (
                <Option key={d[this.props.selectOptions.key || 'key']}>
                    {d[this.props.selectOptions.name || 'name']}
                </Option>
            );
        });
        return (
            <Select
                style={this.props.selectOptions.style}
                placeholder={this.props.selectOptions.placeholder}
                allowClear={this.props.allowClear}
                notFoundContent={this.props.selectOptions.notFoundContent}
                value={this.props.data.length === 0 ? undefined : this.props.value}
                onChange={this.handleChange}
                disabled={this.props.disabled}
            >
                {options}
            </Select>
        );
    }

    private handleChange(value: SelectValue) {
       
        if (this.props.onChange) {
            if ((typeof value === 'number') || (typeof value === 'string' || typeof value === 'undefined')) {
                this.props.onChange(value);
            }
        }
    }
}