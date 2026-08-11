import { BANNER_HEIGHT_EXTEND } from '@/constants/constants'
import { getMainPanel, getWallpaperWrapper } from '../dom'
import { syncWallpaperLayoutAfterModeChange } from '../layout'
import { resetWallpaperLayoutInline } from '../sync'
import type { AdjustLayoutOptions } from '../types'
import type { WallpaperModeHandler } from '../types'

const BANNER_MAIN_TOP = 'var(--main-panel-top-banner)'
const COMPACT_MAIN_TOP = '5.5rem'

function syncBannerWrapperOnly(ctx: {
	isHome: boolean
	isMobile: boolean
}): void {
	const wrapper = getWallpaperWrapper()
	if (!wrapper) return

	wrapper.classList.remove('wallpaper-overlay', 'wallpaper-fullscreen')
	wrapper.style.top = `-${BANNER_HEIGHT_EXTEND}vh`

	if (ctx.isMobile && !ctx.isHome) {
		wrapper.style.display = 'none'
		wrapper.classList.add('mobile-hide-banner')
	} else {
		wrapper.style.display = 'block'
		wrapper.style.setProperty('display', 'block', 'important')
		requestAnimationFrame(() => {
			wrapper.classList.remove('hidden', 'opacity-0', 'mobile-hide-banner')
			wrapper.classList.add('opacity-100')
		})
	}
}

/** @parity Firefly adjustMainContentPosition('banner') */
function applyBannerMainPanelLayout(
	mainPanel: HTMLElement,
	ctx: { isHome: boolean; isMobile: boolean },
): void {
	mainPanel.classList.remove('mobile-main-no-banner', 'no-banner-layout')
	mainPanel.style.setProperty('transition', 'none', 'important')
	mainPanel.style.position = ''
	mainPanel.style.zIndex = ''
	mainPanel.style.top = ''
	mainPanel.style.removeProperty('margin-top')
	mainPanel.style.removeProperty('min-height')

	if (!ctx.isHome) {
		mainPanel.classList.add('mobile-main-no-banner')
		if (ctx.isMobile) {
			mainPanel.style.setProperty('top', COMPACT_MAIN_TOP, 'important')
		} else {
			mainPanel.style.setProperty('top', BANNER_MAIN_TOP, 'important')
		}
	} else {
		mainPanel.style.setProperty('top', BANNER_MAIN_TOP, 'important')
	}

	const mainGrid = document.getElementById('main-grid')
	if (mainGrid) {
		mainGrid.style.transform = ''
		mainGrid.style.transition = ''
	}

	void mainPanel.offsetWidth
	mainPanel.style.removeProperty('transition')
}

/**
 * banner 模式 handler
 * 桌面：Layout toggle `lg:is-home` + CSS translate；scroll:top 回顶（与壳层 700ms 协调）
 */
export const bannerHandler: WallpaperModeHandler = {
	mode: 'banner',

	adjustLayout(ctx, _animate = false, options) {
		if (options?.skipMainPanel) {
			syncBannerWrapperOnly(ctx)
			return
		}
		const mainPanel = getMainPanel()
		const wrapper = getWallpaperWrapper()
		if (!mainPanel) return

		if (wrapper) {
			syncBannerWrapperOnly(ctx)
		}

		applyBannerMainPanelLayout(mainPanel, ctx)
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

	onPageView() {},

	onContentReplace() {},

	resolveScrollTarget() {
		return 'top'
	},

	shouldSkipVisitScrollToTop() {
		return true
	},
}
