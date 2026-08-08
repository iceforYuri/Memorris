<script lang="ts">
/**
 * Svelte 岛屿用离线 Iconify：SSR/客户端同构出 SVG，避免 @iconify/svelte 在线组件水合失败。
 * Astro 侧仍用 astro-icon。
 */
import Iconify, { addCollection } from '@iconify/svelte/dist/OfflineIcon.svelte'
import type { IconifyJSON } from '@iconify/types'
import iconsData from '@/constants/icons-data.json'

let collectionsAdded = false
if (!collectionsAdded) {
	for (const data of Object.values(iconsData)) {
		addCollection(data as IconifyJSON)
	}
	collectionsAdded = true
}

export let icon: string
let className = ''
export { className as class }
export let style = ''
</script>

<Iconify
	{icon}
	class="inline-icon inline-flex items-center justify-center {className}"
	{style}
/>
