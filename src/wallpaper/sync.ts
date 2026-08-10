import type { WallpaperMode } from '@/types/wallpaper'
import { clearFullscreenAnimationTimeout } from './handlers/fullscreen-animation'
import {
	clearMainPanelInlineStyles,
	getMainPanel,
	getWallpaperWrapper,
} from './dom'

/** @parity 切换模式前清除 fullscreen / Swup 写入的 inline 布局，避免压住 CSS */
export function resetWallpaperLayoutInline(): void {
	if (typeof document === 'undefined') return

	clearFullscreenAnimationTimeout()

	const mainPanel = getMainPanel()
	const wrapper = getWallpaperWrapper()

	if (mainPanel) {
		mainPanel.classList.remove('mobile-main-no-banner')
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

export function syncBodyWallpaperClasses(mode: WallpaperMode): void {
	const body = document.body
	body.classList.remove(
		'enable-banner',
		'wallpaper-overlay-active',
		'no-wallpaper-layout',
	)
	switch (mode) {
		case 'banner':
			body.classList.add('enable-banner')
			break
		case 'overlay':
			body.classList.add('wallpaper-overlay-active', 'no-wallpaper-layout')
			break
		case 'fullscreen':
			body.classList.add('no-wallpaper-layout')
			break
		case 'none':
			body.classList.add('no-wallpaper-layout')
			break
	}
}

export function syncWallpaperWrapperClasses(mode: WallpaperMode): void {
	const wrapper = getWallpaperWrapper()
	if (!wrapper) return
	wrapper.classList.remove('wallpaper-overlay', 'wallpaper-fullscreen')
	if (mode === 'overlay') wrapper.classList.add('wallpaper-overlay')
	if (mode === 'fullscreen') wrapper.classList.add('wallpaper-fullscreen')
}
