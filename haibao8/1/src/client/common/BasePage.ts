export interface PageUI {
	setData: (params: Object) => void;
	selectComponent: (params: string) => void;
}  

export class BasePage {
	private pageUI: PageUI = null;

	protected setData(data: Object): void {
		if (this['data']) {
			this['data'] = {
				...this['data'],
				...data
			};
		}

		if (this.pageUI) {
			this.pageUI.setData(data);
		}
	}

	protected selectComponent(data: string): any {
		if (this.pageUI) {
			return this.pageUI.selectComponent(data);
		}
	}

	public async onLoad(pageUI: PageUI, options: Object): Promise<void> {
		this.pageUI = pageUI;
	}
}