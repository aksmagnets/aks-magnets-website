# AKS Air Fryer Time Finder — Step 1 Data Audit
**Audit date:** 2026-11-18  
**Scope:** Existing production dataset only. No changes to displayed cooking settings in this step.  
**Master row inventory:** [217-entry CSV](air-fryer-master-audit-2026-11-18.csv) (AF001–AF217, stable IDs for review).

## Executive findings
- **217 records**, **10 categories**, **100 rows copied from AKS Magnets' existing published chart**, **117 rows added from external reference charts**.
- The CSV has **217 unique combinations of name + category + preparation**. That does **not** establish 217 unique foods or 217 independently validated cooking methods.
- No missing cooking temperature, time, or portion fields were detected by the structural audit; numbers have a parseable format.
- Original AKS rows carry **no per-row upstream third-party source citation**, only the published AKS chart. The 117 later rows have a source URL, **but the entire 117-row set has not been independently checked line by line**. This is a provenance gap, not evidence that all data are wrong.
- Sample checks against the four original reference URLs confirmed examples from each, including Cosori's high-temperature steaks, Ninja's vegetable and duck entries, CookTiming's frozen pierogies, and Air Fryer Kitchen's egg times. This is **sample validation**, not universal certification.

## Current category balance

| Category | Entries |
|---|---:|
| Vegetables | 58 |
| Frozen Foods | 44 |
| Chicken (includes duck and turkey) | 25 |
| Seafood | 22 |
| Beef | 19 |
| Pork & Lamb | 16 |
| Breads & Baking | 14 |
| Breakfast | 7 |
| Sweets | 7 |
| Reheating | 5 |
| **Total** | **217** |

## Source lineage

| Source | Count | What was audited |
|---|---:|---|
| AKS existing air-fryer guide | 100 | Counts/values match the exported guide; independent upstream evidence not included |
| Air Fryer Kitchen chart | 36 | Site and representative items checked; full row-by-row review outstanding |
| CookTiming calculator | 34 | Site and representative items checked; full row-by-row review outstanding |
| Cosori Iconic chart | 24 | Manufacturer chart and several items checked; *model-specific high temperatures* require clearer display |
| Ninja Foodi FlexDrawer quick-start guide (transcribed via Manuals+) | 23 | Multiple fresh/frozen dishes and temperatures sampled; cooking mode/load details sometimes absent from our entries |

## Priority correction queue
**P0 — Before describing all recommendations as trusted or generic**
1. **AF018, Pork loin** — original chart describes **1 in** and **55 min at 400°F**. The combination is ambiguous and may conflate thickness with a full roast. Check original product/chart and an independent source; revise size/time or temporarily withhold this recommendation. Comparison: Air Fryer Kitchen lists pork loin roast **2–2.5 lb, 360°F, 20–25 min/lb**, not a one-inch cut at 55 minutes.
2. **AF176 / AF177, New York strip and boneless ribeye** — **450°F** is *Cosori Iconic-specific*, beyond the maximum of many air fryers. The current result doesn't show that model limitation prominently.
3. **AF186, halved eggplant** — **435°F**, also from Cosori Iconic. Same appliance compatibility issue.
4. **General food safety:** The results present *estimated time* and *air fryer temperature*, but not food-specific minimum safe **internal temperatures**. Cooking time alone does not confirm doneness. Implement guidance for poultry 165°F, ground meats 160°F, beef/pork/lamb steaks & roasts 145°F plus 3-minute rest, reheated leftovers 165°F, and fish 145°F (USA FoodSafety.gov). Show appropriately per item, not as a generic cooking-temperature substitution.

**P1 — Data clarification and discoverability**
5. **AF141 versus AF217 (duck breast):** CookTiming's skin-on duck breast **380°F, 12–17 min** versus Ninja's two duck breasts (400 g total) **200°C/392°F, 30–32 min**. Both source tables are reachable, but conditions are not comparable. The Ninja chart explicitly says to score the skin, cook breast-side down, and turn halfway. We should include that preparation and the device before consumers compare numbers.
6. **AF123 / AF124 (eggs in shell):** soft and hard egg times differ as intended; safety language must not imply that a soft yolk meets the general FDA/USDA fully-firm egg recommendation. Consider clarity on pasteurized eggs and vulnerable populations.
7. **Category naming:** Rename **Chicken → Poultry** for duck and turkey records; move appropriate egg items into Breakfast and keep frozen preparations explicit.
8. **Source detail retention:** Record **food state (fresh/frozen/cooked)**, **cut/thickness**, **weight/quantity**, **manufacturer/model**, **cooking mode (Air Fry, Max Crisp, Roast, Bake)**, **shake/flip**, and **safe internal temperature** separately instead of compressing everything into “portion”.
9. **Near duplicates:** Several entries are legitimately distinct by cut/state (bacon thickness, different potato cuts, turkey and whole-chicken sizes, salmon thickness, French-fry style). Keep them *if* presentation clearly distinguishes their conditions; avoid collapsing them under one generic food name.
10. **Brand-dependent handling:** Ninja entries can require Roast or Max Crisp rather than generic Air Fry. Different modes are *not interchangeable* without validation.

