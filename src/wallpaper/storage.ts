import { wallpaper } from '@/config/wallpaper'
import { siteConfig } from '@/config'
import type { WallpaperMode } from '@/types/wallpaper'
import { isWallpaperMode } from './dom'

export const STORAGE_MODE = 'wallpaperMode'
export const STORAGE_OVERLAY_OPACITY = 'wallpaperOverlayOpacity'
export const STORAGE_OVERLAY_BLUR = 'wallpaperOverlayBlur'
export const STORAGE_OVERLAY_CARD = 'wallpaperOverlayCardOpacity'

export function getDefaultWallpaperMode(): WallpaperMode {
	if (!siteConfig.banner.enable) return 'none'
	return wallpaper.mode
}

export function getCurrentWallpaperModeFromDom(): WallpaperMode {
	if (typeof document === 'undefined') return getDefaultWallpaperMode()
	const attr = document.documentElement.getAttribute('data-wallpaper-mode')
	return isWallpaperMode(attr) ? attr : getDefaultWallpaperMode()
}

export function getStoredWallpaperMode(): WallpaperMode {
	if (typeof localStorage === 'undefined') {
		return getDefaultWallpaperMode()
	}
	if (!wallpaper.switchable) {
		return getDefaultWallpaperMode()
	}
	const stored = localStorage.getItem(STORAGE_MODE)
	return isWallpaperMode(stored) ? stored : getDefaultWallpaperMode()
}

export function persistWallpaperMode(mode: WallpaperMode): void {
	if (typeof localStorage === 'undefined') return
	if (!wallpaper.switchable) return
	localStorage.setItem(STORAGE_MODE, mode)
}

export function getDefaultOverlayOpacity(): number {
	return wallpaper.overlay.opacity
}

export function getDefaultOverlayBlur(): number {
	return wallpaper.overlay.blur
}

export function getDefaultOverlayCardOpacity(): number {
	return wallpaper.overlay.cardOpacity
}

export function getStoredOverlayOpacity(): number {
	if (typeof localStorage === 'undefined') return getDefaultOverlayOpacity()
	const raw = localStorage.getItem(STORAGE_OVERLAY_OPACITY)
	if (raw === null) return getDefaultOverlayOpacity()
	const n = Number.parseFloat(raw)
	return Number.isFinite(n) ? n : getDefaultOverlayOpacity()
}

export function getStoredOverlayBlur(): number {
	if (typeof localStorage === 'undefined') return getDefaultOverlayBlur()
	const raw = localStorage.getItem(STORAGE_OVERLAY_BLUR)
	if (raw === null) return getDefaultOverlayBlur()
	const n = Number.parseFloat(raw)
	return Number.isFinite(n) ? n : getDefaultOverlayBlur()
}

export function getStoredOverlayCardOpacity(): number {
	if (typeof localStorage === 'undefined') return getDefaultOverlayCardOpacity()
	const raw = localStorage.getItem(STORAGE_OVERLAY_CARD)
	if (raw === null) return getDefaultOverlayCardOpacity()
	const n = Number.parseFloat(raw)
	return Number.isFinite(n) ? n : getDefaultOverlayCardOpacity()
}

export function persistOverlayOpacity(value: number): void {
	if (typeof localStorage === 'undefined') return
	localStorage.setItem(STORAGE_OVERLAY_OPACITY, String(value))
}

export function persistOverlayBlur(value: number): void {
	if (typeof localStorage === 'undefined') return
	localStorage.setItem(STORAGE_OVERLAY_BLUR, String(value))
}

export function persistOverlayCardOpacity(value: number): void {
	if (typeof localStorage === 'undefined') return
	localStorage.setItem(STORAGE_OVERLAY_CARD, String(value))
}
