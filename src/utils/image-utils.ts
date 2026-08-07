import { siteConfig } from "@/config";
import type { ImageFormat } from "@/types/config";

/** 本地图片 Picture 的 formats 列表 */
export function getImageFormats(): ImageFormat[] {
	const formatConfig = siteConfig.imageOptimization?.formats ?? "webp";
	switch (formatConfig) {
		case "avif":
			return ["avif"];
		case "both":
			return ["avif", "webp"];
		default:
			return ["webp"];
	}
}

/** 组件未传 quality 时的默认质量 */
export function getImageQuality(): number {
	return siteConfig.imageOptimization?.quality ?? 72;
}

/** Picture 的 fallbackFormat */
export function getFallbackFormat(): "avif" | "webp" {
	const formatConfig = siteConfig.imageOptimization?.formats ?? "webp";
	return formatConfig === "avif" ? "avif" : "webp";
}
