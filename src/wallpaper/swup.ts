import { buildVisitContext } from './context'
import { getPathnameFromVisitUrl } from './dom'
import { syncWallpaperLayoutAfterModeChange } from './layout'
import { getHandler } from './registry'
import { getCurrentWallpaperModeFromDom } from './storage'
import { resetWallpaperLayoutInline } from './sync'
import type { ScrollTarget } from './types'

/** @parity Swup visit:start — 页面切换前同步壁纸可见性 */
export function handleWallpaperVisitStart(toUrl: string): void {
	if (typeof document === 'undefined') return
	const mode = getCurrentWallpaperModeFromDom()
	if (mode !== 'fullscreen' && mode !== 'banner') return

	getHandler(mode).onVisitStart(buildVisitContext(toUrl))
}

/** @parity Swup page:view — 按当前模式重同步布局（不重复写 data 属性） */
export function handleWallpaperPageView(): void {
	if (typeof document === 'undefined') return
	resetWallpaperLayoutInline()
	syncWallpaperLayoutAfterModeChange(false)
}

/** @parity 桌面 fullscreen：content:replace 时临时 inline，供 scroll:top 计算位置 */
export function syncFullscreenLayoutOnContentReplace(): void {
	if (typeof document === 'undefined') return
	const mode = getCurrentWallpaperModeFromDom()
	getHandler(mode).onContentReplace(buildVisitContext(window.location.pathname))
}

export function resolveWallpaperScrollTarget(toUrl: string): ScrollTarget {
	const mode = getCurrentWallpaperModeFromDom()
	return getHandler(mode).resolveScrollTarget(buildVisitContext(toUrl))
}

export function shouldSkipWallpaperVisitScrollToTop(toUrl: string): boolean {
	const mode = getCurrentWallpaperModeFromDom()
	return getHandler(mode).shouldSkipVisitScrollToTop(buildVisitContext(toUrl))
}

export function handleWallpaperScrollTop(
	toUrl: string,
	scrollOptions?: ScrollIntoViewOptions,
): boolean {
	const target = resolveWallpaperScrollTarget(toUrl)
	const behavior = scrollOptions?.behavior || 'auto'

	if (target === 'main-grid') {
		syncFullscreenLayoutOnContentReplace()
		const mainGrid = document.getElementById('main-grid')
		if (mainGrid) {
			mainGrid.scrollIntoView({ behavior, block: 'start' })
			return true
		}
	}

	window.scrollTo({ top: 0, left: 0, behavior })
	return true
}

export { getPathnameFromVisitUrl }
