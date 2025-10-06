import type { StoryObj, ComponentPropsAndSlots } from '@storybook-vue/nuxt'
import { categoryFactory } from '@scayle/storefront-nuxt/test/factories'
import type { Category } from '@scayle/storefront-nuxt'
import SFCategorySideNavigation from './SFCategorySideNavigation.vue'

/**
 * SFCategorySideNavigation displays a hierarchical category tree in a sidebar format.
 * It shows root categories with their children, highlighting the current category
 * and indicating sale categories with special styling.
 */
export default {
  title: 'Category/SFCategorySideNavigation',
  component: SFCategorySideNavigation,
  render: (args: ComponentPropsAndSlots<typeof SFCategorySideNavigation>) => ({
    components: { SFCategorySideNavigation },
    setup() {
      return { args }
    },
    template: `
      <div class="w-full max-w-xs h-96 overflow-y-auto border border-gray-200 rounded-lg p-6">
        <SFCategorySideNavigation v-bind="args" class="!h-auto" />
      </div>
    `,
  }),
}

type Story = StoryObj<typeof SFCategorySideNavigation>

type CategoryWithChildren = Category & { children?: CategoryWithChildren[] }

const buildTree = () => {
  const women: CategoryWithChildren = categoryFactory.build({
    id: 1,
    name: 'Women',
    parentId: 0,
    childrenIds: [5],
  })

  const men: CategoryWithChildren = categoryFactory.build({
    id: 9,
    name: 'Men',
    parentId: 0,
    childrenIds: [],
  })

  const clothing: CategoryWithChildren = categoryFactory.build({
    id: 5,
    name: 'Clothing',
    parentId: women.id,
    childrenIds: [6, 7, 8],
  })

  const dresses: CategoryWithChildren = categoryFactory.build({
    id: 6,
    name: 'Dresses',
    parentId: clothing.id,
    childrenIds: [],
  })
  const shoes: CategoryWithChildren = categoryFactory.build({
    id: 7,
    name: 'Shoes',
    parentId: clothing.id,
    childrenIds: [],
  })
  const accessories: CategoryWithChildren = categoryFactory.build({
    id: 8,
    name: 'Accessories',
    parentId: clothing.id,
    childrenIds: [],
  })

  women.children = [clothing]
  men.children = [clothing]
  clothing.children = [dresses, shoes, accessories]

  const rootCategories: Category[] = [women, men]

  return {
    rootCategories,
    currentCategory: clothing,
    women,
    men,
    clothing,
    dresses,
    shoes,
    accessories,
  }
}

