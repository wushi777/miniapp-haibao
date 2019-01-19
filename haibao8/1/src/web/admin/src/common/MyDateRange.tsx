import React            from 'react';
import { DatePicker }   from 'antd';
import moment           from 'moment';
import { CommonFuncs }  from './CommonFuncs';

interface MyDateRangeProps {
    startDate?: number;
    endDate?:   number;
    
    onClick?:   (startTime: number, endTime: number, timerNum: any, timerType: string) => void;    // 回调函数
}

const { RangePicker } = DatePicker;

let showTimeOptions: any = null;

const convertOptions = () => {
    if (showTimeOptions) {
        return showTimeOptions;
    } else {
        showTimeOptions = {
            showTime: {
                format: 'HH:mm'
            },
        
            format: 'YYYY-MM-DD HH:mm'
        };
        return showTimeOptions;
    }
};

export class MyDateRange extends React.Component<MyDateRangeProps, any> {
    constructor(props: MyDateRangeProps) {
        super(props);

        this.state = {
            startDate: Number(this.props.startDate),
            endDate: Number(this.props.endDate)
        };

        CommonFuncs.bindObjectHandleMethods(this);
    }

    public render() {
        const rangePickerOptions = convertOptions();
        let times: any[] = [];
        if (this.state.startDate) {
            times.push(moment(this.state.startDate));
        }

        if (this.state.endDate) {
            times.push(moment(this.state.endDate));
        }

        return (
            <div>
                <RangePicker
                    showTime={rangePickerOptions.showTime}
                    format={rangePickerOptions.format}
                    locale={rangePickerOptions.locale}
                    onOk={this.handleOk}
                    onChange={this.handleChange}
                    value={times}
                />
            </div>
        );
    }

    private handleOk(value: any) {
        const [startTime, endTime]: number[] = value.map((val: Date) => {
            return Math.floor(new Date(val).getTime());
        });
        
        const timerNum: string = `${startTime}/${endTime}`;
        if (this.props.onClick) {
            this.props.onClick(startTime, endTime, timerNum, 'customTime');
        }
    }

    private handleChange(value: any) {
        if (value.length === 0) {
            return;
        }

        if (new Date(value[0]).getTime() !== this.state.startDate) {
            this.setState({
                startDate: Number(new Date(value[0]).getTime())
            });
        }

        if (new Date(value[1]).getTime()  !== this.state.endDate) {
            this.setState({
                endDate: new Date(value[1]).getTime()
            });
        }
    }
}