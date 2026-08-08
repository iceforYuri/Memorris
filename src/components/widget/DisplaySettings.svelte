<script lang="ts">
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
import { onMount } from 'svelte'

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

onMount(() => {
  hue = getHue()
  hueReady = true

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
    return () => window.removeEventListener('wallpaperModeChange', onModeChange)
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
}

$: if (hueReady && (hue || hue === 0)) {
  setHue(hue)
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
    <div class="w-full h-6 px-1 bg-[oklch(0.80_0.10_0)] dark:bg-[oklch(0.70_0.10_0)] rounded select-none mb-4">
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

                <label class="block text-sm mb-1 text-neutral-700 dark:text-neutral-300">
                    {i18n(I18nKey.overlayOpacity)} · {Math.round(overlayOpacity * 100)}%
                </label>
                <input type="range" min="0.2" max="1" step="0.05"
                       bind:value={overlayOpacity}
                       on:input={() => setOverlayOpacity(overlayOpacity)}
                       class="slider w-full mb-3" />

                <label class="block text-sm mb-1 text-neutral-700 dark:text-neutral-300">
                    {i18n(I18nKey.overlayBlur)} · {overlayBlur}px
                </label>
                <input type="range" min="0" max="24" step="1"
                       bind:value={overlayBlur}
                       on:input={() => setOverlayBlur(overlayBlur)}
                       class="slider w-full mb-3" />

                <label class="block text-sm mb-1 text-neutral-700 dark:text-neutral-300">
                    {i18n(I18nKey.overlayCardOpacity)} · {Math.round(overlayCardOpacity * 100)}%
                </label>
                <input type="range" min="0.3" max="1" step="0.05"
                       bind:value={overlayCardOpacity}
                       on:input={() => setOverlayCardOpacity(overlayCardOpacity)}
                       class="slider w-full" />
            </div>
        {/if}
    {/if}
</div>

<style lang="stylus">
    #display-setting
      input[type="range"]
        -webkit-appearance none
        height 1.5rem
        background-image var(--color-selection-bar)
        transition background-image 0.15s ease-in-out

        &::-webkit-slider-thumb
          -webkit-appearance none
          height 1rem
          width 0.5rem
          border-radius 0.125rem
          background rgba(255, 255, 255, 0.7)
          box-shadow none
          &:hover
            background rgba(255, 255, 255, 0.8)
          &:active
            background rgba(255, 255, 255, 0.6)

        &::-moz-range-thumb
          -webkit-appearance none
          height 1rem
          width 0.5rem
          border-radius 0.125rem
          border-width 0
          background rgba(255, 255, 255, 0.7)
          box-shadow none
          &:hover
            background rgba(255, 255, 255, 0.8)
          &:active
            background rgba(255, 255, 255, 0.6)

        &::-ms-thumb
          -webkit-appearance none
          height 1rem
          width 0.5rem
          border-radius 0.125rem
          background rgba(255, 255, 255, 0.7)
          box-shadow none
          &:hover
            background rgba(255, 255, 255, 0.8)
          &:active
            background rgba(255, 255, 255, 0.6)

</style>
