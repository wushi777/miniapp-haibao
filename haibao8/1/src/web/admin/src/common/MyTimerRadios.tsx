import React            from 'react';

import { CommonFuncs }  from '../common';

import { MyRadioGroup } from './MyRadioGroup';
import { MyDateRange }  from './MyDateRange';

interface MyTimerRadiosProps {
    timeType:           string; // 默认图表类型
    startDate?:         number;
    endDate?:           number;
    
    onClick?:   (startTime: number, endTime: number, timerNum: any, timerType: string) => void;    // 回调函数
}

// 定义时间值,使用moment可以直接计算出开始结束时间毫秒数
const timerOption = {
    hours:      1,
    days:       1,
    weeks:      1,
    months:     1,
    customTime: 0,
    all:        0
};

let radios: any = null;

const customTime = 'customTime';

const convertRadios = () => {
    if (radios) {
        return radios;
    } else {
        radios = [
            {
                text: '全部',
                value: 'all'
            },
        
            {
                text: '最近一天',
                value: 'days'
            },
        
            {
                text: '最近一周',
                value: 'weeks'
            },
        
            {
                text: '最近一月',
                value: 'months'
            },
        
            {
                text: '选择时间',
                value: 'customTime'
            }
        ];

        return radios;
    }
};

export class MyTimerRadios extends React.Component<MyTimerRadiosProps, any> {
    constructor(props: MyTimerRadiosProps) {
        super(props);

        CommonFuncs.bindObjectHandleMethods(this);
    }

    public render() {
        const conRadios = convertRadios();
        const timer: any = this.renderTimer();
        
        return (
            <div className="selecttime fr">
                <div>
                    <MyRadioGroup
                        radios={conRadios}
                        onClick={this.handleChange}
                        defaultValue={this.props.timeType}
                    />
                    {timer}
                </div>  
            </div>
        );
    }

    // 切换时间回调事件
    // 首先从timerOption中获取对应的时间差值num
    // 如果为0,则是自定义时间,不需要计算,直接传递回上层组件
    private handleChange = (timerType: any) => {
        const timerNum = timerOption[timerType];
        
        if (this.props.onClick) {
            if (timerNum) {
                const endTime = Math.floor(Date.now());
                const startTime = endTime + CommonFuncs.getRecentTime(timerNum, timerType).asMilliseconds();
                
                this.handleTimer(startTime, endTime, timerNum, timerType);
            }

            // 全部时间
            if (timerType === 'all') {
                this.handleTimer(0, 0, 1, timerType);
            }

            // 自定义时间
            if (timerType === customTime) {
                this.handleTimer(0, 0, 0, timerType);
            }
            
        }
    }

    private handleTimer(startTime: number, endTime: number, timerNum: any, timerType: string): void {
        if (this.props.onClick) {
            this.props.onClick(startTime, endTime, timerNum, timerType);
        }
    }

    private renderTimer() {
        if (this.props.timeType === customTime) {
            return (
                <MyDateRange
                    onClick={this.handleTimer}
                    startDate={this.props.startDate ? this.props.startDate : 0}
                    endDate={this.props.endDate ? this.props.endDate : 0}
                />
            );
        } else {
            return null;
        }
    }
}