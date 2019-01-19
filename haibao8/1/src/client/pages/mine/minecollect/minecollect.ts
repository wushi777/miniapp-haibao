import page from './mineCollectPage';

declare const Page;

Page({
    data: page.data,

    onLoad: function(options) {
        page.onLoad(this, options);
    },
    onRemovePoster: (event) => page.onRemovePoster(event),
});