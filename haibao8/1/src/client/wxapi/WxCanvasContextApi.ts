import * as WxTypes from './WxTypes';

declare const wx;

export class WxCanvasContext {
    public native: any = null;

    constructor(
        public canvasId: string
    ) {
        this.native = wx.createCanvasContext(canvasId);
    }

    // 返回一个数组，用来描述 canvas 区域隐含的像素数据。
    // 在自定义组件下，thisComponent 传入自定义组件组件实例 this，以操作组件内 <canvas> 组件。
    public async getImageData(
        x:      number, // 将要被提取的图像数据矩形区域的左上角横坐标
        y:      number, // 将要被提取的图像数据矩形区域的左上角纵坐标
        width:  number, // 将要被提取的图像数据矩形区域的宽度
        height: number  // 将要被提取的图像数据矩形区域的高度
    ): Promise<WxTypes.WxCanvasGetImageDataResponse> {
        return new Promise<WxTypes.WxCanvasGetImageDataResponse>((resolve, reject) => {
            wx.canvasGetImageData({
                canvasId: this.canvasId,
                x,
                y,
                width,
                height,

                success:    (res: WxTypes.WxCanvasGetImageDataResponse) => resolve(res),
                fail:       (err: any) => reject(err)
            });
        });
    }

    // 把当前画布内容导出生成图片，并返回文件路径。
    public async saveToTempFilePath(
        fileType:   string = 'png', // 目标文件的类型 取值为 jpg 和 png 两者之一
        quality:    number = 1      // 图片的质量，目前仅对 jpg 有效。取值范围为 (0, 1]，不在范围内时当作 1.0 处理。
    ): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            wx.canvasToTempFilePath({
                canvasId: this.canvasId,
                fileType,
                quality: 1,

                success: (res) => {
                    const { tempFilePath } = res;
                    resolve(tempFilePath);
                },

                fail: (err) => {
                    console.error(err);
                }
            });
        });
    }

    // 把当前画布指定区域的内容导出生成指定大小的图片，并返回文件路径。
    public async saveToTempFilePathEx(
        x:          number,         // 指定的画布区域的左上角横坐标
        y:          number,         // 指定的画布区域的左上角纵坐标
        width:      number,         // 指定的画布区域的宽度
        height:     number,         // 指定的画布区域的高度
        destWidth:  number,         // 输出的图片的宽度
        destHeight: number,         // 输出的图片的高度
        fileType:   string = 'png', // 目标文件的类型 取值为 jpg 和 png 两者之一
        quality:    number = 1      // 图片的质量，目前仅对 jpg 有效。取值范围为 (0, 1]，不在范围内时当作 1.0 处理。
    ): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            wx.canvasToTempFilePath({
                x,
                y,
                width,
                height,
                destWidth,
                destHeight,

                canvasId: this.canvasId,
                fileType,
                quality,

                success: (res: any) => {
                    const { tempFilePath } = res;
                    resolve(tempFilePath);
                },

                fail: (err: any) => {
                    reject(err);
                }
            });
        });
    }

    // 将像素数据绘制到画布的方法。
    public async putImageData(
        x:      number,             // 将要被提取的图像数据矩形区域的左上角横坐标
        y:      number,             // 将要被提取的图像数据矩形区域的左上角纵坐标
        width:  number,             // 将要被提取的图像数据矩形区域的宽度
        height: number,             // 将要被提取的图像数据矩形区域的高度
        data:   Uint8ClampedArray,  // 图像像素点数据，一维数组，每四项表示一个像素点的 rgba
    ): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            wx.canvasPutImageData({
                canvasId: this.canvasId,
                x,
                y,
                width,
                height,
                data,

                success:    () => resolve(),
                fail:       (err: any) => reject(err)
            });
        });
    }

    // 将之前在绘图上下文中的描述（路径、变形、样式）画到 canvas 中。
    public draw(
        reserve: boolean,   // 本次绘制是否接着上一次绘制。
                            // 即 reserve 参数为 false，则在本次调用绘制之前 native 层会先清空画布再继续绘制；
                            // 若 reserve 参数为 true，则保留当前画布上的内容，本次调用 drawCanvas 绘制的内容覆盖在上面，
                            // 默认 false。
        cb: () => void
    ): void {
        this.native.draw(reserve, cb);
    }

    // 创建一个线性的渐变颜色。返回的渐变对象需要使用 CanvasGradient.addColorStop() 来指定渐变点，至少要两个。
    public createLinearGradient(
        x0: number,
        y0: number,
        x1: number,
        y1: number
    ): CanvasGradient {
        const result: CanvasGradient = this.native.createLinearGradient(x0, y0, x1, y1);
        return result;
    }

    // 创建一个圆形的渐变颜色。起点在圆心，终点在圆环。返回的渐变对象需要使用 CanvasGradient.addColorStop() 来指定渐变点，至少要两个。
    public createCircularGradient(
        x0: number,
        y0: number,
        x1: number,
        y1: number
    ): CanvasGradient {
        const result: CanvasGradient = this.native.createCircularGradient(x0, y0, x1, y1);
        return result;
    }

    // 对指定的图像创建模式的方法，可在指定的方向上重复元图像
    public createPattern(
        image:      string, // 重复的图像源，仅支持包内路径和临时路径
        repetition: string  // 如何重复图像, 合法值有: repeat, repeat-x, repeat-y, no-repeat
    ): string {
        const result: string = this.native.createPattern(image, repetition);
        return result;
    }

    // 测量文本尺寸信息，目前仅返回文本宽度。同步接口。
    public measureText(
        text: string    // 要测量的文本
    ): number {
        const result: any = this.native.measureText(text);
        return result.width;
    }

    // 保存绘图上下文。
    public save(): void {
        this.native.save();
    }

    // 恢复之前保存的绘图上下文。
    public restore(): void {
        this.native.restore();
    }

    // 开始创建一个路径，需要调用 fill 或者 stroke 才会使用路径进行填充或描边
    public beginPath(): void {
        this.native.beginPath();
    }

    // 把路径移动到画布中的指定点，不创建线条。
    public moveTo(
        x: number,
        y: number
    ): void {
        this.native.moveTo(x, y);
    }

    // lineTo 方法增加一个新点，然后创建一条从上次指定点到目标点的线。
    public lineTo(
        x: number,
        y: number
    ): void {
        this.native.lineTo(x, y);
    }

    // 创建二次贝塞尔曲线路径
    // 针对 moveTo(20, 20) quadraticCurveTo(20, 100, 200, 20) 的三个关键坐标如下：
    // 起始点(20, 20)
    // 控制点(20, 100)
    // 终止点(200, 20)
    public quadraticCurveTo(
        cpx:    number, // 贝塞尔控制点的 x 坐标
        cpy:    number, // 贝塞尔控制点的 y 坐标
        x:      number, // 结束点的 x 坐标
        y:      number  // 结束点的 y 坐标
    ): void {
        this.native.quadraticCurveTo(cpx, cpy, x, y);
    }

    // 创建三次方贝塞尔曲线路径。
    // 针对 moveTo(20, 20) bezierCurveTo(20, 100, 200, 100, 200, 20) 的三个关键坐标如下：
    // 起始点(20, 20)
    // 两个控制点(20, 100) (200, 100)
    // 终止点(200, 20)
    public bezierCurveTo(
        cpx1:    number,    // 贝塞尔控制点1的 x 坐标
        cpy1:    number,    // 贝塞尔控制点1的 y 坐标
        cpx2:    number,    // 贝塞尔控制点2的 x 坐标
        cpy2:    number,    // 贝塞尔控制点2的 y 坐标
        x:      number,     // 结束点的 x 坐标
        y:      number      // 结束点的 y 坐标
    ): void {
        this.native.bezierCurveTo(cpx1, cpy1, cpx2, cpy2, x, y);
    }

    // 画一条弧线。
    public arc(
        x:                  number, // 圆心的 x 坐标
        y:                  number, // 圆心的 y 坐标
        r:                  number, // 圆的半径
        sAngle:             number, // 起始弧度，单位弧度（在3点钟方向）
        eAngle:             number, // 终止弧度
        counterclockwise:   number  // 弧度的方向是否是逆时针
    ): void {
        this.native.arc(x, y, r, sAngle, eAngle, counterclockwise);
    }

    // 创建一个矩形路径。
    public rect(
        x:      number, // 矩形路径左上角的 x 坐标
        y:      number, // 矩形路径左上角的 y 坐标
        width:  number, // 矩形路径的宽度
        height: number  // 矩形路径的高度
    ): void {
        this.native.rect(x, y, width, height);
    }

    // 根据控制点和半径绘制圆弧路径。
    public arcTo(
        x1:     number, // 第一个控制点的 x 轴坐标
        y1:     number, // 第一个控制点的 y 轴坐标
        x2:     number, // 第二个控制点的 x 轴坐标
        y2:     number, // 第二个控制点的 y 轴坐标
        radius: number  // 圆弧的半径
    ): void {
        this.native.arcTo(x1, y1, x2, y2, radius);
    }

    // clip() 方法从原始画布中剪切任意形状和尺寸。
    // 一旦剪切了某个区域，则所有之后的绘图都会被限制在被剪切的区域内（不能访问画布上的其他区域）。
    // 可以在使用 clip() 方法前通过使用 save() 方法对当前画布区域进行保存，并在以后的任意时间对其进行恢复（通过 restore() 方法）。
    public clip(): void {
        this.native.clip();
    }

    // 填充一个矩形
    public fillRect(
        x:      number, // 矩形路径左上角的 x 坐标
        y:      number, // 矩形路径左上角的 y 坐标
        width:  number, // 矩形路径的宽度
        height: number  // 矩形路径的高度
    ): void {
        this.native.fillRect(x, y, width, height);
    }

    // 设置文字的竖直对齐
    public setTextBaseline(
        textBaseline: string // 文字的竖直对齐方式, 取值有: top, bottom, middle, normal
    ): void {
        this.setTextBaseline(textBaseline);
    }

    // 清除画布上在该矩形区域内的内容
    public clearRect(
        x:      number, // 矩形路径左上角的 x 坐标
        y:      number, // 矩形路径左上角的 y 坐标
        width:  number, // 矩形路径的宽度
        height: number  // 矩形路径的高度
    ): void {
        this.native.clearRect(x, y, width, height);
    }

    // 对当前路径中的内容进行填充。默认的填充色为黑色。
    public fill(): void {
        this.native.fill();
    }

    // 画出当前路径的边框，默认颜色色为黑色。
    public stroke(): void {
        this.native.stroke();
    }

    // 关闭一个路径
    public closePath(): void {
        this.native.closePath();
    }

    // 在调用 scale() 方法后，之后创建的路径其横纵坐标会被缩放。多次调用 scale()，倍数会相乘。
    public scale(
        scaleWidth:     number, // 横坐标缩放的倍数 (1 = 100%，0.5 = 50%，2 = 200%)
        scaleHeight:    number  // 纵坐标轴缩放的倍数 (1 = 100%，0.5 = 50%，2 = 200%)
    ): void {
        this.native.scale(scaleWidth, scaleHeight);
    }

    // 以原点为中心，原点可以用 translate() 方法修改。顺时针旋转当前坐标轴。多次调用 rotate()，旋转的角度会叠加。
    public rotate(
        rotate: number // 旋转角度，以弧度计 degrees * Math.PI/180；degrees 范围为 0-360
    ): void {
        this.native.rotate(rotate);
    }

    // 对当前坐标系的原点 (0, 0) 进行变换，默认的坐标系原点为页面左上角。
    public translate(
        x: number,  // 水平坐标平移量
        y: number   // 竖直坐标平移量
    ): void {
        this.native.translate(x, y);
    }

    // 绘制图像到画布
    public drawImage(
        imageResource:  string, // 所要绘制的图片资源
        dx:             number, // 图像的左上角在目标 canvas 上 x 轴的位置
        dy:             number, // 图像的左上角在目标 canvas 上 y 轴的位置
        dWidth:         number, // 在目标画布上绘制图像的宽度，允许对绘制的图像进行缩放
        dHeight:        number, // 在目标画布上绘制图像的高度，允许对绘制的图像进行缩放
        sx:             number, // 源图像的矩形选择框的左上角 x 坐标
        sy:             number, // 源图像的矩形选择框的左上角 y 坐标
        sWidth:         number, // 源图像的矩形选择框的宽度
        sHeight:        number  // 源图像的矩形选择框的高度
    ): void {
        this.native.drawImage(imageResource, dx, dy, dWidth, dHeight, sx, sy, sWidth, sHeight);
    }

    // 给定的 (x, y) 位置绘制文本描边的方法
    public strokeText(
        text:       string,
        x:          number,
        y:          number,
        maxWidth:   number
    ): void {
        this.native.strokeText(text, x, y, maxWidth);
    }

    // 使用矩阵多次叠加当前变换的方法
    public transform(
        scaleX:     number, // 水平缩放
        skewX:      number, // 水平倾斜
        skewY:      number, // 垂直倾斜
        scaleY:     number, // 垂直缩放
        translateX: number, // 水平移动
        translateY: number  // 垂直移动
    ): void {
        this.native.transform(scaleX, skewX, skewY, scaleY, translateX, translateY);
    }

    // 使用矩阵重新设置（覆盖）当前变换的方法
    public setTransform(
        scaleX:     number, // 水平缩放
        skewX:      number, // 水平倾斜
        skewY:      number, // 垂直倾斜
        scaleY:     number, // 垂直缩放
        translateX: number, // 水平移动
        translateY: number  // 垂直移动
    ): void {
        this.native.setTransform(scaleX, skewX, skewY, scaleY, translateX, translateY);
    }

    // 设置填充色。默认颜色为 black。
    public setFillStyle(
        color: string // 填充的颜色
    ): void {
        this.native.setFillStyle(color);
    }

    // 设置描边颜色。默认颜色为 black。
    public setStrokeStyle(
        color: string // 描边的颜色
    ): void {
        this.native.setStrokeStyle(color);
    }

    // 设定阴影样式。如果没有设置，offsetX 默认值为 0， offsetY 默认值为 0， blur 默认值为 0，color 默认值为 black。
    public setShadow(
        offsetX:    number, // 阴影相对于形状在水平方向的偏移。
        offsetY:    number, // 阴影相对于形状在竖直方向的偏移。
        blur:       number, // 阴影的模糊级别，数值越大越模糊。范围 0- 100。
        color:      string  // 阴影的颜色
    ): void {
        this.native.setShadow(offsetX, offsetY, blur, color);
    }

    // 设置全局画笔透明度。
    public setGlobalAlpha(
        alpha: number // 透明度。范围0-1，0 表示完全透明，1 表示完全不透明。
    ): void {
        this.native.setGlobalAlpha(alpha);
    }

    // 设置线条的宽度
    public setLineWidth(
        lineWidth: number // 线条的宽度
    ): void {
        this.native.setLineWidth(lineWidth);
    }

    //设置线条的交点样式
    public setLineJoin(
        lineJoin: string // 线条的交点样式, 合法值: bevel, round, miter
    ): void {
        this.native.setLineJoin(lineJoin);
    }

    // 设置线条的端点样式
    public setLineCap(
        lineCap: string // 线条的端点样式, 合法值: butt, round, square
    ): void {
        this.native.setLineCap(lineCap);
    }

    // 设置虚线样式的方法。
    public setLineDash(
        pattern:    number[],   // 一组描述交替绘制线段和间距（坐标空间单位）长度的数字
        offset:     number      // 虚线偏移量
    ): void {
        this.setLineDash(pattern, offset);
    }

    // 设置最大斜接长度，斜接长度指的是在两条线交汇处内角和外角之间的距离。
    // 当 CanvasContext.setLineJoin() 为 miter 时才有效。
    // 超过最大倾斜长度的，连接处将以 lineJoin 为 bevel 来显示。
    public setMiterLimit(
        miterLimit: number // 最大斜接长度
    ): void {
        this.native.setMiterLimit(miterLimit);
    }

    // 在画布上绘制被填充的文本
    public fillText(
        text:       string,
        x:          number,
        y:          number,
        maxWidth:   number
    ): void {
        this.native.fillText(text, x, y, maxWidth);
    }

    // 设置字体的字号
    public setFontSize(
        fontSize: number // 字体的字号
    ): void {
        this.native.setFontSize(fontSize);
    }

    // 设置文字的对齐
    public setTextAlign(
        align: string // 文字的对齐方式, 合法值:left, center, right
    ): void {
        this.native.setTextAlign(align);
    }

    // 画一个矩形(非填充)
    public strokeRect(
        x:      number, // 矩形路径左上角的 x 坐标
        y:      number, // 矩形路径左上角的 y 坐标
        width:  number, // 矩形路径的宽度
        height: number  // 矩形路径的高度
    ): void {
        this.native.strokeRect(x, y, width, height);
    }

    public setFont(font: string): void {
        this.native.font = font;
    }

    public getFont(): string {
        return this.native.font;
    }
}