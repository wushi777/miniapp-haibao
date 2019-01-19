import { message }  from 'antd';

message.config({
    top:        50,     // 消息距离顶部的位置
    duration:   2,      // 自动关闭的延时，单位秒
    maxCount:   1       // 最大显示数, 超过限制时，最早的消息会被自动关闭
});

export const umessage = message;