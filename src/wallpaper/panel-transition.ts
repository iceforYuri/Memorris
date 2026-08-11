import { wallpaper } from '@/config/wallpaper'
import {
	BANNER_HEIGHT,
	BANNER_HEIGHT_EXTEND,
	MAIN_PANEL_OVERLAPS_BANNER_HEIGHT,
} from '@/constants/constants'
import type { WallpaperMode } from '@/types/wallpaper'
import { getMainPanel } from './dom'
import type { VisitContext } from './types'

/** 壁纸模式切换：#main-panel top 与路径 B grid extend 共用；与 Firefly fullscreen 0.4s 对齐 */
export const MAIN_PANEL_TRANSITION_MS = 400
const PANEL_EASING = 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
const TOP_EPSILON_PX = 4
export const HOME_GRID_EXTEND_PENDING_CLASS = 'wallpaper-home-grid-extend-pending'

let panelTransitionTimeout: ReturnType<typeof setTimeout> | null = null

function remPx(): number {
	return parseFloat(getComputedStyle(document.documentElement).fontSize)
}

export function resolveCompactTopPx(): number {
	return Math.round(5.5 * remPx())
}

export function resolveBannerTopPx(): number {
	return Math.round(
		window.innerHeight * (BANNER_HEIGHT / 100) -
			MAIN_PANEL_OVERLAPS_BANNER_HEIGHT * remPx(),
	)
}

export function resolveBannerExtendPx(): number {
	const raw = getComputedStyle(document.documentElement)
		.getPropertyValue('--banner-height-extend')
		.trim()
	const parsed = parseFloat(raw)
	if (Number.isFinite(parsed) && parsed > 0) {
		return Math.round(parsed)
	}
	return Math.round(window.innerHeight * (BANNER_HEIGHT_EXTEND / 100))
}

function shouldHideFullscreenWallpaper(ctx: VisitContext): boolean {
	const hideOnNonHome = wallpaper.fullscreen.hideOnNonHome ?? false
	return (
		(ctx.isMobile && !ctx.isHome) ||
		(hideOnNonHome && !ctx.isHome && !ctx.isMobile)
	)
}

export function isHomeDesktopBannerContext(ctx: VisitContext): boolean {
	return ctx.isHome && !ctx.isMobile
}

/** 方案 A：只读 #main-panel 的布局 top（不把 #main-grid translate 误当作 panel top） */
export function captureMainPanelLayoutTop(): number {
	const panel = getMainPanel()
	if (!panel) return 0
	return Math.round(panel.getBoundingClientRect().top)
}

export function resolveTargetTopPx(
	mode: WallpaperMode,
	ctx: VisitContext,
): number {
	switch (mode) {
		case 'overlay':
		case 'none':
			return resolveCompactTopPx()
		case 'banner':
			if (ctx.isMobile && !ctx.isHome) return resolveCompactTopPx()
			return resolveBannerTopPx()
		case 'fullscreen':
			if (shouldHideFullscreenWallpaper(ctx)) return resolveCompactTopPx()
			return window.innerHeight
		default:
			return resolveCompactTopPx()
	}
}

export function shouldRunPanelTransition(
	fromMode: WallpaperMode,
	toMode: WallpaperMode,
	ctx: VisitContext,
	fromTop: number,
): boolean {
	if (fromMode === toMode) return false
	const toTop = resolveTargetTopPx(toMode, ctx)
	return Math.abs(fromTop - toTop) > TOP_EPSILON_PX
}

export function shouldLeaveHomeBannerGridParallel(
	fromMode: WallpaperMode,
	toMode: WallpaperMode,
	ctx: VisitContext,
): boolean {
	return (
		fromMode === 'banner' &&
		isHomeDesktopBannerContext(ctx) &&
		toMode !== 'banner'
	)
}

export function shouldEnterHomeBannerGridParallel(
	toMode: WallpaperMode,
	ctx: VisitContext,
): boolean {
	return toMode === 'banner' && isHomeDesktopBannerContext(ctx)
}

/** @deprecated 路径 B 已改为 panel + grid 并行一段动画，不再使用第二段 */
export function shouldEnterHomeBannerGridExtend(
	toMode: WallpaperMode,
	ctx: VisitContext,
): boolean {
	return false
}

export function cancelPanelTransition(): void {
	if (panelTransitionTimeout) {
		clearTimeout(panelTransitionTimeout)
		panelTransitionTimeout = null
	}
}

