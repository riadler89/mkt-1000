<template>
  <div class="xl:container md:max-xl:mx-5">
    <div
      class="flex flex-col items-start justify-start gap-8 max-md:space-y-5 md:flex-row"
    >
      <div
        class="flex items-start max-md:w-full md:sticky md:top-8 md:max-w-[700px] md:shrink"
      >
        <div
          class="grid w-full grid-cols-[fit-content(100%)_minmax(auto,_528px)] grid-rows-[fit-content(0)] max-md:grid-cols-1 max-md:grid-rows-1"
        >
          <!-- Thumbnails -->

          <div
            class="mr-4 w-24 shrink-0 overflow-y-scroll scrollbar-hide max-md:hidden"
          >
            <SFSkeletonLoader
              v-for="i in 4"
              :key="i"
              type="custom"
              class="my-2 aspect-product w-24 shrink-0 cursor-pointer overflow-hidden rounded-md first:mt-0 last:mb-0"
            />
          </div>
          <!-- Main image -->
          <div>
            <SFSkeletonLoader
              ref="image"
              type="custom"
              class="aspect-product min-w-full self-start overflow-hidden md:rounded-md"
            />
          </div>
        </div>
      </div>
      <div class="flex w-full flex-col gap-4 md:max-w-[500px] md:shrink-[4]">
        <!-- Breadcrumbs -->
        <SFSkeletonLoader
          type="headline"
          class="mb-8 hidden !h-6 max-md:mx-5 md:block"
        />
        <div class="mb-2">
          <!-- Brand -->
          <SFSkeletonLoader
            type="custom"
            class="mb-1 !h-6 w-32 max-md:mx-5 md:w-52"
          />
          <!-- Name -->
          <SFSkeletonLoader
            type="custom"
            class="!h-5 w-32 max-md:mx-5 md:w-52"
          />
        </div>
        <!-- Price -->
        <SFSkeletonLoader
          type="custom"
          class="mt-2 !h-5 w-32 max-md:mx-5 md:w-52"
        />

        <!-- Siblings-->
        <SFSkeletonLoader type="custom" class="h-4 w-32 max-md:mx-5" />
        <div class="mb-3 flex space-x-4 overflow-hidden max-md:mx-5">
          <SFSkeletonLoader
            v-for="i in 4"
            :key="i"
            type="custom"
            class="relative size-20 shrink-0 rounded-xl border-2 md:size-16"
          />
        </div>

        <!-- Size and Quantity-->
        <div>
          <SFSkeletonLoader type="custom" class="mb-4 h-4 w-32 max-md:mx-5" />
          <div
            class="my-3 mt-4 flex h-12 max-w-full items-center space-x-4 max-md:mx-5"
          >
            <SFSkeletonLoader
              type="custom"
              class="h-12 grow rounded-md md:w-52"
            />
            <SFSkeletonLoader type="custom" class="h-12 w-32 rounded-md" />
          </div>
        </div>

        <!-- Add to basket and Wishlist-->
        <div class="flex gap-3 max-md:hidden">
          <SFSkeletonLoader class="!size-13 grow" />
          <SFSkeletonLoader class="!size-13" />
        </div>
      </div>
    </div>
    <div
      class="px-5 text-2xl font-medium md:inset-x-0 md:m-auto md:ml-24 md:max-w-screen-xl md:px-4"
    >
      <div class="md:divide-y">
        <div
          v-for="i in 2"
          :key="i"
          class="flex w-full items-center gap-4 max-md:justify-between md:h-min md:flex-row-reverse md:justify-end"
        >
          <SFSkeletonLoader type="custom" class="my-10 h-7 w-64" />
          <IconPlus class="size-6 text-black" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { SFSkeletonLoader } from '#storefront-ui/components'
</script>