## Coverage gaps ranked for the next expansion
1. **Reheating (5):** rice/pasta dishes, roasted vegetables, breaded fish, sandwiches, pastries, pizza varieties; take care with safe leftovers temperature and packaging.
2. **Breakfast (7):** hash browns, bacon variants, frittata, breakfast burritos, pancakes, toast and pastry options.
3. **Breads & Baking (14) / Sweets (7):** muffin types, quick breads, rolls, cookies, pastries, small cakes. Avoid unverified recipe-dependent exact times.
4. **Pork & Lamb (16):** more differentiated pork cuts, lamb cuts and sausages.
5. **Seafood (22):** more fish species/thicknesses and fresh/frozen versus breaded distinctions.
6. **Global/appetizer foods:** dumplings, empanadas, samosas, arepas, falafel, tofu, regional frozen snacks; distinguish manufacturer's package instructions from generic estimates.
7. **Vegetable preparations:** 58 records already, but unique cut/thickness/source distinctions need cleaning before expanding.

## Entry-by-entry review status
See the CSV file for **all 217 rows**, immutable review ID, current values, source URL, and queued review flags. **The CSV is an audit ledger, not a validated canonical recipe database.** Entries with a source URL still need exact row verification and context checks.

## Recommended next sequence
1. Resolve P0 items **before expanding quantities**; decide whether unsupported entries should be temporarily withheld or marked as model-specific.
2. Review the 117 external entries individually against their URLs, retaining actual model and cooking mode (and confirm 100 original rows' upstream provenance where possible).
3. Normalize into a structured, versioned canonical dataset with explicit source ID, row validation status, serving/preparation, appliance model and food-safety flags.
4. Then expand systematically toward 400–500 **distinct, useful, traceable preparations**, not arbitrary keyword aliases.
5. Regression test search and responsive rendering after data corrections.

## Sources checked for this audit
- [AKS source chart](https://aksmagnets.com/guides/air-fryer-cooking-times/)
- [Air Fryer Kitchen chart](https://airfryerkitchen.com/air-fryer-cooking-times-chart/)
- [CookTiming finder](https://cooktiming.com/air-fryer-timer)
- [Cosori Iconic chart](https://cosori.com/blogs/blog/air-fryer-cooking-times)
- [Ninja Foodi FlexDrawer quick-start guide](https://manuals.plus/m/02c0cdfee95e84667808070f706ac607208180f1d5f48151c1d9ebebafb54afc)
- [U.S. FoodSafety.gov safe minimum internal temperatures](https://www.foodsafety.gov/food-safety-charts/safe-minimum-internal-temperatures)

**Audit methodology:** structural validation across every record plus targeted source spot checks and review-flag screening. Source URL presence does not establish independent verification. No food was test-cooked as part of this audit.

---

## Verification and production corrections — second pass (2026-11-18)

**Status:** The original 217-entry audit inventory is preserved unchanged. **216 entries are currently displayed**: AF018 has been withheld from the user-facing finder until its preparation can be substantiated. New changes are applied through `tools/air-fryer-time-finder/reviewed-metadata.js`, leaving original transcription values in `data.js` and `expanded-data.js` available for review.

**Verified directly against original published sources**
- **AF176 and AF177, Cosori Iconic steak:** Source confirms 450°F and 6–12 minutes for 1-inch New York strip and boneless ribeye. The finder now identifies **Cosori Iconic**, **Air Fry mode**, and warns that many other appliances cannot use such a setting.
- **AF186, Cosori Iconic halved eggplant:** Source confirms 435°F, 10–18 minutes. The same brand/model warning is displayed.
- **AF217, Ninja Foodi FlexDrawer duck breast:** The Air Fry chart confirms 200°C, 30–32 minutes, for two breasts totaling about 400 g; source specifies **slash skin, cook breast-side down, flip halfway**. The finder now includes these instructions.
- **AF141, CookTiming skin-on duck breast:** Source lists fresh duck breast at 380°F for 12–17 minutes. The finder marks this as a distinct method from Ninja's two-breast chart, not a contradiction to be averaged.
- **AF018, original AKS pork loin:** Original guide shows an ambiguous 1-inch portion with 55 minutes at 400°F. A separate Air Fryer Kitchen chart uses substantially different instructions for a *2–2.5 lb boneless pork-loin roast* (360°F, 20–25 min/lb). Because the preparations are not demonstrably equivalent, **AF018 is withheld rather than fabricated or silently recalculated**.
- **Ninja program distinction:** The Ninja manual separates Air Fry from Max Crisp and Roast. Matching entries now show those modes, including cherry tomatoes and pork steaks under Roast, selected frozen foods under Max Crisp, and duck under Air Fry.
- **Safe internal temperatures:** Rechecked FoodSafety.gov categories for poultry 165°F, ground meats 160°F, whole beef/pork/lamb cuts 145°F plus 3-minute rest, fish 145°F, egg dishes 160°F, and leftovers 165°F. The finder now offers short category-appropriate guidance for many relevant entries, plus a reminder to verify doneness.

**Known limitations / remaining verification queue**
1. **117 external entries have not all been compared line-by-line with their source tables.** Completion of the targeted priority cases should not be mistaken for a finished full numerical audit.
2. The **100 original AKS entries** still lack documented independent upstream source lineage; they originate in the existing published AKS guide.
3. Some foods require per-item food safety and handling instructions that category logic cannot reliably infer (especially frozen prepared foods, eggs, ground poultry, and precooked meats).
4. Some Ninja cooking-mode classifications still deserve row-level review against the manual. Manufacturer-specific conditions should remain visible, not be generalized.
5. The finder does not accept an air-fryer model or upper-temperature limit; temperature warnings help, but do not substitute for model-specific compatibility checks.

**Next verification milestone:** Review the **remaining external rows one-by-one**, comparing name, state, portion, time, temperature, and cooking mode, then confirm or withhold uncertain values. After that, move to canonical structured-data preparation and further expansion.

---

## Full external-source table review — completed 2026-11-18

The **117 externally sourced entries** (36 Air Fryer Kitchen, 34 CookTiming, 24 Cosori Iconic, 23 Ninja Foodi FlexDrawer) have now been compared against the referenced public charts for the source food/preparation, published temperature and published time/range. **All 117 recorded time/temperature pairs match those public chart entries.** This is verification against what the websites publish, **not** independent cooking tests or proof that their recommendations are universally safe for all appliances.

The new [row-by-row verification ledger](air-fryer-source-verification-2026-11-18.csv) records all 217 original IDs with source, reference comparison status, and selected warnings. The original audit CSV remains the unmodified archival snapshot.

### Important contextual corrections made in production

- **Ninja Max Crisp (8 records):** The quick-start guide says the Max Crisp program does not require temperature adjustment. Result cards now show **Max Crisp preset** in place of a user-settable Fahrenheit/Celsius temperature. Its temperature information remains in the internal source record.
- **Ninja Roast (2 records):** “Cherry tomatoes (roasted)” is now **Balsamic roasted cherry tomatoes**, and “Pork steaks (boneless)” is now **Honey-sage pork steaks (boneless)**. Both retain Roast mode; the earlier short names omitted recipe-specific ingredients. **Honey-hazelnut Brussels sprouts** and **Plant-based BBQ burgers** have also regained preparation details.
- **Cosori Iconic:** The 24 rows match the manufacturer's settings; model information is shown. The data page does not specify an explicit Air Fry/Bake program for every chart item, so the previous blanket **Air Fry mode** label has been removed.
- **Unsupported specifics removed:** Cosori's boneless thigh chart does not prescribe a 4–6 oz weight; its lobster tail does not specify “large”; frozen fish fillets are not explicitly said to be breaded. CookTiming's acorn squash record does not specify a halved cut. Their corresponding names/preparation fields now reflect these unknowns rather than guesses.
- **Source conditions:** The Air Fryer Kitchen table assumes a **preheated 5–6 qt basket and single-layer food**; those details are retained as source metadata for later data-model work.
- **All 100 original AKS guide entries** still lack individually documented upstream provenance. One ambiguous original row (AF018 pork loin) remains withheld, leaving **216 live results**.

### What “verified” does and does not mean
- **Confirmed:** Names/preparations can be traced to the named references; published cooking-temperature and time values agree with the stored figures; sources have been compared for relevant equipment/cooking-mode caveats.
- **Not confirmed:** The source authors' own test procedures, real-world performance in other appliances, exact safety of cooking time without a thermometer, and original upstream sources for the 100 AKS entries.
- **Next step:** Establish authoritative upstream sourcing for original AKS rows where possible, identify variations that are unsafe or misleading out of context, and convert the archived row audit into a normalized versioned schema before scaling toward 400–500+ entries.
