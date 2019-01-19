// 根据Cos里的原图链接, 生成指定最大宽度的缩略图链接
export const makeThumbUrl = (cosUrl: string, maxWidth: number): string => {
    let s: string = cosUrl;
    s = s.replace('cos.ap-beijing', 'picbj');
    s = s + `?imageView2/2/w/${maxWidth}`;
    return s;
};

export interface PageData<T> {
    total:  number;
    data:   T[];
}

// Mongo 数据库服务器连接信息
export interface MongoInfo {
    host:           string; // 服务器地址
    port:           number; // 服务器端口
    user:           string; // 用户名
    password:       string; // 密码(明文)
    database:       string; // 数据库名称
    tablePrefix:    string; // 表前缀
}

export interface DBInfo {
    mongo:  MongoInfo;
    inited: boolean;
}

export enum SettingsNameEnum {
    wxappConfigs        = 'wxappConfigs',
    tencentCosConfigs   = 'tencentCosConfigs',
    
    wxpayConfigs        = 'wxpayConfigs',
    alipayConfig        = 'alipayConfigs',
    dosageUnitPrice     = 'dosageUnitPrice',
    defGiveMoneyFen     = 'defGiveMoneyFen',
    orderSubject        = 'orderSubject'
}

export interface WxappConfigs {
    appid:      string;
    appsecret:  string;
}

// 微信支付配置
export interface WxpayConfigs {
    appid:  string;
    mch_id: string;
    key:    string;
    payee:  string;
}

export interface TencentCosConfigs {
    appid:      string;
    secretid:   string;
    secretkey:  string;
    bucket:     string;
    region:     string;
} 

// 支付宝支付配置
export interface AlipayConfigs {
    app_id:             string;
    app_private_key:    string;
    alipay_public_key:  string;
    sign_type:          string;
    alipay_gateway:     string;
}

// 订单
export interface OrderInfo {
    orderID:        number;
    accountID:      number;
    orderSubject:   string;
    out_trade_no:   string;
    orderMoneyFen:  number;
    transaction_id: string;
    createDate:     number;
    createDateObj:  Date;
    orderStatus:    number;
    payMethod:      number;
    endDate:        number;
    endDateObj:     Date;
    return_url:     string;
}

export type OrderInfoPageData = PageData<OrderInfo>;

// 消费记录
export interface DosageInfo {
    dosageID:       number;
    accountID:      number;
    startDate:      number;
    startDateObj:   Date;
    endDate:        number;
    endDateObj:     Date;
    minutes:        number;
    incByFen:       number;
}

export type DosageInfoPageData = PageData<DosageInfo>;

export interface DosageUnitPrice {
    fenPerRoomUser: number;
}

export interface OrderSubject {
    orderSubject: string;
}

export const OrderNumFieldName = 'orderNum';

export interface WxWatermark {
    timestamp:  number;
    appid:      string;
}

export interface WxUserInfo {
    nickName:   string;
    avatarUrl:  string;
    gender:     number;
    city:       string;
    province:   string;
    country:    string;
    language:   string;

    openId?:    string;
    unionId?:   string;
    watermark?: WxWatermark;
}

export interface WxPhoneNumberInfo {
    phoneNumber:        string; // 用户绑定的手机号（国外手机号会有区号）
    purePhoneNumber:    string; // 没有区号的手机号
    countryCode:        string; // 区号
    watermark?:         WxWatermark;
}

// 管理员信息
export interface AdminInfo {
    adminID:            number; // 管理员ID
    adminName:          string; // 管理员名
    password:           string; // 管理员密码(密文)
    createDate:         number; // 创建日期时间戳
    createDateObj:      Date;   // 创建日期
    loginTimes:         number; // 登录次数
    lastLoginDate:      number; // 最后登录时间戳(毫秒)
    lastLoginDateObj:   Date;   // 最后登录时间对象
}

export interface AdminEditableInfo {
    adminName?: string;
}

export interface AdminLoginInfo {
    accessToken:    string;
    adminInfo:      AdminInfo;
}

// 用户信息
export interface AccountInfo {
    accountID:          number; // 帐户ID
    createDate:         number; // 创建日期时间戳
    createDateObj:      Date;   // 创建日期

    loginTimes:         number; // 登录次数
    lastLoginDate:      number; // 最后登录时间戳(毫秒)
    lastLoginDateObj:   Date;   // 最后登录时间对象,

    openid:             string;
    userInfo:           WxUserInfo;
    phoneNumberInfo:    WxPhoneNumberInfo;

    avatarUrlCos:       string;
}

export type AccountInfoPageData = PageData<AccountInfo>;

export interface AccountEditableInfo {
    userInfo?:          WxUserInfo;
    phoneNumberInfo?:   WxPhoneNumberInfo;
    avatarUrlCos?:      string;
}

export interface AccountLoginInfo {
    accessToken:    string;
    accountInfo:    AccountInfo;
}

export interface PosterSlideInfo {
    posterSlideID:      number;
    posterSlideName:    string;
    posterSlideDesc:    string;
    posterSlideUrl:     string;
    posterSlideLink:    string;
    orderNum:           number;
}

