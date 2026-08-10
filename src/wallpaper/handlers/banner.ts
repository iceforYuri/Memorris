import { getMainPanel, getWallpaperWrapper } from '../dom'
import { syncWallpaperLayoutAfterModeChange } from '../layout'
import { resetWallpaperLayoutInline } from '../sync'
import type { WallpaperModeHandler } from '../types'

/**
 * banner 模式 handler
 * 桌面：Layout toggle `lg:is-home` + CSS translate；scroll:top 回顶（与壳层 700ms 协调）
 */
export const bannerHandler: WallpaperModeHandler = {
	mode: 'banner',

	adjustLayout(ctx, _animate = false) {
		const mainPanel = getMainPanel()
		const wrapper = getWallpaperWrapper()
		if (!mainPanel) return

		if (wrapper) wrapper.style.display = ''

		if (!ctx.isMobile) return

		if (!ctx.isHome) {
			mainPanel.classList.add('mobile-main-no-banner')
			mainPanel.style.setProperty('top', '5.5rem', 'important')
		} else {
			mainPanel.classList.remove('mobile-main-no-banner')
			mainPanel.style.removeProperty('top')
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

	onPageView() {},

	onContentReplace() {},

	resolveScrollTarget() {
		return 'top'
	},

	shouldSkipVisitScrollToTop() {
		return true
	},
}
