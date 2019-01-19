import page from './shopCatPage';

declare const Page;

Page({
    data: page.data,

    onLoad: function (options) {
        page.onLoad(this, options);
    },
    onItemClick: event => page.onItemClick(event),
});