# SCAYLE Storefront Boilerplate - /modules

The `modules/` directory serves as a repository for custom modules or plugins that are designed to enhance or extend the framework's core functionalities. These modules can interact with Nuxt's internal processes through its powerful hook system, enabling developers to modify the build process, add custom server middleware, integrate third-party APIs, or introduce global functionalities that can be accessed across the application. By placing these modules in the modules/ directory, developers ensure that they are loaded and executed within Nuxt's context, allowing for a seamless integration and expansion of the base Nuxt features tailored to specific project requirements. This directory becomes particularly valuable in larger projects where custom functionality is crucial for meeting complex requirements.

The Storefront Boilerplate currently provides the following local modules of certain features to enable a certain degree of "separation of concerns":

- `modules/cms`
- `modules/opentelemetry`
- `modules/subscription`

---

For more information, check the [official Nuxt documentation](https://nuxt.com/docs/guide/directory-structure/modules).
