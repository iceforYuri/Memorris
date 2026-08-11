import { siteConfig } from '@/config'
import type { WallpaperMode } from '@/types/wallpaper'
import { pathsEqual, url } from '@/utils/url-utils'
import { buildVisitContextFromPathname } from './context'
import { getMainPanel, getPathnameFromVisitUrl } from './dom'
import { syncWallpaperLayoutAfterModeChange } from './layout'
import {
	animateMainPanelTransition,
	captureMainPanelLayoutTop,
	getPanelTransitionDurationMs,
	lockMainPanelAtTop,
	MAIN_PANEL_TRANSITION_MS,
	resolveTargetTopPx,
	shouldRunPanelTransition,
	unlockMainGridAfterPanelTransition,
} from './panel-transition'
import { applyOverlayCssVars } from './overlay-vars'
import { getHandler } from './registry'
import {
	getCurrentWallpaperModeFromDom,
	getDefaultWallpaperMode,
	getStoredWallpaperMode,
	persistOverlayBlur,
	persistOverlayCardOpacity,
	persistOverlayOpacity,
	persistWallpaperMode,
} from './storage'
import {
	isWallpaperModeSwitchable,
	resetWallpaperLayoutInline,
	resetWallpaperWrapperInline,
} from './sync'

export {
	getDefaultOverlayBlur,
	getDefaultOverlayCardOpacity,
	getDefaultOverlayOpacity,
	getDefaultWallpaperMode,
	getStoredOverlayBlur,
	getStoredOverlayCardOpacity,
	getStoredOverlayOpacity,
	getStoredWallpaperMode,
} from './storage'

export { getPathnameFromVisitUrl } from './dom'
export {
	getFullscreenContentScrollTop,
	scrollToFullscreenContent,
} from './handlers/fullscreen'

export function getCurrentWallpaperMode(): WallpaperMode {
	return getCurrentWallpaperModeFromDom()
}

export function setWallpaperMode(mode: WallpaperMode): void {
	persistWallpaperMode(mode)
	applyWallpaperMode(mode, { animate: true })
	window.dispatchEvent(
		new CustomEvent('wallpaperModeChange', { detail: { mode } }),
	)
}

export function setOverlayOpacity(value: number): void {
	persistOverlayOpacity(value)
	applyOverlayCssVars()
}

export function setOverlayBlur(value: number): void {
	persistOverlayBlur(value)
	applyOverlayCssVars()
}

export function setOverlayCardOpacity(value: number): void {
	persistOverlayCardOpacity(value)
	applyOverlayCssVars()
}

export { applyOverlayCssVars } from './overlay-vars'

export function adjustMainPanelForMode(
	mode: WallpaperMode,
	animate = false,
	pathname?: string,
): void {
	if (typeof document === 'undefined') return
	const ctx = buildVisitContextFromPathname(pathname)
	getHandler(mode).adjustLayout(ctx, animate)
}

function finalizePanelTransition(
	mode: WallpaperMode,
	pathname: string | undefined,
	onComplete: () => void,
): void {
	const mainPanel = getMainPanel()
	mainPanel?.classList.remove('wallpaper-panel-animating')

	resetWallpaperLayoutInline()
	syncWallpaperLayoutAfterModeChange(false, pathname)
	unlockMainGridAfterPanelTransition()
	onComplete()
}

function applyWallpaperModeInstant(
	mode: WallpaperMode,
	pathname?: string,
): void {
	document.documentElement.classList.add('is-wallpaper-transitioning')
	document.documentElement.setAttribute('data-wallpaper-mode', mode)
	requestAnimationFrame(() => {
		resetWallpaperLayoutInline()
		syncWallpaperLayoutAfterModeChange(false, pathname)
		requestAnimationFrame(() => {
			document.documentElement.classList.remove('is-wallpaper-transitioning')
		})
	})
}

function applyWallpaperModeAnimated(
	fromMode: WallpaperMode,
	toMode: WallpaperMode,
	fromTop: number,
	pathname?: string,
): void {
	const mainPanel = getMainPanel()
	if (!mainPanel) {
		applyWallpaperModeInstant(toMode, pathname)
		return
	}

	const ctx = buildVisitContextFromPathname(pathname)
	const toTop = resolveTargetTopPx(toMode, ctx)
	const transitionMs = getPanelTransitionDurationMs()

	document.documentElement.classList.add('is-wallpaper-transitioning')
	lockMainPanelAtTop(mainPanel, fromTop, fromMode, toMode, ctx)
	document.documentElement.setAttribute('data-wallpaper-mode', toMode)

	requestAnimationFrame(() => {
		resetWallpaperWrapperInline()
		syncWallpaperLayoutAfterModeChange(false, pathname, {
			skipMainPanel: true,
		})

		animateMainPanelTransition(
			mainPanel,
			toTop,
			fromMode,
			toMode,
			ctx,
			() => {
				finalizePanelTransition(toMode, pathname, () => {
					document.documentElement.classList.remove(
						'is-wallpaper-transitioning',
					)
				})
			},
		)

		// 兜底：防止 finalize 链未触发时保护类残留
		setTimeout(() => {
			document.documentElement.classList.remove('is-wallpaper-transitioning')
		}, transitionMs + 100)
	})
}

export function applyWallpaperMode(
	mode: WallpaperMode,
	options?: { animate?: boolean },
): void {
	if (typeof document === 'undefined') return
	if (!siteConfig.banner.enable && mode !== 'none') {
		mode = 'none'
	}

	const fromMode = getCurrentWallpaperModeFromDom()
	const animate = options?.animate ?? false
	const pathname =
		typeof window !== 'undefined' ? window.location.pathname : undefined

	if (!isWallpaperModeSwitchable()) {
		if (fromMode === mode) {
			syncWallpaperLayoutAfterModeChange(false, pathname)
		}
		return
	}

	if (fromMode === mode) {
		syncWallpaperLayoutAfterModeChange(false, pathname)
		return
	}

	if (animate) {
		const ctx = buildVisitContextFromPathname(pathname)
		const fromTop = captureMainPanelLayoutTop()
		if (shouldRunPanelTransition(fromMode, mode, ctx, fromTop)) {
			applyWallpaperModeAnimated(fromMode, mode, fromTop, pathname)
			return
		}
	}

	applyWallpaperModeInstant(mode, pathname)
}

export function initWallpaperFromStorage(): void {
	applyWallpaperMode(getStoredWallpaperMode(), { animate: false })
}

export function syncWallpaperLayoutOnResize(): void {
	if (typeof document === 'undefined') return
	resetWallpaperLayoutInline()
	syncWallpaperLayoutAfterModeChange(false)
}

export function shouldScrollMainGridOnFullscreen(toUrl: string): boolean {
	return (
		getCurrentWallpaperMode() === 'fullscreen' &&
		!pathsEqual(getPathnameFromVisitUrl(toUrl), url('/'))
	)
}

export { MAIN_PANEL_TRANSITION_MS } from './panel-transition'
