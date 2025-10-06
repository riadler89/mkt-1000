# @scayle/storefront-application-nuxt

<div align="center">
  <img src="https://cdn-prod.scayle.com/public/media/general/SCAYLE-Commerce-Engine-header.png" alt="SCAYLE Commerce Engine" />
</div>

<div align="center">
  <br />
  <h1>SCAYLE Storefront Application</h1>
</div>

<div align="center">
  <h4><a href="https://scayle.dev/storefront">SCAYLE Storefront</a> | <a href="https://scayle.dev">SCAYLE Documentation</a> | <a href="https://www.scayle.com/">SCAYLE Website</a></h4>
</div>

<div align="center">
    A <a href="https://nuxt.com/docs/getting-started/introduction" target="_blank" >Nuxt 3</a>-based boilerplate to kick-start your SCAYLE Storefront Application development.
    <br />
    <br />
    <a href="https://scayle.dev/en/storefront-guide/storefront-application/readme/what-is-storefront"><strong>Explore the Development Guide »</strong></a>
    <br />
</div>

<hr

<div align="center">
  <br />
  <a href="https://nuxt.com/docs/getting-started/introduction"><img src="https://img.shields.io/badge/Nuxt-002E3B?style=for-the-badge&logo=nuxtdotjs&logoColor=#00DC82" alt="Nuxt" /></a> <a href="https://vuejs.org/guide/introduction.html"><img src="https://img.shields.io/badge/vuejs-%2335495e.svg?style=for-the-badge&logo=vuedotjs&logoColor=%234FC08D" alt="Vue" /></a> <a href="https://tailwindcss.com/docs/installation"><img src="https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="TailwindCSS" /></a>

</div>

## About SCAYLE Storefront

**SCAYLE Storefront Application** is an all-in-one starter kit for building high-performance e-commerce shops for the
SCAYLE Commerce Engine. Built with modern web technologies and best practices, it provides everything needed to create a best-in-class e-commerce frontend.

### Architecture Overview

The Storefront Application is built on a modern, scalable architecture:

- **Nuxt 3 Framework**: Server-side rendering, static site generation, and hybrid rendering capabilities
- **Vue 3 Composition API**: Modern reactive framework with TypeScript support
- **Tailwind CSS**: Utility-first CSS framework for rapid UI development
- **SCAYLE Storefront SDKs**: Headless commerce functionality and business logic
- **Comprehensive Testing Suite**: End-to-end testing with Playwright and load testing with Artillery

### Key Components

**Storefront SDKs:**

- Design-agnostic business logic and feature packages
- Composable functions and utilities for e-commerce functionality
- TypeScript-first development experience
- Seamless integration with SCAYLE Commerce Engine APIs

**Storefront Application:**

- Complete Nuxt 3 application with all essential e-commerce features
- Modern UI components and responsive design
- Performance-optimized for Core Web Vitals
- Comprehensive testing and quality assurance tools

**Testing Suite:**

- **Playwright E2E Testing**: Cross-browser automation and user journey validation
- **Artillery Load Testing**: Performance testing and scalability validation

### Benefits

- **Rapid Development**: Pre-built components and features reduce development time
- **Modern Stack**: Latest web technologies and development practices
- **Performance Optimized**: Built for speed and Core Web Vitals compliance
- **Scalable Architecture**: Designed to handle high-traffic e-commerce scenarios
- **Quality Assurance**: Comprehensive testing suite ensures reliability
- **Developer Experience**: TypeScript, hot reload, and modern tooling

### Development & Testing

- **Comprehensive Testing Suite**: End-to-end and load testing capabilities
- **Modern Development Tools**: Hot reload, TypeScript, ESLint, and Prettier
- **Component Library**: Reusable UI components and page objects
- **API Integration**: Seamless SCAYLE Commerce Engine integration
- **Development Environment**: Docker support and local HTTPS setup

## Getting Support

