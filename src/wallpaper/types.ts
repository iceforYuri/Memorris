import type { WallpaperMode } from '@/types/wallpaper'

export interface VisitContext {
	toUrl: string
	pathname: string
	isHome: boolean
	isMobile: boolean
}

export type ScrollTarget = 'main-grid' | 'top' | 'skip'

export interface WallpaperModeHandler {
	readonly mode: WallpaperMode
	adjustLayout(ctx: VisitContext, animate?: boolean): void
	onVisitStart(ctx: VisitContext): void
	onPageView(_ctx: VisitContext): void
	onContentReplace(_ctx: VisitContext): void
	resolveScrollTarget(ctx: VisitContext): ScrollTarget
	shouldSkipVisitScrollToTop(ctx: VisitContext): boolean
	clearPendingAnimation?(): void
}

export const ALL_WALLPAPER_MODES: WallpaperMode[] = [
	'banner',
	'fullscreen',
	'overlay',
	'none',
]
