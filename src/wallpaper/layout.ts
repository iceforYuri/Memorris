import { applyOverlayCssVars } from './overlay-vars'
import { getHandler } from './registry'
import { buildVisitContextFromPathname } from './context'
import { getCurrentWallpaperModeFromDom } from './storage'
import {
	syncBodyWallpaperClasses,
	syncWallpaperWrapperClasses,
} from './sync'

export function syncWallpaperLayoutAfterModeChange(
	animate = false,
	pathname?: string,
): void {
	const mode = getCurrentWallpaperModeFromDom()
	syncBodyWallpaperClasses(mode)
	syncWallpaperWrapperClasses(mode)
	applyOverlayCssVars()
	getHandler(mode).adjustLayout(buildVisitContextFromPathname(pathname), animate)
	document.body.classList.add('wallpaper-initialized')
}
