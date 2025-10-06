import type {
  ChainModifiers,
  EntriesQueries,
  Entry,
  EntryCollection,
  EntrySkeletonType,
  LocaleCode,
} from 'contentful'
import type { MaybeRefOrGetter } from 'vue'
import { toValue } from 'vue'
import { isInEditorMode } from '../utils/helpers'
import { useDefaultCMSOptions } from './useDefaultCMSOptions'
import { useContentful } from './useContentful'
import { useRoute } from '#app/composables/router'
import { useAsyncData, type AsyncDataOptions } from '#app/composables/asyncData'

type EntriesQueriesWithoutLimit<
  T extends EntrySkeletonType = EntrySkeletonType,
  Modifiers extends ChainModifiers = ChainModifiers,
> = EntriesQueries<T, Modifiers> & { limit?: never }

export function useCMSBySlug<
  T extends EntrySkeletonType = EntrySkeletonType,
  Locale extends LocaleCode = LocaleCode,
>(
  key: string,
  query?: MaybeRefOrGetter<
    EntriesQueriesWithoutLimit<T, 'WITHOUT_UNRESOLVABLE_LINKS'>
  >,
  asyncDataOption?: AsyncDataOptions<
    Entry<T, 'WITHOUT_UNRESOLVABLE_LINKS', Locale> | undefined
  >,
) {
  const route = useRoute()
  const defaultCMSOptions = useDefaultCMSOptions()
  const contentfulClient = useContentful()
  return useAsyncData(
    key,
    () =>
      contentfulClient.withoutUnresolvableLinks
        .getEntries<T, Locale>({
          include: 10,
          ...defaultCMSOptions,
          ...toValue(query),
          limit: 1,
        })
        .then((data) => {
          return data.items.at(0)
        }),
    {
      ...asyncDataOption,
      watch: [() => toValue(query)],
      // Use deep reactive in editor mode , so every dependency can track when we apply the content from the editor
      deep: isInEditorMode(route),
    },
  )
}

export function useCMSByFolder<
  T extends EntrySkeletonType,
  Locale extends LocaleCode = LocaleCode,
>(
  key: string,
  query: EntriesQueries<T, 'WITHOUT_UNRESOLVABLE_LINKS'>,
  asyncDataOption?: AsyncDataOptions<
    EntryCollection<T, ChainModifiers, Locale>,
    Entry<T, ChainModifiers, Locale>
  >,
) {
  const defaultCMSOptions = useDefaultCMSOptions()
  const contentfulClient = useContentful()
  return useAsyncData(
    key,
    () =>
      contentfulClient.withoutUnresolvableLinks.getEntries<T, Locale>({
        include: 10,
        ...defaultCMSOptions,
        ...query,
      }) as unknown as Promise<
        EntryCollection<T, 'WITHOUT_UNRESOLVABLE_LINKS', Locale>
      >,
    asyncDataOption,
  )
}
