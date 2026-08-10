import { bannerHandler } from './handlers/banner'
import { fullscreenHandler } from './handlers/fullscreen'
import { noneHandler } from './handlers/none'
import { overlayHandler } from './handlers/overlay'
import type { WallpaperModeHandler } from './types'
import type { WallpaperMode } from '@/types/wallpaper'

const handlers: Record<WallpaperMode, WallpaperModeHandler> = {
	banner: bannerHandler,
	fullscreen: fullscreenHandler,
	overlay: overlayHandler,
	none: noneHandler,
}

export function getHandler(mode: WallpaperMode): WallpaperModeHandler {
	return handlers[mode]
}
