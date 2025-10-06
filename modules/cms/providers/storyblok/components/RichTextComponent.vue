<template>
  <div v-editable="contentElement">
    <StoryblokRichText :doc="contentElement.content" :resolvers="resolvers" />
  </div>
</template>
<script setup lang="ts">
import { h, type VNode } from 'vue'
import {
  type StoryblokRichTextNode,
  MarkTypes,
  BlockTypes,
  type StoryblokRichTextResolvers,
} from '@storyblok/richtext'
import { StoryblokRichText } from '@storyblok/vue'
import type { RichTextComponent } from '../types'
import type { StoryblokMultilink } from '../types/gen/storyblok'
import { isExternalLink } from '~/utils'
import { useRouteHelpers } from '~/composables'

const { contentElement } = defineProps<{ contentElement: RichTextComponent }>()

const { getLocalizedRoute } = useRouteHelpers()

/**
 * Resolves links embedded in rich text.
 * @param attrs - The attributes to resolve the link from
 * @returns The resolved link
 */
const resolveRichTextLink = (attrs: Record<string, unknown> | undefined) => {
  if (!attrs) {
    return undefined
  }

  /**
   * Checks if the attributes are a story link
   * @param attributes - The attributes to check if they are a story link
   * @returns True if the attributes are a story link, false otherwise
   */
  function isStoryLink(attributes: unknown): attributes is StoryblokMultilink {
    return (
      typeof attributes === 'object' &&
      attributes !== null &&
      'linktype' in attributes &&
      (attributes as { linktype?: unknown }).linktype === 'story'
    )
  }

  if (isStoryLink(attrs) && attrs.story) {
    return getLocalizedRoute(attrs.story.full_slug as string)
  }

  return isExternalLink(attrs.href as string)
    ? (attrs.href as string)
    : getLocalizedRoute(attrs.href as string)
}

const resolvers: StoryblokRichTextResolvers<VNode> = {
  [BlockTypes.HEADING]: (node: StoryblokRichTextNode<VNode>) => {
    switch (node.attrs?.level) {
      case 1:
        return h('h1', { class: 'text-3xl font-semibold' }, node.children)
      case 2:
        return h('h2', { class: 'text-2xl font-semibold' }, node.children)
      case 3:
        return h('h3', { class: 'text-xl font-semibold' }, node.children)
      default:
        return h('h1', { class: 'text-3xl font-semibold' }, node.children)
    }
  },
  [BlockTypes.UL_LIST]: (node: StoryblokRichTextNode<VNode>) => {
    return h('ul', { class: 'list-disc pl-6' }, node.children)
  },
  [BlockTypes.OL_LIST]: (node: StoryblokRichTextNode<VNode>) => {
    return h('ol', { class: 'list-decimal pl-6' }, node.children)
  },
  [BlockTypes.PARAGRAPH]: (node: StoryblokRichTextNode<VNode>) => {
    if (!node.children) {
      return h('br')
    }
    return h('p', node.children)
  },
  [MarkTypes.LINK]: (node: StoryblokRichTextNode<VNode>) => {
    return h(
      'a',
      {
        class: 'font-semibold',
        href: resolveRichTextLink(node.attrs),
        target: node.attrs?.target,
      },
      node.text,
    )
  },
}
</script>
