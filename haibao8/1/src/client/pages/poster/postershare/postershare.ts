import page from './posterSharePage';

declare const Page;

Page({
    data: page.data, // 页面的初始数据
    
    onLoad: function(options) {
        page.onLoad(this, options);
    },
    onDownloadPic: (event) => page.onDownloadPic(event),
    onCanvasImageClick: (event) => page.onCanvasImageClick(event),
    onShareAppMessage: (event) => page.onShareAppMessage(event),
    onOpenSetting: (event) => page.onOpenSetting(event),
});
