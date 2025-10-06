import plugin from 'tailwindcss/plugin'
import { BREAKPOINTS, PRODUCT_IMAGE_ASPECT_RATIO } from './config/ui'

const defaultSizes = {
  '6xs': '2rem',
  '5xs': '4rem',
  '4xs': '8rem',
  '3xs': '12rem',
  '2xs': '16rem',
  xs: '20rem',
  md: '28rem',
  lg: '32rem',
  xl: '36rem',
  '2xl': '40rem',
  '3xl': '48rem',
}
type Breakpoints = keyof typeof BREAKPOINTS

const screens = Object.entries(BREAKPOINTS).reduce(
  (acc, [breakpointName, size]) => {
    Object.assign(acc, { [breakpointName]: `${size}px` })
    return acc
  },
  {} as Record<Breakpoints, number>,
)

export default {
  content: ['modules/**/*.{vue,js, ts}'],
  safelist: [
    'overflow-hidden',
    'font-semibold',
    {
      pattern: /duration-\d+/,
    },
  ],
  theme: {
    screens,
    container: {
      center: true,
      padding: '1rem',
    },
    fontFamily: {
      sans: ['Inter', 'sans-serif'],
    },

    colors: {
      inherit: 'inherit',
      transparent: 'transparent',
      current: 'currentColor',
      black: '#000000',
      white: '#ffffff',
      gray: {
        100: '#fafafa',
        200: '#f2f2f2',
        300: '#ebebeb',
        400: '#d9d9d9',
        500: '#a8a8a8',
      },
      primary: '#171717',
      secondary: '#666666',
      promotion: '#AEECEF',
      campaign: '#FFC65F',
      product: {
        sale: '#d93321',
        'sold-out': '#d93321',
      },
      accent: '#5328e1',
      status: {
        success: {
          light: '#cef5e8',
          DEFAULT: '#0dcc8d',
        },
        error: {
          light: '#fadbd8',
          DEFAULT: '#d1000a',
        },
        info: '#ccbff6',
        alert: {
          light: '#fdecce',
          DEFAULT: '#f59e0b',
        },
      },
    },
    aspectRatio: {
      '3/4': '3 / 4',
      '9/4': '9 / 4',
      square: '1/1',
      product: PRODUCT_IMAGE_ASPECT_RATIO.join('/'),
    },
    fontWeight: {
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
    },
    animation: {
      pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
    },
    keyframes: {
      pulse: {
        '0%, 100%': { opacity: 1 },
        '50%': { opacity: 0.5 },
      },
    },
    outlineWidth: {
      0: '0',
      1: '1px',
      2: '2px',
      3: '3px',
    },
    outlineOffset: {
      0: '0',
      1: '1px',
      2: '2px',
      4: '4px',
      5: '5px',
    },
    boxShadow: {
      none: 'none',
      DEFAULT:
        '0 4px 6px -1px rgba(var(--color-shadow-white-smoke)), 0 2px 4px -2px rgba(var(--color-shadow-white-smoke))',
      'inner-solid': 'inset 0 0 0 4px rgb(var(--color-shadow-navy))',
      'inner-solid-sm': 'inset 0 0 0 2px rgb(var(--color-shadow-navy))',
      'outer-solid': '0 0 0 3px rgb(var(--color-shadow-navy))',
      'input-label':
        'inset 0 2px 8px -10px rgb(var(--color-shadow-gray)), inset 0 2px 8px -10px rgb(var(--color-shadow-gray))',
    },
    fontSize: {
      sm: [
        '0.75rem', // 12px
        {
          lineHeight: '1rem',
          letterSpacing: '-0.13px',
        },
      ],
      md: [
        '0.875rem', // 14px
        {
          lineHeight: '1.125rem',
          letterSpacing: '-0.14px',
        },
      ],
      lg: [
        '1rem', // 16px
        {
          lineHeight: '1.25rem',
          letterSpacing: '-0.32px',
        },
      ],
      xl: [
        '1.125rem', // 18px
        {
          lineHeight: '1.375rem',
          letterSpacing: '0',
        },
      ],
      '2xl': [
        '1.25rem', // 20px
        {
          lineHeight: '1.75rem',
          letterSpacing: '-0.4px',
        },
      ],
      '3xl': [
        '1.75rem', // 28px
        {
          lineHeight: '2rem',
          letterSpacing: '-0.5px',
        },
      ],
    },
    extend: {
      maxHeight: {
        dialog: '94vh',
      },
      maxWidth: {
        screen: '100vw',
        dialog: '94vw',
      },
      spacing: {
        ...defaultSizes,
        '4.5': '1.125rem',
        11: '2.625rem',
        13: '3.25rem',
        15: '3.75rem',
        22: '5.5rem',
        26: '6.5rem',
      },
    },
  },
  plugins: [
    plugin(({ addUtilities, addVariant }) => {
      const autofillStyles = {
        '-webkit-box-shadow': '0 0 0 30px #fff inset !important',
        '-webkit-text-fill-color': '#000 !important',
      }
      const utilities = {
        '.input-white-autofill': {
          '&:-webkit-autofill': {
            ...autofillStyles,
            '&:hover': autofillStyles,
            '&:focus': autofillStyles,
            '&:active': autofillStyles,
          },
        },
        '.anchor-scrolling-none': {
          overflowAnchor: 'none',
        },
        '.scrollbar-hide': {
          /* Firefox */
          'scrollbar-width': 'none',
          /* Safari and Chrome */
          '&::-webkit-scrollbar': {
            display: 'none',
          },
        },
        '.transition-discrete': {
          'transition-behavior': 'allow-discrete',
        },
        '.diagonal-strikethrough': {
          background:
            'linear-gradient(to left top, transparent 49%, currentColor, currentColor, transparent 52.25%)',
        },
        '.scroll-shadow': {
          background: `/* Shadow Cover TOP */
            linear-gradient(
              white 30%,
              rgba(255, 255, 255, 0)
            ) center top,

            /* Shadow Cover BOTTOM */
            linear-gradient(
              rgba(255, 255, 255, 0),
              white 70%
            ) center bottom,

            /* Shadow TOP */
            radial-gradient(
              farthest-side at 50% 0,
              rgba(0, 0, 0, 0.2),
              rgba(0, 0, 0, 0)
            ) center top,

            /* Shadow BOTTOM */
            radial-gradient(
              farthest-side at 50% 100%,
              rgba(0, 0, 0, 0.2),
              rgba(0, 0, 0, 0)
            ) center bottom;
          `,
          'background-repeat': `no-repeat`,
          'background-size': `100% 40px, 100% 40px, 100% 14px, 100% 14px`,
          'background-attachment': `local, local, scroll, scroll`,
        },
      }
      addUtilities(utilities)
      // https://github.com/tailwindlabs/tailwindcss/pull/12040
      addVariant('starting', '@starting-style')
      addVariant('loaded', 'body.loaded &')
      // Allow styling the marker of <summary/>
      addVariant('marker', [
        '&::marker',
        '& *::marker',
        '&::-webkit-details-marker',
        '& *::-webkit-details-marker',
      ])
      addVariant('supports-hover', ['@media(hover:hover)'])
    }),
  ],
}
