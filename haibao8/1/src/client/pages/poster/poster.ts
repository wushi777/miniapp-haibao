import page from './posterPage';

declare const Page;

Page({
    data: page.data,

    onLoad: function(options) {
        page.onLoad(this, options);
    },

    onTagBtnClick:      event => page.onTagBtnClick(event),
    onPosterEditTap:    event => page.onPosterEditTap(event),
    onMorePoster:       event => page.onMorePoster(event),
    onDownRefresh:      event => page.onDownRefresh(event)
});