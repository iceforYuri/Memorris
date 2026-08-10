import { siteConfig } from '../config'
import type { WallpaperConfig } from '../types/wallpaper'
import type { WallpaperMode } from '../types/wallpaper'

export const wallpaper: WallpaperConfig = {
	mode: 'banner',
	/** Phase 2：DisplaySettings 四模式切换 */
	switchable: true,
	src: {
		desktop: siteConfig.banner.src,
	},
	banner: {
		position: siteConfig.banner.position ?? 'center',
		credit: {
			enable: siteConfig.banner.credit.enable,
			text: siteConfig.banner.credit.text,
			url: siteConfig.banner.credit.url,
		},
	},
	overlay: {
		opacity: 0.85,
		blur: 8,
		cardOpacity: 0.72,
		zIndex: -1,
		mobileMaxBlur: 4,
	},
	fullscreen: {
		position: 'center',
		/** 桌面端内页是否隐藏全屏壁纸（默认 false，壁纸始终可见） */
		hideOnNonHome: false,
	},
	common: {
		gradient: {
			enable: {
				desktop: true,
				mobile: true,
			},
			height: '10%',
			topHeight: '18vh',
		},
	},
}

export function resolveGradientEnable(
	device: 'desktop' | 'mobile',
): boolean {
	const cfg = wallpaper.common?.gradient?.enable
	if (typeof cfg === 'object') {
		return device === 'desktop'
			? (cfg.desktop ?? true)
			: (cfg.mobile ?? true)
	}
	return cfg ?? true
}

export function shouldRenderWallpaperGradient(): boolean {
	return (
		resolveGradientEnable('desktop') || resolveGradientEnable('mobile')
	)
}

/** 构建期 / SSR：legacy banner.enable 为 false 时强制 none */
export function resolveWallpaperModeForBuild(): WallpaperMode {
	if (!siteConfig.banner.enable) return 'none'
	return wallpaper.mode
}

export function getWallpaperImageSrc(): string {
	return wallpaper.src.desktop ?? siteConfig.banner.src
}

export function shouldRenderWallpaperWrapper(
	mode: WallpaperMode = resolveWallpaperModeForBuild(),
): boolean {
	return mode !== 'none' || wallpaper.switchable
}
