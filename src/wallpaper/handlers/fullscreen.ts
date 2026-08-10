import { wallpaper } from '@/config/wallpaper'
import { getMainPanel, getWallpaperWrapper } from '../dom'
import { syncWallpaperLayoutAfterModeChange } from '../layout'
import { resetWallpaperLayoutInline } from '../sync'
import type { WallpaperModeHandler } from '../types'

import {
	clearFullscreenAnimationTimeout,
	scheduleFullscreenAnimationCleanup,
} from './fullscreen-animation'

function shouldHideFullscreenWallpaper(isHome: boolean): boolean {
	const isMobile = window.innerWidth < 1024
	const hideOnNonHome = wallpaper.fullscreen.hideOnNonHome ?? false
	return (isMobile && !isHome) || (hideOnNonHome && !isHome && !isMobile)
}

/**
 * fullscreen 模式 handler
 * 桌面布局靠 wallpaper.css；滚动一次到位，不写 content:replace inline
 */
export const fullscreenHandler: WallpaperModeHandler = {
	mode: 'fullscreen',

	clearPendingAnimation() {
		clearFullscreenAnimationTimeout()
	},

	adjustLayout(ctx, animate = false) {
		const mainPanel = getMainPanel()
		const wrapper = getWallpaperWrapper()
		if (!mainPanel) return

		if (shouldHideFullscreenWallpaper(ctx.isHome)) {
			wrapper?.classList.add('mobile-hide-banner')
			if (wrapper) wrapper.style.display = 'none'
			mainPanel.classList.add('mobile-main-no-banner')
			return
		}

		if (wrapper) {
			wrapper.style.display = ''
			wrapper.classList.remove('mobile-hide-banner')
		}
		mainPanel.classList.remove('mobile-main-no-banner')

		if (animate && ctx.isHome && ctx.isMobile === false) {
			const computedTop = mainPanel.getBoundingClientRect().top
			mainPanel.style.setProperty('transition', 'none', 'important')
			mainPanel.style.setProperty('position', 'absolute', 'important')
			mainPanel.style.setProperty('z-index', '30', 'important')
			mainPanel.style.setProperty('top', `${computedTop}px`, 'important')
			mainPanel.style.setProperty('margin-top', '1rem', 'important')
			void mainPanel.offsetWidth
			mainPanel.style.setProperty(
				'transition',
				'top 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
				'important',
			)
			mainPanel.style.setProperty('top', '100vh', 'important')
			clearFullscreenAnimationTimeout()
			scheduleFullscreenAnimationCleanup(() => {
				for (const prop of [
					'position',
					'top',
					'margin-top',
					'transition',
					'z-index',
				] as const) {
					mainPanel.style.removeProperty(prop)
				}
			}, 450)
		}
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
			mainPanel.style.setProperty('top', '5.5rem', 'important')
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
