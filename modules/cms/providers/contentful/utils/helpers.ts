import type { RouteLocationNormalizedLoadedGeneric } from '#vue-router'

export const isInEditorMode = (route: RouteLocationNormalizedLoadedGeneric) => {
  return '_editorMode' in route.query
}
