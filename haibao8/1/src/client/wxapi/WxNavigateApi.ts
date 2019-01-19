declare const wx;

export class WxNavigate {
	public static async navigateTo(url: string): Promise<boolean> {
		return new Promise<boolean>((resolve, reject) => {
			wx.navigateTo({
				url,
				success: 	() 		=> resolve(true),
				fail: 		(err) 	=> reject(err)
			});
		});
	}

	public static async redirectTo(url: string): Promise<boolean> {
		return new Promise<boolean>((resolve, reject) => {
			wx.redirectTo({
				url,
				success: 	() 		=> resolve(true),
				fail: 		(err) 	=> reject(err)
			});
		});
	}

	public static async reLaunch(url: string): Promise<boolean> {
		return new Promise<boolean>((resolve, reject) => {
			wx.reLaunch({
				url,
				success: 	() 		=> resolve(true),
				fail: 		(err) 	=> reject(err)
			});
		});
	}

	public static async switchTab(url: string): Promise<boolean> {
		return new Promise<boolean>((resolve, reject) => {
			wx.switchTab({
				url,
				success: 	() 		=> resolve(true),
				fail: 		(err) 	=> reject(err)
			});
		});
	}

	public static async navigateBack(delta: number): Promise<boolean> {
		return new Promise<boolean>((resolve, reject) => {
			wx.navigateBack({
				delta,
				success: 	() 		=> resolve(true),
				fail: 		(err) 	=> reject(err)
			});
		});
	}

	public static setNavigationBarTitle(title: string) {
		wx.setNavigationBarTitle({
			title: title,
		  })	  
	}
}