import * as WxTypes from './WxTypes';

declare const wx;

export class WxFile {
	// 保存文件到本地。注意：saveFile 会把临时文件移动，因此调用成功后传入的 tempFilePath 将不可用
	public static async saveFile(tempFilePath: string): Promise<string> {
		return new Promise<string>((resolve, reject) => {
			wx.saveFile({
				tempFilePath,
				success: 	(res: any) => resolve(res.savedFilePath),
				fail:		(err: any) => reject(err)
			});
		});
	}

	// 删除本地缓存文件
	public static async removeSavedFile(filePath: string): Promise<void> {
		return new Promise<void>((resolve, reject) => {
			wx.removeSavedFile({
				filePath,
				success: 	() => resolve(),
				fail: 		(err: any) => reject(err)
			});
		});
	}

	// 获取文件信息
	public static async getFileInfo(
		filePath: 			string,
		digestAlgorithm: 	string // md5 或 sha1
	): Promise<WxTypes.WxFileInfo> {
		return new Promise<WxTypes.WxFileInfo>((resolve, reject) => {
			wx.getFileInfo({
				filePath,
				success: 	(res: WxTypes.WxFileInfo) => resolve(res),
				fail:		(err: any) => reject(err)
			});
		});
	}

	// 获取本地文件的文件信息。此接口只能用于获取已保存到本地的文件，若需要获取临时文件信息，请使用 wx.getFileInfo() 接口
	public static async getSavedFileInfo(
		filePath: 			string
	): Promise<WxTypes.WxSavedFileInfo> {
		return new Promise<WxTypes.WxSavedFileInfo>((resolve, reject) => {
			wx.getSavedFileInfo({
				filePath,
				success: 	(res: WxTypes.WxSavedFileInfo) => resolve(res),
				fail:		(err: any) => reject(err)
			});
		});
	}

	// 获取该小程序下已保存的本地缓存文件列表
	public static async getSavedFileList(): Promise<WxTypes.WxSavedFileItem[]> {
		return new Promise<WxTypes.WxSavedFileItem[]>((resolve, reject) => {
			wx.getSavedFileList({
				success: 	(res: WxTypes.WxSavedFileItem[]) => resolve(res),
				fail:		(err: any) => reject(err)
			});
		});
	}

	// 新开页面打开文档
	public static async openDocument(
		filePath: string,
		fileType: string
	): Promise<void> {
		return new Promise<void>((resolve, reject) => {
			wx.openDocument({
				filePath,
				fileType,
				success:	() => resolve(),
				fail:		(err: any) => reject(err)
			});
		});
	}
}