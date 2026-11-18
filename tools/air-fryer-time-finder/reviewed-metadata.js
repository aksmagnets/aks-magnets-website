/* Reviewed corrections and safety metadata, November 2026.
   Applied after the two chart files; preserves original files for audit lineage.
   Suppresses an ambiguous pork loin entry until its 1-inch / 55-minute preparation is resolved. */
(() => {
  "use strict";
  const foods = window.AKS_AIR_FRYER_DATA;
  if (!Array.isArray(foods)) return;
  const original = foods.slice();
  const university = "https://accessibility.extension.msstate.edu/publications/nutrition-and-wellness-all-about-air-fryers";
  const chef = "https://bluejeanchef.com/cooking-school/air-fryer-cooking-charts/";
  // These specific chart rows match an identifiable published reference.
  // A cross-reference is not proof of independent food testing.
  const universityExact = new Set([1,2,8,11,12,23,24,27,28,31,32,35,36,38,39,40,42,43,44,49,51,55,57,59,65,66,67,70,71,73,78,79,85,89]);
  const chefExact = new Set([2,8,11,12,19,22,23,24,25,26,27,28,29,31,32,34,35,36,38,39,40,41,42,43,44,48,49,53,55,56,57,58,59,61,63,65,66,67,68,70,71,73,78,79,85,89]);

  const cosori = "https://cosori.com/blogs/blog/air-fryer-cooking-times";
  const ninja = "https://manuals.plus/m/02c0cdfee95e84667808070f706ac607208180f1d5f48151c1d9ebebafb54afc";
  for (const [i, food] of original.entries()) {
    const name = food.name.toLowerCase();
    const originalId = i + 1;
    if (originalId <= 100) {
      food.auditId = "AF" + String(originalId).padStart(3, "0");
      if (universityExact.has(originalId)) food.crossReference = university;
      else if (chefExact.has(originalId)) food.crossReference = chef;
      // "Cross-reference" means a corresponding food/time/temp appears in the
      // external chart; portions and exact preparations still require matching.
    }
    if (food.category === "Chicken") food.category = "Poultry";
    if (food.source === cosori) {
      food.appliance = "Cosori Iconic";
      if (food.fahrenheit > 400) food.note = "Cosori Iconic setting. Check that your air fryer supports this temperature; do not exceed its maximum.";
    }
    if (food.source === "https://airfryerkitchen.com/air-fryer-cooking-times-chart/") {
      food.sourceChecked = "2026-11-18";
      food.sourceContext = "Preheated 5–6 qt basket; single layer.";
    }
    if (food.source === "https://cooktiming.com/air-fryer-timer") {
      food.sourceChecked = "2026-11-18";
      food.sourceContext = "Baseline lookup; check preparation and doneness.";
    }
    if (food.source === cosori) food.sourceChecked = "2026-11-18";
    if (food.source === ninja) food.sourceChecked = "2026-11-18";
    if (name === "cherry tomatoes (roasted)" && food.source === ninja) {
      food.name = "Balsamic roasted cherry tomatoes";
      food.portion = "500 g cherry tomatoes; balsamic vinegar and oil";
    }
    if (name === "pork steaks (boneless)" && food.source === ninja) {
      food.name = "Honey-sage pork steaks (boneless)";
      food.portion = "2–3 steaks, 120 g each; honey, oil and sage";
    }
    if (name === "honey-glazed brussels sprouts" && food.source === ninja) {
      food.name = "Honey-hazelnut Brussels sprouts";
      food.portion = "500 g Brussels sprouts, halved; honey and hazelnuts";
    }
    if (name === "plant-based burger (ninja)" && food.source === ninja) {
      food.name = "Plant-based BBQ burgers (Ninja)";
      food.portion = "4 patties, 125 g each; BBQ sauce";
    }
    if (food.source === cosori && name === "chicken thigh (boneless 4–6 oz)") {
      food.name = "Chicken thigh (boneless, Cosori)";
      food.portion = "Boneless thigh; source does not specify a portion weight";
    }
    if (food.source === cosori && name === "lobster tail (large)") {
      food.name = "Lobster tail (Cosori)";
      food.portion = "Lobster tail; source does not specify size";
    }
    if (food.source === cosori && name === "frozen fish fillets (cosori)") {
      food.portion = "Frozen fish fillets; breading not specified";
    }
    if (food.source === "https://cooktiming.com/air-fryer-timer" && name === "acorn squash (halved)") {
      food.name = "Acorn squash (CookTiming)";
      food.portion = "Fresh squash; cut/size not specified by source";
    }
    if (food.source === ninja) {
      food.appliance = "Ninja Foodi FlexDrawer";
      food.cookingMode = "Air Fry";
      if (/^(cherry tomatoes \(roasted\)|pork steaks \(boneless\))$/i.test(name)) {
        food.cookingMode = "Roast";
        food.note = "Ninja FlexDrawer Roast program; time/temperature from the manufacturer's recipe chart.";
      }
      if (/^(frozen waffle fries|frozen popcorn chicken|frozen potato pops|frozen battered onion rings|frozen crinkle-cut fries|frozen potato wedges|frozen chicken dippers|frozen fish goujons)$/i.test(food.name)) {
        food.cookingMode = "Max Crisp";
        food.note = "Ninja FlexDrawer Max Crisp program; follow the manufacturer's setting for this mode.";
      }
      if (name === "duck breast (ninja, skin-on)") {
        food.note = "Slash skin; cook skin-side down first and turn halfway. Ninja FlexDrawer Air Fry instructions for 2 breasts (400 g total).";
      }
    }
    if (originalId === 84) {
      food.auditFlag = "Withheld: frozen meatloaf has no portion weight, meat type or product instructions.";
    }
    if (originalId === 88) {
      food.note = "Frozen pot pies vary greatly by size and brand. Cook only if the packaging permits air frying; verify the center reaches 165°F (74°C).";
      food.safeTemp = "165°F (74°C) in the center for meat-containing pot pies";
    }
    if (originalId === 31) {
      food.note = "A 6.5 lb chicken requires a sufficiently large air fryer and proper air circulation; check 165°F (74°C) internally.";
    }
    if (originalId === 1) {
      food.note = "For a 4 lb roast, time varies with shape and desired doneness. Check the center with a thermometer; do not rely on time alone.";
    }
    if (originalId === 54) {
      food.note = "The original chart lists a 1 lb batch of sugar snap peas. Check early; smaller batches may finish sooner.";
    }
    if (originalId === 43) {
      food.note = "Low-temperature kale chips: keep leaves away from the heating element and use a suitable rack if recommended by your model.";
    }
    if (/^duck breast \(skin-on\)$/i.test(food.name)) {
      food.note = "CookTiming reference for a fresh skin-on breast; not directly interchangeable with the Ninja 2-breast method.";
    }
    if (/^soft-boiled eggs \(in shell\)$/i.test(food.name)) {
      food.note = "Soft yolks do not meet the general U.S. recommendation to cook eggs until whites and yolks are firm. Higher-risk diners should avoid undercooked eggs.";
    }
    if (/^whole chicken$/i.test(food.name) && /6\.5/.test(food.portion)) {
      food.note = "Large bird: check that your air fryer can safely accommodate 6.5 lb with room for airflow.";
    }
    if (food.category === "Poultry") {
      food.safeTemp = "165°F (74°C) internal";
    } else if (food.category === "Beef" || food.category === "Pork & Lamb") {
      if (/meatballs|burger|ground|sausage|bratwurst/i.test(food.name)) {
        food.safeTemp = "160°F (71°C) internal for ground meat";
      } else if (/bacon|hot dogs|precooked|ham steak|smoked kielbasa/i.test(food.name)) {
        food.safeTemp = "Check package directions and whether the product is precooked";
      } else {
        food.safeTemp = "145°F (63°C) internal, then rest 3 minutes for whole cuts";
      }
    } else if (food.category === "Seafood") {
      if (/shrimp|prawns|lobster|scallop|calamari|crab/i.test(food.name)) {
        food.safeTemp = "Cook shellfish until opaque and fully cooked";
      } else {
        food.safeTemp = "145°F (63°C) internal for fish, or opaque and flakes easily";
      }
    } else if (food.category === "Reheating") {
      food.safeTemp = "Reheat leftovers to 165°F (74°C) internal";
    } else if (/scrambled eggs|fried eggs/i.test(food.name)) {
      food.safeTemp = "Cook egg dishes to 160°F (71°C); whole eggs until firm";
    }
    if (food.category === "Breakfast" && /sausage patties/i.test(food.name) && !/precooked/i.test(food.portion)) {
      food.safeTemp = "160°F (71°C) internal for pork/beef sausage; 165°F (74°C) for poultry sausage";
    }
    if (food.category === "Frozen Foods") {
      if (/chicken|poultry|buffalo wings|turkey|duck/i.test(food.name)) {
        food.safeTemp = "Chicken and poultry must reach 165°F (74°C) internally; do not assume frozen breaded poultry is precooked";
      } else if (/meatball|meatloaf|beef|pork|sausage/i.test(food.name)) {
        food.safeTemp = "Follow package instructions; verify safe doneness (160°F for ground beef/pork, 165°F for poultry)";
      } else if (/fish|shrimp|seafood/i.test(food.name)) {
        food.safeTemp = "Check the package and verify the required seafood cooking temperature";
      } else if (/pot pie/i.test(food.name)) {
        food.safeTemp = "Meat-containing pot pie centers must reach 165°F (74°C)";
      }
      food.note = [food.note, "Follow package directions; cooking times vary by brand and whether food is raw or fully cooked."].filter(Boolean).join(" ");
    }
  }
  // Keep ambiguous records in the audit ledger but exclude them from public results.
  for (let i = foods.length - 1; i >= 0; i--) {
    const food = foods[i];
    if ((food.name === "Pork loin" && food.portion === "1 in" && food.minutes === "55") ||
        (food.name === "Meatloaf" && food.category === "Frozen Foods" && food.portion === "Single layer")) {
      foods.splice(i, 1);
    }
  }
})();
