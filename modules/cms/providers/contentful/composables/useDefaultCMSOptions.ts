import { useCurrentShop } from '#storefront/composables'

export function useDefaultCMSOptions() {
  const currentShop = useCurrentShop()

  return {
    locale: currentShop.value.locale ?? '',
  } as const
}
