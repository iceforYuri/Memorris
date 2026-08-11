import { applyOverlayCssVars } from './overlay-vars'
import { getHandler } from './registry'
import { buildVisitContextFromPathname } from './context'
import { getCurrentWallpaperModeFromDom } from './storage'
import type { AdjustLayoutOptions } from './types'
import {
	syncBodyWallpaperClasses,
	syncMainPanelTransparency,
	syncWallpaperWrapperClasses,
} from './sync'

export function syncWallpaperLayoutAfterModeChange(
	animate = false,
	pathname?: string,
	options?: AdjustLayoutOptions,
): void {
	const mode = getCurrentWallpaperModeFromDom()
	syncBodyWallpaperClasses(mode)
	syncWallpaperWrapperClasses(mode)
	syncMainPanelTransparency(mode === 'overlay')
	applyOverlayCssVars()
	getHandler(mode).adjustLayout(
		buildVisitContextFromPathname(pathname),
		animate,
		options,
	)
	document.body.classList.add('wallpaper-initialized')
}