While the Storefront Applications aims to reduce complexity where possible, we understand that questions and issues may still arise. For technical assistance, to raise issues, or to exchange with other developers using the SCAYLE Storefront Application, please visit our [GitHub Discussions page](https://github.com/scayle/storefront-application/discussions).

To access the repository and participate in discussions, you'll need to be granted access. Please get in touch with your SCAYLE Representative and your Github Username, who will be able to facilitate access for you, and don't forget to provide your Github username.

We encourage you to utilize the GitHub Discussions as your primary resource for:

- **Technical Helpdesk:** Find answers to common questions and troubleshoot issues.
- **Raising Issues:** Report bugs or unexpected behavior.
- **Asking Questions:** Get clarification on features or implementation details.
- **Community Exchange:** Connect with other developers, share insights, and learn best practices.

## Getting Started

Get your SCAYLE Storefront Application up and running in minutes with this comprehensive setup guide. This section provides everything you need to set up your local development environment and run the application in both preview and production-like modes.

### Prerequisites

Before you begin, ensure you have the following tools installed:

| Package | Version        | Note               |
| ------- | -------------- | ------------------ |
| git     | Latest         | Version control    |
| node    | LTS (v22.17.x) | JavaScript runtime |
| pnpm    | v10.x          | Package manager    |
| docker  | Latest         | For Redis caching  |

**Install Node.js with nvm:**

```bash
# Install and use latest LTS version
nvm install lts/*
nvm use lts/*
```

**Install PNPM with Corepack:**

```bash
corepack enable
corepack prepare pnpm@latest --activate
```

### Quick Setup (Recommended)

For more in-depth explanations and detailed guides, please consult the [SCAYLE Resource Center](https://scayle.dev/en/storefront-guide/storefront-application/readme/setup-your-storefront).

#### 1. Get the Source Code

Contact your SCAYLE Account Manager to obtain your GitLab Access Token, then clone the repository:

```bash
# Clone using OAUTH token
git clone https://oauth2:<YOUR_TOKEN>@gitlab.com/scayle/storefront-boilerplate-nuxt-public.git
cd storefront-boilerplate-nuxt-public
```

#### 2. Install Dependencies

```bash
# Install all required dependencies
pnpm install
```

#### 3. Set Up Redis (with Docker)

Redis is required for caching and sessions:

```bash
# Start Redis service
docker compose up redis -d

# Verify Redis is running
docker compose ps
```

#### 4. Configure Application

Use the SCAYLE Storefront CLI to automatically configure your application:

```bash
# Run setup with your Admin API token and tenant space
pnpm dlx @scayle/storefront-cli setup --admin-api-token=<YOUR_TOKEN> --tenant-space=<TENANT_SPACE>
```

This will automatically generate:

- `.env` configuration file
- `shops.ts` shop configuration
- Locale translation files

#### 5. Configure Additional Secrets

Add these required secrets to your `.env` file:

| Secret              | Environment Variable                              | Purpose                              |
| ------------------- | ------------------------------------------------- | ------------------------------------ |
| Storefront API Key  | `NUXT_STOREFRONT_SAPI_TOKEN`                      | Authenticate Storefront API requests |
| OAuth Client ID     | `NUXT_STOREFRONT_OAUTH_CLIENT_ID`                 | Checkout authentication              |
| OAuth Client Secret | `NUXT_STOREFRONT_OAUTH_CLIENT_SECRET`             | Checkout authentication              |
| Checkout Token      | `NUXT_STOREFRONT_SHOPS_{SHOP_ID}_CHECKOUT_TOKEN`  | Checkout Web Component               |
| Checkout Secret     | `NUXT_STOREFRONT_SHOPS_{SHOP_ID}_CHECKOUT_SECRET` | Checkout Web Component               |

#### 6. Create Local HTTPS Certificate

For features like Checkout, HTTPS is required:

```bash
# Install mkcert (follow GitHub instructions)
# Generate certificate
mkcert --key-file localhost.pem --cert-file localhost.crt localhost

# Add to .env file
echo "HTTPS_KEY=localhost.pem" >> .env
echo "HTTPS_CERT=localhost.crt" >> .env
```

#### 7. Run Your Application

**Development Mode:**

```bash
# Start development server
pnpm dev

# Open in browser
open https://localhost:3000
```

**Production-like Preview:**

```bash
# Build the application
pnpm build

# Run production preview
pnpm preview

# Open in browser
open https://localhost:3000
```

### Manual Setup (Alternative)

If you prefer manual configuration instead of using the CLI:

1. **Create `.env` file:**

   ```bash
   cp .env.example .env
   # Edit .env with your credentials
   ```

2. **Update shop configuration:**
   - Modify `config/shops.ts` with your shop details
   - Update `nuxt.config.ts` with your shop configurations

3. **Configure locales:**
   - Adjust the `locales` array in `config/storefront.ts`
   - Replace example `shopId`s with your actual shop IDs

For detailed configuration options, consult the [SCAYLE Resource Center](https://scayle.dev/en/storefront-guide/storefront-application/technical-foundation/configuration).

## Project Structure

The SCAYLE Storefront Application follows a well-organized, modular structure:

```text
storefront-application/
├── .env                   # Environment variables (create from .env.example)
├── .env.example           # Environment variables template
├── .gitignore             # Git ignore rules
├── .nuxt/                 # Nuxt build output (auto-generated)
├── .output/               # Production build output
├── .storybook/            # Storybook configuration
├── app/                   # Main application directory
│   ├── components/        # Vue components organized by feature
│   │   ├── account/       # Account-related components
│   │   ├── auth/          # Authentication components
│   │   ├── basket/        # Shopping cart components
│   │   ├── category/      # Category page components
│   │   ├── filter/        # Product filtering components
│   │   ├── layout/        # Layout and navigation components
│   │   ├── order/         # Order management components
│   │   ├── product/       # Product display components
│   │   ├── search/        # Search functionality components
│   │   └── ...            # Other feature-specific components
│   ├── composables/       # Vue composables and business logic
│   │   ├── tracking/      # Analytics and tracking composables
│   │   └── ...            # Other composables
│   ├── layouts/           # Nuxt layouts and page templates
│   ├── pages/             # Application pages and routing
│   │   ├── account/       # Account-related pages
│   │   ├── signin/        # Authentication pages
│   │   └── ...            # Other pages
│   ├── middleware/        # Route middleware and guards
│   ├── plugins/           # Nuxt plugins and extensions
│   ├── assets/            # Static assets and styling
│   │   ├── css/           # Global styles
│   │   └── icons/         # SVG icons and graphics
│   └── directives/        # Custom Vue directives
├── config/                # Configuration files
│   ├── shops.ts           # Shop configuration
│   └── ui.ts              # UI configuration
├── i18n/                  # Internationalization
│   ├── locales/           # Translation files
│   └── i18n.config.ts     # i18n configuration
├── modules/               # Custom Nuxt modules
│   ├── cms/               # CMS integration module
│   ├── gtm/               # Google Tag Manager module
│   ├── subscription/      # SCAYLE Subscription Addon module
│   └── ui/                # Storefront UI components module
├── server/                # Server-side functionality
│   ├── plugins/           # Server plugins
│   └── utils/             # Server utilities
├── testing/               # Comprehensive testing suite
│   ├── playwright/        # E2E testing with Playwright
│   └── artillery/         # Load testing with Artillery
├── shared/                # Shared constants and utilities
│   └── constants/         # Application constants
├── types/                 # TypeScript type definitions
├── rpcMethods/            # Custom RPC methods
├── scripts/               # Build and utility scripts
├── public/                # Public static files
├── patches/               # Package patches
├── test/                  # Unit and integration tests
│   └── vitest-setup/      # Vitest configuration
├── docker/                # Docker configuration
│   └── Dockerfile         # Docker build configuration
├── docker-compose.yml     # Docker Compose configuration
├── eslint.config.mjs      # ESLint configuration
├── nuxt.config.ts         # Nuxt configuration
├── package.json           # Package dependencies and scripts
├── pnpm-lock.yaml         # PNPM lock file
├── pnpm-workspace.yaml    # PNPM workspace configuration
├── tailwind.config.ts     # Tailwind CSS configuration
├── tsconfig.json          # TypeScript configuration
├── vitest.config.ts       # Vitest test configuration
├── CHANGELOG.md           # Project changelog
└── README.md              # This file
```

### Key Directories

- **`app/components/`**: Feature-organized Vue components following atomic design principles
- **`app/composables/`**: Business logic and state management using Vue 3 Composition API
- **`app/pages/`**: File-based routing with Nuxt 3 automatic route generation
- **`modules/`**: Custom Nuxt modules for extended functionality (CMS, GTM, UI)
- **`testing/`**: Complete testing suite with E2E and load testing capabilities
- **`server/`**: Server-side API routes, plugins, and utilities
- **`i18n/`**: Internationalization configuration and translation files
- **`config/`**: Application configuration files for shops and UI settings
- **`shared/`**: Shared constants and utilities across the application
- **`types/`**: TypeScript type definitions for better type safety

### Configuration Files

- **`.env`**: Environment variables (create from `.env.example`)
- **`nuxt.config.ts`**: Main Nuxt 3 configuration
- **`tsconfig.json`**: TypeScript configuration
- **`tailwind.config.ts`**: Tailwind CSS configuration
- **`eslint.config.mjs`**: ESLint linting rules
- **`vitest.config.ts`**: Vitest testing configuration
- **`docker-compose.yml`**: Docker services configuration
- **`pnpm-workspace.yaml`**: PNPM workspace configuration

### Build Output Directories

- **`.nuxt/`**: Nuxt development build output (auto-generated)
- **`.output/`**: Production build output for deployment
- **`.storybook/`**: Storybook component documentation configuration

### Development Setup

For a proper local setup of SCAYLE Storefront, ensure to follow the latest
["Setup your Storefront"-Guide](https://scayle.dev/en/storefront-guide/developer-guide/getting-started/setup-your-storefront) in the SCAYLE Resource Center.

#### Docker Compose

Suppose you don't need to develop and make changes to the application;
we provide a simple docker-compose setup to run the application without
installing the dependencies locally on your machine.

```sh
# Without SSL setup
docker compose --profile node up --build

# With SSL setup
SSL_CERT=$(cat ./localhost.crt) SSL_KEY=$(cat ./localhost.pem) docker compose --profile node up --build
```

Depending on your SSL setup open either <http://localhost:3000> or <https://localhost:3000>

## Local HTTPS

### How to turn on local HTTPS

To generate a certificate and key, we recommend using the [mkcert](https://github.com/FiloSottile/mkcert) tool.
Follow the [mkcert installation instructions (Github)](https://github.com/FiloSottile/mkcert/blob/master/README.md#installation) and afterward run:

```sh
mkcert --key-file localhost.pem --cert-file localhost.crt localhost
```

After generating the local key and certificate file, add both to your `.env`-file as follows

```yaml
HTTPS_KEY=localhost.pem
HTTPS_CERT=localhost.crt
```

Your project will now be served on <https://localhost:3000>.
Please keep in mind that the shop accessed through <http://localhost:3000> might not be reachable anymore.

### How to turn off local HTTPS

As the local HTTPS encryption is directly coupled to the `HTTPS_KEY` and `HTTPS_CERT`,
simply remove or comment out the entries in your `.env`-file, like this:

```ini
# HTTPS_KEY=localhost.key
# HTTPS_CERT=localhost.crt
SOME_OTHER_ACTIVE_KEY=someValue
```

Use <http://localhost:3000/> to open the shop

## Running a production-like preview

Run `pnpm build` to build the latest changes and followed by `pnpm preview`.
Keep in mind that a `redis-server` needs to be running.
This will run the generated nuxt application from the `.output/` directory,
similar to how the application will be deployed on a production server.
The only difference here is that all relevant `NUXT_` runtimeConfig override values
are sourced from the local `.env` file.

## Testing

The SCAYLE Storefront Application includes a comprehensive testing suite designed to ensure reliability, performance, and user experience across all scenarios.

### Testing Architecture

**Unit & Integration Testing:**

- [@nuxt/test-utils](https://github.com/nuxt/test-utils) integration for Nuxt environment testing
- [Vitest](https://vitest.dev/) for fast unit and integration tests
- Use `.nuxt.test.ts` or `.nuxt.spec.ts` file suffix for Nuxt environment tests

**End-to-End Testing:**

- **Playwright E2E Testing**: Cross-browser automation and user journey validation
- **Cross-browser Support**: Chromium, Firefox, and WebKit testing
- **Mobile Testing**: Android Chrome and iOS Safari emulation
- **Page Object Model**: Maintainable and reusable test components

**Load Testing:**

- **Artillery Load Testing**: Performance validation under various traffic conditions
- **Multi-phase Testing**: Realistic user behavior simulation
- **Stress Testing**: High-intensity tests to identify performance bottlenecks
- **HTTP & Browser Testing**: Both API and frontend performance validation

### Test Coverage

The testing suite covers:

- **User Authentication**: Login, registration, and account management flows
- **Product Discovery**: Search, filtering, and category navigation
- **Shopping Experience**: Add to cart, wishlist, and checkout processes
- **Order Management**: Order history, tracking, and management
- **Navigation**: Header, footer, mobile menu, and breadcrumbs
- **Performance**: Core Web Vitals and loading performance validation
- **Accessibility**: WCAG compliance and accessibility testing

### Running Tests

```bash
# Unit and integration tests
pnpm test

# E2E tests
cd testing/playwright
pnpm test:e2e

# Load tests
cd testing/artillery
pnpm artillery:load-test
```

For detailed testing documentation, see:

- [Testing Suite README](./testing/README.md)
- [Playwright Testing Guide](./testing/playwright/README.md)
- [Artillery Load Testing Guide](./testing/artillery/README.md)

## Viewing Storefront API calls for debugging

Depending on the task at hand its necessary to intercept and debug API calls from SFC.
For this purpose it is recommended to use an interactive HTTP(S) proxy that allows to inspect the made API calls.

## Patches

In some cases, patches to third-party packages are required. The Storefront Application
uses [`pnpm patch`](https://pnpm.io/cli/patch) to manage patching.
This is the recommended approach for patching dependencies in pnpm workspaces.

An overview of the currently included patches can be found [here](./patches/INFO.md).

## OpenTelemetry

The Storefront Application includes an experimental integration with OpenTelemetry.

To enable OpenTelemetry, set the buildtime environment variable `OTEL_ENABLED` to true.
This will inject additional code into your application's entrypoint which will
initialize the OpenTelemetry SDK. Automatic instrumentations as well as instrumentations
from `storefront-nuxt` will be captured and exported via the OTLP protocol.

Currently, Vercel and Node are the only supported platforms for the OpenTelemetry integration.
Setting `OTEL_ENABLED` to true when building for other platforms will have no effect.

You should also set the runtime variable `OTEL_SERVICE_NAME` to configure the
service name used in traces. e.g. `OTEL_SERVICE_NAME=storefront-boilerplate`

Note: this variable is used directly by the OpenTelemetry libraries and is not available in the Nuxt `runtimeConfiguration`.

## Explicit Imports

With the release of the SCAYLE Storefront Application `v1.2.0`, we have disabled
the [Nuxt autoImport feature](https://nuxt.com/docs/guide/concepts/auto-imports#disabling-auto-imports)
or composables, utils and other dependencies.

With the change we have included a custom local Nuxt module `modules/eslint-auto-explicit-import`,
based on [`antfu/nuxt-eslint-auto-explicit-import`](https://github.com/antfu/nuxt-eslint-auto-explicit-import).
This module aims to insert more explicit import statement automatically where possible,
based on Nuxt internal import resolution using `eslint --fix`.

### Vue Compiler Macros

Some functions from Vue are considered compiler macros and do not need to be imported manually,
as they will be resolved during the component build time:

- `defineProps`

The following compiler macros will currently still be manually imported but might
throw a warning during build time:

- `defineOptions`
- `defineModel`

### Manual Import Paths

As the automatic import path resolution won't work for every case,
manual checking and tweaking of import paths might be required.
Following some common cases that should be considered while adding manual imports:

- Use `#nuxt` instead of `nuxt/app` or `#app/nuxt`
- Use `#vue-router` for router utilities instead of `vue-router`
- Use `#i18n` for composables instead of `@nuxtjs/i18n`
- Use `#storefront/composables` for composables instead of `@scayle/storefront-nuxt`
- Use `#app/composables/{name}` for composables instead of `#imports`
  - e.g. `import { clearError, useError } from '#app/composables/error'`
- Use `#imports` for imports within a pure server context
  - e.g server or nitro plugins (`server/plugins/*` or `modules/opentelemetry/src/runtime/nitro/plugins/*`)

### Barrel file imports

Even though we're providing barrel files (`index.ts`) for `~/utils` and `~/constants`,
we recommend to make your imports as explicit as possible.
This helps to avoid confusion in regards to import locations and potential naming collisions.
