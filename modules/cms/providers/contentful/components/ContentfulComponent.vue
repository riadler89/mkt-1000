<template>
  <TextComponent
    v-if="contentElement && isTypeTextComponent(contentElement)"
    :content-element="contentElement"
  />
  <DividerComponent
    v-else-if="contentElement && isTypeDividerComponent(contentElement)"
    :content-element="contentElement"
  />
  <ImageComponent
    v-else-if="contentElement && isTypeImageComponent(contentElement)"
    :content-element="contentElement"
  />
  <LinkComponent
    v-else-if="contentElement && isTypeLinkComponent(contentElement)"
    :content-element="contentElement"
  />
  <VideoComponent
    v-else-if="contentElement && isTypeVideoComponent(contentElement)"
    :content-element="contentElement"
  />
  <RichTextComponent
    v-else-if="contentElement && isTypeRichTextComponent(contentElement)"
    :content-element="contentElement"
  />
  <SectionComponent
    v-else-if="contentElement && isTypeSectionComponent(contentElement)"
    :content-element="contentElement"
  />
  <ButtonComponent
    v-else-if="contentElement && isTypeButtonComponent(contentElement)"
    :content-element="contentElement"
  />
  <SliderComponent
    v-else-if="contentElement && isTypeSliderComponent(contentElement)"
    :content-element="contentElement"
  />
  <GridComponent
    v-else-if="contentElement && isTypeGridComponent(contentElement)"
    :content-element="contentElement"
  />
  <AccordionComponent
    v-else-if="contentElement && isTypeAccordionComponent(contentElement)"
    :content-element="contentElement"
  />
  <AccordionItemComponent
    v-else-if="contentElement && isTypeAccordionItemComponent(contentElement)"
    :content-element="contentElement"
  />
  <div v-else-if="showNotImplemented">
    The CMS content element '{{ contentElement?.sys.contentType.sys.id }}' has
    not yet been implemented!
  </div>
</template>
<script setup lang="ts">
import type { Entry } from 'contentful'
import {
  isTypeButtonComponent,
  isTypeDividerComponent,
  isTypeTextComponent,
  isTypeImageComponent,
  isTypeLinkComponent,
  isTypeVideoComponent,
  isTypeRichTextComponent,
  isTypeSectionComponent,
  isTypeSliderComponent,
  isTypeGridComponent,
  isTypeAccordionComponent,
  isTypeAccordionItemComponent,
  type TypeAccordionComponentSkeleton,
  type TypeAccordionItemComponentSkeleton,
  type TypeButtonComponentSkeleton,
  type TypeDividerComponentSkeleton,
  type TypeGridComponentSkeleton,
  type TypeImageComponentSkeleton,
  type TypeLinkComponentSkeleton,
  type TypeRichTextComponentSkeleton,
  type TypeSectionComponentSkeleton,
  type TypeSliderComponentSkeleton,
  type TypeTextComponentSkeleton,
  type TypeVideoComponentSkeleton,
} from '../types'
import TextComponent from './TextComponent.vue'
import DividerComponent from './DividerComponent.vue'
import ImageComponent from './ImageComponent.vue'
import LinkComponent from './LinkComponent.vue'
import VideoComponent from './VideoComponent.vue'
import RichTextComponent from './RichTextComponent.vue'
import SectionComponent from './SectionComponent.vue'
import ButtonComponent from './ButtonComponent.vue'
import SliderComponent from './SliderComponent.vue'
import GridComponent from './GridComponent.vue'
import AccordionComponent from './AccordionComponent.vue'
import AccordionItemComponent from './AccordionItemComponent.vue'

const showNotImplemented = import.meta.dev || import.meta.test

const { contentElement } = defineProps<{
  contentElement:
    | Entry<
        | TypeAccordionComponentSkeleton
        | TypeAccordionItemComponentSkeleton
        | TypeButtonComponentSkeleton
        | TypeGridComponentSkeleton
        | TypeImageComponentSkeleton
        | TypeLinkComponentSkeleton
        | TypeRichTextComponentSkeleton
        | TypeSectionComponentSkeleton
        | TypeSliderComponentSkeleton
        | TypeTextComponentSkeleton
        | TypeDividerComponentSkeleton
        | TypeVideoComponentSkeleton,
        'WITHOUT_UNRESOLVABLE_LINKS',
        string
      >
    | undefined
}>()
</script>
