import { buildVisitContext, buildVisitContextFromPathname } from './context'
import { getPathnameFromVisitUrl } from './dom'
import {
	getFullscreenContentScrollTop,
	scrollToFullscreenContent,
} from './handlers/fullscreen'
import { getHandler } from './registry'
import {
	animateScrollTo,
	shouldAnimateScrollDelta,
} from './scroll-animation'
import { getCurrentWallpaperModeFromDom } from './storage'
import type { ScrollTarget } from './types'

/** Swup visit:start — 按模式分发（fuwari：不在 visit 里滚动） */
export function handleWallpaperVisitStart(toUrl: string): void {
	if (typeof document === 'undefined') return
	const mode = getCurrentWallpaperModeFromDom()
	if (mode !== 'fullscreen' && mode !== 'banner') return

	getHandler(mode).onVisitStart(buildVisitContext(toUrl))
}

/** Swup page:view — 按模式分发 */
export function handleWallpaperPageView(): void {
	if (typeof document === 'undefined') return
	const mode = getCurrentWallpaperModeFromDom()
	getHandler(mode).onPageView(buildVisitContextFromPathname())
}

export function syncFullscreenLayoutOnContentReplace(): void {
	if (typeof document === 'undefined') return
	const mode = getCurrentWallpaperModeFromDom()
	getHandler(mode).onContentReplace(buildVisitContextFromPathname())
}

export function resolveWallpaperScrollTarget(toUrl: string): ScrollTarget {
	const mode = getCurrentWallpaperModeFromDom()
	return getHandler(mode).resolveScrollTarget(buildVisitContext(toUrl))
}

/** fuwari 不在 visit:start 滚动；各模式在 scroll:top 对齐标注线 */
export function shouldSkipWallpaperVisitScrollToTop(_toUrl: string): boolean {
	return true
}

function scrollToTopWithCoordination(behavior: ScrollBehavior): void {
	const targetY = 0
	if (shouldAnimateScrollDelta(window.scrollY - targetY)) {
		animateScrollTo(targetY)
		return
	}
	window.scrollTo({ top: targetY, left: 0, behavior })
}

function scrollToFullscreenAnchorWithCoordination(
	behavior: ScrollBehavior,
): void {
	const run = () => {
		const mainGrid = document.getElementById('main-grid')
		const targetY = mainGrid
			? Math.round(
					mainGrid.getBoundingClientRect().top + window.scrollY,
				)
			: getFullscreenContentScrollTop()

		if (targetY <= 0) {
			scrollToFullscreenContent(behavior)
			return
		}

		if (shouldAnimateScrollDelta(window.scrollY - targetY)) {
			animateScrollTo(targetY)
			return
		}

		scrollToFullscreenContent(behavior)
	}

	// content:replace 后等一帧布局稳定再算标注线
	requestAnimationFrame(() => requestAnimationFrame(run))
}

export function handleWallpaperScrollTop(
	toUrl: string,
	scrollOptions?: ScrollIntoViewOptions,
): boolean {
	const target = resolveWallpaperScrollTarget(toUrl)
	const behavior = scrollOptions?.behavior || 'auto'

	if (target === 'skip') {
		return true
	}

	if (target === 'main-grid') {
		scrollToFullscreenAnchorWithCoordination(behavior)
		return true
	}

	scrollToTopWithCoordination(behavior)
	return true
}

export { getPathnameFromVisitUrl }
