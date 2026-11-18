# Air Fryer Time Finder — Data & Functional QA Release Review
Date: 2026-11-18
Scope: A first stable data-quality release, ahead of user desktop/mobile visual review and any food-photo work.

## Outcome
- 230 historical/source entries tracked; 228 shown in the finder; two intentionally withheld.
- 100 originated in the AKS chart. 48 of the original entries have corresponding recommendations identified in Blue Jean Chef or Mississippi State University Extension public charts. **These are corroborating chart correspondences, not proof of independent testing or complete original provenance.**
- 117 were earlier transcribed from Air Fryer Kitchen (36), CookTiming (34), Cosori Iconic (24), and Ninja FlexDrawer (23). Their time/temperature pairs were compared with those published charts in the previous audit pass.
- 13 new entries added from Blue Jean Chef (3) and Savor + Savvy (10), retaining named sources. These include fennel, crab cakes, frozen buffalo wings, taquitos, mini quiche, frozen pizza rolls, and other packaged foods.
- All data remain estimated chart settings. No food was test-cooked in this project.

## Withheld, deliberately not guessed
- **AF018: Pork loin, 1-inch, 400°F, 55 min** — original entry mixes a likely thin cut with a roast-duration time. A published 2-pound loin chart gives 360°F / 55 min, but that is a different preparation and cannot simply replace the record.
- **AF084: Frozen meatloaf, “single layer,” 350°F, 35–40 min** — lacks product weight, meat type, and whether raw or fully cooked. Package instructions and the meat's safe internal temperature matter. Withheld rather than promoted as universally useful.

## Model and safety caveats
- Cosori Iconic-specific 435–450°F settings have explicit appliance compatibility warnings.
- Ninja Max Crisp is displayed as a preset, not a user-adjustable temperature. Ninja Roast and Air Fry modes are distinguished where supported.
- Category-specific safe internal doneness guidance is added for poultry, whole meat, ground meat, seafood, eggs, and perishable leftovers, using FoodSafety.gov as a reference.
- Frozen poultry guidance warns that breaded frozen poultry may be raw and must reach 165°F (74°C), even if its exterior looks cooked. Packaged-frozen results defer to product packaging.
- Whole 6.5 lb chicken has an appliance-capacity and thermometer warning; 4 lb eye round roast calls for thermometer checks; pot pies call for verifying the center temperature.
- Some product types (e.g. plain frozen bagels and fries) should not display irrelevant meat-safety text.

## Search/data quality improvements
- Clearer original chart names distinguish potatoes by preparation, frozen from fresh meatballs/shrimp, and frozen prepared foods.
- Region-specific food aliases include capsicum/bell pepper, aubergine/eggplant, courgette/zucchini, prawns/shrimp, garbanzo/chickpea, and common compounded names such as hashbrowns and potstickers.
- Singular/plural normalization supports queries such as potatoes, brussel sprouts, and similar variations.
- Live filtering, category-only filtering, unit conversion, reset, source-specific Max Crisp presentation and Show More pagination are preserved.
- The user-requested original-size product sidebar and uncluttered search-first page remain unchanged.

## Testing completed
- Dependency-free smoke test: `tests/air-fryer-finder.test.cjs` (run with Node.js).
- Passed simulated DOM/data checks for dataset size, both withheld records, Max Crisp, high-heat appliance warnings, initial blank state, conditional safety block, search aliases, category searches, Fahrenheit/Celsius switching, result pagination and reset.
- Syntax and data integrity checks on all active scripts passed.
- **Not yet completed:** actual browser rendering, interactive desktop/mobile cross-browser checking, accessibility testing with assistive technology, device-specific cooking trials. The user will review desktop/mobile before any cosmetic work.

## Current master data and files
- `internal-audits/air-fryer-canonical-v2.json` — canonical versioned record index with 230 IDs, source URLs, active flags and reviewed metadata; development/audit reference, not directly loaded by browser.
- `tools/air-fryer-time-finder/data.js` — 100 original AKS records.
- `tools/air-fryer-time-finder/expanded-data.js` — 117 previously sourced external records.
- `tools/air-fryer-time-finder/supplemental-data.js` — 13 additional chart-backed records.
- `tools/air-fryer-time-finder/reviewed-metadata.js` — public corrections, safety metadata and exclusions.
- `tools/air-fryer-time-finder/finder.js` — UI.
- Previous detailed audits are preserved in `internal-audits/`.

## Sources considered
- https://accessibility.extension.msstate.edu/publications/nutrition-and-wellness-all-about-air-fryers
- https://bluejeanchef.com/cooking-school/air-fryer-cooking-charts/
- https://savorandsavvy.com/free-printable-air-fryer-times-and-temperatures/
- https://www.foodsafety.gov/food-safety-charts/safe-minimum-internal-temperatures
- https://www.cdc.gov/mmwr/volumes/71/wr/mm7148a2.htm
- Original chart source URLs are retained per record in canonical-v2.json.

## Deferred by design
- Large-scale expansion toward 400–500 recipes requires new source review, not manufactured time estimates.
- Food photography/illustrations, mobile presentation changes and extra functions (e.g. printing) wait until user experience review.
