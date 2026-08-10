import { siteConfig } from '@/config'
import type { WallpaperMode } from '@/types/wallpaper'
import { pathsEqual, url } from '@/utils/url-utils'
import { buildVisitContextFromPathname } from './context'
import { getPathnameFromVisitUrl } from './dom'
import { syncWallpaperLayoutAfterModeChange } from './layout'
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
import { resetWallpaperLayoutInline } from './sync'

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

/** @parity 按壁纸模式调整 #main-panel 与 wrapper 布局 */
export function adjustMainPanelForMode(
	mode: WallpaperMode,
	animate = false,
	pathname?: string,
): void {
	if (typeof document === 'undefined') return
	const ctx = buildVisitContextFromPathname(pathname)
	getHandler(mode).adjustLayout(ctx, animate)
}

/** @parity 切换壁纸模式：data 属性 + class + CSS 变量；切换前先清 inline */
export function applyWallpaperMode(
	mode: WallpaperMode,
	options?: { animate?: boolean },
): void {
	if (typeof document === 'undefined') return
	if (!siteConfig.banner.enable && mode !== 'none') {
		mode = 'none'
	}
	resetWallpaperLayoutInline()
	document.documentElement.setAttribute('data-wallpaper-mode', mode)
	syncWallpaperLayoutAfterModeChange(options?.animate ?? false)
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
