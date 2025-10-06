<!-- eslint-disable vue/no-v-html -->
<template>
  <div
    :data-contentful-entry-id="contentElement?.sys?.id"
    data-contentful-field-id="content"
    v-html="content"
  />
</template>

<script setup lang="ts">
import type { ChainModifiers, LocaleCode } from 'contentful'
import {
  type Block,
  type Inline,
  BLOCKS,
  type Document,
  INLINES,
} from '@contentful/rich-text-types'
import {
  documentToHtmlString,
  type Next,
  type Options,
} from '@contentful/rich-text-html-renderer'
import { computed } from 'vue'
import type { TypeRichTextComponent } from '../types'
import { useRouteHelpers } from '~/composables'
import { isExternalLink } from '~/utils'

const { contentElement } = defineProps<{
  contentElement: TypeRichTextComponent<ChainModifiers, LocaleCode>
}>()
const { getLocalizedRoute } = useRouteHelpers()

const options = {
  renderNode: {
    [BLOCKS.HEADING_1]: (node: Block, next: Next) =>
      `<h1 class="text-3xl font-semibold">${next(node.content)}</h1>`,
    [BLOCKS.HEADING_2]: (node: Block, next: Next) =>
      `<h2 class="text-2xl font-semibold">${next(node.content)}</h2>`,
    [BLOCKS.HEADING_3]: (node: Block, next: Next) =>
      `<h3 class="text-xl font-semibold">${next(node.content)}</h3>`,
    [INLINES.HYPERLINK]: (node: Inline, next: Next) => {
      const url = isExternalLink(node.data.uri)
        ? node.data.uri
        : getLocalizedRoute(node.data.uri)
      return `<a class="font-semibold" href="${url}">${next(node.content)}</a>`
    },
    [INLINES.ENTRY_HYPERLINK]: (node: Inline, next: Next) => {
      return `<a class="font-semibold" href="${getLocalizedRoute(node.data.target.fields.slug)}">${next(node.content)}</a>`
    },
    [INLINES.ASSET_HYPERLINK]: (node: Inline, next: Next) => {
      return `<a class="font-semibold" href="${node.data.target.fields.file.url}">${next(node.content)}</a>`
    },
    [BLOCKS.UL_LIST]: (node: Block, next: Next) =>
      `<ul class="list-disc pl-6">${next(node.content)}</ul>`,
    [BLOCKS.OL_LIST]: (node: Block, next: Next) =>
      `<ol class="list-decimal pl-6">${next(node.content)}</ol>`,
    [BLOCKS.PARAGRAPH]: (node: Block, next: Next) => {
      if (
        node.content.length === 0 ||
        (node.content.length === 1 &&
          node.content[0]?.nodeType === 'text' &&
          node.content[0]?.value === '')
      ) {
        return '<br />'
      }
      return `<p>${next(node.content)}</p>`
    },
  },
}

const content = computed(() => {
  return documentToHtmlString(
    contentElement.fields.content as Document,
    options as Partial<Options>,
  )
})
</script>
