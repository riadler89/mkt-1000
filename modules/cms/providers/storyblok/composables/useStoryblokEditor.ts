import { onMounted } from 'vue'
import type { ISbStory } from '@storyblok/vue'
import type { Ref } from 'vue'
import { isInEditorMode } from '../utils/helpers'
import { useRoute } from '#app/composables/router'

/**
 * This composable is used to initialize the Storyblok Bridge.
 *
 * @param content - The content to initialize the bridge for.
 */
export function useStoryblokEditor<T>(
  content?: Ref<ISbStory<T> | null | undefined>,
) {
  const route = useRoute()

  /**
   * Loads and initializes the Storyblok Bridge.
   *
   * @returns A promise that resolves when the bridge is initialized.
   */
  const initStoryblokLivePreview = async () => {
    if (!content?.value) {
      return
    }
    const { useStoryblokBridge } = await import('@storyblok/vue')
    useStoryblokBridge(content.value.data.story.id, (evStory) => {
      if (content.value?.data.story) {
        Object.assign(content.value.data.story, evStory)
      }
    })
  }
  onMounted(() => {
    if (isInEditorMode(route) && content?.value) {
      initStoryblokLivePreview()
    }
  })
}
