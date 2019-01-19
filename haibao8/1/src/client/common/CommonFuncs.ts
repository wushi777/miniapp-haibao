import * as wxapi from '../wxapi/index';

export class CommonFuncs {
	public static formatTime(date: Date): string {
		const year: 	number	= date.getFullYear();
		const month: 	number 	= date.getMonth() + 1;
		const day: 		number	= date.getDate();
		const hour: 	number	= date.getHours();
		const minute: 	number 	= date.getMinutes();
		const second: 	number 	= date.getSeconds();

		return [year, month, day].map(this.formatNumber).join('/') + ' ' + 
				[hour, minute, second].map(this.formatNumber).join(':');
	}

	public static formatNumber(n: number): string {
		const x: string = n.toString();
		return x[1] ? x : '0' + x;
	}

	// 显示繁忙提示
	public static showBusy(text: string): void {
		wxapi.WxUI.showToast(text, 'loading', '', 10000);
	}
	//隐藏
	public static hideToast(): void {
		wxapi.WxUI.hideToast();
	}

	// 显示成功提示
	public static showSuccess(text: string): void {
		wxapi.WxUI.showToast(text, 'success');
	}

	// 显示失败提示
	public static showFail(text: string): void {
		wxapi.WxUI.showToast(text, 'none');
	}

	// 显示Model对话框
	public static showModel(title: string, content: any): void {
		wxapi.WxUI.hideToast();
		wxapi.WxUI.showModal(title, JSON.stringify(content), false);
	}

	public static async showDialogBox(title: string, content: any): Promise<boolean> {
		const result: boolean = await wxapi.WxUI.showModal(title, JSON.stringify(content), true);
		return result;
	}

	// 显示繁忙提示
	public static showLoading(text: string): void {
		wxapi.WxUI.showLoading(text);
	}
	//隐藏
	public static hideLoading(): void {
		wxapi.WxUI.hideLoading();
	}

	public static canIUse(str: string): any {
		return wxapi.WxUI.canIUse(str);
	}
}









