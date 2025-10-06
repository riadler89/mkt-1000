import type {
  BasketItem,
  Price,
  Product,
  ShopUser,
  Variant,
  WishlistItem,
} from '@scayle/storefront-nuxt'

export type EcommerceTrackingEvent =
  | 'view_item'
  | 'view_item_list'
  | 'view_promotion'
  | 'view_campaign'
  | 'add_to_wishlist'
  | 'remove_from_wishlist'
  | 'view_cart'
  | 'add_to_cart'
  | 'remove_from_cart'
  | 'select_item'
  | 'select_promotion'
  | 'select_campaign'

export type BasicTrackingEvent =
  | 'shop_init'
  | 'shop_change'
  | 'customer_data'
  | 'content_view'

export type CheckoutTrackingEvent = 'begin_checkout' | 'finish_checkout'

export type AdditionalTrackingEvent =
  | 'cart'
  | 'wishlist'
  | 'search'
  | 'filter_flyout'
  | 'filter_slider'
  | 'feature'

export type AuthTrackingEvent =
  | 'login'
  | 'logout'
  | 'sign_up'
  | 'forgot_password'
  | 'reset_password'
  | 'guest_login'

export type TrackingEvent =
  | EcommerceTrackingEvent
  | BasicTrackingEvent
  | AdditionalTrackingEvent
  | CheckoutTrackingEvent
  | AuthTrackingEvent

export type PageType =
  | 'homepage'
  | 'access'
  | 'checkout'
  | 'checkout:#/shipping'
  | 'checkout:#/payment'
  | 'checkout:#/auth'
  | 'search result page'
  | 'service_pages'
  | 'content_pages'
  | 'browse'
  | 'navigation'
  | 'discovery'
  | 'category'
  | 'category_overview'
  | 'pdp'
  | 'basket'
  | 'wishlist'
  | 'brand'
  | 'brand_overview'
  | 'story'
  | 'story_overview'
  | 'outfit'
  | 'outfit_overview'
  | 'account_area'
  | 'account_area:OId'
  | 'account_area:userIndex'
  | 'osp'
  | 'help'
  | 'offCanvas'
  | 'other'
  | string

export interface BasicViewData {
  content_name: string
  page_type: PageType
  page_type_id: string
}

export interface TrackingCategory {
  name: string
  id: string
}

export interface ListItem {
  name: string
  id: string
  index?: number
}

export interface ProductListData {
  product: Product
  category?: TrackingCategory
  list?: ListItem
  quantity?: number
  pagePayload?: BasicViewData
}

export interface ProductViewData extends ProductListData {
  destination: string
  destinationUrl: string
  source: string
  position?: number
  pagePayload?: BasicViewData
}

export interface MultipleActionData {
  currencyCode?: string
  valueWithoutTax?: number
  items: ProductListData[]
  pagePayload?: BasicViewData
}

export interface ProductActionData {
  product?: Product & { index?: number }
  products?: Product[]
  variant?: Variant
  category?: TrackingCategory
  quantity?: number
  list?: ListItem
  currencyCode: string
  index?: number
  pagePayload?: BasicViewData
}

export interface ProductInfo {
  item_id: string
  item_name: string
  price?: number
  sale_discount?: number
  campaign_discount?: number
  original_price?: number
  item_brand: string
  item_brand_id: string
  item_size: string
  tax?: number
}

export interface AdditionalInfo {
  item_category: string
  item_category_id: string
  item_variant: string
  quantity?: string
  item_list_name: string
  item_list_id: string
  index?: number | null
}

export interface ViewInfo extends AdditionalInfo {
  source: string
  destination: string
  destination_url: string
  sold_out?: boolean
  bi_price: string
}

export interface ShopData {
  shop_id: string | number
  shop_gender: string
  locale: string
  shop_currency: string
}

export interface FilterData {
  action: string
  label: string
  sortType?: string
}

export interface BasketData {
  items: BasketItem[]
  total_campaign_reduction_with_tax: number
  total_sale_reduction_with_tax: number
  total_with_tax: number
  total_without_tax: number
}
export interface WishlistData {
  items: WishlistItem[]
  total_campaign_reduction_with_tax: number
  total_sale_reduction_with_tax: number
  total_with_tax: number
  total_without_tax: number
}

