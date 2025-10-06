import { test as baseTest } from '@playwright/test'
import { HomePage } from '../page-objects/homePage'
import { MainNavigation } from '../page-objects/components/mainNavigation'
import { ProductListingPage } from '../page-objects/productListingPage'
import { ProductDetailPage } from '../page-objects/productDetailPage'
import { Header } from '../page-objects/components/header'
import { BasketPage } from '../page-objects/basketPage'
import { SignInPage } from '../page-objects/signinPage'
import { AccountPage } from '../page-objects/accountPage'
import { ToastMessage } from '../page-objects/components/toastMessage'
import { Breadcrumb } from '../page-objects/components/breadcrumb'
import { Pagination } from '../page-objects/components/pagination'
import { Filters } from '../page-objects/components/filters'
import { Search } from '../page-objects/components/search'
import { MobileNavigation } from '../page-objects/components/mobileNavigation'
import { WishlistPage } from '../page-objects/wishlistPage'
import { Footer } from '../page-objects/components/footer'
import { OrdersPage } from '../page-objects/ordersPage'
import { Promotions } from '../page-objects/components/promotions'
import { CheckoutPage } from '../page-objects/checkoutPage'
import { CountryDetector } from '../page-objects/components/countryDetector'
import { ShopSelector } from '../page-objects/components/shopSelector'
import { StoreLocator } from '../page-objects/components/storeLocator'
import { Sorting } from '../page-objects/components/sorting'
import { RPC } from '../page-objects/components/rpc'
import { FreeProductList } from '../page-objects/components/freeProductList'
import { FreeProductModal } from '../page-objects/components/freeProductModal'
import { OrderSuccessPage } from '../page-objects/orderSuccessPage'
import { SkipLinks } from '../page-objects/components/skipLinks'
import { ErrorPage } from '../page-objects/errorPage'
import { StorefrontAPIClient } from '../support/storefrontAPIClient'
import { Product } from '@scayle/storefront-api'
interface Fixtures {
  rpc: RPC
  homePage: HomePage
  mainNavigation: MainNavigation
  productListingPage: ProductListingPage
  productDetailPage: ProductDetailPage
  header: Header
  basketPage: BasketPage
  signinPage: SignInPage
  accountPage: AccountPage
  toastMessage: ToastMessage
  breadcrumb: Breadcrumb
  pagination: Pagination
  filters: Filters
  search: Search
  mobileNavigation: MobileNavigation
  wishlistPage: WishlistPage
  footer: Footer
  ordersPage: OrdersPage
  promotions: Promotions
  checkoutPage: CheckoutPage
  countryDetector: CountryDetector
  shopSelector: ShopSelector
  storeLocator: StoreLocator
  sorting: Sorting
  freeProductList: FreeProductList
  freeProductModal: FreeProductModal
  orderSuccessPage: OrderSuccessPage
  skipLinks: SkipLinks
  errorPage: ErrorPage
  storefrontAPIClient: StorefrontAPIClient
  shopId: number
  availableSingleVariantProduct: Product
  availableMultiVariantProduct: Product
  availableProductWithSiblings: Product
  availableRegularProduct: Product
}

export type OutputMode = 'json' | 'html' | 'csv'

