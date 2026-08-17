import type { Config } from 'tailwindcss';

/**
 * AURELIA design tokens.
 * The palette, type scale and motion are defined here so every component
 * consumes a single source of truth. Values mirror the CSS custom properties
 * declared in globals.css.
 */
const config: Config = {
  content: [
    './src/app/**/*.{ts,tsx}',
    './src/components/**/*.{ts,tsx}',
    './src/lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        ink: '#0F0F0F', // Deep black — primary
        charcoal: '#2A2A2A', // Dark charcoal — body text
        graphite: '#4A4744',
        ivory: '#FAF8F5', // Warm white — secondary surface
        champagne: '#EFE7DA',
        beige: '#E7DDCE',
        sand: '#D9CDB8',
        gold: '#C8A96A', // Luxury gold — accent
        'gold-deep': '#A98545',
        'gold-soft': '#DCC79B',
        line: '#E7E1D8', // hairline dividers
      },
      fontFamily: {
        // Editorial serif for headings, clean grotesque for body.
        serif: ['var(--font-serif)', 'Cormorant Garamond', 'Georgia', 'serif'],
        sans: ['var(--font-sans)', 'Inter', 'Helvetica Neue', 'Arial', 'sans-serif'],
      },
      fontSize: {
        display: ['clamp(3rem, 8vw, 8rem)', { lineHeight: '0.98', letterSpacing: '-0.02em' }],
        hero: ['clamp(2.5rem, 6vw, 5.5rem)', { lineHeight: '1.02', letterSpacing: '-0.015em' }],
      },
      letterSpacing: {
        luxe: '0.22em',
        wide2: '0.32em',
      },
      maxWidth: {
        edge: '1600px',
      },
      spacing: {
        section: 'clamp(5rem, 12vw, 11rem)',
      },
      transitionTimingFunction: {
        luxe: 'cubic-bezier(0.16, 1, 0.3, 1)',
        soft: 'cubic-bezier(0.22, 0.61, 0.36, 1)',
      },
      boxShadow: {
        card: '0 20px 60px -30px rgba(15,15,15,0.28)',
        lift: '0 40px 90px -40px rgba(15,15,15,0.40)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.9s var(--ease-luxe) both',
        marquee: 'marquee 32s linear infinite',
      },
    },
  },
  plugins: [],
};

export default config;
