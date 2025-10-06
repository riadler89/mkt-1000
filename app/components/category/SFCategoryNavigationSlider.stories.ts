import type { StoryObj } from '@storybook-vue/nuxt'
import { categoryFactory } from '@scayle/storefront-nuxt/test/factories'
import type { Category } from '@scayle/storefront-nuxt'
import { ref, computed } from 'vue'
import SFCategoryNavigationSlider from './SFCategoryNavigationSlider.vue'

/**
 * SFCategoryNavigationSlider displays a horizontal scrollable list of category navigation items.
 * It automatically filters categories based on the current category context - showing either
 * subcategories or sibling categories depending on the current selection.
 */
export default {
  title: 'Category/SFCategoryNavigationSlider',
  component: SFCategoryNavigationSlider,
  render: () => {
    const { allCategories } = buildTree()
    const currentCategory = ref<Category | null | undefined>(allCategories[1]) // Start with "Clothing"

    const selectCategory = (category: Category) => {
      currentCategory.value = category
    }

    // Replicate the categories logic from the original component
    const categories = computed(() => {
      // If the category is a leaf node, select all categories which have the same parent
      if (currentCategory.value?.childrenIds.length === 0) {
        return allCategories.filter((item) => {
          return currentCategory.value?.parentId === item.parentId
        })
      }

      // If the category has children, we return all categories which have our current category as a parent
      return allCategories.filter((item) => {
        return currentCategory.value?.id === item.parentId
      })
    })

    return {
      components: { SFCategoryNavigationSlider },
      setup() {
        return {
          allCategories,
          currentCategory,
          selectCategory,
          categories,
        }
      },
      template: `
        <div class="w-full max-w-screen-lg space-y-4">
          <div class="text-sm text-gray-600">
            <strong>Current Category:</strong>
            <span class="ml-2 px-2 py-1 bg-blue-100 text-blue-800 rounded">
              {{ currentCategory?.name || 'None' }}
            </span>
            <span class="ml-2 text-gray-500">
              (Click on slider items to change selection)
            </span>
          </div>

          <div class="border border-gray-200 rounded-lg p-4">
            <!-- Custom interactive slider -->
            <div class="w-full snap-x snap-mandatory scrollbar-hide overflow-x-auto">
              <div class="flex py-1">
                <button
                  v-for="category in categories"
                  :key="category.id"
                  @click="selectCategory(category)"
                  class="flex h-10 w-fit flex-nowrap items-center justify-center whitespace-pre rounded-[2.375rem] bg-gray-200 px-4 text-md font-medium tracking-tighter text-secondary focus-visible:outline-offset-[-1px] mr-2 cursor-pointer hover:bg-gray-300 transition-colors"
                  :class="{
                    'border-2 border-primary bg-white font-semibold text-primary': category.id === currentCategory?.id,
                  }"
                >
                  {{ category.name }}
                </button>
              </div>
            </div>
          </div>
        </div>
      `,
    }
  },
}

type Story = StoryObj<typeof SFCategoryNavigationSlider>

const buildTree = () => {
  const root: Category = categoryFactory.build({
    id: 1,
    name: 'Women',
    parentId: 0,
  })
  const dresses: Category = categoryFactory.build({
    id: 2,
    name: 'Dresses',
    parentId: root.id,
  })
  const shoes: Category = categoryFactory.build({
    id: 3,
    name: 'Shoes',
    parentId: root.id,
  })
  const accessories: Category = categoryFactory.build({
    id: 4,
    name: 'Accessories',
    parentId: root.id,
  })

  // Current category with children
  const clothing: Category = categoryFactory.build({
    id: 5,
    name: 'Clothing',
    parentId: root.id,
    childrenIds: [dresses.id, shoes.id, accessories.id],
  })

  // Link children back to parent via parentId; childrenIds on leaf nodes are empty
  const leafA: Category = categoryFactory.build({
    id: 6,
    name: 'Summer Dresses',
    parentId: clothing.id,
    childrenIds: [],
  })
  const leafB: Category = categoryFactory.build({
    id: 7,
    name: 'Evening Dresses',
    parentId: clothing.id,
    childrenIds: [],
  })
  const leafC: Category = categoryFactory.build({
    id: 8,
    name: 'Casual Dresses',
    parentId: clothing.id,
    childrenIds: [],
  })

  const allCategories: Category[] = [
    root,
    clothing,
    dresses,
    shoes,
    accessories,
    leafA,
    leafB,
    leafC,
  ]

  return {
    allCategories,
    root,
    clothing,
    dresses,
    shoes,
    accessories,
    leafA,
    leafB,
    leafC,
  }
}

/**
 * Shows the category navigation slider with a parent category selected.
 * Displays all subcategories of the current category.
 */
