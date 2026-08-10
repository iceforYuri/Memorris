const DEFAULT_SCROLL_DURATION_MS = 700

/** 与 banner 壳层 duration-700 对齐的 ease-out 滚动 */
export function animateScrollTo(
	targetY: number,
	durationMs = DEFAULT_SCROLL_DURATION_MS,
): void {
	if (typeof window === 'undefined') return

	const startY = window.scrollY
	const diff = targetY - startY
	if (Math.abs(diff) < 2) return

	const start = performance.now()

	function step(now: number) {
		const progress = Math.min((now - start) / durationMs, 1)
		const eased = 1 - (1 - progress) ** 3
		window.scrollTo(0, Math.round(startY + diff * eased))
		if (progress < 1) {
			requestAnimationFrame(step)
		}
	}

	requestAnimationFrame(step)
}

export function shouldUseCoordinatedScrollAnimation(): boolean {
	return typeof window !== 'undefined' && window.innerWidth >= 1024
}

export function shouldAnimateScrollDelta(delta: number): boolean {
	return (
		shouldUseCoordinatedScrollAnimation() && Math.abs(delta) > 48
	)
}
