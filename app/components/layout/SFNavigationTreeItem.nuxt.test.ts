import { describe, expect, it } from 'vitest'
import { renderSuspended } from '@nuxt/test-utils/runtime'
import { fireEvent } from '@testing-library/vue'
import {
  navigationItemCategoryFactory,
  navigationItemExternalFactory,
  navigationItemPageFactory,
} from '@scayle/storefront-nuxt/test/factories'
import SFNavigationTreeItem from './SFNavigationTreeItem.vue'

describe('disabled Link', () => {
  it('should render a <div> tag for disabled link', async () => {
    const { getByText } = await renderSuspended(SFNavigationTreeItem, {
      props: {
        navigationItem: navigationItemExternalFactory.build({
          name: 'Item',
          customData: {
            disabledLink: true,
          },
        }),
      },
    })

    const item = getByText('Item').parentElement
    expect(item?.tagName).toBe('DIV')
    expect(item).toHaveStyle('--textColor: #171717;')
    expect(item).toHaveClass('text-[var(--textColor)]')
    expect(item).not.toHaveClass('hover:bg-[var(--backgroundColor)]')
  })

  it('should have no classes when "raw" is set', async () => {
    const { getByText } = await renderSuspended(SFNavigationTreeItem, {
      props: {
        navigationItem: navigationItemExternalFactory.build({
          name: 'Item',
          customData: {
            disabledLink: true,
          },
        }),
        raw: true,
      },
    })
    const item = getByText('Item').parentElement
    expect(item).toHaveAttribute('class', '')
  })

  it('should apply custom text color', async () => {
    const { getByText } = await renderSuspended(SFNavigationTreeItem, {
      props: {
        navigationItem: navigationItemExternalFactory.build({
          name: 'Item',
          customData: {
            disabledLink: true,
            linkColor: '#1A1A1B',
          },
        }),
      },
    })

    const item = getByText('Item').parentElement
    expect(item).toHaveStyle('--textColor: #1A1A1B;')
    expect(item).toHaveClass('text-[var(--textColor)]')
    expect(item).not.toHaveClass('hover:bg-[var(--backgroundColor)]')
  })

  it('should not emit `mouseenterNavigationItem` event', async () => {
    const { getByText, emitted } = await renderSuspended(SFNavigationTreeItem, {
      props: {
        navigationItem: navigationItemExternalFactory.build({
          name: 'Item',
          customData: {
            disabledLink: true,
          },
        }),
      },
    })
    await fireEvent.mouseEnter(getByText('Item'))
    expect(emitted()).not.toHaveProperty('mouseenterNavigationItem')
  })
})

