import * as WxTypes             from './WxTypes';

import { WxOpen }               from './WxOpenApi';
import { WxStorage }            from './WxStorageApi';
import { WxImage }              from './WxImageApi';
import { WxNavigate }           from './WxNavigateApi';
import { WxUI }                 from './WxUIApi';
import { WxCanvasContext }      from './WxCanvasContextApi';
import { WxShare }              from './WxShareApi';
import { WxMapContext }         from './WxMapContextApi';
import { WxWebSocket }          from './WxWebSocketApi';
import { WxDevice }             from './WxDeviceApi';
import { WxUpdate }             from './WxUpdateApi';
import { WxFile }               from './WxFileApi';

import { 
    WxHttp, 
    WxUploadFile, 
    WxDownloadFile 
} from './WxNetworkApi';

export {
    WxTypes,

    WxDevice,
    WxUpdate,

    WxOpen,
    WxStorage,
    WxImage,

    WxHttp,
    WxUploadFile,
    WxDownloadFile,
    WxWebSocket,
    
    WxUI,
    WxShare,
    WxNavigate,

    WxCanvasContext,
    WxMapContext,

    WxFile
}