import { wallpaper } from '@/config/wallpaper'
import { siteConfig } from '@/config'
import type { WallpaperMode } from '@/types/wallpaper'
import { pathsEqual, url } from './url-utils'

const STORAGE_MODE = 'wallpaperMode'
const STORAGE_OVERLAY_OPACITY = 'wallpaperOverlayOpacity'
const STORAGE_OVERLAY_BLUR = 'wallpaperOverlayBlur'
const STORAGE_OVERLAY_CARD = 'wallpaperOverlayCardOpacity'

const ALL_MODES: WallpaperMode[] = ['banner', 'fullscreen', 'overlay', 'none']

let fullscreenAnimationTimeout: ReturnType<typeof setTimeout> | null = null

function isWallpaperMode(value: string | null): value is WallpaperMode {
	return !!value && ALL_MODES.includes(value as WallpaperMode)
}

function checkIsHomePage(pathname?: string): boolean {
	const path = pathname ?? window.location.pathname
	return pathsEqual(path, url('/'))
}

/** 从 Swup visit URL 提取 pathname（兼容完整 URL） */
export function getPathnameFromVisitUrl(href: string): string {
	try {
		return new URL(href, window.location.origin).pathname
	} catch {
		return href
	}
}

export function getDefaultWallpaperMode(): WallpaperMode {
	if (!siteConfig.banner.enable) return 'none'
	return wallpaper.mode
}

