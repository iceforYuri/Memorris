import type { WallpaperMode } from '@/types/wallpaper'
import { pathsEqual, url } from '@/utils/url-utils'
import { ALL_WALLPAPER_MODES } from './types'

/** 从 Swup visit URL 提取 pathname（兼容完整 URL） */
export function getPathnameFromVisitUrl(href: string): string {
	try {
		return new URL(href, window.location.origin).pathname
	} catch {
		return href
	}
}

export function checkIsHomePage(pathname?: string): boolean {
	const path = pathname ?? window.location.pathname
	return pathsEqual(path, url('/'))
}

export function isWallpaperMode(value: string | null): value is WallpaperMode {
	return !!value && ALL_WALLPAPER_MODES.includes(value as WallpaperMode)
}

export function getMainPanel(): HTMLElement | null {
	return document.getElementById('main-panel')
}

export function getWallpaperWrapper(): HTMLElement | null {
	return document.getElementById('wallpaper-wrapper')
}

export function clearMainPanelInlineStyles(mainPanel: HTMLElement): void {
	const props = [
		'position',
		'z-index',
		'top',
		'margin-top',
		'min-height',
		'transition',
	] as const
	for (const prop of props) {
		mainPanel.style.removeProperty(prop)
	}
}
