import '@scayle/storefront-nuxt'

export type DeliveryCosts = {
  value: string
  disclaimer: string
}

declare module '@scayle/storefront-nuxt' {
  interface ShopCountryCustomData {
    deliveryCosts?: DeliveryCosts
  }
}
