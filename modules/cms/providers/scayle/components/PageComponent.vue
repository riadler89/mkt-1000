<template>
  <section class="-mb-16 overflow-hidden text-clip px-7 md:px-20">
    <div class="mx-auto flex w-full flex-col lg:flex-row">
      <div
        class="bg-lined-grid shrink-0 py-4 text-secondary lg:w-1/2 lg:py-10 lg:pr-12"
        style="--lined-grid-gradient-start: calc(100% - 12rem)"
      >
        <p class="mb-4 font-medium">Progressive Technology</p>
        <h1
          class="mb-8 text-[3.25rem] font-bold leading-[3.625rem] text-black md:text-[4.5rem] md:leading-none"
        >
          Storefront
        </h1>
        <p class="mb-10 max-w-[46.875rem] leading-8 lg:pr-12">
          Storefront is an all-in-one starter kit for building high-performance
          e-commerce shops for the SCAYLE Commerce Engine. It makes it quick and
          easy to build a best-in-class shop frontend. The latest version of
          Storefront is based on Nuxt and Vue 3.
        </p>
        <div class="flex flex-wrap gap-4 text-xl md:mb-24">
          <SFButton
            to="https://scayle.dev/en/storefront"
            class="!px-6"
            target="_blank"
          >
            SCAYLE Resource Center
          </SFButton>
          <SFButton
            to="https://scayle.dev/en/storefront-guide/developer-guide/integrations/cms/"
            variant="tertiary"
            class="!px-6"
            target="_blank"
          >
            Setup a CMS for Storefront
          </SFButton>
        </div>
      </div>
      <div class="self-end">
        <img
          class="lg:-ml-12 lg:w-[87rem] lg:max-w-none"
          src="../assets/images/hero.avif"
          alt="Storefront Application"
        />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { SFButton } from '#storefront-ui/components'

defineOptions({ name: 'CMSContentPage' })
</script>

<style>
@import 'tailwindcss/base';
@import 'tailwindcss/components';
@import 'tailwindcss/utilities';

@media (min-width: 1024px) {
  .bg-lined-grid {
    --lined-grid-background-color: #fff;
    --lined-grid-background-color-start: var(--lined-grid-background-color);
    --lined-grid-background-color-stop: var(--lined-grid-background-color);
    --lined-grid-background-gradient-start: 0%;
    --lined-grid-background-gradient-stop: 100%;
    --lined-grid-background-angle: 135deg;
    --lined-grid-gradient-color: var(--lined-grid-background-color-start);
    --lined-grid-gradient-start: var(--lined-grid-background-gradient-start);
    --lined-grid-gradient-stop: var(--lined-grid-background-gradient-stop);
    --lined-grid-gradient-angle: var(--lined-grid-background-angle);
    --lined-grid-color: #eaeaea;
    --lined-grid-width: 1px;
    --lined-grid-size: 2.5rem;
    --lined-grid-position: calc(100% + var(--lined-grid-width));
    --lined-grid-x-position: var(--lined-grid-position);
    --lined-grid-y-position: var(--lined-grid-position);
    --lined-grid-x-direction: to left;
    --lined-grid-y-direction: to top;

    background-position:
      center center,
      var(--lined-grid-x-position) var(--lined-grid-y-position),
      var(--lined-grid-x-position) var(--lined-grid-y-position),
      center center;
    background-size:
      100% 100%,
      var(--lined-grid-size) var(--lined-grid-size),
      var(--lined-grid-size) var(--lined-grid-size),
      100% 100%;
    background-image:
      linear-gradient(
        var(--lined-grid-gradient-angle),
        var(--lined-grid-gradient-color) 0%,
        var(--lined-grid-gradient-color) var(--lined-grid-gradient-start),
        transparent var(--lined-grid-gradient-stop),
        transparent 100%
      ),
      linear-gradient(
        var(--lined-grid-x-direction),
        var(--lined-grid-color) var(--lined-grid-width),
        transparent var(--lined-grid-width)
      ),
      linear-gradient(
        var(--lined-grid-y-direction),
        var(--lined-grid-color) var(--lined-grid-width),
        transparent var(--lined-grid-width)
      ),
      linear-gradient(
        var(--lined-grid-background-angle),
        var(--lined-grid-background-color-start) 0%,
        var(--lined-grid-background-color-start)
          var(--lined-grid-background-gradient-start),
        var(--lined-grid-background-color-stop)
          var(--lined-grid-background-gradient-stop),
        var(--lined-grid-background-color-stop) 100%
      );
  }

  .bg-lined-grid-tl {
    --lined-grid-background-angle: -45deg;
    --lined-grid-position: calc(var(--lined-grid-width) * -1);
    --lined-grid-x-direction: to right;
    --lined-grid-y-direction: to bottom;
  }

  .bg-lined-grid-tr {
    --lined-grid-background-angle: 45deg;
    --lined-grid-y-position: calc(var(--lined-grid-width) * -1);
    --lined-grid-y-direction: to bottom;
  }

  .bg-lined-grid-bl {
    --lined-grid-background-angle: -135deg;
    --lined-grid-x-position: calc(var(--lined-grid-width) * -1);
    --lined-grid-x-direction: to right;
  }
}
</style>
