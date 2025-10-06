import { beforeEach, describe, it, expect, vi } from 'vitest'
import { useFormat } from './useFormat'

const mocks = vi.hoisted(() => ({
  currentShop: {
    value: {
      locale: 'de-DE' as string | null,
    },
  },
}))

vi.mock('#storefront/composables', () => ({
  useCurrentShop: vi.fn().mockReturnValue(mocks.currentShop),
}))

describe('useFormat', () => {
  beforeEach(() => {
    mocks.currentShop.value.locale = 'de-DE'
  })

  describe('formatDate', () => {
    it('should format a valid date string correctly', () => {
      const { formatDate } = useFormat()
      const result = formatDate(new Date('2025-02-02'))
      expect(result).toBe('2.2.2025')
    })

    it('should return undefined for an invalid date string', () => {
      const { formatDate } = useFormat()
      const result = formatDate(new Date('invalid-date'))
      expect(result).toBeUndefined()
    })

    it('should handle a valid date object correctly', () => {
      const { formatDate } = useFormat()
      const result = formatDate(new Date(2025, 1, 2)) // Month is 0-based
      expect(result).toBe('2.2.2025')
    })

    it('should format date for en-US locale', () => {
      mocks.currentShop.value.locale = 'en-US'
      const { formatDate } = useFormat()
      const result = formatDate(new Date('2025-02-02'))
      expect(result).toBe('2/2/2025')
    })

    it('should format date for hr-HR locale', () => {
      mocks.currentShop.value.locale = 'hr-HR'
      const { formatDate } = useFormat()
      const result = formatDate(new Date('2025-02-02'))
      expect(result).toBe('02. 02. 2025.')
    })
  })

  describe('formatDistance', () => {
    it('should format short distances in meters', () => {
      const { formatDistance } = useFormat()
      const result = formatDistance(500)
      expect(result).toBe('500 m')
    })

    it('should format long distances in kilometers', () => {
      const { formatDistance } = useFormat()
      const result = formatDistance(2500)
      expect(result).toBe('2,5 km')
    })

    it('should format distances for en-US locale', () => {
      mocks.currentShop.value.locale = 'en-US'
      const { formatDistance } = useFormat()
      const result = formatDistance(2500)
      expect(result).toBe('2.5 km')
    })

    it('should format distances for de-DE locale', () => {
      mocks.currentShop.value.locale = 'de-DE'
      const { formatDistance } = useFormat()
      const result = formatDistance(2500)
      expect(result).toBe('2,5 km')
    })

    it('should format distances for hr-HR locale', () => {
      mocks.currentShop.value.locale = 'hr-HR'
      const { formatDistance } = useFormat()
      const result = formatDistance(2500)
      expect(result).toBe('2,5 km')
    })

    it('should handle zero distance', () => {
      const { formatDistance } = useFormat()
      const result = formatDistance(0)
      expect(result).toBe('0 m')
    })

    it('should handle very small distances', () => {
      const { formatDistance } = useFormat()
      const result = formatDistance(1)
      expect(result).toBe('1 m')
    })

    it('should handle very large distances', () => {
      const { formatDistance } = useFormat()
      const result = formatDistance(1000000)
      expect(result).toBe('1.000 km')
    })
  })
})
