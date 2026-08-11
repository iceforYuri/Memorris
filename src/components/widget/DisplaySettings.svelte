<script lang="ts">
import '@/styles/display-settings.css'
import { i18n } from '@i18n/translation'
import I18nKey from '@i18n/i18nKey'
import { wallpaper } from '@/config/wallpaper'
import type { WallpaperMode } from '@/types/wallpaper'
import { getDefaultHue, getHue, setHue } from '@utils/setting-utils'
import {
  getDefaultOverlayBlur,
  getDefaultOverlayCardOpacity,
  getDefaultOverlayOpacity,
  getDefaultWallpaperMode,
  getStoredOverlayBlur,
  getStoredOverlayCardOpacity,
  getStoredOverlayOpacity,
  getStoredWallpaperMode,
  setOverlayBlur,
  setOverlayCardOpacity,
  setOverlayOpacity,
  setWallpaperMode,
} from '@utils/wallpaper-utils'
import Icon from '@/components/misc/Icon.svelte'
import { onMount, tick } from 'svelte'

let hue = getDefaultHue()
const defaultHue = getDefaultHue()
let hueReady = false

let wallpaperMode: WallpaperMode = wallpaper.mode
const defaultWallpaperMode = getDefaultWallpaperMode()

let overlayOpacity = getDefaultOverlayOpacity()
let overlayBlur = getDefaultOverlayBlur()
let overlayCardOpacity = getDefaultOverlayCardOpacity()

const defaultOverlayOpacity = getDefaultOverlayOpacity()
const defaultOverlayBlur = getDefaultOverlayBlur()
const defaultOverlayCardOpacity = getDefaultOverlayCardOpacity()

const showWallpaperControls = wallpaper.switchable

function updateRangeProgress(input: HTMLInputElement) {
  const min = Number(input.min || 0)
  const max = Number(input.max || 100)
  const value = Number(input.value || 0)
  const progress = ((value - min) * 100) / (max - min || 1)
  input.style.setProperty(
    '--range-progress',
    `${Math.min(100, Math.max(0, progress))}%`,
  )
}

function refreshAllRangeProgress() {
  const panel = document.getElementById('display-setting')
  if (!panel) return

  panel.querySelectorAll('input[type="range"]').forEach((node) => {
    if (node instanceof HTMLInputElement) {
      updateRangeProgress(node)
    }
  })
}

function handleRangeInput(event: Event) {
  const target = event.target
  if (target instanceof HTMLInputElement && target.type === 'range') {
    updateRangeProgress(target)
  }
}

onMount(() => {
  hue = getHue()
  hueReady = true

  const panel = document.getElementById('display-setting')
  refreshAllRangeProgress()
  panel?.addEventListener('input', handleRangeInput)

  if (showWallpaperControls) {
    wallpaperMode = getStoredWallpaperMode()
    overlayOpacity = getStoredOverlayOpacity()
    overlayBlur = getStoredOverlayBlur()
    overlayCardOpacity = getStoredOverlayCardOpacity()

    const onModeChange = (event: Event) => {
      const detail = (event as CustomEvent<{ mode: WallpaperMode }>).detail
      if (detail?.mode) wallpaperMode = detail.mode
    }
    window.addEventListener('wallpaperModeChange', onModeChange)

    return () => {
      panel?.removeEventListener('input', handleRangeInput)
      window.removeEventListener('wallpaperModeChange', onModeChange)
    }
  }

  return () => {
    panel?.removeEventListener('input', handleRangeInput)
  }
})

function resetHue() {
  hue = getDefaultHue()
}

function resetWallpaperMode() {
  setWallpaperMode(defaultWallpaperMode)
  wallpaperMode = defaultWallpaperMode
}

function switchMode(mode: WallpaperMode) {
  wallpaperMode = mode
  setWallpaperMode(mode)
}

function resetOverlaySettings() {
  overlayOpacity = defaultOverlayOpacity
  overlayBlur = defaultOverlayBlur
  overlayCardOpacity = defaultOverlayCardOpacity
  setOverlayOpacity(overlayOpacity)
  setOverlayBlur(overlayBlur)
  setOverlayCardOpacity(overlayCardOpacity)
  tick().then(refreshAllRangeProgress)
}

$: if (hueReady && (hue || hue === 0)) {
  setHue(hue)
}