function schedulePanelTransitionComplete(onComplete: () => void, delayMs: number): void {
	cancelPanelTransition()
	panelTransitionTimeout = setTimeout(() => {
		panelTransitionTimeout = null
		onComplete()
	}, delayMs)
}

/** 切换期间冻结 / 预设 grid translate（首页 banner 离场的并行动画除外） */
export function prepareMainGridForPanelTransition(
	fromMode: WallpaperMode,
	toMode: WallpaperMode,
	ctx: VisitContext,
): void {
	const grid = document.getElementById('main-grid')
	if (!grid) return

	grid.style.setProperty('transition', 'none', 'important')

	if (shouldLeaveHomeBannerGridParallel(fromMode, toMode, ctx)) {
		grid.style.setProperty(
			'transform',
			`translateY(${resolveBannerExtendPx()}px)`,
			'important',
		)
		return
	}

	grid.style.setProperty('transform', 'none', 'important')
}

export function unlockMainGridAfterPanelTransition(): void {
	const grid = document.getElementById('main-grid')
	if (!grid) return
	grid.style.removeProperty('transition')
	grid.style.removeProperty('transform')
}

/** 在 data-wallpaper-mode 变更前锁定 #main-panel */
export function lockMainPanelAtTop(
	mainPanel: HTMLElement,
	topPx: number,
	fromMode: WallpaperMode,
	toMode: WallpaperMode,
	ctx: VisitContext,
): void {
	prepareMainGridForPanelTransition(fromMode, toMode, ctx)
	mainPanel.classList.add('wallpaper-panel-animating')
	mainPanel.style.setProperty('transition', 'none', 'important')
	mainPanel.style.setProperty('position', 'absolute', 'important')
	mainPanel.style.setProperty('z-index', '30', 'important')
	mainPanel.style.setProperty('top', `${topPx}px`, 'important')
	mainPanel.style.setProperty('margin-top', '0', 'important')
	mainPanel.style.setProperty('min-height', 'auto', 'important')
	void mainPanel.offsetWidth
}

export function animateMainPanelTransition(
	mainPanel: HTMLElement,
	toTopPx: number,
	fromMode: WallpaperMode,
	toMode: WallpaperMode,
	ctx: VisitContext,
	onComplete: () => void,
): void {
	const grid = document.getElementById('main-grid')
	const leaveHomeBannerGrid = shouldLeaveHomeBannerGridParallel(
		fromMode,
		toMode,
		ctx,
	)
	const enterHomeBannerGrid = shouldEnterHomeBannerGridParallel(toMode, ctx)

	mainPanel.style.setProperty(
		'transition',
		`top ${MAIN_PANEL_TRANSITION_MS}ms ${PANEL_EASING}`,
		'important',
	)
	mainPanel.style.setProperty('top', `${toTopPx}px`, 'important')

	if (grid) {
		if (leaveHomeBannerGrid) {
			grid.style.setProperty(
				'transition',
				`transform ${MAIN_PANEL_TRANSITION_MS}ms ${PANEL_EASING}`,
				'important',
			)
			grid.style.setProperty('transform', 'translateY(0)', 'important')
		} else if (enterHomeBannerGrid) {
			grid.style.setProperty(
				'transition',
				`transform ${MAIN_PANEL_TRANSITION_MS}ms ${PANEL_EASING}`,
				'important',
			)
			grid.style.setProperty(
				'transform',
				`translateY(${resolveBannerExtendPx()}px)`,
				'important',
			)
		}
	}

	schedulePanelTransitionComplete(onComplete, MAIN_PANEL_TRANSITION_MS + 32)
}

export function getPanelTransitionDurationMs(): number {
	return MAIN_PANEL_TRANSITION_MS + 32
}

/** @deprecated 使用 animateMainPanelTransition */
export function animateMainPanelToTop(
	mainPanel: HTMLElement,
	toTopPx: number,
	onComplete: () => void,
): void {
	mainPanel.style.setProperty(
		'transition',
		`top ${MAIN_PANEL_TRANSITION_MS}ms ${PANEL_EASING}`,
		'important',
	)
	mainPanel.style.setProperty('top', `${toTopPx}px`, 'important')
	schedulePanelTransitionComplete(onComplete, MAIN_PANEL_TRANSITION_MS + 32)
}

/** @deprecated 使用 captureMainPanelLayoutTop */
export function captureMainPanelVisualTop(): number {
	return captureMainPanelLayoutTop()
}

export function lockMainGridForPanelTransition(): void {
	prepareMainGridForPanelTransition('none', 'none', {
		toUrl: '',
		pathname: '/',
		isHome: false,
		isMobile: false,
	})
}
