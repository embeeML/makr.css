/**
 * Embee CSS — build configuration
 * ---------------------------------------------------------------
 * You only need to touch this file for things CSS variables
 * CAN'T do (media-query breakpoints, number of grid columns,
 * which utility classes get generated). Colors, fonts, type scale
 * and spacing sizes are all CSS variables — change those in your
 * site.css instead, no rebuild required.
 *
 * After editing: `npm run build`
 */
export default {
  name: 'Embee CSS',

  /* Min-width breakpoints (px). Used for col-md-6, d-lg-none, mt-xl-4 … */
  breakpoints: {
    sm: 576,   // large phones
    md: 768,   // tablets (portrait)
    lg: 1024,  // tablets (landscape) / small laptops
    xl: 1280,  // desktops
    xxl: 1440, // large desktops
  },

  /* Grid */
  columns: 12,
  rowCols: 6, // row-cols-1 … row-cols-6

  /* Spacing keys -> these map to --space-* tokens (see settings/tokens.css).
     Changing the VALUES of the tokens needs no rebuild. */
  spacingKeys: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],

  /* Gutter keys for g-*, gx-*, gy-* (subset of spacingKeys) */
  gutterKeys: [0, 1, 2, 3, 4, 5, 6, 7, 8],

  /* Which utility groups get responsive (-sm/-md/…) variants.
     true  = every breakpoint
     false = no responsive variants
     ['md','lg'] = only those breakpoints (keeps the file small)
     Spacing is the big one: all 5 breakpoints adds ~45 KB minified. */
  responsive: {
    display: true,   // d-md-none
    flex: true,      // flex-md-column, justify-content-lg-center …
    spacing: ['md', 'lg'], // mt-md-4, px-lg-6 …  (set true for sm/xl/xxl too)
    gap: true,       // gap-md-4
    text: true,      // text-md-center
    order: true,     // order-md-first
  },
};
