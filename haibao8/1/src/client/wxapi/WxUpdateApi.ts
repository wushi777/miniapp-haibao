import * as WxTypes from './WxTypes';

declare const wx;

export class WxUpdate {
    private manager: any = null;

    public onCheckForUpdate:    (hasUpdate: boolean)    => void = null;
    public onUpdateReady:       ()                      => void = null;
    public onUpdateFailed:      (err: any)              => void = null;

    constructor() {
        this.manager = wx.getUpdateManager();

        this.manager.onCheckForUpdate((res: any) => {
            if (this.onCheckForUpdate) {
                this.onCheckForUpdate(res.hasUpdate);
            }
        });

        this.manager.onUpdateReady(() => {
            if (this.onUpdateReady) {
                this.onUpdateReady();
            }
        });

        this.manager.onUpdateFailed((err: any) => {
            if (this.onUpdateFailed) {
                this.onUpdateFailed(err);
            }
        });
    }

    public applyUpdate(): void {
        this.manager.applyUpdate();
    }
}