const buildLargerTree = () => {
  const women: CategoryWithChildren = categoryFactory.build({
    id: 1,
    name: 'Women',
    parentId: 0,
    childrenIds: [5, 10, 11],
  })

  const men: CategoryWithChildren = categoryFactory.build({
    id: 9,
    name: 'Men',
    parentId: 0,
    childrenIds: [12, 13],
  })

  const clothing: CategoryWithChildren = categoryFactory.build({
    id: 5,
    name: 'Clothing',
    parentId: women.id,
    childrenIds: [6, 7, 8, 14, 15],
  })

  const shoes: CategoryWithChildren = categoryFactory.build({
    id: 10,
    name: 'Shoes',
    parentId: women.id,
    childrenIds: [16, 17, 18],
  })

  const accessories: CategoryWithChildren = categoryFactory.build({
    id: 11,
    name: 'Accessories',
    parentId: women.id,
    childrenIds: [19, 20],
  })

  const menClothing: CategoryWithChildren = categoryFactory.build({
    id: 12,
    name: 'Clothing',
    parentId: men.id,
    childrenIds: [21, 22, 23],
  })

  const menShoes: CategoryWithChildren = categoryFactory.build({
    id: 13,
    name: 'Shoes',
    parentId: men.id,
    childrenIds: [24, 25],
  })

  // Women's clothing subcategories
  const dresses: CategoryWithChildren = categoryFactory.build({
    id: 6,
    name: 'Dresses',
    parentId: clothing.id,
    childrenIds: [],
  })
  const tops: CategoryWithChildren = categoryFactory.build({
    id: 7,
    name: 'Tops & Blouses',
    parentId: clothing.id,
    childrenIds: [],
  })
  const pants: CategoryWithChildren = categoryFactory.build({
    id: 8,
    name: 'Pants & Jeans',
    parentId: clothing.id,
    childrenIds: [],
  })
  const skirts: CategoryWithChildren = categoryFactory.build({
    id: 14,
    name: 'Skirts',
    parentId: clothing.id,
    childrenIds: [],
  })
  const jackets: CategoryWithChildren = categoryFactory.build({
    id: 15,
    name: 'Jackets & Coats',
    parentId: clothing.id,
    childrenIds: [],
  })

  // Women's shoes subcategories
  const heels: CategoryWithChildren = categoryFactory.build({
    id: 16,
    name: 'Heels',
    parentId: shoes.id,
    childrenIds: [],
  })
  const flats: CategoryWithChildren = categoryFactory.build({
    id: 17,
    name: 'Flats',
    parentId: shoes.id,
    childrenIds: [],
  })
  const boots: CategoryWithChildren = categoryFactory.build({
    id: 18,
    name: 'Boots',
    parentId: shoes.id,
    childrenIds: [],
  })

  // Women's accessories subcategories
  const bags: CategoryWithChildren = categoryFactory.build({
    id: 19,
    name: 'Bags',
    parentId: accessories.id,
    childrenIds: [],
  })
  const jewelry: CategoryWithChildren = categoryFactory.build({
    id: 20,
    name: 'Jewelry',
    parentId: accessories.id,
    childrenIds: [],
  })

  // Men's clothing subcategories
  const shirts: CategoryWithChildren = categoryFactory.build({
    id: 21,
    name: 'Shirts',
    parentId: menClothing.id,
    childrenIds: [],
  })
  const menPants: CategoryWithChildren = categoryFactory.build({
    id: 22,
    name: 'Pants & Jeans',
    parentId: menClothing.id,
    childrenIds: [],
  })
  const menJackets: CategoryWithChildren = categoryFactory.build({
    id: 23,
    name: 'Jackets & Coats',
    parentId: menClothing.id,
    childrenIds: [],
  })

  // Men's shoes subcategories
  const sneakers: CategoryWithChildren = categoryFactory.build({
    id: 24,
    name: 'Sneakers',
    parentId: menShoes.id,
    childrenIds: [],
  })
  const dressShoes: CategoryWithChildren = categoryFactory.build({
    id: 25,
    name: 'Dress Shoes',
    parentId: menShoes.id,
    childrenIds: [],
  })

  // Build the tree structure
  women.children = [clothing, shoes, accessories]
  men.children = [menClothing, menShoes]
  clothing.children = [dresses, tops, pants, skirts, jackets]
  shoes.children = [heels, flats, boots]
  accessories.children = [bags, jewelry]
  menClothing.children = [shirts, menPants, menJackets]
  menShoes.children = [sneakers, dressShoes]

  const rootCategories: Category[] = [women, men]

  return {
    rootCategories,
    currentCategory: clothing,
    women,
    men,
    clothing,
    shoes,
    accessories,
  }
}

/**
 * Shows the category side navigation with a hierarchical category tree.
 * Displays root categories with their children and highlights the current category.
 */
export const Default: Story = {
  args: (() => {
    const { rootCategories, currentCategory } = buildTree()
    return {
      rootCategories,
      currentCategory,
    }
  })(),
}

/**
 * Shows the category side navigation with a larger category tree to demonstrate scrolling.
 * This story includes more categories to showcase the vertical scrolling behavior.
 */
export const WithScrolling: Story = {
  name: 'With scrolling',
  args: (() => {
    const { rootCategories, currentCategory } = buildLargerTree()
    return {
      rootCategories,
      currentCategory,
    }
  })(),
}
