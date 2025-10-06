import type { Page } from '@playwright/test'
import type {
  RpcMethodName,
  RpcMethodParameters,
  RpcMethodReturnType,
  RpcContext,
} from '@scayle/storefront-nuxt'

/**
 * A fixture which allows to call RPC methods directly from a test context in a type-safe manner.
 */
export class RPC {
  private readonly page: Page

  constructor(page: Page) {
    this.page = page
  }

  /**
   * Calls the given RPC with the provided parameters.
   *
   * The `currentShop` will be extracted from the current page that the test is running against.
   * The respective page needs to be fully loaded during a Playwright test run to be able to call an RPC.
   *
   * @param method The name of the RPC method to call.
   * @param params The parameters to pass to the RPC method, whose type is inferred.
   * @returns The result of the RPC call, or `undefined` if the response is not JSON.
   */
  async call<
    N extends RpcMethodName,
    P extends RpcMethodParameters<N>,
    TResult extends Exclude<Awaited<RpcMethodReturnType<N>>, Response>,
  >(method: N, params: P extends RpcContext ? never : P): Promise<TResult> {
    // Extract the shop id from the nuxt state
    const shopId: number = await this.page.evaluate(
      'window.useNuxtApp().$currentShop.shopId',
    )
    const res = await this.page.request.post(`/api/rpc/${method}`, {
      data: {
        payload: params,
      },
      headers: {
        'x-shop-id': shopId.toString(),
      },
      // Increased timeout to accommodate potential CI rendering delays.
      timeout: 5000,
    })

    if (!res.ok()) {
      throw new Error(
        `RPC call "${method}" ended with a non 2xx status code: ${res.status()}`,
      )
    }

    if (res.headers()['content-type'] === 'application/json') {
      return await res.json()
    }

    return undefined as TResult
  }
}
