import { describe, expect, it } from 'vitest'
import { basketItemFactory } from '@scayle/storefront-nuxt/test/factories'
import useSubscriptionAttributes from './useSubscriptionAttributes'

describe('useSubscriptionAttributes', () => {
  describe('hasSubscriptionData', () => {
    it('hasSubscriptionData should be true when subscription data present', () => {
      const basketItem = basketItemFactory.build({
        customData: {
          subscriptionDefinition: {},
        },
      })
      const { hasSubscriptionData } = useSubscriptionAttributes(basketItem)
      expect(hasSubscriptionData.value).toBe(true)
    })
    it('hasSubscriptionData should be false when subscription data present', () => {
      const basketItem = basketItemFactory.build({
        customData: {},
      })
      const { hasSubscriptionData } = useSubscriptionAttributes(basketItem)
      expect(hasSubscriptionData.value).toBe(false)
    })
  })
  describe('subscriptionAttributes', () => {
    it('should return the subscription interval attribute', () => {
      const basketItem = basketItemFactory.build({
        customData: {
          subscriptionDefinition: {
            subscriptionInterval: '3_months',
          },
        },
        variant: {
          attributes: {
            subscriptionAvailableIntervals: {
              id: 7658,
              key: 'subscriptionAvailableIntervals',
              label: 'Abonnement Interval',
              type: '',
              multiSelect: true,
              values: [
                {
                  id: 2648,
                  label: '3 Months',
                  value: '3_months',
                },
                {
                  id: 2649,
                  label: '2 Months',
                  value: '2_months',
                },
              ],
            },
          },
        },
      })
      const { subscriptionAttributes } = useSubscriptionAttributes(basketItem)
      expect(subscriptionAttributes.value).toStrictEqual([
        {
          label: 'Intervall',
          value: '3 Months',
        },
      ])
    })
    it('should not return the subscription interval attribute when custom data is missing', () => {
      const basketItem = basketItemFactory.build({
        customData: {
          subscriptionDefinition: {},
        },
        variant: {
          attributes: {
            subscriptionAvailableIntervals: {
              id: 7658,
              key: 'subscriptionAvailableIntervals',
              label: 'Abonnement Interval',
              type: '',
              multiSelect: true,
              values: [
                {
                  id: 2648,
                  label: '3 Months',
                  value: '3_months',
                },
                {
                  id: 2649,
                  label: '2 Months',
                  value: '2_months',
                },
              ],
            },
          },
        },
      })
      const { subscriptionAttributes } = useSubscriptionAttributes(basketItem)
      expect(subscriptionAttributes.value).toStrictEqual([])
    })

    it('should return the subscription delivery date attribute', () => {
      const basketItem = basketItemFactory.build({
        customData: {
          subscriptionDefinition: {
            subscriptionDeliveryDate: '15',
          },
        },
      })
      const { subscriptionAttributes } = useSubscriptionAttributes(basketItem)
      expect(subscriptionAttributes.value).toStrictEqual([
        {
          label: 'Folgelieferung',
          value: 'Jeden 15. des Monats',
        },
      ])
    })

    it('should not return the subscription delivery date attribute when custom data is missing', () => {
      const basketItem = basketItemFactory.build({
        customData: {
          subscriptionDefinition: {},
        },
      })
      const { subscriptionAttributes } = useSubscriptionAttributes(basketItem)
      expect(subscriptionAttributes.value).toStrictEqual([])
    })
  })
})
