import React            from 'react';
import { Radio }        from 'antd';
import { CommonFuncs }  from './CommonFuncs';

export interface MyRadioItem {
    value:  string;
    text:   string;
}

export interface MyRadioGroupProps {
    radios:         Array<MyRadioItem>;
    defaultValue:   string;

    onClick?:       (value: string) => void;
}

export class MyRadioGroup extends React.Component<MyRadioGroupProps, any> {
    constructor(props: MyRadioGroupProps) {
        super(props);
        
        CommonFuncs.bindObjectHandleMethods(this);
    }

    handleClick(e: any) {
        if (this.props.onClick) {
            this.props.onClick(e.target.value);
        }
    }

    render() {
        const radioItems = this.props.radios.map((radio) => {
            return (
                <Radio.Button value={radio.value} key={radio.value}>
                    {radio.text}
                </Radio.Button>
            );
        });

        return (
            <Radio.Group 
                onChange={this.handleClick} 
                defaultValue={this.props.defaultValue}
                value={this.props.defaultValue}
            >
                {radioItems}     
            </Radio.Group>
        );
    }
}