export type PosterSlidePageData = PageData<PosterSlideInfo>;

export interface PosterSlideEditableInfo {
    posterSlideName?:   string;
    posterSlideDesc?:   string;
    posterSlideUrl?:    string;
    posterSlideLink?:   string;
    orderNum?:          number;
}

export interface PosterCatInfo {
    posterCatID:    number;
    posterCatName:  string;
    posterCatDesc:  string;
    hotspot:        boolean;
    orderNum:       number;
    posters?:       PosterInfoPageData;
}

export type PosterCatPageData = PageData<PosterCatInfo>;

export interface PosterCatEditableInfo {
    posterCatName?: string;
    posterCatDesc?: string;
    hotspot?:       boolean;
    orderNum?:      number;
}

export interface PosterInfo {
    posterID:           number;
    posterCatIDs:       number[];
    posterName:         string;
    posterDesc:         string;
    posterData:         string;
    posterUrl:          string;
    // thumbUrl:           string;    
    createDate:         number;
    createDateObj:      Date;
    viewTimes:          number;     // 展示次数

    posterCatNames?:    string[];
}

export type PosterInfoPageData = PageData<PosterInfo>;

export interface PosterEditableInfo {
    posterCatIDs?:  number[];
    posterName?:    string;
    posterDesc?:    string;
    posterData?:    string;
    posterUrl?:     string;
    // thumbUrl?:      string;
}

export interface PosterHomeData {
    slides:     PosterSlideInfo[];
    cats:       PosterCatInfo[];
}

export interface PosterMoreData {
    cats:       PosterCatInfo[];
}

export interface ShopSlideInfo {
    shopSlideID:    number;
    shopSlideName:  string;
    shopSlideDesc:  string;
    shopSlideUrl:   string;
    shopSlideLink:  string;
    orderNum:       number;
}

export type ShopSlidePageData = PageData<ShopSlideInfo>;

export interface ShopSlideEditableInfo {
    shopSlideName?: string;
    shopSlideDesc?: string;
    shopSlideUrl?:  string;
    shopSlideLink?: string;
    orderNum?:      number;
}

export interface ShopCatInfo {
    shopCatID:      number;
    shopCatName:    string;
    shopCatDesc:    string;
    hotspot:        boolean;
    orderNum:       number;
    shops?:         ShopInfoPageData;
}

export type ShopCatPageData = PageData<ShopCatInfo>;

export interface ShopCatEditableInfo {
    shopCatName?:   string;
    shopCatDesc?:   string;
    hotspot?:       boolean;
    orderNum?:      number;
}

export enum ReviewStatusEnum {
    srsAll      = 0, // 所有状态
    srsWait     = 1, // 等待审核
    srsSuccess  = 2, // 审核通过
    srsReject   = 3  // 审核拒绝
}

export interface ShopInfo {
    shopID:             number;     // 店铺ID
    accountID:          number;     // 所属的用户ID
    
    shopCatID:          number;     // 店铺分类
    shopName:           string;     // 店铺名称
    shopDesc:           string;     // 店铺描述
    phoneNumber:        string;     // 联系电话
    shopAddress:        string;     // 店铺地址
    longitude:          number;     // 经度 
    latitude:           number;     // 纬度
    logoUrl:            string;     // 店铺Logo
    shopDetail:         string;     // 店铺详情
    shopImages:         string[];   // 店铺图片数组

    viewTimes:          number;     // 展示次数

    createDate:         number;     // 创建时间戳
    createDateObj:      Date;

    modifyDate:         number;     // 修改时间戳
    modifyDateObj:      Date;

    reviewDate:         number;     // 审核时间戳
    reviewDateObj:      Date;

    reviewStatus:       ReviewStatusEnum;   // 审核状态
    rejectReason:       string;             // 拒绝原因

    accountNickName?:   string;
    shopCatName?:       string;
}

export type ShopInfoPageData = PageData<ShopInfo>;

export interface ShopEditableInfo {
    shopCatID?:     number;
    shopName?:      string;
    shopDesc?:      string;
    phoneNumber?:   string;
    shopAddress?:   string;
    longitude?:     number;     // 经度 
    latitude?:      number;     // 纬度
    logoUrl?:       string;
    shopDetail?:    string;
    shopImages?:    string[];
}

export interface ShopHomeData {
    slides:         ShopSlideInfo[];
    shopPageData:   ShopInfoPageData;
}

export interface PosterFavoriteInfo {
    posterFavoriteID:   number;
    accountID:          number;
    posterID:           number;
    favoriteDate:       number;

    posterInfo?:        PosterInfo;
}

export type PosterFavoritePageData = PageData<PosterFavoriteInfo>;

export interface MyPosterInfo {
    myPosterID:         number;
    accountID:          number;
    posterID:           number;
    myPosterName:       string;
    myPosterDesc:       string;
    myPosterUrl:        string;
    createDate:         number;
    createDateObj:      Date;
}

export type MyPosterInfoPageData = PageData<MyPosterInfo>;

export interface MyPosterEditableInfo {
    posterID?:          number;
    myPosterName?:      string;
    myPosterDesc?:      string;
    myPosterUrl?:       string;
}