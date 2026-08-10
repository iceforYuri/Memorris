let fullscreenAnimationTimeout: ReturnType<typeof setTimeout> | null = null

export function clearFullscreenAnimationTimeout(): void {
	if (fullscreenAnimationTimeout) {
		clearTimeout(fullscreenAnimationTimeout)
		fullscreenAnimationTimeout = null
	}
}

export function scheduleFullscreenAnimationCleanup(
	callback: () => void,
	delayMs: number,
): void {
	clearFullscreenAnimationTimeout()
	fullscreenAnimationTimeout = setTimeout(() => {
		callback()
		fullscreenAnimationTimeout = null
	}, delayMs)
}
