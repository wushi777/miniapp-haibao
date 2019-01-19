import page from './shopJoinPage';

declare const Page;

Page({
    data: page.data,

    onLoad: function (options) {
        page.onLoad(this, options);
    },

    onSubmit: event => page.onSubmit(event),
    onChooseLogoImage:  event => page.onChooseLogoImage(event),
    onSelectShopCat: event => page.onSelectShopCat(event),
    onChooseShopImage: event => page.onChooseShopImage(event),
    onRemoveShopImage: event => page.onRemoveShopImage(event),
    onChooseLocation: event=> page.onChooseLocation(event),
    onShow:() => page.onShow(),
});