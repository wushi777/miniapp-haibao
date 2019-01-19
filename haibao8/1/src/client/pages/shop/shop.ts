import page from './shopPage';

declare const Page;

Page({
    data: page.data,

    onLoad: function (options) {
        page.onLoad(this, options);
    },

    onDetail:   event => page.onDetail(event),
    onShopJoin: event => page.onShopJoin(event)
});