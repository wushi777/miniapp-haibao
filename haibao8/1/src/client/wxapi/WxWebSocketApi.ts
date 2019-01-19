import * as WxTypes from './WxTypes';

declare const wx;

export class WxWebSocket {
    private socketTask: any = null;

    public onMessage:   (data: string)      => void = null;
    public onOpen:      (header: Object)    => void = null;
    public onClose:     ()                  => void = null;
    public onError:     (errMsg: string)    => void = null;
    
    public async open(
        url:        string,
        header:     Object,
        protocols:  string[]
    ): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            wx.connectSocket({
                url,
                header,
                protocols,

                success: (res: any) => {
                    this.socketTask = res;

                    this.socketTask.onOpen = (res: any) => {
                        if (this.onOpen) {
                            this.onOpen(res.header);
                        }
                    }

                    this.socketTask.onMessage = (data: string) => {
                        if (this.onMessage) {
                            this.onMessage(data);
                        }
                    }

                    this.socketTask.onClose = () => {
                        if (this.onClose) {
                            this.onClose();
                        }
                    }

                    this.socketTask.onError = (errMsg) => {
                        if (this.onError) {
                            this.onError(errMsg);
                        }
                    }

                    resolve();
                },

                fail: (err: any) => {
                    reject(err)
                }
            });
        });
    }

    public async close(
        code:   number,
        reason: string
    ): Promise<void> {
        if (!this.socketTask) {
            return;
        }

        return new Promise<void>((resolve, reject) => {
            this.socketTask.close({
                code, 
                reason,
                success: () => {
                    this.socketTask = null;
                    resolve();
                },
                fail: (err) => reject(err)
            });
        });
    }

    public async send(
        data: string
    ): Promise<void> {
        if (!this.socketTask) {
            const error = new Error('尚未连接到服务器');
            throw error;
        }

        return new Promise<void>((resolve, reject) => {
            this.socketTask.send({
                data,
                success:    () => resolve(),
                fail:       (err: any) => reject(err)
            });
        });
    }
}