describe('active Link', () => {
  it('should render a <a> tag for active links', async () => {
    const { getByRole } = await renderSuspended(SFNavigationTreeItem, {
      props: {
        navigationItem: navigationItemExternalFactory.build({
          name: 'Item',
        }),
      },
    })

    const item = getByRole('link', { name: 'Item' })
    expect(item.tagName).toBe('A')
    expect(item).toHaveStyle('--backgroundColor: #F2F2F2;')
    expect(item).toHaveStyle('--textColor: #666666;')
    expect(item).toHaveClass('text-[var(--textColor)]')
    expect(item).toHaveClass('supports-hover:hover:bg-[var(--backgroundColor)]')
  })

  it('should open category navigation items in same tab', async () => {
    const { getByRole } = await renderSuspended(SFNavigationTreeItem, {
      props: {
        navigationItem: navigationItemCategoryFactory.build({
          name: 'Item',
        }),
      },
    })
    const item = getByRole('link', { name: 'Item' })
    expect(item.tagName).toBe('A')
    // Nuxt does not add a target attribute when its set to `_self` and an internal link
    // https://github.com/nuxt/nuxt/blob/169fbd2a7857c561cc81a7ac611a2e95b4303d34/packages/nuxt/src/app/components/nuxt-link.ts#L139
    // and https://github.com/nuxt/nuxt/blob/169fbd2a7857c561cc81a7ac611a2e95b4303d34/packages/nuxt/src/app/components/nuxt-link.ts#L334
    expect(item).not.toHaveAttribute('target')
  })

  it('should open page navigation items in new tab', async () => {
    const { getByRole } = await renderSuspended(SFNavigationTreeItem, {
      props: {
        navigationItem: navigationItemPageFactory.build({
          name: 'Item',
        }),
      },
    })
    const item = getByRole('link', { name: 'Item' })
    expect(item.tagName).toBe('A')
    expect(item).toHaveAttribute('target', '_blank')
  })

  it('should open individual link navigation items in new tab when they have `isOpenInNewWindow` set to true', async () => {
    const { getByRole } = await renderSuspended(SFNavigationTreeItem, {
      props: {
        navigationItem: navigationItemExternalFactory.build({
          name: 'Item',
          options: {
            isOpenInNewWindow: true,
          },
        }),
      },
    })
    const item = getByRole('link', { name: 'Item' })
    expect(item.tagName).toBe('A')
    expect(item).toHaveAttribute('target', '_blank')
  })

  it('should open individual link navigation items in same tab when they have `isOpenInNewWindow` set to false', async () => {
    const { getByRole } = await renderSuspended(SFNavigationTreeItem, {
      props: {
        navigationItem: navigationItemExternalFactory.build({
          name: 'Item',
          options: {
            isOpenInNewWindow: false,
          },
        }),
      },
    })
    const item = getByRole('link', { name: 'Item' })
    expect(item.tagName).toBe('A')
    // Nuxt does not add a target attribute when its set to `_self` and an internal link
    // https://github.com/nuxt/nuxt/blob/169fbd2a7857c561cc81a7ac611a2e95b4303d34/packages/nuxt/src/app/components/nuxt-link.ts#L139
    // and https://github.com/nuxt/nuxt/blob/169fbd2a7857c561cc81a7ac611a2e95b4303d34/packages/nuxt/src/app/components/nuxt-link.ts#L334
    expect(item).toHaveAttribute('target', '_self')
  })

  it('should open individual link navigation items in same tab when `isOpenInNewWindow` is not set', async () => {
    const { getByRole } = await renderSuspended(SFNavigationTreeItem, {
      props: {
        navigationItem: navigationItemExternalFactory.build({
          name: 'Item',
          options: {
            isOpenInNewWindow: undefined,
          },
        }),
      },
    })
    const item = getByRole('link', { name: 'Item' })
    expect(item.tagName).toBe('A')
    // Nuxt does not add a target attribute when its set to `_self` and an internal link
    // https://github.com/nuxt/nuxt/blob/169fbd2a7857c561cc81a7ac611a2e95b4303d34/packages/nuxt/src/app/components/nuxt-link.ts#L139
    // and https://github.com/nuxt/nuxt/blob/169fbd2a7857c561cc81a7ac611a2e95b4303d34/packages/nuxt/src/app/components/nuxt-link.ts#L334
    expect(item).toHaveAttribute('target', '_self')
  })

  it('should apply custom colors', async () => {
    const { getByRole } = await renderSuspended(SFNavigationTreeItem, {
      props: {
        navigationItem: navigationItemExternalFactory.build({
          name: 'Item',
          customData: {
            linkColor: '#1A1A1B',
          },
        }),
      },
    })

    const item = getByRole('link', { name: 'Item' })
    expect(item).toHaveStyle('--textColor: #1A1A1B;')
    expect(item).toHaveStyle('--backgroundColor: #1A1A1B1A;')
    expect(item).toHaveClass('text-[var(--textColor)]')
    expect(item).toHaveClass('supports-hover:hover:bg-[var(--backgroundColor)]')
  })

  it('should have no classes when "raw" is set', async () => {
    const { getByRole } = await renderSuspended(SFNavigationTreeItem, {
      props: {
        navigationItem: navigationItemExternalFactory.build({
          name: 'Item',
        }),
        raw: true,
      },
    })

    const item = getByRole('link', { name: 'Item' })
    expect(item).toHaveAttribute('class', '')
  })

  it('should emit `mouseenterNavigationItem` event', async () => {
    const { getByRole, emitted } = await renderSuspended(SFNavigationTreeItem, {
      props: {
        navigationItem: navigationItemExternalFactory.build({
          name: 'Item',
        }),
      },
    })
    await fireEvent.mouseEnter(getByRole('link', { name: 'Item' }))
    expect(emitted()['mouseenterNavigationItem']).toHaveLength(1)
  })
})