export function getCurrentWallpaperMode(): WallpaperMode {
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

export function setWallpaperMode(mode: WallpaperMode): void {
	if (typeof localStorage === 'undefined') return
	if (!wallpaper.switchable) return
	localStorage.setItem(STORAGE_MODE, mode)
	applyWallpaperMode(mode, { animate: true })
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

function clearMainPanelInlineStyles(mainPanel: HTMLElement): void {
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

/** 切换模式前清除 fullscreen / Swup 写入的 inline 布局，避免压住 CSS */
function resetWallpaperLayoutInline(): void {
	if (typeof document === 'undefined') return

	if (fullscreenAnimationTimeout) {
		clearTimeout(fullscreenAnimationTimeout)
		fullscreenAnimationTimeout = null
	}

	const mainPanel = document.getElementById('main-panel')
	const wrapper = document.getElementById('wallpaper-wrapper')

	if (mainPanel) {
		mainPanel.classList.remove('mobile-main-no-banner')
		clearMainPanelInlineStyles(mainPanel)
	}

	if (wrapper) {
		wrapper.classList.remove('mobile-hide-banner')
		wrapper.style.removeProperty('display')
		wrapper.style.removeProperty('top')
		wrapper.style.removeProperty('transform')
		wrapper.style.removeProperty('height')
	}
}

function syncWallpaperLayoutAfterModeChange(animate = false): void {
	const mode = getCurrentWallpaperMode()
	syncBodyWallpaperClasses(mode)
	syncWallpaperWrapperClasses(mode)
	applyOverlayCssVars()
	adjustMainPanelForMode(mode, animate)
	document.body.classList.add('wallpaper-initialized')
}

function shouldHideFullscreenWallpaper(isHome: boolean): boolean {
	const isMobile = window.innerWidth < 1024
	const hideOnNonHome = wallpaper.fullscreen.hideOnNonHome ?? false
	return (isMobile && !isHome) || (hideOnNonHome && !isHome && !isMobile)
}

/** 按壁纸模式调整 #main-panel 与 wrapper 布局（Phase 3 fullscreen） */
export function adjustMainPanelForMode(
	mode: WallpaperMode,
	animate = false,
	pathname?: string,
): void {
	if (typeof document === 'undefined') return
	const mainPanel = document.getElementById('main-panel')
	const wrapper = document.getElementById('wallpaper-wrapper')
	if (!mainPanel) return

	const isHome = checkIsHomePage(pathname)
	const isMobile = window.innerWidth < 1024

	switch (mode) {
		case 'banner': {
			if (wrapper) wrapper.style.display = ''
			if (!isHome && isMobile) {
				mainPanel.classList.add('mobile-main-no-banner')
				mainPanel.style.setProperty('top', '5.5rem', 'important')
			} else if (!isHome && !isMobile) {
				mainPanel.style.setProperty(
					'top',
					'calc(var(--banner-height) - 3.5rem)',
					'important',
				)
			}
			break
		}
		case 'fullscreen': {
			if (shouldHideFullscreenWallpaper(isHome)) {
				wrapper?.classList.add('mobile-hide-banner')
				if (wrapper) wrapper.style.display = 'none'
				mainPanel.classList.add('mobile-main-no-banner')
				break
			}

			if (wrapper) {
				wrapper.style.display = ''
				wrapper.classList.remove('mobile-hide-banner')
			}

			// 运行时切入 fullscreen：首页滑到壁纸下方（CSS 负责常态布局）
			if (animate && isHome && isMobile === false) {
				const computedTop = mainPanel.getBoundingClientRect().top
				mainPanel.style.setProperty('transition', 'none', 'important')
				mainPanel.style.setProperty('position', 'absolute', 'important')
				mainPanel.style.setProperty('z-index', '30', 'important')
				mainPanel.style.setProperty('top', `${computedTop}px`, 'important')
				mainPanel.style.setProperty('margin-top', '1rem', 'important')
				void mainPanel.offsetWidth
				mainPanel.style.setProperty(
					'transition',
					'top 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
					'important',
				)
				mainPanel.style.setProperty('top', '100vh', 'important')
				fullscreenAnimationTimeout = setTimeout(() => {
					for (const prop of [
						'position',
						'top',
						'margin-top',
						'transition',
						'z-index',
					] as const) {
						mainPanel.style.removeProperty(prop)
					}
				}, 450)
			}
			break
		}
		case 'overlay':
		case 'none':
			if (wrapper) {
				wrapper.style.display = ''
				wrapper.classList.remove('mobile-hide-banner')
			}
			break
	}
}

/** Swup visit:start — 页面切换前同步壁纸可见性（不写 fullscreen 常驻 inline） */
export function handleWallpaperVisitStart(toUrl: string): void {
	if (typeof document === 'undefined') return
	const mode = getCurrentWallpaperMode()
	if (mode !== 'fullscreen' && mode !== 'banner') return

	const isHome = pathsEqual(getPathnameFromVisitUrl(toUrl), url('/'))
	const isMobile = window.innerWidth < 1024
	const mainPanel = document.getElementById('main-panel')
	const wrapper = document.getElementById('wallpaper-wrapper')
	if (!mainPanel || !wrapper) return

	if (isMobile) {
		mainPanel.style.setProperty('transition', 'none', 'important')
		if (isHome) {
			wrapper.classList.remove('mobile-hide-banner')
			wrapper.style.display = ''
			setTimeout(() => {
				resetWallpaperLayoutInline()
				syncWallpaperLayoutAfterModeChange(false)
				mainPanel.style.removeProperty('transition')
			}, 150)
		} else {
			wrapper.classList.add('mobile-hide-banner')
			wrapper.style.display = 'none'
			mainPanel.classList.add('mobile-main-no-banner')
			if (mode === 'fullscreen' || mode === 'banner') {
				mainPanel.style.setProperty('top', '5.5rem', 'important')
			}
		}
		return
	}

	wrapper.style.display = ''
	wrapper.classList.remove('mobile-hide-banner')
	mainPanel.classList.remove('mobile-main-no-banner')

	if (mode === 'banner' && !isHome) {
		mainPanel.style.setProperty(
			'top',
			'calc(var(--banner-height) - 3.5rem)',
			'important',
		)
		mainPanel.style.removeProperty('position')
		mainPanel.style.removeProperty('margin-top')
	}
}

/** Swup page:view — 按当前模式重同步布局（不重复写 data 属性） */
export function handleWallpaperPageView(): void {
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

/** 桌面 fullscreen：content:replace 时临时 inline，供 scroll:top 计算位置（Firefly 同款） */
export function syncFullscreenLayoutOnContentReplace(): void {
	if (typeof document === 'undefined') return
	if (window.innerWidth < 1024) return
	if (getCurrentWallpaperMode() !== 'fullscreen') return

	const mainPanel = document.getElementById('main-panel')
	const wrapper = document.getElementById('wallpaper-wrapper')
	if (!mainPanel || !wrapper) return

	mainPanel.classList.remove('mobile-main-no-banner')
	wrapper.style.display = ''
	wrapper.classList.remove('mobile-hide-banner')
	// 仅 Swup 切页瞬间需要，page:view 会 reset
	mainPanel.style.setProperty('position', 'relative', 'important')
	mainPanel.style.setProperty('z-index', '30', 'important')
	mainPanel.style.setProperty('top', '0', 'important')
	mainPanel.style.setProperty('margin-top', '1rem', 'important')
}

/** 计算 fullscreen 非首页应滚到的 Y（壁纸底 = 正文顶） */
export function getFullscreenContentScrollTop(): number {
	const wrapper = document.getElementById('wallpaper-wrapper')
	if (
		wrapper &&
		!wrapper.classList.contains('mobile-hide-banner') &&
		wrapper.offsetHeight > 0
	) {
		return Math.round(wrapper.offsetTop + wrapper.offsetHeight)
	}

	const mainPanel = document.getElementById('main-panel')
	if (mainPanel) {
		void mainPanel.offsetHeight
		return Math.round(
			mainPanel.getBoundingClientRect().top + window.scrollY,
		)
	}

	const mainGrid = document.getElementById('main-grid')
	if (mainGrid) {
		return Math.round(
			mainGrid.getBoundingClientRect().top + window.scrollY,
		)
	}

	return 0
}

/**
 * 全屏壁纸非首页：滚到 #main-grid（Firefly scroll:top 同款）
 */
export function scrollToFullscreenContent(
	behavior: ScrollBehavior = 'auto',
): boolean {
	if (typeof window === 'undefined') return false
	const mainGrid = document.getElementById('main-grid')
	if (mainGrid) {
		mainGrid.scrollIntoView({ behavior, block: 'start' })
		return true
	}
	const top = getFullscreenContentScrollTop()
	if (top > 0) {
		window.scrollTo({ top, left: 0, behavior })
		return true
	}
	return false
}

/** 切换壁纸模式：data 属性 + class + CSS 变量；切换前先清 inline */
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

