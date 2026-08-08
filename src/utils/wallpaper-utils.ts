import { wallpaper } from '@/config/wallpaper'
import { siteConfig } from '@/config'
import type { WallpaperMode } from '@/types/wallpaper'

const STORAGE_MODE = 'wallpaperMode'
const STORAGE_OVERLAY_OPACITY = 'wallpaperOverlayOpacity'
const STORAGE_OVERLAY_BLUR = 'wallpaperOverlayBlur'
const STORAGE_OVERLAY_CARD = 'wallpaperOverlayCardOpacity'

const ALL_MODES: WallpaperMode[] = ['banner', 'fullscreen', 'overlay', 'none']

function isWallpaperMode(value: string | null): value is WallpaperMode {
	return !!value && ALL_MODES.includes(value as WallpaperMode)
}

export function getDefaultWallpaperMode(): WallpaperMode {
	if (!siteConfig.banner.enable) return 'none'
	return wallpaper.mode
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

export function setWallpaperMode(mode: WallpaperMode): void {
	if (typeof localStorage === 'undefined') return
	if (!wallpaper.switchable) return
	localStorage.setItem(STORAGE_MODE, mode)
	applyWallpaperMode(mode)
	window.dispatchEvent(
		new CustomEvent('wallpaperModeChange', { detail: { mode } }),
	)
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

export function setOverlayOpacity(value: number): void {
	if (typeof localStorage === 'undefined') return
	localStorage.setItem(STORAGE_OVERLAY_OPACITY, String(value))
	applyOverlayCssVars()
}

export function setOverlayBlur(value: number): void {
	if (typeof localStorage === 'undefined') return
	localStorage.setItem(STORAGE_OVERLAY_BLUR, String(value))
	applyOverlayCssVars()
}

export function setOverlayCardOpacity(value: number): void {
	if (typeof localStorage === 'undefined') return
	localStorage.setItem(STORAGE_OVERLAY_CARD, String(value))
	applyOverlayCssVars()
}

function effectiveOverlayBlur(blur: number): number {
	if (typeof window === 'undefined') return blur
	if (window.innerWidth >= 1024) return blur
	const cap = wallpaper.overlay.mobileMaxBlur ?? 4
	return Math.min(blur, cap)
}

export function applyOverlayCssVars(): void {
	if (typeof document === 'undefined') return
	const root = document.documentElement
	root.style.setProperty(
		'--wallpaper-overlay-opacity',
		String(getStoredOverlayOpacity()),
	)
	const blur = effectiveOverlayBlur(getStoredOverlayBlur())
	root.style.setProperty('--wallpaper-overlay-blur', `${blur}px`)
	root.style.setProperty(
		'--wallpaper-card-opacity',
		String(getStoredOverlayCardOpacity()),
	)
	root.style.setProperty(
		'--wallpaper-overlay-z-index',
		String(wallpaper.overlay.zIndex),
	)
}

function syncBodyWallpaperClasses(mode: WallpaperMode): void {
	const body = document.body
	body.classList.remove(
		'enable-banner',
		'wallpaper-overlay-active',
		'no-wallpaper-layout',
	)
	switch (mode) {
		case 'banner':
			body.classList.add('enable-banner')
			break
		case 'overlay':
			body.classList.add('wallpaper-overlay-active', 'no-wallpaper-layout')
			break
		case 'fullscreen':
			body.classList.add('no-wallpaper-layout')
			break
		case 'none':
			body.classList.add('no-wallpaper-layout')
			break
	}
}

function syncWallpaperWrapperClasses(mode: WallpaperMode): void {
	const wrapper = document.getElementById('wallpaper-wrapper')
	if (!wrapper) return
	wrapper.classList.remove('wallpaper-overlay', 'wallpaper-fullscreen')
	if (mode === 'overlay') wrapper.classList.add('wallpaper-overlay')
	if (mode === 'fullscreen') wrapper.classList.add('wallpaper-fullscreen')
}

/** 切换壁纸模式：只改 data 属性 + class + CSS 变量，不写 inline transform */
export function applyWallpaperMode(mode: WallpaperMode): void {
	if (typeof document === 'undefined') return
	if (!siteConfig.banner.enable && mode !== 'none') {
		mode = 'none'
	}
	document.documentElement.setAttribute('data-wallpaper-mode', mode)
	syncBodyWallpaperClasses(mode)
	syncWallpaperWrapperClasses(mode)
	applyOverlayCssVars()
}

export function initWallpaperFromStorage(): void {
	applyWallpaperMode(getStoredWallpaperMode())
}
