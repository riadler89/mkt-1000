import { useLocalStorage } from '@vueuse/core'

export function useFavoriteStore() {
  return useLocalStorage<number | null>('favoriteStoreId', null, {
    serializer: {
      read: (value: string) => (value ? parseInt(value) : null),
      write: (value: number | null) => String(value),
    },
  })
}
