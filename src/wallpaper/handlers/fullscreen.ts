import { wallpaper } from '@/config/wallpaper'
import { getMainPanel, getWallpaperWrapper } from '../dom'
import { syncWallpaperLayoutAfterModeChange } from '../layout'
import { resetWallpaperLayoutInline } from '../sync'
import type { AdjustLayoutOptions } from '../types'
import type { WallpaperModeHandler } from '../types'

import { clearFullscreenAnimationTimeout } from './fullscreen-animation'

const COMPACT_MAIN_TOP = '5.5rem'

function shouldHideFullscreenWallpaper(isHome: boolean): boolean {
	const isMobile = window.innerWidth < 1024
	const hideOnNonHome = wallpaper.fullscreen.hideOnNonHome ?? false
	return (isMobile && !isHome) || (hideOnNonHome && !isHome && !isMobile)
}

function syncFullscreenWrapperOnly(ctx: {
	isHome: boolean
}): void {
	const wrapper = getWallpaperWrapper()
	if (!wrapper) return

	wrapper.classList.remove('wallpaper-overlay')
	wrapper.classList.add('wallpaper-fullscreen')

	if (shouldHideFullscreenWallpaper(ctx.isHome)) {
		wrapper.style.display = 'none'
		wrapper.classList.add('mobile-hide-banner')
	} else {
		wrapper.style.display = 'block'
		wrapper.style.setProperty('display', 'block', 'important')
		wrapper.style.top = ''
		requestAnimationFrame(() => {
			wrapper.classList.remove('hidden', 'opacity-0', 'mobile-hide-banner')
			wrapper.classList.add('opacity-100')
		})
	}
}

function applyFullscreenMainPanelLayout(
	mainPanel: HTMLElement,
	ctx: { isHome: boolean; isMobile: boolean },
): void {
	if (ctx.isMobile && !ctx.isHome) {
		mainPanel.classList.remove('wallpaper-panel-animating')
		mainPanel.classList.add('mobile-main-no-banner', 'no-banner-layout')
		mainPanel.style.setProperty('top', COMPACT_MAIN_TOP, 'important')
		mainPanel.style.setProperty('margin-top', '0', 'important')
		mainPanel.style.position = ''
		mainPanel.style.removeProperty('min-height')
		mainPanel.style.transition = ''
		return
	}

	mainPanel.classList.remove('mobile-main-no-banner', 'wallpaper-panel-animating')
	mainPanel.classList.add('no-banner-layout')
	mainPanel.style.removeProperty('position')
	mainPanel.style.removeProperty('z-index')
	mainPanel.style.removeProperty('top')
	mainPanel.style.removeProperty('margin-top')
	mainPanel.style.removeProperty('min-height')
	mainPanel.style.removeProperty('transition')
}

export const fullscreenHandler: WallpaperModeHandler = {
	mode: 'fullscreen',

	clearPendingAnimation() {
		clearFullscreenAnimationTimeout()
	},

	adjustLayout(ctx, _animate = false, options?: AdjustLayoutOptions) {
		const mainPanel = getMainPanel()
		if (!mainPanel) return

		syncFullscreenWrapperOnly(ctx)

		if (options?.skipMainPanel) return

		if (shouldHideFullscreenWallpaper(ctx.isHome)) {
			mainPanel.classList.remove('wallpaper-panel-animating')
			mainPanel.classList.add('mobile-main-no-banner', 'no-banner-layout')
			mainPanel.style.setProperty('top', COMPACT_MAIN_TOP, 'important')
			mainPanel.style.setProperty('margin-top', '0', 'important')
			return
		}

		applyFullscreenMainPanelLayout(mainPanel, ctx)
	},

	onVisitStart(ctx) {
		if (!ctx.isMobile) return

		const mainPanel = getMainPanel()
		const wrapper = getWallpaperWrapper()
		if (!mainPanel || !wrapper) return

		mainPanel.style.setProperty('transition', 'none', 'important')
		if (ctx.isHome) {
			wrapper.classList.remove('mobile-hide-banner')
			wrapper.style.display = ''
			setTimeout(() => {
				resetWallpaperLayoutInline()
				syncWallpaperLayoutAfterModeChange(false)
				mainPanel.style.removeProperty('transition')
			}, 150)
		} else {
			wrapper.classList.add('mobile-hide-banner')
			wrapper.style.display = 'none'
			mainPanel.classList.add('mobile-main-no-banner')
			mainPanel.style.setProperty('top', COMPACT_MAIN_TOP, 'important')
		}
	},

	onPageView(ctx) {
		if (!ctx.isMobile) return
		fullscreenHandler.adjustLayout(ctx, false)
	},

	onContentReplace() {},

	resolveScrollTarget(ctx) {
		return ctx.isHome ? 'top' : 'main-grid'
	},

	shouldSkipVisitScrollToTop() {
		return true
	},
}

/** 计算 fullscreen 非首页应滚到的 Y（壁纸底 = 正文顶） */
export function getFullscreenContentScrollTop(): number {
	const wrapper = getWallpaperWrapper()
	if (
		wrapper &&
		!wrapper.classList.contains('mobile-hide-banner') &&
		wrapper.offsetHeight > 0
	) {
		return Math.round(wrapper.offsetTop + wrapper.offsetHeight)
	}

	const mainPanel = getMainPanel()
	if (mainPanel) {
		void mainPanel.offsetHeight
		return Math.round(
			mainPanel.getBoundingClientRect().top + window.scrollY,
		)
	}

	const mainGrid = document.getElementById('main-grid')
	if (mainGrid) {
		return Math.round(
			mainGrid.getBoundingClientRect().top + window.scrollY,
		)
	}

	return 0
}

/** 全屏壁纸非首页：滚到 #main-grid（壁纸底标注线） */
export function scrollToFullscreenContent(
	behavior: ScrollBehavior = 'auto',
): boolean {
	if (typeof window === 'undefined') return false
	const mainGrid = document.getElementById('main-grid')
	if (mainGrid) {
		mainGrid.scrollIntoView({ behavior, block: 'start' })
		return true
	}
	const top = getFullscreenContentScrollTop()
	if (top > 0) {
		window.scrollTo({ top, left: 0, behavior })
		return true
	}
	return false
}
