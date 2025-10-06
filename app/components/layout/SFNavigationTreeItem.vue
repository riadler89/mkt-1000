<template>
  <component
    :is="isLink ? SFLink : 'div'"
    v-bind="
      isLink
        ? {
            to: pathParams?.route,
            target: pathParams?.openInNew ? '_blank' : '_self',
            variant,
            raw: true,
          }
        : {}
    "
    :class="{
      'mr-3 block w-fit content-center rounded p-1 text-md font-normal leading-5 text-[var(--textColor)] transition-all supports-hover:hover:bg-[var(--backgroundColor)]':
        !raw && isLink,
      'mr-0 bg-[var(--backgroundColor)]': isActive && !raw && isLink,
      'min-h-5 w-fit p-1 text-md font-semibold leading-5 text-[var(--textColor)]':
        !raw && !isLink,
    }"
    :style="style"
    @mouseenter="emit('mouseenterNavigationItem')"
  >
    <div
      v-if="iconPath"
      class="flex items-center gap-2"
      data-testid="navigation-item"
    >
      <!-- NOTE: Originally a '<object>' tag was used to load the external SVG icon.
        This allowed the icon to be modified in regards to its visual appearance (color),
        but caused issues due to browsers`content-security-policy` settings, which resulted
        in delayed loading of the SVG icons and layout shifts per navigation tree item with a SVG icon.
        To mitigate this, `<ScayleImg>` with the `preload` attribute is used,
        but SVG icon coloring is not possible anymore. -->
      <ScayleImg
        :src="iconPath"
        :aria-labelledby="`${navigationItem.id}`"
        aria-hidden="true"
        class="pointer-events-none size-4"
        tabindex="-1"
        preload
      />
      <span :id="`${navigationItem.id}`">
        <slot>
          {{ displayName }}
        </slot>
      </span>
    </div>
    <span v-else>
      <slot>
        {{ displayName }}
      </slot>
    </span>
  </component>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { NavigationTreeItem } from '@scayle/storefront-nuxt'
import Color from 'color'
import { ScayleImg } from '#components'
import type { LinkVariant } from '#storefront-ui'
import { useRouteHelpers } from '~/composables'
import { SFLink } from '#storefront-ui/components'
import { theme } from '#tailwind-config'

const {
  navigationItem,
  raw = false,
  isActive = false,
  textColor,
  backgroundColor,
  disabledLink,
} = defineProps<{
  navigationItem: NavigationTreeItem
  variant?: LinkVariant
  raw?: boolean
  isActive?: boolean
  disabledLink?: boolean
  textColor?: `#${string}`
  backgroundColor?: `#${string}`
}>()

const { buildNavigationTreeItemRoute } = useRouteHelpers()

const iconPath = computed(() => {
  const assets = Object.values(navigationItem?.assets ?? {})
  const icon = assets.find((asset) => asset.endsWith('svg'))

  if (!icon) {
    return
  }

  // For usage with `<object>` tag within the template use the following
  // `return URL.parse(icon, cdnUrl)?.toString()`, where
  // `cdnUrl` can be sourced from `useRuntimeConfig().public`.
  return icon
})

const emit = defineEmits<{ mouseenterNavigationItem: [] }>()

const pathParams = computed(() => {
  return buildNavigationTreeItemRoute(navigationItem)
})
const displayName = computed(() => navigationItem.name)
const disabled = computed<boolean>(() =>
  disabledLink ? disabledLink : !!navigationItem.customData?.disabledLink,
)
const getStyle = (
  navigationTreeItem: NavigationTreeItem,
  fallbackBackgroundColor: `#${string}`,
  fallbackTextColor: `#${string}`,
) => {
  const linkColor = navigationTreeItem?.customData?.linkColor

  if (!linkColor) {
    return {
      '--backgroundColor': Color(fallbackBackgroundColor).hex(),
      '--textColor': Color(fallbackTextColor).hex(),
    }
  }

  return {
    '--backgroundColor': Color(linkColor).alpha(0.1).hexa(),
    '--textColor': Color(linkColor).hex(),
  }
}

const isLink = computed(() => {
  return pathParams.value?.route && !disabled.value
})

const style = computed(() => {
  return getStyle(
    navigationItem,
    backgroundColor ?? theme.colors.gray[200],
    textColor ?? (isLink.value ? theme.colors.secondary : theme.colors.primary),
  )
})
</script>