$: if (wallpaperMode === 'overlay') {
  tick().then(refreshAllRangeProgress)
}
</script>

<div id="display-setting" class="float-panel float-panel-closed absolute transition-all w-80 right-4 px-4 py-4 max-h-[min(85vh,32rem)] overflow-y-auto hide-scrollbar">
    <div class="flex flex-row gap-2 mb-3 items-center justify-between">
        <div class="flex gap-2 font-bold text-lg text-neutral-900 dark:text-neutral-100 transition relative ml-3
            before:w-1 before:h-4 before:rounded-md before:bg-[var(--primary)]
            before:absolute before:-left-3 before:top-[0.33rem]"
        >
            {i18n(I18nKey.themeColor)}
            <button aria-label="Reset to Default" class="btn-regular w-7 h-7 rounded-md active:scale-90"
                    class:opacity-0={hue === defaultHue} class:pointer-events-none={hue === defaultHue} on:click={resetHue}>
                <div class="text-[var(--btn-content)]">
                    <Icon icon="fa6-solid:arrow-rotate-left" class="text-[0.875rem]"></Icon>
                </div>
            </button>
        </div>
        <div class="flex gap-1">
            <div id="hueValue" class="transition bg-[var(--btn-regular-bg)] w-10 h-7 rounded-md flex justify-center
            font-bold text-sm items-center text-[var(--btn-content)]">
                {hue}
            </div>
        </div>
    </div>
    <div class="hue-slider-shell w-full h-6 px-1 bg-[oklch(0.80_0.10_0)] dark:bg-[oklch(0.70_0.10_0)] rounded-md select-none mb-4">
        <input aria-label={i18n(I18nKey.themeColor)} type="range" min="0" max="360" bind:value={hue}
               class="slider" id="colorSlider" step="5" style="width: 100%">
    </div>

    {#if showWallpaperControls}
        <div class="border-t border-black/5 dark:border-white/10 pt-4 mt-1">
            <div class="flex flex-row gap-2 mb-3 items-center justify-between">
                <div class="font-bold text-lg text-neutral-900 dark:text-neutral-100 relative ml-3
                    before:w-1 before:h-4 before:rounded-md before:bg-[var(--primary)]
                    before:absolute before:-left-3 before:top-[0.33rem]">
                    {i18n(I18nKey.wallpaperMode)}
                </div>
                <button aria-label="Reset wallpaper mode" class="btn-regular w-7 h-7 rounded-md active:scale-90"
                        class:opacity-0={wallpaperMode === defaultWallpaperMode}
                        class:pointer-events-none={wallpaperMode === defaultWallpaperMode}
                        on:click={resetWallpaperMode}>
                    <div class="text-[var(--btn-content)]">
                        <Icon icon="fa6-solid:arrow-rotate-left" class="text-[0.875rem]"></Icon>
                    </div>
                </button>
            </div>

            <div class="grid grid-cols-2 gap-2">
                <button type="button"
                        class="btn-regular flex flex-col items-center justify-center gap-1 py-2.5 px-2 rounded-lg text-xs font-medium transition"
                        class:bg-[var(--btn-regular-bg-hover)]={wallpaperMode === 'banner'}
                        class:opacity-60={wallpaperMode !== 'banner'}
                        on:click={() => switchMode('banner')}>
                    <Icon icon="material-symbols:view-day-outline" class="text-[1.25rem]"></Icon>
                    <span>{i18n(I18nKey.wallpaperBannerMode)}</span>
                </button>
                <button type="button"
                        class="btn-regular flex flex-col items-center justify-center gap-1 py-2.5 px-2 rounded-lg text-xs font-medium transition"
                        class:bg-[var(--btn-regular-bg-hover)]={wallpaperMode === 'fullscreen'}
                        class:opacity-60={wallpaperMode !== 'fullscreen'}
                        on:click={() => switchMode('fullscreen')}>
                    <Icon icon="material-symbols:wallpaper" class="text-[1.25rem]"></Icon>
                    <span>{i18n(I18nKey.wallpaperFullscreenMode)}</span>
                </button>
                <button type="button"
                        class="btn-regular flex flex-col items-center justify-center gap-1 py-2.5 px-2 rounded-lg text-xs font-medium transition"
                        class:bg-[var(--btn-regular-bg-hover)]={wallpaperMode === 'overlay'}
                        class:opacity-60={wallpaperMode !== 'overlay'}
                        on:click={() => switchMode('overlay')}>
                    <Icon icon="material-symbols:layers-outline" class="text-[1.25rem]"></Icon>
                    <span>{i18n(I18nKey.wallpaperOverlayMode)}</span>
                </button>
                <button type="button"
                        class="btn-regular flex flex-col items-center justify-center gap-1 py-2.5 px-2 rounded-lg text-xs font-medium transition"
                        class:bg-[var(--btn-regular-bg-hover)]={wallpaperMode === 'none'}
                        class:opacity-60={wallpaperMode !== 'none'}
                        on:click={() => switchMode('none')}>
                    <Icon icon="material-symbols:palette-outline" class="text-[1.25rem]"></Icon>
                    <span>{i18n(I18nKey.wallpaperNoneMode)}</span>
                </button>
            </div>
        </div>

        {#if wallpaperMode === 'overlay'}
            <div class="border-t border-black/5 dark:border-white/10 pt-4 mt-4">
                <div class="flex flex-row gap-2 mb-3 items-center justify-between">
                    <div class="font-bold text-base text-neutral-900 dark:text-neutral-100 relative ml-3
                        before:w-1 before:h-4 before:rounded-md before:bg-[var(--primary)]
                        before:absolute before:-left-3 before:top-[0.2rem]">
                        {i18n(I18nKey.wallpaperOverlaySettings)}
                    </div>
                    <button aria-label="Reset overlay settings" class="btn-regular w-7 h-7 rounded-md active:scale-90"
                            class:opacity-0={overlayOpacity === defaultOverlayOpacity && overlayBlur === defaultOverlayBlur && overlayCardOpacity === defaultOverlayCardOpacity}
                            class:pointer-events-none={overlayOpacity === defaultOverlayOpacity && overlayBlur === defaultOverlayBlur && overlayCardOpacity === defaultOverlayCardOpacity}
                            on:click={resetOverlaySettings}>
                        <div class="text-[var(--btn-content)]">
                            <Icon icon="fa6-solid:arrow-rotate-left" class="text-[0.875rem]"></Icon>
                        </div>
                    </button>
                </div>

                <div class="space-y-2">
                    <div class="rounded-md bg-[var(--btn-regular-bg)] p-2">
                        <div class="flex items-center justify-between mb-1">
                            <span class="text-xs font-medium text-[var(--btn-content)] opacity-80">{i18n(I18nKey.overlayOpacity)}</span>
                            <span class="text-xs text-[var(--btn-content)]">{Math.round(overlayOpacity * 100)}%</span>
                        </div>
                        <input type="range" min="0.2" max="1" step="0.05"
                               bind:value={overlayOpacity}
                               on:input={() => setOverlayOpacity(overlayOpacity)}
                               aria-label={i18n(I18nKey.overlayOpacity)}
                               class="slider w-full overlay-slider" />
                    </div>

                    <div class="rounded-md bg-[var(--btn-regular-bg)] p-2">
                        <div class="flex items-center justify-between mb-1">
                            <span class="text-xs font-medium text-[var(--btn-content)] opacity-80">{i18n(I18nKey.overlayBlur)}</span>
                            <span class="text-xs text-[var(--btn-content)]">{overlayBlur}px</span>
                        </div>
                        <input type="range" min="0" max="24" step="1"
                               bind:value={overlayBlur}
                               on:input={() => setOverlayBlur(overlayBlur)}
                               aria-label={i18n(I18nKey.overlayBlur)}
                               class="slider w-full overlay-slider" />
                    </div>

                    <div class="rounded-md bg-[var(--btn-regular-bg)] p-2">
                        <div class="flex items-center justify-between mb-1">
                            <span class="text-xs font-medium text-[var(--btn-content)] opacity-80">{i18n(I18nKey.overlayCardOpacity)}</span>
                            <span class="text-xs text-[var(--btn-content)]">{Math.round(overlayCardOpacity * 100)}%</span>
                        </div>
                        <input type="range" min="0.3" max="1" step="0.05"
                               bind:value={overlayCardOpacity}
                               on:input={() => setOverlayCardOpacity(overlayCardOpacity)}
                               aria-label={i18n(I18nKey.overlayCardOpacity)}
                               class="slider w-full overlay-slider" />
                    </div>
                </div>
            </div>
        {/if}
    {/if}
</div>
