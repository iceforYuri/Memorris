import { getWallpaperWrapper } from '../dom'
import type { WallpaperModeHandler } from '../types'

/** overlay 模式 handler — Swup 切页 no-op，布局靠 CSS */
export const overlayHandler: WallpaperModeHandler = {
	mode: 'overlay',

	adjustLayout(_ctx) {
		const wrapper = getWallpaperWrapper()
		if (wrapper) {
			wrapper.style.display = ''
			wrapper.classList.remove('mobile-hide-banner')
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
