import { wallpaper } from '@/config/wallpaper'
import type { WallpaperMode } from '@/types/wallpaper'
import { clearFullscreenAnimationTimeout } from './handlers/fullscreen-animation'
import { cancelPanelTransition } from './panel-transition'
import {
	clearMainPanelInlineStyles,
	getMainPanel,
	getWallpaperWrapper,
} from './dom'

/** @parity Firefly body 修饰 class（保留 memorris 别名以兼容 Layout 内联脚本） */
export function syncBodyWallpaperClasses(mode: WallpaperMode): void {
	const body = document.body
	body.classList.remove(
		'enable-banner',
		'wallpaper-transparent',
		'wallpaper-overlay-active',
		'no-banner-layout',
		'no-wallpaper-layout',
	)
	switch (mode) {
		case 'banner':
			body.classList.add('enable-banner')
			break
		case 'overlay':
			body.classList.add(
				'wallpaper-transparent',
				'wallpaper-overlay-active',
				'no-banner-layout',
				'no-wallpaper-layout',
			)
			break
		case 'fullscreen':
			body.classList.add('no-banner-layout', 'no-wallpaper-layout')
			break
		case 'none':
			body.classList.add('no-banner-layout', 'no-wallpaper-layout')
			break
	}
}

/** @parity Firefly adjustMainContentTransparency */
export function syncMainPanelTransparency(enable: boolean): void {
	const mainPanel = getMainPanel()
	const body = document.body
	if (enable) {
		mainPanel?.classList.add('wallpaper-transparent')
		body.classList.add('wallpaper-transparent')
	} else {
		mainPanel?.classList.remove('wallpaper-transparent')
		body.classList.remove('wallpaper-transparent')
	}
}

export function syncWallpaperWrapperClasses(mode: WallpaperMode): void {
	const wrapper = getWallpaperWrapper()
	if (!wrapper) return
	wrapper.classList.remove('wallpaper-overlay', 'wallpaper-fullscreen')
	if (mode === 'overlay') wrapper.classList.add('wallpaper-overlay')
	if (mode === 'fullscreen') wrapper.classList.add('wallpaper-fullscreen')
}

/** 仅清 wallpaper wrapper inline（模式切换动画期间保留 #main-panel 锁定位） */
export function resetWallpaperWrapperInline(): void {
	if (typeof document === 'undefined') return

	const wrapper = getWallpaperWrapper()
	if (wrapper) {
		wrapper.classList.remove('mobile-hide-banner')
		wrapper.style.removeProperty('display')
		wrapper.style.removeProperty('top')
		wrapper.style.removeProperty('transform')
		wrapper.style.removeProperty('height')
	}
}

/** @parity 切换模式前清除 fullscreen / Swup 写入的 inline 布局，避免压住 CSS */
export function resetWallpaperLayoutInline(): void {
	if (typeof document === 'undefined') return

	clearFullscreenAnimationTimeout()
	cancelPanelTransition()

	const mainPanel = getMainPanel()
	const wrapper = getWallpaperWrapper()

	if (mainPanel) {
		mainPanel.classList.remove(
			'mobile-main-no-banner',
			'no-banner-layout',
			'wallpaper-panel-animating',
		)
		clearMainPanelInlineStyles(mainPanel)
	}

	if (wrapper) {
		wrapper.classList.remove('mobile-hide-banner')
		wrapper.style.removeProperty('display')
		wrapper.style.removeProperty('top')
		wrapper.style.removeProperty('transform')
		wrapper.style.removeProperty('height')
	}
}

export function isWallpaperModeSwitchable(): boolean {
	return wallpaper.switchable
}
