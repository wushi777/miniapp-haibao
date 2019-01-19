import * as WxTypes from './WxTypes';

declare const wx;

let sharedDevice: WxDevice = null;

export class WxDevice {
    public onCompassChange:         (direction: number)                             => void = null;
    public onNetworkStatusChange:   (isConnected: boolean, networkType: string)     => void = null;
    public onAccelerometerChange:   (x: number, y: number, z: number)               => void = null;
    public onDeviceMotionChange:    (alpha: number, beta: number, gamma: number)    => void = null;
    public onMemoryWarning:         (level: number)                                 => void = null;
    public onUserCaptureScreen:     ()                                              => void = null;

    constructor() {
        wx.onCompassChange((res: any) => {
            if (this.onCompassChange) {
                this.onCompassChange(res.direction);
            }
        });

        wx.onNetworkStatusChange((res: any) => {
            if (this.onNetworkStatusChange) {
                this.onNetworkStatusChange(res.isConnected, res.networkType);
            }
        });

        wx.onAccelerometerChange((res: any) => {
            if (this.onAccelerometerChange) {
                this.onAccelerometerChange(res.x, res.y, res.z);
            }
        });

        if (wx.onDeviceMotionChange){
            wx.onDeviceMotionChange((res: any) => {
                if (this.onDeviceMotionChange) {
                    this.onDeviceMotionChange(res.alpha, res.beta, res.gamma);
                }
            });
        }

        wx.onMemoryWarning((res: any) => {
            if (this.onMemoryWarning) {
                this.onMemoryWarning(res.level);
            }
        });

        wx.onUserCaptureScreen(() => {
            if (this.onUserCaptureScreen) {
                this.onUserCaptureScreen();
            }
        });
    }

    public static get sharedInstance(): WxDevice {
        if (!sharedDevice) {
            sharedDevice = new WxDevice();
        }
        return sharedDevice;
    }

    public static async getSystemInfo(): Promise<WxTypes.WxSystemInfo> {
        return new Promise<WxTypes.WxSystemInfo>((resolve, reject) => {
            wx.getSystemInfo({
                success:    (res: WxTypes.WxSystemInfo) => resolve(res),
                fail:       (err: any)                  => reject(err)
            });
        });
    }

    public async getBatteryInfo(): Promise<WxTypes.WxBatteryInfo> {
        return new Promise<WxTypes.WxBatteryInfo>((resolve, reject) => {
            wx.getBatteryInfo({
                success:    (res: WxTypes.WxBatteryInfo)    => resolve(res),
                fail:       (err: any)                      => reject(err)
            });
        })
    }

    // 获取当前的地理位置、速度。当用户离开小程序后，此接口无法调用。
    public async getLocation(
        type:       string  = 'wgs84',  // wgs84 返回 gps 坐标，gcj02 返回可用于 wx.openLocation 的坐标
        altitude:   boolean = false     // 传入 true 会返回高度信息，由于获取高度需要较高精确度，会减慢接口返回速度
    ): Promise<WxTypes.WxLocationInfo> {
        return new Promise<WxTypes.WxLocationInfo>((resolve, reject) => {
            wx.getLocation({
                type,
                altitude,
                success:    (res: WxTypes.WxLocationInfo)   => resolve(res),
                fail:       (err: any)                      => reject(err)
            });
        });
    }

