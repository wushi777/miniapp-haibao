import * as WxTypes from './WxTypes';

declare const wx;

export class WxRecorder {
    private mgr: WxTypes.WxRecorderManager = null;

    constructor() {
        this.mgr = wx.getRecorderManager();
    }

    get onStart(): () => void {
        return this.mgr.onStart;
    }

    set onStart(value: () => void) {
        this.mgr.onStart = value;
    }

    get onPause(): () => void {
        return this.mgr.onPause;
    }

    set onPause(value: () => void) {
        this.mgr.onPause = value;
    }

    get onStop(): (tempFilePath: string) => void {
        return this.mgr.onStop;
    }

    set onStop(value: (tempFilePath: string) => void) {
        this.mgr.onStop = value;
    }

    get onFrameRecorded(): (frameBuffer: any, isLastFrame: boolean) => void {
        return this.mgr.onFrameRecorded;
    }

    set onFrameRecorded(value: (frameBuffer: any, isLastFrame: boolean) => void) {
        this.mgr.onFrameRecorded = value;
    }

    get onError(): (errMsg: string) => void {
        return this.mgr.onError;
    }

    set onError(value: (errMsg: string) => void) {
        this.mgr.onError = value;
    }

    public start(options: WxTypes.WxRecorderMangerStartOptions): void {
        this.mgr.start(options);
    }

    public pause(): void {
        this.mgr.pause();
    }

    public resume(): void {
        this.mgr.resume();
    }

    public stop(): void {
        this.mgr.stop();
    }
}