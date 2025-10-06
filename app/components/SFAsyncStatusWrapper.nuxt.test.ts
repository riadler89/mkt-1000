import { expect, it } from 'vitest'
import { render } from '@testing-library/vue'
import SFAsyncStatusWrapper from './SFAsyncStatusWrapper.vue'

it('should render the default slot while status is "success"', async () => {
  const { getByText, queryByText } = render(SFAsyncStatusWrapper, {
    slots: {
      default: '<div>default</div>',
      loading: '<div>loading</div>',
      error: '<div>error</div>',
    },
    props: {
      status: 'success',
    },
  })
  expect(getByText('default')).toBeInTheDocument()
  expect(queryByText('loading')).not.toBeInTheDocument()
  expect(queryByText('error')).not.toBeInTheDocument()
})

it('should render the loading slot while status is "pending"', async () => {
  const { getByText, queryByText } = render(SFAsyncStatusWrapper, {
    slots: {
      default: '<div>default</div>',
      loading: '<div>loading</div>',
      error: '<div>error</div>',
    },
    props: {
      status: 'pending',
    },
  })
  expect(getByText('loading')).toBeInTheDocument()
  expect(queryByText('default')).not.toBeInTheDocument()
  expect(queryByText('error')).not.toBeInTheDocument()
})

it('should render the loading slot while status is "idle"', async () => {
  const { getByText, queryByText } = render(SFAsyncStatusWrapper, {
    slots: {
      default: '<div>default</div>',
      loading: '<div>loading</div>',
      error: '<div>error</div>',
    },
    props: {
      status: 'idle',
    },
  })
  expect(getByText('loading')).toBeInTheDocument()
  expect(queryByText('default')).not.toBeInTheDocument()
  expect(queryByText('error')).not.toBeInTheDocument()
})
it('should render the loading slot while status is "error" and no error slot was passed', async () => {
  const { getByText, queryByText } = render(SFAsyncStatusWrapper, {
    slots: {
      default: '<div>default</div>',
      loading: '<div>loading</div>',
    },
    props: {
      status: 'error',
    },
  })
  expect(getByText('loading')).toBeInTheDocument()
  expect(queryByText('default')).not.toBeInTheDocument()
  expect(queryByText('error')).not.toBeInTheDocument()
})

it('should render the error slot while status is "error"', async () => {
  const { getByText, queryByText } = render(SFAsyncStatusWrapper, {
    slots: {
      default: '<div>default</div>',
      loading: '<div>loading</div>',
      error: '<div>error</div>',
    },
    props: {
      status: 'error',
    },
  })
  expect(getByText('error')).toBeInTheDocument()
  expect(queryByText('default')).not.toBeInTheDocument()
  expect(queryByText('loading')).not.toBeInTheDocument()
})
