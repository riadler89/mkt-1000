# SCAYLE Storefront Boilerplate - /pages

The `pages/` directory is central to the application's routing mechanism, where each Vue file within this directory automatically corresponds to a route based on its file name and structure. This directory should contain Vue component files that define the structure and content of each page on the website. Nuxt processes these files to construct the application's page-based routing architecture automatically, supporting features like dynamic routing through file naming conventions (e.g., `_id.vue` for variable route segments or `[slug].vue` for dynamic pages based on an URL slug parameter). Additionally, the directory supports nested routes by structuring the files in subdirectories, enabling developers to organize and manage complex page hierarchies efficiently. This automatic route mapping significantly simplifies development and enhances maintainability in Nuxt-based projects.

---

For more information, check the [official Nuxt documentation](https://nuxt.com/docs/guide/directory-structure/pages).