export interface PromotionItem {
  item_id: string
  item_name: string
  promotion_id: string
  promotion_name: string
  creative_name: string
  creative_slot: string
  location_id: string
  index: number
}

export interface PromotionData {
  items: PromotionItem[]
}

export interface ShopInitData extends ShopData {
  landing_page: string
  shop_version: string
  parameter: string
  referrer: string
  deeplink: string
  origin: string
}

export interface FeatureData {
  name: 'error'
  action: 'impression'
  label: string
  content_name: string
}

export interface PageViewData extends BasicViewData {
  title: string
  click_origin?: string
}

export type SearchAction =
  | 'history_term'
  | 'suggested_product'
  | 'suggested_category'
  | 'suggested_page'
  | 'search_button'
  | 'search_hotkey'
  | 'search_term'

export interface SearchData {
  search_term: string
  search_term_completed: string
  search_action: SearchAction
  search_destination: string
}

export type AuthenticationType =
  | 'none'
  | 'email'
  | 'facebook'
  | 'apple'
  | 'password'

export type CustomerType = 'guest' | 'new' | 'existing'

export type StatusType = 'successful' | 'error'

export type EventType = 'login' | 'login_modal' | 'sign_up'

export interface CustomerData {
  customer_id?: number
  customer_type?: CustomerType
  login_method?: string
  login?: boolean
  method?: AuthenticationType
  bi_vp?: boolean
  bi_sc?: number
  status?: StatusType
  eh: string
  pagePayload?: BasicViewData
}

export interface CustomerInfo {
  customer_id?: number
  customer_type: CustomerType
  method?: AuthenticationType
  login_method?: string
  status?: StatusType
  eh: string
  pagePayload?: BasicViewData
}

export interface CustomerLogoutData {
  customer_id?: number
  eh?: string
  pagePayload?: BasicViewData
}

export type TrackingPayload =
  | ProductActionData
  | MultipleActionData
  | ProductViewData
  | ProductListData
  | ShopData
  | ShopInitData
  | PageViewData
  | CustomerData
  | CustomerInfo
  | CustomerLogoutData
  | SearchData
  | FilterData
  | BasketData
  | WishlistData
  | PromotionData
  | FeatureData

export interface AdditionalItem extends AdditionalInfo {
  item_id: string
  item_name: string
  price: number
  sale_discount: number
  campaign_discount: number
  original_price: number
  item_brand: string
  item_brand_id: string
  quantity: string
}

export type TrackAddToBasketParams = {
  products?: Product[]
  product?: Product
  quantity?: number
  variant?: Variant
  index?: number
  list?: ListItem
}

export type TrackRemoveFromBasketParams = {
  products?: Product[]
  product?: Product
  quantity?: number
  variant?: Variant
  index?: number
}

export type TrackCustomerDataParams = {
  user?: ShopUser
  customerType: CustomerType
  isLoggedIn: boolean
  biVp?: boolean
  biSc?: number
}

export type TrackViewItemListEventParams = {
  items: (Product & { index: number })[]
  listingMetaData: ListItem
  productIndex?: number
  paginationOffset?: number
  source?: string
  category?: { name: string; id: string }
  positionOffset?: number
}

export type TrackSelectItemEventParams = {
  product: Product
  category?: { name?: string; id?: number | string }
  variant?: Variant
  listingMetaData?: ListItem
  index?: number
  source?: string
  position?: number
  quantity?: number
  soldOut?: boolean
  pagePayload: BasicViewData
}

export type TrackViewItemParams = {
  product: Product
  quantity?: number
  variant?: Variant
}

export type TrackSearchEventParams = {
  searchTerm: string
  suggestion?: string
  searchAction: SearchAction
  searchDestination?: string
  pagePayload?: BasicViewData
}

export type TrackContentViewEventParams = {
  contentName: string
  title: string
  pageType: PageType
  pageTypeId: string
  clickOrigin: string
}

export type TrackAddToWishListParams = {
  product: Product
  quantity?: number
  listingMetaData?: ListItem
  category?: { id?: number; name?: string }
  variant?: Variant
  index?: number
  pagePayload: BasicViewData
}

// eslint-disable-next-line sonarjs/redundant-type-aliases
export type TrackRemoveFromWishListParams = TrackAddToWishListParams

export type OrderItemVariant = {
  id: number
}
export type OrderItemProduct = {
  name: string
  variant: OrderItemVariant
  price: Price
}
