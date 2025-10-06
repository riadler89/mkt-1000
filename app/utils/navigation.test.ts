import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { createCacheFriendlyTimestamp } from './navigation'

describe('utils / navigation', () => {
  describe('createCacheFriendlyTimestamp', () => {
    beforeEach(() => {
      vi.useFakeTimers()
    })

    afterEach(() => {
      vi.useRealTimers()
    })

    it('returns a valid ISO string format', () => {
      const timestamp = createCacheFriendlyTimestamp()

      expect(timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:00\.000Z$/)
      expect(() => new Date(timestamp)).not.toThrow()
    })

    it('sets seconds and milliseconds to zero for cache consistency', () => {
      // Set a specific time with non-zero seconds and milliseconds
      const testDate = new Date('2024-01-15T14:30:45.123Z')
      vi.setSystemTime(testDate)

      const timestamp = createCacheFriendlyTimestamp()
      const resultDate = new Date(timestamp)

      expect(resultDate.getSeconds()).toBe(0)
      expect(resultDate.getMilliseconds()).toBe(0)
      expect(resultDate.getMinutes()).toBe(testDate.getMinutes())
      expect(resultDate.getHours()).toBe(testDate.getHours())
      expect(resultDate.getDate()).toBe(testDate.getDate())
    })

    it('returns the same timestamp for calls within the same minute', () => {
      const baseTime = new Date('2024-01-15T14:30:00.000Z')
      vi.setSystemTime(baseTime)

      const timestamp1 = createCacheFriendlyTimestamp()

      // Advance time by 30 seconds
      vi.setSystemTime(new Date('2024-01-15T14:30:30.500Z'))
      const timestamp2 = createCacheFriendlyTimestamp()

      // Advance time by 59 seconds total
      vi.setSystemTime(new Date('2024-01-15T14:30:59.999Z'))
      const timestamp3 = createCacheFriendlyTimestamp()

      expect(timestamp1).toBe(timestamp2)
      expect(timestamp2).toBe(timestamp3)
    })

    it('returns different timestamps for calls in different minutes', () => {
      const firstMinute = new Date('2024-01-15T14:30:45.123Z')
      vi.setSystemTime(firstMinute)
      const timestamp1 = createCacheFriendlyTimestamp()

      const secondMinute = new Date('2024-01-15T14:31:15.456Z')
      vi.setSystemTime(secondMinute)
      const timestamp2 = createCacheFriendlyTimestamp()

      expect(timestamp1).not.toBe(timestamp2)
      expect(new Date(timestamp2).getMinutes()).toBe(31)
      expect(new Date(timestamp1).getMinutes()).toBe(30)
    })

    it('handles edge cases at minute boundaries', () => {
      // Test at the very beginning of a minute
      const startOfMinute = new Date('2024-01-15T14:30:00.000Z')
      vi.setSystemTime(startOfMinute)
      const timestamp1 = createCacheFriendlyTimestamp()

      // Test at the very end of a minute
      const endOfMinute = new Date('2024-01-15T14:30:59.999Z')
      vi.setSystemTime(endOfMinute)
      const timestamp2 = createCacheFriendlyTimestamp()

      expect(timestamp1).toBe(timestamp2)
      expect(new Date(timestamp1).getMinutes()).toBe(30)
    })

    it('preserves timezone information in ISO format', () => {
      const testDate = new Date('2024-01-15T14:30:45.123Z')
      vi.setSystemTime(testDate)

      const timestamp = createCacheFriendlyTimestamp()
      const resultDate = new Date(timestamp)

      // Should maintain UTC timezone
      expect(timestamp.endsWith('Z')).toBe(true)
      expect(resultDate.getUTCMinutes()).toBe(30)
      expect(resultDate.getUTCHours()).toBe(14)
    })

    it('works correctly with different dates and times', () => {
      const testCases = [
        '2024-01-01T00:00:30.500Z', // New Year
        '2024-06-15T12:45:15.750Z', // Midday
        '2024-12-31T23:59:45.999Z', // End of year
        '2024-02-29T14:30:30.250Z', // Leap year
      ]

      testCases.forEach((testTime) => {
        vi.setSystemTime(new Date(testTime))
        const timestamp = createCacheFriendlyTimestamp()
        const resultDate = new Date(timestamp)

        expect(resultDate.getSeconds()).toBe(0)
        expect(resultDate.getMilliseconds()).toBe(0)
        expect(timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:00\.000Z$/)
      })
    })
  })
})
