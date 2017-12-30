class Mole {
	private normalState: Laya.Image
	private hitState: Laya.Image
	private downY: number
	private upY: number

	private isActive: boolean
	private isShow: boolean
	private isHit: boolean

	constructor(normalState: Laya.Image, hitState: Laya.Image, downY: number) {
		this.normalState = normalState
		this.hitState = hitState
		this.downY = downY
		this.upY = this.normalState.y
		this.reset()
		this.normalState.on(Laya.Event.MOUSE_DOWN, this, this.hit)
	}

	// 重置
	reset(): void {
		this.normalState.visible = false
		this.hitState.visible = false
		this.isActive = false
		this.isShow = false
		this.isHit = false
	}

	// 显示
	show(): void {
		if (this.isActive) return

		this.isActive = true
		this.isShow = true
		this.normalState.y = this.downY
		this.normalState.visible = true
		Laya.Tween.to(
			this.normalState,
			{ y: this.upY },
			500,
			Laya.Ease.backOut,
			Laya.Handler.create(this, this.showComplete)
		)
	}

	// 停留
	showComplete(): void {
		if (this.isShow && !this.isHit) {
			Laya.timer.once(2000, this, this.hide)
		}
	}

	// 隐藏
	hide(): void {
		if (this.isShow && !this.isHit) {
			this.isShow = false
			Laya.Tween.to(
				this.normalState,
				{ y: this.downY },
				300,
				Laya.Ease.backIn,
				Laya.Handler.create(this, this.reset)
			)
		}
	}

	//受击
	hit(): void {
		if (this.isShow && !this.isHit) {
			this.isHit = true
			this.isShow = false
			Laya.timer.clear(this, this.hide)
			this.normalState.visible = false
			this.hitState.visible = true
			Laya.timer.once(500, this, this.reset)
		}
	}
}