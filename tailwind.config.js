/** @type {import('tailwindcss').Config} */

const colors = require('tailwindcss/colors')
const FormKitVariants = require('@formkit/themes/tailwindcss')

module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
    './node_modules/@formkit/themes/dist/tailwindcss/genesis/index.cjs',
  ],
  theme: {
    extend: {
      colors: {
        sky: colors.sky,
        teal: colors.teal,
        rose: colors.rose,
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    FormKitVariants,
  ],
}
