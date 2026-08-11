import { getMainPanel, getWallpaperWrapper } from '../dom'
import type { AdjustLayoutOptions } from '../types'
import type { WallpaperModeHandler } from '../types'

const COMPACT_MAIN_TOP = '5.5rem'

function syncNoneWrapperOnly(): void {
	const wrapper = getWallpaperWrapper()
	if (!wrapper) return
	wrapper.style.display = 'none'
	wrapper.classList.add('hidden', 'opacity-0')
	wrapper.classList.remove('wallpaper-overlay', 'wallpaper-fullscreen')
}

/** @parity Firefly hideAllWallpapers + adjustMainContentPosition('none') */
export const noneHandler: WallpaperModeHandler = {
	mode: 'none',

	adjustLayout(_ctx, _animate = false, options?: AdjustLayoutOptions) {
		if (options?.skipMainPanel) {
			syncNoneWrapperOnly()
			return
		}

		syncNoneWrapperOnly()

		const mainPanel = getMainPanel()
		if (mainPanel) {
			mainPanel.classList.remove('mobile-main-no-banner', 'wallpaper-panel-animating')
			mainPanel.classList.add('no-banner-layout')
			mainPanel.style.setProperty('top', COMPACT_MAIN_TOP, 'important')
			mainPanel.style.setProperty('margin-top', '0', 'important')
			mainPanel.style.position = ''
			mainPanel.style.removeProperty('min-height')
			mainPanel.style.transition = ''
		}
	},

	onVisitStart() {},

	onPageView() {},

	onContentReplace() {},

	resolveScrollTarget() {
		return 'top'
	},

	shouldSkipVisitScrollToTop() {
		return true
	},
}