export const Default: Story = {
  args: (() => {
    const { allCategories, clothing } = buildTree()
    return {
      allCategories,
      currentCategory: clothing,
    }
  })(),
}

const buildScrollableTree = () => {
  const root: Category = categoryFactory.build({
    id: 1,
    name: 'Women',
    parentId: 0,
  })

  // Parent category with many children
  const clothing: Category = categoryFactory.build({
    id: 2,
    name: 'Clothing',
    parentId: root.id,
    childrenIds: [3, 4, 5, 6, 7, 8, 9, 10, 11, 12], // 10 children
  })

  // Create 10 subcategories to demonstrate scrolling
  const categories: Category[] = [
    categoryFactory.build({
      id: 3,
      name: 'Summer Dresses',
      parentId: clothing.id,
      childrenIds: [],
    }),
    categoryFactory.build({
      id: 4,
      name: 'Evening Dresses',
      parentId: clothing.id,
      childrenIds: [],
    }),
    categoryFactory.build({
      id: 5,
      name: 'Casual Dresses',
      parentId: clothing.id,
      childrenIds: [],
    }),
    categoryFactory.build({
      id: 6,
      name: 'Tops & Blouses',
      parentId: clothing.id,
      childrenIds: [],
    }),
    categoryFactory.build({
      id: 7,
      name: 'Pants & Jeans',
      parentId: clothing.id,
      childrenIds: [],
    }),
    categoryFactory.build({
      id: 8,
      name: 'Skirts',
      parentId: clothing.id,
      childrenIds: [],
    }),
    categoryFactory.build({
      id: 9,
      name: 'Jackets & Coats',
      parentId: clothing.id,
      childrenIds: [],
    }),
    categoryFactory.build({
      id: 10,
      name: 'Active wear',
      parentId: clothing.id,
      childrenIds: [],
    }),
    categoryFactory.build({
      id: 11,
      name: 'Lingerie & Sleepwear',
      parentId: clothing.id,
      childrenIds: [],
    }),
    categoryFactory.build({
      id: 12,
      name: 'Swimwear',
      parentId: clothing.id,
      childrenIds: [],
    }),
  ]

  const allCategories: Category[] = [root, clothing, ...categories]

  return {
    allCategories,
    root,
    clothing,
    categories,
  }
}

/**
 * Shows the category navigation slider with many categories to demonstrate scrollable behavior.
 * This variant includes 10 categories to showcase horizontal scrolling functionality.
 */
export const Scrollable: Story = {
  render: () => {
    const { allCategories } = buildScrollableTree()
    const currentCategory = ref<Category | null | undefined>(allCategories[1]) // Start with "Clothing"

    const selectCategory = (category: Category) => {
      currentCategory.value = category
    }

    // Replicate the categories logic from the original component
    const categories = computed(() => {
      // If the category is a leaf node, select all categories which have the same parent
      if (currentCategory.value?.childrenIds.length === 0) {
        return allCategories.filter((item) => {
          return currentCategory.value?.parentId === item.parentId
        })
      }

      // If the category has children, we return all categories which have our current category as a parent
      return allCategories.filter((item) => {
        return currentCategory.value?.id === item.parentId
      })
    })

    return {
      components: { SFCategoryNavigationSlider },
      setup() {
        return {
          allCategories,
          currentCategory,
          selectCategory,
          categories,
        }
      },
      template: `
        <div class="w-full max-w-screen-lg space-y-4">
          <div class="text-sm text-gray-600">
            <strong>Current Category:</strong>
            <span class="ml-2 px-2 py-1 bg-blue-100 text-blue-800 rounded">
              {{ currentCategory?.name || 'None' }}
            </span>
            <span class="ml-2 text-gray-500">
              (Click on slider items to change selection)
            </span>
          </div>

          <div class="border border-gray-200 rounded-lg p-4">
            <!-- Custom interactive slider -->
            <div class="w-full snap-x snap-mandatory scrollbar-hide overflow-x-auto">
              <div class="flex py-1">
                <button
                  v-for="category in categories"
                  :key="category.id"
                  @click="selectCategory(category)"
                  class="flex h-10 w-fit flex-nowrap items-center justify-center whitespace-pre rounded-[2.375rem] bg-gray-200 px-4 text-md font-medium tracking-tighter text-secondary focus-visible:outline-offset-[-1px] mr-2 cursor-pointer hover:bg-gray-300 transition-colors"
                  :class="{
                    'border-2 border-primary bg-white font-semibold text-primary': category.id === currentCategory?.id,
                  }"
                >
                  {{ category.name }}
                </button>
              </div>
            </div>
          </div>
        </div>
      `,
    }
  },
}
