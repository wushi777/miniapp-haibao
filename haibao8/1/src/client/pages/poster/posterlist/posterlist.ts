import page from './posterListPage';

declare const Page;

Page({
    data: page.data,

    onLoad: async function(options) {
        page.onLoad(this, options);
    },

    changeTab:        event => page.changeTab(event),
    onScrollLower:    event => page.onScrollLower(event),
    onPosterEditTap:  event => page.onPosterEditTap(event)
});