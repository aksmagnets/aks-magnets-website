# Air Fryer image rollout — 2026-11-18

## Published
- Beef: 8 high-definition food illustrations in existing separate WebP sprite
- Remaining categories: 80 additional illustrations in a single **576 × 2880 WebP atlas (~741 KB)**, with 144 × 144 px source tiles displayed at 72 × 72 px (64 × 64 px on mobile)
- 197 of 228 active results matched an existing subject illustration and render a thumbnail; **31 results intentionally remain text-only** rather than show misleading food imagery
- All ten categories have representative illustrations. Search, temperatures, safety notes, and product sidebar are unchanged

## Missing accurate food subjects (31)
Baby back ribs; Beets; Cabbage wedges; Kale; Okra; Radishes; Parsnips; Squash; Corn dogs; Frozen pot pie; Frozen pot stickers; Sausage rolls; Churros; Cinnamon rolls; Roasted bananas; Roasted chickpeas; Frozen jalapeño poppers; Frozen samosas; Crispy tofu cubes; Spaghetti squash (halved); Falafel balls; Frozen pierogies; Bagel (toasted); Quick bread (mini loaf); Celeriac cubes; Parsnips (cut); Turnip (cubes); Beetroot (whole); Fennel (quartered); Frozen mini quiche; Frozen bagels.

## Follow-up before declaring 100% illustrated
- Create 31 more food-accurate illustrations or smaller number of genuinely reusable subjects; do not substitute unrelated food pictures
- Review specific mappings for similarity at small thumbnail sizes
- Verify actual desktop/mobile rendering and performance, especially after images load

## Technical
- Asset: `tools/air-fryer-time-finder/assets/food-illustrations-atlas.webp`
- CSS: `styles.css` class `aft-food-photo-{0..79}` with 4 columns / 20 rows
- JS: `tools/air-fryer-time-finder/finder.js` function `foodPhotoIndex`; index 80 reuses original Beef meatballs image
- Automated smoke test passed after changes (`tests/air-fryer-finder.test.cjs`)
