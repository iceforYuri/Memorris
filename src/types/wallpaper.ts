export type WallpaperMode = 'banner' | 'fullscreen' | 'overlay' | 'none'

export type WallpaperConfig = {
	/** 默认模式；访客切换见 switchable（Phase 2） */
	mode: WallpaperMode
	/** Phase 2：是否允许在 DisplaySettings 切换四模式 */
	switchable: boolean
	src: {
		desktop?: string
		mobile?: string
	}
	banner: {
		position?: 'top' | 'center' | 'bottom'
		credit: {
			enable: boolean
			text: string
			url?: string
		}
	}
	overlay: {
		opacity: number
		blur: number
		cardOpacity: number
		zIndex: number
		/** 移动端 overlay 模糊上限（Phase 2） */
		mobileMaxBlur?: number
	}
	fullscreen: {
		position?: string
		hideOnNonHome?: boolean
	}
}
