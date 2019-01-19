import page from './loginPage';

declare const Page;

Page({
    data: page.data,

    onLoad: function(options) {
        page.onLoad(this, options);
    },

    onGetUserInfo:      res => page.onGetUserInfo(res.detail),
    onGetPhoneNumber:   res => page.onGetPhoneNumber(res.detail),
});