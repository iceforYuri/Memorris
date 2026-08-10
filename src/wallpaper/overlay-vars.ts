import { wallpaper } from '@/config/wallpaper'
import {
	getStoredOverlayBlur,
	getStoredOverlayCardOpacity,
	getStoredOverlayOpacity,
} from './storage'

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
