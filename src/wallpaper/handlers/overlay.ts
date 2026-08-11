import { getMainPanel, getWallpaperWrapper } from '../dom'
import type { AdjustLayoutOptions } from '../types'
import type { WallpaperModeHandler } from '../types'

const COMPACT_MAIN_TOP = '5.5rem'

function syncOverlayWrapperOnly(): void {
	const wrapper = getWallpaperWrapper()
	if (!wrapper) return
	wrapper.classList.remove('wallpaper-fullscreen')
	wrapper.classList.add('wallpaper-overlay')
	wrapper.style.display = 'block'
	wrapper.style.setProperty('display', 'block', 'important')
	wrapper.style.top = ''
	requestAnimationFrame(() => {
		wrapper.classList.remove('hidden', 'opacity-0', 'mobile-hide-banner')
		wrapper.classList.add('opacity-100')
	})
}

/** @parity Firefly showOverlayMode + adjustMainContentPosition('overlay') */
export const overlayHandler: WallpaperModeHandler = {
	mode: 'overlay',

	adjustLayout(_ctx, _animate = false, options?: AdjustLayoutOptions) {
		if (options?.skipMainPanel) {
			syncOverlayWrapperOnly()
			return
		}

		syncOverlayWrapperOnly()

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
