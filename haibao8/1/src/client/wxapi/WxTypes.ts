export interface WxHttpRequestResponse {
    data:       any;
    statusCode: number;
    header:     Object;
}

export interface WxLoginResponse {
    code?:      string;
    errMsg?:    string;
}

export interface WxUserInfo {
    nickName:   string;
    avatarUrl:  string;
    gender:     string;
    city:       string;
    province:   string;
    country:    string;
    language:   string;
}

export interface WxGetUserInfoResponse {
    userInfo:       WxUserInfo;
    rawData:        string;
    signature:      string;
    encryptedData:  string;
    iv:             string;
}

export interface WxStorageInfo {
    keys:           string[],   // 当前 storage 中所有的 key
    currentSize:    number;     // 当前占用的空间大小, 单位kb
    limitSize:      number;     // 限制的空间大小，单位kb
}

export interface WxFile {
    path: string;
    size: number;
}

export interface WxChooseImageResponse {
    tempFilePaths:  string[];
    tempFiles:      WxFile[];
}

export interface WxImageInfo {
    width:          number;
    height:         number;
    path:           string;
    orientation:    string;
    type:           string;
}

export interface WxRecorderMangerStartOptions {
    duration?:          number; //指定录音的时长，单位 ms ，如果传入了合法的 duration ，在到达指定的 duration 后会自动停止录音，最大值 600000（10 分钟）,默认值 60000（1 分钟）
    sampleRate?:        number; //采样率，有效值 8000/16000/44100
    numberOfChannels?:  number; //录音通道数，有效值 1/2
    encodeBitRate?:     number; //编码码率
    format?:            string; //音频格式，有效值 aac/mp3
    frameSize?:         number; //指定帧大小，单位 KB。传入 frameSize 后，每录制指定帧大小的内容后，会回调录制的文件内容，不指定则不会回调。暂仅支持 mp3 格式。
    audioSource?:       string; //指定音频输入源，默认值为 'auto'
}

export interface WxRecorderManager {
    start:              (options: WxRecorderMangerStartOptions) => void;
    pause:              () => void;
    resume:             () => void;
    stop:               () => void;
    onStart:            () => void;
    onPause:            () => void;
    onStop:             (tempFilePath: string) => void;
    onFrameRecorded:    (frameBuffer: any, isLastFrame: boolean) => void;
    onError:            (errMsg: string) => void;
}

export interface WxGetShareInfoResponse {
    errMsg:         string; // 错误信息
    encryptedData:  string; // 包括敏感数据在内的完整转发信息的加密数据，详细见加密数据解密算法
    iv:             string; // 加密算法的初始向量，详细见加密数据解密算法
}

export interface WxCanvasGetImageDataResponse {
    width:  number;             // 图像数据矩形的宽度
    height: number;             // 图像数据矩形的高度
    data:   Uint8ClampedArray;  // 图像像素点数据，一维数组，每四项表示一个像素点的rgba
}

export interface WxMapLocationInfo {
    longitude:  number; // 经度
    latitude:   number; // 纬度
}

export interface WxLocationInfo {
    latitude:	        number;	// 纬度，范围为 -90~90，负数表示南纬	
    longitude:	        number;	// 经度，范围为 -180~180，负数表示西经	
    speed:	            number;	// 速度，单位 m/s	
    accuracy:	        number;	// 位置的精确度	
    altitude:	        number;	// 高度，单位 m	>= 1.2.0
    verticalAccuracy:	number;	// 垂直精度，单位 m（Android 无法获取，返回 0）	>= 1.2.0
    horizontalAccuracy:	number;	// 水平精度，单位 m
}

export interface WxChooseLocationResponse {
    errMsg:     string;
    name:	    string; // 位置名称	
    address:	string; // 详细地址	
    latitude:	number; // 纬度，浮点数，范围为-90~90，负数表示南纬。使用 gcj02 国测局坐标系	
    longitude:	number; // 经度，浮点数，范围为-180~180，负数表示西经。使用 gcj02 国测局坐标系	
}

// export interface WxNetworkStatusChangeResponse {
// }
// isConnected: boolean;
// networkType: string;

// export interface WxAccelerometerChangeResponse {
//     x: number;
//     y: number;
//     z: number;
// }

export interface WxRegion {
    southwest: number, // 西南角经纬度
    northeast: number  // 东北角经纬度
}

export interface WxSystemInfo {
    brand:	            string; //	手机品牌	>= 1.5.0
    model:	            string;	//  手机型号	
    pixelRatio:	        number; //	设备像素比	
    screenWidth:	    number; //	屏幕宽度	>= 1.1.0
    screenHeight:	    number; //	屏幕高度	>= 1.1.0
    windowWidth:	    number; //	可使用窗口宽度	
    windowHeight:	    number; //	可使用窗口高度	
    statusBarHeight:	number; //	状态栏的高度	>= 1.9.0
    language:	        string; //	微信设置的语言	
    version:	        string; //	微信版本号	
    system:	            string; //	操作系统版本	
    platform:	        string; //	客户端平台	
    fontSizeSetting:	number; //	用户字体大小设置。以“我-设置-通用-字体大小”中的设置为准，单位 px。	>= 1.5.0
    SDKVersion:	        string; //	客户端基础库版本	>= 1.1.0
    benchmarkLevel:	    number; //	(仅Android小游戏) 性能等级，-2 或 0：该设备无法运行小游戏，-1：性能未知，>=1 设备性能值，该值越高，设备性能越好 (目前设备最高不到50)	>= 1.8.0
}

export interface WxBatteryInfo {
    level:      string;     // 设备电量，范围 1 - 100
    isCharging: boolean;    // 是否正在充电中
}

export interface WxScanCodeResult {
    result:	    string; //  所扫码的内容	
    scanType:	string; //	所扫码的类型	
    charSet:	string; //	所扫码的字符集	
    path:	    string; //	当所扫的码为当前小程序的合法二维码时，会返回此字段，内容为二维码携带的 path	
    rawData:	string; //	原始数据，base64编码
}

export interface WxFileInfo {
    size:	number; //	文件大小，以字节为单位	
    digest:	string; //	按照传入的 digestAlgorithm 计算得出的的文件摘要
}

export interface WxSavedFileInfo {
    size:	    number; //	文件大小，单位 B	
    createTime:	number; //	文件保存时的时间戳，从1970/01/01 08:00:00 到该时刻的秒数
}

export interface WxSavedFileItem {
    filePath:	string; //	本地路径	
    size:	    number; //	本地文件大小，以字节为单位	
    createTime:	number; //	文件保存时的时间戳，从1970/01/01 08:00:00 到当前时间的秒数
}
