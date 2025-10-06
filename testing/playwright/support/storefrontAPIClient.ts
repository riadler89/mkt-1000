import {
  StorefrontAPIClient as SapiClient,
  type ProductsSearchEndpointResponseData,
  type Product,
} from '@scayle/storefront-api'

export class StorefrontAPIClient {
  private readonly client: SapiClient

  /**
   * Creates a new StorefrontAPIClient instance for testing purposes.
   *
   * This constructor initializes the underlying SAPI client with the provided
   * configuration for connecting to a specific shop's API.
   *
   * @param {string} host - The API host URL (e.g., 'https://api.scayle.com')
   * @param {number} shopId - The unique identifier for the shop
   * @param {string} token - The authentication token for API access
   *
   * @example
   * const client = new StorefrontAPIClient(
   *   'https://api.scayle.com',
   *   12345,
   *   'your-api-token'
   * )
   */
  constructor(host: string, shopId: number, token: string) {
    this.client = new SapiClient({
      host: host,
      shopId: shopId,
      auth: {
        type: 'token',
        token: token,
      },
    })
  }

  /**
   * Finds the first product that matches a given set of criteria.
   * It searches through pages of products until a match is found.
   *
   * @param {object} options - The criteria for the product search.
   * @param {'single' | 'multi'} options.variantType - The required variant type.
   * @param {boolean} options.mustBeInStock - Whether the product must have at least one variant with stock > 0.
   * @param {boolean} options.mustHaveSiblings - Whether the product must have more than 1 sibling.
   * @returns {Promise<Product>} A single product that matches the criteria.
   * @throws {Error} If no matching product is found within the search limit.
   */
  async findProduct(options: {
    variantType?: 'single' | 'multi'
    mustBeInStock?: boolean
    mustHaveSiblings?: boolean
    mustBeRegularPrice?: boolean
  }): Promise<Product> {
    const MAX_PAGES_TO_CHECK = 10
    const PRODUCTS_PER_PAGE = 25

    for (let page = 1; page <= MAX_PAGES_TO_CHECK; page++) {
      console.log(
        `Searching for a product on page ${page}... Criteria: ${JSON.stringify(options)}`,
      )

      const response: ProductsSearchEndpointResponseData =
        await this.client.products.query({
          with: { variants: 'all', siblings: 'all' },
          pagination: { page, perPage: PRODUCTS_PER_PAGE },
        })

      const currentBatch = response.entities
      if (!currentBatch || currentBatch.length === 0) {
        break
      }

      const product = currentBatch.find((p) => this._isProductMatch(p, options))

      if (product) {
        console.log(`[SUCCESS] Found matching product with ID: ${product.id}`)
        return product
      }
    }

    throw new Error(
      `Could not find a product matching the criteria: ${JSON.stringify(options)}`,
    )
  }

  /**
   * Determines if a product matches the specified search criteria.
   *
   * This private method evaluates a product against multiple predicate functions
   * to determine if it meets all the required conditions for the search.
   *
   * @param {Product} product - The product to evaluate against the criteria
   * @param {Parameters<this['findProduct']>[0]} options - The search criteria options object
   * @param {'single' | 'multi'} [options.variantType] - Optional variant type requirement
   * @param {boolean} [options.mustBeInStock] - Optional requirement for product to be in stock
   * @param {boolean} [options.mustHaveSiblings] - Optional requirement for product to have siblings
   * @param {boolean} [options.mustBeRegularPrice] - Optional requirement for product to have regular pricing
   * @returns {boolean} True if the product matches all specified criteria, false otherwise
   *
   * @example
   * // Check if product matches single variant type and stock requirements
   * const isMatch = this._isProductMatch(product, {
   *   variantType: 'single',
   *   mustBeInStock: true
   * })
   */
  private _isProductMatch(
    product: Product,
    options: Parameters<this['findProduct']>[0],
  ): boolean {
    const predicates: ((p: Product) => boolean)[] = [
      (p) =>
        !options.variantType ||
        this._matchesVariantType(p, options.variantType),
      (p) => !options.mustBeInStock || this._isInStock(p),
      (p) => !options.mustHaveSiblings || this._hasEnoughSiblings(p),
      (p) => !options.mustBeRegularPrice || this._isRegularPrice(p),
    ]

    return predicates.every((predicate) => predicate(product))
  }

  /**
   * Checks if a product matches the specified variant type requirement.
   *
   * @param {Product} product - The product to check
   * @param {'single' | 'multi'} variantType - The required variant type
   * @returns {boolean} True if the product matches the variant type requirement
   *
   * @example
   * // Check if product has exactly one variant
   * const isSingle = this._matchesVariantType(product, 'single')
   *
   * // Check if product has multiple variants
   * const isMulti = this._matchesVariantType(product, 'multi')
   */
  private _matchesVariantType(
    product: Product,
    variantType: 'single' | 'multi',
  ): boolean {
    const variantCount = product.variants?.length ?? 0
    return variantType === 'single' ? variantCount === 1 : variantCount > 1
  }

  /**
   * Checks if a product has at least one variant in stock.
   *
   * @param {Product} product - The product to check
   * @returns {boolean} True if any variant has stock quantity greater than 0
   *
   * @example
   * // Check if product is available for purchase
   * const inStock = this._isInStock(product)
   */
  private _isInStock(product: Product): boolean {
    return product.variants?.some((v) => v.stock?.quantity > 0) ?? false
  }

  /**
   * Checks if a product has more than one sibling product.
   *
   * @param {Product} product - The product to check
   * @returns {boolean} True if the product has siblings and more than one exists
   *
   * @example
   * // Check if product is part of a product family
   * const hasFamily = this._hasEnoughSiblings(product)
   */
  private _hasEnoughSiblings(product: Product): boolean {
    return product.siblings && product.siblings.length > 1
  }

  /**
   * Checks if a product variant is currently on sale.
   *
   * This method evaluates both price reductions and sale attributes to determine
   * if the variant is marked as being on sale.
   *
   * @param {NonNullable<Product['variants']>[0]} variant - The product variant to check
   * @returns {boolean} True if the variant is on sale (has reductions or sale attribute)
   *
   * @example
   * // Check if a specific variant is on sale
   * const isOnSale = this._variantIsOnSale(variant)
   */
  private _variantIsOnSale(
    variant: NonNullable<Product['variants']>[0],
  ): boolean {
    const hasReductions = (variant.price?.appliedReductions?.length ?? 0) > 0

    const saleAttrValues = variant.attributes?.isSale?.values

    let isMarkedAsSale = false
    if (saleAttrValues) {
      isMarkedAsSale = Array.isArray(saleAttrValues)
        ? saleAttrValues.some((val) => val?.value === 'true')
        : saleAttrValues.value === 'true'
    }

    return hasReductions || isMarkedAsSale
  }

  /**
   * Checks if a product is priced at regular (non-sale) pricing.
   *
   * This method evaluates both individual variant pricing and product-level
   * price ranges to determine if any sale pricing is applied.
   *
   * @param {Product} product - The product to check
   * @returns {boolean} True if the product has no sale pricing applied
   *
   * @example
   * // Check if product is at regular price (not on sale)
   * const isRegular = this._isRegularPrice(product)
   */
  private _isRegularPrice(product: Product): boolean {
    const hasSaleVariant =
      product.variants?.some(this._variantIsOnSale) ?? false

    const hasSalePriceRange =
      (product.priceRange?.min?.appliedReductions?.length ?? 0) > 0

    return !hasSaleVariant && !hasSalePriceRange
  }
}
