import page from './minePage';
import { func } from 'prop-types';

declare const Page;

Page({
    data: page.data,

    onLoad: function(options) {
        page.onLoad(this, options);
    },
    
    onShow:         ()      => page.onShow(),
    onToMineShop:   event   => page.onToMineShop(event),
    onMyQrCode:     event   => page.onMyQrCode(event),
    onUserRegister: event   => page.onUserRegister(event),
    onToMineCollect: event  => page.onToMineCollect(event),
});