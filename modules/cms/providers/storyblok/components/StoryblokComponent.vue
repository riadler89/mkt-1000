<template>
  <TextComponent
    v-if="contentElement.component === 'TextComponent'"
    :content-element="contentElement"
  />
  <DividerComponent
    v-else-if="contentElement.component === 'DividerComponent'"
    :content-element="contentElement"
  />
  <ImageComponent
    v-else-if="contentElement.component === 'ImageComponent'"
    :content-element="contentElement"
  />
  <LinkComponent
    v-else-if="contentElement.component === 'LinkComponent'"
    :content-element="contentElement"
  />
  <VideoComponent
    v-else-if="contentElement.component === 'VideoComponent'"
    :content-element="contentElement"
  />
  <RichTextComponent
    v-else-if="contentElement.component === 'RichTextComponent'"
    :content-element="contentElement"
  />
  <SectionComponent
    v-else-if="contentElement.component === 'SectionComponent'"
    :content-element="contentElement"
  />
  <ButtonComponent
    v-else-if="contentElement.component === 'ButtonComponent'"
    :content-element="contentElement"
  />
  <SliderComponent
    v-else-if="contentElement.component === 'SliderComponent'"
    :content-element="contentElement"
  />
  <GridComponent
    v-else-if="contentElement.component === 'GridComponent'"
    :content-element="contentElement"
  />
  <AccordionComponent
    v-else-if="contentElement.component === 'AccordionComponent'"
    :content-element="contentElement"
  />
  <AccordionItemComponent
    v-else-if="contentElement.component === 'AccordionItemComponent'"
    :content-element="contentElement"
  />
  <div v-else-if="showNotImplemented">
    The CMS content element '{{ contentElement }}' has not yet been implemented!
  </div>
</template>
<script setup lang="ts">
import type {
  AccordionComponent as AccordionComponentType,
  AccordionItemComponent as AccordionItemComponentType,
  ButtonComponent as ButtonComponentType,
  DividerComponent as DividerComponentType,
  GridComponent as GridComponentType,
  ImageComponent as ImageComponentType,
  LinkComponent as LinkComponentType,
  RichTextComponent as RichTextComponentType,
  SectionComponent as SectionComponentType,
  SliderComponent as SliderComponentType,
  TextComponent as TextComponentType,
  VideoComponent as VideoComponentType,
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
    | AccordionComponentType
    | AccordionItemComponentType
    | ButtonComponentType
    | DividerComponentType
    | GridComponentType
    | ImageComponentType
    | LinkComponentType
    | RichTextComponentType
    | SectionComponentType
    | SliderComponentType
    | TextComponentType
    | VideoComponentType
}>()
</script>
