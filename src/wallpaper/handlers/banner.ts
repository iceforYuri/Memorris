import { getMainPanel, getWallpaperWrapper } from '../dom'
import { syncWallpaperLayoutAfterModeChange } from '../layout'
import { resetWallpaperLayoutInline } from '../sync'
import type { WallpaperModeHandler } from '../types'

/**
 * banner 模式 handler
 * Phase D 禁止事项：勿在 onVisitStart 删除桌面 inline top（待 D-1 统一处理）
 */
export const bannerHandler: WallpaperModeHandler = {
	mode: 'banner',

	adjustLayout(ctx, _animate = false) {
		const mainPanel = getMainPanel()
		const wrapper = getWallpaperWrapper()
		if (!mainPanel) return

		if (wrapper) wrapper.style.display = ''
		if (!ctx.isHome && ctx.isMobile) {
			mainPanel.classList.add('mobile-main-no-banner')
			mainPanel.style.setProperty('top', '5.5rem', 'important')
		} else if (!ctx.isHome && !ctx.isMobile) {
			mainPanel.style.setProperty(
				'top',
				'calc(var(--banner-height) - 3.5rem)',
				'important',
			)
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

		if (!ctx.isHome) {
			mainPanel.style.setProperty(
				'top',
				'calc(var(--banner-height) - 3.5rem)',
				'important',
			)
			mainPanel.style.removeProperty('position')
			mainPanel.style.removeProperty('margin-top')
		}
	},

	onPageView() {},

	onContentReplace() {},

	resolveScrollTarget() {
		return 'top'
	},

	shouldSkipVisitScrollToTop() {
		return false
	},
}
