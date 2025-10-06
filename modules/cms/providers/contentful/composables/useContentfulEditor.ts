import type {
  ChainModifiers,
  Entry,
  EntrySkeletonType,
  LocaleCode,
} from 'contentful'
import { getCurrentInstance, onBeforeUnmount, onMounted, type Ref } from 'vue'
import { isInEditorMode } from '../utils/helpers'
import { useRoute } from '#app/composables/router'
import { useCurrentShop } from '#storefront/composables'

/**
 * This composable is used to initialize the Contentful Live Preview.
 *
 * @param content - The content to initialize the live preview for.
 */
export function useContentfulEditor<T extends EntrySkeletonType>(
  content?: Ref<Entry<T, ChainModifiers, string> | null | undefined>,
) {
  const route = useRoute()
  const currentShop = useCurrentShop()
  const instance = getCurrentInstance()

  /**
   * Loads and initializes the Contentful Live Preview.
   *
   * @returns A promise that resolves when the live preview is initialized.
   */
  const initContentfulLivePreview = async () => {
    if (!content?.value) {
      return
    }
    const { ContentfulLivePreview } = await import('@contentful/live-preview')
    ContentfulLivePreview.init({ locale: currentShop.value.locale })
    const unsubscribe = ContentfulLivePreview.subscribe({
      data: content.value,
      callback(update) {
        content.value = update as Entry<T, ChainModifiers, LocaleCode>
      },
    })
    onBeforeUnmount(() => unsubscribe(), instance)
  }

  onMounted(() => {
    if (isInEditorMode(route)) {
      initContentfulLivePreview()
    }
  })
}
