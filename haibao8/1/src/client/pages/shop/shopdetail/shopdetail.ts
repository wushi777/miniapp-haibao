import page from './shopDetailPage';
import { eventNames } from 'cluster';

declare const Page;

Page({
    data: page.data,

    onLoad: function (options) {
        page.onLoad(this, options);
    },

    onCallPhone: (event) => page.onCallPhone(event),
    onViewLocation: (event) => page.onViewLocation(event),
    onShowTipDialog: (event) => page.onShowTipDialog(event),
    onWeChatShare: (event) => page.onWeChatShare(event),
    onShopShare: (event) => page.onShopShare(event),
    onHideShare: (event) => page.onHideShare(event),
    onCanvasImageClick: (event) => page.onCanvasImageClick(event),
    onShareAppMessage: (event) => page.onShareAppMessage(event),
})