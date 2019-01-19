import page from './minesShopPage';

declare const Page;

Page({
    data: page.data,

    onLoad: function(options) {
        page.onLoad(this, options);
    },

    onShow: () => page.onShow(),

    onShopCreateOrEdit: event => page.onShopCreateOrEdit(event),

    onToShopDetail: event => page.onToShopDetail(event),
});