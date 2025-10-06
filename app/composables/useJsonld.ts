import { toValue, type MaybeRefOrGetter } from 'vue'
import type { WithContext, Thing, Graph } from 'schema-dts'
import { useHead } from '#imports'

export function useJsonld(
  json: MaybeRefOrGetter<
    WithContext<Thing> | WithContext<Thing>[] | Graph | undefined
  >,
) {
  useHead(() => {
    const value = toValue(json)
    if (!value) {
      return {}
    }
    return {
      script: [
        {
          type: 'application/ld+json',
          innerHTML: JSON.stringify(value, null, ''),
        },
      ],
    }
  }, {})
}
