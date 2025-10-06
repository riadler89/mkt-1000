import { expect, it, vi } from 'vitest'
import { render } from '@testing-library/vue'
import { ref, type Ref } from 'vue'
import SFAsyncDataWrapper from './SFAsyncDataWrapper.vue'
import type { AsyncDataRequestStatus, AsyncData } from '#app'

const createAsyncData = <T>(
  status: AsyncDataRequestStatus,
  data: T,
): Awaited<AsyncData<T, unknown>> => {
  return {
    status: ref<AsyncDataRequestStatus>(status),
    data: ref(data) as unknown as Ref<T, T>,
    pending: ref(false),
    refresh: () => Promise.resolve(),
    execute: () => Promise.resolve(),
    clear: () => {},
    error: ref(null),
  }
}

it('should render the default slot with data when status is "success" and data exists', async () => {
  const { getByText, queryByText } = render(SFAsyncDataWrapper, {
    slots: {
      default: '<div>default</div>',
      loading: '<div>loading</div>',
      error: '<div>error</div>',
    },
    props: {
      asyncData: createAsyncData<{ test: string }>('success', { test: 'data' }),
    },
  })
  expect(getByText('default')).toBeInTheDocument()
  expect(queryByText('loading')).not.toBeInTheDocument()
  expect(queryByText('error')).not.toBeInTheDocument()
})

it('should pass data to default slot', async () => {
  type TestData = { value: string } | null
  const defaultSlot = vi.fn()

  render(SFAsyncDataWrapper, {
    slots: {
      default: defaultSlot,
      loading: '<div>loading</div>',
      error: '<div>error</div>',
    },
    props: {
      asyncData: createAsyncData<TestData>('success', { value: 'test' }),
    },
  })

  // key is automatically passed as a slot prop by vue
  expect(defaultSlot).toHaveBeenCalledWith({ data: { value: 'test' }, key: 0 })
})

it('should render the default slot with data when status is "pending" and data exists', async () => {
  const { getByText, queryByText } = render(SFAsyncDataWrapper, {
    slots: {
      default: '<div>default</div>',
      loading: '<div>loading</div>',
      error: '<div>error</div>',
    },
    props: {
      asyncData: createAsyncData<{ test: string }>('pending', { test: 'data' }),
    },
  })
  expect(getByText('default')).toBeInTheDocument()
  expect(queryByText('loading')).not.toBeInTheDocument()
  expect(queryByText('error')).not.toBeInTheDocument()
})

it('should render the default slot with data when status is "idle" and data exists', async () => {
  const { getByText, queryByText } = render(SFAsyncDataWrapper, {
    slots: {
      default: '<div>default</div>',
      loading: '<div>loading</div>',
      error: '<div>error</div>',
    },
    props: {
      asyncData: createAsyncData<{ test: string }>('idle', { test: 'data' }),
    },
  })
  expect(getByText('default')).toBeInTheDocument()
  expect(queryByText('loading')).not.toBeInTheDocument()
  expect(queryByText('error')).not.toBeInTheDocument()
})

it('should render the loading slot while status is "pending" and no data exists', async () => {
  const { getByText, queryByText } = render(SFAsyncDataWrapper, {
    slots: {
      default: '<div>default</div>',
      loading: '<div>loading</div>',
      error: '<div>error</div>',
    },
    props: {
      asyncData: createAsyncData<unknown>('pending', null),
    },
  })
  expect(getByText('loading')).toBeInTheDocument()
  expect(queryByText('default')).not.toBeInTheDocument()
  expect(queryByText('error')).not.toBeInTheDocument()
})

it('should render the loading slot while status is "idle" and no data exists', async () => {
  const { getByText, queryByText } = render(SFAsyncDataWrapper, {
    slots: {
      default: '<div>default</div>',
      loading: '<div>loading</div>',
      error: '<div>error</div>',
    },
    props: {
      asyncData: createAsyncData<unknown>('idle', null),
    },
  })
  expect(getByText('loading')).toBeInTheDocument()
  expect(queryByText('default')).not.toBeInTheDocument()
  expect(queryByText('error')).not.toBeInTheDocument()
})

it('should render the loading slot while status is "error" and no error slot was passed', async () => {
  const { getByText, queryByText } = render(SFAsyncDataWrapper, {
    slots: {
      default: '<div>default</div>',
      loading: '<div>loading</div>',
    },
    props: {
      asyncData: createAsyncData<unknown>('error', null),
    },
  })
  expect(getByText('loading')).toBeInTheDocument()
  expect(queryByText('default')).not.toBeInTheDocument()
  expect(queryByText('error')).not.toBeInTheDocument()
})

it('should render the error slot while status is "error"', async () => {
  const { getByText, queryByText } = render(SFAsyncDataWrapper, {
    slots: {
      default: '<div>default</div>',
      loading: '<div>loading</div>',
      error: '<div>error</div>',
    },
    props: {
      asyncData: createAsyncData<unknown>('error', null),
    },
  })
  expect(getByText('error')).toBeInTheDocument()
  expect(queryByText('default')).not.toBeInTheDocument()
  expect(queryByText('loading')).not.toBeInTheDocument()
})
