/** @parity 薄 re-export 层：保持 @utils/wallpaper-utils 对外 API 不变 */
export {
	adjustMainPanelForMode,
	applyOverlayCssVars,
	applyWallpaperMode,
	getCurrentWallpaperMode,
	getDefaultOverlayBlur,
	getDefaultOverlayCardOpacity,
	getDefaultOverlayOpacity,
	getDefaultWallpaperMode,
	getFullscreenContentScrollTop,
	getPathnameFromVisitUrl,
	getStoredOverlayBlur,
	getStoredOverlayCardOpacity,
	getStoredOverlayOpacity,
	getStoredWallpaperMode,
	initWallpaperFromStorage,
	scrollToFullscreenContent,
	setOverlayBlur,
	setOverlayCardOpacity,
	setOverlayOpacity,
	setWallpaperMode,
	shouldScrollMainGridOnFullscreen,
	syncWallpaperLayoutOnResize,
} from '@/wallpaper'

export {
	handleWallpaperPageView,
	handleWallpaperVisitStart,
	handleWallpaperScrollTop,
	syncFullscreenLayoutOnContentReplace,
} from '@/wallpaper/swup'