    // 使用微信内置地图查看位置。调用前需要 用户授权 scope.userLocation
    public static async openLocation(
        latitude:	number,		    //纬度，范围为-90~90，负数表示南纬。使用 gcj02 国测局坐标系	
        longitude:	number,		    //经度，范围为-180~180，负数表示西经。使用 gcj02 国测局坐标系	
        scale:	    number = 18,	//缩放比例，范围5~18	
        name:	    string = '',	//位置名	
        address:	string = ''	    //地址的详细说明
    ): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            wx.openLocation({
                latitude,
                longitude,
                scale,
                name,
                address,
                success:    () => resolve(true),
                fail:       (err: any) => reject(err)
            });
        });
    }

    public static async chooseLocation(): Promise<WxTypes.WxChooseLocationResponse> {
        return new Promise<WxTypes.WxChooseLocationResponse>((resolve, reject) => {
            wx.chooseLocation({
                success:    (res: WxTypes.WxChooseLocationResponse) => resolve(res),
                fail:       (err: any) => reject(err)
            });
        });
    }

    // wifi	wifi 网络
    // 2g	2g 网络
    // 3g	3g 网络
    // 4g	4g 网络
    // unknown	Android 下不常见的网络类型
    // none	无网络
    public async getNetworkType(): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            wx.getNetworkType({
                success:    (res: string) => resolve(res),
                fail:       (err: any) => reject(err)
            });
        });
    }

    // interval取值:
    // game	适用于更新游戏的回调频率，在 20ms/次 左右
    // ui	适用于更新 UI 的回调频率，在 60ms/次 左右
    // normal	普通的回调频率，在 200ms/次 左右
    public async startAccelerometer(
        interval: string = 'normal'
    ): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            wx.startAccelerometer({
                interval,
                success:    () => resolve(true),
                fail:       (err: any) => reject(err)
            });
        });
    }

    public async stopAccelerometer(): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            wx.stopAccelerometer({
                success:    () => resolve(true),
                fail:       (err: any) => reject(err)
            });
        });
    }

    public async getClipboardData(): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            wx.getClipboardData({
                success:    (res: any) => resolve(res.data),
                fail:       (err: any) => reject(err)
            });
        });
    }

    public async setClipboardData(data: string): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            wx.setClipboardData({
                data,
                success:    () => resolve(true),
                fail:       (err: any) => reject(err)
            })
        })
    }

    public async startCompass(): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            wx.startCompass({
                success:    () => resolve(true),
                fail:       (err: any) => reject(err)
            });
        });
    }

    public async stopCompass(): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            wx.stopCompass({
                success:    () => resolve(true),
                fail:       (err: any) => reject(err)
            });
        });
    }

    // game	适用于更新游戏的回调频率，在 20ms/次 左右
    // ui	适用于更新 UI 的回调频率，在 60ms/次 左右
    // normal	普通的回调频率，在 200ms/次 左右
    public async startDeviceMotionListening(
        interval: string = 'normal'
    ): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            wx.startDeviceMotionListening({
                interval,
                success:    () => resolve(),
                fail:       (err: any) => reject(err)
            });
        });
    }

    public async stopDeviceMotionListening(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            wx.stopDeviceMotionListening({
                success:    () => resolve(),
                fail:       (err: any) => reject(err)
            });
        });
    }

    // 使手机发生较短时间的振动（15 ms）。仅在 iPhone 7 / 7 Plus 以上及 Android 机型生效
    public async vibrateShort(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            wx.vibrateShort({
                success:    () => resolve(),
                fail:       (err: any) => reject(err)
            });
        });
    }

    // 使手机发生较长时间的振动（400 ms)
    public async vibrateLong(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            wx.vibrateLong({
                success:    () => resolve(),
                fail:       (err: any) => reject(err)
            });
        });
    }

    public static async makePhoneCall(
        phoneNumber: string
    ): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            wx.makePhoneCall({
                phoneNumber,
                success:    () => resolve(),
                fail:       (err: any) => reject(err)
            });
        });
    }

    // barCode	一维码
    // qrCode	二维码
    // datamatrix	Data Matrix 码
    // pdf417	PDF417 条码
    public async scanCode(
        onlyFromCamera: boolean = false,
        scanType:       string[] = ['barCode', 'qrCode'],    
    ): Promise<WxTypes.WxScanCodeResult> {
        return new Promise<WxTypes.WxScanCodeResult>((resolve, reject) => {
            wx.scanCode({
                onlyFromCamera,
                scanType,
                success:    (res: WxTypes.WxScanCodeResult) => resolve(res),
                fail:       (err: any) => reject(err)
            });
        });
    }

    public async getScreenBrightness(): Promise<number> {
        return new Promise<number>((resolve, reject) => {
            wx.getScreenBrightness({
                success:    (res: any) => resolve(res.value),
                fail:       (err: any) => reject(err)
            });
        });
    }

    public async setKeepScreenOn(
        keepScreenOn: boolean
    ): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            wx.setKeepScreenOn({
                success:    ()          => resolve(),
                fail:       (err: any)  => reject(err)
            });
        });
    }

    public async setScreenBrightness(
        value: number   // 屏幕亮度值，范围 0 ~ 1。0 最暗，1 最亮
    ): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            wx.setScreenBrightness({
                value,
                success:    ()          => resolve(),
                fail:       (err: any)  => reject(err)
            });
        });
    }
}