export const test = baseTest.extend<Fixtures>({
  shopId: [
    async ({ page, baseURL }, use) => {
      if (!baseURL) {
        throw new Error('baseURL is not configured.')
      }
      await page.goto(baseURL, { waitUntil: 'networkidle' })
      const id: number = await page.evaluate(
        'window.useNuxtApp().$currentShop.shopId',
      )
      await use(id)
    },
    { scope: 'test' },
  ],

  storefrontAPIClient: async ({ shopId }, use) => {
    const sapiHost = process.env.NUXT_STOREFRONT_SAPI_HOST
    const sapiToken = process.env.NUXT_STOREFRONT_SAPI_TOKEN

    if (!sapiHost || !sapiToken) {
      throw new Error('Storefront SAPI environment variables are not set.')
    }

    const client = new StorefrontAPIClient(sapiHost, shopId, sapiToken)
    await use(client)
  },

  availableSingleVariantProduct: [
    async ({ storefrontAPIClient }, use) => {
      const product = await storefrontAPIClient.findProduct({
        variantType: 'single',
        mustBeInStock: true,
      })
      await use(product)
    },
    { scope: 'test' },
  ],

  availableMultiVariantProduct: [
    async ({ storefrontAPIClient }, use) => {
      const product = await storefrontAPIClient.findProduct({
        variantType: 'multi',
        mustBeInStock: true,
      })
      await use(product)
    },
    { scope: 'test' },
  ],

  availableProductWithSiblings: [
    async ({ storefrontAPIClient }, use) => {
      const product = await storefrontAPIClient.findProduct({
        mustBeInStock: true,
        mustHaveSiblings: true,
      })
      await use(product)
    },
    { scope: 'test' },
  ],

  availableRegularProduct: [
    async ({ storefrontAPIClient }, use) => {
      const product = await storefrontAPIClient.findProduct({
        variantType: 'multi',
        mustBeInStock: true,
        mustBeRegularPrice: true,
      })
      await use(product)
    },
    { scope: 'test' },
  ],

  rpc: async ({ page }, use) => {
    await use(new RPC(page))
  },
  homePage: async ({ page }, use) => {
    const homePage = new HomePage(page)
    await use(homePage)
  },
  mainNavigation: async ({ page }, use) => {
    const mainNavigation = new MainNavigation(page)
    await use(mainNavigation)
  },
  productListingPage: async ({ page }, use) => {
    const productListingPage = new ProductListingPage(page)
    await use(productListingPage)
  },
  productDetailPage: async ({ page }, use) => {
    const productDetailPage = new ProductDetailPage(page)
    await use(productDetailPage)
  },
  header: async ({ page }, use) => {
    const header = new Header(page)
    await use(header)
  },
  basketPage: async ({ page, rpc }, use) => {
    const basketPage = new BasketPage(page, rpc)
    await use(basketPage)
  },
  signinPage: async ({ page }, use) => {
    const signinPage = new SignInPage(page)
    await use(signinPage)
  },
  accountPage: async ({ page, rpc }, use) => {
    const accountPage = new AccountPage(page, rpc)
    await use(accountPage)
  },
  toastMessage: async ({ page }, use) => {
    const toastMessage = new ToastMessage(page)
    await use(toastMessage)
  },
  breadcrumb: async ({ page }, use) => {
    const breadCrumb = new Breadcrumb(page)
    await use(breadCrumb)
  },
  pagination: async ({ page }, use) => {
    const pagination = new Pagination(page)
    await use(pagination)
  },
  filters: async ({ page }, use) => {
    const filters = new Filters(page)
    await use(filters)
  },
  search: async ({ page }, use) => {
    const search = new Search(page)
    await use(search)
  },
  mobileNavigation: async ({ page }, use) => {
    const mobileNavigation = new MobileNavigation(page)
    await use(mobileNavigation)
  },
  wishlistPage: async ({ page, rpc }, use) => {
    const wishlistPage = new WishlistPage(page, rpc)
    await use(wishlistPage)
  },
  footer: async ({ page }, use) => {
    const footer = new Footer(page)
    await use(footer)
  },
  ordersPage: async ({ page }, use) => {
    const ordersPage = new OrdersPage(page)
    await use(ordersPage)
  },
  promotions: async ({ page }, use) => {
    const promotions = new Promotions(page)
    await use(promotions)
  },
  checkoutPage: async ({ page }, use) => {
    const checkoutPage = new CheckoutPage(page)
    await use(checkoutPage)
  },
  countryDetector: async ({ page }, use) => {
    const countryDetector = new CountryDetector(page)
    await use(countryDetector)
  },
  shopSelector: async ({ page }, use) => {
    const shopSelector = new ShopSelector(page)
    await use(shopSelector)
  },
  storeLocator: async ({ page }, use) => {
    const storeLocator = new StoreLocator(page)
    await use(storeLocator)
  },
  sorting: async ({ page }, use) => {
    const sorting = new Sorting(page)
    await use(sorting)
  },
  freeProductList: async ({ page }, use) => {
    const freeProductList = new FreeProductList(page)
    await use(freeProductList)
  },
  freeProductModal: async ({ page }, use) => {
    const freeProductModal = new FreeProductModal(page)
    await use(freeProductModal)
  },
  orderSuccessPage: async ({ page }, use) => {
    const orderSuccessPage = new OrderSuccessPage(page)
    await use(orderSuccessPage)
  },
  skipLinks: async ({ page }, use) => {
    const skipLinks = new SkipLinks(page)
    await use(skipLinks)
  },
  errorPage: async ({ page }, use) => {
    const errorPage = new ErrorPage(page)
    await use(errorPage)
  },
})
