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
 * Phase D 禁止事项：勿在未评估 scroll 链前删 onContentReplace inline（待 D-2）
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
		const mainPanel = getMainPanel()
		const wrapper = getWallpaperWrapper()
		if (!mainPanel || !wrapper) return

		if (ctx.isMobile) {
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
			return
		}

		wrapper.style.display = ''
		wrapper.classList.remove('mobile-hide-banner')
		mainPanel.classList.remove('mobile-main-no-banner')
	},

	onPageView() {},

	onContentReplace() {
		if (typeof document === 'undefined') return
		if (window.innerWidth < 1024) return

		const mainPanel = getMainPanel()
		const wrapper = getWallpaperWrapper()
		if (!mainPanel || !wrapper) return

		mainPanel.classList.remove('mobile-main-no-banner')
		wrapper.style.display = ''
		wrapper.classList.remove('mobile-hide-banner')
		mainPanel.style.setProperty('position', 'relative', 'important')
		mainPanel.style.setProperty('z-index', '30', 'important')
		mainPanel.style.setProperty('top', '0', 'important')
		mainPanel.style.setProperty('margin-top', '1rem', 'important')
	},

	resolveScrollTarget(ctx) {
		return ctx.isHome ? 'top' : 'main-grid'
	},

	shouldSkipVisitScrollToTop(ctx) {
		return !ctx.isHome
	},
}

/** @parity 计算 fullscreen 非首页应滚到的 Y（壁纸底 = 正文顶） */
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

/** @parity 全屏壁纸非首页：滚到 #main-grid（Firefly scroll:top 同款） */
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
