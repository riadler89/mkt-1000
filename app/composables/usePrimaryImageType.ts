import type { Value } from '@scayle/storefront-nuxt'
import type { MaybeRefOrGetter } from 'vue'
import { computed, toValue, useRoute, useRouter } from '#imports'

export const usePrimaryImageType = (options: MaybeRefOrGetter<Value[]>) => {
  const route = useRoute()
  const router = useRouter()

  const primaryImageType = computed(() => {
    return toValue(options).find(
      (option: Value) => `${option.id}` === route.query.primaryImageType,
    )
  })

  const applyPrimaryImageType = (primaryImageType?: Value) => {
    const query = {
      ...route.query,
      primaryImageType: primaryImageType?.id,
    }

    if (!primaryImageType) {
      delete query.primaryImageType
    }

    router.replace({ query })
  }

  return {
    primaryImageType,
    applyPrimaryImageType,
  }
}
