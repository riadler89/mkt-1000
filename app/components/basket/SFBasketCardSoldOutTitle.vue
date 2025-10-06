<template>
  <div
    class="mt-1 flex items-center space-x-2 rounded-md bg-product-sold-out/10 px-3 py-1.5 text-sm leading-4 text-product-sold-out lg:mt-0.5"
    data-testid="basket-card-sold-out-title"
  >
    <IconErrorHexagon class="size-4 text-product-sold-out" />
    <span>
      {{ $t('global.sold_out_long') }}
    </span>
  </div>
</template>
