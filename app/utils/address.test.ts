import { describe, expect, it } from 'vitest'
import { Factory } from 'fishery'
import { getFormattedLocaleAddresses } from './address'
import type { OrderAddress } from '~~/types/order'

const orderAddressFactory = Factory.define<OrderAddress>(() => ({
  city: 'Weiden',
  countryCode: 'DE',
  createdAt: '2024-04-16T11:52:23+02:00',
  houseNumber: '1',
  id: 48,
  isBillingAddress: true,
  isDefault: {
    billing: false,
    shipping: false,
  },
  isShippingAddress: false,
  recipient: {
    firstName: 'Joe',
    lastName: 'Smith',
    type: 'personal',
  },
  street: 'Bahnhofstraße',
  updatedAt: '2024-04-16T11:52:23+02:00',
  zipCode: '92637',
}))

describe('getFormattedLocaleAddresses', () => {
  describe('US address formatting', () => {
    it('should format US address with state correctly', () => {
      const address = orderAddressFactory.build({
        city: 'Geneva',
        countryCode: 'USA',
        houseNumber: '31',
        street: 'State Rte',
        state: 'IL',
        zipCode: '60134',
        recipient: {
          firstName: 'FirstName',
          gender: 'm',
          lastName: 'LastName',
          type: 'personal',
        },
      })
      const formattedUsAddress = getFormattedLocaleAddresses(address)

      expect(formattedUsAddress).toEqual([
        'FirstName LastName',
        '31 State Rte',
        'Geneva, IL 60134',
      ])
    })

    it('should format US address without state correctly', () => {
      const address = orderAddressFactory.build({
        city: 'New York',
        countryCode: 'USA',
        houseNumber: '123',
        street: 'Broadway',
        zipCode: '10001',
        recipient: {
          firstName: 'John',
          lastName: 'Doe',
          type: 'personal',
        },
      })
      const formattedUsAddress = getFormattedLocaleAddresses(address)

      expect(formattedUsAddress).toEqual([
        'John Doe',
        '123 Broadway',
        'New York, undefined 10001',
      ])
    })
  })

  describe('UK address formatting', () => {
    it('should format UK address correctly', () => {
      const address = orderAddressFactory.build({
        city: 'London',
        countryCode: 'GBR',
        houseNumber: '12',
        street: 'Test street',
        zipCode: '12345',
        recipient: {
          firstName: 'FirstName',
          gender: 'm',
          lastName: 'LastName',
          type: 'personal',
        },
      })
      const formattedUkAddress = getFormattedLocaleAddresses(address)

      expect(formattedUkAddress).toEqual([
        'FirstName LastName',
        '12 Test street',
        'London 12345',
      ])
    })
  })

  describe('Other countries address formatting', () => {
    it('should format German address correctly', () => {
      const address = orderAddressFactory.build({
        city: 'Hamburg',
        countryCode: 'DEU',
        houseNumber: '12',
        street: 'Test Strasse',
        zipCode: '54321',
        recipient: {
          firstName: 'FirstName',
          gender: 'm',
          lastName: 'LastName',
          type: 'personal',
        },
      })
      const formattedOtherAddress = getFormattedLocaleAddresses(address)

      expect(formattedOtherAddress).toEqual([
        'FirstName LastName',
        'Test Strasse 12',
        '54321 Hamburg',
      ])
    })

    it('should format French address correctly', () => {
      const address = orderAddressFactory.build({
        city: 'Paris',
        countryCode: 'FRA',
        houseNumber: '42',
        street: 'Rue de la Paix',
        zipCode: '75001',
        recipient: {
          firstName: 'Marie',
          lastName: 'Dubois',
          type: 'personal',
        },
      })
      const formattedAddress = getFormattedLocaleAddresses(address)

      expect(formattedAddress).toEqual([
        'Marie Dubois',
        'Rue de la Paix 42',
        '75001 Paris',
      ])
    })
  })

  describe('Additional address information', () => {
    it('should include additional information when provided', () => {
      const address = orderAddressFactory.build({
        city: 'Hamburg',
        countryCode: 'DEU',
        houseNumber: '12',
        street: 'Test Strasse',
        zipCode: '54321',
        additional: 'Apartment 3B, Ring doorbell',
        recipient: {
          firstName: 'FirstName',
          gender: 'm',
          lastName: 'LastName',
          type: 'personal',
        },
      })
      const formattedAddress = getFormattedLocaleAddresses(address)

      expect(formattedAddress).toEqual([
        'FirstName LastName',
        'Test Strasse 12',
        '54321 Hamburg',
        'Apartment 3B, Ring doorbell',
      ])
    })

    it('should not include additional information when not provided', () => {
      const address = orderAddressFactory.build({
        city: 'Hamburg',
        countryCode: 'DEU',
        houseNumber: '12',
        street: 'Test Strasse',
        zipCode: '54321',
        recipient: {
          firstName: 'FirstName',
          gender: 'm',
          lastName: 'LastName',
          type: 'personal',
        },
      })
      const formattedAddress = getFormattedLocaleAddresses(address)

      expect(formattedAddress).toEqual([
        'FirstName LastName',
        'Test Strasse 12',
        '54321 Hamburg',
      ])
    })
  })

  describe('Recipient types and edge cases', () => {
    it('should handle company/organization recipient type', () => {
      const address = orderAddressFactory.build({
        city: 'Berlin',
        countryCode: 'DEU',
        houseNumber: '100',
        street: 'Unter den Linden',
        zipCode: '10117',
        recipient: {
          firstName: 'Tech',
          lastName: 'Corp GmbH',
          type: 'organization',
        },
      })
      const formattedAddress = getFormattedLocaleAddresses(address)

      expect(formattedAddress).toEqual([
        'Tech Corp GmbH',
        'Unter den Linden 100',
        '10117 Berlin',
      ])
    })

    it('should handle recipient with only last name', () => {
      const address = orderAddressFactory.build({
        city: 'Munich',
        countryCode: 'DEU',
        houseNumber: '5',
        street: 'Marienplatz',
        zipCode: '80331',
        recipient: {
          firstName: undefined,
          lastName: 'Schmidt',
          type: 'personal',
        },
      })
      const formattedAddress = getFormattedLocaleAddresses(address)

      expect(formattedAddress).toEqual([
        'undefined Schmidt',
        'Marienplatz 5',
        '80331 Munich',
      ])
    })

    it('should handle recipient with empty first name', () => {
      const address = orderAddressFactory.build({
        city: 'Cologne',
        countryCode: 'DEU',
        houseNumber: '8',
        street: 'Domplatz',
        zipCode: '50667',
        recipient: {
          firstName: '',
          lastName: 'Müller',
          type: 'personal',
        },
      })
      const formattedAddress = getFormattedLocaleAddresses(address)

      expect(formattedAddress).toEqual([
        ' Müller',
        'Domplatz 8',
        '50667 Cologne',
      ])
    })
  })

  describe('Special characters and edge cases', () => {
    it('should handle addresses with special characters', () => {
      const address = orderAddressFactory.build({
        city: 'München',
        countryCode: 'DEU',
        houseNumber: '1a',
        street: 'Straße des 17. Juni',
        zipCode: '10623',
        recipient: {
          firstName: 'Jörg',
          lastName: 'Müller-Schmidt',
          type: 'personal',
        },
      })
      const formattedAddress = getFormattedLocaleAddresses(address)

      expect(formattedAddress).toEqual([
        'Jörg Müller-Schmidt',
        'Straße des 17. Juni 1a',
        '10623 München',
      ])
    })

    it('should handle addresses with very long street names', () => {
      const address = orderAddressFactory.build({
        city: 'Hamburg',
        countryCode: 'DEU',
        houseNumber: '123',
        street: 'Very Long Street Name That Might Cause Issues With Display',
        zipCode: '20095',
        recipient: {
          firstName: 'Anna',
          lastName: 'Weber',
          type: 'personal',
        },
      })
      const formattedAddress = getFormattedLocaleAddresses(address)

      expect(formattedAddress).toEqual([
        'Anna Weber',
        'Very Long Street Name That Might Cause Issues With Display 123',
        '20095 Hamburg',
      ])
    })
  })
})
