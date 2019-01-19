import * as WxTypes from './WxTypes';

declare const wx;

export class WxMapContext {
    private native: any = null;

    constructor(
        mapId:          string, // <map/> 组件的 id
        thisComponent:  Object  // 在自定义组件下，当前组件实例的this，以操作组件内 <map/> 组件
    ) {
        this.native = wx.createMapContext(mapId, thisComponent);
    }

    // 获取当前地图中心的经纬度，返回的是 gcj02 坐标系，可以用于 wx.openLocation()
    public async getCenterLocation(): Promise<WxTypes.WxMapLocationInfo> {
        return new Promise<WxTypes.WxMapLocationInfo>((resolve, reject) => {
            this.native.getCenterLocation({
                success:    (res: WxTypes.WxMapLocationInfo) => resolve(res),
                fail:       (err: any) => reject(err)
            });
        });
    }

    // 将地图中心移动到当前定位点，需要配合 map 组件的 show-location使用
    public moveToLocation(): void {
        this.native.moveToLocation();
    }

    // 平移marker，带动画
    public async translateMarker(
        markerId:       number,		            // 指定 marker	
        destination:    WxTypes.WxMapLocationInfo, // 指定 marker 移动到的目标点	
        autoRotate:     boolean,		        // 移动过程中是否自动旋转 marker	
        rotate:         number,		            // marker 的旋转角度	
        duration:       number = 1000,          // 动画持续时长，平移与旋转分别计算	
        animationEnd:   Function = undefined    // 动画结束回调函数
    ): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            this.native.translateMarker({
                markerId,
                destination,
                autoRotate,
                rotate,
                duration,
                animationEnd,

                success:    () => resolve(),
                fail:       (err: any) => reject(err)
            });
        });
    }

    // 缩放视野展示所有经纬度
    public async includePoints(
        points:     WxTypes.WxMapLocationInfo[], // 要显示在可视区域内的坐标点列表
        padding:    number[] // 坐标点形成的矩形边缘到地图边缘的距离，单位像素。格式为[上,右,下,左]，安卓上只能识别数组第一项，上下左右的padding一致。开发者工具暂不支持padding参数。
    ): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            this.native.includePoints({
                points,
                padding,
                success:    () => resolve(),
                fail:       (err: any) => reject(err)
            });
        });
    }

    //获取当前地图的视野范围
    public async getRegion(): Promise<WxTypes.WxRegion> {
        return new Promise<WxTypes.WxRegion>((resolve, reject) => {
            this.native.getRegion({
                success:    (res: WxTypes.WxRegion) => resolve(res),
                fail:       (err: any) => reject(err)
            })
        });
    }

    // 获取当前地图的缩放级别
    public async getScale(): Promise<number> {
        return new Promise<number>((resolve, reject) => {
            this.native.getScale({
                success:    (res: any) => resolve(res.scale),
                fail:       (err: any) => reject(err)
            });
        });
    }
}