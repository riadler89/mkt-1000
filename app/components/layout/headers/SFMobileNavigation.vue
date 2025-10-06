<template>
  <div
    class="relative mb-5 flex grow overflow-y-auto overflow-x-hidden scroll-shadow"
  >
    <Transition
      enter-from-class="-translate-x-full"
      enter-to-class="translate-x-0"
      leave-from-class="translate-x-0"
      leave-to-class="-translate-x-full"
      enter-active-class="transition-[display,transform,overlay] transition-discrete duration-200 ease-in-out"
      leave-active-class="transition-[display,transform,overlay] transition-discrete duration-200 ease-in-out"
    >
      <ul
        v-if="!selectedItem"
        class="mt-2 flex w-full shrink-0 flex-col gap-y-5 p-0"
      >
        <li
          v-for="item in navigationItems"
          :key="item.id"
          class="flex cursor-pointer items-center pr-4"
          data-testid="mobile-nav-link-main"
          :aria-label="item.name"
          @click="selectItem(item)"
        >
          <template v-if="item.children.length === 0">
            <SFLink
              class="grow"
              :to="buildNavigationTreeItemRoute(item)?.route || ''"
              :target="
                buildNavigationTreeItemRoute(item)?.openInNew
                  ? '_blank'
                  : '_self'
              "
            >
              <SFNavigationTreeItem
                :navigation-item="item"
                :text-color="theme.colors.primary"
                class="min-h-11 rounded !text-2xl font-semibold transition-all supports-hover:hover:bg-[var(--backgroundColor)]"
                disabled-link
              />
            </SFLink>
          </template>
          <template v-else>
            <SFNavigationTreeItem
              :navigation-item="item"
              :text-color="theme.colors.primary"
              class="min-h-11 !text-2xl font-semibold"
              role="button"
              disabled-link
            />
          </template>
          <SFButton
            v-if="item.children.length"
            variant="accent"
            class="ml-auto !h-auto min-h-11 rounded-md bg-gray-300 !p-3 hover:!bg-gray-300"
            aria-hidden="true"
            @click="selectItem(item)"
          >
            <IconChevronRight class="size-4 text-secondary" />
          </SFButton>
        </li>
      </ul>
    </Transition>
    <Transition
      enter-from-class="translate-x-0"
      enter-to-class="-translate-x-full"
      leave-from-class="-translate-x-full"
      leave-to-class="translate-x-0"
      enter-active-class="transition-[display,transform,overlay] transition-discrete duration-200 ease-in-out"
      leave-active-class="transition-[display,transform,overlay] transition-discrete  duration-200 ease-in-out"
    >
      <div v-if="selectedItem" class="mt-2 inline w-full shrink-0">
        <SFButton
          variant="raw"
          class="mb-5 h-11"
          @click="selectedItem = undefined"
        >
          <template #icon>
            <IconBack class="size-4" />
          </template>
          <SFNavigationTreeItem
            class="!text-2xl font-semibold"
            :navigation-item="selectedItem"
            :text-color="theme.colors.primary"
            disabled-link
          />
        </SFButton>
        <div class="flex flex-col gap-y-5">
          <template v-for="item in selectedItem.children" :key="item.id">
            <SFAccordionEntry
              v-if="item.children.length"
              :id="`${item.id}`"
              class="!py-0"
              variant="narrow"
            >
              <template #title>
                <SFNavigationTreeItem
                  class="h-11 content-center py-0 !text-xl font-semibold"
                  disabled-link
                  :navigation-item="item"
                  :text-color="theme.colors.primary"
                />
              </template>
              <ul class="flex flex-col gap-2 pl-2">
                <li
                  v-for="child in item.children"
                  :key="child.id"
                  class="flex items-center"
                  data-testid="mobile-navigation-item"
                >
                  <SFNavigationTreeItem
                    :navigation-item="child"
                    :text-color="theme.colors.primary"
                    class="h-11 text-lg"
                    @click="$emit('clickLink')"
                  />
                </li>
              </ul>
            </SFAccordionEntry>
            <SFNavigationTreeItem
              v-else
              :navigation-item="item"
              :text-color="theme.colors.primary"
              class="min-h-11 !text-xl font-semibold"
              @click="$emit('clickLink')"
            />
          </template>
        </div>
      </div>
    </Transition>
  </div>
</template>
<script setup lang="ts">
import { ref, watch } from 'vue'
import type {
  NavigationItems,
  NavigationTreeItem as NavigationTreeItemType,
} from '@scayle/storefront-nuxt'
import { SFButton, SFAccordionEntry, SFLink } from '#storefront-ui/components'
import SFNavigationTreeItem from '~/components/layout/SFNavigationTreeItem.vue'
import { theme } from '#tailwind-config'
import { useRouteHelpers } from '~/composables'

const { isOpen, navigationItems } = defineProps<{
  /**
   * Whether the mobile navigation is currently open and visible.
   */
  isOpen: boolean
  /**
   * Array of navigation tree items with nested children for hierarchical mobile navigation.
   */
  navigationItems?: NavigationItems
}>()

const emit = defineEmits<{ clickLink: [] }>()

const { buildNavigationTreeItemRoute } = useRouteHelpers()

const selectedItem = ref<NavigationTreeItemType | undefined>(undefined)
const selectItem = (item: NavigationTreeItemType) => {
  if (item.children.length === 0) {
    emit('clickLink')
    return
  }
  selectedItem.value = item
}

watch(
  () => isOpen,
  () => {
    selectedItem.value = undefined
  },
)
</script>
