import page from './posterEditorPage';

declare const Page;

Page({
    data: page.data, // 页面的初始数据
    
    onLoad: function(options) {
        page.onLoad(this, options);
    },
    onInputOK: (event) => page.onInputOK(event),
    onShowTipInput: (event) => page.onShowTipInput(event),
    onSaveImage:        () => page.onSaveImage(), 
    onGeneratePoster: () => page.onGeneratePoster(),
    onPosterCollect: (event) => page.onPosterCollect(event)

});